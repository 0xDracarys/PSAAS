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
    const hashedPassword = await bcrypt.hash("Dracarys321Roxx", saltRounds)

    // Create admin user
    const adminUser = {
      username: "shubhambhasker@gmail.com",
      email: "shubhambhasker@gmail.com",
      passwordHash: hashedPassword,
      role: "admin",
      createdAt: new Date(),
      lastLogin: null,
    }

    // Check if admin user already exists
    const existingUser = await db.collection("admin_users").findOne({ username: "shubhambhasker@gmail.com" })
    
    if (existingUser) {
      console.log("Admin user already exists. Updating password...")
      await db.collection("admin_users").updateOne(
        { username: "shubhambhasker@gmail.com" },
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
    console.log("ADMIN USER CREATED/UPDATED")
    console.log("=".repeat(50))
    console.log("✓ Admin credentials have been securely set")
    console.log("✓ You can now log in to the admin dashboard")
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
