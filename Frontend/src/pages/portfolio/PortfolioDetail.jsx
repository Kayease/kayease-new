import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { portfolioApi } from '../../utils/portfolioApi';

const PortfolioDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    loadPortfolio();
  }, [slug]);

  const loadPortfolio = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await portfolioApi.getBySlug(slug);
      setPortfolio(response.portfolio || response);
    } catch (error) {
      console.error('Error loading portfolio:', error);
      setError('Portfolio project not found.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryName = (categoryId) => {
    const categoryMap = {
      'web-dev': 'Web Development',
      'mobile': 'Mobile Development',
      'ecommerce': 'E-commerce',
      'saas': 'SaaS',
      'healthcare': 'Healthcare',
      'fintech': 'Fintech',
      'education': 'Education',
      'other': 'Other'
    };
    return categoryMap[categoryId] || categoryId;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'completed': { color: 'bg-green-100 text-green-800', label: 'Completed' },
      'in-progress': { color: 'bg-blue-100 text-blue-800', label: 'In Progress' },
      'on-hold': { color: 'bg-yellow-100 text-yellow-800', label: 'On Hold' }
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const allImages = portfolio ? [portfolio.mainImage, ...(portfolio.galleryImages || [])] : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Icon name="Loader2" size={24} className="animate-spin text-primary" />
          <span className="text-slate-600">Loading portfolio project...</span>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertCircle" size={48} className="mx-auto text-slate-400 mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Portfolio Not Found</h1>
          <p className="text-slate-600 mb-6">{error || 'The portfolio project you are looking for does not exist.'}</p>
          <Button
            variant="default"
            onClick={() => navigate('/portfolio')}
            iconName="ArrowLeft"
            iconPosition="left"
            iconSize={16}
          >
            Back to Portfolio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button
              variant="ghost"
              onClick={() => navigate('/portfolio')}
              iconName="ArrowLeft"
              iconPosition="left"
              iconSize={16}
            >
              Back to Portfolio
            </Button>
            
            <div className="flex items-center space-x-4">
              {portfolio.liveDomainLink && (
                <Button
                  variant="outline"
                  onClick={() => window.open(portfolio.liveDomainLink, '_blank')}
                  iconName="ExternalLink"
                  iconPosition="right"
                  iconSize={16}
                >
                  View Live Site
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => window.print()}
                iconName="Printer"
                iconSize={16}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{portfolio.title}</h1>
                  <p className="text-lg text-slate-600">{portfolio.excerpt}</p>
                </div>
                {portfolio.featured && (
                  <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    <Icon name="Star" size={14} fill="currentColor" />
                    <span>Featured</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                  <Icon name="Calendar" size={16} />
                  <span>{formatDate(portfolio.completedDate)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Tag" size={16} />
                  <span>{getCategoryName(portfolio.category)}</span>
                </div>
                <div>
                  {getStatusBadge(portfolio.status)}
                </div>
              </div>
            </div>

            {/* Project Images */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Project Gallery</h2>
              
              {/* Main Image Display */}
              <div className="mb-6">
                <img
                  src={allImages[selectedImageIndex]}
                  alt={`${portfolio.title} - Image ${selectedImageIndex + 1}`}
                  className="w-full h-96 object-cover rounded-lg shadow-sm"
                />
              </div>

              {/* Image Thumbnails */}
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedImageIndex === index 
                          ? 'border-primary shadow-md' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Project Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Project Overview</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {portfolio.projectOverview}
                </p>
              </div>
            </div>


          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Technologies */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {portfolio.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Links */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Project Links</h3>
              <div className="space-y-3">
                {portfolio.liveDomainLink && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open(portfolio.liveDomainLink, '_blank')}
                    iconName="ExternalLink"
                    iconPosition="left"
                    iconSize={16}
                  >
                    View Live Site
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/contact')}
                  iconName="MessageCircle"
                  iconPosition="left"
                  iconSize={16}
                >
                  Discuss Similar Project
                </Button>
              </div>
            </div>

            {/* Project Info */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Project Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Category:</span>
                  <span className="font-medium text-slate-900">{getCategoryName(portfolio.category)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Status:</span>
                  <div>{getStatusBadge(portfolio.status)}</div>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Completed:</span>
                  <span className="font-medium text-slate-900">{formatDate(portfolio.completedDate)}</span>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Interested in a Similar Project?</h3>
              <p className="text-primary-100 mb-4 text-sm">
                Let's discuss how we can bring your vision to life with cutting-edge technology and innovative solutions.
              </p>
              <Button
                variant="secondary"
                className="w-full bg-white text-primary hover:bg-slate-50"
                onClick={() => navigate('/contact')}
                iconName="ArrowRight"
                iconPosition="right"
                iconSize={16}
              >
                Start Your Project
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetail;