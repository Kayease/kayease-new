import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { dashboardApi } from "../../utils/dashboardApi";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [error, setError] = useState("");

  // Real data states
  const [stats, setStats] = useState({
    blogs: { total: 0, published: 0, drafts: 0, featured: 0 },
    careers: { total: 0, active: 0, paused: 0, closed: 0 },
    portfolio: { total: 0, completed: 0, inProgress: 0, featured: 0 },
    clients: { total: 0, active: 0 },
    contacts: { total: 0, new: 0, contacted: 0, inProgress: 0, closed: 0 },
    team: { total: 0, active: 0, inactive: 0 },
    applications: {
      total: 0,
      pending: 0,
      reviewing: 0,
      selected: 0,
      rejected: 0,
    },
    callbacks: { total: 0, new: 0, inProgress: 0, contacted: 0 },
  });

  const [quickStats, setQuickStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Load dashboard data
  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setIsLoadingStats(true);
    setIsLoadingActivities(true);
    setError("");

    try {
      // Load all data in parallel
      const [statsData, activitiesData, notificationsData, quickStatsData] =
        await Promise.allSettled([
          dashboardApi.getStats(),
          dashboardApi.getRecentActivities(),
          dashboardApi.getNotifications(),
          dashboardApi.getQuickStats(),
        ]);

      // Process stats data
      if (statsData.status === "fulfilled") {
        setStats(statsData.value.data || statsData.value);
      }

      // Process activities data
      if (activitiesData.status === "fulfilled") {
        setRecentActivities(activitiesData.value.data || activitiesData.value);
      }

      // Process notifications data
      if (notificationsData.status === "fulfilled") {
        setNotifications(
          notificationsData.value.data || notificationsData.value
        );
      }

      // Process quick stats data
      if (quickStatsData.status === "fulfilled") {
        setQuickStats(quickStatsData.value.data || quickStatsData.value);
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError("Failed to load dashboard data");

      // Fallback to mock data if API fails
      loadMockData();
    } finally {
      setIsLoadingStats(false);
      setIsLoadingActivities(false);
    }
  };

  const loadMockData = () => {
    // Fallback mock data
    setStats({
      blogs: { total: 12, published: 8, drafts: 4, featured: 3 },
      careers: { total: 6, active: 4, paused: 1, closed: 1 },
      portfolio: { total: 24, completed: 20, inProgress: 4, featured: 8 },
      clients: { total: 18, active: 15 },
      contacts: { total: 45, new: 12, contacted: 20, inProgress: 8, closed: 5 },
      team: { total: 8, active: 7, inactive: 1 },
      applications: {
        total: 32,
        pending: 15,
        reviewing: 8,
        selected: 6,
        rejected: 3,
      },
      callbacks: { total: 10, new: 5, inProgress: 3, contacted: 2 },
    });

    setQuickStats([
      {
        title: "Total Applications",
        value: 32,
        change: "+12%",
        changeType: "positive",
        icon: "UserPlus",
        color: "bg-gradient-to-br from-blue-500 to-blue-600",
        description: "Job applications received",
      },
      {
        title: "Pending Reviews",
        value: 15,
        change: "+5%",
        changeType: "positive",
        icon: "Clock",
        color: "bg-gradient-to-br from-yellow-500 to-orange-500",
        description: "Awaiting review",
      },
      {
        title: "Selected Candidates",
        value: 6,
        change: "+8%",
        changeType: "positive",
        icon: "CheckCircle",
        color: "bg-gradient-to-br from-green-500 to-emerald-600",
        description: "Successfully hired",
      },
      {
        title: "Active Projects",
        value: 4,
        change: "+3%",
        changeType: "positive",
        icon: "TrendingUp",
        color: "bg-gradient-to-br from-purple-500 to-indigo-600",
        description: "Currently in progress",
      },
    ]);

    setRecentActivities([
      {
        id: 1,
        type: "user_registered",
        title: "New user registered",
        description: "John Doe joined the platform",
        time: "2 minutes ago",
        icon: "UserPlus",
        color: "bg-green-500",
        bgColor: "bg-green-50",
      },
      {
        id: 2,
        type: "contact_inquiry",
        title: "New contact inquiry",
        description: "Project consultation request received",
        time: "15 minutes ago",
        icon: "Mail",
        color: "bg-blue-500",
        bgColor: "bg-blue-50",
      },
      {
        id: 3,
        type: "blog_published",
        title: "Blog post published",
        description: "New article: 'Web Development Trends 2024'",
        time: "1 hour ago",
        icon: "FileText",
        color: "bg-purple-500",
        bgColor: "bg-purple-50",
      },
      {
        id: 4,
        type: "application_received",
        title: "Job application received",
        description: "Frontend Developer position",
        time: "2 hours ago",
        icon: "Briefcase",
        color: "bg-orange-500",
        bgColor: "bg-orange-50",
      },
    ]);

    setNotifications([
      {
        id: 1,
        title: "New job application",
        message: "Frontend Developer application received",
        type: "info",
        read: false,
        time: "5 minutes ago",
      },
      {
        id: 2,
        title: "Contact form submitted",
        message: "New inquiry from potential client",
        type: "success",
        read: false,
        time: "15 minutes ago",
      },
    ]);
  };

  const handleRefreshStats = async () => {
    setIsLoadingStats(true);
    try {
      await loadDashboardData();
      toast.success("Dashboard refreshed successfully!");
    } catch (error) {
      toast.error("Failed to refresh dashboard");
    } finally {
      setIsLoadingStats(false);
    }
  };

  const dashboardCards = [
    {
      id: "blogs",
      title: "Blog Management",
      description: "Create, edit, and manage blog posts",
      icon: "FileText",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      count: stats.blogs.total,
      route: "/admin/blogs",
      stats: [
        {
          label: "Published",
          value: stats.blogs.published,
          color: "text-green-600",
          icon: "CheckCircle",
        },
        {
          label: "Drafts",
          value: stats.blogs.drafts,
          color: "text-orange-600",
          icon: "Edit",
        },
        {
          label: "Featured",
          value: stats.blogs.featured,
          color: "text-purple-600",
          icon: "Star",
        },
      ],
    },
    {
      id: "careers",
      title: "Career Management",
      description: "Manage job openings and career posts",
      icon: "Briefcase",
      color: "bg-gradient-to-br from-green-500 to-emerald-600",
      count: stats.careers.total,
      route: "/admin/careers",
      stats: [
        {
          label: "Active",
          value: stats.careers.active,
          color: "text-green-600",
          icon: "Play",
        },
        {
          label: "Paused",
          value: stats.careers.paused,
          color: "text-yellow-600",
          icon: "Pause",
        },
        {
          label: "Closed",
          value: stats.careers.closed,
          color: "text-red-600",
          icon: "X",
        },
      ],
    },
    {
      id: "portfolio",
      title: "Portfolio Management",
      description: "Showcase projects and manage portfolio items",
      icon: "FolderOpen",
      color: "bg-gradient-to-br from-purple-500 to-indigo-600",
      count: stats.portfolio.total,
      route: "/admin/portfolio",
      stats: [
        {
          label: "Completed",
          value: stats.portfolio.completed,
          color: "text-green-600",
          icon: "CheckCircle",
        },
        {
          label: "In Progress",
          value: stats.portfolio.inProgress,
          color: "text-blue-600",
          icon: "Loader2",
        },
        {
          label: "Featured",
          value: stats.portfolio.featured,
          color: "text-purple-600",
          icon: "Star",
        },
      ],
    },
    {
      id: "clients",
      title: "Client Management",
      description: "Manage client information and relationships",
      icon: "Building",
      color: "bg-gradient-to-br from-indigo-500 to-purple-600",
      count: stats.clients.total,
      route: "/admin/clients",
      stats: [
        {
          label: "Active",
          value: stats.clients.active,
          color: "text-green-600",
          icon: "UserCheck",
        },
        {
          label: "Total",
          value: stats.clients.total,
          color: "text-indigo-600",
          icon: "Users",
        },
      ],
    },
    {
      id: "contacts",
      title: "Contact Management",
      description: "Handle contact inquiries and messages",
      icon: "Mail",
      color: "bg-gradient-to-br from-pink-500 to-rose-600",
      count: stats.contacts.total,
      route: "/admin/contacts",
      stats: [
        {
          label: "New",
          value: stats.contacts.new,
          color: "text-blue-600",
          icon: "Plus",
        },
        {
          label: "Contacted",
          value: stats.contacts.contacted,
          color: "text-green-600",
          icon: "MessageSquare",
        },
        {
          label: "In Progress",
          value: stats.contacts.inProgress,
          color: "text-orange-600",
          icon: "Clock",
        },
      ],
    },
    {
      id: "team",
      title: "Team Management",
      description: "Add and manage team members and their profiles",
      icon: "UserPlus",
      color: "bg-gradient-to-br from-orange-500 to-red-500",
      count: stats.team.total,
      route: "/admin/team",
      stats: [
        {
          label: "Active",
          value: stats.team.active,
          color: "text-green-600",
          icon: "UserCheck",
        },
        {
          label: "Inactive",
          value: stats.team.inactive,
          color: "text-red-600",
          icon: "UserX",
        },
      ],
    },
    {
      id: "callbacks",
      title: "Callback Requests",
      description: "Manage callback requests from website visitors",
      icon: "Phone",
      color: "bg-gradient-to-br from-emerald-500 to-teal-600",
      count: stats.callbacks.total,
      route: "/admin/callback-requests",
      stats: [
        {
          label: "Pending",
          value: stats.callbacks.new,
          color: "text-yellow-600",
          icon: "Clock",
        },
        {
          label: "In Progress",
          value: stats.callbacks.inProgress,
          color: "text-orange-600",
          icon: "Loader2",
        },
        {
          label: "Contacted",
          value: stats.callbacks.contacted,
          color: "text-green-600",
          icon: "MessageSquare",
        },
      ],
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Dashboard Overview
            </h1>
            <p className="text-slate-600 mt-2">Welcome back, {user?.name}</p>
          </div>
          <Button
            variant="outline"
            size="lg"
            onClick={handleRefreshStats}
            disabled={isLoadingStats}
            iconName={isLoadingStats ? "Loader2" : "RefreshCw"}
            iconPosition="left"
          >
            {isLoadingStats ? "Refreshing..." : "Refresh Data"}
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-red-600" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {isLoadingStats
            ? // Loading skeleton for quick stats
              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-pulse"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                    <div className="text-right">
                      <div className="h-8 w-16 bg-slate-200 rounded mb-2"></div>
                      <div className="h-4 w-20 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                  <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
                  <div className="h-3 w-32 bg-slate-200 rounded"></div>
                </div>
              ))
            : quickStats.map((stat, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon name={stat.icon} size={24} className="text-white" />
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-slate-800">
                        {stat.value}
                      </span>
                      <div className="flex items-center justify-end mt-1">
                        <span
                          className={`text-sm font-medium ${
                            stat.changeType === "positive"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">
                      {stat.title}
                    </h3>
                    <p className="text-sm text-slate-600">{stat.description}</p>
                  </div>
                </div>
              ))}
        </div>

        {/* Main Content Grid */}
        <div className="">
          {/* Management Dashboard */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-800">
                  Management Dashboard
                </h3>
                <p className="text-sm text-slate-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              </div>

              {isLoadingStats ? (
                // Loading skeleton for management cards
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 7 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-6 animate-pulse"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                        <div className="text-right">
                          <div className="h-8 w-16 bg-slate-200 rounded mb-2"></div>
                          <div className="h-3 w-20 bg-slate-200 rounded"></div>
                        </div>
                      </div>
                      <div className="h-4 w-32 bg-slate-200 rounded mb-2"></div>
                      <div className="h-3 w-48 bg-slate-200 rounded mb-4"></div>
                      <div className="space-y-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="flex justify-between">
                            <div className="h-3 w-16 bg-slate-200 rounded"></div>
                            <div className="h-3 w-8 bg-slate-200 rounded"></div>
                          </div>
                        ))}
                      </div>
                      <div className="h-8 w-full bg-slate-200 rounded mt-4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {dashboardCards.map((card) => (
                    <div
                      key={card.id}
                      className="group relative bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                        >
                          <Icon
                            name={card.icon}
                            size={24}
                            className="text-white"
                          />
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-slate-800">
                            {card.count}
                          </span>
                          <p className="text-xs text-slate-500">Total Items</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-semibold text-slate-800 mb-1">
                          {card.title}
                        </h4>
                        <p className="text-sm text-slate-600 mb-3">
                          {card.description}
                        </p>

                        {/* Stats breakdown */}
                        <div className="space-y-2">
                          {card.stats.map((stat, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center space-x-2">
                                <Icon
                                  name={stat.icon}
                                  size={12}
                                  className={stat.color}
                                />
                                <span className="text-slate-600">
                                  {stat.label}:
                                </span>
                              </div>
                              <span className={`font-medium ${stat.color}`}>
                                {stat.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button
                        variant="default"
                        size="sm"
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                        iconName="ArrowRight"
                        iconPosition="right"
                        onClick={() => navigate(card.route)}
                      >
                        Manage
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
