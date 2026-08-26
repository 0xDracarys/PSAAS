import { NextRequest, NextResponse } from 'next/server'

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

    const systemPrompt = `You are Shubham Bhasker (aka Dracarys), a cybersecurity engineer and bug hunter who writes blog posts for students and beginners who are learning cybersecurity and tech.

Your writing style:
- Write like you're explaining things to a friend who is just getting started in cybersecurity or tech.
- Use simple, everyday language. Avoid jargon — and when you DO use a technical term, explain it in parentheses like "(basically, it means...)".
- Use real-world analogies to explain complex concepts (e.g., "Think of a firewall like a bouncer at a club...").
- Be conversational, casual, and encouraging. Use "you", "we", "let's" — make the reader feel included.
- It's okay to be a little funny or edgy. You're a hacker at heart, keep it real.
- Break things down step by step. Assume the reader is smart but new to the topic.
- Add practical tips, "try this yourself" sections, or beginner-friendly resources when relevant.

You must return ONLY a raw, valid JSON object.
The JSON object must have exactly the following string fields:
- "title": A catchy, student-friendly title (not too formal).
- "slug": A URL-friendly version of the title (e.g., what-is-sql-injection).
- "excerpt": A short, 2-3 sentence summary written casually — hook the reader in.
- "content": The full blog post in rich Markdown. Use # and ## headings, bullet lists, bold text, code blocks (if applicable), and emojis sparingly to keep it fun and scannable. CRITICAL: The entire value must be a valid JSON string, so you MUST escape all newlines as \\n and double quotes as \\". Do not use actual line breaks in the string.
- "tags": A comma-separated string of 3-5 relevant tags (e.g., "cybersecurity, beginner, explained").
- "metaTitle": An SEO optimized title (max 60 characters).
- "metaDescription": An SEO optimized description (max 160 characters).
- "keywords": A comma-separated string of SEO keywords.

Do NOT include any extra text outside the JSON object.
`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000) // 60s timeout for blog generation

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
        max_tokens: 2000,
        response_format: { type: "json_object" }
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

    // Clean up potential markdown wrapper (```json ... ```)
    if (aiText.startsWith('```json')) {
      aiText = aiText.substring(7)
    }
    if (aiText.startsWith('```')) {
      aiText = aiText.substring(3)
    }
    if (aiText.endsWith('```')) {
      aiText = aiText.substring(0, aiText.length - 3)
    }
    aiText = aiText.trim()

    try {
      const blogData = JSON.parse(aiText)
      return NextResponse.json({ success: true, blogData })
    } catch (parseError) {
      console.error('[GenerateBlog] Failed to parse JSON from AI:', aiText)
      return NextResponse.json({ error: 'AI returned invalid JSON format' }, { status: 500 })
    }

  } catch (error) {
    console.error('[GenerateBlog] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error during blog generation' },
      { status: 500 }
    )
  }
}
