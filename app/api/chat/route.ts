import { NextRequest, NextResponse } from "next/server"
import { chatbotService } from "@/lib/chatbot"
import { dbService } from "@/lib/database-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, message, action } = body

    if (action === 'create_session') {
      const newSessionId = chatbotService.createSession()
      const session = chatbotService.getSession(newSessionId)
      
      // Send initial greeting
      const greeting = chatbotService.processMessage(newSessionId, 'hello')
      
      return NextResponse.json({
        success: true,
        sessionId: newSessionId,
        message: greeting,
        session
      })
    }

    if (action === 'send_message') {
      if (!sessionId || !message) {
        return NextResponse.json({ error: 'Session ID and message are required' }, { status: 400 })
      }

      const botResponse = chatbotService.processMessage(sessionId, message)
      const session = chatbotService.getSession(sessionId)
      
      return NextResponse.json({
        success: true,
        message: botResponse,
        session
      })
    }

    if (action === 'quick_reply') {
      if (!sessionId || !message) {
        return NextResponse.json({ error: 'Session ID and payload are required' }, { status: 400 })
      }

      const botResponse = chatbotService.processQuickReply(sessionId, message)
      const session = chatbotService.getSession(sessionId)
      
      return NextResponse.json({
        success: true,
        message: botResponse,
        session
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (sessionId) {
      const session = chatbotService.getSession(sessionId)
      if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, session })
    }

    // Return active sessions (for admin)
    const activeSessions = chatbotService.getActiveSessions()
    return NextResponse.json({ success: true, sessions: activeSessions })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
