import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";

const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const BlogForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    image: null,
    category: "web-dev",
    tags: [],
    content: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [fullScreenLoader, setFullScreenLoader] = useState({ show: false, message: "" });
  const [originalImageUrl, setOriginalImageUrl] = useState("");
  const [originalImagePublicId, setOriginalImagePublicId] = useState("");

  const categories = [
    { id: "web-dev", name: "Web Development", icon: "Code" },
    { id: "mobile", name: "Mobile Technology", icon: "Smartphone" },
    { id: "strategy", name: "Digital Strategy", icon: "Target" },
    { id: "ai-ml", name: "AI & Machine Learning", icon: "Brain" },
    { id: "cybersecurity", name: "Cybersecurity", icon: "Shield" },
    { id: "cloud", name: "Cloud Computing", icon: "Cloud" },
  ];

  // Custom styles for React Quill
  const customStyles = `
    .ql-toolbar {
      border: none !important;
      background-color: rgb(249 250 251) !important;
      border-bottom: 1px solid #e5e7eb !important;
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
      padding: 0.5rem !important;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .ql-toolbar button {
      padding: 0.5rem !important;
      height: 32px !important;
      width: 32px !important;
      border-radius: 0.5rem;
    }

    .ql-toolbar button svg {
      width: 20px !important;
      height: 20px !important;
    }

    .ql-toolbar .ql-picker {
      height: 32px !important;
    }

    .ql-toolbar .ql-picker-label {
      padding: 0.5rem !important;
      border-radius: 0.5rem;
    }

    .ql-toolbar button:hover {
      background-color: rgb(229 231 235) !important;
    }

    .ql-formats {
      display: flex !important;
      gap: 0.25rem;
      align-items: center;
    }

    .ql-container {
      border: none !important;
      font-size: 1.125rem !important;
    }

    .ql-editor {
      padding: 1rem !important;
      min-height: 300px !important;
      font-size: 16px;
      line-height: 1.6;
      color: #374151;
    }

    .ql-editor p {
      margin-bottom: 1rem;
    }

    .ql-editor h1, .ql-editor h2, .ql-editor h3, .ql-editor h4, .ql-editor h5, .ql-editor h6 {
      margin-top: 1.5rem;
      margin-bottom: 1rem;
      font-weight: 600;
      color: #111827;
    }

    .ql-editor h1 { font-size: 2rem; }
    .ql-editor h2 { font-size: 1.75rem; }
    .ql-editor h3 { font-size: 1.5rem; }
    .ql-editor h4 { font-size: 1.25rem; }
    .ql-editor h5 { font-size: 1.125rem; }
    .ql-editor h6 { font-size: 1rem; }

    .ql-editor blockquote {
      border-left: 4px solid #3b82f6;
      padding-left: 1rem;
      margin: 1rem 0;
      font-style: italic;
      color: #6b7280;
    }

    .ql-editor code {
      background-color: #f3f4f6;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-family: 'Courier New', monospace;
      font-size: 0.875rem;
    }

    .ql-editor pre {
      background-color: #1f2937;
      color: #f9fafb;
      padding: 1rem;
      border-radius: 0.5rem;
      overflow-x: auto;
      margin: 1rem 0;
    }

    .ql-editor pre code {
      background-color: transparent;
      color: inherit;
      padding: 0;
    }

    .ql-editor ul, .ql-editor ol {
      padding-left: 1.5rem;
      margin: 1rem 0;
    }

    .ql-editor li {
      margin-bottom: 0.5rem;
    }

    .ql-editor img {
      max-width: 100%;
      height: auto;
      border-radius: 0.5rem;
      margin: 1rem 0;
    }

    .ql-editor a {
      color: #3b82f6;
      text-decoration: underline;
    }

    .ql-editor a:hover {
      color: #2563eb;
    }

    .ql-editor.ql-blank::before {
      color: #9ca3af;
      font-style: italic;
    }

    @media (min-width: 768px) {
      .ql-editor {
        min-height: 400px !important;
      }
    }
  `;

  // React Quill modules configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "blockquote", "code-block"],
      [{ align: [] }],
      ["clean"],
    ],
  };

  useEffect(() => {

    // Inject custom styles
    const styleElement = document.createElement("style");
    styleElement.innerHTML = customStyles;
    document.head.appendChild(styleElement);

    if (isEditing && id) {
      setFullScreenLoader({ show: true, message: "Loading blog data..." });
      fetch(`${BACKEND_URL}/api/blogs/${id}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            ...data,
            image: null, // Don't set File object for existing image
            date: data.publishDate ? data.publishDate.split("T")[0] : new Date().toISOString().split("T")[0],
          });
          setImagePreview(data.image);
          setOriginalImageUrl(data.image);
          setOriginalImagePublicId(data.imagePublicId || "");
          setFullScreenLoader({ show: false, message: "" });
        })
        .catch(() => {
          toast.error("Failed to load blog data");
          setFullScreenLoader({ show: false, message: "" });
        });
    }

    // Cleanup function
    return () => {
      try {
        if (document.head.contains(styleElement)) {
          document.head.removeChild(styleElement);
        }
      } catch (err) {
        console.warn("Error removing style element:", err);
      }
    };
  }, [isEditing, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: "" }));
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview("");
    
    // Clear any validation errors for image
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleContentChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      content: content,
    }));

    if (errors.content) {
      setErrors((prev) => ({
        ...prev,
        content: "",
      }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = "Excerpt is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    // For editing, image is required only if no existing image and no new image
    if (!isEditing && !formData.image) {
      newErrors.image = "Featured image is required";
    } else if (isEditing && !formData.image && !originalImageUrl) {
      newErrors.image = "Featured image is required";
    }

    if (formData.tags.length === 0) {
      newErrors.tags = "At least one tag is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function uploadToCloudinary(file) {
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "blogs");
    const res = await fetch(url, { method: "POST", body: formData });
    if (!res.ok) throw new Error("Image upload failed");
    const data = await res.json();
    return data.secure_url;
  }

  async function deleteFromCloudinary(publicId) {
    const res = await fetch(`${BACKEND_URL}/api/cloudinary/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId }),
    });
    if (!res.ok) throw new Error("Failed to delete previous image");
    return await res.json();
  }

  // Extract public ID from Cloudinary URL
  function extractPublicIdFromUrl(url) {
    try {
      const urlParts = url.split('/');
      const uploadIndex = urlParts.findIndex(part => part === 'upload');
      if (uploadIndex === -1) return null;
      
      // Get everything after 'upload/v{version}/'
      const pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/');
      // Remove file extension
      const publicId = pathAfterUpload.replace(/\.[^/.]+$/, '');
      return publicId;
    } catch (err) {
      console.error('Error extracting public ID:', err);
      return null;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    
    try {
      let imageUrl = originalImageUrl; // Use existing image by default
      let imagePublicId = originalImagePublicId;
      
      // Handle image upload/replacement
      if (formData.image) {
        setFullScreenLoader({ show: true, message: "Uploading image..." });
        
        // If editing and replacing image, delete old image first
        if (isEditing && originalImagePublicId) {
          try {
            await deleteFromCloudinary(originalImagePublicId);
          } catch (err) {
            console.warn("Failed to delete old image:", err.message);
          }
        }
        
        // Upload new image
        imageUrl = await uploadToCloudinary(formData.image);
        
        // Extract public ID from the URL for future deletion
        imagePublicId = extractPublicIdFromUrl(imageUrl);
      }
      
      setFullScreenLoader({ 
        show: true, 
        message: isEditing ? "Updating blog..." : "Creating blog..." 
      });
      
      const payload = {
        ...formData,
        image: imageUrl,
        imagePublicId: imagePublicId,
        publishDate: formData.date,
      };
      
      // Remove the File object from payload
      delete payload.image;
      payload.image = imageUrl;
      
      const url = isEditing 
        ? `${BACKEND_URL}/api/blogs/${id}` 
        : `${BACKEND_URL}/api/blogs`;
      const method = isEditing ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'create'} blog`);
      
      toast.success(`Blog ${isEditing ? 'updated' : 'created'} successfully!`);
      setTimeout(() => {
        setFullScreenLoader({ show: false, message: "" });
        navigate("/admin/blogs");
      }, 1000);
    } catch (err) {
      setFullScreenLoader({ show: false, message: "" });
      toast.error(err.message || `Failed to ${isEditing ? 'update' : 'create'} blog`);
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
                onClick={() => navigate("/admin/blogs")}
                iconName="ArrowLeft"
                iconPosition="left"
                iconSize={16}
              >
                Back to Blogs
              </Button>
              <div className="h-6 w-px bg-slate-300"></div>
              <h1 className="text-xl font-semibold text-slate-800">
                {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate("/admin/blogs")}
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
                  ? (isEditing ? "Updating..." : "Creating...") 
                  : (isEditing ? "Update Blog" : "Create Blog")
                }
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Blog Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
                  errors.title ? "border-red-300 bg-red-50" : "border-slate-300"
                }`}
                placeholder="Enter blog title..."
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <label
                htmlFor="excerpt"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Excerpt * (2 lines for card)
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={3}
                value={formData.excerpt}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
                  errors.excerpt
                    ? "border-red-300 bg-red-50"
                    : "border-slate-300"
                }`}
                placeholder="Brief description of the blog post (2 lines for card display)..."
              />
              {errors.excerpt && (
                <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>
              )}
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Content * (React Quill Editor)
              </label>
              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={handleContentChange}
                  modules={quillModules}
                  placeholder="Write your blog content here..."
                />
              </div>
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
              )}
              <div className="mt-2 text-xs text-slate-500">
                Professional React Quill editor with clean, modern interface and
                essential formatting tools.
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Category
              </h3>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Tags *
              </h3>

              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddTag())
                  }
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Add tag..."
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddTag}
                  iconName="Plus"
                  iconSize={14}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-primary/60 hover:text-primary"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                ))}
              </div>

              {errors.tags && (
                <p className="mt-2 text-sm text-red-600">{errors.tags}</p>
              )}
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Featured Image *
              </h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-primary/50 transition-colors duration-200">
                  <input
                    type="file"
                    id="blogImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label htmlFor="blogImage" className="cursor-pointer">
                    <Icon
                      name="Upload"
                      size={32}
                      className="mx-auto text-slate-400 mb-2"
                    />
                    <p className="text-sm text-slate-600">
                      Click to upload featured image
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Recommended: 800x400px, JPG/PNG
                    </p>
                  </label>
                </div>
                {imagePreview && (
                  <div className="relative mt-3">
                    <img
                      src={imagePreview}
                      alt="Blog Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </div>
                )}
                {errors.image && (
                  <p className="mt-2 text-sm text-red-600">{errors.image}</p>
                )}
              </div>
            </div>

            {/* Date */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Date
              </h3>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <p className="mt-1 text-xs text-slate-500">
                Auto-generated if not specified
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogForm;
