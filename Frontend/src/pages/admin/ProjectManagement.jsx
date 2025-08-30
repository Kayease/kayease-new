import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../contexts/AuthContext";
import { projectApi } from "../../utils/projectApi";
import { userApi } from "../../utils/userApi";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";

const ProjectManagement = () => {
  const { user: currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    overdue: 0,
    totalBudget: 0,
    averageProgress: 0,
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "planning",
    priority: "medium",
    startDate: "",
    endDate: "",
    budget: "",
    client: "",
    category: "web-development",
    technologies: [],
    assignedEmployees: [],
    projectManager: "",
  });

  const [newTechnology, setNewTechnology] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newEmployeeId, setNewEmployeeId] = useState("");
  const [newEmployeeRole, setNewEmployeeRole] = useState("developer");

  // Load data on component mount
  useEffect(() => {
    loadInitial();
  }, []);

  const loadInitial = async () => {
    await Promise.all([loadProjects(), loadEmployees(), loadStats()]);
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      const filters = {
        status: statusFilter !== "all" ? statusFilter : undefined,
        priority: priorityFilter !== "all" ? priorityFilter : undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        search: searchTerm || undefined,
      };
      const response = await projectApi.getAllProjects(filters);
      setProjects(response.data || []);
    } catch (error) {
      console.error("Error loading projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await userApi.getAllUsers();
      const employeesWithRoles = (response.data || []).filter(
        (user) =>
          user.roles &&
          user.roles.some((role) =>
            ["EMPLOYEE", "MANAGER", "HR"].includes(role.name || role)
          )
      );
      setEmployees(employeesWithRoles);
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await projectApi.getProjectStats();
      setStats(response.data || {});
    } catch (error) {
      console.error("Error loading project stats:", error);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
      };

      await projectApi.createProject(payload);
      toast.success("Project created successfully");
      setShowCreateModal(false);
      resetForm();
      loadProjects();
      loadStats();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create project");
    }
  };

  const handleEditProject = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
      };

      await projectApi.updateProject(selectedProject._id, payload);
      toast.success("Project updated successfully");
      setShowEditModal(false);
      resetForm();
      loadProjects();
      loadStats();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update project");
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete?._id) return;
    try {
      setIsDeleting(true);
      await projectApi.deleteProject(projectToDelete._id);
      toast.success("Project deleted successfully");
      setShowDeleteModal(false);
      setProjectToDelete(null);
      loadProjects();
      loadStats();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      status: "planning",
      priority: "medium",
      startDate: "",
      endDate: "",
      budget: "",
      client: "",
      category: "web-development",
      technologies: [],
      assignedEmployees: [],
      projectManager: "",
    });
    setSelectedProject(null);
    setNewTechnology("");
    setNewCategory("");
    setNewEmployeeId("");
    setNewEmployeeRole("developer");
  };

  const openEditModal = (project) => {
    setSelectedProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      status: project.status,
      priority: project.priority,
      startDate: new Date(project.startDate).toISOString().split("T")[0],
      endDate: new Date(project.endDate).toISOString().split("T")[0],
      budget: project.budget?.toString() || "",
      client: project.client || "",
      category: project.category || "web-development",
      technologies: project.technologies || [],
      assignedEmployees: project.assignedEmployees || [],
      projectManager:
        project.projectManager?._id || project.projectManager || "",
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const addCategory = () => {
    if (newCategory && newCategory.trim()) {
      setFormData((prev) => ({
        ...prev,
        category: newCategory.trim(),
      }));
      setNewCategory("");
    }
  };

  const handleCategoryKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCategory();
    }
  };

  const addTechnology = () => {
    if (newTechnology && newTechnology.trim()) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()],
      }));
      setNewTechnology("");
    }
  };

  const removeTechnology = (index) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index),
    }));
  };

  const addEmployee = () => {
    if (newEmployeeId && newEmployeeRole) {
      setFormData((prev) => ({
        ...prev,
        assignedEmployees: [
          ...prev.assignedEmployees,
          {
            employee: newEmployeeId,
            role: newEmployeeRole,
          },
        ],
      }));
      setNewEmployeeId("");
      setNewEmployeeRole("developer");
    }
  };

  const removeEmployee = (index) => {
    setFormData((prev) => ({
      ...prev,
      assignedEmployees: prev.assignedEmployees.filter((_, i) => i !== index),
    }));
  };

  const handleTechnologyKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTechnology();
    }
  };

  // Filter projects based on search and filters
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.client &&
        project.client.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || project.priority === priorityFilter;
    const matchesCategory =
      categoryFilter === "all" || project.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const getStatusColor = (status) => {
    const colors = {
      planning: "bg-blue-100 text-blue-800",
      "in-progress": "bg-yellow-100 text-yellow-800",
      "on-hold": "bg-orange-100 text-orange-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-yellow-500";
    if (progress >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Project Management
            </h1>
            <p className="text-slate-600 mt-2">
              Create, manage, and track all company projects
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary hover:bg-primary/90 text-white"
            iconName="Plus"
            iconPosition="left"
          >
            Create Project
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Projects
                </p>
                <p className="text-2xl font-bold text-slate-800">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name="FolderOpen" size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Active Projects
                </p>
                <p className="text-2xl font-bold text-slate-800">
                  {stats.active}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Icon name="Play" size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Completed</p>
                <p className="text-2xl font-bold text-slate-800">
                  {stats.completed}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Icon
                  name="CheckCircle"
                  size={24}
                  className="text-emerald-600"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Overdue</p>
                <p className="text-2xl font-bold text-slate-800">
                  {stats.overdue}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Icon name="AlertTriangle" size={24} className="text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Icon
                  name="Search"
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search projects by title, description, or client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              <option value="all">All Categories</option>
              <option value="web-development">Web Development</option>
              <option value="mobile-app">Mobile App</option>
              <option value="desktop-app">Desktop App</option>
              <option value="ai-ml">AI & Machine Learning</option>
              <option value="data-analytics">Data Analytics</option>
              <option value="cybersecurity">Cybersecurity</option>
              <option value="cloud-infrastructure">Cloud Infrastructure</option>
              <option value="e-commerce">E-commerce</option>
              <option value="cms">Content Management System</option>
              <option value="api-development">API Development</option>
              <option value="other">Other</option>
            </select>

            <Button
              onClick={loadProjects}
              variant="outline"
              iconName="RefreshCw"
              className="px-6"
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-slate-600 mt-2">Loading projects...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">
                      Project
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">
                      Priority
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">
                      Progress
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">
                      Timeline
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">
                      Team
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredProjects.map((project) => (
                    <tr
                      key={project._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                            <Icon
                              name="FolderOpen"
                              size={20}
                              className="text-white"
                            />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium text-slate-800">
                                {project.title}
                              </p>
                            </div>
                            {project.client && (
                              <p className="text-xs text-slate-400">
                                Client: {project.client}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            project.status
                          )}`}
                        >
                          {project.status.replace("-", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            project.priority
                          )}`}
                        >
                          {project.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {project.category
                            ?.replace("-", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase()) ||
                            "Web Development"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-slate-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getProgressColor(
                                project.progress
                              )}`}
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-slate-600">
                            {project.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600">
                          <p>
                            Start:{" "}
                            {new Date(project.startDate).toLocaleDateString()}
                          </p>
                          <p>
                            End:{" "}
                            {new Date(project.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {project.assignedEmployees
                            ?.slice(0, 3)
                            .map((assignment, index) => {
                              const employee = employees.find(
                                (emp) =>
                                  emp._id === assignment.employee?._id ||
                                  assignment.employee
                              );
                              return (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700"
                                  title={`${employee?.name || "Unknown"} - ${
                                    assignment.role
                                  }`}
                                >
                                  {employee?.name.split(" ")[0]}
                                </span>
                              );
                            })}
                          {project.assignedEmployees?.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                              +{project.assignedEmployees.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(project)}
                            className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
                            iconName="Edit"
                          ></Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteModal(project)}
                            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                            iconName="Trash2"
                          ></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredProjects.length === 0 && (
                <div className="p-8 text-center">
                  <Icon
                    name="FolderOpen"
                    size={48}
                    className="text-slate-300 mx-auto mb-4"
                  />
                  <p className="text-slate-600">
                    No projects found matching your criteria
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-5xl max-h-[95vh] overflow-y-auto">
            <div className="sticky -top-6 pt-6 bg-white z-10 flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">
                Create New Project
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Icon
                  name="X"
                  size={20}
                  className="text-black hover:text-slate-800  border-slate-200"
                />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Client
                  </label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) =>
                      setFormData({ ...formData, client: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Project Category *
                  </label>
                  <div className="space-y-2">
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option value="web-development">Web Development</option>
                      <option value="mobile-app">Mobile App</option>
                      <option value="desktop-app">Desktop App</option>
                      <option value="ai-ml">AI & Machine Learning</option>
                      <option value="data-analytics">Data Analytics</option>
                      <option value="cybersecurity">Cybersecurity</option>
                      <option value="cloud-infrastructure">
                        Cloud Infrastructure
                      </option>
                      <option value="e-commerce">E-commerce</option>
                      <option value="cms">Content Management System</option>
                      <option value="api-development">API Development</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Or type custom category (press Enter)"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyPress={handleCategoryKeyPress}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addCategory}
                        iconName="Plus"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500 mt-2">
                    Current:{" "}
                    <span className="font-medium">
                      {formData.category
                        .replace("-", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status *
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="planning">Planning</option>
                    <option value="in-progress">In Progress</option>
                    <option value="on-hold">On Hold</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Priority *
                  </label>
                  <select
                    required
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Budget
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Project Manager *
                  </label>
                  <select
                    required
                    value={formData.projectManager}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        projectManager: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="">Select Project Manager</option>
                    {employees
                      .filter((emp) =>
                        emp.roles?.some((r) =>
                          ["MANAGER", "ADMIN"].includes(r.name || r)
                        )
                      )
                      .map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Technologies
                </label>
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="Enter technology (press Enter to add)"
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    onKeyPress={handleTechnologyKeyPress}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTechnology}
                    iconName="Plus"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <Icon name="X" size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Assigned Employees
                </label>
                <div className="flex items-center space-x-2 mb-2">
                  <select
                    value={newEmployeeId}
                    onChange={(e) => setNewEmployeeId(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={newEmployeeRole}
                    onChange={(e) => setNewEmployeeRole(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="developer">Developer</option>
                    <option value="designer">Designer</option>
                    <option value="tester">Tester</option>
                    <option value="analyst">Analyst</option>
                    <option value="manager">Manager</option>
                    <option value="content-manager">Content Manager</option>
                    <option value="creative-director">Creative Director</option>
                    <option value="ui-ux-designer">UI/UX Designer</option>
                    <option value="frontend-developer">
                      Frontend Developer
                    </option>
                    <option value="backend-developer">Backend Developer</option>
                    <option value="fullstack-developer">
                      Fullstack Developer
                    </option>
                    <option value="devops-engineer">DevOps Engineer</option>
                    <option value="data-scientist">Data Scientist</option>
                    <option value="machine-learning-engineer">
                      ML Engineer
                    </option>
                    <option value="cybersecurity-specialist">
                      Cybersecurity Specialist
                    </option>
                    <option value="cloud-architect">Cloud Architect</option>
                    <option value="product-manager">Product Manager</option>
                    <option value="project-coordinator">
                      Project Coordinator
                    </option>
                    <option value="quality-assurance">Quality Assurance</option>
                    <option value="business-analyst">Business Analyst</option>
                    <option value="research-developer">R&D Developer</option>
                    <option value="technical-writer">Technical Writer</option>
                    <option value="support-specialist">
                      Support Specialist
                    </option>
                  </select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addEmployee}
                    iconName="Plus"
                    disabled={!newEmployeeId}
                  >
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.assignedEmployees.map((assignment, index) => {
                    const employee = employees.find(
                      (emp) => emp._id === assignment.employee
                    );
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-slate-50 rounded"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">
                            {employee?.name || "Unknown Employee"}
                          </span>
                          <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded">
                            {assignment.role}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeEmployee(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Icon name="X" size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                >
                  Create Project
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-5xl max-h-[95vh] overflow-y-auto">
            <div className="sticky -top-6 pt-6 bg-white z-10 flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">
                Edit Project
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Icon name="X" size={20} className="text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleEditProject} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Client
                  </label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) =>
                      setFormData({ ...formData, client: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Project Category *
                  </label>
                  <div className="space-y-2">
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option value="web-development">Web Development</option>
                      <option value="mobile-app">Mobile App</option>
                      <option value="desktop-app">Desktop App</option>
                      <option value="ai-ml">AI & Machine Learning</option>
                      <option value="data-analytics">Data Analytics</option>
                      <option value="cybersecurity">Cybersecurity</option>
                      <option value="cloud-infrastructure">
                        Cloud Infrastructure
                      </option>
                      <option value="e-commerce">E-commerce</option>
                      <option value="cms">Content Management System</option>
                      <option value="api-development">API Development</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Or type custom category (press Enter)"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyPress={handleCategoryKeyPress}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addCategory}
                        iconName="Plus"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500 mt-2">
                    Current:{" "}
                    <span className="font-medium">
                      {formData.category
                        .replace("-", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status *
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="planning">Planning</option>
                    <option value="in-progress">In Progress</option>
                    <option value="on-hold">On Hold</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Priority *
                  </label>
                  <select
                    required
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Budget
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Project Manager *
                  </label>
                  <select
                    required
                    value={formData.projectManager}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        projectManager: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="">Select Project Manager</option>
                    {employees
                      .filter((emp) =>
                        emp.roles?.some((r) =>
                          ["MANAGER", "ADMIN"].includes(r.name || r)
                        )
                      )
                      .map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name} ({emp.email})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Technologies
                </label>
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="Enter technology (press Enter to add)"
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    onKeyPress={handleTechnologyKeyPress}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTechnology}
                    iconName="Plus"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <Icon name="X" size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Assigned Employees
                </label>
                <div className="flex items-center space-x-2 mb-2">
                  <select
                    value={newEmployeeId}
                    onChange={(e) => setNewEmployeeId(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name} ({emp.email})
                      </option>
                    ))}
                  </select>
                  <select
                    value={newEmployeeRole}
                    onChange={(e) => setNewEmployeeRole(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="developer">Developer</option>
                    <option value="designer">Designer</option>
                    <option value="tester">Tester</option>
                    <option value="analyst">Analyst</option>
                    <option value="manager">Manager</option>
                    <option value="content-manager">Content Manager</option>
                    <option value="creative-director">Creative Director</option>
                    <option value="ui-ux-designer">UI/UX Designer</option>
                    <option value="frontend-developer">
                      Frontend Developer
                    </option>
                    <option value="backend-developer">Backend Developer</option>
                    <option value="fullstack-developer">
                      Fullstack Developer
                    </option>
                    <option value="devops-engineer">DevOps Engineer</option>
                    <option value="data-scientist">Data Scientist</option>
                    <option value="machine-learning-engineer">
                      ML Engineer
                    </option>
                    <option value="cybersecurity-specialist">
                      Cybersecurity Specialist
                    </option>
                    <option value="cloud-architect">Cloud Architect</option>
                    <option value="product-manager">Product Manager</option>
                    <option value="project-coordinator">
                      Project Coordinator
                    </option>
                    <option value="quality-assurance">Quality Assurance</option>
                    <option value="business-analyst">Business Analyst</option>
                    <option value="research-developer">R&D Developer</option>
                    <option value="technical-writer">Technical Writer</option>
                    <option value="support-specialist">
                      Support Specialist
                    </option>
                  </select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addEmployee}
                    iconName="Plus"
                    disabled={!newEmployeeId}
                  >
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.assignedEmployees.map((assignment, index) => {
                    // assignment.employee can be either an object or an ID string
                    const employeeId =
                      typeof assignment.employee === "object"
                        ? assignment.employee._id
                        : assignment.employee;
                    const employee = employees.find(
                      (emp) => emp._id === employeeId
                    );
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-slate-50 rounded"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">
                            {employee?.name.split(" ")[0]}  
                          </span>
                          <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded">
                            {assignment.role}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeEmployee(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Icon name="X" size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                >
                  Update Project
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        itemName={projectToDelete?.title}
        itemType="project"
        isLoading={isDeleting}
      />
    </AdminLayout>
  );
};

export default ProjectManagement;
