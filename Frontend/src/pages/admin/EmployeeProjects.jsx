import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../utils/axiosConfig";
import AdminLayout from "components/admin/AdminLayout";

const EmployeeProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAssignedProjects();
  }, []);

  const fetchAssignedProjects = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call when backend is ready
      // const response = await api.get('/api/employee/projects');
      // setProjects(response.data);
      
      // Mock data for now
      setProjects([
        {
          id: 1,
          title: "E-commerce Platform",
          description: "Building a modern e-commerce platform with React and Node.js",
          status: "in-progress",
          progress: 65,
          startDate: "2024-01-15",
          endDate: "2024-04-15",
          priority: "high",
          assignedBy: "Admin User",
          tasks: [
            { id: 1, title: "User Authentication", status: "completed" },
            { id: 2, title: "Product Catalog", status: "in-progress" },
            { id: 3, title: "Shopping Cart", status: "pending" },
          ],
        },
        {
          id: 2,
          title: "Mobile App Development",
          description: "Cross-platform mobile app using React Native",
          status: "planning",
          progress: 20,
          startDate: "2024-02-01",
          endDate: "2024-06-01",
          priority: "medium",
          assignedBy: "Admin User",
          tasks: [
            { id: 4, title: "UI/UX Design", status: "completed" },
            { id: 5, title: "API Integration", status: "pending" },
          ],
        },
        {
          id: 3,
          title: "Website Redesign",
          description: "Modernizing the company website with new design and features",
          status: "completed",
          progress: 100,
          startDate: "2023-11-01",
          endDate: "2024-01-31",
          priority: "low",
          assignedBy: "Admin User",
          tasks: [
            { id: 6, title: "Homepage Design", status: "completed" },
            { id: 7, title: "Contact Forms", status: "completed" },
            { id: 8, title: "SEO Optimization", status: "completed" },
          ],
        },
      ]);
    } catch (error) {
      console.error("Error fetching assigned projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "planning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "on-hold":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const filteredProjects = projects.filter((project) => {
    if (filter === "all") return true;
    return project.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Projects</h1>
          <p className="text-slate-600 mt-2">
            View and manage projects assigned to you
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex bg-white border border-slate-200 rounded-lg p-1">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-primary text-white"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("in-progress")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === "in-progress"
                  ? "bg-primary text-white"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === "completed"
                  ? "bg-primary text-white"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
          >
            {/* Project Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {project.title}
                </h3>
                <p className="text-slate-600 text-sm mb-3">
                  {project.description}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                    project.status
                  )}`}
                >
                  {project.status.replace("-", " ").toUpperCase()}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(
                    project.priority
                  )}`}
                >
                  {project.priority.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Progress</span>
                <span className="text-sm text-slate-600">{project.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                    project.progress
                  )}`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-slate-500 uppercase font-medium">Start Date</p>
                <p className="text-sm text-slate-800">
                  {new Date(project.startDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-medium">End Date</p>
                <p className="text-sm text-slate-800">
                  {new Date(project.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Assigned By */}
            <div className="mb-4">
              <p className="text-xs text-slate-500 uppercase font-medium">Assigned By</p>
              <p className="text-sm text-slate-800">{project.assignedBy}</p>
            </div>

            {/* Tasks Summary */}
            <div className="mb-4">
              <p className="text-xs text-slate-500 uppercase font-medium mb-2">Tasks</p>
              <div className="space-y-1">
                {project.tasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center space-x-2">
                    <Icon
                      name={
                        task.status === "completed"
                          ? "CheckCircle"
                          : task.status === "in-progress"
                          ? "Clock"
                          : "Circle"
                      }
                      size={14}
                      className={
                        task.status === "completed"
                          ? "text-green-500"
                          : task.status === "in-progress"
                          ? "text-blue-500"
                          : "text-slate-400"
                      }
                    />
                    <span className="text-sm text-slate-700">{task.title}</span>
                  </div>
                ))}
                {project.tasks.length > 3 && (
                  <p className="text-xs text-slate-500">
                    +{project.tasks.length - 3} more tasks
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  // TODO: Navigate to project details
                  console.log("View project details:", project.id);
                }}
              >
                <Icon name="Eye" size={16} className="mr-2" />
                View Details
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  // TODO: Navigate to tasks
                  console.log("View tasks for project:", project.id);
                }}
              >
                <Icon name="CheckSquare" size={16} className="mr-2" />
                View Tasks
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Icon name="FolderOpen" size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">
            No projects found
          </h3>
          <p className="text-slate-600">
            {filter === "all"
              ? "You haven't been assigned any projects yet."
              : `No ${filter.replace("-", " ")} projects found.`}
          </p>
        </div>
      )}
    </div>
    </AdminLayout>
  );
};

export default EmployeeProjects;
