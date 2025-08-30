import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import { toast } from "react-toastify";
import AdminLayout from "components/admin/AdminLayout";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CareerManagement = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const departments = [
    { id: "all", name: "All Departments" },
    { id: "engineering", name: "Engineering" },
    { id: "design", name: "Design" },
    { id: "marketing", name: "Marketing" },
    { id: "sales", name: "Sales" },
    { id: "operations", name: "Operations" },
    { id: "other", name: "Other" },
  ];

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        setIsPageLoading(true);
        const response = await fetch(`${BACKEND_URL}/api/careers`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch careers");
        }

        const careers = data.careers || data; // Handle both paginated and non-paginated responses
        setJobs(careers);
        setFilteredJobs(careers);
      } catch (err) {
        console.error("Error fetching careers:", err);
        toast.error("Failed to load careers");
        setJobs([]);
        setFilteredJobs([]);
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchCareers();
  }, []);

  useEffect(() => {
    // Filter jobs based on search and department
    let filtered = jobs;

    if (selectedDepartment !== "all") {
      filtered = filtered.filter(
        (job) => job.department === selectedDepartment
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.skills.some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, selectedDepartment]);

  const handleSelectJob = (jobId) => {
    setSelectedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleSelectAll = () => {
    if (selectedJobs.length === filteredJobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(filteredJobs.map((job) => job._id));
    }
  };

  const handleDeleteJob = (job) => {
    setJobToDelete(job);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!jobToDelete) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/careers/${jobToDelete._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete career");
      }

      setJobs((prev) => prev.filter((job) => job._id !== jobToDelete._id));
      setFilteredJobs((prev) =>
        prev.filter((job) => job._id !== jobToDelete._id)
      );
      setShowDeleteModal(false);
      setJobToDelete(null);
      toast.success("Career deleted successfully!");
    } catch (err) {
      console.error("Error deleting career:", err);
      toast.error(err.message || "Failed to delete career");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedJobs.length === 0) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/careers/bulk-delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedJobs }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete careers");
      }

      setJobs((prev) => prev.filter((job) => !selectedJobs.includes(job._id)));
      setFilteredJobs((prev) =>
        prev.filter((job) => !selectedJobs.includes(job._id))
      );
      setSelectedJobs([]);
      toast.success(`${data.deletedCount} careers deleted successfully!`);
    } catch (err) {
      console.error("Error bulk deleting careers:", err);
      toast.error(err.message || "Failed to delete careers");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (jobId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/careers/${jobId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      setJobs((prev) =>
        prev.map((job) =>
          job._id === jobId ? { ...job, status: newStatus } : job
        )
      );
      setFilteredJobs((prev) =>
        prev.map((job) =>
          job._id === jobId ? { ...job, status: newStatus } : job
        )
      );

      toast.success(`Career status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error(err.message || "Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (jobType) => {
    switch (jobType) {
      case "remote":
        return "bg-blue-100 text-blue-800";
      case "hybrid":
        return "bg-purple-100 text-purple-800";
      case "in-office":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
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
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Department Filter */}
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Bulk Actions */}
            {selectedJobs.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">
                  {selectedJobs.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={isLoading}
                  iconName={isLoading ? "Loader2" : "Trash2"}
                  iconPosition="left"
                  iconSize={14}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  {isLoading ? "Deleting..." : "Delete Selected"}
                </Button>
              </div>
            )}
             <Button
              variant="default"
              className="cta-button text-white font-medium"
              onClick={() => navigate("/admin/careers/create")}
              iconName="Plus"
              iconPosition="left"
              iconSize={16}
            >
              Add Job Opening
            </Button>
          </div>
        </div>

        {/* Job List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={
                  selectedJobs.length === filteredJobs.length &&
                  filteredJobs.length > 0
                }
                onChange={handleSelectAll}
                className="h-4 w-4 text-primary focus:ring-primary/20 border-slate-300 rounded"
              />
              <div className="ml-6 grid grid-cols-12 gap-4 w-full text-center">
                <div className="col-span-4">
                  <span className="text-sm font-medium text-slate-700">
                    Job Title
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-sm font-medium text-slate-700">
                    Department
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-sm font-medium text-slate-700">
                    Location
                  </span>
                </div>
                <div className="col-span-1">
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

          {/* Job Items */}
          <div className="divide-y divide-slate-200">
            {isPageLoading ? (
              <div className="px-6 py-8 text-center">
                <Icon
                  name="Loader2"
                  size={24}
                  className="animate-spin mx-auto mb-2 text-primary"
                />
                <p className="text-slate-600">Loading careers...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <Icon
                  name="Briefcase"
                  size={48}
                  className="mx-auto mb-4 text-slate-400"
                />
                <h3 className="text-lg font-medium text-slate-800 mb-2">
                  No careers found
                </h3>
                <p className="text-slate-600">
                  {searchTerm || selectedDepartment !== "all"
                    ? "Try adjusting your search or filters"
                    : "Get started by creating your first career opening"}
                </p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job._id}
                  className="px-6 py-4 hover:bg-slate-50 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedJobs.includes(job._id)}
                      onChange={() => handleSelectJob(job._id)}
                      className="h-4 w-4 text-primary focus:ring-primary/20 border-slate-300 rounded"
                    />
                    <div className="ml-6 grid grid-cols-12 gap-4 w-full items-center">
                      {/* Job Title */}
                      <div className="col-span-4">
                        <div>
                          <h3 className="font-medium text-slate-800 line-clamp-1">
                            {job.title}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                                job.jobType
                              )}`}
                            >
                              {job.jobType === "remote"
                                ? "Remote"
                                : job.jobType === "hybrid"
                                ? "Hybrid"
                                : "In Office"}
                            </span>
                            {job.experience && (
                              <span className="text-sm text-slate-500">
                                {job.experience}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Department */}
                      <div className="col-span-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {job.department.charAt(0).toUpperCase() +
                            job.department.slice(1)}
                        </span>
                      </div>

                      {/* Location */}
                      <div className="col-span-2">
                        <div className="flex items-center space-x-1 text-sm text-slate-600">
                          <Icon name="MapPin" size={14} />
                          <span>{job.location}</span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="col-span-1">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            job.status
                          )}`}
                        >
                          {job.status}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="col-span-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleStatus(job._id, job.status)}
                            disabled={isLoading}
                            className={
                              job.status === "active"
                                ? "text-green-600"
                                : "text-yellow-600"
                            }
                          >
                            <Icon
                              name={job.status === "active" ? "Pause" : "Play"}
                              size={16}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(`/admin/careers/edit/${job._id}`)
                            }
                            className="text-blue-600"
                          >
                            <Icon name="Edit" size={16} />
                          </Button> 
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteJob(job)}
                            className="text-red-600"
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">
                Delete Job Opening
              </h3>
            </div>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete "{jobToDelete?.title}"? This
              action cannot be undone and will remove all associated
              applications.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={confirmDelete}
                disabled={isLoading}
                iconName={isLoading ? "Loader2" : undefined}
                iconPosition="left"
                iconSize={16}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  </AdminLayout>
  );
};

export default CareerManagement;
