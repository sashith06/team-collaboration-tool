// Import mongoose — we need it to create a Schema and a Model
const mongoose = require("mongoose");

// ─────────────────────────────────────────────
// WHAT IS A SCHEMA?
// A Schema is a blueprint that defines the shape of documents
// stored in a MongoDB collection. It tells Mongoose:
//   - What fields each document has
//   - What type each field is (String, Number, Date, etc.)
//   - What rules/validations apply (required, unique, minlength, etc.)
// ─────────────────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    // ── name ───────────────────────────────────
    // Every user must provide their name.
    name: {
      type: String,       // The value must be a string (text)
      required: [true, "Name is required"], // Cannot be empty; second element is the error message
      trim: true,         // Automatically removes leading/trailing whitespace
                          // e.g. "  Alice  " becomes "Alice" before saving
    },

    // ── email ──────────────────────────────────
    // Email is used to identify and authenticate users,
    // so it must be unique across the whole collection.
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,       // MongoDB will reject a second document with the same email
                          // This also creates an index on the field for fast lookups
      lowercase: true,    // Converts the value to lowercase before saving
                          // e.g. "Alice@Gmail.COM" is stored as "alice@gmail.com"
                          // This prevents duplicate accounts due to case differences
      trim: true,         // Strips surrounding whitespace (same as name above)
    },

    // ── password ───────────────────────────────
    // We store the password here. In a later phase you will hash it
    // with bcryptjs before saving — NEVER store plain text passwords in production.
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      // minlength validates the string length before saving
      // The array format [value, message] lets you provide a custom error message
    },

    // ── role ───────────────────────────────────
    // Defines what the user is allowed to do in the application.
    // "enum" restricts the value to only the listed options.
    // If someone tries to save role: "SuperUser", Mongoose will reject it.
    role: {
      type: String,
      enum: {
        values: ["Admin", "Member"],  // Only these two values are allowed
        message: "Role must be either Admin or Member",
      },
      default: "Member",  // If role is not provided when creating a user,
                          // Mongoose automatically sets it to "Member"
    },

    // ── createdAt ──────────────────────────────
    // Records the exact date and time the user document was created.
    // Date.now is a function reference (no parentheses!) — Mongoose calls it
    // at the moment of document creation, not when the schema is defined.
    // Note: if you use timestamps: true (below), you can remove this field
    // and Mongoose will manage createdAt and updatedAt automatically.
    createdAt: {
      type: Date,
      default: Date.now, // ⚠️ No () — passing the function, not calling it now
    },
  },

  // ─────────────────────────────────────────────
  // SCHEMA OPTIONS (second argument to Schema())
  // ─────────────────────────────────────────────
  {
    // collection: explicitly names the MongoDB collection "users"
    // Without this, Mongoose auto-pluralises the model name:
    // model("User") → collection "users" (same result here, but explicit is clearer)
    collection: "users",
  }
);

// ─────────────────────────────────────────────
// WHAT IS A MODEL?
// A Model is a class built from the Schema.
// It gives you methods to interact with the "users" collection:
//   User.create()    → insert a new document
//   User.find()      → get all documents
//   User.findOne()   → get one document
//   User.findById()  → get a document by its _id
//   User.findByIdAndUpdate() → update a document
//   User.findByIdAndDelete() → delete a document
// ─────────────────────────────────────────────

// mongoose.model("User", userSchema)
//   First argument  → the model name ("User") — Mongoose also uses this to name
//                     the collection if you haven't set it explicitly in options
//   Second argument → the schema that defines the document shape
const User = mongoose.model("User", userSchema);

// Export the model so routes and controllers can import it later
module.exports = User;
