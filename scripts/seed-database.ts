#!/usr/bin/env tsx

import { MongoClient } from "mongodb"
import { config } from "dotenv"

// Load environment variables
config({ path: ".env.local" })

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://uniqthatswhatyouare_db_user:jnjF8Db3LnHeM8DR@portfolio.oijkdkg.mongodb.net/portfolio_db"
const MONGODB_DB = process.env.MONGODB_DB || "portfolio_db"

const sampleProjects = [
  {
    title: "Vulnerability Assessment Platform",
    description: "Automated vulnerability scanning and assessment tool designed for comprehensive security analysis. Features real-time threat detection, detailed reporting, and integration with popular security frameworks.",
    image: "/cybersecurity-vulnerability-assessment-dashboard-w.jpg",
    tags: ["Python", "Django", "PostgreSQL", "Security", "Automation"],
    github: "https://github.com/0xDracarys/vulnerability-platform",
    demo: "https://vuln-platform-demo.netlify.app",
    features: [
      "Automated vulnerability scanning",
      "Real-time threat detection",
      "Comprehensive security reports",
      "Integration with security frameworks",
      "Custom rule engine",
    ],
    isActive: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-12-20"),
  },
  {
    title: "TryHackMe Leaderboard Tracker",
    description: "Personal tracking system for TryHackMe progress with advanced analytics, goal setting, and performance visualization. Helped achieve Top 5 Lithuania ranking.",
    image: "/tryhackme-progress-tracker-with-leaderboard-and-st.jpg",
    tags: ["Python", "Selenium", "FastAPI", "Data Analysis", "Automation"],
    github: "https://github.com/0xDracarys/tryhackme-tracker",
    demo: "https://tryhackme.com/p/ShubhamBhasker",
    features: [
      "Progress tracking automation",
      "Leaderboard monitoring",
      "Performance analytics",
      "Goal setting and reminders",
      "Achievement visualization",
    ],
    isActive: true,
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-11-15"),
  },
  {
    title: "Customer Support Automation",
    description: "AI-powered customer support system leveraging machine learning for intelligent ticket routing, automated responses, and sentiment analysis. Built for CyberCare operations.",
    image: "/ai-customer-support-dashboard.png",
    tags: ["Next.js", "Python", "OpenAI", "AI/ML", "Customer Success"],
    github: "https://github.com/0xDracarys/support-automation",
    demo: "https://support-ai-demo.netlify.app",
    features: [
      "AI-powered ticket routing",
      "Automated response generation",
      "Sentiment analysis",
      "Multi-language support",
      "Performance analytics",
    ],
    isActive: true,
    createdAt: new Date("2024-05-20"),
    updatedAt: new Date("2024-12-10"),
  },
]

const sampleClientRequests = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1-555-0123",
    projectType: "E-commerce Website",
    requirements: "Need a modern e-commerce platform with payment integration, inventory management, and admin dashboard.",
    budget: "€2500-€5000",
    timeline: "3-4 months",
    referenceLinks: ["https://shopify.com", "https://amazon.com"],
    files: [],
    acceptedTerms: true,
    paymentTerms: "25% upfront payment required",
    status: "pending",
    createdAt: new Date("2024-12-15"),
  },
  {
    name: "Sarah Wilson",
    email: "sarah.wilson@techcorp.com",
    phone: "+1-555-0456",
    projectType: "Cybersecurity Audit",
    requirements: "Comprehensive security audit for our web application including penetration testing and vulnerability assessment.",
    budget: "€1500-€3000",
    timeline: "1-2 months",
    referenceLinks: [],
    files: [],
    acceptedTerms: true,
    paymentTerms: "35% upfront payment required",
    status: "reviewed",
    createdAt: new Date("2024-12-10"),
  },
]

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db(MONGODB_DB)

    // Seed projects
    const projectsCollection = db.collection("projects")
    await projectsCollection.deleteMany({}) // Clear existing data
    await projectsCollection.insertMany(sampleProjects)
    console.log(`Inserted ${sampleProjects.length} sample projects`)

    // Seed client requests
    const requestsCollection = db.collection("client_requests")
    await requestsCollection.deleteMany({}) // Clear existing data
    await requestsCollection.insertMany(sampleClientRequests)
    console.log(`Inserted ${sampleClientRequests.length} sample client requests`)

    // Create indexes for better performance
    await projectsCollection.createIndex({ isActive: 1 })
    await projectsCollection.createIndex({ createdAt: -1 })

    await requestsCollection.createIndex({ email: 1 })
    await requestsCollection.createIndex({ status: 1 })
    await requestsCollection.createIndex({ createdAt: -1 })

    console.log("Database indexes created")
    console.log("Database seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

// Run the seeding function
seedDatabase()
