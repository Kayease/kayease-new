import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { portfolioApi } from "../../utils/portfolioApi";
import AdminLayout from "components/admin/AdminLayout";

const Portfolio = () => {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [stats, setStats] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Filters and pagination
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    status: "all",
    featured: "",
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [pagination, setPagination] = useState(null);

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "web-dev", name: "Web Development" },
    { id: "mobile", name: "Mobile Development" },
    { id: "ecommerce", name: "E-commerce" },
    { id: "saas", name: "SaaS" },
    { id: "healthcare", name: "Healthcare" },
    { id: "fintech", name: "Fintech" },
    { id: "education", name: "Education" },
    { id: "other", name: "Other" },
  ];

  const statusOptions = [
    { id: "all", name: "All Status" },
    { id: "completed", name: "Completed" },
    { id: "in-progress", name: "In Progress" },
    { id: "on-hold", name: "On Hold" },
  ];

  useEffect(() => {
    loadPortfolios();
    loadStats();
  }, [filters]);

  const loadPortfolios = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await portfolioApi.getAll(filters);
      setPortfolios(response.portfolios || []);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error loading portfolios:", error);
      setError("Failed to load portfolio projects. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await portfolioApi.getStats();
      setStats(response);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleSelectAll = () => {
    if (selectedItems.length === portfolios.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(portfolios.map((p) => p._id));
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id, projectName) => {
    setDeleteTarget({
      type: 'single',
      id: id,
      name: projectName
    });
    setShowDeleteModal(true);
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;

    setDeleteTarget({
      type: 'bulk',
      count: selectedItems.length,
      ids: selectedItems
    });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      if (deleteTarget.type === 'bulk') {
        await portfolioApi.bulkDelete(deleteTarget.ids);
        setSelectedItems([]);
      } else {
        await portfolioApi.delete(deleteTarget.id);
      }
      await loadPortfolios();
      await loadStats();
    } catch (error) {
      console.error("Error deleting portfolio(s):", error);
      setError("Failed to delete portfolio project(s). Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await portfolioApi.toggleFeatured(id);
      await loadPortfolios();
      await loadStats();
    } catch (error) {
      console.error("Error toggling featured status:", error);
      setError("Failed to update featured status. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: "bg-green-100 text-green-800", label: "Completed" },
      "in-progress": {
        color: "bg-blue-100 text-blue-800",
        label: "In Progress",
      },
      "on-hold": { color: "bg-yellow-100 text-yellow-800", label: "On Hold" },
    };

    const config = statusConfig[status] || {
      color: "bg-gray-100 text-gray-800",
      label: status,
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <AdminLayout>

      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Icon
                    name="Search"
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Featured
                </label>
                <select
                  value={filters.featured}
                  onChange={(e) => handleFilterChange("featured", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">All Projects</option>
                  <option value="true">Featured Only</option>
                  <option value="false">Non-Featured</option>
                </select>
              </div>
              <div className="flex items-center flex-col">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Add New Project
                </label>

                <Button
                  variant="default"
                  className="cta-button text-white font-medium"
                  onClick={() => navigate("/admin/portfolio/new")}
                  iconName="Plus"
                  iconPosition="left"
                  iconSize={16}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <Icon
                  name="AlertCircle"
                  size={20}
                  className="text-red-500 mr-3"
                />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Portfolio Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3">
                  <Icon
                    name="Loader2"
                    size={20}
                    className="animate-spin text-primary"
                  />
                  <span className="text-slate-600">
                    Loading portfolio projects...
                  </span>
                </div>
              </div>
            ) : portfolios.length === 0 ? (
              <div className="text-center py-12">
                <Icon
                  name="Briefcase"
                  size={48}
                  className="mx-auto text-slate-400 mb-4"
                />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  No portfolio projects found
                </h3>
                <p className="text-slate-600 mb-4">
                  Get started by creating your first portfolio project.
                </p>
                <Button
                  variant="default"
                  className="cta-button text-white font-medium"
                  onClick={() => navigate("/admin/portfolio/new")}
                  iconName="Plus"
                  iconPosition="left"
                  iconSize={16}
                >
                  Add New Project
                </Button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={
                              selectedItems.length === portfolios.length &&
                              portfolios.length > 0
                            }
                            onChange={handleSelectAll}
                            className="h-4 w-4 text-primary focus:ring-primary/20 border-slate-300 rounded"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Project
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Featured
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {portfolios.map((portfolio) => (
                        <tr key={portfolio._id} className="hover:bg-slate-50">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(portfolio._id)}
                              onChange={() => handleSelectItem(portfolio._id)}
                              className="h-4 w-4 text-primary focus:ring-primary/20 border-slate-300 rounded"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="h-12 w-12 flex-shrink-0">
                                <img
                                  className="h-12 w-12 rounded-lg object-cover"
                                  src={portfolio.mainImage}
                                  alt={portfolio.title}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-slate-900">
                                  {portfolio.title}
                                </div>
                                <div className="text-sm text-slate-500 line-clamp-1">
                                  {portfolio.excerpt}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                            {getCategoryName(portfolio.category)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(portfolio.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleFeatured(portfolio._id)}
                              className={`p-1 rounded-full ${portfolio.featured
                                ? "text-yellow-500 hover:text-yellow-600"
                                : "text-slate-300 hover:text-yellow-500"
                                }`}
                            >
                              <Icon
                                name="Star"
                                size={16}
                                fill={
                                  portfolio.featured ? "currentColor" : "none"
                                }
                              />
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  navigate(
                                    `/admin/portfolio/edit/${portfolio._id}`
                                  )
                                }
                                iconName="Edit"
                                iconSize={14}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(portfolio._id, portfolio.title)}
                                disabled={isDeleting}
                                iconName="Trash2"
                                iconSize={14}
                                className="text-red-600 hover:text-red-700"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="bg-white px-4 py-3 border-t border-slate-200 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 flex justify-between sm:hidden">
                        <Button
                          variant="outline"
                          onClick={() =>
                            handlePageChange(pagination.currentPage - 1)
                          }
                          disabled={!pagination.hasPrevPage}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            handlePageChange(pagination.currentPage + 1)
                          }
                          disabled={!pagination.hasNextPage}
                        >
                          Next
                        </Button>
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-slate-700">
                            Showing{" "}
                            <span className="font-medium">
                              {(pagination.currentPage - 1) *
                                pagination.itemsPerPage +
                                1}
                            </span>{" "}
                            to{" "}
                            <span className="font-medium">
                              {Math.min(
                                pagination.currentPage * pagination.itemsPerPage,
                                pagination.totalItems
                              )}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium">
                              {pagination.totalItems}
                            </span>{" "}
                            results
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <Button
                              variant="outline"
                              onClick={() =>
                                handlePageChange(pagination.currentPage - 1)
                              }
                              disabled={!pagination.hasPrevPage}
                              className="rounded-r-none"
                            >
                              Previous
                            </Button>

                            {Array.from(
                              { length: Math.min(5, pagination.totalPages) },
                              (_, i) => {
                                const pageNum = i + 1;
                                return (
                                  <Button
                                    key={pageNum}
                                    variant={
                                      pageNum === pagination.currentPage
                                        ? "default"
                                        : "outline"
                                    }
                                    onClick={() => handlePageChange(pageNum)}
                                    className="rounded-none"
                                  >
                                    {pageNum}
                                  </Button>
                                );
                              }
                            )}

                            <Button
                              variant="outline"
                              onClick={() =>
                                handlePageChange(pagination.currentPage + 1)
                              }
                              disabled={!pagination.hasNextPage}
                              className="rounded-l-none"
                            >
                              Next
                            </Button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeleteTarget(null);
          }}
          onConfirm={confirmDelete}
          isLoading={isDeleting}
          isBulk={deleteTarget?.type === 'bulk'}
          itemCount={deleteTarget?.count || 0}
          itemName={deleteTarget?.name || ''}
          itemType="project"
          title={deleteTarget?.type === 'bulk' ? `Delete ${deleteTarget?.count} Projects` : 'Delete Project'}
        />
      </div>
    </AdminLayout>
  );
};

export default Portfolio;
