const { MongoClient } = require("mongodb");
require("dotenv").config();

const username = encodeURIComponent(process.env.DB_USER);
const password = encodeURIComponent(process.env.DB_PASSWORD);
const cluster = process.env.DB_CLUSTER;
const authSource = process.env.AUTH_SOURCE;
const authMechanism = process.env.AUTH_MECHANISM;
const dbName = process.env.DB_NAME;

const uri = `mongodb://bismillahYasalam:EAbYAcHnVemzxjlx@prak-pbdl-crud-shard-00-00.bkd1w.mongodb.net:27017,prak-pbdl-crud-shard-00-01.bkd1w.mongodb.net:27017,prak-pbdl-crud-shard-00-02.bkd1w.mongodb.net:27017/?replicaSet=atlas-1414lw-shard-0&ssl=true&authSource=admin`;
const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas");
    const database = client.db(dbName);
    return database; // Kembalikan objek database untuk digunakan di aplikasi
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB Atlas:", error);
    throw error;
  }
}

module.exports = connectToDatabase;