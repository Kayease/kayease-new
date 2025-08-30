/**
 * Resume Upload Utility
 * Process: Upload to Cloudinary first, then send form data with resume URL to backend
 */

/**
 * Upload resume to Cloudinary
 * @param {File} file - The resume file (PDF only)
 * @param {string} applicantName - Applicant's name for folder structure
 * @returns {Promise<Object>} Cloudinary upload result with URL
 * 
 * 
 */

const API_URL = import.meta.env.VITE_BACKEND_URL;


export const uploadResumeToCloudinary = async (file, applicantName) => {
  try {
    // Validate file type
    if (file.type !== 'application/pdf') {
      throw new Error('Only PDF files are allowed');
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }

    // Convert file to base64
    const base64Data = await fileToBase64(file);
    
    // Upload to Cloudinary via backend
    const response = await fetch(`${API_URL}/api/upload-resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: base64Data,
        fileName: file.name,
        applicantName: applicantName
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload resume');
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Error uploading resume:', error);
    throw error;
  }
};

/**
 * Convert file to base64 string
 * @param {File} file - The file to convert
 * @returns {Promise<string>} Base64 string
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Submit job application with resume data
 * @param {Object} formData - The form data
 * @param {Object} resumeData - The Cloudinary resume data (url, publicId, fileName, folder)
 * @returns {Promise<Object>} API response
 */
export const submitJobApplication = async (formData, resumeData) => {
  try {
    const submitData = {
      ...formData,
      skills: Array.isArray(formData.skills) ? formData.skills.join(', ') : formData.skills || '',
      willingToRelocate: formData.willingToRelocate.toString(),
      consentToProcess: formData.consentToProcess.toString()
    };

    // Add resume data if available
    if (resumeData) {
      submitData.resumeUrl = resumeData.url;
      submitData.resumeCloudinaryId = resumeData.publicId;
      submitData.resumeFileName = resumeData.fileName;
      submitData.resumeFolder = resumeData.folder;
    }

    
    const response = await fetch(`${API_URL}/api/job-applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submitData)
    });

    const result = await response.json();

    if (!response.ok) {
      // Enhanced error handling for duplicate applications
      if (result.errorType) {
        const errorMessages = {
          'duplicate_email': 'An application with this email address has already been submitted for this position. Please use a different email or contact us if you believe this is an error.',
          'duplicate_phone': 'An application with this phone number has already been submitted for this position. Please use a different phone number or contact us if you believe this is an error.',
          'recent_application_email': 'You have already applied for another position recently. Please wait 24 hours before applying for a different position.',
          'recent_application_phone': 'You have already applied for another position recently. Please wait 24 hours before applying for a different position.'
        };
        
        const errorMessage = errorMessages[result.errorType] || result.message;
        const enhancedError = new Error(errorMessage);
        enhancedError.errorType = result.errorType;
        throw enhancedError;
      }
      
      throw new Error(result.message || 'Failed to submit application');
    }

    return result;
  } catch (error) {
    console.error('Error submitting job application:', error);
    throw error;
  }
};

export default {
  uploadResumeToCloudinary,
  submitJobApplication
}; 