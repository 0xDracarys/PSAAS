'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Bot, User, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface QuickReply {
  id: string
  text: string
  payload: string
}

interface ChatCard {
  id?: string
  title: string
  description: string
  image?: string
  buttons: QuickReply[]
}

interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  type: 'text' | 'quick_reply' | 'card'
  quickReplies?: QuickReply[]
  card?: ChatCard
}

interface ChatSession {
  id: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isOpen])

  const toggleChat = () => {
    if (isOpen) {
      setIsOpen(false)
    } else if (sessionId) {
      setIsOpen(true)
    } else {
      startChat()
    }
  }

  const startChat = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_session' })
      })

      const data = await response.json()
      if (data.success) {
        setSessionId(data.sessionId)
        setMessages([data.message])
        setIsOpen(true)
      }
    } catch (error) {
      console.error('Error starting chat:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async (message: string) => {
    if (!sessionId || !message.trim()) return

    try {
      setIsLoading(true)
      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        content: message,
        sender: 'user',
        timestamp: new Date(),
        type: 'text'
      }

      setMessages(prev => [...prev, userMessage])
      setInputMessage('')

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_message',
          sessionId,
          message
        })
      })

      const data = await response.json()
      if (data.success) {
        setMessages(prev => [...prev, data.message])
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickReply = async (payload: string) => {
    if (!sessionId) return

    try {
      setIsLoading(true)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'quick_reply',
          sessionId,
          message: payload
        })
      })

      const data = await response.json()
      if (data.success) {
        setMessages(prev => [...prev, data.message])
      }
    } catch (error) {
      console.error('Error handling quick reply:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputMessage.trim()) {
      sendMessage(inputMessage)
    }
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={toggleChat}
        disabled={isLoading && !sessionId}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-primary to-accent text-white p-4 rounded-full shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isLoading && !sessionId ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[520px] bg-card/95 backdrop-blur-xl border border-primary/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-accent p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Assistant</h3>
                    <p className="text-xs text-white/80">Online now</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-primary text-white rounded-br-md'
                        : 'bg-muted/50 text-foreground rounded-bl-md border border-border/30'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.sender === 'bot' && (
                        <Bot className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                      )}
                      {message.sender === 'user' && (
                        <User className="w-4 h-4 mt-1 text-white/80 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        
                        {/* Render Card details if present */}
                        {message.card && (
                          <div className="mt-3 pt-3 border-t border-border/40 space-y-2">
                            <h4 className="font-medium text-xs text-primary">{message.card.title}</h4>
                            <p className="text-xs text-muted-foreground">{message.card.description}</p>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {message.card.buttons?.map((btn) => (
                                <button
                                  key={btn.id || btn.payload}
                                  onClick={() => handleQuickReply(btn.payload)}
                                  disabled={isLoading}
                                  className="text-xs bg-primary/20 hover:bg-primary/40 text-primary border border-primary/30 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                                >
                                  {btn.text}
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <p className="text-[10px] opacity-60 mt-1.5 text-right">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Render Quick Replies if present */}
                  {message.sender === 'bot' && message.quickReplies && message.quickReplies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                      {message.quickReplies.map((qr) => (
                        <button
                          key={qr.id || qr.payload}
                          onClick={() => handleQuickReply(qr.payload)}
                          disabled={isLoading}
                          className="text-xs bg-background/80 hover:bg-primary/20 border border-primary/40 text-primary px-3 py-1.5 rounded-full transition-all duration-200 shadow-sm"
                        >
                          {qr.text}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-muted/50 text-foreground p-3 rounded-2xl rounded-bl-md border border-border/30">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-primary" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 border-t border-border/30 bg-card/50">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-muted/50 border border-border/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-primary text-white p-2 rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

