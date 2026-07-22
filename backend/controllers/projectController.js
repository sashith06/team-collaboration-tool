// Import the Project model to interact with the "projects" collection
const Project = require("../models/Project");

// ─────────────────────────────────────────────────────────────────
// CONTROLLER: createProject
// POST /api/projects
// ─────────────────────────────────────────────────────────────────
// Creates a new project.
// The logged-in user (from req.user, set by the protect middleware)
// is automatically set as the owner AND added to the members list.
// ─────────────────────────────────────────────────────────────────

const createProject = async (req, res) => {
  try {
    // Extract title and description from the request body
    // The owner is NOT sent by the frontend — we get it from req.user
    const { title, description } = req.body;

    // Basic validation — title is required
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project title is required",
      });
    }

    // Create the project in MongoDB
    // req.user._id is the logged-in user's ID — injected by protect middleware
    // We set the owner to that ID and also put the owner in the members array
    // so the owner can see their own project when querying by membership
    const project = await Project.create({
      title:       title.trim(),
      description: description?.trim() || "",
      owner:       req.user._id,    // automatically assigned — user doesn't control this
      members:     [req.user._id],  // owner is always the first member
    });

    res.status(201).json({
      success: true,
      data: project,
    });

  } catch (error) {
    console.error("createProject error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────
// CONTROLLER: getProjects
// GET /api/projects
// ─────────────────────────────────────────────────────────────────
// Returns ONLY the projects where the logged-in user is either:
//   - the owner, OR
//   - in the members array
//
// This prevents users from seeing projects they don't belong to.
// ─────────────────────────────────────────────────────────────────

const getProjects = async (req, res) => {
  try {
    // MongoDB $or operator: match documents where at least ONE condition is true
    // Here: find projects where req.user._id matches owner OR is in members[]
    //
    // Without this filter, a user could see ALL projects in the database —
    // that would be a serious security issue.
    const projects = await Project.find({
      $or: [
        { owner:   req.user._id },   // user is the owner
        { members: req.user._id },   // user's ID appears anywhere in the members array
      ],
    })
      // .populate() replaces ObjectIds with the actual documents from another collection
      // Instead of owner: "64abc123...", you get owner: { name: "Alice", email: "..." }
      // We select only name and email — no need to expose more
      .populate("owner",   "name email")
      .populate("members", "name email")
      // Sort by most recently created first (descending = -1)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,  // handy for the frontend to know how many results
      data: projects,
    });

  } catch (error) {
    console.error("getProjects error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────
// CONTROLLER: updateProject
// PUT /api/projects/:id
// ─────────────────────────────────────────────────────────────────
// Only the owner can update the project title, description, or members.
// :id is a URL parameter — e.g. PUT /api/projects/64abc123
// ─────────────────────────────────────────────────────────────────

const updateProject = async (req, res) => {
  try {
    // req.params.id is the project ID from the URL: /api/projects/:id
    const project = await Project.findById(req.params.id);

    // Check the project exists
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // ── Ownership check ──────────────────────────────────────────
    // project.owner is an ObjectId. req.user._id is also an ObjectId.
    // We use .toString() on both to compare them as plain strings,
    // because JavaScript cannot directly compare two ObjectId objects with ===
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only the project owner can update this project.",
      });
      // 403 = Forbidden — the user is authenticated but not allowed to do this
    }

    // Extract only the fields the owner is allowed to change
    // We deliberately exclude "owner" — an owner cannot transfer ownership here
    const { title, description, members } = req.body;

    // Build an update object with only the fields that were actually sent
    // If title wasn't sent, we don't want to overwrite it with undefined
    const updates = {};
    if (title       !== undefined) updates.title       = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (members     !== undefined) updates.members     = members;

    // findByIdAndUpdate() finds the document by ID, applies the changes,
    // and returns the UPDATED document (not the old one) thanks to { new: true }
    //
    // runValidators: true → re-run schema validations on the updated fields
    // (e.g. title cannot become an empty string)
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    )
      .populate("owner",   "name email")
      .populate("members", "name email");

    res.status(200).json({
      success: true,
      data: updatedProject,
    });

  } catch (error) {
    console.error("updateProject error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────
// CONTROLLER: deleteProject
// DELETE /api/projects/:id
// ─────────────────────────────────────────────────────────────────
// Only the owner can delete the project.
// ─────────────────────────────────────────────────────────────────

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Ownership check — same pattern as updateProject
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only the project owner can delete this project.",
      });
    }

    // findByIdAndDelete() removes the document from the collection permanently
    // In a later phase you could also delete associated tasks here before removing the project
    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });

  } catch (error) {
    console.error("deleteProject error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Export all four controllers so the router can use them
module.exports = { createProject, getProjects, updateProject, deleteProject };
