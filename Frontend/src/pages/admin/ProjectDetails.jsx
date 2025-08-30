import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import { useAuth } from "../../contexts/AuthContext";
import AdminLayout from "components/admin/AdminLayout";
import { toast } from "react-toastify";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      // Mock data for now
      setProject({
        id: projectId,
        title: "E-commerce Platform Development",
        description: "A comprehensive e-commerce platform with payment integration and inventory management.",
        client: "TechCorp Inc.",
        startDate: "2024-01-15",
        endDate: "2024-06-30",
        budget: 75000,
        status: "active",
        priority: "high",
        progress: 65,
        teamMembers: 8,
        totalTasks: 24,
        completedTasks: 16,
        pendingTasks: 8,
        totalHours: 320,
        actualHours: 208,
        manager: "Mike Johnson",
        technologies: ["React", "Node.js", "MongoDB", "Stripe API"],
      });

      setTasks([
        {
          id: 1,
          title: "User Authentication System",
          description: "Implement JWT-based authentication",
          assignedTo: "John Doe",
          priority: "high",
          status: "completed",
          dueDate: "2024-02-15",
          progress: 100,
        },
        {
          id: 2,
          title: "Product Catalog Design",
          description: "Create responsive product listing",
          assignedTo: "Jane Smith",
          priority: "high",
          status: "in-progress",
          dueDate: "2024-03-01",
          progress: 60,
        },
      ]);
    } catch (error) {
      console.error("Error fetching project details:", error);
      toast.error("Failed to fetch project details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "completed": return "bg-blue-100 text-blue-800 border-blue-200";
      case "on-hold": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Project Not Found</h2>
            <Button onClick={() => navigate("/admin/projects")} className="bg-primary hover:bg-primary/90">
              Back to Projects
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate("/admin/projects")}
              variant="outline"
              size="sm"
              iconName="ArrowLeft"
            >
              Back to Projects
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">{project.title}</h1>
              <p className="text-slate-600 mt-1">Project Details & Management</p>
            </div>
          </div>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Progress</p>
                <p className="text-3xl font-bold text-slate-800">{project.progress}%</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Icon name="TrendingUp" size={24} className="text-blue-600" />
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Tasks</p>
                <p className="text-3xl font-bold text-slate-800">{project.completedTasks}/{project.totalTasks}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Icon name="CheckSquare" size={24} className="text-green-600" />
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-1">Completed</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Team Members</p>
                <p className="text-3xl font-bold text-slate-800">{project.teamMembers}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Icon name="Users" size={24} className="text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-1">Assigned</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Hours</p>
                <p className="text-3xl font-bold text-slate-800">{project.actualHours}/{project.totalHours}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Icon name="Clock" size={24} className="text-orange-600" />
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-1">Worked/Estimated</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "overview", name: "Overview", icon: "Info" },
                { id: "tasks", name: "Tasks", icon: "CheckSquare" },
                { id: "team", name: "Team", icon: "Users" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800">Project Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Client:</span>
                        <span className="font-medium">{project.client}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Manager:</span>
                        <span className="font-medium">{project.manager}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Budget:</span>
                        <span className="font-medium">${project.budget.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Duration:</span>
                        <span className="font-medium">
                          {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Priority:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(project.priority)}`}>
                          {project.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-lg font-semibold text-slate-800 mt-6">Description</h3>
                    <p className="text-slate-600 leading-relaxed">{project.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tasks Tab */}
            {activeTab === "tasks" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800">Project Tasks</h3>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-slate-800">{task.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                          <p className="text-slate-600 text-sm mb-3">{task.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-slate-500">
                            <span>Assigned to: {task.assignedTo}</span>
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-slate-800 mb-1">{task.progress}%</div>
                          <div className="w-20 bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Team Tab */}
            {activeTab === "team" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800">Team Members</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "John Doe", role: "Lead Developer", hours: 45, tasks: 8 },
                    { name: "Jane Smith", role: "UI/UX Designer", hours: 38, tasks: 6 },
                    { name: "David Wilson", role: "Backend Developer", hours: 42, tasks: 5 },
                  ].map((member, index) => (
                    <div
                      key={index}
                      className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                          <Icon name="User" size={20} className="text-slate-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-800">{member.name}</h4>
                          <p className="text-sm text-slate-500">{member.role}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Hours Worked:</span>
                          <span className="font-medium">{member.hours}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Tasks Completed:</span>
                          <span className="font-medium">{member.tasks}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProjectDetails;