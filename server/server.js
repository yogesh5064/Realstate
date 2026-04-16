const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); 
const fs = require('fs'); 
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// 1. Standard Middlewares
app.use(cors());
app.use(express.json()); 
// 🔥 NEW: Isse FormData aur Complex URL structures sahi se parse hote hain
app.use(express.urlencoded({ extended: true })); 

// 2. Static Folder Serving (Images ke liye)
const uploadsPath = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsPath)) {
    console.log("⚠️ Creating missing 'uploads' folder...");
    fs.mkdirSync(uploadsPath, { recursive: true });
}

// Images access karne ke liye: https://realstate-41cq.onrender.com/uploads/filename.jpg
app.use('/uploads', express.static(uploadsPath));

// 3. Routes Mounting
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/admin', require('./routes/adminRoutes')); 

// Basic Root Route
app.get('/', (req, res) => res.send('Real Estate API is running... 🚀'));

// 4. 🔥 Improved Global Error Handler
// Ye controller ke try-catch se bahar ke errors ko bhi pakdega
app.use((err, req, res, next) => {
    console.error("❌ SERVER_ERROR:", err.stack);
    
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message || "Internal Server Error",
        // Development mein stack trace dikhayega, production mein nahi
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`✅ Serving static files from: ${uploadsPath}`);
});