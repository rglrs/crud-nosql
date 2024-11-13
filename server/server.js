const express = require("express");
const mongoose = require("mongoose");
const Doctor = require('./models/DoctorSchema');

const app = express();

mongoose.connect("mongodb+srv://bismillahYasalam:EAbYAcHnVemzxjlx@prak-pbdl-crud.bkd1w.mongodb.net/?retryWrites=true&w=majority")

async function insert () {
    await Doctor.create({
        firstName: "Bismillah",
        lastName: "Yasalam",
        email: "OgVt5@example.com",
        phone: "08123456789",
        yearsOfExperience: 5,
        address: {
            street: "Jalan Raya",
            city: "Bandung"
        }
    })
}

insert()

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});