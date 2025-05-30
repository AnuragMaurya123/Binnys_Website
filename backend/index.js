const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");

// Config
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);

// Database Connection
const connectDB = require("./config/db");
connectDB();

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
