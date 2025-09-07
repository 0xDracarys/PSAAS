#!/usr/bin/env tsx

import { MongoClient } from "mongodb"
import { config } from "dotenv"
import bcrypt from "bcryptjs"

// Load environment variables
config({ path: ".env.local", override: true })

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://uniqthatswhatyouare_db_user:jnjF8Db3LnHeM8DR@portfolio.oijkdkg.mongodb.net/portfolio_db"
const MONGODB_DB = process.env.MONGODB_DB || "portfolio_db"

console.log("MONGODB_URI:", MONGODB_URI ? "Found" : "Not found")
console.log("MONGODB_DB:", MONGODB_DB)

async function createAdminUser() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db(MONGODB_DB)

    // Hash the password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash("admin123", saltRounds)

    // Create admin user
    const adminUser = {
      username: "admin",
      email: "admin@portfolio.com",
      passwordHash: hashedPassword,
      role: "admin",
      createdAt: new Date(),
      lastLogin: null,
    }

    // Check if admin user already exists
    const existingUser = await db.collection("admin_users").findOne({ username: "admin" })
    
    if (existingUser) {
      console.log("Admin user already exists. Updating password...")
      await db.collection("admin_users").updateOne(
        { username: "admin" },
        { $set: { passwordHash: hashedPassword, updatedAt: new Date() } }
      )
      console.log("Admin user password updated successfully!")
    } else {
      // Insert new admin user
      await db.collection("admin_users").insertOne(adminUser)
      console.log("Admin user created successfully!")
    }

    // Create indexes for better performance
    await db.collection("admin_users").createIndex({ username: 1 }, { unique: true })
    await db.collection("admin_users").createIndex({ email: 1 }, { unique: true })

    console.log("\n" + "=".repeat(50))
    console.log("ADMIN CREDENTIALS")
    console.log("=".repeat(50))
    console.log("Username: admin")
    console.log("Password: admin123")
    console.log("Email: admin@portfolio.com")
    console.log("=".repeat(50))
    console.log("\nYou can now access the admin dashboard at: http://localhost:3000/admin")
    console.log("=".repeat(50))

  } catch (error) {
    console.error("Error creating admin user:", error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

// Run the function
createAdminUser()
