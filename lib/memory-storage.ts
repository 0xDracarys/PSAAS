// In-memory storage fallback when MongoDB is not available
// This is for development purposes only

export interface MemoryClientRequest {
  _id: string
  name: string
  email: string
  phone: string
  projectType: string
  requirements: string
  budget: string
  timeline: string
  referenceLinks?: string[]
  files?: string[]
  acceptedTerms: boolean
  paymentTerms: string
  createdAt: Date
  status: "pending" | "reviewed" | "approved" | "rejected"
}

export interface MemoryProject {
  _id: string
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  github: string
  demo: string
  features: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  // Admin dashboard specific fields
  client: string
  status: "completed" | "in-progress" | "pending"
  budget: number
  startDate: string
  endDate: string
  progress: number
}

export interface MemoryAdminUser {
  _id: string
  username: string
  email: string
  passwordHash: string
  role: "admin" | "user"
  createdAt: Date
  lastLogin?: Date
}

export interface MemoryWebsiteSettings {
  _id: string
  profile: {
    name: string
    title: string
    bio: string
    location: string
    email: string
    phone: string
    profileImage: string
    coverImage: string
  }
  experience: Array<{
    year: string
    title: string
    company: string
    description: string
  }>
  skills: Array<{
    name: string
    level: number
  }>
  socialLinks: Array<{
    icon: string
    label: string
    href: string
    color: string
  }>
  personalInterests: Array<{
    icon: string
    title: string
    description: string
    color: string
  }>
  musicTracks: Array<{
    title: string
    description: string
    duration: string
    genre: string
  }>
  contactInfo: Array<{
    icon: string
    label: string
    value: string
    href: string
    description: string
  }>
  updatedAt: Date
}

// In-memory storage
let clientRequests: MemoryClientRequest[] = []
let projects: MemoryProject[] = []
let adminUsers: MemoryAdminUser[] = []
let websiteSettings: MemoryWebsiteSettings[] = []
let blogs: any[] = []

// Sample data
const sampleClientRequests: MemoryClientRequest[] = [
  {
    _id: "req_1",
    name: "Alexandra Petrov",
    email: "alexandra.petrov@techstartup.lt",
    phone: "+370-612-34567",
    projectType: "Web Application Security Audit",
    requirements: "We need a comprehensive security assessment for our new fintech web application. Looking for penetration testing, vulnerability scanning, and security recommendations. Our app handles sensitive financial data and needs to be PCI DSS compliant.",
    budget: "€3000-€5000",
    timeline: "2-3 months",
    referenceLinks: ["https://owasp.org", "https://pci-dss.com"],
    files: [],
    acceptedTerms: true,
    paymentTerms: "30% upfront payment required",
    status: "pending",
    createdAt: new Date("2024-12-18"),
  },
  {
    _id: "req_2",
    name: "Marcus Johnson",
    email: "marcus.johnson@university.edu",
    phone: "+1-555-0456",
    projectType: "Student Management System",
    requirements: "Looking to develop a modern student management system for our university. Need features for enrollment, course management, grade tracking, and academic analytics. Should integrate with existing university systems.",
    budget: "€5000-€8000",
    timeline: "4-6 months",
    referenceLinks: ["https://canvas.instructure.com", "https://blackboard.com"],
    files: [],
    acceptedTerms: true,
    paymentTerms: "25% upfront payment required",
    status: "approved",
    createdAt: new Date("2024-12-15"),
  },
  {
    _id: "req_3",
    name: "Elena Rodriguez",
    email: "elena.rodriguez@startup.com",
    phone: "+34-612-987654",
    projectType: "E-commerce Platform",
    requirements: "Building a new e-commerce platform for sustainable products. Need full-stack development with modern UI/UX, payment integration, inventory management, and admin dashboard. Focus on performance and user experience.",
    budget: "€4000-€7000",
    timeline: "3-5 months",
    referenceLinks: ["https://shopify.com", "https://stripe.com"],
    files: [],
    acceptedTerms: true,
    paymentTerms: "20% upfront payment required",
    status: "reviewed",
    createdAt: new Date("2024-12-12"),
  },
  {
    _id: "req_4",
    name: "David Chen",
    email: "david.chen@localbusiness.lt",
    phone: "+370-612-11111",
    projectType: "Sports Tournament Management",
    requirements: "Need a web application for managing table tennis tournaments at our local sports club. Should handle registration, bracket generation, real-time scoring, and player statistics. Mobile-friendly interface is important.",
    budget: "€800-€1500",
    timeline: "1-2 months",
    referenceLinks: ["https://challonge.com", "https://tournamentbracket.com"],
    files: [],
    acceptedTerms: true,
    paymentTerms: "50% upfront payment required",
    status: "approved",
    createdAt: new Date("2024-11-20"),
  },
  {
    _id: "req_5",
    name: "Sophie Anderson",
    email: "sophie.anderson@consulting.com",
    phone: "+44-712-345678",
    projectType: "Portfolio Website",
    requirements: "Looking for a modern, professional portfolio website to showcase my consulting work. Need clean design, project galleries, contact forms, and blog functionality. Should reflect my expertise in business strategy.",
    budget: "€1200-€2500",
    timeline: "1-2 months",
    referenceLinks: ["https://squarespace.com", "https://wix.com"],
    files: [],
    acceptedTerms: true,
    paymentTerms: "40% upfront payment required",
    status: "pending",
    createdAt: new Date("2024-12-20"),
  },
]

