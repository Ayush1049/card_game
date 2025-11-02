import express from "express";
import path from "path";
import cors from "cors";
import session from "express-session";
import userRoutes from "./routes/userRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";

// Initialize app
const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  // origin: "http://localhost:3000", // your frontend
  credentials: true,              // allow cookies
}));
app.use(express.json());
app.use(
  session({
    secret: "qazwsxedcrfvtgb", // my secret key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // set secure: true only if using HTTPS
  })
);
app.use((req, res, next) => {
  console.log("Session ID:", req.sessionID);
  console.log("Session Data:", req.session);
  next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/room", roomRoutes);

// Serve static files (if needed later)
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
