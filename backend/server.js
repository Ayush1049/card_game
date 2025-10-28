import express from "express";
import path from "path";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";

// Initialize app
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

// Serve static files (if needed later)
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
