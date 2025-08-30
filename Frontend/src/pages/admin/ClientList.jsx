import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import ClientAPI from "../../utils/clientApi";
import AdminLayout from "components/admin/AdminLayout";

const ClientList = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalClients: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [stats, setStats] = useState({
    totalClients: 0,
    recentClients: 0,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchClients();
    fetchStats();
  }, [filters, pagination.currentPage]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const data = await ClientAPI.getClients({
        page: pagination.currentPage,
        limit: 10,
        ...filters,
      });
      setClients(data.clients);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await ClientAPI.getStatistics();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleDelete = async (clientId, clientName) => {
    setDeleteTarget({
      id: clientId,
      name: clientName,
    });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await ClientAPI.deleteClient(deleteTarget.id);
      fetchClients();
      fetchStats();
      toast.success("Client deleted successfully!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to delete client");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  return (
    <AdminLayout>
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  placeholder="Search clients..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="createdAt">Date Created</option>
                  <option value="name">Name</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Order
                </label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) =>
                    handleFilterChange("sortOrder", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                  iconName="X"
                  iconPosition="left"
                  iconSize={16}
                >
                  Clear
                </Button>
                <Button
                  variant="default"
                  className="cta-button text-white font-medium"
                  onClick={() => navigate("/admin/clients/new")}
                  iconName="Plus"
                  iconPosition="left"
                  iconSize={16}
                >
                  Add Client
                </Button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <Icon
                  name="AlertCircle"
                  size={20}
                  className="text-red-400 mr-3 mt-0.5"
                />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Clients Table */}
          <div className="overflow-hidden">
            {/* Clients Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-pulse"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-200 rounded"></div>
                      <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : clients.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name="Users" size={32} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No clients found
                </h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                  Get started by adding your first client. You can manage all
                  your client relationships from this dashboard.
                </p>
                <Button
                  variant="default"
                  onClick={() => navigate("/admin/clients/new")}
                  iconName="Plus"
                  iconPosition="left"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  Add Your First Client
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {clients.map((client) => (
                    <div
                      key={client._id}
                      className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all duration-200 group"
                    >
                      <div className="p-6">
                        {/* Client Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex flex-col items-center space-y-3 w-full">
                            <div className="w-full h-32 rounded-xl overflow-hidden border-2 border-slate-100 flex-shrink-0">
                              <img
                                className="w-full h-full object-contain"
                                src={
                                  client.logo ||
                                  "/public/assets/images/no_image.png"
                                }
                                alt={client.name}
                                onError={(e) => {
                                  e.target.src =
                                    "/public/assets/images/no_image.png";
                                }}
                              />
                            </div>
                            <div className="w-full min-w-0">
                              <h3 className="w-full text-lg font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors text-center" title={client.name}>
                                {client.name}
                              </h3>
                            </div>
                          </div>
                        </div>

                        {/* Client Details */}
                        <div className="space-y-3 mb-4">
                          {client.description && (
                            <p className="text-sm text-slate-600 line-clamp-2">
                              {client.description}
                            </p>
                          )}
                          {client.website && (
                            <div className="flex items-center text-sm text-slate-500">
                              <Icon name="Globe" size={14} className="mr-2" />
                              <span className="truncate">{client.website}</span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                navigate(`/admin/clients/${client._id}/edit`)
                              }
                              iconName="Edit"
                              iconSize={14}
                              className="text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDelete(client._id, client.name)
                              }
                              iconName="Trash2"
                              iconSize={14}
                              className="text-slate-600 hover:text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="text-sm text-slate-600">
                        Showing page{" "}
                        <span className="font-semibold text-slate-900">
                          {pagination.currentPage}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-slate-900">
                          {pagination.totalPages}
                        </span>{" "}
                        ({pagination.totalClients} total clients)
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          onClick={() =>
                            handlePageChange(pagination.currentPage - 1)
                          }
                          disabled={!pagination.hasPrev}
                          iconName="ChevronLeft"
                          iconSize={16}
                          className="px-3"
                        >
                          Previous
                        </Button>

                        <div className="flex items-center space-x-1">
                          {Array.from(
                            { length: pagination.totalPages },
                            (_, i) => i + 1
                          )
                            .filter(
                              (page) =>
                                page === 1 ||
                                page === pagination.totalPages ||
                                Math.abs(page - pagination.currentPage) <= 1
                            )
                            .map((page, index, array) => (
                              <React.Fragment key={page}>
                                {index > 0 && array[index - 1] !== page - 1 && (
                                  <span className="px-2 text-slate-400">
                                    ...
                                  </span>
                                )}
                                <Button
                                  variant={
                                    page === pagination.currentPage
                                      ? "default"
                                      : "outline"
                                  }
                                  onClick={() => handlePageChange(page)}
                                  className="min-w-[40px] h-10"
                                >
                                  {page}
                                </Button>
                              </React.Fragment>
                            ))}
                        </div>

                        <Button
                          variant="outline"
                          onClick={() =>
                            handlePageChange(pagination.currentPage + 1)
                          }
                          disabled={!pagination.hasNext}
                          iconName="ChevronRight"
                          iconSize={16}
                          className="px-3"
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

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeleteTarget(null);
          }}
          onConfirm={confirmDelete}
          isLoading={isDeleting}
          itemName={deleteTarget?.name || ""}
          itemType="client"
          title="Delete Client"
        />
      </div>
    </AdminLayout>
  );
};

export default ClientList;
