export interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  type: 'text' | 'quick_reply' | 'card'
  quickReplies?: QuickReply[]
  card?: ChatCard
}

export interface QuickReply {
  id: string
  text: string
  payload: string
}

export interface ChatCard {
  id: string
  title: string
  description: string
  image?: string
  buttons: QuickReply[]
}

export interface ChatSession {
  id: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

export class ChatbotService {
  private sessions: Map<string, ChatSession> = new Map()
  private responses: Map<string, any> = new Map()

  constructor() {
    this.initializeResponses()
  }

  private initializeResponses() {
    this.responses.set('greeting', {
      message: "Hello! I'm your AI assistant. How can I help you today?",
      quickReplies: [
        { id: 'services', text: 'View Services', payload: 'services' },
        { id: 'portfolio', text: 'See Portfolio', payload: 'portfolio' },
        { id: 'contact', text: 'Contact Info', payload: 'contact' },
        { id: 'pricing', text: 'Pricing', payload: 'pricing' }
      ]
    })

    this.responses.set('services', {
      message: "Here are the services I offer:",
      card: {
        id: 'card_services',
        title: "My Services",
        description: "Comprehensive tech solutions for your business",
        buttons: [
          { id: 'web_dev', text: 'Web Development', payload: 'web_dev' },
          { id: 'cyber_security', text: 'Cybersecurity', payload: 'cyber_security' },
          { id: 'consulting', text: 'Tech Consulting', payload: 'consulting' },
          { id: 'maintenance', text: 'Maintenance', payload: 'maintenance' }
        ]
      }
    })

    this.responses.set('portfolio', {
      message: "Check out my latest projects and achievements:",
      card: {
        id: 'card_portfolio',
        title: "Portfolio Highlights",
        description: "Recent work showcasing my expertise",
        buttons: [
          { id: 'view_projects', text: 'View Projects', payload: 'view_projects' },
          { id: 'download_cv', text: 'Download CV', payload: 'download_cv' },
          { id: 'github', text: 'GitHub Profile', payload: 'github' }
        ]
      }
    })

    this.responses.set('contact', {
      message: "Get in touch with me:",
      card: {
        id: 'card_contact',
        title: "Contact Information",
        description: "Multiple ways to reach me",
        buttons: [
          { id: 'email', text: 'Email Me', payload: 'email' },
          { id: 'phone', text: 'Call Me', payload: 'phone' },
          { id: 'linkedin', text: 'LinkedIn', payload: 'linkedin' },
          { id: 'schedule', text: 'Schedule Call', payload: 'schedule' }
        ]
      }
    })

    this.responses.set('pricing', {
      message: "Here's my pricing structure:",
      card: {
        id: 'card_pricing',
        title: "Pricing Plans",
        description: "Flexible pricing for different needs",
        buttons: [
          { id: 'basic_plan', text: 'Basic Plan', payload: 'basic_plan' },
          { id: 'premium_plan', text: 'Premium Plan', payload: 'premium_plan' },
          { id: 'enterprise', text: 'Enterprise', payload: 'enterprise' },
          { id: 'custom_quote', text: 'Custom Quote', payload: 'custom_quote' }
        ]
      }
    })

    this.responses.set('web_dev', {
      message: "Web Development Services:\n\n• Full-Stack Development (React, Node.js, Next.js)\n• Responsive Design\n• E-commerce Solutions\n• API Development\n• Database Design\n• Performance Optimization\n\nStarting from $50/hour",
      quickReplies: [
        { id: 'get_quote', text: 'Get Quote', payload: 'get_quote' },
        { id: 'view_samples', text: 'View Samples', payload: 'view_samples' },
        { id: 'back', text: 'Back to Services', payload: 'services' }
      ]
    })

    this.responses.set('cyber_security', {
      message: "Cybersecurity Services:\n\n• Penetration Testing\n• Vulnerability Assessment\n• Security Audits\n• Incident Response\n• Security Training\n• Compliance Consulting\n\nStarting from $75/hour",
      quickReplies: [
        { id: 'get_quote', text: 'Get Quote', payload: 'get_quote' },
        { id: 'security_audit', text: 'Security Audit', payload: 'security_audit' },
        { id: 'back', text: 'Back to Services', payload: 'services' }
      ]
    })

    this.responses.set('consulting', {
      message: "Tech Consulting Services:\n\n• Technology Strategy\n• Digital Transformation\n• System Architecture\n• Process Optimization\n• Team Training\n• Project Management\n\nStarting from $100/hour",
      quickReplies: [
        { id: 'get_quote', text: 'Get Quote', payload: 'get_quote' },
        { id: 'consultation', text: 'Free Consultation', payload: 'consultation' },
        { id: 'back', text: 'Back to Services', payload: 'services' }
      ]
    })

    this.responses.set('get_quote', {
      message: "I'd be happy to provide a quote! Please tell me:\n\n1. What type of project?\n2. Timeline?\n3. Budget range?\n4. Any specific requirements?\n\nOr would you prefer to schedule a call to discuss?",
      quickReplies: [
        { id: 'schedule_call', text: 'Schedule Call', payload: 'schedule_call' },
        { id: 'email_details', text: 'Email Details', payload: 'email_details' },
        { id: 'back', text: 'Back', payload: 'services' }
      ]
    })

    this.responses.set('schedule_call', {
      message: "Great! I'm available for calls. Here are some options:",
      card: {
        id: 'card_schedule',
        title: "Schedule a Call",
        description: "Choose a convenient time",
        buttons: [
          { id: 'calendly', text: 'Book via Calendly', payload: 'calendly' },
          { id: 'whatsapp', text: 'WhatsApp Call', payload: 'whatsapp' },
          { id: 'zoom', text: 'Zoom Meeting', payload: 'zoom' }
        ]
      }
    })

    this.responses.set('email', {
      message: "📧 Email: shubham@example.com\n\nI typically respond within 2-4 hours during business hours.",
      quickReplies: [
        { id: 'compose_email', text: 'Compose Email', payload: 'compose_email' },
        { id: 'back', text: 'Back to Contact', payload: 'contact' }
      ]
    })

    this.responses.set('phone', {
      message: "📞 Phone: +370-612-34567\n\nAvailable for calls 9 AM - 6 PM (EET)",
      quickReplies: [
        { id: 'call_now', text: 'Call Now', payload: 'call_now' },
        { id: 'back', text: 'Back to Contact', payload: 'contact' }
      ]
    })

    this.responses.set('linkedin', {
      message: "🔗 LinkedIn: linkedin.com/in/shubhambhasker\n\nConnect with me for professional updates!",
      quickReplies: [
        { id: 'open_linkedin', text: 'Open LinkedIn', payload: 'open_linkedin' },
        { id: 'back', text: 'Back to Contact', payload: 'contact' }
      ]
    })

    this.responses.set('github', {
      message: "💻 GitHub: github.com/0xDracarys\n\nCheck out my open source contributions!",
      quickReplies: [
        { id: 'open_github', text: 'Open GitHub', payload: 'open_github' },
        { id: 'back', text: 'Back to Portfolio', payload: 'portfolio' }
      ]
    })

    this.responses.set('default', {
      message: "I'm not sure I understand. Could you please rephrase or choose from the options below?",
      quickReplies: [
        { id: 'services', text: 'Services', payload: 'services' },
        { id: 'portfolio', text: 'Portfolio', payload: 'portfolio' },
        { id: 'contact', text: 'Contact', payload: 'contact' },
        { id: 'help', text: 'Help', payload: 'help' }
      ]
    })
  }

