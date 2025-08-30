import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { toast } from 'react-toastify';
import { validateCareerForm, validateSkill, sanitizeCareerData, getFieldCharacterCount } from '../../utils/careerValidation';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CareerForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    department: 'engineering',
    jobType: 'in-office',
    location: 'Jaipur, Rajasthan',
    experience: '',
    salary: '',
    description: '',
    requirements: [''],
    responsibilities: [''],
    benefits: [''],
    skills: [],
    status: 'active'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [fullScreenLoader, setFullScreenLoader] = useState({ show: false, message: '' });

  const departments = [
    { id: 'engineering', name: 'Engineering' },
    { id: 'design', name: 'Design' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'sales', name: 'Sales' },
    { id: 'operations', name: 'Operations' },
    { id: 'other', name: 'Other' }
  ];

  const jobTypes = [
    { id: 'remote', name: 'Remote' },
    { id: 'hybrid', name: 'Hybrid' },
    { id: 'in-office', name: 'In Office' }
  ];

  useEffect(() => {
    if (isEditing && id) {
      setFullScreenLoader({ show: true, message: 'Loading career data...' });
      fetch(`${BACKEND_URL}/api/careers/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            throw new Error(data.error);
          }
          setFormData({
            title: data.title || '',
            department: data.department || 'engineering',
            jobType: data.jobType || 'in-office',
            location: data.location || 'Jaipur, Rajasthan',
            experience: data.experience || '',
            salary: data.salary || '',
            description: data.description || '',
            requirements: data.requirements && data.requirements.length > 0 ? data.requirements : [''],
            responsibilities: data.responsibilities && data.responsibilities.length > 0 ? data.responsibilities : [''],
            benefits: data.benefits && data.benefits.length > 0 ? data.benefits : [''],
            skills: data.skills || [],
            status: data.status || 'active'
          });
          setFullScreenLoader({ show: false, message: '' });
        })
        .catch(err => {
          console.error('Error loading career:', err);
          toast.error('Failed to load career data');
          setFullScreenLoader({ show: false, message: '' });
          navigate('/admin/careers');
        });
    }
  }, [isEditing, id, navigate]);

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

  const handleAddSkill = () => {
    const trimmedSkill = skillInput.trim();
    
    // Validate skill
    const validationError = validateSkill(trimmedSkill);
    if (validationError) {
      setErrors(prev => ({ ...prev, skillInput: validationError }));
      return;
    }
    
    // Check for duplicates (case insensitive)
    const isDuplicate = formData.skills.some(
      skill => skill.toLowerCase() === trimmedSkill.toLowerCase()
    );
    
    if (isDuplicate) {
      setErrors(prev => ({ ...prev, skillInput: 'This skill is already added' }));
      return;
    }
    
    // Check maximum limit
    if (formData.skills.length >= 20) {
      setErrors(prev => ({ ...prev, skillInput: 'Maximum 20 skills allowed' }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, trimmedSkill]
    }));
    setSkillInput('');
    setErrors(prev => ({ ...prev, skillInput: '', skills: '' }));
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleRequirementChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }));
  };

  const handleAddRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const handleRemoveRequirement = (index) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const handleResponsibilityChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.map((resp, i) => i === index ? value : resp)
    }));
  };

  const handleAddResponsibility = () => {
    setFormData(prev => ({
      ...prev,
      responsibilities: [...prev.responsibilities, '']
    }));
  };

  const handleRemoveResponsibility = (index) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index)
    }));
  };

  const handleBenefitChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.map((benefit, i) => i === index ? value : benefit)
    }));
  };

  const handleAddBenefit = () => {
    setFormData(prev => ({
      ...prev,
      benefits: [...prev.benefits, '']
    }));
  };

  const handleRemoveBenefit = (index) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const sanitizedData = sanitizeCareerData(formData);
    const validation = validateCareerForm(sanitizedData);
    
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setFullScreenLoader({ 
      show: true, 
      message: isEditing ? 'Updating career...' : 'Creating career...' 
    });

    try {
      const sanitizedData = sanitizeCareerData(formData);

      const url = isEditing 
        ? `${BACKEND_URL}/api/careers/${id}` 
        : `${BACKEND_URL}/api/careers`;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'create'} career`);
      }

      toast.success(`Career ${isEditing ? 'updated' : 'created'} successfully!`);
      
      setTimeout(() => {
        setFullScreenLoader({ show: false, message: '' });
        navigate('/admin/careers');
      }, 1000);
    } catch (error) {
      console.error('Error saving career:', error);
      toast.error(error.message || `Failed to ${isEditing ? 'update' : 'create'} career`);
      setFullScreenLoader({ show: false, message: '' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {fullScreenLoader.show && (
        <div className="fixed inset-0 bg-black/40 z-50 flex flex-col items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg px-8 py-6 flex flex-col items-center">
            <Icon name="Loader2" size={32} className="animate-spin mb-2 text-primary" />
            <span className="text-lg font-semibold text-slate-700">{fullScreenLoader.message}</span>
          </div>
        </div>
      )}
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin/careers')}
                iconName="ArrowLeft"
                iconPosition="left"
                iconSize={16}
              >
                Back to Careers
              </Button>
              <div className="h-6 w-px bg-slate-300"></div>
              <h1 className="text-xl font-semibold text-slate-800">
                {isEditing ? 'Edit Job Opening' : 'Create New Job Opening'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/careers')}
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
{isLoading 
                  ? (isEditing ? 'Updating...' : 'Creating...') 
                  : (isEditing ? 'Update Career' : 'Create Career')
                }
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
                      errors.title ? 'border-red-300 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="e.g. Senior Full Stack Developer"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-slate-700 mb-2">
                    Department
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="jobType" className="block text-sm font-medium text-slate-700 mb-2">
                    Job Type
                  </label>
                  <select
                    id="jobType"
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {jobTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
                      errors.location ? 'border-red-300 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="e.g. Bangalore"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-slate-700 mb-2">
                    Experience Level
                  </label>
                  <input
                    type="text"
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="e.g. 3-5 years"
                  />
                </div>

                <div>
                  <label htmlFor="salary" className="block text-sm font-medium text-slate-700 mb-2">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    id="salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="e.g. ₹80,000 - ₹120,000"
                  />
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Job Description *</h3>
              <textarea
                name="description"
                rows={6}
                value={formData.description}
                onChange={handleInputChange}
                maxLength={2000}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
                  errors.description ? 'border-red-300 bg-red-50' : 'border-slate-300'
                }`}
                placeholder="Describe the role, team, and what the candidate will be working on..."
              />
              <div className="flex justify-between items-center mt-1">
                {errors.description ? (
                  <p className="text-sm text-red-600">{errors.description}</p>
                ) : (
                  <div></div>
                )}
                <span className={`text-xs ${
                  formData.description.length > 1800 ? 'text-red-500' : 'text-slate-500'
                }`}>
                  {formData.description.length}/2000
                </span>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Requirements *</h3>
              <div className="space-y-3">
                {formData.requirements.map((requirement, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={requirement}
                      onChange={(e) => handleRequirementChange(index, e.target.value)}
                      maxLength={200}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Enter requirement..."
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveRequirement(index)}
                      iconName="X"
                      iconSize={14}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddRequirement}
                  iconName="Plus"
                  iconPosition="left"
                  iconSize={14}
                >
                  Add Requirement
                </Button>
              </div>
              {errors.requirements && (
                <p className="mt-2 text-sm text-red-600">{errors.requirements}</p>
              )}
            </div>

            {/* Responsibilities */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Responsibilities</h3>
              <div className="space-y-3">
                {formData.responsibilities.map((responsibility, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={responsibility}
                      onChange={(e) => handleResponsibilityChange(index, e.target.value)}
                      maxLength={200}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Enter responsibility..."
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveResponsibility(index)}
                      iconName="X"
                      iconSize={14}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddResponsibility}
                  iconName="Plus"
                  iconPosition="left"
                  iconSize={14}
                >
                  Add Responsibility
                </Button>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Benefits</h3>
              <div className="space-y-3">
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => handleBenefitChange(index, e.target.value)}
                      maxLength={200}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Enter benefit..."
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveBenefit(index)}
                      iconName="X"
                      iconSize={14}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddBenefit}
                  iconName="Plus"
                  iconPosition="left"
                  iconSize={14}
                >
                  Add Benefit
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Status</h3>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Required Skills *</h3>
              
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => {
                    setSkillInput(e.target.value);
                    if (errors.skillInput) {
                      setErrors(prev => ({ ...prev, skillInput: '' }));
                    }
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                    errors.skillInput ? 'border-red-300 bg-red-50' : 'border-slate-300'
                  }`}
                  placeholder="Add skill..."
                  maxLength={50}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSkill}
                  iconName="Plus"
                  iconSize={14}
                />
              </div>
              
              {errors.skillInput && (
                <p className="mb-2 text-sm text-red-600">{errors.skillInput}</p>
              )}

              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 text-primary/60 hover:text-primary"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                ))}
              </div>
              
              {errors.skills && (
                <p className="mt-2 text-sm text-red-600">{errors.skills}</p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CareerForm;