import React from "react";
import Icon from "../../AppIcon";
import Button from "../../ui/Button";
import { jobApplicationApi } from "../../../utils/jobApplicationApi";

const JobApplicationsTable = ({ 
  applications, 
  isLoading, 
  error, 
  stats, 
  onViewApplication, 
  onDeleteApplication, 
  onFilterChange, 
  onRetry 
}) => {
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusInfo = jobApplicationApi.formatStatus(status);
    const colorClasses = {
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${colorClasses[statusInfo.color]}`}>
        <Icon name={statusInfo.icon} size={12} />
        {statusInfo.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Icon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-medium">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={onRetry}
              iconName="RefreshCw"
              iconPosition="left"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Icon name="Inbox" size={48} className="text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No applications found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left py-3 px-6 font-medium text-slate-700">Applicant</th>
              <th className="text-left py-3 px-6 font-medium text-slate-700">Job Title</th>
              <th className="text-left py-3 px-6 font-medium text-slate-700">Applied Date</th>
              <th className="text-left py-3 px-6 font-medium text-slate-700">Status</th>
              <th className="text-left py-3 px-6 font-medium text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {applications.map((application) => (
              <tr key={application._id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6">
                  <div>
                    <p className="font-medium text-slate-800">{application.fullName}</p>
                    <p className="text-sm text-slate-600">{application.email}</p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <p className="font-medium text-slate-800">{application.jobTitle}</p>
                  <p className="text-sm text-slate-600">{application.jobId?.department}</p>
                </td>
                <td className="py-4 px-6">
                  <p className="text-slate-800">{formatDate(application.appliedAt)}</p>
                  <p className="text-sm text-slate-600">{application.applicationAge}</p>
                </td>
                <td className="py-4 px-6">
                  {getStatusBadge(application.status)}
                </td>
                
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-400"
                      iconName="Eye"
                      iconPosition="left"
                      onClick={() => onViewApplication(application)}
                    >
                      View
                    </Button>
                    <div className="relative group">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-600 hover:border-red-400"
                        iconName="Trash2"
                        iconPosition="left"
                        onClick={() => onDeleteApplication(application)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {stats.pagination && stats.pagination.pages > 1 && (
        <div className="border-t border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Showing {((stats.pagination.current - 1) * stats.pagination.limit) + 1} to{' '}
              {Math.min(stats.pagination.current * stats.pagination.limit, stats.pagination.total)} of{' '}
              {stats.pagination.total} results
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={stats.pagination.current === 1}
                onClick={() => onFilterChange('page', stats.pagination.current - 1)}
                iconName="ChevronLeft"
                iconPosition="left"
              >
                Previous
              </Button>
              <span className="px-3 py-1 bg-primary text-white rounded text-sm">
                {stats.pagination.current}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={stats.pagination.current === stats.pagination.pages}
                onClick={() => onFilterChange('page', stats.pagination.current + 1)}
                iconName="ChevronRight"
                iconPosition="right"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplicationsTable; 