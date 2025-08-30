import express from 'express';
import { uploadResumeToCloudinary, validateResumeFile } from '../utils/resumeUpload.js';

const router = express.Router();

// @route   POST /api/upload-resume
// @desc    Upload resume to Cloudinary
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { file, fileName, applicantName } = req.body;

    // Validate request body
    if (!file || !fileName) {
      return res.status(400).json({
        success: false,
        message: 'File and fileName are required'
      });
    }

    // Validate the resume file
    const validation = validateResumeFile({ file, fileName });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Resume validation failed',
        errors: validation.errors
      });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadResumeToCloudinary(file, fileName, applicantName || 'Unknown');

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      data: {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        fileName: uploadResult.fileName,
        folder: uploadResult.folder
      }
    });

  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload resume',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router; 