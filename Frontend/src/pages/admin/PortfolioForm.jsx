import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { portfolioApi } from '../../utils/portfolioApi';
import { validatePortfolioForm, validateTechnology, sanitizeFormData, getFieldCharacterCount } from '../../utils/portfolioValidation';

const PortfolioForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    projectOverview: '',
    technologies: [],
    liveDomainLink: '',
    completedDate: '',
    mainImage: null,
    galleryImages: [],
    status: 'completed',
    category: 'web-dev',
    featured: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [galleryImagePreviews, setGalleryImagePreviews] = useState([]);
  const [removedGalleryImages, setRemovedGalleryImages] = useState([]);
  const [removedGalleryImagePublicIds, setRemovedGalleryImagePublicIds] = useState([]);

  const categories = [
    { id: 'web-dev', name: 'Web Development' },
    { id: 'mobile', name: 'Mobile Development' },
    { id: 'ecommerce', name: 'E-commerce' },
    { id: 'saas', name: 'SaaS' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'fintech', name: 'Fintech' },
    { id: 'education', name: 'Education' },
    { id: 'other', name: 'Other' }
  ];

  useEffect(() => {
    // If editing, load project data from API
    if (isEditing && id) {
      loadProjectData();
    }
  }, [isEditing, id]);

  const loadProjectData = async () => {
    setIsLoadingData(true);
    try {
      const response = await portfolioApi.getById(id);
      const project = response.portfolio || response;
      
      setFormData({
        title: project.title || '',
        excerpt: project.excerpt || '',
        projectOverview: project.projectOverview || '',
        technologies: project.technologies || [],
        liveDomainLink: project.liveDomainLink || '',
        completedDate: project.completedDate ? project.completedDate.split('T')[0] : '',
        mainImage: project.mainImage || null,
        galleryImages: project.galleryImages || [],
        status: project.status || 'completed',
        category: project.category || 'web-dev',
        featured: project.featured || false,
        mainImagePublicId: project.mainImagePublicId || '',
        galleryImagePublicIds: project.galleryImagePublicIds || []
      });
      
      setMainImagePreview(project.mainImage || '');
      setGalleryImagePreviews(project.galleryImages || []);
    } catch (error) {
      console.error('Error loading project data:', error);
      setErrors({ general: 'Failed to load project data. Please try again.' });
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddTechnology = () => {
    const trimmedTech = techInput.trim();
    
    // Validate technology
    const validationError = validateTechnology(trimmedTech);
    if (validationError) {
      setErrors(prev => ({ ...prev, techInput: validationError }));
      return;
    }
    
    // Check for duplicates (case insensitive)
    const isDuplicate = formData.technologies.some(
      tech => tech.toLowerCase() === trimmedTech.toLowerCase()
    );
    
    if (isDuplicate) {
      setErrors(prev => ({ ...prev, techInput: 'This technology is already added' }));
      return;
    }
    
    // Check maximum limit
    if (formData.technologies.length >= 20) {
      setErrors(prev => ({ ...prev, techInput: 'Maximum 20 technologies allowed' }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      technologies: [...prev.technologies, trimmedTech]
    }));
    setTechInput('');
    setErrors(prev => ({ ...prev, techInput: '', technologies: '' }));
  };

  const handleRemoveTechnology = (techToRemove) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
    }));
  };

  const handleMainImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        mainImage: file
      }));
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      
      setFormData(prev => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...files]
      }));
      setGalleryImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveGalleryImage = (index) => {
    const imageToRemove = formData.galleryImages[index];
    const publicIdToRemove = formData.galleryImagePublicIds?.[index];
    
    // If it's an existing image (string URL), add to removed arrays
    if (typeof imageToRemove === 'string') {
      setRemovedGalleryImages(prev => [...prev, imageToRemove]);
      if (publicIdToRemove) {
        setRemovedGalleryImagePublicIds(prev => [...prev, publicIdToRemove]);
      }
    }
    
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
      galleryImagePublicIds: prev.galleryImagePublicIds?.filter((_, i) => i !== index) || []
    }));
    setGalleryImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const sanitizedData = sanitizeFormData(formData);
    const validation = validatePortfolioForm(sanitizedData);
    
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const sanitizedData = sanitizeFormData(formData);
      const submitData = {
        ...sanitizedData,
        removedGalleryImages,
        removedGalleryImagePublicIds
      };

      if (isEditing) {
        await portfolioApi.update(id, submitData);
      } else {
        await portfolioApi.create(submitData);
      }
      
      navigate('/admin/portfolio');
    } catch (error) {
      console.error('Error saving project:', error);
      setErrors({ 
        general: error.message || 'Failed to save project. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin/portfolio')}
                iconName="ArrowLeft"
                iconPosition="left"
                iconSize={16}
              >
                Back to Portfolio
              </Button>
              <div className="h-6 w-px bg-slate-300"></div>
              <h1 className="text-xl font-semibold text-slate-800">
                {isEditing ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/portfolio')}
                disabled={isLoading}
                iconName="X"
                iconPosition="left"
                iconSize={16}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                className="cta-button text-white font-medium"
                onClick={handleSubmit}
                disabled={isLoading}
                iconName={isLoading ? "Loader2" : "Save"}
                iconPosition="left"
                iconSize={16}
              >
                {isLoading ? 'Saving...' : 'Save Project'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoadingData && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <Icon name="Loader2" size={20} className="animate-spin text-primary" />
              <span className="text-slate-600">Loading project data...</span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {errors.general && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <Icon name="AlertCircle" size={20} className="text-red-500 mr-3" />
              <p className="text-red-700">{errors.general}</p>
            </div>
          </div>
        )}

        {!isLoadingData && (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    maxLength={100}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
                      errors.title ? 'border-red-300 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="e.g. HealthCare Pro Dashboard"
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.title ? (
                      <p className="text-sm text-red-600">{errors.title}</p>
                    ) : (
                      <div></div>
                    )}
                    <span className={`text-xs ${
                      formData.title.length > 90 ? 'text-red-500' : 'text-slate-500'
                    }`}>
                      {formData.title.length}/100
                    </span>
                  </div>
                </div>



                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="completedDate" className="block text-sm font-medium text-slate-700 mb-2">
                    Completion Date *
                  </label>
                  <input
                    type="date"
                    id="completedDate"
                    name="completedDate"
                    value={formData.completedDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
                      errors.completedDate ? 'border-red-300 bg-red-50' : 'border-slate-300'
                    }`}
                  />
                  {errors.completedDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.completedDate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Project Description */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Project Description</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium text-slate-700 mb-2">
                    Excerpt (2 lines) *
                  </label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    rows={2}
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    maxLength={300}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
                      errors.excerpt ? 'border-red-300 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="Brief description of the project (2 lines for card display)..."
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.excerpt ? (
                      <p className="text-sm text-red-600">{errors.excerpt}</p>
                    ) : (
                      <div></div>
                    )}
                    <span className={`text-xs ${
                      formData.excerpt.length > 270 ? 'text-red-500' : 'text-slate-500'
                    }`}>
                      {formData.excerpt.length}/300
                    </span>
                  </div>
                </div>

                <div>
                  <label htmlFor="projectOverview" className="block text-sm font-medium text-slate-700 mb-2">
                    Project Overview *
                  </label>
                  <textarea
                    id="projectOverview"
                    name="projectOverview"
                    rows={6}
                    value={formData.projectOverview}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
                      errors.projectOverview ? 'border-red-300 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="Detailed description of the project, features, and functionality..."
                  />
                  {errors.projectOverview && (
                    <p className="mt-1 text-sm text-red-600">{errors.projectOverview}</p>
                  )}
                </div>


              </div>
            </div>

            {/* Technologies */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Technologies Used *</h3>
              
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => {
                    setTechInput(e.target.value);
                    if (errors.techInput) {
                      setErrors(prev => ({ ...prev, techInput: '' }));
                    }
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
                  className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                    errors.techInput ? 'border-red-300 bg-red-50' : 'border-slate-300'
                  }`}
                  placeholder="Add technology..."
                  maxLength={50}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddTechnology}
                  iconName="Plus"
                  iconSize={14}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveTechnology(tech)}
                      className="ml-2 text-primary/60 hover:text-primary"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                ))}
              </div>
              
              {errors.techInput && (
                <p className="mt-2 text-sm text-red-600">{errors.techInput}</p>
              )}
              {errors.technologies && (
                <p className="mt-2 text-sm text-red-600">{errors.technologies}</p>
              )}
              <div className="mt-2 text-xs text-slate-500">
                {formData.technologies.length}/20 technologies added
              </div>
            </div>

            {/* Live Domain Link */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Live Domain Link</h3>
              <input
                type="url"
                name="liveDomainLink"
                value={formData.liveDomainLink}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="https://example.com"
              />
              <p className="mt-1 text-xs text-slate-500">
                Optional: Add the live URL if the project is deployed
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Featured */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Project Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="on-hold">On Hold</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="h-4 w-4 text-primary focus:ring-primary/20 border-slate-300 rounded"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-slate-700">
                    Featured Project
                  </label>
                </div>
              </div>
            </div>

            {/* Main Image */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Main Project Image *</h3>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-primary/50 transition-colors duration-200">
                  <input
                    type="file"
                    id="mainImage"
                    accept="image/*"
                    onChange={handleMainImageChange}
                    className="hidden"
                  />
                  <label htmlFor="mainImage" className="cursor-pointer">
                    <Icon name="Upload" size={32} className="mx-auto text-slate-400 mb-2" />
                    <p className="text-sm text-slate-600">
                      Click to upload main project image
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Recommended: 800x600px, JPG/PNG
                    </p>
                  </label>
                </div>

                {mainImagePreview && (
                  <div className="relative">
                    <img
                      src={mainImagePreview}
                      alt="Main project preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setMainImagePreview('');
                        setFormData(prev => ({ ...prev, mainImage: null }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </div>
                )}
              </div>
              
              {errors.mainImage && (
                <p className="mt-2 text-sm text-red-600">{errors.mainImage}</p>
              )}
            </div>

            {/* Gallery Images */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Gallery Images</h3>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-primary/50 transition-colors duration-200">
                  <input
                    type="file"
                    id="galleryImages"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryImageChange}
                    className="hidden"
                  />
                  <label htmlFor="galleryImages" className="cursor-pointer">
                    <Icon name="Image" size={32} className="mx-auto text-slate-400 mb-2" />
                    <p className="text-sm text-slate-600">
                      Click to upload gallery images
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Up to 3 additional images
                    </p>
                  </label>
                </div>

                {galleryImagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {galleryImagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <Icon name="X" size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default PortfolioForm; 