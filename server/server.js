require("dotenv").config(); // Menggunakan dotenv untuk mengakses variabel lingkungan
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); 
const Doctor = require("./models/DoctorSchema"); // Pastikan model DoctorSchema sudah sesuai

const app = express();

// Middleware untuk parsing JSON request body
app.use(express.json());

// Middleware untuk mengizinkan CORS
app.use(cors());

// Mengambil URI MongoDB dari variabel lingkungan
const dbURI = process.env.MONGO_URI;

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "pbdl-crud",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected to wawb"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Endpoint untuk mendapatkan semua data dokter
app.get("/doctor", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res
      .status(200)
      .json({ message: "Doctors retrieved successfully", doctors });
  } catch (error) {
    console.error("Error retrieving doctors:", error);
    res
      .status(500)
      .json({ message: "Error retrieving doctors", error: error.message });
  }
});

// Endpoint untuk mendapatkan data dokter berdasarkan ID
app.get("/doctor/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json({ message: "Doctor retrieved successfully", doctor });
  } catch (error) {
    console.error("Error retrieving doctor:", error);
    res
      .status(500)
      .json({ message: "Error retrieving doctor", error: error.message });
  }
});

app.post("/doctor", async (req, res) => {
  const doctorData = req.body;

  try {
    const newDoctor = await Doctor.create(doctorData);
    res
      .status(201)
      .json({ message: "Doctor created successfully", doctor: newDoctor });
  } catch (error) {
    console.error("Error creating doctor:", error);
    res
      .status(500)
      .json({ message: "Error creating doctor", error: error.message });
  }
});

// Fungsi untuk mengedit data dokter berdasarkan ID
app.put("/doctor/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res
      .status(200)
      .json({ message: "Doctor updated successfully", doctor: updatedDoctor });
  } catch (error) {
    console.error("Error updating doctor:", error);
    res
      .status(500)
      .json({ message: "Error updating doctor", error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
