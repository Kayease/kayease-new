import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from '../ui/Button';
import { portfolioApi } from '../../utils/portfolioApi';

const PortfolioStatsWidget = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentPortfolios, setRecentPortfolios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const [statsResponse, portfoliosResponse] = await Promise.all([
        portfolioApi.getStats(),
        portfolioApi.getAll({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' })
      ]);
      
      setStats(statsResponse);
      setRecentPortfolios(portfoliosResponse.portfolios || []);
    } catch (error) {
      console.error('Error loading portfolio data:', error);
      setError('Failed to load portfolio data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryName = (categoryId) => {
    const categoryMap = {
      'web-dev': 'Web Dev',
      'mobile': 'Mobile',
      'ecommerce': 'E-commerce',
      'saas': 'SaaS',
      'healthcare': 'Healthcare',
      'fintech': 'Fintech',
      'education': 'Education',
      'other': 'Other'
    };
    return categoryMap[categoryId] || categoryId;
  };

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'text-green-600',
      'in-progress': 'text-blue-600',
      'on-hold': 'text-yellow-600'
    };
    return colors[status] || 'text-gray-600';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-center h-48">
          <div className="flex items-center space-x-3">
            <Icon name="Loader2" size={20} className="animate-spin text-primary" />
            <span className="text-slate-600">Loading portfolio data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="text-center py-8">
          <Icon name="AlertCircle" size={32} className="mx-auto text-red-400 mb-3" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            iconName="RefreshCw"
            iconPosition="left"
            iconSize={14}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon name="Briefcase" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Portfolio Overview</h3>
            <p className="text-sm text-slate-600">Project statistics and recent activity</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/admin/portfolio')}
          iconName="ExternalLink"
          iconPosition="right"
          iconSize={14}
        >
          View All
        </Button>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-900">{stats.totalProjects}</div>
            <div className="text-xs text-slate-600">Total Projects</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.completedProjects}</div>
            <div className="text-xs text-slate-600">Completed</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.inProgressProjects}</div>
            <div className="text-xs text-slate-600">In Progress</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.featuredProjects}</div>
            <div className="text-xs text-slate-600">Featured</div>
          </div>
        </div>
      )}

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-slate-900">Recent Projects</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/portfolio/new')}
            iconName="Plus"
            iconSize={14}
            className="text-primary hover:text-primary/80"
          >
            Add New
          </Button>
        </div>

        {recentPortfolios.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
            <Icon name="Briefcase" size={32} className="mx-auto text-slate-400 mb-3" />
            <p className="text-slate-600 mb-3">No portfolio projects yet</p>
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate('/admin/portfolio/new')}
              iconName="Plus"
              iconPosition="left"
              iconSize={14}
              className="cta-button text-white"
            >
              Create First Project
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentPortfolios.map((portfolio) => (
              <div
                key={portfolio._id}
                className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
                onClick={() => navigate(`/admin/portfolio/edit/${portfolio._id}`)}
              >
                <div className="h-10 w-10 flex-shrink-0">
                  <img
                    src={portfolio.mainImage}
                    alt={portfolio.title}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {portfolio.title}
                    </p>
                    {portfolio.featured && (
                      <Icon name="Star" size={12} className="text-yellow-500" fill="currentColor" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <span>{getCategoryName(portfolio.category)}</span>
                    <span>•</span>
                    <span className={getStatusColor(portfolio.status)}>
                      {portfolio.status}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  {formatDate(portfolio.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Distribution */}
      {stats && stats.categoryStats && stats.categoryStats.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <h4 className="text-sm font-medium text-slate-900 mb-3">Category Distribution</h4>
          <div className="space-y-2">
            {stats.categoryStats.slice(0, 5).map((category) => (
              <div key={category._id} className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  {getCategoryName(category._id)}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: `${(category.count / stats.totalProjects) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-900 w-6 text-right">
                    {category.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/portfolio/new')}
            iconName="Plus"
            iconPosition="left"
            iconSize={14}
            className="justify-center"
          >
            New Project
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/portfolio')}
            iconName="Settings"
            iconPosition="left"
            iconSize={14}
            className="justify-center"
          >
            Manage All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioStatsWidget;