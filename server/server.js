require('dotenv').config(); // Menggunakan dotenv untuk mengakses variabel lingkungan
const express = require('express');
const mongoose = require('mongoose');
const Doctor = require('./models/DoctorSchema'); // Pastikan model DoctorSchema sudah sesuai

const app = express();

// Middleware untuk parsing JSON request body
app.use(express.json());

// Mengambil URI MongoDB dari variabel lingkungan
const dbURI = process.env.MONGO_URI;

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: 'pbdl-crud', // Pastikan nama database yang digunakan adalah 'wabw'
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected to wawb'))
  .catch((err) => console.log('MongoDB connection error:', err));

async function insert() {
  try {
    const doctor = await Doctor.create({
      firstName: 'Bismillah',
      lastName: 'Yasalam',
      email: 'OgVt5@example.com',
      phone: '08123456789',
      yearsOfExperience: 5,
      address: {
        street: 'Jalan Raya',
        city: 'Bandung',
      },
    });
    console.log('Doctor inserted:', doctor);
  } catch (error) {
    console.error('Error inserting doctor:', error);
  }
}

insert();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
