import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import projectRoutes from "./routes/projects.js";
import blogRoutes from "./routes/blogs.js";
import cloudinaryRoutes from "./routes/cloudinary.js";
import careerRoutes from "./routes/careers.js";
import clientRoutes from "./routes/clients.js";
import portfolioRoutes from "./routes/portfolio.js";
import contactRoutes from "./routes/contacts.js";
import teamRoutes from "./routes/team.js";
import jobApplicationRoutes from "./routes/jobApplications.js";
import uploadResumeRoutes from "./routes/uploadResume.js";
import callbackRequestRoutes from "./routes/callbackRequests.js";
import Role from "./models/Role.js";

dotenv.config();

const app = express();

// Security Headers Middleware
app.use((req, res, next) => {
  // X-Frame-Options: Prevents clickjacking attacks
  res.setHeader('X-Frame-Options', 'DENY');

  // X-Content-Type-Options: Prevents MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // X-XSS-Protection: Enables XSS filtering
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer-Policy: Controls referrer information
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Content-Security-Policy: Prevents XSS and other attacks
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://res.cloudinary.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: http:; connect-src 'self' https:; frame-ancestors 'none';");

  next();
});

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://kayease.com',
    'https://www.kayease.com',


  ],
  credentials: true // if you use cookies/auth
}));
app.use(express.json({ limit: "100mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running." });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/projects", projectRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/cloudinary", cloudinaryRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/job-applications", jobApplicationRoutes);
app.use("/api/upload-resume", uploadResumeRoutes);
app.use("/api/callback-requests", callbackRequestRoutes);

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected✅✅");
    try {
      const baseRoles = ['ADMIN', 'EMPLOYEE', 'MANAGER', 'HR', 'WEBSITE MANAGER'];
      for (const name of baseRoles) {
        await Role.updateOne({ name }, { name }, { upsert: true });
      }
      console.log("Base roles ensured");
    } catch (e) {
      console.error('Error ensuring base roles:', e);
    }
  })
  .catch((err) => console.error("MongoDB connection error❌❌:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}✈️✈️`);
}); 
