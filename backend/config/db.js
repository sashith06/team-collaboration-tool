// Import mongoose — the library that lets us talk to MongoDB from Node.js
// Mongoose gives us a clean way to connect, define data shapes (schemas), and query the DB
const mongoose = require("mongoose");

// Define an async function called connectDB
// We use "async" because connecting to a database takes time (it's a network operation)
// We don't want Node.js to freeze while waiting — async/await handles this gracefully
const connectDB = async () => {
  try {
    // mongoose.connect() opens a connection to our MongoDB database
    // process.env.MONGO_URI reads the connection string from the .env file
    // dotenv (loaded in server.js) makes process.env.MONGO_URI available here
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If the connection succeeds, print a success message
    // conn.connection.host tells us which server we connected to (e.g. 127.0.0.1)
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If something goes wrong (wrong URI, MongoDB not running, etc.), catch the error
    console.error(`MongoDB Connection Error: ${error.message}`);

    // Exit the Node.js process with code 1 (meaning "failed")
    // We do this because the app cannot function without a database connection
    process.exit(1);
  }
};

// Export the function so server.js (and any other file) can import and call it
module.exports = connectDB;
