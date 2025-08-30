import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "../../components/AppIcon";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../utils/axiosConfig";
import AdminLayout from "components/admin/AdminLayout";

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    assignedProjects: 0,
    pendingTasks: 0,
    completedTasks: 0,
    totalWorkHours: 0,
    thisMonthHours: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API calls when backend is ready
      // const response = await api.get('/api/employee/dashboard-stats');
      // setStats(response.data);

      // Mock data for now
      setStats({
        assignedProjects: 3,
        pendingTasks: 5,
        completedTasks: 12,
        totalWorkHours: 156,
        thisMonthHours: 42,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Clock In/Out",
      description: "Record your work hours",
      icon: "Clock",
      href: "/admin/employee/attendance",
      color: "bg-blue-500",
      textColor: "text-blue-500",
    },
    {
      title: "View Tasks",
      description: "Check your assigned tasks",
      icon: "CheckSquare",
      href: "/admin/employee/tasks",
      color: "bg-green-500",
      textColor: "text-green-500",
    },
    {
      title: "Projects",
      description: "View assigned projects",
      icon: "FolderOpen",
      href: "/admin/employee/projects",
      color: "bg-purple-500",
      textColor: "text-purple-500",
    },
    {
      title: "Payslips",
      description: "Download your payslips",
      icon: "FileText",
      href: "/admin/employee/payslips",
      color: "bg-orange-500",
      textColor: "text-orange-500",
    },
  ];

  const recentActivities = [
    {
      type: "task",
      title: "Completed task: Update user interface",
      time: "2 hours ago",
      icon: "CheckCircle",
      color: "text-green-500",
    },
    {
      type: "attendance",
      title: "Clocked in at 9:00 AM",
      time: "Today",
      icon: "Clock",
      color: "text-blue-500",
    },
    {
      type: "project",
      title: "Assigned to new project: E-commerce Platform",
      time: "Yesterday",
      icon: "FolderOpen",
      color: "text-purple-500",
    },
  ];

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
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.name?.split(" ")[0]}!
              </h1>
              <p className="text-blue-100 text-lg">
                Here's what's happening with your work today.
              </p>
            </div>
            <div className="hidden lg:block">
              <Icon name="User" size={64} className="text-white/20" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Assigned Projects
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {stats.assignedProjects}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Icon name="FolderOpen" size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Pending Tasks
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {stats.pendingTasks}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Icon name="Clock" size={24} className="text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Completed Tasks
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {stats.completedTasks}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Icon name="CheckCircle" size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  This Month Hours
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {stats.thisMonthHours}h
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Icon name="Activity" size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.href}
                className="group p-6 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-3 rounded-lg ${action.color} bg-opacity-10`}
                  >
                    <Icon
                      name={action.icon}
                      size={24}
                      className={action.textColor}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Recent Activities
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className={`p-2 rounded-lg bg-slate-100`}>
                  <Icon
                    name={activity.icon}
                    size={20}
                    className={activity.color}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{activity.title}</p>
                  <p className="text-sm text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Upcoming Deadlines
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-orange-50 border border-orange-200">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-orange-100">
                  <Icon
                    name="AlertTriangle"
                    size={20}
                    className="text-orange-600"
                  />
                </div>
                <div>
                  <p className="font-medium text-slate-800">
                    Complete user authentication module
                  </p>
                  <p className="text-sm text-slate-600">
                    Project: E-commerce Platform
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-orange-600">
                  Due Tomorrow
                </p>
                <p className="text-xs text-slate-500">Priority: High</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Icon name="Calendar" size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">
                    Submit weekly progress report
                  </p>
                  <p className="text-sm text-slate-600">Weekly Review</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-blue-600">Due Friday</p>
                <p className="text-xs text-slate-500">Priority: Medium</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EmployeeDashboard;
