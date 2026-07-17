// Import bcryptjs — the library used to hash passwords
// Hashing turns a plain password like "secret123" into something like "$2b$10$xK..."
// The hash is one-way: you can never reverse it back to the original password
// When a user logs in later, bcrypt compares the plain password to the stored hash
const bcrypt = require("bcryptjs");

// Import jsonwebtoken — used to create a signed token after successful login
// A JWT (JSON Web Token) is a compact, URL-safe string that proves the user is authenticated
// The frontend stores it and sends it with future requests to access protected routes
const jwt = require("jsonwebtoken");

// Import our User model — this is the Mongoose model from models/User.js
// Through this model we can query and write to the "users" collection in MongoDB
const User = require("../models/User");

// ─────────────────────────────────────────────
// CONTROLLER: registerUser
// ─────────────────────────────────────────────
// A controller is just a function that:
//   1. Reads data from the request (req)
//   2. Does some business logic (validation, DB operations)
//   3. Sends a response back (res)
//
// We export it so the router (authRoutes.js) can attach it to a route.
// ─────────────────────────────────────────────

const registerUser = async (req, res) => {
  // "async" means this function can use "await" to pause and wait for
  // slow operations (like database queries) without blocking the server.

  try {
    // ── STEP 1: Extract data from the request body ──────────────────
    // req.body contains the JSON data the client sent in the POST request.
    // express.json() middleware (in server.js) parses it for us automatically.
    // We use destructuring to pull out the four fields we expect.
    const { name, email, password, role } = req.body;

    // ── STEP 2: Basic presence check ────────────────────────────────
    // Make sure none of the required fields are missing or empty.
    // The || checks cover: undefined (field not sent), null, or empty string "".
    if (!name || !email || !password) {
      // res.status(400) sets the HTTP status code to 400 (Bad Request)
      // .json() sends a JSON response body and ends the request
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
      // "return" stops the function here — without it, code below would still run
    }

    // ── STEP 3: Check if email already exists ───────────────────────
    // User.findOne() searches the "users" collection for ONE document
    // where the email field matches what the client sent.
    // We toLowerCase() the email here to match what the schema stores
    // (the schema has lowercase:true, but the query value is not auto-lowercased).
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    // "await" pauses here until MongoDB responds — then continues

    if (existingUser) {
      // A user with this email already exists — reject the request
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // ── STEP 4: Hash the password ────────────────────────────────────
    // NEVER store a plain-text password in the database.
    // If the database is ever leaked, hashed passwords are useless to attackers.

    // bcrypt.genSalt(10) generates a "salt" — random data added to the password
    // before hashing so that two identical passwords produce DIFFERENT hashes.
    // 10 is the "cost factor" (rounds of processing). Higher = slower but more secure.
    // 10 is the recommended default for most apps.
    const salt = await bcrypt.genSalt(10);

    // bcrypt.hash() combines the plain password + salt and produces the hash string.
    // We store this hash in the DB — never the original password.
    const hashedPassword = await bcrypt.hash(password, salt);

    // ── STEP 5: Create a new User document ──────────────────────────
    // User.create() does two things at once:
    //   1. Creates a new User instance with the provided data
    //   2. Saves it to the MongoDB "users" collection immediately
    // The schema's validations (required, minlength, enum) run at this point.
    // If any validation fails, Mongoose throws an error and we catch it below.
    const newUser = await User.create({
      name,                    // shorthand for name: name
      email,                   // schema will lowercase + trim this automatically
      password: hashedPassword, // store the HASH, not the original password
      role,                    // if not provided, schema default "Member" applies
    });

    // ── STEP 6: Send a success response ─────────────────────────────
    // HTTP 201 = "Created" — the standard status code when a new resource is made
    // We do NOT send the user object back (it would include the hashed password)
    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });

  } catch (error) {
    // ── ERROR HANDLING ───────────────────────────────────────────────
    // This catch block runs if ANYTHING above throws an error:
    //   - MongoDB connection issue
    //   - Mongoose validation failure (e.g. password too short)
    //   - Duplicate key error from MongoDB (if unique:true is violated at DB level)

    // Log the full error on the server so we (developers) can debug it
    console.error("Register error:", error.message);

    // MongoDB duplicate key error code is 11000
    // This can happen if two requests try to register the same email at the exact
    // same millisecond and both pass the findOne check before either saves
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // For all other errors, send a generic 500 (Internal Server Error) response
    // 500 means "something went wrong on the server" — not the client's fault
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

// ─────────────────────────────────────────────
// CONTROLLER: loginUser
// ─────────────────────────────────────────────
// Handles POST /api/auth/login
// Steps: find user by email → verify password → sign JWT → return token
// ─────────────────────────────────────────────

const loginUser = async (req, res) => {
  try {
    // ── STEP 1: Extract credentials from request body ──────────────
    const { email, password } = req.body;

    // ── STEP 2: Basic presence check ────────────────────────────────
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // ── STEP 3: Find the user in the database by email ──────────────
    // User.findOne() searches for ONE document matching the email.
    // The schema stores emails in lowercase, so we match that here.
    const user = await User.findOne({ email: email.toLowerCase() });

    // If no user was found, reject with a vague message.
    // We say "Invalid credentials" instead of "Email not found"
    // so attackers can't figure out which emails are registered.
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ── STEP 4: Compare the submitted password with the stored hash ──
    // bcrypt.compare() takes the plain password and the stored hash,
    // internally hashes the plain password the same way, and checks if they match.
    // It returns true if they match, false if they don't.
    // We never "decrypt" the hash — bcrypt doesn't work that way.
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials", // Same message as above — don't reveal which field is wrong
      });
    }

    // ── STEP 5: Create a JWT token ───────────────────────────────────
    // jwt.sign(payload, secret, options) creates a signed token.
    //
    // payload  → data embedded inside the token (readable by anyone, so no passwords!)
    // secret   → the key from .env used to sign and verify the token
    // expiresIn → the token will automatically expire after this duration
    //
    // The frontend will store this token and send it in the Authorization header
    // on every protected request: "Authorization: Bearer <token>"
    const token = jwt.sign(
      {
        id: user._id,       // MongoDB document ID — used to identify the user
        name: user.name,
        email: user.email,
        role: user.role,    // Used later to restrict Admin-only routes
      },
      process.env.JWT_SECRET,   // Secret key from .env
      { expiresIn: "7d" }       // Token expires in 7 days
    );

    // ── STEP 6: Send back the token and user info ────────────────────
    // The frontend (AuthContext.jsx) expects: { token, user }
    // It stores the token in localStorage and sets isAuthenticated = true
    res.status(200).json({
      success: true,
      token,                      // The JWT string
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

// Export both controller functions so authRoutes.js can import and use them
module.exports = { registerUser, loginUser };


