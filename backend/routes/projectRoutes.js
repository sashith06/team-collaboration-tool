const express = require("express");
const router = express.Router();

// Import the protect middleware — verifies the JWT and sets req.user
// Every project route is protected: you must be logged in to use them
const { protect } = require("../middleware/authMiddleware");

// Import all four project controller functions
const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

// ─────────────────────────────────────────────
// HOW ROUTE PROTECTION WORKS
// ─────────────────────────────────────────────
// router.post("/", protect, createProject)
//                  ↑
//   protect runs first — it checks the JWT.
//   If valid → calls next() → createProject runs.
//   If invalid → returns 401 immediately, createProject never runs.
// ─────────────────────────────────────────────

// POST   /api/projects         → create a new project
router.post("/", protect, createProject);

// GET    /api/projects         → get all projects the user belongs to
router.get("/", protect, getProjects);

// PUT    /api/projects/:id     → update a project (owner only)
// :id is a dynamic URL segment — e.g. /api/projects/64abc123
router.put("/:id", protect, updateProject);

// DELETE /api/projects/:id     → delete a project (owner only)
router.delete("/:id", protect, deleteProject);

module.exports = router;
