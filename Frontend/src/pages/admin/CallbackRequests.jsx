import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Icon from "../../components/AppIcon";
import {
  callbackRequestApi,
  getStatusOptions,
  getStatusColor,
  formatCallbackRequestData,
} from "../../utils/callbackRequestApi";
import { usePendingCounts } from "../../contexts/PendingCountsContext";
import AdminLayout from "components/admin/AdminLayout";

const CallbackRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    status: "",
    search: "",
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { adjustCount } = usePendingCounts();

  // Load callback requests
  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await callbackRequestApi.getAll({
        page: currentPage,
        limit: 10,
        ...filters,
      });

      setRequests(response.requests.map(formatCallbackRequestData));
      setTotalPages(response.pagination.totalPages);
      setTotalRequests(response.pagination.totalRequests);
    } catch (error) {
      console.error("Error loading callback requests:", error);
      toast.error("Failed to load callback requests");
    } finally {
      setLoading(false);
    }
  };

  // Load statistics
  const loadStats = async () => {
    try {
      const response = await callbackRequestApi.getStats();
      setStats(response.overview);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  useEffect(() => {
    loadRequests();
    loadStats();
  }, [currentPage, filters]);

  // Handle status update
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await callbackRequestApi.update(id, {
        status: newStatus,
      });

      // Update local state
      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: newStatus } : req
        )
      );

      // Update counts
      const wasNew = response.request.status === "new";
      const isNowNew = newStatus === "new";

      if (wasNew && !isNowNew) {
        adjustCount("callbackRequests", -1);
      } else if (!wasNew && isNowNew) {
        adjustCount("callbackRequests", 1);
      }

      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  // Handle bulk status update
  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedRequests.length === 0) {
      toast.warning("Please select requests to update");
      return;
    }

    try {
      await callbackRequestApi.bulkUpdate(selectedRequests, {
        status: newStatus,
      });

      // Update local state
      setRequests((prev) =>
        prev.map((req) =>
          selectedRequests.includes(req._id)
            ? { ...req, status: newStatus }
            : req
        )
      );

      // Update counts
      const newRequestsCount = requests.filter(
        (req) => selectedRequests.includes(req._id) && req.status === "new"
      ).length;

      if (newRequestsCount > 0) {
        adjustCount("callbackRequests", -newRequestsCount);
      }

      setSelectedRequests([]);
      toast.success(`${selectedRequests.length} requests updated successfully`);
    } catch (error) {
      console.error("Error bulk updating:", error);
      toast.error("Failed to update requests");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this callback request?")
    ) {
      return;
    }

    try {
      await callbackRequestApi.delete(id);

      // Update local state
      setRequests((prev) => prev.filter((req) => req._id !== id));

      // Update counts if it was a new request
      const deletedRequest = requests.find((req) => req._id === id);
      if (deletedRequest && deletedRequest.status === "new") {
        adjustCount("callbackRequests", -1);
      }

      toast.success("Callback request deleted successfully");
    } catch (error) {
      console.error("Error deleting request:", error);
      toast.error("Failed to delete request");
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedRequests.length === 0) {
      toast.warning("Please select requests to delete");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedRequests.length} callback requests?`
      )
    ) {
      return;
    }

    try {
      await callbackRequestApi.bulkDelete(selectedRequests);

      // Update local state
      setRequests((prev) =>
        prev.filter((req) => !selectedRequests.includes(req._id))
      );

      // Update counts
      const newRequestsCount = requests.filter(
        (req) => selectedRequests.includes(req._id) && req.status === "new"
      ).length;

      if (newRequestsCount > 0) {
        adjustCount("callbackRequests", -newRequestsCount);
      }

      setSelectedRequests([]);
      toast.success(`${selectedRequests.length} requests deleted successfully`);
    } catch (error) {
      console.error("Error bulk deleting:", error);
      toast.error("Failed to delete requests");
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedRequests.length === requests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(requests.map((req) => req._id));
    }
  };

  // Handle individual selection
  const handleSelectRequest = (id) => {
    setSelectedRequests((prev) =>
      prev.includes(id) ? prev.filter((reqId) => reqId !== id) : [...prev, id]
    );
  };

  // View request details
  const viewRequestDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  // Close detail modal
  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedRequest(null);
  };

  // Call user
  const callUser = (phone) => {
    window.open(`tel:${phone}`, "_blank");
  };

  // Send email
  const sendEmail = (email) => {
    if (email) {
      window.open(`mailto:${email}`, "_blank");
    } else {
      toast.warning("No email address provided");
    }
  };

  if (loading && requests.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading callback requests...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white rounded-2xl p-8 shadow-lg border border-slate-200/60 hover:border-slate-300/80 transition-all duration-300">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-3">
              Callback Requests
            </h1>
            <p className="text-slate-600 text-lg">
              Manage and respond to callback requests from your website
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
              <Icon name="Phone" size={32} className="text-white" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">
                  Total Requests
                </p>
                <p className="text-4xl font-bold mt-1">{stats.total || 0}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                <Icon name="Phone" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium uppercase tracking-wide">
                  New Requests
                </p>
                <p className="text-4xl font-bold mt-1">{stats.new || 0}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                <Icon name="Clock" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium uppercase tracking-wide">
                  In Progress
                </p>
                <p className="text-4xl font-bold mt-1">
                  {stats.inProgress || 0}
                </p>
              </div>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                <Icon name="Loader" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium uppercase tracking-wide">
                  Contacted
                </p>
                <p className="text-4xl font-bold mt-1">
                  {stats.contacted || 0}
                </p>
              </div>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                <Icon name="CheckCircle" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60 hover:border-slate-300/80 transition-all duration-300">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, phone, email, or message..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-base"
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
              className="px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-base"
            >
              <option value="">All Statuses</option>
              {getStatusOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => setFilters({ status: "", search: "" })}
              className="px-6 py-3 text-slate-600 hover:text-slate-800 border-2 border-slate-300 hover:border-slate-400 rounded-xl hover:bg-slate-50 transition-all duration-300 font-medium hover:shadow-md"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedRequests.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60 hover:border-slate-300/80 transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <p className="text-base text-slate-600 font-medium">
                {selectedRequests.length} request(s) selected
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <select
                  onChange={(e) => handleBulkStatusUpdate(e.target.value)}
                  className="px-4 py-3 border-2 border-slate-300 rounded-xl text-base focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                >
                  <option value="">Update Status</option>
                  {getStatusOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleBulkDelete}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Requests Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 hover:border-slate-300/80 transition-all duration-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-5 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedRequests.length === requests.length &&
                        requests.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-primary focus:ring-primary/20 w-5 h-5"
                    />
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    Name
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    Phone
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    Preferred Time
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    Date
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {requests.map((request) => (
                  <tr
                    key={request._id}
                    className="hover:bg-slate-50 transition-all duration-300"
                  >
                    <td className="px-6 py-5">
                      <input
                        type="checkbox"
                        checked={selectedRequests.includes(request._id)}
                        onChange={() => handleSelectRequest(request._id)}
                        className="rounded border-slate-300 text-primary focus:ring-primary/20 w-5 h-5"
                      />
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-semibold text-slate-900 text-base">
                          {request.name}
                        </p>
                        {request.email && (
                          <p className="text-sm text-slate-500 mt-1">
                            {request.email}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <a
                        href={`tel:${request.phone}`}
                        className="text-primary hover:text-primary/80 font-semibold text-base hover:underline transition-all duration-200"
                      >
                        {request.phone}
                      </a>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-slate-700 font-medium">
                        {request.formattedTime}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <select
                        value={request.status}
                        onChange={(e) =>
                          handleStatusUpdate(request._id, e.target.value)
                        }
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-300 focus:ring-4 focus:ring-primary/20 focus:border-primary ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {getStatusOptions().map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-slate-600 font-medium">
                        {request.formattedDate}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => viewRequestDetails(request)}
                          className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-md"
                          title="View Details"
                        >
                          <Icon name="Eye" size={18} />
                        </button>
                        <button
                          onClick={() => callUser(request.phone)}
                          className="p-3 text-green-600 hover:bg-green-50 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-md"
                          title="Call User"
                        >
                          <Icon name="Phone" size={18} />
                        </button>
                        {request.email && (
                          <button
                            onClick={() => sendEmail(request.email)}
                            className="p-3 text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-md"
                            title="Send Email"
                          >
                            <Icon name="Mail" size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(request._id)}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-md"
                          title="Delete"
                        >
                          <Icon name="Trash2" size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {requests.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="Phone" size={40} className="text-slate-400" />
              </div>
              <p className="text-slate-600 text-xl font-semibold mb-2">
                No callback requests found
              </p>
              <p className="text-slate-400 text-base">
                Callback requests from your website will appear here
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60 hover:border-slate-300/80 transition-all duration-300">
            <p className="text-sm text-slate-600 font-medium">
              Showing {(currentPage - 1) * 10 + 1} to{" "}
              {Math.min(currentPage * 10, totalRequests)} of {totalRequests}{" "}
              requests
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 border-2 border-slate-300 hover:border-slate-400 rounded-xl hover:bg-slate-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-slate-700 font-medium bg-slate-100 rounded-xl">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 border-2 border-slate-300 hover:border-slate-400 rounded-xl hover:bg-slate-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={closeDetailModal}
            />
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 px-6 py-4 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                      <Icon name="Phone" size={24} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Callback Request Details
                      </h2>
                      <p className="text-white/90 text-sm mt-1 flex items-center">
                        <Icon name="Calendar" size={14} className="mr-2" />
                        Submitted on {selectedRequest.formattedDate}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeDetailModal}
                    className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  >
                    <Icon name="X" size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-5 space-y-5 bg-slate-50">
                {/* Contact Information */}
                <div className="p-4 rounded-lg bg-white border border-slate-200/60">
                  <div className="flex items-center text-slate-700 mb-3">
                    <Icon name="User" size={20} className="mr-2 text-primary" />
                    <h3 className="text-lg font-semibold">Contact Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-0.5">Full Name</label>
                      <p className="text-slate-800 font-medium text-base">{selectedRequest.name}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-0.5">Phone Number</label>
                      <p className="text-slate-800 font-medium text-base">{selectedRequest.phone}</p>
                    </div>
                    {selectedRequest.email && (
                      <div className="col-span-full">
                        <label className="block text-xs font-medium text-slate-500 mb-0.5">Email Address</label>
                        <p className="text-slate-800 font-medium text-base">{selectedRequest.email}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preferred Callback Time */}
                <div className="p-4 rounded-lg bg-white border border-slate-200/60">
                  <div className="flex items-center text-slate-700 mb-3">
                    <Icon name="Clock" size={20} className="mr-2 text-emerald-500" />
                    <h3 className="text-lg font-semibold">Preferred Callback Time</h3>
                  </div>
                  <p className="text-slate-800 font-medium text-base">
                    {selectedRequest.formattedTime}
                  </p>
                </div>

                {/* Message */}
                <div className="p-4 rounded-lg bg-white border border-slate-200/60">
                  <div className="flex items-center text-slate-700 mb-3">
                    <Icon name="MessageSquare" size={20} className="mr-2 text-indigo-500" />
                    <h3 className="text-lg font-semibold">Message</h3>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-base">{selectedRequest.message}</p>
                </div>

                {/* Status & Actions */}
                <div className="p-4 rounded-lg bg-white border border-slate-200/60">
                  <div className="flex items-center text-slate-700 mb-3">
                    <Icon name="Settings" size={20} className="mr-2 text-orange-500" />
                    <h3 className="text-lg font-semibold">Status & Actions</h3>
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Current Status</label>
                      <select
                        value={selectedRequest.status}
                        onChange={(e) => {
                          handleStatusUpdate(
                            selectedRequest._id,
                            e.target.value
                          );
                          setSelectedRequest((prev) => ({
                            ...prev,
                            status: e.target.value,
                          }));
                        }}
                        className={`block w-full p-2 border rounded-lg shadow-sm focus:ring-primary focus:border-primary transition-all duration-200 ${getStatusColor(
                          selectedRequest.status
                        )}`}
                      >
                        {getStatusOptions().map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-3 mt-2 md:mt-0">
                      <button
                        onClick={() => callUser(selectedRequest.phone)}
                        className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg shadow-md hover:bg-emerald-600 transition-all duration-200 text-sm"
                      >
                        <Icon name="Phone" size={16} className="mr-2" /> Call User
                      </button>
                      {selectedRequest.email && (
                        <button
                          onClick={() => sendEmail(selectedRequest.email)}
                          className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 transition-all duration-200 text-sm"
                        >
                          <Icon name="Mail" size={16} className="mr-2" /> Send Email
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  onClick={closeDetailModal}
                  className="flex-1 sm:flex-none px-4 py-2 text-slate-600 hover:text-slate-800 border-2 border-slate-300 hover:border-slate-400 rounded-lg hover:bg-white transition-all duration-300 font-medium hover:shadow-md"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDelete(selectedRequest._id)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md"
                >
                  Delete Request
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CallbackRequests;
