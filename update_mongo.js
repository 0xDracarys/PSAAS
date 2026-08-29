const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://uniqthatswhatyouare_db_user:jnjF8Db3LnHeM8DR@portfolio.oijkdkg.mongodb.net/portfolio_db";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db('portfolio_db');
    const adminUsers = database.collection('admin_users');
    
    // The password hash we generated for Dracarys321**#1
    const newPasswordHash = "$2b$12$K.LQ2COEkkrd83VpZsy8Tedt7dligYorb81PNg/poJx0YePcVdxrq";
    const email = "shubhambhasker@gmail.com";
    
    // Update the document where username or email is shubhambhasker@gmail.com
    const result = await adminUsers.updateOne(
      { $or: [{ email: email }, { username: email }] },
      { $set: { passwordHash: newPasswordHash, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );
    
    console.log(`Matched ${result.matchedCount} document(s) and modified ${result.modifiedCount} document(s).`);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
