// Import express so we can use its Router
const express = require("express");

// express.Router() creates a mini-application that can handle routes independently.
// Think of it as a "sub-server" dedicated to auth routes only.
// Instead of defining all routes on "app" in server.js, we split them into separate
// router files to keep the code organised and easy to maintain.
const router = express.Router();

// Import both controller functions from authController.js
const { registerUser, loginUser } = require("../controllers/authController");

// ─────────────────────────────────────────────
// ROUTE: POST /api/auth/register
// ─────────────────────────────────────────────
// router.post(path, handlerFunction)
//
// When a client sends:   POST http://localhost:5000/api/auth/register
// Express matches this route and calls registerUser(req, res)
//
// The full path "/api/auth/register" is built from two parts:
//   "/api/auth"   — the prefix set in server.js when we mount this router
//   "/register"   — the path defined here
//
// We only write "/register" here because the "/api/auth" prefix is added in server.js
router.post("/register", registerUser);

// ─────────────────────────────────────────────
// ROUTE: POST /api/auth/login
// ─────────────────────────────────────────────
// When the client sends: POST http://localhost:5000/api/auth/login
// Express calls loginUser(req, res)
// It verifies the password and returns a JWT token on success
router.post("/login", loginUser);

// Export the router so server.js can mount it
module.exports = router;
