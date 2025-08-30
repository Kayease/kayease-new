import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import JobApplicationModal from "../../components/JobApplicationModal";
import { careerApi } from "../../utils/careerApi";


const Careers = () => {
  const navigate = useNavigate();
  const [careers, setCareers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalDepartments: 0,
    teamMembers: 50,
    satisfaction: 95
  });
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [animatedElements, setAnimatedElements] = useState(new Set());
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [applicationJob, setApplicationJob] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState({ type: '', message: '' });

  // Animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimatedElements((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [careers]);

  // Load careers data
  const loadCareersData = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Fetch careers and stats in parallel
      const [careersResponse, statsResponse] = await Promise.all([
        careerApi.getAll({ status: 'active', limit: 100 }),
        careerApi.getStats().catch(() => null)
      ]);

      // Process careers data
      const careersData = careersResponse?.careers || [];
      setCareers(careersData);

      // Process departments from stats or create from careers
      if (statsResponse?.departments?.length > 0) {
        const departmentColors = {
          engineering: "bg-blue-500",
          design: "bg-purple-500",
          marketing: "bg-green-500",
          sales: "bg-orange-500",
          operations: "bg-pink-500",
          other: "bg-gray-500"
        };

        const processedDepartments = statsResponse.departments
          .filter(dept => dept.activeCount > 0)
          .map(dept => ({
            name: dept._id.charAt(0).toUpperCase() + dept._id.slice(1),
            count: dept.activeCount,
            color: departmentColors[dept._id] || "bg-gray-500"
          }));

        setDepartments(processedDepartments);
      } else {
        // Fallback: create departments from careers data
        const departmentCounts = {};
        careersData.forEach(career => {
          const dept = career.department;
          departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
        });

        const fallbackDepartments = Object.entries(departmentCounts).map(([key, count]) => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          count,
          color: {
            engineering: "bg-blue-500",
            design: "bg-purple-500",
            marketing: "bg-green-500",
            sales: "bg-orange-500",
            operations: "bg-pink-500",
            other: "bg-gray-500"
          }[key] || "bg-gray-500"
        }));

        setDepartments(fallbackDepartments);
      }

      // Update stats
      setStats(prev => ({
        ...prev,
        totalJobs: statsResponse?.overview?.active || careersData.length,
        totalDepartments: statsResponse?.departments?.length || new Set(careersData.map(c => c.department)).size
      }));

    } catch (error) {
      console.error("Error loading careers:", error);
      setError("Failed to load career opportunities. Please try again later.");
      setCareers([]);
      setDepartments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCareersData();
  }, []);

  // Handle job application submission
  const handleJobApplication = async (formData, resumeData) => {
    try {
      // The submitJobApplication is now called from within the modal
      // This function just handles the success/error status
      setApplicationStatus({
        type: 'success',
        message: 'Application submitted successfully! We will review your application and get back to you soon.'
      });

      setIsApplicationModalOpen(false);
      setApplicationJob(null);

      // Show success message for 5 seconds
      setTimeout(() => {
        setApplicationStatus({ type: '', message: '' });
      }, 5000);

    } catch (error) {
      console.error('Error submitting application:', error);
      setApplicationStatus({
        type: 'error',
        message: error.message || 'Failed to submit application. Please try again.'
      });

      // Show error message for 5 seconds
      setTimeout(() => {
        setApplicationStatus({ type: '', message: '' });
      }, 5000);
    }
  };

  // Open application modal
  const openApplicationModal = (job) => {
    setApplicationJob(job);
    setIsApplicationModalOpen(true);
  };

  // Close application modal
  const closeApplicationModal = () => {
    setIsApplicationModalOpen(false);
    setApplicationJob(null);
  };

  // Filter careers based on department and search
  const filteredCareers = careers.filter(career => {
    const matchesDepartment = selectedDepartment === "All" ||
      career.department.toLowerCase() === selectedDepartment.toLowerCase();

    const matchesSearch = !searchQuery ||
      career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesDepartment && matchesSearch;
  });

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Job Modal Component
  const JobModal = ({ job, onClose }) => {
    if (!job) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-3xl">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-3xl font-bold text-slate-800">{job.title}</h2>
                  <div className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-sm font-medium rounded-full border border-green-200">
                    <Icon name="Circle" size={8} className="inline mr-1 fill-current" />
                    Active
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Icon name="Building" size={18} className="text-primary" />
                    <span className="font-medium">{job.department.charAt(0).toUpperCase() + job.department.slice(1)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="MapPin" size={18} className="text-secondary" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Clock" size={18} className="text-orange-500" />
                    <span>{job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}</span>
                  </div>
                  {job.experience && (
                    <div className="flex items-center gap-2">
                      <Icon name="Award" size={18} className="text-purple-500" />
                      <span>{job.experience}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors duration-200"
              >
                <Icon name="X" size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Description */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Icon name="FileText" size={20} className="text-primary" />
                Job Description
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">{job.description}</p>
            </div>

            {/* Requirements */}
            {job.requirements?.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Icon name="CheckCircle" size={20} className="text-green-500" />
                  Requirements
                </h3>
                <ul className="space-y-3">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Icon name="Check" size={16} className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-slate-600 leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities?.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Icon name="Target" size={20} className="text-blue-500" />
                  Responsibilities
                </h3>
                <ul className="space-y-3">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Icon name="ArrowRight" size={16} className="text-blue-500 mt-1 flex-shrink-0" />
                      <span className="text-slate-600 leading-relaxed">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Icon name="Zap" size={20} className="text-yellow-500" />
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-3">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-medium rounded-xl border border-primary/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Benefits */}
            {job.benefits?.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Icon name="Gift" size={20} className="text-purple-500" />
                  Benefits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {job.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <Icon name="Star" size={16} className="text-purple-500" />
                      <span className="text-slate-600">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Salary */}
            {job.salary && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <span className="text-green-500 text-xl font-bold mr-1">₹</span>
                  Compensation
                </h3>
                <p className="text-green-700 font-medium text-lg">{job.salary}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 rounded-b-3xl">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="default"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex-1"
                iconName="Send"
                iconPosition="right"
                onClick={() => openApplicationModal(job)}
              >
                Apply for this Position
              </Button>

              <Button
                variant="outline"
                className="border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                iconName="Share2"
                iconPosition="left"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: job.title,
                      text: `Check out this job opportunity: ${job.title} at Kayease`,
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
              >
                Share Job
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // JSON-LD structured data for careers page
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://kayease.com/#organization",
        "name": "Kayease Global",
        "url": "https://kayease.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://res.cloudinary.com/dzf79cfv6/image/upload/v1754037058/Kayease.logo_zrgbwp.png"
        },
        "description": "Kayease Global is a leading digital solutions company specializing in web development, mobile apps, digital marketing, and custom software solutions.",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Jaipur",
          "addressRegion": "Rajasthan",
          "addressCountry": "IN"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+919887664666",
          "contactType": "HR",
          "email": "hr@kayease.com"
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://kayease.com/careers/#webpage",
        "url": "https://kayease.com/careers",
        "name": "Join Kayease Global | Careers in Digital Innovation & Technology",
        "description": "Join our team of digital innovators at Kayease Global. Explore exciting career opportunities in web development, mobile apps, digital marketing, and technology. Build your future with us.",
        "isPartOf": {
          "@id": "https://kayease.com/#website"
        },
        "about": {
          "@id": "https://kayease.com/#organization"
        }
      },
      {
        "@type": "JobPosting",
        "@id": "https://kayease.com/careers/#jobposting",
        "title": "Digital Technology Careers",
        "description": "Join Kayease Global's dynamic team of digital innovators. We offer exciting opportunities in web development, mobile app development, digital marketing, UI/UX design, and custom software development.",
        "datePosted": new Date().toISOString(),
        "validThrough": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        "employmentType": ["FULL_TIME", "PART_TIME", "CONTRACTOR"],
        "hiringOrganization": {
          "@id": "https://kayease.com/#organization"
        },
        "jobLocation": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Jaipur",
            "addressRegion": "Rajasthan",
            "addressCountry": "IN"
          }
        },
        "applicantLocationRequirements": {
          "@type": "Country",
          "name": "India"
        },
        "qualifications": [
          "Bachelor's degree in Computer Science, Engineering, or related field",
          "Experience in web development, mobile development, or digital marketing",
          "Strong problem-solving and communication skills",
          "Passion for technology and innovation"
        ],
        "responsibilities": [
          "Develop innovative digital solutions",
          "Collaborate with cross-functional teams",
          "Stay updated with latest technologies",
          "Contribute to company growth and success"
        ],
        "benefits": [
          "Competitive salary and benefits",
          "Flexible work environment",
          "Professional development opportunities",
          "Health insurance and wellness programs",
          "Modern office facilities"
        ],
        "workHours": "40 hours per week",
        "salaryCurrency": "INR",
        "experienceRequirements": "1-5 years of relevant experience"
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Join Kayease Global | Careers in Digital Innovation & Technology</title>
        <meta
          name="description"
          content="Join Kayease Global's dynamic team of digital innovators. Explore exciting career opportunities in web development, mobile apps, UI/UX design, and digital marketing. Build the future with us."
        />
        <meta
          name="keywords"
          content="careers, jobs, employment, digital agency, web development, mobile apps, UI/UX design, digital marketing, technology jobs, startup careers, remote work, tech jobs"
        />
        <meta property="og:title" content="Join Kayease Global | Careers in Digital Innovation & Technology" />
        <meta
          property="og:description"
          content="Join our dynamic team of digital innovators. Explore exciting career opportunities in web development, mobile apps, UI/UX design, and digital marketing."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://kayease.com/careers" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 overflow-hidden min-h-screen flex items-center">
          {/* Animated Background */}
          <div className="absolute inset-0">
            {/* Primary Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-white to-secondary/8"></div>

            {/* Animated Geometric Shapes */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-secondary/20 to-transparent rounded-full blur-xl animate-pulse delay-700"></div>
            <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-primary/15 to-secondary/15 rounded-full blur-3xl animate-pulse delay-1000"></div>

            {/* Floating Elements */}
            <div className="absolute top-32 left-1/3 w-6 h-6 bg-primary/30 rounded-full animate-bounce delay-300"></div>
            <div className="absolute top-60 right-1/4 w-4 h-4 bg-secondary/40 rounded-full animate-bounce delay-500"></div>
            <div className="absolute bottom-40 right-1/3 w-5 h-5 bg-primary/25 rounded-full animate-bounce delay-700"></div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-full h-full"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
                  backgroundSize: '40px 40px'
                }}>
              </div>
            </div>

            {/* Animated Lines */}
            <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-pulse"></div>
            <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent animate-pulse delay-1000"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Badge */}
              <div
                data-animate
                id="hero-badge"
                className={`inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm border border-primary/20 rounded-full text-primary font-medium text-sm mb-8 shadow-lg hover:shadow-xl transition-all duration-700 ${animatedElements.has("hero-badge")
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-4 scale-95"
                  }`}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>We're actively hiring talented individuals</span>
                <Icon name="Sparkles" size={16} className="text-yellow-500" />
              </div>

              {/* Main Heading */}
              <div
                data-animate
                id="hero-heading"
                className={`transition-all duration-1000 delay-200 ${animatedElements.has("hero-heading")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
                  }`}
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-800 mb-8 leading-tight">
                  <span className="block mb-2">Shape the</span>
                  <span className="block brand-gradient-text relative mb-2">
                    Future
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-pink-400 rounded-full animate-ping delay-500"></div>
                  </span>
                  <span className="block">With Us</span>
                </h1>
              </div>

              {/* Subtitle */}
              <div
                data-animate
                id="hero-subtitle"
                className={`transition-all duration-1000 delay-400 ${animatedElements.has("hero-subtitle")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
                  }`}
              >
                <p className="text-xl lg:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
                  Join a team of <span className="font-semibold text-primary">innovators</span>,
                  <span className="font-semibold text-secondary"> creators</span>, and
                  <span className="font-semibold text-purple-600"> dreamers</span> who are
                  building tomorrow's digital experiences today.
                </p>
              </div>

              {/* Enhanced Search Bar */}
              <div
                data-animate
                id="hero-search"
                className={`max-w-4xl mx-auto mb-12 transition-all duration-1000 delay-600 ${animatedElements.has("hero-search")
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-8 scale-95"
                  }`}
              >
                <div className="relative group">
                  {/* Search Input Container */}
                  <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200/50 group-hover:border-primary/30 transition-all duration-300 overflow-hidden">
                    {/* Animated Border */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>


                  </div>

                  {/* Search Button */}
                  {/* <div className="flex justify-center mt-4">
                  <Button
                    variant="default"
                    size="lg"
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-12 py-4 text-lg font-semibold rounded-xl"
                    iconName="Search"
                    iconPosition="left"
                    onClick={() => {
                      // Scroll to jobs section
                      document.getElementById('jobs-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Find My Dream Job
                  </Button>
                </div> */}

                  {/* Search Suggestions */}
                  {/* <div className="flex flex-wrap justify-center gap-3 mt-6">
                  <span className="text-sm text-slate-500 mr-2">Popular searches:</span>
                  {['Frontend Developer', 'UI/UX Designer', 'Product Manager', 'Data Scientist'].map((suggestion, index) => (
                    <button
                      key={suggestion}
                      onClick={() => setSearchQuery(suggestion)}
                      className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-full text-sm text-slate-600 hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all duration-300 hover:scale-105"
                      style={{ animationDelay: `${800 + index * 100}ms` }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div> */}
                </div>
              </div>

              {/* CTA Buttons */}
              <div
                data-animate
                id="hero-cta"
                className={`flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 transition-all duration-1000 delay-800 ${animatedElements.has("hero-cta")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
                  }`}
              >
                <Button
                  variant="default"
                  size="lg"
                  className="group bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 px-10 py-4 text-lg font-semibold rounded-2xl hover:scale-105"
                  iconName="Briefcase"
                  iconPosition="left"
                  onClick={() => document.getElementById('jobs-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <span className="group-hover:scale-105 transition-transform duration-200">Explore Opportunities</span>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="group border-2 border-slate-300 hover:border-primary/50 hover:bg-primary/5 text-slate-700 hover:text-primary px-10 py-4 text-lg font-semibold rounded-2xl transition-all duration-500 hover:scale-105"
                  iconName="Users"
                  iconPosition="left"
                  onClick={() => navigate('/about')}
                >
                  <span className="group-hover:scale-105 transition-transform duration-200">Meet Our Team</span>
                </Button>
              </div>

              {/* Floating Stats Cards */}
              <div
                data-animate
                id="hero-floating-stats"
                className={`grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4 transition-all duration-1000 delay-1000 ${animatedElements.has("hero-floating-stats")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
                  }`}
              >
                {[
                  {
                    icon: "Users",
                    value: `${stats.teamMembers}+`,
                    label: "Team Members",
                    color: "from-blue-500 to-cyan-500",
                    bgColor: "bg-blue-50/80",
                    borderColor: "border-blue-200/50"
                  },
                  {
                    icon: "Building",
                    value: stats.totalDepartments,
                    label: "Departments",
                    color: "from-purple-500 to-pink-500",
                    bgColor: "bg-purple-50/80",
                    borderColor: "border-purple-200/50"
                  },
                  {
                    icon: "Briefcase",
                    value: stats.totalJobs,
                    label: "Open Roles",
                    color: "from-green-500 to-emerald-500",
                    bgColor: "bg-green-50/80",
                    borderColor: "border-green-200/50"
                  },
                  {
                    icon: "Heart",
                    value: `${stats.satisfaction}%`,
                    label: "Satisfaction",
                    color: "from-orange-500 to-red-500",
                    bgColor: "bg-orange-50/80",
                    borderColor: "border-orange-200/50"
                  }
                ].map((stat, index) => (
                  <div
                    key={stat.label}
                    className={`group relative ${stat.bgColor} backdrop-blur-md border ${stat.borderColor} rounded-2xl p-6 hover:bg-white hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-primary/10`}
                    style={{
                      animationDelay: `${1000 + index * 200}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Subtle pattern overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    <div className="relative text-center space-y-3">
                      {/* Icon container with enhanced styling */}
                      <div className={`w-12 h-12 mx-auto bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-black/10`}>
                        <Icon name={stat.icon} size={24} className="text-white drop-shadow-sm" />
                      </div>

                      {/* Value with enhanced typography */}
                      <div className="text-2xl font-bold text-slate-800 group-hover:text-primary transition-colors duration-300">
                        {stat.value}
                      </div>

                      {/* Label with better spacing */}
                      <div className="text-sm font-medium text-slate-600 group-hover:text-slate-700 transition-colors duration-300">
                        {stat.label}
                      </div>
                    </div>

                    {/* Subtle border accent */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 scale-x-0 group-hover:scale-x-100"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div> */}
        </section>

        {/* Job Openings Section */}
        <section id="jobs-section" className="py-20 bg-gradient-to-br from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              data-animate
              id="jobs-header"
              className={`text-center mb-12 transition-all duration-700 delay-300 ${animatedElements.has("jobs-header")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
                }`}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Open <span className="brand-gradient-text">Positions</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Discover exciting career opportunities and join our growing team of innovators.
              </p>
            </div>

            {/* Department Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <button
                onClick={() => setSelectedDepartment("All")}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${selectedDepartment === "All"
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                  : "bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300"
                  }`}
              >
                <span>All Departments</span>
                <span className="bg-white/20 text-current px-2 py-1 rounded-full text-xs">
                  {careers.length}
                </span>
              </button>

              {departments.map((dept) => (
                <button
                  key={dept.name}
                  onClick={() => setSelectedDepartment(dept.name)}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${selectedDepartment.toLowerCase() === dept.name.toLowerCase()
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                    : "bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300"
                    }`}
                >
                  <div className={`w-3 h-3 rounded-full ${dept.color}`}></div>
                  <span>{dept.name}</span>
                  <span className="bg-white/20 text-current px-2 py-1 rounded-full text-xs">
                    {dept.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Job Listings */}
            <div className="relative">
              {isLoading ? (
                <div className="relative overflow-hidden">
                  <div className="flex flex-col items-center justify-center py-20 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
                      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full animate-pulse blur-xl"></div>
                      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-br from-secondary/10 to-transparent rounded-full animate-pulse delay-700 blur-xl"></div>
                    </div>

                    <div className="relative z-10 text-center">
                      <div className="relative mb-8">
                        <div className="w-20 h-20 mx-auto relative">
                          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                          <div className="absolute inset-0 border-4 border-transparent border-t-primary border-r-primary rounded-full animate-spin"></div>
                          <div className="absolute inset-3 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full animate-pulse"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Icon name="Briefcase" size={24} className="text-primary animate-pulse" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-slate-800">
                          Discovering <span className="brand-gradient-text">Amazing Opportunities</span>
                        </h3>
                        <p className="text-slate-600 max-w-md mx-auto">
                          We're fetching the latest career opportunities just for you...
                        </p>

                        <div className="flex justify-center space-x-2 mt-6">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : error ? (
                <div className="relative overflow-hidden">
                  <div className="text-center py-20 relative">
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute top-10 left-10 w-16 h-16 border-2 border-red-400 rounded-full animate-pulse"></div>
                      <div className="absolute top-32 right-20 w-12 h-12 border-2 border-orange-400 rounded-full animate-pulse delay-300"></div>
                      <div className="absolute bottom-20 left-1/4 w-8 h-8 border-2 border-red-400 rounded-full animate-pulse delay-700"></div>
                    </div>

                    <div className="relative z-10">
                      <div className="w-24 h-24 mx-auto mb-8 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-orange-100 rounded-full animate-pulse"></div>
                        <div className="absolute inset-2 bg-gradient-to-br from-red-50 to-orange-50 rounded-full flex items-center justify-center">
                          <Icon name="AlertTriangle" size={32} className="text-red-500" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full animate-ping"></div>
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-orange-400 rounded-full animate-ping delay-500"></div>
                      </div>

                      <div className="max-w-lg mx-auto">
                        <h3 className="text-2xl font-bold text-slate-800 mb-4">
                          Oops! <span className="text-red-500">Something went wrong</span>
                        </h3>

                        <div className="bg-gradient-to-r from-red-50 via-orange-50 to-red-50 border border-red-200 rounded-2xl p-6 mb-6">
                          <p className="text-red-700 font-medium mb-4">{error}</p>

                          <div className="text-left space-y-2 text-sm text-red-600">
                            <div className="flex items-center gap-2">
                              <Icon name="Wifi" size={14} />
                              <span>Check your internet connection</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Icon name="RefreshCw" size={14} />
                              <span>Try refreshing the page</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Icon name="Clock" size={14} />
                              <span>Wait a moment and try again</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <Button
                            variant="default"
                            onClick={loadCareersData}
                            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                            iconName="RefreshCw"
                            iconPosition="left"
                          >
                            Try Again
                          </Button>

                          <Button
                            variant="outline"
                            className="border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                            iconName="Home"
                            iconPosition="left"
                            onClick={() => navigate('/')}
                          >
                            Go Home
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : filteredCareers.length === 0 ? (
                <div className="relative overflow-hidden">
                  <div className="text-center py-20 relative">
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute top-10 left-10 w-20 h-20 border-2 border-primary rounded-full animate-pulse"></div>
                      <div className="absolute top-32 right-20 w-16 h-16 border-2 border-secondary rounded-full animate-pulse delay-300"></div>
                      <div className="absolute bottom-20 left-1/4 w-12 h-12 border-2 border-primary rounded-full animate-pulse delay-700"></div>
                      <div className="absolute bottom-32 right-1/3 w-8 h-8 border-2 border-secondary rounded-full animate-pulse delay-1000"></div>
                    </div>

                    <div className="relative z-10">
                      <div className="mb-8 relative">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 animate-pulse"></div>
                          <Icon name="Briefcase" size={40} className="text-primary relative z-10" />
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-2xl font-bold text-slate-800 mb-2">
                            {selectedDepartment === "All" ? (
                              <>
                                No Open Positions <span className="brand-gradient-text">Right Now</span>
                              </>
                            ) : (
                              <>
                                No <span className="brand-gradient-text">{selectedDepartment}</span> Positions
                              </>
                            )}
                          </h3>

                          <p className="text-lg text-slate-600 max-w-md mx-auto leading-relaxed">
                            {selectedDepartment === "All"
                              ? "We're always growing! New opportunities are added regularly. Check back soon or join our talent network."
                              : `We don't have any ${selectedDepartment.toLowerCase()} positions available right now, but we're always looking for great talent.`
                            }
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                          variant="outline"
                          className="group border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                          iconName="Bell"
                          iconPosition="left"
                          onClick={() => navigate('/contact')}
                        >
                          <span>Get Notified</span>
                          <div className="ml-2 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        </Button>

                        <Button
                          variant="default"
                          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                          iconName="Users"
                          iconPosition="left"
                          onClick={() => navigate('/contact')}
                        >
                          Join Talent Network
                        </Button>
                      </div>

                      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                        <p className="text-sm text-slate-600 mb-2">
                          <Icon name="Lightbulb" size={16} className="inline mr-2 text-yellow-500" />
                          Try exploring other departments or check our general opportunities
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary/80"
                          onClick={() => setSelectedDepartment("All")}
                        >
                          View All Departments
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6">
                  {filteredCareers.map((job, index) => (
                    <div
                      key={job._id}
                      data-animate
                      id={`job-${job._id}`}
                      className={`group relative bg-white rounded-3xl p-8 shadow-sm border border-slate-200/50 hover:shadow-2xl hover:border-primary/20 transition-all duration-500 cursor-pointer overflow-hidden ${animatedElements.has(`job-${job._id}`)
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                        }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => setSelectedJob(job)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-secondary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"></div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200"></div>

                      <div className="relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                          <div className="flex-1 space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-2xl font-bold text-slate-800 group-hover:text-primary transition-colors duration-300">
                                    {job.title}
                                  </h3>
                                  <div className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs font-medium rounded-full border border-green-200">
                                    <Icon name="Circle" size={8} className="inline mr-1 fill-current" />
                                    Active
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg group-hover:bg-primary/5 transition-colors duration-300">
                                    <Icon name="Building" size={16} className="text-primary" />
                                    <span className="font-medium">{job.department.charAt(0).toUpperCase() + job.department.slice(1)}</span>
                                  </div>
                                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg group-hover:bg-primary/5 transition-colors duration-300">
                                    <Icon name="MapPin" size={16} className="text-secondary" />
                                    <span>{job.location}</span>
                                  </div>
                                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg group-hover:bg-primary/5 transition-colors duration-300">
                                    <Icon name="Clock" size={16} className="text-orange-500" />
                                    <span>{job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-slate-500">
                                    <Icon name="Calendar" size={14} />
                                    <span className="text-xs">{formatDate(job.createdAt)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="relative">
                              <p className="text-slate-600 leading-relaxed line-clamp-2 group-hover:text-slate-700 transition-colors duration-300">
                                {job.description}
                              </p>
                              <div className="absolute bottom-0 right-0 bg-gradient-to-l from-white via-white to-transparent w-20 h-6 group-hover:from-primary/5 transition-colors duration-300"></div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {job.skills.slice(0, 5).map((skill, skillIndex) => (
                                <span
                                  key={skillIndex}
                                  className="px-3 py-1.5 bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 text-sm font-medium rounded-lg border border-slate-200/50 hover:border-primary/30 hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 transition-all duration-300 cursor-default"
                                >
                                  {skill}
                                </span>
                              ))}
                              {job.skills.length > 5 && (
                                <span className="px-3 py-1.5 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary text-sm font-medium rounded-lg border border-primary/20 cursor-default">
                                  +{job.skills.length - 5} more
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[160px]">
                            <Button
                              variant="outline"
                              className="group/btn border-2 border-slate-200 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                              iconName="Eye"
                              iconPosition="left"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedJob(job);
                              }}
                            >
                              <span className="group-hover/btn:text-primary transition-colors duration-300">View Details</span>
                            </Button>

                            <Button
                              variant="default"
                              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 group/apply"
                              iconName="Send"
                              iconPosition="right"
                              onClick={(e) => {
                                e.stopPropagation();
                                openApplicationModal(job);
                              }}
                            >
                              <span className="group-hover/apply:scale-105 transition-transform duration-200">Apply Now</span>
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 mt-6 border-t border-slate-100 group-hover:border-primary/10 transition-colors duration-300">
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <Icon name="Eye" size={12} />
                              <span>{job.viewCount || 0} views</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Icon name="Users" size={12} />
                              <span>{job.applicationCount || 0} applications</span>
                            </div>
                            {job.salary && (
                              <div className="flex items-center gap-1">
                                <span className="text-green-500 text-md font-medium">₹</span>
                                <span>{job.salary}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-slate-500">Actively hiring</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Job Modal */}
        <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />

        {/* Job Application Modal */}
        <JobApplicationModal
          job={applicationJob}
          isOpen={isApplicationModalOpen}
          onClose={closeApplicationModal}
          onSubmit={handleJobApplication}
        />

        {/* Application Status Notification */}
        {applicationStatus.message && (
          <div className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-xl shadow-2xl border-l-4 transition-all duration-500 ${applicationStatus.type === 'success'
            ? 'bg-green-50 border-green-500 text-green-800'
            : 'bg-red-50 border-red-500 text-red-800'
            }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Icon
                  name={applicationStatus.type === 'success' ? 'CheckCircle' : 'AlertCircle'}
                  size={20}
                  className={applicationStatus.type === 'success' ? 'text-green-500' : 'text-red-500'}
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {applicationStatus.type === 'success' ? 'Application Submitted!' : 'Application Failed'}
                </p>
                <p className="text-sm mt-1 opacity-90">
                  {applicationStatus.message}
                </p>
              </div>
              <button
                onClick={() => setApplicationStatus({ type: '', message: '' })}
                className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Careers;