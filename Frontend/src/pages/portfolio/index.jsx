import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import ProjectCard from "./components/ProjectCard";
import FilterTabs from "./components/FilterTabs";
import ProjectModal from "./components/ProjectModal";
import StatsSection from "./components/StatsSection";
import ClientLogos from "./components/ClientLogos";

import Button from "../../components/ui/Button";
import { usePortfolio } from "../../hooks/usePortfolio";

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Use the portfolio hook to fetch real data
  const { 
    portfolios, 
    isLoading, 
    error, 
    stats, 
    updateFilters,
    loadStats
  } = usePortfolio({ 
    limit: 50, // Load more projects for portfolio display
    category: activeFilter === "all" ? "" : activeFilter 
  });

  // Load stats on component mount
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Create dynamic filters based on real data and stats
  const getFilters = () => {
    const baseFilters = [
      { 
        id: "all", 
        name: "All Projects", 
        icon: "Grid3X3", 
        count: stats?.totalProjects || portfolios.length 
      }
    ];

    // Add category filters based on available data
    const categoryMap = {
      'web-dev': { name: 'Web Development', icon: 'Code' },
      'mobile': { name: 'Mobile', icon: 'Smartphone' },
      'ecommerce': { name: 'E-commerce', icon: 'ShoppingCart' },
      'saas': { name: 'SaaS', icon: 'Cloud' },
      'healthcare': { name: 'Healthcare', icon: 'Heart' },
      'fintech': { name: 'Fintech', icon: 'CreditCard' },
      'education': { name: 'Education', icon: 'GraduationCap' },
      'other': { name: 'Other', icon: 'Folder' }
    };

    // Get category counts from stats or calculate from portfolios
    const categoryCounts = {};
    if (stats?.categoryStats) {
      stats.categoryStats.forEach(cat => {
        categoryCounts[cat._id] = cat.count;
      });
    } else {
      // Fallback: calculate from current portfolios
      portfolios.forEach(project => {
        categoryCounts[project.category] = (categoryCounts[project.category] || 0) + 1;
      });
    }

    // Add filters for categories that have projects
    Object.entries(categoryCounts).forEach(([categoryId, count]) => {
      if (count > 0 && categoryMap[categoryId]) {
        baseFilters.push({
          id: categoryId,
          name: categoryMap[categoryId].name,
          icon: categoryMap[categoryId].icon,
          count: count
        });
      }
    });

    return baseFilters;
  };

  const filters = getFilters();

  // Transform backend data to match frontend component expectations
  const transformProjectData = (backendProject) => {
    // Map category IDs to display names
    const categoryMap = {
      'web-dev': 'Web Development',
      'mobile': 'Mobile Development',
      'ecommerce': 'E-commerce',
      'saas': 'SaaS Platform',
      'healthcare': 'Healthcare',
      'fintech': 'Fintech',
      'education': 'Education',
      'other': 'Digital Solution'
    };

    // Generate metrics based on category
    const generateMetrics = (project) => {
      const metrics = {};
      switch (project.category) {
        case 'web-dev':
          metrics.performance = '98%';
          metrics.speed = '< 2s';
          metrics.uptime = '99.9%';
          break;
        case 'mobile':
          metrics.rating = '4.8★';
          metrics.downloads = '10K+';
          metrics.retention = '85%';
          break;
        case 'ecommerce':
          metrics.conversion = '+150%';
          metrics.sales = '↑200%';
          metrics.users = '25K+';
          break;
        case 'saas':
          metrics.users = '50K+';
          metrics.growth = '+300%';
          metrics.satisfaction = '96%';
          break;
        default:
          metrics.quality = '100%';
          metrics.delivery = 'On Time';
          metrics.satisfaction = '95%';
      }
      return metrics;
    };

    return {
      id: backendProject._id,
      _id: backendProject._id,
      title: backendProject.title,
      category: backendProject.category,
      categoryName: categoryMap[backendProject.category] || backendProject.category,
      year: new Date(backendProject.completedDate || backendProject.createdAt).getFullYear().toString(),
      image: backendProject.mainImage || 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
      description: backendProject.excerpt || backendProject.projectOverview || `A ${categoryMap[backendProject.category]?.toLowerCase() || 'digital'} project delivered with cutting-edge technology.`,
      projectOverview: backendProject.projectOverview,
      fullDescription: backendProject.projectOverview,
      tags: backendProject.technologies?.slice(0, 3) || [], // Use first 3 technologies as tags
      technologies: backendProject.technologies || [],
      gallery: backendProject.galleryImages?.length > 0 
        ? backendProject.galleryImages 
        : [backendProject.mainImage || 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop'], // Fallback to main image if no gallery
      galleryImages: backendProject.galleryImages || [],
      liveUrl: backendProject.liveDomainLink || "#",
      liveDomainLink: backendProject.liveDomainLink,
      timeline: backendProject.timeline || "2-3 months",
      featured: backendProject.featured,
      status: backendProject.status || 'completed',
      slug: backendProject.slug,
      client: backendProject.client || 'Confidential Client',
      completedDate: backendProject.completedDate,
      createdAt: backendProject.createdAt,
      metrics: generateMetrics(backendProject),
      // Pass all original fields for modal compatibility
      ...backendProject
    };
  };

  // Transform portfolios data
  const transformedProjects = portfolios.map(transformProjectData);

  // Update filters when activeFilter changes
  useEffect(() => {
    updateFilters({ 
      category: activeFilter === "all" ? "" : activeFilter,
      page: 1 // Reset to first page when filter changes
    });
  }, [activeFilter, updateFilters]);

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  // JSON-LD structured data for portfolio page
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
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://kayease.com/portfolio/#webpage",
        "url": "https://kayease.com/portfolio",
        "name": "Success Stories | Kayease Global Portfolio - Transforming Businesses",
        "description": "Explore our portfolio of successful digital projects. See how Kayease Global has transformed businesses through innovative web development, mobile apps, and digital solutions.",
        "isPartOf": {
          "@id": "https://kayease.com/#website"
        },
        "about": {
          "@id": "https://kayease.com/#organization"
        },
        "mainEntity": {
          "@id": "https://kayease.com/portfolio/#portfolio"
        }
      },
      {
        "@type": "CreativeWork",
        "@id": "https://kayease.com/portfolio/#portfolio",
        "name": "Kayease Global Portfolio",
        "description": "A collection of successful digital projects and case studies showcasing our expertise in web development, mobile apps, and digital solutions.",
        "creator": {
          "@id": "https://kayease.com/#organization"
        },
        "publisher": {
          "@id": "https://kayease.com/#organization"
        },
                 "hasPart": transformedProjects.map(project => ({
          "@type": "CreativeWork",
          "@id": `https://kayease.com/portfolio/${project.slug}`,
          "name": project.title,
          "description": project.description,
          "image": project.image || "https://res.cloudinary.com/dzf79cfv6/image/upload/v1754037058/Kayease.logo_zrgbwp.png",
          "url": project.liveUrl,
          "dateCreated": project.year, // Assuming year is the dateCreated
          "genre": project.category,
          "keywords": project.technologies ? project.technologies.join(', ') : "web development, digital solutions",
          "creator": {
            "@id": "https://kayease.com/#organization"
          },
          "publisher": {
            "@id": "https://kayease.com/#organization"
          },
          "about": {
            "@type": "Thing",
            "name": project.categoryName
          }
        }))
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Success Stories | Kayease Global Portfolio - Transforming Businesses</title>
        <meta name="description" content="Explore our portfolio of successful digital projects. See how Kayease Global has transformed businesses through innovative web development, mobile apps, and digital solutions. Real results, real success stories." />
        <meta name="keywords" content="portfolio, case studies, web development projects, mobile app projects, digital solutions, success stories, client projects, e-commerce projects, custom software projects, UI/UX design projects" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Success Stories | Kayease Global Portfolio - Transforming Businesses" />
        <meta property="og:description" content="Explore our portfolio of successful digital projects. See how Kayease Global has transformed businesses through innovative web development, mobile apps, and digital solutions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kayease.com/portfolio" />
        <meta property="og:image" content="https://res.cloudinary.com/dzf79cfv6/image/upload/v1754037058/Kayease.logo_zrgbwp.png" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Success Stories | Kayease Global Portfolio - Transforming Businesses" />
        <meta name="twitter:description" content="Explore our portfolio of successful digital projects. See how Kayease Global has transformed businesses through innovative web development, mobile apps, and digital solutions." />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://kayease.com/portfolio" />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-to-br from-primary/10 via-secondary/5 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-4"
              >
                Our <span className="brand-gradient-text">Portfolio</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-base sm:text-lg md:text-xl text-gray-600 max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4"
              >
                Discover how we've helped businesses transform their digital
                presence with innovative solutions that drive real results
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
              >
                <Button
                  variant="default"
                  className="cta-button w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
                  iconName="UserPlus"
                  iconPosition="left"
                  iconSize={18}
                  onClick={() => (window.location.href = "/contact")}
                >
                  Create Your Success Story
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FilterTabs
              filters={filters}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-20">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            {/* No Projects State */}
            {!isLoading && !error && transformedProjects.length === 0 && (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Projects Found</h3>
                  <p className="text-gray-600 mb-6">
                    {activeFilter === "all" 
                      ? "No portfolio projects are available at the moment." 
                      : `No projects found in the ${filters.find(f => f.id === activeFilter)?.name || activeFilter} category.`
                    }
                  </p>
                  {activeFilter !== "all" && (
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveFilter("all")}
                    >
                      View All Projects
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Projects Grid */}
            {!isLoading && !error && transformedProjects.length > 0 && (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {transformedProjects.map((project, index) => (
                  <motion.div
                    key={project._id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProjectCard
                      project={project}
                      onViewDetails={handleViewDetails}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <StatsSection />

        {/* Client Logos */}
        <ClientLogos />

        {/* Project Modal */}
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </>
  );
};

export default Portfolio;
