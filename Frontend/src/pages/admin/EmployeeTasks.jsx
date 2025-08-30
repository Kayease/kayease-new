import React, { useState, useEffect } from "react";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import { useAuth } from "../../contexts/AuthContext";
import AdminLayout from "components/admin/AdminLayout";

const EmployeeTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call when backend is ready
      // const response = await api.get('/api/employee/tasks');
      // setTasks(response.data);
      
      // Mock data for now
      setTasks([
        {
          id: 1,
          title: "Complete user authentication module",
          description: "Implement JWT authentication for the e-commerce platform",
          status: "in-progress",
          priority: "high",
          project: "E-commerce Platform",
          dueDate: "2024-02-15",
          assignedBy: "Admin User",
          estimatedHours: 8,
          actualHours: 4,
        },
        {
          id: 2,
          title: "Design product catalog page",
          description: "Create responsive product listing with filters and search",
          status: "pending",
          priority: "medium",
          project: "E-commerce Platform",
          dueDate: "2024-02-20",
          assignedBy: "Admin User",
          estimatedHours: 12,
          actualHours: 0,
        },
        {
          id: 3,
          title: "Update company website content",
          description: "Review and update the about us and services pages",
          status: "completed",
          priority: "low",
          project: "Website Redesign",
          dueDate: "2024-02-10",
          assignedBy: "Admin User",
          estimatedHours: 6,
          actualHours: 5,
        },
        {
          id: 4,
          title: "Create API documentation",
          description: "Document all API endpoints for the mobile app",
          status: "in-progress",
          priority: "medium",
          project: "Mobile App Development",
          dueDate: "2024-02-25",
          assignedBy: "Admin User",
          estimatedHours: 10,
          actualHours: 3,
        },
      ]);
    } catch (error) {
      console.error("Error fetching tasks:", error);
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
      case "pending":
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

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // await api.patch(`/api/employee/tasks/${taskId}`, { status: newStatus });
      
      // Update local state for now
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
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
          <h1 className="text-3xl font-bold text-slate-800">My Tasks</h1>
          <p className="text-slate-600 mt-2">
            Manage and track your assigned tasks
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
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === "pending"
                  ? "bg-primary text-white"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              Pending
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

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-slate-800">
                    {task.title}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status.replace("-", " ").toUpperCase()}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-slate-600 mb-3">{task.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500 font-medium">Project</p>
                    <p className="text-slate-800">{task.project}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Due Date</p>
                    <p className="text-slate-800">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Estimated Hours</p>
                    <p className="text-slate-800">{task.estimatedHours}h</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Actual Hours</p>
                    <p className="text-slate-800">{task.actualHours}h</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 ml-4">
                {task.status === "pending" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateTaskStatus(task.id, "in-progress")}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Icon name="Play" size={16} className="mr-2" />
                    Start
                  </Button>
                )}
                {task.status === "in-progress" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateTaskStatus(task.id, "completed")}
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <Icon name="Check" size={16} className="mr-2" />
                    Complete
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // TODO: Open task details modal
                    console.log("View task details:", task.id);
                  }}
                >
                  <Icon name="Eye" size={16} className="mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Icon name="CheckSquare" size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">
            No tasks found
          </h3>
          <p className="text-slate-600">
            {filter === "all"
              ? "You don't have any tasks assigned yet."
              : `No ${filter.replace("-", " ")} tasks found.`}
          </p>
        </div>
      )}
    </div>
   </AdminLayout>
  );
};

export default EmployeeTasks;
