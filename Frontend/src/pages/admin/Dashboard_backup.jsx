import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import AdminLayout from "../../components/admin/AdminLayout";
import { selectUser } from '../../store/slices/authSlice';
import { toast } from "react-toastify";
import { blogApi } from "../../utils/blogApi";
import { careerApi } from "../../utils/careerApi";
import { portfolioApi } from "../../utils/portfolioApi";
import { clientApi } from "../../utils/clientApi";
import { contactApi } from "../../utils/contactApi";
import { teamApi } from "../../utils/teamApi";
import { jobApplicationApi } from "../../utils/jobApplicationApi";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [stats, setStats] = useState({
    blogs: { total: 0, published: 0, drafts: 0, featured: 0 },
    careers: { total: 0, active: 0, paused: 0, closed: 0 },
    portfolio: { total: 0, completed: 0, inProgress: 0, featured: 0 },
    clients: { total: 0, active: 0 },
    contacts: { total: 0, new: 0, contacted: 0, inProgress: 0, closed: 0 },
    team: { total: 0, active: 0, inactive: 0 },
    applications: { total: 0, pending: 0, reviewing: 0, selected: 0, rejected: 0 }
  });

  useEffect(() => {
    if (user) {
      loadDashboardStats();
      const refreshInterval = setInterval(() => {
        loadDashboardStats();
      }, 5 * 60 * 1000); // 5 minutes
      return () => clearInterval(refreshInterval);
    }
  }, [user]);

  const loadDashboardStats = async () => {
    setIsLoadingStats(true);
    setError("");

    try {
      // Load stats from all APIs in parallel
      const [
        blogStats,
        careerStats,
        portfolioStats,
        clientStats,
        contactStats,
        teamStats,
        applicationStats,
      ] = await Promise.allSettled([
        blogApi.getStats().catch(() => ({ totalBlogs: 0, publishedBlogs: 0, draftBlogs: 0, featuredBlogs: 0 })),
        careerApi.getStats().catch(() => ({ totalCareers: 0, activeCareers: 0, pausedCareers: 0, closedCareers: 0 })),
        portfolioApi.getStats().catch(() => ({ totalProjects: 0, completedProjects: 0, inProgressProjects: 0, featuredProjects: 0 })),
        clientApi.getStats().catch(() => ({ totalClients: 0, activeClients: 0 })),
        contactApi.getStats().catch(() => ({ overview: { total: 0, new: 0, contacted: 0, inProgress: 0, closed: 0 } })),
        teamApi.getStats().catch(() => ({ overview: { total: 0, active: 0, inactive: 0 } })),
        jobApplicationApi.getStats().catch(() => ({ data: { overview: { total: 0, pending: 0, reviewing: 0, selected: 0, rejected: 0 } } })),
      ]);

      // Process stats
      const blogData = blogStats.status === "fulfilled" ? blogStats.value : {};
      const careerData = careerStats.status === "fulfilled" ? careerStats.value : {};
      const portfolioData = portfolioStats.status === "fulfilled" ? portfolioStats.value : {};
      const clientData = clientStats.status === "fulfilled" ? clientStats.value : {};
      const contactData = contactStats.status === "fulfilled" ? contactStats.value : {};
      const teamData = teamStats.status === "fulfilled" ? teamStats.value : {};
      const applicationData = applicationStats.status === "fulfilled" ? applicationStats.value : {};

      setStats({
        blogs: {
          total: blogData.totalBlogs || 0,
          published: blogData.publishedBlogs || 0,
          drafts: blogData.draftBlogs || 0,
          featured: blogData.featuredBlogs || 0,
        },
        careers: {
          total: careerData.totalCareers || 0,
          active: careerData.activeCareers || 0,
          paused: careerData.pausedCareers || 0,
          closed: careerData.closedCareers || 0,
        },
        portfolio: {
          total: portfolioData.totalProjects || 0,
          completed: portfolioData.completedProjects || 0,
          inProgress: portfolioData.inProgressProjects || 0,
          featured: portfolioData.featuredProjects || 0,
        },
        clients: {
          total: clientData.totalClients || 0,
          active: clientData.activeClients || 0,
        },
        contacts: {
          total: contactData.overview?.total || 0,
          new: contactData.overview?.new || 0,
          contacted: contactData.overview?.contacted || 0,
          inProgress: contactData.overview?.inProgress || 0,
          closed: contactData.overview?.closed || 0,
        },
        team: {
          total: teamData.overview?.total || 0,
          active: teamData.overview?.active || 0,
          inactive: teamData.overview?.inactive || 0,
        },
        applications: {
          total: applicationData.data?.overview?.total || 0,
          pending: applicationData.data?.overview?.pending || 0,
          reviewing: applicationData.data?.overview?.reviewing || 0,
          selected: applicationData.data?.overview?.selected || 0,
          rejected: applicationData.data?.overview?.rejected || 0,
        },
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
      setError("Failed to load dashboard statistics");
      toast.error("Failed to load dashboard statistics");
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleRefreshStats = () => {
    loadDashboardStats();
    toast.success("Dashboard refreshed");
  };

  const dashboardCards = [
    {
      id: "blogs",
      title: "Blog Management",
      description: "Create, edit, and manage blog posts",
      icon: "FileText",
      color: "bg-blue-500",
      count: stats.blogs.total,
      route: "/admin/blogs",
    },
    {
      id: "careers",
      title: "Career Management",
      description: "Manage job openings and career posts",
      icon: "Briefcase",
      color: "bg-green-500",
      count: stats.careers.total,
      route: "/admin/careers",
    },
    {
      id: "portfolio",
      title: "Portfolio Management",
      description: "Showcase projects and manage portfolio items",
      icon: "FolderOpen",
      color: "bg-purple-500",
      count: stats.portfolio.total,
      route: "/admin/portfolio",
    },
    {
      id: "clients",
      title: "Client Management",
      description: "Manage client information and relationships",
      icon: "Building",
      color: "bg-indigo-500",
      count: stats.clients.total,
      route: "/admin/clients",
    },
    {
      id: "contacts",
      title: "Contact Management",
      description: "Handle contact inquiries and messages",
      icon: "Mail",
      color: "bg-pink-500",
      count: stats.contacts.total,
      route: "/admin/contacts",
    },
    {
      id: "team",
      title: "Team Management",
      description: "Add and manage team members and their profiles",
      icon: "UserCheck",
      color: "bg-orange-500",
      count: stats.team.total,
      route: "/admin/team",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
            <p className="text-slate-600">Welcome back, {user?.name}! Here's what's happening.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshStats}
            disabled={isLoadingStats}
            iconName={isLoadingStats ? "Loader2" : "RefreshCw"}
            iconPosition="left"
          >
            Refresh Stats
          </Button>
        </div>

        {/* Loading indicator */}
        {isLoadingStats && (
          <div className="flex items-center space-x-2 text-slate-600">
            <Icon name="Loader2" size={16} className="animate-spin" />
            <span className="text-sm">Loading statistics...</span>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-red-600" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Last updated info */}
        {lastUpdated && !isLoadingStats && (
          <div className="text-sm text-slate-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}

        {/* Management Dashboard */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">
              Management Dashboard
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardCards.map((card) => (
              <div
                key={card.id}
                className="group relative bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <Icon name={card.icon} size={24} className="text-white" />
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
                  <p className="text-sm text-slate-600">
                    {card.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 bg-primary hover:bg-primary/90 text-white"
                    iconName="ArrowRight"
                    iconPosition="right"
                    onClick={() => navigate(card.route)}
                  >
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;