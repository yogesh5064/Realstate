const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Sabse zaroori line!

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connection String (Env se lo, nahi toh default local use karo)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/realestate_db';
const PORT = process.env.PORT || 5000;

// Database Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log("🚀 MongoDB Database se connect ho gaya!"))
    .catch((err) => console.error("❌ DB Connection Error:", err));

// Schema Definition (Thoda aur details ke saath)
const PropertySchema = new mongoose.Schema({
    type: { type: String, required: true },       // Home or Land
    purpose: { type: String, required: true },    // Rent or Sell
    price: { type: Number, required: true },
    location: { type: String, required: true },
    sellerPhone: { type: String, required: true },
    postedAt: { type: Date, default: Date.now }   // Date automatically add hogi
});

const Property = mongoose.model('Property', PropertySchema);

// --- ROUTES ---

// 1. Nayi property save karna (PostProperty.jsx se aayega)
app.post('/api/properties', async (req, res) => {
    try {
        const property = new Property(req.body);
        await property.save();
        res.status(201).send({ message: "Success", data: property });
    } catch (err) {
        res.status(400).send({ error: "Data save nahi ho paya", details: err.message });
    }
});

// 2. Saari properties dikhana (Home.jsx ke liye)
app.get('/api/properties', async (req, res) => {
    try {
        const properties = await Property.find().sort({ postedAt: -1 }); // Latest property pehle
        res.send(properties);
    } catch (err) {
        res.status(500).send({ error: "Server error" });
    }
});

app.listen(PORT, () => console.log(`🚀 Server http://localhost:${PORT} par start ho gaya`));