import Button from "components/ui/Button";
import React from "react";

const JobApplicationsFilters = ({ filters, onFilterChange, onRefresh }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewing">Under Review</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview_scheduled">Interview Scheduled</option>
            <option value="interviewed">Interviewed</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            placeholder="Search by name, email, or job title..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="appliedAt">Application Date</option>
            <option value="firstName">Name</option>
            <option value="jobTitle">Job Title</option>
            <option value="status">Status</option>
          </select>
        </div>
        <div className="flex items-center justify-end flex-col">
          <label className="block text-sm font-medium text-slate-700 mb-2">Refresh</label>
          <Button
            size="sm"
            onClick={onRefresh}
            iconName="RefreshCw"
            iconPosition="left"
            variant="default"
            className="cta-button text-white font-medium"
            iconSize={16}
          >
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationsFilters; 