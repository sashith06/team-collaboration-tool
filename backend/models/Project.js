// Import mongoose to define the schema and model
const mongoose = require("mongoose");

// ─────────────────────────────────────────────
// PROJECT SCHEMA
// ─────────────────────────────────────────────
// Defines the shape of every document in the "projects" collection.
// Each project belongs to one owner and can have multiple members.
// ─────────────────────────────────────────────

const projectSchema = new mongoose.Schema(
  {
    // ── title ──────────────────────────────────────────────────────
    // The name of the project — required and trimmed of whitespace.
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },

    // ── description ────────────────────────────────────────────────
    // Optional longer text describing the project.
    description: {
      type: String,
      trim: true,
      default: "",
    },

    // ── owner ──────────────────────────────────────────────────────
    // A reference to the User who created this project.
    //
    // mongoose.Schema.Types.ObjectId is MongoDB's unique ID type.
    // ref: "User" tells Mongoose which collection to join when you use
    // .populate("owner") — this replaces the ObjectId with the full user document.
    //
    // The owner is set automatically on creation — the user never sends this.
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",       // references the User model
      required: true,
    },

    // ── members ────────────────────────────────────────────────────
    // An array of User ObjectIds — everyone who has access to this project.
    // The owner is automatically added to this array on creation.
    //
    // [{type: ObjectId, ref: "User"}] = array of references to User documents
    // populate("members") would replace each ID with the full user object.
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },

  // ─────────────────────────────────────────────
  // SCHEMA OPTIONS
  // ─────────────────────────────────────────────
  {
    // timestamps: true automatically adds two fields to every document:
    //   createdAt — set once when the document is first created
    //   updatedAt — updated automatically every time the document is saved
    // This is cleaner than manually defining those fields yourself.
    timestamps: true,

    // Name the collection explicitly
    collection: "projects",
  }
);

// ─────────────────────────────────────────────
// MODEL
// ─────────────────────────────────────────────
// mongoose.model("Project", projectSchema) creates a class that gives us:
//   Project.create()           → insert a new project
//   Project.find()             → get all projects matching a filter
//   Project.findById()         → get one project by its _id
//   Project.findByIdAndUpdate()→ update a project
//   Project.findByIdAndDelete()→ delete a project
const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