const sampleProjects: MemoryProject[] = [
  {
    _id: "proj_1",
    id: "proj_1",
    title: "Cybersecurity Portfolio Platform",
    description: "A comprehensive portfolio website showcasing cybersecurity expertise, projects, and achievements. Built with Next.js 14, featuring 3D animations, glassmorphism design, and admin dashboard for project management.",
    image: "/cybersecurity-vulnerability-assessment-dashboard-w.jpg",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "3D Graphics", "MongoDB"],
    github: "https://github.com/0xDracarys/portfolio",
    demo: "https://shubhambhasker.vercel.app",
    features: [
      "Interactive 3D hero section",
      "Project showcase with live demos",
      "Client request management system",
      "Admin dashboard with analytics",
      "Responsive glassmorphism design",
    ],
    isActive: true,
    createdAt: new Date("2024-11-01"),
    updatedAt: new Date("2024-12-20"),
    // Admin dashboard fields
    client: "Personal Branding",
    status: "completed",
    budget: 0,
    startDate: "2024-11-01",
    endDate: "2024-12-20",
    progress: 100,
  },
  {
    _id: "proj_2",
    id: "proj_2",
    title: "TryHackMe Progress Tracker",
    description: "Automated tracking system for TryHackMe learning progress with advanced analytics, leaderboard monitoring, and achievement visualization. Achieved Top 5 ranking in Lithuania.",
    image: "/tryhackme-progress-tracker-with-leaderboard-and-st.jpg",
    tags: ["Python", "Selenium", "FastAPI", "Data Analysis", "Automation"],
    github: "https://github.com/0xDracarys/tryhackme-tracker",
    demo: "https://tryhackme.com/p/ShubhamBhasker",
    features: [
      "Automated progress tracking",
      "Leaderboard position monitoring",
      "Performance analytics dashboard",
      "Goal setting and reminders",
      "Achievement badge system",
    ],
    isActive: true,
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-11-15"),
    // Admin dashboard fields
    client: "Personal Learning",
    status: "completed",
    budget: 0,
    startDate: "2024-03-10",
    endDate: "2024-06-10",
    progress: 100,
  },
  {
    _id: "proj_3",
    id: "proj_3",
    title: "E-commerce Security Audit",
    description: "Comprehensive security assessment for an e-commerce platform including penetration testing, vulnerability scanning, and security recommendations. Identified and fixed critical security flaws.",
    image: "/ecommerce-security-audit.jpg",
    tags: ["Security", "Penetration Testing", "OWASP", "Web Security", "Report Generation"],
    github: "https://github.com/0xDracarys/ecommerce-audit",
    demo: "https://security-audit-demo.netlify.app",
    features: [
      "OWASP Top 10 vulnerability testing",
      "SQL injection and XSS testing",
      "Authentication bypass attempts",
      "Security report generation",
      "Remediation recommendations",
    ],
    isActive: true,
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date("2024-12-01"),
    // Admin dashboard fields
    client: "ShopSecure Inc",
    status: "completed",
    budget: 4500,
    startDate: "2024-08-01",
    endDate: "2024-10-15",
    progress: 100,
  },
  {
    _id: "proj_4",
    id: "proj_4",
    title: "University Student Management System",
    description: "Full-stack web application for managing university students, courses, and academic records. Features role-based access control, grade management, and academic analytics.",
    image: "/university-management-system.jpg",
    tags: ["React", "Node.js", "MongoDB", "Express", "JWT Authentication"],
    github: "https://github.com/0xDracarys/university-management",
    demo: "https://university-management-demo.netlify.app",
    features: [
      "Student enrollment management",
      "Course scheduling system",
      "Grade tracking and analytics",
      "Role-based access control",
      "Academic report generation",
    ],
    isActive: true,
    createdAt: new Date("2024-09-15"),
    updatedAt: new Date("2024-12-10"),
    // Admin dashboard fields
    client: "Vilnius University",
    status: "in-progress",
    budget: 6800,
    startDate: "2024-09-15",
    endDate: "2025-02-15",
    progress: 65,
  },
  {
    _id: "proj_5",
    id: "proj_5",
    title: "Table Tennis Tournament Manager",
    description: "Web application for managing table tennis tournaments with real-time scoring, bracket generation, and player statistics. Built for local sports club management.",
    image: "/table-tennis-tournament.jpg",
    tags: ["Vue.js", "Firebase", "Real-time", "Sports Management", "Statistics"],
    github: "https://github.com/0xDracarys/table-tennis-manager",
    demo: "https://table-tennis-tournament.netlify.app",
    features: [
      "Tournament bracket generation",
      "Real-time score tracking",
      "Player statistics dashboard",
      "Match scheduling system",
      "Results and rankings",
    ],
    isActive: true,
    createdAt: new Date("2024-10-01"),
    updatedAt: new Date("2024-12-05"),
    // Admin dashboard fields
    client: "Local Sports Club",
    status: "completed",
    budget: 1200,
    startDate: "2024-10-01",
    endDate: "2024-11-30",
    progress: 100,
  },
]

