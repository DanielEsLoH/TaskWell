// Import necessary modules for the application
import cors from "cors"; // Middleware to enable Cross-Origin Resource Sharing (CORS)
import dotenv from "dotenv"; // Loads environment variables from a .env file
import express from "express"; // The core Express.js framework
import mongoose from "mongoose"; // An ODM (Object Data Modeling) library for MongoDB
import morgan from "morgan"; // HTTP request logger middleware

// Load environment variables from the .env file
dotenv.config();

// Create an instance of the Express application
const app = express();

// --- Application Middleware ---
// Configure and use CORS to allow requests from the specified frontend URL
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Allows requests from the specified origin
    methods: ["GET", "POST", "DELETE", "PUT"], // Specifies allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specifies allowed request headers
  })
);

// Use morgan middleware for logging HTTP requests in 'dev' format
app.use(morgan("dev"));

// Connect to MongoDB using Mongoose
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("DB Connected successfully."))
  .catch((err) => console.log("Failed to connect to DB: ", err));

// Use express.json() to parse incoming JSON payloads in the request body
app.use(express.json());

// Set the port for the server, defaulting to 3000 if not specified in environment variables
const PORT = process.env.PORT || 3000;

// --- API Routes ---
// Define a root route for a GET request to the homepage
app.get("/", async (req, res) => {
  res.status(200).json({
    // Responds with a 200 OK status and a JSON message
    message: "Welcome To Taskwell API",
  });
});

// --- Error Handling Middleware ---
// Global error middleware to catch and handle errors
app.use((err, req, res, next) => {
  console.log(err.stack); // Logs the error stack to the console
  res.status(500).json({ message: "Internal Server Error" }); // Sends a 500 status for server errors
});

// Catch-all middleware for handling undefined routes (404 Not Found)
app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" }); // Sends a 404 status for non-existent routes
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Logs a message to the console confirming the server is running
});
