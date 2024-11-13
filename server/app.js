const express = require("express");
const connectToDatabase = require("./mongoDb");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk parsing JSON
app.use(express.json());

// Route contoh untuk mengakses data dari MongoDB
app.get("/data", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("users"); // Ganti dengan nama koleksi yang ingin Anda akses

    // Query data dari koleksi
    const data = await collection.find({}).toArray();
    res.json(data);
  } catch (error) {
    console.error("❌ Error retrieving data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}); 

// Route contoh untuk menambahkan data baru
app.post("/data", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("users"); // Ganti dengan nama koleksi yang ingin Anda gunakan

    // Menyisipkan data baru dari request body
    const newData = req.body;
    const result = await collection.insertOne(newData);

    res.status(201).json({ message: "Data inserted successfully", result });
  } catch (error) {
    console.error("❌ Error inserting data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});