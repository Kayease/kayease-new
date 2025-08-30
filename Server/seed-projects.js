import mongoose from "mongoose";
import dotenv from "dotenv";
import Project from "./models/Project.js";
import User from "./models/User.js";
import Role from "./models/Role.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const sampleProjects = [
  {
    title: "E-commerce Website Redesign",
    description:
      "Modernize the existing e-commerce platform with improved UX/UI and mobile responsiveness",
    status: "in-progress",
    priority: "high",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-06-30"),
    budget: 25000,
    client: "TechCorp Inc.",
    category: "e-commerce",
    technologies: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
    progress: 45,
  },
  {
    title: "Mobile Banking App",
    description:
      "Develop a secure mobile banking application with biometric authentication",
    status: "planning",
    priority: "urgent",
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-12-31"),
    budget: 50000,
    client: "BankSecure Ltd.",
    category: "mobile-app",
    technologies: ["React Native", "Firebase", "Node.js", "AWS"],
    progress: 0,
  },
  {
    title: "Inventory Management System",
    description:
      "Create a comprehensive inventory tracking system for warehouse operations",
    status: "completed",
    priority: "medium",
    startDate: new Date("2023-09-01"),
    endDate: new Date("2024-02-28"),
    budget: 18000,
    client: "Warehouse Solutions",
    category: "web-development",
    technologies: ["Vue.js", "Express.js", "PostgreSQL", "Docker"],
    progress: 100,
  },
  {
    title: "AI-Powered Chatbot",
    description:
      "Develop an intelligent chatbot for customer support using machine learning",
    status: "on-hold",
    priority: "medium",
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-08-31"),
    budget: 35000,
    client: "SupportTech",
    category: "ai-ml",
    technologies: ["Python", "TensorFlow", "FastAPI", "Redis"],
    progress: 25,
  },
];

async function seedProjects() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Get admin user for project manager
    const adminUser = await User.findOne({ roles: { $in: ["ADMIN"] } });
    if (!adminUser) {
      console.log("No admin user found. Please create an admin user first.");
      return;
    }

    // Get some employees for assignments
    const employees = await User.find({
      roles: { $in: ["EMPLOYEE", "MANAGER"] },
    }).limit(5);

    // Clear existing projects
    await Project.deleteMany({});
    console.log("Cleared existing projects");

    // Create sample projects with employee assignments
    for (const projectData of sampleProjects) {
      const project = new Project({
        ...projectData,
        projectManager: adminUser._id,
        assignedEmployees: employees
          .slice(0, Math.floor(Math.random() * 3) + 1)
          .map((emp) => ({
            employee: emp._id,
            role: ["developer", "designer", "tester", "analyst"][
              Math.floor(Math.random() * 4)
            ],
          })),
      });

      await project.save();
      console.log(`Created project: ${project.title}`);
    }

    console.log("Sample projects seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding projects:", error);
    process.exit(1);
  }
}

seedProjects();
