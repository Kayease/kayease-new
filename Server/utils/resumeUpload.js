import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload resume to Cloudinary
 * @param {string} base64File - Base64 encoded file data
 * @param {string} fileName - Original file name
 * @param {string} applicantName - Applicant's full name for folder structure
 * @returns {Promise<Object>} Cloudinary upload result
 */
export const uploadResumeToCloudinary = async (
  base64File,
  fileName,
  applicantName
) => {
  try {
    // Validate file type
    if (!fileName.toLowerCase().endsWith(".pdf")) {
      throw new Error("Only PDF files are allowed for resume uploads");
    }

    // Create folder path: Resumes/[Applicant Name]
    const folderPath = `Resumes/${applicantName
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "_")}`;

    // Create unique public ID with timestamp
    const timestamp = Date.now();
    const publicId = `${folderPath}/resume_${timestamp}`;

    // Convert base64 to data URI for Cloudinary
    const dataURI = `data:application/pdf;base64,${base64File}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: folderPath,
      public_id: publicId,
      resource_type: "raw",
      format: "pdf",
      overwrite: false,
      unique_filename: true,
      use_filename: true,
      invalidate: true,
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      fileName: fileName,
      folder: folderPath,
    };
  } catch (error) {
    console.error("Error uploading resume to Cloudinary:", error);
    throw new Error(`Failed to upload resume: ${error.message}`);
  }
};

/**
 * Delete resume from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} Cloudinary delete result
 */
export const deleteResumeFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      throw new Error("Public ID is required for deletion");
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
    });

    // Check if deletion was successful
    if (result.result === "ok") {
      console.log("Resume successfully deleted.");
      return result;
    } else {
      throw new Error(`Cloudinary deletion failed: ${result.result}`);
    }
  } catch (error) {
    console.error("Error deleting resume from Cloudinary:", {
      publicId,
      error: error.message,
      stack: error.stack,
    });
    throw new Error(
      `Failed to delete resume from Cloudinary: ${error.message}`
    );
  }
};

/**
 * Delete entire user folder from Cloudinary
 * @param {string} folderPath - Cloudinary folder path (e.g., "Resumes/John_Doe")
 * @returns {Promise<Object>} Cloudinary delete result
 */
export const deleteUserFolderFromCloudinary = async (folderPath) => {
  try {
    if (!folderPath) {
      throw new Error("Folder path is required for deletion");
    }

    // List all resources in the folder
    const listResult = await cloudinary.api.resources({
      type: "upload",
      prefix: folderPath,
      resource_type: "raw",
      max_results: 1000, // Get all files in the folder
    });

    if (listResult.resources.length === 0) {
      return { result: "ok", deletedCount: 0 };
    }

    // Delete all files in the folder
    const deletePromises = listResult.resources.map((resource) => {
      return cloudinary.uploader.destroy(resource.public_id, {
        resource_type: "raw",
      });
    });

    const deleteResults = await Promise.allSettled(deletePromises);

    // Count successful deletions
    const successfulDeletions = deleteResults.filter(
      (result) => result.status === "fulfilled" && result.value.result === "ok"
    ).length;

    const failedDeletions = deleteResults.filter(
      (result) =>
        result.status === "rejected" ||
        (result.status === "fulfilled" && result.value.result !== "ok")
    );

    if (failedDeletions.length > 0) {
      console.warn("Some files failed to delete:", failedDeletions);
    }

    return {
      result: "ok",
      deletedCount: successfulDeletions,
      totalFiles: listResult.resources.length,
      failedDeletions: failedDeletions.length,
    };
  } catch (error) {
    console.error("Error deleting user folder from Cloudinary:", {
      folderPath,
      error: error.message,
      stack: error.stack,
    });
    throw new Error(
      `Failed to delete user folder from Cloudinary: ${error.message}`
    );
  }
};

/**
 * Validate resume file
 * @param {Object} file - File object with base64 data and metadata
 * @returns {Object} Validation result
 */
export const validateResumeFile = (file) => {
  const errors = [];

  // Check file type
  if (!file.fileName || !file.fileName.toLowerCase().endsWith(".pdf")) {
    errors.push("Only PDF files are allowed");
  }

  // Check file size (5MB limit) - approximate base64 size check
  const maxSize = 5 * 1024 * 1024; // 5MB
  const base64Size = file.file ? file.file.length * 0.75 : 0; // Base64 is ~33% larger
  if (base64Size > maxSize) {
    errors.push("File size must be less than 5MB");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  uploadResumeToCloudinary,
  deleteResumeFromCloudinary,
  deleteUserFolderFromCloudinary,
  validateResumeFile,
};
