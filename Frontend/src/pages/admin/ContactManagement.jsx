import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { contactApi } from "../../utils/contactApi";
import { toast } from "react-toastify";
import AdminLayout from "components/admin/AdminLayout";
import { usePendingCounts } from "../../contexts/PendingCountsContext";

const ContactManagement = () => {
  const { adjustCount } = usePendingCounts();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    subject: "",
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [pagination, setPagination] = useState({});
  const [stats, setStats] = useState({});
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadContacts();
    loadStats();
  }, [filters]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const response = await contactApi.getAll(filters);
      setContacts(response.contacts);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error loading contacts:", error);
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await contactApi.getStats();
      setStats(statsData);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  const handleStatusUpdate = async (contactId, newStatus) => {
    try {
      const contact = contacts.find((c) => c._id === contactId);
      const wasNew = contact?.status === "new";

      await contactApi.update(contactId, { status: newStatus });
      toast.success("Contact status updated successfully");

      // Update pending counts
      if (wasNew && newStatus !== "new") {
        adjustCount("contacts", -1); // Decrease pending count
      } else if (!wasNew && newStatus === "new") {
        adjustCount("contacts", 1); // Increase pending count
      }

      loadContacts();
      loadStats();
    } catch (error) {
      console.error("Error updating contact status:", error);
      toast.error("Failed to update contact status");
    }
  };

  const handleReadStatusUpdate = async (contactId, isRead) => {
    try {
      const contact = contacts.find((c) => c._id === contactId);
      const wasNew = contact?.status === "new";

      await contactApi.update(contactId, { isRead: !isRead });
      toast.success(`Contact marked as ${!isRead ? "read" : "unread"}`);

      // Update pending counts for new contacts
      if (wasNew) {
        if (!isRead) {
          adjustCount("contacts", -1); // Marking as read decreases pending count
        } else {
          adjustCount("contacts", 1); // Marking as unread increases pending count
        }
      }

      loadContacts();
      loadStats();
    } catch (error) {
      console.error("Error updating read status:", error);
      toast.error("Failed to update read status");
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    if (selectedContacts.length === 0) {
      toast.warning("Please select contacts to update");
      return;
    }

    try {
      const contactsToUpdate = contacts.filter((c) =>
        selectedContacts.includes(c._id)
      );
      const newContactsCount = contactsToUpdate.filter(
        (c) => c.status === "new"
      ).length;

      await contactApi.bulkUpdate(selectedContacts, { status });
      toast.success(`${selectedContacts.length} contacts updated successfully`);

      // Update pending counts
      if (status !== "new") {
        adjustCount("contacts", -newContactsCount); // Decrease pending count
      }

      setSelectedContacts([]);
      loadContacts();
      loadStats();
    } catch (error) {
      console.error("Error bulk updating contacts:", error);
      toast.error("Failed to update contacts");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedContacts.length === 0) {
      toast.warning("Please select contacts to delete");
      return;
    }

    setDeleteTarget({ type: "bulk", ids: selectedContacts });
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      if (deleteTarget.type === "bulk") {
        const contactsToDelete = contacts.filter((c) =>
          selectedContacts.includes(c._id)
        );
        const newContactsCount = contactsToDelete.filter(
          (c) => c.status === "new"
        ).length;

        await contactApi.bulkDelete(deleteTarget.ids);
        toast.success(
          `${deleteTarget.ids.length} contacts deleted successfully`
        );

        // Update pending counts
        adjustCount("contacts", -newContactsCount);

        setSelectedContacts([]);
      } else {
        const contact = contacts.find((c) => c._id === deleteTarget.id);
        const wasNew = contact?.status === "new";

        await contactApi.delete(deleteTarget.id);
        toast.success("Contact deleted successfully");

        // Update pending counts
        if (wasNew) {
          adjustCount("contacts", -1);
        }
      }

      setShowDeleteModal(false);
      setDeleteTarget(null);
      loadContacts();
      loadStats();
    } catch (error) {
      console.error("Error deleting contacts:", error);
      toast.error("Failed to delete contacts");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectContact = (contactId) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAllContacts = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map((contact) => contact._id));
    }
  };

  const formatContactData = (contact) => {
    return contactApi.formatContactData(contact);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      new: "bg-blue-100 text-blue-800",
      contacted: "bg-yellow-100 text-yellow-800",
      "in-progress": "bg-purple-100 text-purple-800",
      closed: "bg-green-100 text-green-800",
      archived: "bg-gray-100 text-gray-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const getSubjectColor = (subject) => {
    const subjectColors = {
      "hire-us": "bg-green-100 text-green-800",
      "join-us": "bg-blue-100 text-blue-800",
      partnership: "bg-purple-100 text-purple-800",
      "general-inquiry": "bg-gray-100 text-gray-800",
      support: "bg-orange-100 text-orange-800",
      feedback: "bg-pink-100 text-pink-800",
      other: "bg-gray-100 text-gray-800",
    };
    return subjectColors[subject] || "bg-gray-100 text-gray-800";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Contact Management
            </h1>
            <p className="text-gray-600">
              Manage contact form submissions and inquiries
            </p>
              </div>
          {/* <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button
              variant="outline"
              onClick={() => handleBulkStatusUpdate("contacted")}
              disabled={selectedContacts.length === 0}
            >
              <Icon name="Mail" size={16} className="mr-2" />
              Mark as Contacted
            </Button>
            <Button
              variant="outline"
              onClick={() => handleBulkStatusUpdate("closed")}
              disabled={selectedContacts.length === 0}
            >
              <Icon name="CheckCircle" size={16} className="mr-2" />
              Mark as Closed
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={selectedContacts.length === 0}
            >
              <Icon name="Trash2" size={16} className="mr-2" />
              Delete Selected
            </Button>
          </div> */}
          </div>

        {/* Bulk Actions */}
          {selectedContacts.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Icon
                    name="CheckCircle"
                    size={20}
                    className="text-blue-600"
                  />
                  </div>
                <div>
                  <span className="text-lg font-semibold text-blue-900">
                    {selectedContacts.length} contact
                    {selectedContacts.length !== 1 ? "s" : ""} selected
                  </span>
                  <p className="text-sm text-blue-700">
                    Choose an action to perform on selected contacts
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                  onClick={() => handleBulkStatusUpdate("contacted")}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
                >
                  <Icon name="Mail" size={16} className="mr-2" />
                  Mark as Contacted
                  </Button>

                  <Button
                    variant="outline"
                  onClick={() => handleBulkStatusUpdate("in-progress")}
                  className="border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400"
                >
                  <Icon name="Clock" size={16} className="mr-2" />
                    Mark In Progress
                  </Button>

                  <Button
                    variant="outline"
                  onClick={() => handleBulkStatusUpdate("closed")}
                  className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400"
                >
                  <Icon name="CheckCircle" size={16} className="mr-2" />
                  Mark as Closed
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={handleBulkDelete}
                  className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400"
                  >
                  <Icon name="Trash2" size={16} className="mr-2" />
                  Delete Selected
                  </Button>
                </div>
              </div>
            </div>
          )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200/50 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Icon name="MessageCircle" size={24} className="text-white" />
                </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-700">
                  Total Contacts
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {stats.overview?.total || 0}
                </p>
              </div>
                </div>
              </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200/50 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
                <Icon name="Clock" size={24} className="text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-yellow-700">New</p>
                <p className="text-3xl font-bold text-yellow-900">
                  {stats.overview?.new || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200/50 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <Icon name="Users" size={24} className="text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-700">
                  In Progress
                </p>
                <p className="text-3xl font-bold text-purple-900">
                  {stats.overview?.inProgress || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200/50 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <Icon name="CheckCircle" size={24} className="text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-700">Closed</p>
                <p className="text-3xl font-bold text-green-900">
                  {stats.overview?.closed || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200/50 p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center">
              <Icon name="Filter" size={18} className="text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Filter Contacts
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              label="Search"
              placeholder="Search by name, email, or description..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="bg-white border-slate-300 focus:border-primary focus:ring-primary"
            />

            <Select
              label="Status"
              placeholder="All Statuses"
              options={contactApi.getStatusOptions()}
              value={filters.status}
              onChange={(value) => handleFilterChange("status", value)}
              className="bg-white border-slate-300 focus:border-primary focus:ring-primary"
            />

            <Select
              label="Subject"
              placeholder="All Subjects"
              options={contactApi.getSubjectOptions()}
              value={filters.subject}
              onChange={(value) => handleFilterChange("subject", value)}
              className="bg-white border-slate-300 focus:border-primary focus:ring-primary"
            />

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({
                    search: "",
                    status: "",
                    subject: "",
                    page: 1,
                    limit: 10,
                    sortBy: "createdAt",
                    sortOrder: "desc",
                  });
                }}
                className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
              >
                <Icon name="RotateCcw" size={16} className="mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-gradient-to-r from-slate-50 to-gray-50">
                      <tr>
                  <th className="px-6 py-4 text-left">
                          <input
                            type="checkbox"
                      checked={
                        selectedContacts.length === contacts.length &&
                        contacts.length > 0
                      }
                      onChange={handleSelectAllContacts}
                      className="rounded border-slate-300 text-primary focus:ring-primary focus:ring-2 focus:ring-offset-0"
                          />
                        </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Contact
                        </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Subject
                        </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Status
                        </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Date
                        </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                          <Icon
                            name="Loader2"
                            className="animate-spin h-6 w-6 text-primary"
                          />
                        </div>
                        <p className="text-slate-600 font-medium">
                          Loading contacts...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : contacts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                          <Icon
                            name="Inbox"
                            className="h-8 w-8 text-slate-400"
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                          No contacts found
                        </h3>
                        <p className="text-slate-600">
                          No contact inquiries match your current filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact) => {
                    const formattedContact = formatContactData(contact);
                    return (
                      <tr
                        key={contact._id}
                        className="hover:bg-slate-50/50 transition-colors duration-150"
                      >
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedContacts.includes(contact._id)}
                            onChange={() => handleSelectContact(contact._id)}
                            className="rounded border-slate-300 text-primary focus:ring-primary focus:ring-2 focus:ring-offset-0"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                            <div className="text-sm font-semibold text-slate-900">
                              {formattedContact.fullName}
                            </div>
                            <div className="text-sm text-slate-500">
                              {formattedContact.email}
                            </div>
                            <div className="text-sm text-slate-500">
                              {formattedContact.phone}
                            </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getSubjectColor(
                              contact.subject
                            )}`}
                          >
                            {formattedContact.subjectLabel}
                          </span>
                          </td>
                          <td className="px-6 py-4">
                          <div className="relative">
                            <select
                              value={contact.status}
                              onChange={(e) =>
                                handleStatusUpdate(contact._id, e.target.value)
                              }
                              className={`w-32 px-3 py-2 text-sm font-medium rounded-lg border-2 focus:ring-2 focus:ring-offset-0 transition-all duration-200 cursor-pointer ${
                                contact.status === "new"
                                  ? "bg-blue-50 text-blue-800 border-blue-200 hover:border-blue-300 focus:ring-blue-200"
                                  : contact.status === "contacted"
                                  ? "bg-yellow-50 text-yellow-800 border-yellow-200 hover:border-yellow-300 focus:ring-yellow-200"
                                  : contact.status === "in-progress"
                                  ? "bg-purple-50 text-purple-800 border-purple-200 hover:border-purple-300 focus:ring-purple-200"
                                  : contact.status === "closed"
                                  ? "bg-green-50 text-green-800 border-green-200 hover:border-green-300 focus:ring-green-200"
                                  : "bg-gray-50 text-gray-800 border-gray-200 hover:border-gray-300 focus:ring-gray-200"
                              }`}
                            >
                              <option
                                value="new"
                                className="bg-white text-gray-900"
                              >
                                New
                                </option>
                              <option
                                value="contacted"
                                className="bg-white text-gray-900"
                              >
                                Contacted
                                </option>
                              <option
                                value="in-progress"
                                className="bg-white text-gray-900"
                              >
                                In Progress
                              </option>
                              <option
                                value="closed"
                                className="bg-white text-gray-900"
                              >
                                Closed
                              </option>
                              <option
                                value="archived"
                                className="bg-white text-gray-900"
                              >
                                Archived
                              </option>
                            </select>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">
                          {formattedContact.formattedDate}
                          </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                            {/* View Details Button */}
                            <div className="relative group">
                              <button
                                onClick={() => {
                                  setSelectedContact(contact);
                                  setShowContactModal(true);
                                }}
                                className="w-8 h-8 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                                title="View Details"
                              >
                                <Icon
                                  name="Eye"
                                  size={14}
                                  className="text-blue-600"
                                />
                              </button>
                              {/* Enhanced Tooltip */}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                View Details
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900"></div>
                              </div>
                            </div>

                            {/* Mark as Read/Unread Button */}
                            <div className="relative group">
                              <button
                                onClick={() =>
                                  handleReadStatusUpdate(
                                    contact._id,
                                    contact.isRead
                                  )
                                }
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110 ${
                                  contact.isRead
                                    ? "bg-green-50 hover:bg-green-100 border border-green-200 hover:border-green-300"
                                    : "bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 hover:border-yellow-300"
                                }`}
                                title={
                                  contact.isRead
                                    ? "Mark as Unread"
                                    : "Mark as Contacted"
                                }
                              >
                                <Icon
                                  name={contact.isRead ? "Check" : "Mail"}
                                  size={14}
                                  className={
                                    contact.isRead
                                      ? "text-green-600"
                                      : "text-yellow-600"
                                  }
                                />
                              </button>
                              {/* Enhanced Tooltip */}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                {contact.isRead
                                  ? "Mark as Unread"
                                  : "Mark as Contacted"}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900"></div>
                              </div>
                            </div>

                            {/* Reply via Email Button */}
                            <div className="relative group">
                              <button
                                onClick={() =>
                                  window.open(
                                    `mailto:${contact.email}?subject=Re: ${
                                      contactApi.formatContactData(contact)
                                        .subjectLabel
                                    } - ${contact.fullName}`
                                  )
                                }
                                className="w-8 h-8 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                                title="Reply via Email"
                              >
                                <Icon
                                  name="Mail"
                                  size={14}
                                  className="text-blue-600"
                                />
                              </button>
                              {/* Enhanced Tooltip */}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                Reply via Email
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900"></div>
                              </div>
                            </div>

                            {/* Call User Button */}
                            <div className="relative group">
                              <button
                                onClick={() =>
                                  window.open(`tel:${contact.phone}`)
                                }
                                className="w-8 h-8 bg-green-50 hover:bg-green-100 border border-green-200 hover:border-green-300 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                                title="Call User"
                              >
                                <Icon
                                  name="Phone"
                                  size={14}
                                  className="text-green-600"
                                />
                              </button>
                              {/* Enhanced Tooltip */}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                Call User
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900"></div>
                              </div>
                            </div>

                            {/* Delete Button */}
                            <div className="relative group">
                              <button
                                onClick={() => {
                                  setDeleteTarget({
                                    type: "single",
                                    id: contact._id,
                                  });
                                  setShowDeleteModal(true);
                                }}
                                className="w-8 h-8 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                                title="Delete Contact"
                              >
                                <Icon
                                  name="Trash2"
                                  size={14}
                                  className="text-red-600"
                                />
                              </button>
                              {/* Enhanced Tooltip */}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                Delete Contact
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900"></div>
                              </div>
                            </div>
                            </div>
                          </td>
                        </tr>
                    );
                  })
                )}
                    </tbody>
                  </table>
          </div>
                </div>

        {/* Pagination */}
                {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
              {Math.min(
                pagination.currentPage * pagination.limit,
                pagination.totalContacts
              )}{" "}
              of {pagination.totalContacts} results
            </div>
            <div className="flex space-x-2">
                      <Button
                        variant="outline"
                onClick={() =>
                  handleFilterChange("page", pagination.currentPage - 1)
                }
                        disabled={!pagination.hasPrevPage}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                onClick={() =>
                  handleFilterChange("page", pagination.currentPage + 1)
                }
                        disabled={!pagination.hasNextPage}
                      >
                        Next
                      </Button>
                    </div>
                      </div>
        )}
                      </div>

      {/* Contact Detail Modal */}
      {showContactModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-secondary px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Icon name="User" size={20} className="text-white" />
                    </div>
                  <div>
                    <h3 className="text-xl font-semibold">Contact Details</h3>
                    <p className="text-white/80 text-sm">
                      Submitted on{" "}
                      {new Date(selectedContact.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowContactModal(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                >
                  <Icon name="X" size={20} />
                </Button>
          </div>
        </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Contact Information */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200/50 hover:border-blue-300/70 transition-all duration-300 hover:shadow-md">
                <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center space-x-2">
                  <Icon name="User" size={18} className="text-blue-600" />
                  <span>Contact Information</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="hover:bg-white/50 p-3 rounded-lg transition-all duration-200">
                    <label className="text-sm font-medium text-blue-700">
                      Full Name
                    </label>
                    <p className="text-blue-900 font-medium text-lg">
                      {selectedContact.fullName}
                    </p>
      </div>

                  <div className="hover:bg-white/50 p-3 rounded-lg transition-all duration-200">
                    <label className="text-sm font-medium text-blue-700">
                      Email
                    </label>
                    <p className="text-blue-900 font-medium">
                      {selectedContact.email}
                    </p>
                  </div>

                  <div className="hover:bg-white/50 p-3 rounded-lg transition-all duration-200">
                    <label className="text-sm font-medium text-blue-700">
                      Phone
                    </label>
                    <p className="text-blue-900 font-medium">
                      {selectedContact.phone}
                    </p>
                  </div>

                  <div className="hover:bg-white/50 p-3 rounded-lg transition-all duration-200">
                    <label className="text-sm font-medium text-blue-700">
                      Subject
                    </label>
                    <span
                      className={`inline-flex px-3 py-1 ml-2  text-sm font-medium rounded-full ${getSubjectColor(
                        selectedContact.subject
                      )}`}
                    >
                      {
                        contactApi.formatContactData(selectedContact)
                          .subjectLabel
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200/50 hover:border-green-300/70 transition-all duration-300 hover:shadow-md">
                <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center space-x-2">
                  <Icon
                    name="MessageCircle"
                    size={18}
                    className="text-green-600"
                  />
                  <span>Message</span>
                </h4>

                <div className="bg-white rounded-lg p-4 border border-green-200 hover:border-green-300 transition-all duration-200">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {selectedContact.description}
              </p>
            </div>
              </div>

              {/* Status & Actions */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200/50 hover:border-purple-300/70 transition-all duration-300 hover:shadow-md">
                <h4 className="text-lg font-semibold text-purple-900 mb-4 flex items-center space-x-2">
                  <Icon name="Settings" size={18} className="text-purple-600" />
                  <span>Status & Actions</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="hover:bg-white/50 p-3 rounded-lg transition-all duration-200">
                    <label className="text-sm font-medium text-purple-700">
                      Current Status
                    </label>
                    <div className="mt-2">
                      <select
                        value={selectedContact.status}
                        onChange={(e) =>
                          handleStatusUpdate(
                            selectedContact._id,
                            e.target.value
                          )
                        }
                        className={`w-full px-3 py-2 text-sm font-medium rounded-lg border-2 focus:ring-2 focus:ring-offset-0 transition-all duration-200 cursor-pointer ${
                          selectedContact.status === "new"
                            ? "bg-blue-50 text-blue-800 border-blue-200 hover:border-blue-300 focus:ring-blue-200"
                            : selectedContact.status === "contacted"
                            ? "bg-yellow-50 text-yellow-800 border-yellow-200 hover:border-yellow-300 focus:ring-yellow-200"
                            : selectedContact.status === "in-progress"
                            ? "bg-purple-50 text-purple-800 border-purple-200 hover:border-purple-300 focus:ring-purple-200"
                            : selectedContact.status === "closed"
                            ? "bg-green-50 text-green-800 border-green-200 hover:border-green-300 focus:ring-green-200"
                            : "bg-gray-50 text-gray-800 border-gray-200 hover:border-gray-300 focus:ring-gray-200"
                        }`}
                      >
                        <option value="new" className="bg-white text-gray-900">
                          New
                        </option>
                        <option
                          value="contacted"
                          className="bg-white text-gray-900"
                        >
                          Contacted
                        </option>
                        <option
                          value="in-progress"
                          className="bg-white text-gray-900"
                        >
                          In Progress
                        </option>
                        <option
                          value="closed"
                          className="bg-white text-gray-900"
                        >
                          Closed
                        </option>
                        <option
                          value="archived"
                          className="bg-white text-gray-900"
                        >
                          Archived
                        </option>
                      </select>
          </div>
        </div>

                  <div className="hover:bg-white/50 p-3 rounded-lg transition-all duration-200">
                    <label className="text-sm font-medium text-purple-700">
                      Read Status
                    </label>
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                          selectedContact.isRead
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <Icon
                          name={
                            selectedContact.isRead ? "CheckCircle" : "Circle"
                          }
                          size={14}
                          className="mr-2"
                        />
                        {selectedContact.isRead ? "Read" : "Unread"}
                      </span>
                </div>
                </div>
              </div>

              {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                    onClick={() =>
                      handleReadStatusUpdate(
                        selectedContact._id,
                        selectedContact.isRead
                      )
                    }
                    className="border-purple-300 text-purple-700 hover:bg-purple-100 hover:border-purple-400 hover:text-purple-800 transition-all duration-300 hover:scale-105 hover:shadow-md"
                  >
                    <Icon
                      name={selectedContact.isRead ? "Mail" : "Check"}
                      size={16}
                      className="mr-2"
                    />
                    {selectedContact.isRead ? "Mark Unread" : "Mark Contacted"}
                </Button>

                <Button
                  variant="outline"
                    onClick={() =>
                      window.open(
                        `mailto:${selectedContact.email}?subject=Re: ${
                          contactApi.formatContactData(selectedContact)
                            .subjectLabel
                        } - ${selectedContact.fullName}`
                      )
                    }
                    className="border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 hover:text-blue-800 transition-all duration-300 hover:scale-105 hover:shadow-md"
                  >
                    <Icon name="Mail" size={16} className="mr-2" />
                    Reply via Email
                </Button>

                <Button
                    variant="outline"
                    onClick={() => window.open(`tel:${selectedContact.phone}`)}
                    className="border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400 hover:text-green-800 transition-all duration-300 hover:scale-105 hover:shadow-md"
                  >
                    <Icon name="Phone" size={16} className="mr-2" />
                    Call User
                </Button>
              </div>
            </div>

              {/* Submission Details */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-5 border border-gray-200/50 hover:border-gray-300/70 transition-all duration-300 hover:shadow-md">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Icon name="Clock" size={18} className="text-gray-600" />
                  <span>Submission Details</span>
                </h4>

                <div className="grid grid-cols-1 gap-4">
                  <div className="hover:bg-white/50 p-3 rounded-lg transition-all duration-200">
                    <label className="text-sm font-medium text-gray-700">
                      Submitted
                    </label>
                    <p className="text-gray-900 font-medium">
                      {new Date(selectedContact.createdAt).toLocaleString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                      </p>
                    </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Icon name="Shield" size={16} className="text-gray-500" />
                  <span>Contact ID: {selectedContact._id.slice(-8)}</span>
            </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowContactModal(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-md"
                  >
              Close
            </Button>

                  <Button
                    variant="default"
                    onClick={() => {
                      // Mark as read when viewing contact details
                      if (!selectedContact.isRead) {
                        handleReadStatusUpdate(
                          selectedContact._id,
                          selectedContact.isRead
                        );
                      }
                      setShowContactModal(false);
                    }}
                    className="bg-primary hover:bg-primary/90 hover:scale-105 hover:shadow-lg transition-all duration-300"
                  >
                    <Icon name="CheckCircle" size={16} className="mr-2" />
                    Mark as Read
                  </Button>
          </div>
        </div>
      </div>
    </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Contact"
        message={
          deleteTarget?.type === "bulk"
            ? `Are you sure you want to delete ${deleteTarget.ids.length} selected contacts? This action cannot be undone.`
            : "Are you sure you want to delete this contact? This action cannot be undone."
        }
        loading={isDeleting}
      />
    </AdminLayout>
  );
};

export default ContactManagement;
