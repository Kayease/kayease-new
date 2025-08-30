// Career form validation utilities

export const validateCareerForm = (formData) => {
  const errors = {};

  // Required field validations
  if (!formData.title?.trim()) {
    errors.title = 'Job title is required';
  } else if (formData.title.trim().length < 3) {
    errors.title = 'Job title must be at least 3 characters long';
  } else if (formData.title.trim().length > 100) {
    errors.title = 'Job title must be less than 100 characters';
  }

  if (!formData.location?.trim()) {
    errors.location = 'Location is required';
  } else if (formData.location.trim().length < 2) {
    errors.location = 'Location must be at least 2 characters long';
  } else if (formData.location.trim().length > 100) {
    errors.location = 'Location must be less than 100 characters';
  }

  if (!formData.description?.trim()) {
    errors.description = 'Job description is required';
  } else if (formData.description.trim().length < 50) {
    errors.description = 'Job description must be at least 50 characters long';
  } else if (formData.description.trim().length > 2000) {
    errors.description = 'Job description must be less than 2000 characters';
  }

  // Skills validation
  if (!formData.skills || formData.skills.length === 0) {
    errors.skills = 'At least one skill is required';
  } else if (formData.skills.length > 20) {
    errors.skills = 'Maximum 20 skills allowed';
  } else {
    // Check for duplicate skills
    const uniqueSkills = new Set(formData.skills.map(skill => skill.toLowerCase().trim()));
    if (uniqueSkills.size !== formData.skills.length) {
      errors.skills = 'Duplicate skills are not allowed';
    }
    
    // Check individual skill length
    const invalidSkills = formData.skills.filter(skill => 
      !skill.trim() || skill.trim().length > 50
    );
    if (invalidSkills.length > 0) {
      errors.skills = 'Each skill must be 1-50 characters long';
    }
  }

  // Requirements validation
  if (!formData.requirements || formData.requirements.length === 0) {
    errors.requirements = 'At least one requirement is required';
  } else {
    const validRequirements = formData.requirements.filter(req => req.trim());
    if (validRequirements.length === 0) {
      errors.requirements = 'At least one requirement is required';
    } else if (validRequirements.length > 15) {
      errors.requirements = 'Maximum 15 requirements allowed';
    } else {
      // Check individual requirement length
      const invalidRequirements = validRequirements.filter(req => 
        req.trim().length > 200
      );
      if (invalidRequirements.length > 0) {
        errors.requirements = 'Each requirement must be less than 200 characters';
      }
    }
  }

  // Optional field validations
  if (formData.experience?.trim() && formData.experience.trim().length > 50) {
    errors.experience = 'Experience level must be less than 50 characters';
  }

  if (formData.salary?.trim() && formData.salary.trim().length > 100) {
    errors.salary = 'Salary range must be less than 100 characters';
  }

  // Responsibilities validation (optional but if provided, validate)
  if (formData.responsibilities && formData.responsibilities.length > 0) {
    const validResponsibilities = formData.responsibilities.filter(resp => resp.trim());
    if (validResponsibilities.length > 15) {
      errors.responsibilities = 'Maximum 15 responsibilities allowed';
    } else {
      const invalidResponsibilities = validResponsibilities.filter(resp => 
        resp.trim().length > 200
      );
      if (invalidResponsibilities.length > 0) {
        errors.responsibilities = 'Each responsibility must be less than 200 characters';
      }
    }
  }

  // Benefits validation (optional but if provided, validate)
  if (formData.benefits && formData.benefits.length > 0) {
    const validBenefits = formData.benefits.filter(benefit => benefit.trim());
    if (validBenefits.length > 15) {
      errors.benefits = 'Maximum 15 benefits allowed';
    } else {
      const invalidBenefits = validBenefits.filter(benefit => 
        benefit.trim().length > 200
      );
      if (invalidBenefits.length > 0) {
        errors.benefits = 'Each benefit must be less than 200 characters';
      }
    }
  }

  // Department validation
  const validDepartments = ['engineering', 'design', 'marketing', 'sales', 'operations', 'other'];
  if (!validDepartments.includes(formData.department)) {
    errors.department = 'Please select a valid department';
  }

  // Job type validation
  const validJobTypes = ['remote', 'hybrid', 'in-office'];
  if (!validJobTypes.includes(formData.jobType)) {
    errors.jobType = 'Please select a valid job type';
  }

  // Status validation
  const validStatuses = ['active', 'paused', 'closed'];
  if (!validStatuses.includes(formData.status)) {
    errors.status = 'Please select a valid status';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateSkill = (skill) => {
  if (!skill || !skill.trim()) {
    return 'Skill name is required';
  }
  
  if (skill.trim().length > 50) {
    return 'Skill name must be less than 50 characters';
  }
  
  // Check for special characters (allow letters, numbers, spaces, dots, hyphens, plus signs)
  const validPattern = /^[a-zA-Z0-9\s.\-+#/]+$/;
  if (!validPattern.test(skill.trim())) {
    return 'Skill name contains invalid characters';
  }
  
  return null;
};

export const validateRequirement = (requirement) => {
  if (!requirement || !requirement.trim()) {
    return 'Requirement is required';
  }
  
  if (requirement.trim().length > 200) {
    return 'Requirement must be less than 200 characters';
  }
  
  return null;
};

export const sanitizeCareerData = (formData) => {
  return {
    ...formData,
    title: formData.title?.trim() || '',
    location: formData.location?.trim() || '',
    description: formData.description?.trim() || '',
    experience: formData.experience?.trim() || '',
    salary: formData.salary?.trim() || '',
    skills: formData.skills?.map(skill => skill.trim()).filter(skill => skill) || [],
    requirements: formData.requirements?.map(req => req.trim()).filter(req => req) || [],
    responsibilities: formData.responsibilities?.map(resp => resp.trim()).filter(resp => resp) || [],
    benefits: formData.benefits?.map(benefit => benefit.trim()).filter(benefit => benefit) || [],
    department: formData.department || 'engineering',
    jobType: formData.jobType || 'remote',
    status: formData.status || 'active'
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
  validateCareerForm,
  validateSkill,
  validateRequirement,
  sanitizeCareerData,
  getFieldCharacterCount,
  formatValidationError
};