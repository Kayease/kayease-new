// Mock data for careers - fallback when API is not available
export const mockCareers = [
  {
    _id: "mock-1",
    title: "Senior Frontend Developer",
    department: "engineering",
    location: "Remote",
    jobType: "remote",
    experience: "3-5 years",
    salary: "₹80k-₹120k",
    skills: ["React", "JavaScript", "TypeScript", "CSS", "Node.js"],
    description: "We are looking for a skilled Frontend Developer to join our team. You will be responsible for building user-facing features and ensuring great user experience.",
    requirements: [
      "3+ years of experience with React",
      "Strong knowledge of JavaScript and TypeScript",
      "Experience with modern CSS frameworks",
      "Understanding of responsive design principles",
      "Experience with version control (Git)"
    ],
    responsibilities: [
      "Develop new user-facing features",
      "Build reusable components and front-end libraries",
      "Ensure the technical feasibility of UI/UX designs",
      "Optimize application for maximum speed and scalability"
    ],
    benefits: [
      "Competitive salary",
      "Health insurance",
      "Remote work flexibility",
      "Professional development budget"
    ],
    status: "active",
    postedDate: new Date().toISOString(),
    applicationCount: 15,
    viewCount: 120,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "mock-2",
    title: "UI/UX Designer",
    department: "design",
    location: "New York, NY",
    jobType: "hybrid",
    experience: "2-4 years",
    salary: "₹70k-₹100k",
    skills: ["Figma", "Adobe Creative Suite", "Prototyping", "User Research", "Wireframing"],
    description: "Join our design team to create beautiful and intuitive user experiences. You'll work closely with developers and product managers to bring designs to life.",
    requirements: [
      "2+ years of UI/UX design experience",
      "Proficiency in Figma and Adobe Creative Suite",
      "Strong portfolio demonstrating design skills",
      "Understanding of user-centered design principles",
      "Experience with prototyping tools"
    ],
    responsibilities: [
      "Create wireframes, prototypes, and high-fidelity designs",
      "Conduct user research and usability testing",
      "Collaborate with development team on implementation",
      "Maintain and evolve design system"
    ],
    benefits: [
      "Competitive salary",
      "Health insurance",
      "Hybrid work model",
      "Creative software licenses"
    ],
    status: "active",
    postedDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    applicationCount: 8,
    viewCount: 85,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export const mockStats = {
  overview: {
    total: 2,
    active: 2,
    paused: 0,
    closed: 0
  },
  departments: [
    {
      _id: "engineering",
      count: 1,
      activeCount: 1
    },
    {
      _id: "design",
      count: 1,
      activeCount: 1
    }
  ],
  totalApplications: 23,
  totalViews: 205
};