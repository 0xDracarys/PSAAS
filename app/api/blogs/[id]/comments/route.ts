import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://uniqthatswhatyouare_db_user:jnjF8Db3LnHeM8DR@portfolio.oijkdkg.mongodb.net/portfolio_db?retryWrites=true&w=majority"
const MONGODB_DB = process.env.MONGODB_DB || "portfolio_db"

// ── Security Utilities ──────────────────────────────────────────
function sanitize(input: string, maxLen: number = 500): string {
  return input
    .replace(/<[^>]*>/g, '')          // Strip all HTML tags
    .replace(/javascript:/gi, '')     // Strip JS protocol
    .replace(/on\w+\s*=/gi, '')       // Strip event handlers
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '') // Strip control chars
    .trim()
    .substring(0, maxLen)
}

function isValidName(name: string): boolean {
  // Allow letters, numbers, spaces, hyphens, underscores, and common Unicode
  return /^[\p{L}\p{N}\s\-_.]{1,50}$/u.test(name)
}

// Simple rate limiting via in-memory map (per-IP, per blog)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW = 60_000 // 1 minute
const RATE_LIMIT_MAX = 5 // 5 comments per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return false
  }
  entry.count++
  return entry.count > RATE_LIMIT_MAX
}

// GET - Fetch comments for a blog post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const blogId = params.id

  const client = new MongoClient(MONGODB_URI)
  try {
    await client.connect()
    const db = client.db(MONGODB_DB)
    const comments = await db
      .collection('blog_comments')
      .find({ blogId })
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray()

    return NextResponse.json({
      success: true,
      comments: comments.map((c) => ({
        id: c._id.toString(),
        author: c.author,
        message: c.message,
        upvotes: c.upvotes || 0,
        createdAt: c.createdAt,
      })),
    })
  } catch (error) {
    console.error('[Comments API] GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  } finally {
    await client.close()
  }
}

// POST - Submit a new comment
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const blogId = params.id

  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many comments. Please wait a moment.' },
      { status: 429 }
    )
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { author, message } = body

  // Validate
  if (!author || typeof author !== 'string' || !message || typeof message !== 'string') {
    return NextResponse.json({ error: 'Author and message are required' }, { status: 400 })
  }

  const cleanAuthor = sanitize(author, 50)
  const cleanMessage = sanitize(message, 2000)

  if (!isValidName(cleanAuthor)) {
    return NextResponse.json({ error: 'Invalid name format' }, { status: 400 })
  }

  if (cleanMessage.length < 2) {
    return NextResponse.json({ error: 'Message too short' }, { status: 400 })
  }

  const client = new MongoClient(MONGODB_URI)
  try {
    await client.connect()
    const db = client.db(MONGODB_DB)

    const comment = {
      blogId,
      author: cleanAuthor,
      message: cleanMessage,
      upvotes: 0,
      createdAt: new Date(),
    }

    const result = await db.collection('blog_comments').insertOne(comment)

    return NextResponse.json({
      success: true,
      comment: {
        id: result.insertedId.toString(),
        ...comment,
      },
    })
  } catch (error) {
    console.error('[Comments API] POST error:', error)
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 })
  } finally {
    await client.close()
  }
}

// PATCH - Upvote a comment
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { commentId } = body
  if (!commentId || typeof commentId !== 'string') {
    return NextResponse.json({ error: 'commentId is required' }, { status: 400 })
  }

  const client = new MongoClient(MONGODB_URI)
  try {
    await client.connect()
    const db = client.db(MONGODB_DB)

    const result = await db.collection('blog_comments').updateOne(
      { _id: new ObjectId(commentId) },
      { $inc: { upvotes: 1 } }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Comments API] PATCH error:', error)
    return NextResponse.json({ error: 'Failed to upvote' }, { status: 500 })
  } finally {
    await client.close()
  }
}
