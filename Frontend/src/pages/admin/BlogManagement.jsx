import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import { toast } from "react-toastify";
import AdminLayout from "components/admin/AdminLayout";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const BlogManagement = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBlogs, setSelectedBlogs] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "web-dev", name: "Web Development" },
    { id: "mobile", name: "Mobile Technology" },
    { id: "ecommerce", name: "E-commerce Trends" },
    { id: "strategy", name: "Digital Strategy" },
    { id: "case-studies", name: "Case Studies" },
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/blogs`);
        const data = await res.json();
        setBlogs(data);
        setFilteredBlogs(data);
      } catch (err) {
        toast.error("Failed to fetch blogs");
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    let filtered = blogs;
    if (selectedCategory !== "all") {
      filtered = filtered.filter((blog) => blog.category === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (blog.author?.name || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (blog.tags || []).some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }
    setFilteredBlogs(filtered);
  }, [blogs, searchTerm, selectedCategory]);

  const handleSelectBlog = (blogId) => {
    setSelectedBlogs((prev) =>
      prev.includes(blogId)
        ? prev.filter((id) => id !== blogId)
        : [...prev, blogId]
    );
  };

  const handleSelectAll = () => {
    if (selectedBlogs.length === filteredBlogs.length) {
      setSelectedBlogs([]);
    } else {
      setSelectedBlogs(filteredBlogs.map((blog) => blog._id));
    }
  };

  const handleDeleteBlog = (blog) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

  // Delete blog (backend handles image deletion)
  const confirmDelete = async () => {
    if (!blogToDelete) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/blogs/${blogToDelete._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete blog");

      setBlogs((prev) => prev.filter((blog) => blog._id !== blogToDelete._id));
      setFilteredBlogs((prev) =>
        prev.filter((blog) => blog._id !== blogToDelete._id)
      );
      setShowDeleteModal(false);
      setBlogToDelete(null);
      toast.success("Blog and image deleted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to delete blog");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle status between draft and published
  const handleToggleStatus = async (blog) => {
    const newStatus = blog.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`${BACKEND_URL}/api/blogs/${blog._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...blog, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");
      setBlogs((prev) =>
        prev.map((b) => (b._id === blog._id ? { ...b, status: newStatus } : b))
      );
      setFilteredBlogs((prev) =>
        prev.map((b) => (b._id === blog._id ? { ...b, status: newStatus } : b))
      );
      toast.success(`Blog status changed to ${newStatus}`);
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  return (
    <AdminLayout>
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative">
                  <Icon
                    name="Search"
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <Button
                  variant="default"
                  className="cta-button text-white font-medium"
                  onClick={() => navigate("/admin/blogs/create")}
                  iconName="Plus"
                  iconPosition="left"
                  iconSize={16}
                >
                  Create New Post
                </Button>
              </div>
            </div>
          </div>

          {/* Blog List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={
                    selectedBlogs.length === filteredBlogs.length &&
                    filteredBlogs.length > 0
                  }
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-primary focus:ring-primary/20 border-slate-300 rounded"
                />
                <div className="ml-6 grid grid-cols-12 gap-4 w-full">
                  <div className="col-span-6">
                    <span className="text-sm font-medium text-slate-700">
                      Title
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-slate-700">
                      Category
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-slate-700">
                      Status
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-slate-700">
                      Actions
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Blog Items */}
            <div className="divide-y divide-slate-200">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="px-6 py-4 hover:bg-slate-50 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedBlogs.includes(blog._id)}
                      onChange={() => handleSelectBlog(blog._id)}
                      className="h-4 w-4 text-primary focus:ring-primary/20 border-slate-300 rounded"
                    />
                    <div className="ml-6 grid grid-cols-12 gap-4 w-full items-center">
                      {/* Title & Image */}
                      <div className="col-span-6 flex items-center space-x-3">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-slate-800 line-clamp-1">
                              {blog.title}
                            </h3>
                            {blog.featured && (
                              <Icon
                                name="Star"
                                size={14}
                                className="text-yellow-500"
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Category */}
                      <div className="col-span-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {categories.find((c) => c.id === blog.category)
                            ?.name || blog.category}
                        </span>
                      </div>

                      {/* Status (clickable) */}
                      <div className="col-span-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
                            blog.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                          onClick={() => handleToggleStatus(blog)}
                          title="Click to toggle status"
                        >
                          {blog.status}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="col-span-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(`/admin/blogs/edit/${blog._id}`)
                            }
                            className="text-blue-600"
                          >
                            <Icon name="Edit" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBlog(blog)}
                            className="text-red-600"
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredBlogs.length === 0 && (
              <div className="px-6 py-12 text-center">
                <Icon
                  name="FileText"
                  size={48}
                  className="mx-auto text-slate-300 mb-4"
                />
                <h3 className="text-lg font-medium text-slate-800 mb-2">
                  No blogs found
                </h3>
                <p className="text-slate-500 mb-6">
                  {searchTerm || selectedCategory !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Get started by creating your first blog post."}
                </p>
                <Button
                  variant="default"
                  className="cta-button text-white font-medium"
                  onClick={() => navigate("/admin/blogs/create")}
                  iconName="Plus"
                  iconPosition="left"
                  iconSize={16}
                >
                  Create New Post
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Icon
                    name="AlertTriangle"
                    size={20}
                    className="text-red-600"
                  />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Delete Blog Post
                </h3>
              </div>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete "{blogToDelete?.title}"? This
                action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  disabled={isLoading}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default BlogManagement;
