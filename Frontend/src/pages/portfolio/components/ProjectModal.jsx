import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";

const ProjectModal = ({ project, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!project) return null;

  const tabs = [
    { id: "overview", name: "Project Overview", icon: "Eye" },
  ];

  const gallery = project.galleryImages && project.galleryImages.length > 0
    ? project.galleryImages
    : project.gallery && project.gallery.length > 0
      ? project.gallery
      : [project.mainImage || project.image];

  // Technology mapping with icons and descriptions
  const getTechnologyInfo = (techName) => {
    const techMap = {
      // Frontend
      'React': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', category: 'Frontend' },
      'React.js': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', category: 'Frontend' },
      'Vue': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg', category: 'Frontend' },
      'Vue.js': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg', category: 'Frontend' },
      'Angular': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg', category: 'Frontend' },
      'Next.js': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', category: 'Frontend' },
      'JavaScript': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', category: 'Frontend' },
      'TypeScript': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', category: 'Frontend' },
      'HTML5': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', category: 'Frontend' },
      'CSS3': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', category: 'Frontend' },
      'Tailwind CSS': { icon: '/tech/tailwind.svg', category: 'Styling' },
      'Bootstrap': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg', category: 'Styling' },
      'SASS': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg', category: 'Styling' },
      'SCSS': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg', category: 'Styling' },

      // Backend
      'Node.js': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', category: 'Backend' },
      'Express.js': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', category: 'Backend' },
      'Django': { icon: '/tech/Django.svg', category: 'Backend' },
      'Laravel': { icon: '/tech/Laravel.svg', category: 'Backend' },
      'Flask': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg', category: 'Backend' },
      'Spring Boot': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg', category: 'Backend' },
      'Python': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', category: 'Backend' },
      'PHP': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg', category: 'Backend' },
      'Java': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', category: 'Backend' },

      // Databases
      'MongoDB': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', category: 'Database' },
      'PostgreSQL': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', category: 'Database' },
      'MySQL': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', category: 'Database' },
      'Redis': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg', category: 'Database' },
      'Firebase': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg', category: 'Database' },
      'SQLite': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg', category: 'Database' },

      // Mobile
      'React Native': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', category: 'Mobile' },
      'Flutter': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg', category: 'Mobile' },
      'Swift': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg', category: 'Mobile' },
      'Kotlin': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg', category: 'Mobile' },

      // Tools & Others
      'Docker': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', category: 'DevOps' },
      'AWS': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg', category: 'Cloud' },
      'Google Cloud': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg', category: 'Cloud' },
      'Vercel': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg', category: 'Deployment' },
      'Netlify': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netlify/netlify-original.svg', category: 'Deployment' },
      'Git': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', category: 'Version Control' },
      'GitHub': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', category: 'Version Control' },
      'Figma': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg', category: 'Design' },
      'Adobe XD': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xd/xd-original.svg', category: 'Design' },
      'Photoshop': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg', category: 'Design' },
      'Stripe': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/stripe/stripe-original.svg', category: 'Payment' },
      'PayPal': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/paypal/paypal-original.svg', category: 'Payment' },
      'Socket.io': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg', category: 'Real-time' },
      'GraphQL': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg', category: 'API' },
      'REST API': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg', category: 'API' },
      'Webpack': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg', category: 'Build Tool' },
      'Vite': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg', category: 'Build Tool' },
      'ESLint': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eslint/eslint-original.svg', category: 'Code Quality' },
      'Prettier': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prettier/prettier-original.svg', category: 'Code Quality' },
    };

    const normalizedName = techName.trim();
    return techMap[normalizedName] || {
      icon: 'Code',
      category: 'Technology',
      isIconName: true
    };
  };

  // Group technologies by category
  const groupedTechnologies = () => {
    if (!project.technologies || project.technologies.length === 0) return {};

    const grouped = {};
    project.technologies.forEach(tech => {
      const techInfo = getTechnologyInfo(tech);
      const category = techInfo.category;

      if (!grouped[category]) {
        grouped[category] = [];
      }

      grouped[category].push({
        name: tech,
        ...techInfo
      });
    });

    return grouped;
  };

  // Generate key features based on project data
  const generateKeyFeatures = () => {
    const features = [];

    // Add features based on category
    switch (project.category) {
      case 'web-dev':
        features.push(
          { icon: 'Zap', title: 'High Performance', description: 'Optimized for speed and efficiency' },
          { icon: 'Shield', title: 'Secure Architecture', description: 'Built with security best practices' },
          { icon: 'Smartphone', title: 'Responsive Design', description: 'Perfect on all devices and screen sizes' },
          { icon: 'Search', title: 'SEO Optimized', description: 'Search engine friendly structure' }
        );
        break;
      case 'mobile':
        features.push(
          { icon: 'Smartphone', title: 'Native Performance', description: 'Smooth and fast user experience' },
          { icon: 'Wifi', title: 'Offline Support', description: 'Works without internet connection' },
          { icon: 'Bell', title: 'Push Notifications', description: 'Real-time user engagement' },
          { icon: 'Lock', title: 'Secure Authentication', description: 'Multi-factor authentication support' }
        );
        break;
      case 'ecommerce':
        features.push(
          { icon: 'ShoppingCart', title: 'Shopping Cart', description: 'Intuitive shopping experience' },
          { icon: 'CreditCard', title: 'Payment Integration', description: 'Multiple payment gateways' },
          { icon: 'Package', title: 'Order Management', description: 'Complete order tracking system' },
          { icon: 'BarChart3', title: 'Analytics Dashboard', description: 'Detailed sales and user analytics' }
        );
        break;
      case 'saas':
        features.push(
          { icon: 'Users', title: 'Multi-tenant Architecture', description: 'Scalable for multiple organizations' },
          { icon: 'BarChart3', title: 'Analytics & Reporting', description: 'Comprehensive data insights' },
          { icon: 'Settings', title: 'Admin Dashboard', description: 'Powerful management interface' },
          { icon: 'Zap', title: 'API Integration', description: 'Seamless third-party connections' }
        );
        break;
      default:
        features.push(
          { icon: 'Star', title: 'Modern Design', description: 'Clean and intuitive user interface' },
          { icon: 'Zap', title: 'Fast Performance', description: 'Optimized for speed and efficiency' },
          { icon: 'Shield', title: 'Reliable & Secure', description: 'Built with best practices' },
          { icon: 'Smartphone', title: 'Cross-platform', description: 'Works across all devices' }
        );
    }

    return features;
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === gallery.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? gallery.length - 1 : prev - 1
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {project.title}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  {project.client && (
                    <div className="flex items-center space-x-1">
                      <Icon name="Building" size={16} />
                      <span>{project.client}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Icon name="Calendar" size={16} />
                    <span>{project.year || new Date(project.completedDate || project.createdAt).getFullYear()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Tag" size={16} />
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                      {project.categoryName || project.category}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 ml-4"
              >
                <Icon name="X" size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col md:flex-row h-[calc(90vh-180px)]">
              {/* Left Panel - Image Gallery */}
              <div className="w-full md:w-1/2 bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8">
                <div className="relative w-full flex flex-col items-center">
                  <div className="w-full flex items-center justify-center">
                    <Image
                      src={gallery[currentImageIndex]}
                      alt={`${project.title} - Image ${currentImageIndex + 1}`}
                      className="max-h-[50vh] w-auto max-w-full rounded-xl shadow-lg border border-gray-200 bg-white"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  {/* Navigation Arrows */}
                  {gallery.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
                        style={{ zIndex: 2 }}
                      >
                        <Icon
                          name="ChevronLeft"
                          size={20}
                          className="text-gray-700"
                        />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
                        style={{ zIndex: 2 }}
                      >
                        <Icon
                          name="ChevronRight"
                          size={20}
                          className="text-gray-700"
                        />
                      </button>
                    </>
                  )}
                  {/* Image Counter */}
                  {gallery.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {gallery.length}
                    </div>
                  )}
                </div>
                {/* Thumbnails */}
                {gallery.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {gallery.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`border-2 rounded-lg p-1 transition-all duration-200 flex-shrink-0 ${idx === currentImageIndex
                            ? "border-primary shadow-md"
                            : "border-transparent opacity-70 hover:opacity-100 hover:border-gray-300"
                          }`}
                        style={{ minWidth: 56, minHeight: 40, background: "#fff" }}
                      >
                        <Image
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-14 h-10 object-cover rounded"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Panel - Details */}
              <div className="w-full md:w-1/2 flex flex-col">
                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {/* Overview Tab */}
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-gray-900">
                          Project Overview
                        </h3>
                        <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                          {project.projectOverview || project.fullDescription || project.description || project.excerpt ||
                            `${project.title} is a comprehensive ${project.categoryName?.toLowerCase() || 'digital'} solution designed to deliver exceptional user experience and robust functionality.`}
                        </div>
                      </div>

                      {/* Project Metrics */}
                      {project.metrics && Object.keys(project.metrics).length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3 text-gray-900">Project Impact</h4>
                          <div className="grid grid-cols-3 gap-4">
                            {Object.entries(project.metrics).map(([key, value], index) => (
                              <div key={index} className="text-center">
                                <div className="text-2xl font-bold text-primary mb-1">
                                  {value}
                                </div>
                                <div className="text-sm text-gray-600 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Technologies Section */}
                      {project.technologies && project.technologies.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                            Technologies Used
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, index) => (
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

                      {/* Project Details */}
                      <div className="grid grid-cols-1 gap-4">
                        {project.completedDate && (
                          <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-sm font-medium text-gray-500">Completion Date</span>
                            <span className="text-sm text-gray-900">
                              {new Date(project.completedDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        )}
                        {project.timeline && (
                          <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-sm font-medium text-gray-500">Timeline</span>
                            <span className="text-sm text-gray-900">{project.timeline}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-500">Status</span>
                          <span className={`text-sm px-2 py-1 rounded-full ${project.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : project.status === 'in-progress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {project.status?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Completed'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Technology Stack Tab */}
                  {activeTab === "tech" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-gray-900">
                          Technology Stack
                        </h3>
                        <p className="text-gray-600 mb-6">
                          The technologies and tools used to build this project.
                        </p>
                      </div>

                      {project.technologies && project.technologies.length > 0 ? (
                        <div className="space-y-6">
                          {Object.entries(groupedTechnologies()).map(([category, techs]) => (
                            <div key={category}>
                              <h4 className="font-semibold mb-3 text-gray-800 flex items-center space-x-2">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <span>{category}</span>
                              </h4>
                              <div className="grid grid-cols-1 gap-3">
                                {techs.map((tech, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-primary/20 hover:bg-primary/5 transition-all duration-200"
                                  >
                                    {tech.isIconName ? (
                                      <Icon
                                        name={tech.icon}
                                        size={24}
                                        className="text-primary flex-shrink-0"
                                      />
                                    ) : (
                                      <img
                                        src={tech.icon}
                                        alt={tech.name}
                                        className="w-6 h-6 flex-shrink-0"
                                        onError={(e) => {
                                          e.target.style.display = 'none';
                                          e.target.nextSibling.style.display = 'flex';
                                        }}
                                      />
                                    )}
                                    <Icon
                                      name="Code"
                                      size={24}
                                      className="text-primary flex-shrink-0 hidden"
                                    />
                                    <div className="flex-1">
                                      <span className="text-sm font-medium text-gray-900">
                                        {tech.name}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Icon name="Code" size={48} className="text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No technology information available</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Key Features Tab */}
                  {activeTab === "features" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-gray-900">
                          Key Features
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Highlighting the main features and capabilities of this project.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {generateKeyFeatures().map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start space-x-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/10 hover:border-primary/20 transition-all duration-200"
                          >
                            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Icon
                                name={feature.icon}
                                size={20}
                                className="text-primary"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">
                                {feature.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {feature.description}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      {(project.liveDomainLink || project.liveUrl) && project.liveDomainLink !== "#" && project.liveUrl !== "#" && (
                        <Button
                          variant="primary"
                          iconName="ExternalLink"
                          iconPosition="right"
                          onClick={() => window.open(project.liveDomainLink || project.liveUrl, "_blank")}
                          className="bg-primary hover:bg-primary/90"
                        >
                          View Live Site
                        </Button>
                      )}
                      {project.caseStudyUrl && (
                        <Button
                          variant="outline"
                          iconName="FileText"
                          iconPosition="left"
                          onClick={() =>
                            window.open(project.caseStudyUrl, "_blank")
                          }
                        >
                          Case Study
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button
                          variant="ghost"
                          iconName="Github"
                          iconPosition="left"
                          onClick={() =>
                            window.open(project.githubUrl, "_blank")
                          }
                        >
                          Source Code
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {project.timeline && (
                        <div className="flex items-center space-x-2">
                          <Icon name="Clock" size={14} />
                          <span>{project.timeline}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Icon name="Eye" size={14} />
                        <span>Project Details</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