const sampleAdminUsers: MemoryAdminUser[] = [
  {
    _id: "admin_1",
    username: "admin",
    email: "admin@portfolio.com",
    passwordHash: "$2b$12$HqEovANG3fK8dgXQtc9lUOgLJBVUurCsQ8AfeA/BqZab7doInB0qq", // admin123
    role: "admin",
    createdAt: new Date(),
  },
]

const sampleWebsiteSettings: MemoryWebsiteSettings[] = [
  {
    _id: "settings_1",
    profile: {
      name: "Shubham Bhasker",
      title: "Cybersecurity Expert & Full-Stack Developer",
      bio: "Passionate cybersecurity professional with expertise in vulnerability assessment, penetration testing, and secure web development. Currently serving as Customer Success Manager at CyberCare, helping organizations strengthen their security posture.",
      location: "Kaunas, Lithuania",
      email: "shubham@example.com",
      phone: "+370-612-34567",
      profileImage: "/placeholder-user.jpg",
      coverImage: "/hero-img.jpeg",
    },
    experience: [
      {
        year: "2024 - Present",
        title: "Customer Success Manager",
        company: "CyberCare",
        description: "Leading customer success initiatives and security program optimization for enterprise clients.",
      },
      {
        year: "2023 - 2024",
        title: "Security Researcher",
        company: "Freelance",
        description: "Conducted security assessments and vulnerability research for various organizations.",
      },
      {
        year: "2022 - 2023",
        title: "Full-Stack Developer",
        company: "Tech Solutions Ltd",
        description: "Developed secure web applications and implemented security best practices.",
      },
      {
        year: "2018",
        title: "Bachelor's in Science",
        company: "Siddhi Vinayak Group",
        description: "Completed foundational studies in computer science and information systems.",
      },
    ],
    skills: [
      { name: "Cybersecurity & Penetration Testing", level: 90 },
      { name: "Web Application Security", level: 85 },
      { name: "Full-Stack Development (React, Node.js)", level: 80 },
      { name: "Bug Hunting & Vulnerability Assessment", level: 80 },
      { name: "Customer Success Management", level: 85 },
      { name: "Network Security & SIEM/SOAR", level: 75 },
      { name: "Python & Bash Scripting", level: 80 },
      { name: "Cloud Security (AWS/Azure)", level: 70 },
    ],
    socialLinks: [
      {
        icon: "Github",
        label: "GitHub",
        href: "https://github.com/0xDracarys",
        color: "hover:text-gray-400",
      },
      {
        icon: "Linkedin",
        label: "LinkedIn",
        href: "https://linkedin.com/in/shubhambhasker",
        color: "hover:text-blue-400",
      },
      {
        icon: "Mail",
        label: "Email",
        href: "mailto:shubham@example.com",
        color: "hover:text-red-400",
      },
      {
        icon: "Shield",
        label: "Bugcrowd",
        href: "https://bugcrowd.com/0xDracarys",
        color: "hover:text-red-400",
      },
    ],
    personalInterests: [
      {
        icon: "Shield",
        title: "Table Tennis",
        description: "Competitive table tennis player with regional tournament experience.",
        color: "text-primary",
      },
      {
        icon: "Camera",
        title: "Photography",
        description: "Passionate about capturing moments and exploring different photography techniques.",
        color: "text-secondary",
      },
      {
        icon: "Music",
        title: "Music Production",
        description: "Creating electronic music and experimenting with sound design.",
        color: "text-primary",
      },
      {
        icon: "Coffee",
        title: "Coffee Brewing",
        description: "I like making coffee and experimenting with different brewing methods.",
        color: "text-secondary",
      },
    ],
    musicTracks: [
      {
        title: "Digital Dreams",
        description: "An electronic journey through the digital realm",
        duration: "4:32",
        genre: "Electronic",
      },
      {
        title: "Code & Strings",
        description: "A melodic journey through the intersection of music and technology",
        duration: "5:23",
        genre: "Progressive",
      },
    ],
    contactInfo: [
      {
        icon: "Mail",
        label: "Email",
        value: "shubham@example.com",
        href: "mailto:shubham@example.com",
        description: "Send me an email anytime",
      },
      {
        icon: "Phone",
        label: "Phone",
        value: "+370-612-34567",
        href: "tel:+37061234567",
        description: "Call me for urgent matters",
      },
      {
        icon: "MapPin",
        label: "Location",
        value: "Kaunas, Lithuania",
        href: "#",
        description: "Available for local meetings",
      },
    ],
    updatedAt: new Date(),
  },
]

