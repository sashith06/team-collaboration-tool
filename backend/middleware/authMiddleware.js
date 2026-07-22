// Import jsonwebtoken to verify the token sent by the frontend
const jwt = require("jsonwebtoken");

// Import the User model so we can look up the user from the DB
// after verifying their token
const User = require("../models/User");

// ─────────────────────────────────────────────
// MIDDLEWARE: protect
// ─────────────────────────────────────────────
// Middleware is a function that runs BETWEEN receiving a request
// and reaching the actual route handler.
//
// This middleware protects routes that require login.
// It reads the JWT from the request header, verifies it,
// looks up the user in the database, and attaches the user
// to req.user so the next function (controller) can use it.
//
// Usage in routes:  router.get("/projects", protect, getProjects)
//                                            ↑
//                              protect runs first, then getProjects
// ─────────────────────────────────────────────

const protect = async (req, res, next) => {
  // "next" is a function that tells Express to move on to the
  // next middleware or route handler. We MUST call next() to continue.

  let token;

  // ── STEP 1: Check for the token in the Authorization header ─────
  // The frontend sends the JWT in the HTTP header like this:
  //   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5...
  //
  // req.headers.authorization gives us the full string.
  // We check that it starts with "Bearer " before extracting the token.
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    // Split "Bearer eyJ..." by the space → ["Bearer", "eyJ..."]
    // [1] gives us just the token string
    token = req.headers.authorization.split(" ")[1];
  }

  // ── STEP 2: If no token was found, reject the request ───────────
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. No token provided.",
    });
    // 401 = Unauthorized — the user is not authenticated
  }

  try {
    // ── STEP 3: Verify the token ──────────────────────────────────
    // jwt.verify() checks two things:
    //   1. Was the token signed with our JWT_SECRET? (not tampered with)
    //   2. Has the token expired? (we set expiresIn: "7d" when creating it)
    //
    // If valid, it returns the "decoded" payload we embedded when signing:
    //   { id, name, email, role, iat (issued at), exp (expires at) }
    // If invalid/expired, it throws an error → goes to catch block
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ── STEP 4: Find the user in the database ─────────────────────
    // We use the id from the token payload to get the full user document.
    // .select("-password") excludes the hashed password from the result
    // — no reason to carry the password around in every request.
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      // Token was valid, but the user no longer exists in the DB
      // (e.g. the account was deleted after the token was issued)
      return res.status(401).json({
        success: false,
        message: "Not authorized. User no longer exists.",
      });
    }

    // ── STEP 5: Pass control to the next handler ───────────────────
    // req.user is now available in every controller that follows this middleware.
    // Example: in a project controller we can do req.user._id to get the owner's ID.
    next();

  } catch (error) {
    // jwt.verify() throws if the token is invalid or expired
    console.error("Token verification error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Not authorized. Token is invalid or expired.",
    });
  }
};

module.exports = { protect };
