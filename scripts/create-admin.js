const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")
require("dotenv").config()

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://uniqthatswhatyouare_db_user:jnjF8Db3LnHeM8DR@portfolio.oijkdkg.mongodb.net/portfolio_db"
const MONGODB_DB = process.env.MONGODB_DB || "portfolio_db"

async function createAdminUser() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("✅ Connected to MongoDB")

    const db = client.db(MONGODB_DB)

    // Hash the password
    const hashedPassword = await bcrypt.hash("admin123", 12)

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
      console.log("⚠️  Admin user already exists. Updating password...")
      await db.collection("admin_users").updateOne(
        { username: "admin" },
        { $set: { passwordHash: hashedPassword, updatedAt: new Date() } }
      )
      console.log("✅ Admin user password updated successfully!")
    } else {
      await db.collection("admin_users").insertOne(adminUser)
      console.log("✅ Admin user created successfully!")
    }

    console.log("\n" + "=".repeat(50))
    console.log("🔐 ADMIN CREDENTIALS")
    console.log("=".repeat(50))
    console.log("Username: admin")
    console.log("Password: admin123")
    console.log("Email: admin@portfolio.com")
    console.log("=".repeat(50))
    console.log("\n🌐 Access admin at: http://localhost:3000/admin")
    console.log("=".repeat(50) + "\n")

  } catch (error) {
    console.error("❌ Error:", error.message)
    process.exit(1)
  } finally {
    await client.close()
  }
}

createAdminUser()