// Initialize with sample data only if no data exists
// This ensures we don't overwrite existing data on server restart
if (clientRequests.length === 0) {
  clientRequests = [...sampleClientRequests]
}
if (projects.length === 0) {
  projects = [...sampleProjects]
}
if (adminUsers.length === 0) {
  adminUsers = [...sampleAdminUsers]
}
if (websiteSettings.length === 0) {
  websiteSettings = [...sampleWebsiteSettings]
}

// No localStorage - everything stored on server only

// Server-side persistence using file system
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

const DATA_FILE = join(process.cwd(), 'data', 'portfolio-data.json')

// Load data from file on server startup
if (typeof window === 'undefined' && existsSync(DATA_FILE)) {
  try {
    const fileData = JSON.parse(readFileSync(DATA_FILE, 'utf8'))
    
    // Convert date strings back to Date objects
    if (fileData.projects) {
      projects = fileData.projects.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt)
      }))
    }
    if (fileData.clientRequests) {
      clientRequests = fileData.clientRequests.map((r: any) => ({
        ...r,
        createdAt: new Date(r.createdAt),
        updatedAt: new Date(r.updatedAt)
      }))
    }
    if (fileData.adminUsers) {
      adminUsers = fileData.adminUsers.map((u: any) => ({
        ...u,
        createdAt: new Date(u.createdAt)
      }))
    }
    if (fileData.websiteSettings) {
      websiteSettings = fileData.websiteSettings.map((s: any) => ({
        ...s,
        updatedAt: new Date(s.updatedAt)
      }))
    }
    console.log('✅ Loaded data from file system')
  } catch (error) {
    console.error('Error loading data from file:', error)
  }
}

export class MemoryDatabaseService {
  private shouldPersistToFile = true

  // Disable file persistence (for fallback mode)
  disableFilePersistence() {
    this.shouldPersistToFile = false
  }

