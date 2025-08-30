import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import Image from "../../components/AppImage";
import { teamApi } from "../../utils/teamApi";
import { toast } from "react-toastify";
import AdminLayout from "components/admin/AdminLayout";

const TeamManagement = () => {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [stats, setStats] = useState({
    overview: { total: 0, active: 0, inactive: 0 },
    thisMonthMembers: 0,
    roleStats: [],
  });

  useEffect(() => {
    loadTeamMembers();
    loadStats();
  }, [pagination.currentPage, searchTerm, statusFilter]);

  const loadTeamMembers = async () => {
    setIsLoading(true);
    try {
      const filters = {
        page: pagination.currentPage,
        limit: 10,
        search: searchTerm,
      };

      if (statusFilter !== "all") {
        filters.isActive = statusFilter === "active";
      }

      const response = await teamApi.getAll(filters);
      setTeamMembers(response.teamMembers);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error loading team members:", error);
      toast.error("Failed to load team members");
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await teamApi.getStats();
      setStats(statsData);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      try {
        await teamApi.delete(id);
        toast.success("Team member deleted successfully");
        loadTeamMembers();
        loadStats();
      } catch (error) {
        console.error("Error deleting team member:", error);
        toast.error("Failed to delete team member");
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await teamApi.update(id, { isActive: !currentStatus });
      toast.success(`Team member ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      loadTeamMembers();
      loadStats();
    } catch (error) {
      console.error("Error updating team member status:", error);
      toast.error("Failed to update team member status");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Team Members List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900">
                Team Members ({pagination.totalItems})
              </h3>
              <Button
                variant="default"
                className="cta-button text-white font-medium"
                onClick={() => navigate('/admin/team/create')}
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
              >
                Add Team Member
              </Button>
            </div>

            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-slate-600">Loading team members...</p>
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="p-8 text-center">
                <Icon name="Users" size={48} className="text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 mb-4">No team members found</p>
                <Button
                  onClick={() => navigate("/admin/team/create")}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Add First Team Member
                </Button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Member
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Expertise
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {teamMembers.map((member) => (
                        <tr key={member._id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                <Image
                                  src={member.avatar}
                                  alt={member.name}
                                  className="h-12 w-12 rounded-full object-cover"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-slate-900">
                                  {member.name}
                                </div>
                                <div className="text-sm text-slate-500">
                                  Added {new Date(member.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900">{member.role}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {member.expertise.slice(0, 2).map((skill, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {skill}
                                </span>
                              ))}
                              {member.expertise.length > 2 && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                  +{member.expertise.length - 2} more
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                                }`}
                            >
                              {member.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/admin/team/edit/${member._id}`)}
                                iconName="Edit"
                                iconSize={16}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleStatus(member._id, member.isActive)}
                                iconName={member.isActive ? "UserX" : "UserCheck"}
                                iconSize={16}
                              >
                                {member.isActive ? "Deactivate" : "Activate"}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(member._id, member.name)}
                                iconName="Trash2"
                                iconSize={16}
                                className="text-red-600 hover:text-red-700"
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-700">
                        Showing {(pagination.currentPage - 1) * 10 + 1} to{" "}
                        {Math.min(pagination.currentPage * 10, pagination.totalItems)} of{" "}
                        {pagination.totalItems} results
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(pagination.currentPage - 1)}
                          disabled={!pagination.hasPrev}
                          iconName="ChevronLeft"
                          iconSize={16}
                        >
                          Previous
                        </Button>
                        <span className="text-sm text-slate-700">
                          Page {pagination.currentPage} of {pagination.totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(pagination.currentPage + 1)}
                          disabled={!pagination.hasNext}
                          iconName="ChevronRight"
                          iconSize={16}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TeamManagement;