import React from "react";
import Icon from "../../AppIcon";

const JobApplicationsStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Applications Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium mb-1">Total Applications</p>
            <p className="text-4xl font-bold mb-1">{stats.overview?.total || 0}</p>
            <p className="text-blue-100 text-xs">All time</p>
          </div>
          <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
            <Icon name="Users" size={32} className="text-white" />
          </div>
        </div>
      </div>

      {/* Pending Review Card */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm font-medium mb-1">Pending Review</p>
            <p className="text-4xl font-bold mb-1">{stats.overview?.pending || 0}</p>
            <p className="text-orange-100 text-xs">Needs attention</p>
          </div>
          <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
            <Icon name="Clock" size={32} className="text-white" />
          </div>
        </div>
      </div>

      {/* Shortlisted Card */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium mb-1">Shortlisted</p>
            <p className="text-4xl font-bold mb-1">{stats.overview?.shortlisted || 0}</p>
            <p className="text-green-100 text-xs">Ready for interview</p>
          </div>
          <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
            <Icon name="Star" size={32} className="text-white" />
          </div>
        </div>
      </div>

      {/* Selected Card */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm font-medium mb-1">Selected</p>
            <p className="text-4xl font-bold mb-1">{stats.overview?.selected || 0}</p>
            <p className="text-purple-100 text-xs">Hired candidates</p>
          </div>
          <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
            <Icon name="CheckCircle" size={32} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationsStats; 