  createSession(): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const session: ChatSession = {
      id: sessionId,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    }
    
    this.sessions.set(sessionId, session)
    return sessionId
  }

  getSession(sessionId: string): ChatSession | null {
    return this.sessions.get(sessionId) || null
  }

  addMessage(
    sessionId: string,
    content: string,
    sender: 'user' | 'bot',
    type: 'text' | 'quick_reply' | 'card' = 'text',
    quickReplies?: QuickReply[],
    card?: ChatCard
  ): ChatMessage {
    const session = this.sessions.get(sessionId)
    if (!session) throw new Error('Session not found')

    const message: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content,
      sender,
      timestamp: new Date(),
      type,
      quickReplies,
      card
    }

    session.messages.push(message)
    session.updatedAt = new Date()
    
    return message
  }

  async queryNvidiaAI(userMessage: string, history: ChatMessage[] = []): Promise<string | null> {
    const apiKey =
      process.env.NVIDIA_API_KEY ||
      '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'
    if (!apiKey) return null

    try {
      const messagesPayload = [
        {
          role: 'system',
          content: `You are the AI Assistant for Shubham Bhasker's professional portfolio website (Dracarys).
YOUR PRIMARY GOAL is to ONLY discuss Shubham's career, services, skills, cybersecurity, and portfolio projects. 
CRITICAL RULE: Under NO circumstances should you answer questions about general knowledge, programming help unrelated to Shubham, cooking, politics, or any topic outside of professional networking, hiring, or cybersecurity topics. If asked about unrelated topics, politely decline and steer the conversation back to Shubham's expertise.
About Shubham Bhasker:
- Role: Cybersecurity Engineer, Penetration Tester, and Tech Escalations Specialist.
- Current position: Customer Success & Tier 2 Technical Escalations at CyberCare (NordVPN) handling VPN protocols (NordLynx, OpenVPN), networking protocols (TCP/IP), log diagnostics, and API troubleshooting.
- Security achievements: Top 300 globally on Bugcrowd, specialized in Broken Authentication, IDOR, and logic fault discovery.
- Technical skills: Python, Bash, Node.js, Next.js, React, Linux, Postman/cURL, Metasploit, Burp Suite, Network diagnostics.
- Contact: shubhambhaskr123@gmail.com, Phone: +370 63979268, Location: Vilnius / Kaunas, Lithuania.
- Personality: Cyber-savvy, professional, direct, concise, and helpful. Keep responses concise (under 2-3 short paragraphs).`
        },
        ...history.slice(-6).map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.content
        })),
        {
          role: 'user',
          content: userMessage
        }
      ]

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)

      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'meta/llama-3.1-8b-instruct',
          messages: messagesPayload,
          temperature: 0.5,
          max_tokens: 300
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        return data.choices?.[0]?.message?.content?.trim() || null
      }
      return null
    } catch (err) {
      console.warn('[Chatbot] NVIDIA AI query error:', err)
      return null
    }
  }

  async processMessage(sessionId: string, userMessage: string): Promise<ChatMessage> {
    const session = this.sessions.get(sessionId)
    if (!session) throw new Error('Session not found')

    // Add user message
    this.addMessage(sessionId, userMessage, 'user')

    // First try NVIDIA AI for natural conversation
    const nvidiaReply = await this.queryNvidiaAI(userMessage, session.messages)

    if (nvidiaReply) {
      return this.addMessage(
        sessionId,
        nvidiaReply,
        'bot',
        'quick_reply',
        [
          { id: 'services', text: 'View Services', payload: 'services' },
          { id: 'portfolio', text: 'See Portfolio', payload: 'portfolio' },
          { id: 'contact', text: 'Contact Info', payload: 'contact' }
        ]
      )
    }

    // Fallback to keyword-based response generator
    const response = this.generateResponse(userMessage)
    
    // Add bot response with quickReplies and card payload
    const botMessage = this.addMessage(
      sessionId,
      response.message,
      'bot',
      response.card ? 'card' : (response.quickReplies ? 'quick_reply' : 'text'),
      response.quickReplies,
      response.card
    )

    return botMessage
  }

  private generateResponse(userMessage: string): any {
    const message = userMessage.toLowerCase().trim()
    
    // Check for specific keywords (prioritized from most specific to least)
    // Greetings
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return this.responses.get('greeting')
    }
    
    // Service inquiries (check specific services first to avoid overlap)
    if (message.includes('web') && (message.includes('dev') || message.includes('website') || message.includes('development'))) {
      return this.responses.get('web_dev')
    }
    
    if (message.includes('security') || message.includes('cyber') || message.includes('penetration') || message.includes('hack')) {
      return this.responses.get('cyber_security')
    }
    
    if (message.includes('service') || message.includes('what do you do')) {
      return this.responses.get('services')
    }
    
    // Portfolio & Projects
    if (message.includes('portfolio') || message.includes('project') || message.includes('work')) {
      return this.responses.get('portfolio')
    }
    
    // Pricing
    if (message.includes('price') || message.includes('cost') || message.includes('rate') || message.includes('pricing')) {
      return this.responses.get('pricing')
    }
    
    // Quote & Consulting
    if (message.includes('quote') || message.includes('estimate')) {
      return this.responses.get('get_quote')
    }
    
    if (message.includes('consult') || message.includes('advice')) {
      return this.responses.get('consulting')
    }
    
    // Scheduling (check before generic 'call' to avoid conflict with phone)
    if (message.includes('schedule') || message.includes('meeting') || message.includes('book')) {
      return this.responses.get('schedule_call')
    }
    
    // Contact info
    if (message.includes('contact') || message.includes('reach')) {
      return this.responses.get('contact')
    }
    
    // Specific contact methods
    if (message.includes('email') || message.includes('mail')) {
      return this.responses.get('email')
    }
    
    if (message.includes('phone') && !message.includes('contact')) {
      return this.responses.get('phone')
    }
    
    if (message.includes('linkedin')) {
      return this.responses.get('linkedin')
    }
    
    if (message.includes('github') || message.includes('code')) {
      return this.responses.get('github')
    }
    
    // Default response
    return this.responses.get('default')
  }

  processQuickReply(sessionId: string, payload: string): ChatMessage {
    const session = this.sessions.get(sessionId)
    if (!session) throw new Error('Session not found')

    // Add user's quick reply choice as a user message
    const quickReplyLabel = this.getQuickReplyLabel(payload)
    this.addMessage(sessionId, quickReplyLabel, 'user', 'quick_reply')

    // Get response for this payload
    const response = this.responses.get(payload)
    if (!response) {
      return this.addMessage(sessionId, "I'm not sure what you're looking for. How can I help?", 'bot')
    }
    
    return this.addMessage(
      sessionId,
      response.message,
      'bot',
      response.card ? 'card' : (response.quickReplies ? 'quick_reply' : 'text'),
      response.quickReplies,
      response.card
    )
  }

  private getQuickReplyLabel(payload: string): string {
    const labels: { [key: string]: string } = {
      'services': 'View Services',
      'portfolio': 'See Portfolio',
      'contact': 'Contact Info',
      'pricing': 'Pricing',
      'web_dev': 'Web Development',
      'cyber_security': 'Cybersecurity',
      'consulting': 'Tech Consulting',
      'maintenance': 'Maintenance',
      'view_projects': 'View Projects',
      'download_cv': 'Download CV',
      'github': 'GitHub Profile',
      'email': 'Email Me',
      'phone': 'Call Me',
      'linkedin': 'LinkedIn',
      'schedule': 'Schedule Call',
      'basic_plan': 'Basic Plan',
      'premium_plan': 'Premium Plan',
      'enterprise': 'Enterprise',
      'custom_quote': 'Custom Quote',
      'get_quote': 'Get Quote',
      'view_samples': 'View Samples',
      'back': 'Back',
      'security_audit': 'Security Audit',
      'consultation': 'Free Consultation',
      'schedule_call': 'Schedule Call',
      'email_details': 'Email Details',
      'calendly': 'Book via Calendly',
      'whatsapp': 'WhatsApp Call',
      'zoom': 'Zoom Meeting',
      'compose_email': 'Compose Email',
      'call_now': 'Call Now',
      'open_linkedin': 'Open LinkedIn',
      'open_github': 'Open GitHub'
    }
    return labels[payload] || payload
  }

  getActiveSessions(): ChatSession[] {
    return Array.from(this.sessions.values()).filter(session => session.isActive)
  }

  endSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId)
    if (!session) return false
    
    session.isActive = false
    session.updatedAt = new Date()
    return true
  }
}

// Export singleton instance
export const chatbotService = new ChatbotService()

