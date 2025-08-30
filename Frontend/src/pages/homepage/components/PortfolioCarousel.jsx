import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { portfolioApi } from '../../../utils/portfolioApi';
import ProjectModal from '../../portfolio/components/ProjectModal'; // Import the modal

const PortfolioCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProject, setModalProject] = useState(null);

  // Fetch portfolio data on component mount
  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Fetch featured projects for homepage display
      const response = await portfolioApi.getAll({ 
        featured: true, 
        limit: 6,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      const portfolios = response.portfolios || [];
      
      // Transform portfolio data to match carousel format
      const transformedProjects = portfolios.map((portfolio) => ({
        id: portfolio._id,
        title: portfolio.title,
        category: getCategoryName(portfolio.category),
        categoryName: getCategoryName(portfolio.category),
        image: portfolio.mainImage || 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
        mainImage: portfolio.mainImage,
        description: portfolio.excerpt || portfolio.projectOverview || `A ${getCategoryName(portfolio.category).toLowerCase()} project delivered with cutting-edge technology.`,
        metrics: generateMetrics(portfolio),
        technologies: portfolio.technologies || [],
        year: new Date(portfolio.completedDate || portfolio.createdAt).getFullYear().toString(),
        slug: portfolio.slug,
        client: portfolio.client || 'Confidential Client',
        timeline: portfolio.timeline || '2-3 months',
        galleryImages: portfolio.galleryImages || [],
        liveDomainLink: portfolio.liveDomainLink,
        ...portfolio // Pass all original fields for modal
      }));

      setProjects(transformedProjects);
      
      // Reset current index if it's out of bounds
      if (currentIndex >= transformedProjects.length) {
        setCurrentIndex(0);
      }

    } catch (error) {
      console.error('Error loading portfolio data:', error);
      setError('Failed to load portfolio projects');
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get category display name
  const getCategoryName = (categoryId) => {
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
    return categoryMap[categoryId] || 'Digital Project';
  };

  // Helper function to generate metrics from portfolio data
  const generateMetrics = (portfolio) => {
    const metrics = {};
    if (portfolio.metrics && Object.keys(portfolio.metrics).length > 0) {
      return portfolio.metrics;
    }
    switch (portfolio.category) {
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

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlaying || projects.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === projects.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, projects.length]);

  const nextSlide = () => {
    setCurrentIndex(currentIndex === projects.length - 1 ? 0 : currentIndex + 1);
  };

  const prevSlide = () => {
    setCurrentIndex(currentIndex === 0 ? projects.length - 1 : currentIndex - 1);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Open modal with current project
  const handleOpenModal = (project) => {
    setModalProject(project);
    setModalOpen(true);
    setIsAutoPlaying(false);
  };

  // Close modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalProject(null);
    setIsAutoPlaying(true);
  };

  return (
    <section className="py-20 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-6">
            Recent <span className="brand-gradient-text">Projects</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Discover how we've helped businesses transform their digital presence 
            and achieve measurable results.
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center space-x-3">
              <Icon name="Loader2" size={24} className="animate-spin text-primary" />
              <span className="text-text-secondary text-lg">Loading our latest projects...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-20">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
              <Icon name="AlertCircle" size={32} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-700 mb-2">Unable to Load Projects</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadPortfolioData}
                className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <Icon name="RefreshCw" size={16} />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && projects.length === 0 && (
          <div className="text-center py-20">
            <Icon name="Briefcase" size={48} className="text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">No Featured Projects</h3>
            <p className="text-text-secondary">
              We're working on some amazing projects. Check back soon!
            </p>
          </div>
        )}

        {/* Carousel Container */}
        {!isLoading && !error && projects.length > 0 && (
        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer group"
                onClick={() => handleOpenModal(projects[currentIndex])}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
                  {/* Project Image */}
                  <div className="relative overflow-hidden">
                    <Image
                      src={projects[currentIndex].image}
                      alt={projects[currentIndex].title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                        {projects[currentIndex].category}
                      </span>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="mb-6">
                      <h3 className="text-3xl font-bold text-text-primary mb-4">
                        {projects[currentIndex].title}
                      </h3>
                      <p className="text-text-secondary text-lg leading-relaxed mb-6">
                        {projects[currentIndex].description}
                      </p>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      {Object.entries(projects[currentIndex].metrics).map(([key, value], index) => (
                        <div key={index} className="text-center">
                          <div className="text-2xl font-bold text-primary mb-1">
                            {value}
                          </div>
                          <div className="text-sm text-text-secondary capitalize">
                            {key}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Technologies */}
                    {projects[currentIndex].technologies.length > 0 && (
                      <div className="mb-8">
                        <h4 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wide">
                          Technologies Used
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {projects[currentIndex].technologies.map((tech, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Year Info */}
                    <div className="flex items-center justify-end">
                      <div>
                        <div className="text-sm text-text-secondary">Year</div>
                        <div className="font-semibold text-text-primary">
                          {projects[currentIndex].year}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all duration-300 z-10"
          >
            <Icon name="ChevronLeft" size={24} className="text-text-primary" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all duration-300 z-10"
          >
            <Icon name="ChevronRight" size={24} className="text-text-primary" />
          </button>
        </div>
        )}
        <div className="flex justify-center space-x-2 mt-8">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-primary w-8' :'bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        {/* Project Modal */}
        <ProjectModal
          project={modalProject}
          isOpen={modalOpen}
          onClose={handleCloseModal}
        />

        {/* View All Projects CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link to="/portfolio">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span>View All Projects</span>
              <Icon name="ExternalLink" size={20} />
            </motion.button>
          </Link>
        </motion.div>
      

        {/* Always show CTA even when no projects */}
        {!isLoading && projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Link to="/portfolio">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span>View Our Portfolio</span>
                <Icon name="ExternalLink" size={20} />
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PortfolioCarousel;