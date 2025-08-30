// Portfolio form validation utilities

export const validatePortfolioForm = (formData) => {
  const errors = {};

  // Required field validations
  if (!formData.title?.trim()) {
    errors.title = 'Project title is required';
  } else if (formData.title.trim().length < 3) {
    errors.title = 'Project title must be at least 3 characters long';
  } else if (formData.title.trim().length > 100) {
    errors.title = 'Project title must be less than 100 characters';
  }

  if (!formData.excerpt?.trim()) {
    errors.excerpt = 'Project excerpt is required';
  } else if (formData.excerpt.trim().length < 10) {
    errors.excerpt = 'Project excerpt must be at least 10 characters long';
  } else if (formData.excerpt.trim().length > 300) {
    errors.excerpt = 'Project excerpt must be less than 300 characters';
  }

  if (!formData.projectOverview?.trim()) {
    errors.projectOverview = 'Project overview is required';
  } else if (formData.projectOverview.trim().length < 50) {
    errors.projectOverview = 'Project overview must be at least 50 characters long';
  } else if (formData.projectOverview.trim().length > 2000) {
    errors.projectOverview = 'Project overview must be less than 2000 characters';
  }



  if (!formData.completedDate) {
    errors.completedDate = 'Completion date is required';
  } else {
    const completedDate = new Date(formData.completedDate);
    const today = new Date();
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(today.getFullYear() + 1);
    
    if (completedDate > oneYearFromNow) {
      errors.completedDate = 'Completion date cannot be more than 1 year in the future';
    }
  }

  // Technologies validation
  if (!formData.technologies || formData.technologies.length === 0) {
    errors.technologies = 'At least one technology is required';
  } else if (formData.technologies.length > 20) {
    errors.technologies = 'Maximum 20 technologies allowed';
  } else {
    // Check for duplicate technologies
    const uniqueTechs = new Set(formData.technologies.map(tech => tech.toLowerCase().trim()));
    if (uniqueTechs.size !== formData.technologies.length) {
      errors.technologies = 'Duplicate technologies are not allowed';
    }
    
    // Check individual technology length
    const invalidTechs = formData.technologies.filter(tech => 
      !tech.trim() || tech.trim().length > 50
    );
    if (invalidTechs.length > 0) {
      errors.technologies = 'Each technology must be 1-50 characters long';
    }
  }

  // Main image validation
  if (!formData.mainImage) {
    errors.mainImage = 'Main project image is required';
  } else if (formData.mainImage instanceof File) {
    // Validate file size (max 5MB)
    if (formData.mainImage.size > 5 * 1024 * 1024) {
      errors.mainImage = 'Main image must be less than 5MB';
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(formData.mainImage.type)) {
      errors.mainImage = 'Main image must be JPEG, PNG, or WebP format';
    }
  }

  // Optional field validations
  if (formData.liveDomainLink?.trim()) {
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(formData.liveDomainLink.trim())) {
      errors.liveDomainLink = 'Live domain link must be a valid URL starting with http:// or https://';
    }
  }



  // Gallery images validation
  if (formData.galleryImages && formData.galleryImages.length > 0) {
    if (formData.galleryImages.length > 5) {
      errors.galleryImages = 'Maximum 5 gallery images allowed';
    }
    
    // Validate file images in gallery
    const fileImages = formData.galleryImages.filter(img => img instanceof File);
    for (let i = 0; i < fileImages.length; i++) {
      const file = fileImages[i];
      
      // Check file size (max 5MB each)
      if (file.size > 5 * 1024 * 1024) {
        errors.galleryImages = `Gallery image ${i + 1} must be less than 5MB`;
        break;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        errors.galleryImages = `Gallery image ${i + 1} must be JPEG, PNG, or WebP format`;
        break;
      }
    }
  }

  // Category validation
  const validCategories = ['web-dev', 'mobile', 'ecommerce', 'saas', 'healthcare', 'fintech', 'education', 'other'];
  if (!validCategories.includes(formData.category)) {
    errors.category = 'Please select a valid category';
  }

  // Status validation
  const validStatuses = ['completed', 'in-progress', 'on-hold'];
  if (!validStatuses.includes(formData.status)) {
    errors.status = 'Please select a valid status';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateTechnology = (technology) => {
  if (!technology || !technology.trim()) {
    return 'Technology name is required';
  }
  
  if (technology.trim().length > 50) {
    return 'Technology name must be less than 50 characters';
  }
  
  // Check for special characters (allow letters, numbers, spaces, dots, hyphens, plus signs)
  const validPattern = /^[a-zA-Z0-9\s.\-+#]+$/;
  if (!validPattern.test(technology.trim())) {
    return 'Technology name contains invalid characters';
  }
  
  return null;
};

export const sanitizeFormData = (formData) => {
  return {
    ...formData,
    title: formData.title?.trim() || '',
    excerpt: formData.excerpt?.trim() || '',
    projectOverview: formData.projectOverview?.trim() || '',
    liveDomainLink: formData.liveDomainLink?.trim() || '',
    technologies: formData.technologies?.map(tech => tech.trim()).filter(tech => tech) || [],
    featured: Boolean(formData.featured),
    status: formData.status || 'completed',
    category: formData.category || 'web-dev'
  };
};

export const getFieldCharacterCount = (value, maxLength) => {
  const currentLength = value?.length || 0;
  const remaining = maxLength - currentLength;
  const isOverLimit = remaining < 0;
  
  return {
    current: currentLength,
    max: maxLength,
    remaining: Math.abs(remaining),
    isOverLimit,
    percentage: (currentLength / maxLength) * 100
  };
};

export const formatValidationError = (error) => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

export default {
  validatePortfolioForm,
  validateTechnology,
  sanitizeFormData,
  getFieldCharacterCount,
  formatValidationError
};