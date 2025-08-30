import React, { useState } from "react";
import Icon from "./AppIcon";
import Button from "./ui/Button";
import { uploadResumeToCloudinary, submitJobApplication } from "../utils/resumeUpload.js";

const JobApplicationModal = ({ job, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    currentPosition: "",
    experience: "",
    expectedSalary: "",
    currentLocation: "",
    willingToRelocate: false,
    skills: [],
    consentToProcess: false
  });

  const [resume, setResume] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [skillInput, setSkillInput] = useState("");

  const experienceOptions = [
    "0-1 years",
    "1-3 years",
    "3-5 years",
    "5-10 years",
    "10+ years"
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSkillInputChange = (e) => {
    setSkillInput(e.target.value);
  };

  const handleSkillInputKeyDown = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      addSkill(skillInput.trim());
    }
  };

  const addSkill = (skill) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
      setSkillInput("");
      if (errors.skills) {
        setErrors(prev => ({
          ...prev,
          skills: ""
        }));
      }
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          resume: "Please upload a PDF file"
        }));
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          resume: "File size must be less than 5MB"
        }));
        return;
      }

      setResume(file);
      setErrors(prev => ({
        ...prev,
        resume: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Personal Information Validation
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Professional Information Validation
    if (!formData.experience) newErrors.experience = "Experience level is required";
    if (!formData.currentLocation.trim()) newErrors.currentLocation = "Current location is required";
    if (formData.skills.length === 0) newErrors.skills = "At least one skill is required";
    if (!resume) newErrors.resume = "Resume is required";
    if (!formData.consentToProcess) newErrors.consentToProcess = "Consent to process data is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Add job information to form data
      const applicationData = {
        ...formData,
        jobId: job._id,
        jobTitle: job.title
      };

      let resumeUrl = null;
      let resumeData = null;

      // Step 1: Upload resume to Cloudinary first
      if (resume) {
        try {
          const applicantName = `${formData.firstName} ${formData.lastName}`;
          const uploadResult = await uploadResumeToCloudinary(resume, applicantName);
          resumeUrl = uploadResult.data.url;
          resumeData = uploadResult.data;
        } catch (uploadError) {
          console.error('Resume upload failed:', uploadError);
          setErrors(prev => ({ 
            ...prev, 
            resume: uploadError.message || 'Failed to upload resume. Please try again.' 
          }));
          setIsSubmitting(false);
          return;
        }
      }

      // Step 2: Submit application with resume data
      const result = await submitJobApplication(applicationData, resumeData);

      setIsSubmitting(false);
      
      // Call the onSubmit callback with the result
      if (onSubmit) {
        onSubmit(applicationData, resumeData);
      }
      
      // Close the modal
      if (onClose) {
        onClose();
      }
    } catch (err) {
      setIsSubmitting(false);
      
      // Enhanced error handling for duplicate applications
      let errorMessage = err.message || 'Failed to submit application. Please try again.';
      
      if (err.errorType) {
        // Set specific field errors for duplicate applications
        if (err.errorType === 'duplicate_email') {
          setErrors(prev => ({ 
            ...prev, 
            email: 'This email has already been used for an application to this position',
            submit: errorMessage
          }));
        } else if (err.errorType === 'duplicate_phone') {
          setErrors(prev => ({ 
            ...prev, 
            phone: 'This phone number has already been used for an application to this position',
            submit: errorMessage
          }));
        } else {
          setErrors(prev => ({ 
            ...prev, 
            submit: errorMessage
          }));
        }
      } else {
        setErrors(prev => ({ 
          ...prev, 
          submit: errorMessage
        }));
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[95vh] shadow-2xl flex flex-col relative">
        {/* Loading Overlay */}
        {isSubmitting && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex items-center justify-center rounded-3xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Submitting Application...</h3>
              <p className="text-slate-600">Please wait while we process your application</p>
            </div>
          </div>
        )}

        {/* Enhanced Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-slate-200 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Icon name="Briefcase" size={24} className="text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Apply for {job?.title}</h2>
                <p className="text-slate-600 mt-1 flex items-center gap-2">
                  <Icon name="MapPin" size={16} />
                  {job?.department} • {job?.location}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-slate-100 rounded-2xl transition-colors duration-200"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        {/* Enhanced Content */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Part 1: Personal Information */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500 rounded-xl">
                      <Icon name="User" size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Personal Information</h3>
                      <p className="text-slate-600 text-sm">Tell us about yourself</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">First Name *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors ${errors.firstName ? 'border-red-300 bg-red-50' : 'border-slate-300 focus:border-blue-500'
                            }`}
                          placeholder="Enter your first name"
                        />
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Last Name *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors ${errors.lastName ? 'border-red-300 bg-red-50' : 'border-slate-300 focus:border-blue-500'
                            }`}
                          placeholder="Enter your last name"
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors ${errors.email ? 'border-red-300 bg-red-50' : 'border-slate-300 focus:border-blue-500'
                            }`}
                          placeholder="Enter your email address"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors ${errors.phone ? 'border-red-300 bg-red-50' : 'border-slate-300 focus:border-blue-500'
                            }`}
                          placeholder="Enter your phone number"
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                      </div>
                    </div>
                    
                    {/* Application Policy Notice */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Icon name="Info" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">One Application Per Position</p>
                          <p className="text-blue-700">You can only submit one application per position using your email and phone number. If you've already applied, please contact us for assistance.</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Current Position</label>
                      <input
                        type="text"
                        name="currentPosition"
                        value={formData.currentPosition}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                        placeholder="e.g., Senior Frontend Developer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Part 2: Professional Information */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-500 rounded-xl">
                      <Icon name="Zap" size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Professional Details</h3>
                      <p className="text-slate-600 text-sm">Your experience and skills</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Experience Level *</label>
                        <select
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-colors ${errors.experience ? 'border-red-300 bg-red-50' : 'border-slate-300 focus:border-green-500'
                            }`}
                        >
                          <option value="">Select experience level</option>
                          {experienceOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Expected Salary</label>
                        <input
                          type="text"
                          name="expectedSalary"
                          value={formData.expectedSalary}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
                          placeholder="e.g., 50,000 - 80,000 INR/month"
                        />
                        <p className="text-xs text-slate-500 mt-1">Please specify in INR/per month</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Current Location *</label>
                      <input
                        type="text"
                        name="currentLocation"
                        value={formData.currentLocation}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-colors ${errors.currentLocation ? 'border-red-300 bg-red-50' : 'border-slate-300 focus:border-green-500'
                          }`}
                        placeholder="e.g., Mumbai, Maharashtra"
                      />
                      {errors.currentLocation && <p className="text-red-500 text-sm mt-1">{errors.currentLocation}</p>}
                    </div>

                    <div className="flex items-center p-3 bg-white rounded-xl border border-slate-200">
                      <input
                        type="checkbox"
                        name="willingToRelocate"
                        checked={formData.willingToRelocate}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-green-500 border-slate-300 rounded focus:ring-green-500/20"
                      />
                      <label className="ml-3 text-sm text-slate-700">I am willing to relocate for this position</label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Skills *</label>
                      <div className={`w-full px-4 py-3 border rounded-xl focus-within:ring-2 focus-within:ring-green-500/20 transition-colors ${errors.skills ? 'border-red-300 bg-red-50' : 'border-slate-300 focus-within:border-green-500'
                        }`}>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {formData.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 border border-green-200"
                            >
                              {skill}
                              <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="ml-2 text-green-600 hover:text-green-800 transition-colors"
                              >
                                <Icon name="X" size={14} />
                              </button>
                            </span>
                          ))}
                        </div>
                        <input
                          type="text"
                          value={skillInput}
                          onChange={handleSkillInputChange}
                          onKeyDown={handleSkillInputKeyDown}
                          placeholder="Type a skill and press Enter to add..."
                          className="w-full border-none outline-none bg-transparent text-slate-700 placeholder-slate-400"
                        />
                      </div>
                      {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
                      <p className="text-xs text-slate-500 mt-1">Press Enter to add each skill</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Width Sections */}
            <div className="mt-8 space-y-6">
              {/* Resume Upload */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-500 rounded-xl">
                    <Icon name="FileText" size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Resume Upload</h3>
                    <p className="text-slate-600 text-sm">Upload your resume in PDF, DOC, or DOCX format</p>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className={`w-full px-6 py-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors flex flex-col items-center justify-center space-y-3 hover:border-purple-400 hover:bg-purple-50 ${errors.resume ? 'border-red-300 bg-red-50' : 'border-purple-300'
                      }`}
                  >
                    <Icon name="Upload" size={32} className="text-purple-500" />
                    <div className="text-center">
                      <span className="text-slate-700 font-medium">
                        {resume ? resume.name : 'Click to upload resume'}
                      </span>
                      <p className="text-sm text-slate-500 mt-1">PDF Only • Max 5MB</p>
                    </div>
                  </label>
                </div>
                {errors.resume && <p className="text-red-500 text-sm mt-2">{errors.resume}</p>}
              </div>

              {/* Consent */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="consentToProcess"
                    checked={formData.consentToProcess}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-orange-500 border-slate-300 rounded focus:ring-orange-500/20 mt-1"
                  />
                  <div className="ml-4">
                    <label className="text-sm text-slate-700">
                      <span className="font-semibold">I consent to the processing of my personal data *</span>
                      <br />
                      <span className="text-slate-600">
                        I agree that my personal data will be processed for the purpose of this job application and recruitment process.
                        This includes storing and processing my information for evaluation and communication purposes.
                      </span>
                    </label>
                  </div>
                </div>
                {errors.consentToProcess && <p className="text-red-500 text-sm mt-2">{errors.consentToProcess}</p>}
              </div>
            </div>
          </div>

          {/* Enhanced Footer */}
          <div className="flex-shrink-0 bg-gradient-to-r from-slate-50 to-white border-t border-slate-200 p-6 rounded-b-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Icon name="Shield" size={16} />
                <span>Your information is secure and will only be used for this application</span>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="px-6 py-3 border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  iconName={isSubmitting ? "Loader2" : "Send"}
                  iconPosition="right"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationModal;