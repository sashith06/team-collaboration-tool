// ─────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────

// dotenv loads variables from the .env file into process.env
// MUST be called before anything else that uses process.env
require("dotenv").config();

// Express is the web framework — it handles HTTP requests and responses
const express = require("express");

// cors (Cross-Origin Resource Sharing) lets our React frontend (running on port 5173)
// talk to this backend (running on port 5000) without being blocked by the browser
const cors = require("cors");

// Import our custom connectDB function from config/db.js
const connectDB = require("./config/db");

// Import the auth router — handles all routes starting with /api/auth
const authRoutes = require("./routes/authRoutes");

// Import the project router — handles all routes starting with /api/projects
const projectRoutes = require("./routes/projectRoutes");

// ─────────────────────────────────────────────
// 2. CONNECT TO DATABASE
// ─────────────────────────────────────────────

// Call connectDB() to establish the MongoDB connection when the server starts
// This runs once at startup — Mongoose keeps the connection open for the lifetime of the app
connectDB();

// ─────────────────────────────────────────────
// 3. CREATE THE EXPRESS APP
// ─────────────────────────────────────────────

// express() creates our application instance
// Think of "app" as our server — we attach routes and middleware to it
const app = express();

// ─────────────────────────────────────────────
// 4. MIDDLEWARE
// ─────────────────────────────────────────────

// Middleware runs between receiving a request and sending a response
// It processes the request before it reaches your route handlers

// express.json() parses incoming requests with JSON payloads
// Without this, req.body would be undefined when the frontend sends JSON data
app.use(express.json());

// cors() enables Cross-Origin Resource Sharing
// This allows requests from http://localhost:5173 (React dev server) to reach this backend
// Without this, the browser would block the request with a CORS error
app.use(cors());

// ─────────────────────────────────────────────
// 5. ROUTES
// ─────────────────────────────────────────────

// Health-check route — visit http://localhost:5000/ to confirm the server is alive
app.get("/", (req, res) => {
  res.send("Backend Running");
});

// Auth routes — POST /api/auth/register and POST /api/auth/login
app.use("/api/auth", authRoutes);

// Project routes — all CRUD operations under /api/projects
// Every route here requires a valid JWT (handled inside projectRoutes.js)
app.use("/api/projects", projectRoutes);

// ─────────────────────────────────────────────
// 6. START THE SERVER
// ─────────────────────────────────────────────

// Read the PORT value from .env (e.g. PORT=5000)
// The || 5000 is a fallback — if PORT is not set in .env, use 5000 by default
const PORT = process.env.PORT || 5000;

// app.listen() starts the server and begins listening for incoming HTTP requests
// The callback function runs once the server is successfully started
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
