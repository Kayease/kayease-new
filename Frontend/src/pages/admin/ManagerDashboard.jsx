import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "../../components/AppIcon";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../utils/axiosConfig";
import AdminLayout from "components/admin/AdminLayout";

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    pendingTasks: 0,
    completedTasks: 0,
    teamMembers: 0,
    totalWorkHours: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API calls when backend is ready
      // const response = await api.get('/api/manager/dashboard-stats');
      // setStats(response.data);

      // Mock data for now
      setStats({
        totalProjects: 8,
        activeProjects: 5,
        pendingTasks: 15,
        completedTasks: 45,
        teamMembers: 12,
        totalWorkHours: 320,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Create Project",
      description: "Start a new project",
      icon: "Plus",
      href: "/admin/manager/projects/create",
      color: "bg-blue-500",
      textColor: "text-blue-500",
    },
    {
      title: "Assign Tasks",
      description: "Assign tasks to team members",
      icon: "UserPlus",
      href: "/admin/manager/tasks/create",
      color: "bg-green-500",
      textColor: "text-green-500",
    },
    {
      title: "View Team",
      description: "Manage team members",
      icon: "Users",
      href: "/admin/manager/team",
      color: "bg-purple-500",
      textColor: "text-purple-500",
    },
    {
      title: "Attendance",
      description: "Monitor team attendance",
      icon: "Clock",
      href: "/admin/manager/attendance",
      color: "bg-orange-500",
      textColor: "text-orange-500",
    },
  ];

  const recentActivities = [
    {
      type: "project",
      title: "New project created: E-commerce Platform",
      time: "2 hours ago",
      icon: "FolderOpen",
      color: "text-blue-500",
    },
    {
      type: "task",
      title: "Task assigned: User authentication module",
      time: "4 hours ago",
      icon: "CheckSquare",
      color: "text-green-500",
    },
    {
      type: "team",
      title: "New team member added: John Doe",
      time: "Yesterday",
      icon: "UserPlus",
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
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.name?.split(" ")[0]}!
              </h1>
              <p className="text-indigo-100 text-lg">
                Manage your projects and team efficiently.
              </p>
            </div>
            <div className="hidden lg:block">
              <Icon name="UserCheck" size={64} className="text-white/20" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Total Projects
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {stats.totalProjects}
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
                  Active Projects
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {stats.activeProjects}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Icon name="Activity" size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Team Members
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {stats.teamMembers}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Icon name="Users" size={24} className="text-purple-600" />
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
                  Total Work Hours
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {stats.totalWorkHours}h
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Icon name="Clock" size={24} className="text-indigo-600" />
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

        {/* Project Overview */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Project Overview
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Icon name="FolderOpen" size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">
                    E-commerce Platform
                  </p>
                  <p className="text-sm text-slate-600">Progress: 65%</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-blue-600">Active</p>
                <p className="text-xs text-slate-500">Due: March 15</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-green-100">
                  <Icon name="FolderOpen" size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">
                    Mobile App Development
                  </p>
                  <p className="text-sm text-slate-600">Progress: 85%</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">Active</p>
                <p className="text-xs text-slate-500">Due: March 30</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManagerDashboard;
