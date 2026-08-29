import { NextRequest, NextResponse } from 'next/server'

// Vercel Serverless Function timeout configuration
// Hobby plans max out at 60s, Pro at 300s. We set to 60s for maximum compatibility.
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json()
    const apiKey =
      process.env.NVIDIA_API_KEY ||
      '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'

    if (!apiKey) {
      return NextResponse.json({ error: 'NVIDIA_API_KEY not configured' }, { status: 500 })
    }

    const promptTopic = topic ? `Topic: ${topic}` : "Choose a recent interesting cybersecurity incident, vulnerability, or best practice."

    const systemPrompt = `You are Shubham Bhasker (aka Dracarys), a friendly, easygoing tech enthusiast who explains cybersecurity and technology to everyday people.

Your writing style:
- Your target audience is someone with ZERO tech knowledge (like a grandparent, a non-tech friend, or someone completely outside the industry).
- Write in an EXTREMELY casual, conversational, and fun tone. 
- NEVER use complex technical jargon. If you absolutely must use a tech word, you MUST explain it immediately using a simple, real-world analogy.
- Use relatable analogies for everything (e.g., "Think of a firewall like a bouncer at a club...", "A password hash is like baking a cake—you can't un-bake it to get the eggs back").
- Be engaging, encouraging, and human. Use "you", "we", and "let's".
- Do not sound like a textbook, a corporate manual, or an AI. Sound like a passionate human explaining something cool over a cup of coffee.
- Break things down step-by-step into bite-sized, easy-to-digest pieces.
- Add practical tips, "try this yourself" sections, or beginner-friendly resources when relevant.

IMPORTANT LENGTH REQUIREMENT:
- Keep the blog CONCISE and to the point. Under 500-700 words total.
- This ensures fast generation for serverless functions.
- Include a "## TL;DR" section at the top.

You must return the blog post in Markdown format with YAML frontmatter.
The frontmatter MUST contain exactly these fields:
title: A catchy, student-friendly title
slug: A URL-friendly version of the title
excerpt: A short, 2-3 sentence summary
tags: A comma-separated string of 3-5 tags
metaTitle: SEO title
metaDescription: SEO description
keywords: SEO keywords

Example format:
---
title: "Understanding SQL Injection"
slug: "understanding-sql-injection"
excerpt: "Learn how hackers use SQL injection to steal data."
tags: "cybersecurity, beginner, web-security"
metaTitle: "SQL Injection Explained"
metaDescription: "A beginner-friendly guide to SQL injection."
keywords: "sql injection, cybersecurity, hacking"
---
## TL;DR
(Your markdown content starts here...)
`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 55000) // 55s timeout (must be < 60s for Vercel Hobby)

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-8b-instruct',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: promptTopic }
        ],
        temperature: 0.7,
        max_tokens: 1500
      }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error('[GenerateBlog] NVIDIA API error:', response.status, response.statusText)
      return NextResponse.json({ error: 'Failed to generate blog from AI' }, { status: 500 })
    }

    const data = await response.json()
    let aiText = data.choices?.[0]?.message?.content?.trim() || ''

    try {
      // Simple YAML/JSON-ish parser for the required fields directly from the text
      const getField = (key: string) => {
        // Matches `key: "value"`, `key: value`, `"key": "value"`
        const regex = new RegExp(`(?:^|\\n)\\s*"?${key}"?:\\s*"?([^"\\n]+)"?`, 'i')
        const m = aiText.match(regex)
        return m ? m[1].trim() : ''
      }

      // The actual blog content usually starts with the first heading
      let contentStart = aiText.indexOf('##')
      if (contentStart === -1) contentStart = aiText.indexOf('#')
      
      const markdownContent = contentStart !== -1 ? aiText.substring(contentStart).trim() : aiText.trim()

      const blogData = {
        title: getField('title') || 'Generated Blog',
        slug: (getField('slug') || 'generated-blog').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        excerpt: getField('excerpt') || 'A new blog post.',
        tags: getField('tags'),
        metaTitle: getField('metaTitle'),
        metaDescription: getField('metaDescription'),
        keywords: getField('keywords'),
        content: markdownContent,
        featuredImage: ''
      }

      // Auto-assign a featured image using a free dynamic AI image generator
      // source.unsplash.com is deprecated, so we use Pollinations AI for high-quality thematic images without watermarks
      const imageQuery = encodeURIComponent(`${blogData.tags?.split(',')[0]?.trim() || topic || 'cybersecurity'} technology concept clean high quality no text`)
      blogData.featuredImage = `https://image.pollinations.ai/prompt/${imageQuery}?width=1200&height=630&nologo=true`

      return NextResponse.json({ success: true, blogData })
    } catch (parseError: any) {
      console.error('[GenerateBlog] Failed to parse JSON from AI:', aiText, parseError)
      return NextResponse.json({ error: 'AI returned invalid JSON format', details: aiText, parseError: parseError.message }, { status: 500 })
    }

  } catch (error: any) {
    console.error('[GenerateBlog] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error during blog generation', details: error.message },
      { status: 500 }
    )
  }
}
