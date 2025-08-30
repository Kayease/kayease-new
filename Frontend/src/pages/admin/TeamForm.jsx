import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import Image from "../../components/AppImage";
import { teamApi } from "../../utils/teamApi";
import { toast } from "react-toastify";

const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const TeamForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    experience: "",
    expertise: [],
    avatar: null,
    order: 0,
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [expertiseInput, setExpertiseInput] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [fullScreenLoader, setFullScreenLoader] = useState({ show: false, message: "" });
  const [originalImageUrl, setOriginalImageUrl] = useState("");
  const [originalImagePublicId, setOriginalImagePublicId] = useState("");

  useEffect(() => {
    if (isEditing) {
      loadTeamMember();
    }
  }, [id, isEditing]);

  const loadTeamMember = async () => {
    try {
      setIsLoading(true);
      const member = await teamApi.getById(id);
      setFormData({
        name: member.name,
        role: member.role,
        experience: member.experience,
        expertise: member.expertise,
        avatar: null,
        order: member.order,
        isActive: member.isActive,
      });
      setImagePreview(member.avatar);
      setOriginalImageUrl(member.avatar);
      setOriginalImagePublicId(member.avatarPublicId);
    } catch (error) {
      console.error("Error loading team member:", error);
      toast.error("Failed to load team member");
      navigate("/admin/team");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    }

    if (!formData.experience.trim()) {
      newErrors.experience = "Experience is required";
    }

    if (formData.expertise.length < 2) {
      newErrors.expertise = "At least 2 expertise areas are required";
    }

    if (!isEditing && !formData.avatar) {
      newErrors.avatar = "Avatar image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "team");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setFormData({ ...formData, avatar: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      
      // Clear any existing error
      if (errors.avatar) {
        setErrors({ ...errors, avatar: "" });
      }
    }
  };

  const handleExpertiseAdd = () => {
    if (expertiseInput.trim() && !formData.expertise.includes(expertiseInput.trim())) {
      setFormData({
        ...formData,
        expertise: [...formData.expertise, expertiseInput.trim()],
      });
      setExpertiseInput("");
      
      // Clear expertise error if we now have enough
      if (formData.expertise.length >= 1 && errors.expertise) {
        setErrors({ ...errors, expertise: "" });
      }
    }
  };

  const handleExpertiseRemove = (index) => {
    const newExpertise = formData.expertise.filter((_, i) => i !== index);
    setFormData({ ...formData, expertise: newExpertise });
  };

  const handleExpertiseKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleExpertiseAdd();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsLoading(true);
    setFullScreenLoader({ show: true, message: isEditing ? "Updating team member..." : "Creating team member..." });

    try {
      let avatarUrl = originalImageUrl;
      let avatarPublicId = originalImagePublicId;

      // Upload new image if provided
      if (formData.avatar) {
        setFullScreenLoader({ show: true, message: "Uploading image..." });
        const uploadResult = await uploadImageToCloudinary(formData.avatar);
        avatarUrl = uploadResult.url;
        avatarPublicId = uploadResult.publicId;
      }

      const teamData = {
        name: formData.name.trim(),
        role: formData.role.trim(),
        experience: formData.experience.trim(),
        expertise: formData.expertise,
        avatar: avatarUrl,
        avatarPublicId: avatarPublicId,
        order: formData.order,
        isActive: formData.isActive,
      };

      if (isEditing) {
        await teamApi.update(id, teamData);
        toast.success("Team member updated successfully!");
      } else {
        await teamApi.create(teamData);
        toast.success("Team member created successfully!");
      }

      navigate("/admin/team");
    } catch (error) {
      console.error("Error saving team member:", error);
      toast.error(error.message || "Failed to save team member");
    } finally {
      setIsLoading(false);
      setFullScreenLoader({ show: false, message: "" });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  if (isLoading && isEditing) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading team member...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Full Screen Loader */}
      {fullScreenLoader.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-slate-700">{fullScreenLoader.message}</p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link to="/admin">
                  <img src="/Kayease-logo.png" alt="Kayease Logo" className="h-8" />
                </Link>
                <div className="h-6 w-px bg-slate-300"></div>
                <h1 className="text-xl font-semibold text-slate-800">
                  {isEditing ? "Edit Team Member" : "Add Team Member"}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/admin/team")}
                  iconName="ArrowLeft"
                  iconPosition="left"
                  iconSize={16}
                >
                  Back to Team
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.name ? "border-red-300" : "border-slate-300"
                    }`}
                    placeholder="Enter team member name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Role *
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.role ? "border-red-300" : "border-slate-300"
                    }`}
                    placeholder="e.g., Full-Stack Developer"
                  />
                  {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Experience *
                  </label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => handleInputChange("experience", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.experience ? "border-red-300" : "border-slate-300"
                    }`}
                    placeholder="e.g., 5+ years"
                  />
                  {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => handleInputChange("order", parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Display order (0 = first)"
                  />
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange("isActive", e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-slate-700">
                    Active (visible on website)
                  </label>
                </div>
              </div>
            </div>

            {/* Avatar Image */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Avatar Image</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Upload Avatar {!isEditing && "*"}
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      <Icon name="Upload" size={16} className="mr-2" />
                      Choose Image
                    </label>
                    <span className="text-sm text-slate-500">
                      JPG, PNG up to 5MB
                    </span>
                  </div>
                  {errors.avatar && <p className="mt-1 text-sm text-red-600">{errors.avatar}</p>}
                </div>

                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-slate-700 mb-2">Preview:</p>
                    <div className="w-32 h-32 rounded-lg overflow-hidden border border-slate-200">
                      <Image
                        src={imagePreview}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Expertise */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">
                Expertise Areas * (minimum 2 required)
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={expertiseInput}
                    onChange={(e) => setExpertiseInput(e.target.value)}
                    onKeyPress={handleExpertiseKeyPress}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter expertise area (e.g., React Development)"
                  />
                  <Button
                    type="button"
                    onClick={handleExpertiseAdd}
                    disabled={!expertiseInput.trim()}
                    iconName="Plus"
                    iconSize={16}
                  >
                    Add
                  </Button>
                </div>

                {formData.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleExpertiseRemove(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <Icon name="X" size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {errors.expertise && <p className="text-sm text-red-600">{errors.expertise}</p>}
                
                <p className="text-sm text-slate-500">
                  Add skills and expertise areas. At least 2 are required and will be displayed on the website.
                </p>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/team")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                iconName={isLoading ? "Loader2" : "Save"}
                iconPosition="left"
                iconSize={16}
                className={""}
              >
                {isEditing ? "Update Team Member" : "Create Team Member"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TeamForm;