  // Save data to file system (server-side only)
  private saveToFileSystem() {
    if (!this.shouldPersistToFile) return
    const data = {
      projects,
      clientRequests,
      adminUsers,
      websiteSettings,
      themes,
      themeHistory,
      blogs
    }

    // Save to file system (server-side only)
    try {
      const fs = require('fs')
      const path = require('path')
      const dataDir = path.join(process.cwd(), 'data')
      
      // Create data directory if it doesn't exist
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
      }
      
      const dataFile = path.join(dataDir, 'portfolio-data.json')
      fs.writeFileSync(dataFile, JSON.stringify(data, null, 2))
      console.log('✅ Data saved to server file system')
    } catch (error) {
      console.error('Error saving data to file system:', error)
    }
  }

  // Client Requests operations
  async createClientRequest(request: Omit<MemoryClientRequest, "_id" | "createdAt" | "status">): Promise<string> {
    const requestId = `req_${Date.now()}`
    const newRequest: MemoryClientRequest = {
      ...request,
      _id: requestId,
      id: requestId, // Also set id for compatibility
      createdAt: new Date(),
      status: "pending",
    }
    clientRequests.push(newRequest)
    this.saveToFileSystem()
    return requestId
  }

  async getClientRequests(limit = 50, skip = 0): Promise<MemoryClientRequest[]> {
    return clientRequests
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(skip, skip + limit)
  }

  async updateClientRequestStatus(id: string, status: MemoryClientRequest["status"]): Promise<boolean> {
    const request = clientRequests.find(req => req._id === id)
    if (request) {
      request.status = status
      this.saveToFileSystem()
      return true
    }
    return false
  }

  async updateClientRequest(id: string, updateData: Partial<MemoryClientRequest>): Promise<boolean> {
    const request = clientRequests.find(req => req._id === id)
    if (request) {
      Object.assign(request, updateData)
      this.saveToFileSystem()
      return true
    }
    return false
  }

  // Projects operations
  async createProject(project: Omit<MemoryProject, "_id" | "createdAt" | "updatedAt">): Promise<string> {
    const newProject: MemoryProject = {
      ...project,
      _id: `proj_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    projects.push(newProject)
    this.saveToFileSystem()
    return newProject._id
  }

  async getProjects(activeOnly = false): Promise<MemoryProject[]> {
    const filteredProjects = activeOnly ? projects.filter(p => p.isActive) : projects
    return filteredProjects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async updateProject(id: string, updates: Partial<MemoryProject>): Promise<boolean> {
    const project = projects.find(p => p._id === id || p.id === id)
    if (project) {
      Object.assign(project, updates, { updatedAt: new Date() })
      this.saveToFileSystem()
      return true
    }
    return false
  }

  async deleteProject(id: string): Promise<boolean> {
    const index = projects.findIndex(p => p._id === id || p.id === id)
    if (index !== -1) {
      projects.splice(index, 1)
      this.saveToFileSystem()
      return true
    }
    return false
  }

  // Admin operations
  async createAdminUser(user: Omit<MemoryAdminUser, "_id" | "createdAt">): Promise<string> {
    const newUser: MemoryAdminUser = {
      ...user,
      _id: `admin_${Date.now()}`,
      createdAt: new Date(),
    }
    adminUsers.push(newUser)
    return newUser._id
  }

  async getAdminUser(username: string): Promise<MemoryAdminUser | null> {
    return adminUsers.find(user => user.username === username) || null
  }

  async updateLastLogin(username: string): Promise<boolean> {
    const user = adminUsers.find(u => u.username === username)
    if (user) {
      user.lastLogin = new Date()
      return true
    }
    return false
  }

  // Website Settings operations
  async getWebsiteSettings(): Promise<MemoryWebsiteSettings | null> {
    return websiteSettings[0] || null
  }

  async updateWebsiteSettings(settings: Partial<MemoryWebsiteSettings>): Promise<boolean> {
    if (websiteSettings.length === 0) {
      const newSettings: MemoryWebsiteSettings = {
        _id: "settings_1",
        profile: {
          name: "",
          title: "",
          bio: "",
          location: "",
          email: "",
          phone: "",
          profileImage: "",
          coverImage: "",
        },
        experience: [],
        skills: [],
        socialLinks: [],
        personalInterests: [],
        musicTracks: [],
        contactInfo: [],
        updatedAt: new Date(),
        ...settings,
      }
      websiteSettings.push(newSettings)
    } else {
      Object.assign(websiteSettings[0], settings, { updatedAt: new Date() })
    }
    this.saveToFileSystem()
    return true
  }

  // Blog operations
  async getBlogs(limit: number = 50, skip: number = 0, filter: any = {}): Promise<any[]> {
    let filteredBlogs = blogs
    
    if (filter.status) {
      filteredBlogs = filteredBlogs.filter(blog => blog.status === filter.status)
    }
    
    return filteredBlogs
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(skip, skip + limit)
  }

  async getBlogById(id: string): Promise<any | null> {
    return blogs.find(blog => blog._id === id) || null
  }

  async createBlog(blog: any): Promise<string> {
    const newBlog = {
      ...blog,
      _id: `blog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    blogs.push(newBlog)
    this.saveToFileSystem()
    return newBlog._id
  }

  async updateBlog(id: string, updateData: any): Promise<boolean> {
    const blogIndex = blogs.findIndex(blog => blog._id === id)
    if (blogIndex !== -1) {
      blogs[blogIndex] = { ...blogs[blogIndex], ...updateData, updatedAt: new Date() }
      this.saveToFileSystem()
      return true
    }
    return false
  }

  async deleteBlog(id: string): Promise<boolean> {
    const blogIndex = blogs.findIndex(blog => blog._id === id)
    if (blogIndex !== -1) {
      blogs.splice(blogIndex, 1)
      this.saveToFileSystem()
      return true
    }
    return false
  }

  async incrementBlogViews(id: string): Promise<boolean> {
    const blog = blogs.find(blog => blog._id === id)
    if (blog) {
      blog.views = (blog.views || 0) + 1
      this.saveToFileSystem()
      return true
    }
    return false
  }
}

// Export singleton instance
export const memoryDbService = new MemoryDatabaseService()
