import React from "react";
import AdminLayout from "components/admin/AdminLayout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jobApplicationApi } from "../../utils/jobApplicationApi";
import JobApplicationsFilters from "../../components/admin/JobApplicationsManager/JobApplicationsFilters";
import JobApplicationsTable from "../../components/admin/JobApplicationsManager/JobApplicationsTable";
import ApplicationDetailModal from "../../components/admin/JobApplicationsManager/ApplicationDetailModal";
import StatusUpdateModal from "../../components/admin/JobApplicationsManager/StatusUpdateModal";
import EmailModal from "../../components/admin/JobApplicationsManager/EmailModal";
import DeleteConfirmationModal from "../../components/admin/JobApplicationsManager/DeleteConfirmationModal";

const JobApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    page: 1,
    limit: 10,
    sortBy: "appliedAt",
    sortOrder: "desc"
  });
  const [stats, setStats] = useState({});
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isStatusUpdateModalOpen, setIsStatusUpdateModalOpen] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({ status: "", note: "", updatedBy: "Admin" });
  const [newNote, setNewNote] = useState({ note: "", addedBy: "Admin" });
  const [emailModal, setEmailModal] = useState({ isOpen: false, type: '', subject: '', message: '' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, applicationId: null, applicationName: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const navigate = useNavigate();

  // Load applications
  const loadApplications = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await jobApplicationApi.getAll(filters);
      setApplications(response.data.applications);
      setStats(response.data);
    } catch (error) {
      console.error("Error loading applications:", error);
      setError("Failed to load applications. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset page when other filters change
    }));
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedApplication || !statusUpdate.status) return;

    try {
      setIsUpdatingStatus(true);
      await jobApplicationApi.updateStatus(selectedApplication._id, statusUpdate);
      setIsStatusUpdateModalOpen(false);
      setStatusUpdate({ status: "", note: "", updatedBy: "Admin" });
      loadApplications();

      // Update selected application if detail modal is open
      if (isDetailModalOpen) {
        const updatedApp = await jobApplicationApi.getById(selectedApplication._id);
        setSelectedApplication(updatedApp.data);
      }

      toast.success(`Application status updated to ${statusUpdate.status}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status. Please try again.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle add note
  const handleAddNote = async () => {
    if (!selectedApplication || !newNote.note.trim()) return;

    try {
      setIsAddingNote(true);
      await jobApplicationApi.addNote(selectedApplication._id, newNote);
      setNewNote({ note: "", addedBy: "Admin" });

      // Refresh application details
      const updatedApp = await jobApplicationApi.getById(selectedApplication._id);
      setSelectedApplication(updatedApp.data);

      toast.success("Note added successfully!");
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to add note. Please try again.");
    } finally {
      setIsAddingNote(false);
    }
  };

  // Handle send email
  const handleSendEmail = async () => {
    if (!selectedApplication || !emailModal.subject.trim() || !emailModal.message.trim()) return;

    try {
      setIsSendingEmail(true);
      
      // Send the email and record the communication in one call
      await jobApplicationApi.addCommunication(selectedApplication._id, {
        type: 'email',
        subject: emailModal.subject,
        message: emailModal.message,
        sentBy: 'Kayease HR Team',
        sentTo: selectedApplication.email
      });

      setEmailModal({ isOpen: false, type: '', subject: '', message: '' });

      // Refresh application details
      const updatedApp = await jobApplicationApi.getById(selectedApplication._id);
      setSelectedApplication(updatedApp.data);

      toast.success('Email sent successfully!');
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error(`Failed to send email: ${error.message}`);
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Handle delete application
  const handleDeleteApplication = async () => {
    if (!deleteModal.applicationId) return;

    try {
      setIsDeleting(true);
      await jobApplicationApi.delete(deleteModal.applicationId);

      setDeleteModal({ isOpen: false, applicationId: null, applicationName: '' });

      // Close detail modal if it's open for the deleted application
      if (selectedApplication && selectedApplication._id === deleteModal.applicationId) {
        setIsDetailModalOpen(false);
        setSelectedApplication(null);
      }

      // Reload applications list
      loadApplications();

      toast.success("Application deleted successfully!");
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error(`Failed to delete application: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Open email modal
  const openEmailModal = (type) => {
    const templates = {
      interview: {
        subject: `Interview Invitation - ${selectedApplication.jobTitle}`,
        message: `Dear ${selectedApplication.firstName},\n\nWe are pleased to invite you for an interview for the ${selectedApplication.jobTitle} position.\n\nPlease let us know your availability for the coming week.\n\n`
      },
      update: {
        subject: `Application Update - ${selectedApplication.jobTitle}`,
        message: `Dear ${selectedApplication.firstName},\n\nWe wanted to provide you with an update on your application for the ${selectedApplication.jobTitle} position.\n\n[Your message here]\n\n`
      },
      rejection: {
        subject: `Application Status - ${selectedApplication.jobTitle}`,
        message: `Dear ${selectedApplication.firstName},\n\nThank you for your interest in the ${selectedApplication.jobTitle} position at Kayease.\n\nAfter careful consideration, we have decided to move forward with other candidates whose experience more closely matches our current needs.\n\nWe appreciate the time you invested in the application process and encourage you to apply for future opportunities that match your background.\n\n`
      }
    };

    setEmailModal({
      isOpen: true,
      type,
      subject: templates[type]?.subject || `Regarding your application - ${selectedApplication.jobTitle}`,
      message: templates[type]?.message || ''
    });
  };
  
  return (
    <AdminLayout>
      <div className="space-y-8">
       
        <JobApplicationsFilters 
          onRefresh={loadApplications}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <JobApplicationsTable 
          applications={applications}
          isLoading={isLoading}
          error={error}
          stats={stats}
          onViewApplication={(application) => {
            setSelectedApplication(application);
            setIsDetailModalOpen(true);
          }}
          onDeleteApplication={(application) => {
            setDeleteModal({
              isOpen: true,
              applicationId: application._id,
              applicationName: application.fullName
            });
          }}
          onFilterChange={handleFilterChange}
          onRetry={loadApplications}
        />
      </div>

      {/* Modals */}
      <ApplicationDetailModal 
        application={selectedApplication}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onUpdateStatus={() => {
          setStatusUpdate({ ...statusUpdate, status: selectedApplication.status });
          setIsStatusUpdateModalOpen(true);
        }}
        onSendEmail={openEmailModal}
        onDeleteApplication={() => {
          setDeleteModal({
            isOpen: true,
            applicationId: selectedApplication._id,
            applicationName: selectedApplication.fullName
          });
        }}
        newNote={newNote}
        onNewNoteChange={setNewNote}
        onAddNote={handleAddNote}
        isAddingNote={isAddingNote}
      />

      <StatusUpdateModal 
        isOpen={isStatusUpdateModalOpen}
        onClose={() => setIsStatusUpdateModalOpen(false)}
        statusUpdate={statusUpdate}
        onStatusUpdateChange={setStatusUpdate}
        onUpdate={handleStatusUpdate}
        isUpdating={isUpdatingStatus}
      />

      <EmailModal 
        isOpen={emailModal.isOpen}
        onClose={() => setEmailModal({ isOpen: false, type: '', subject: '', message: '' })}
        emailModal={emailModal}
        onEmailModalChange={setEmailModal}
        onSend={handleSendEmail}
        isSending={isSendingEmail}
        application={selectedApplication}
      />

      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, applicationId: null, applicationName: '' })}
        applicationName={deleteModal.applicationName}
        onDelete={handleDeleteApplication}
        isDeleting={isDeleting}
      />
    </AdminLayout>
  );
};

export default JobApplicationsPage;