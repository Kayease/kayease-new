import React from "react";
import Icon from "../../AppIcon";
import Button from "../../ui/Button";
import { jobApplicationApi } from "../../../utils/jobApplicationApi";

const ApplicationDetailModal = ({ 
  application, 
  isOpen, 
  onClose, 
  onUpdateStatus, 
  onSendEmail, 
  onDeleteApplication,
  newNote,
  onNewNoteChange,
  onAddNote,
  isAddingNote
}) => {
  if (!application || !isOpen) return null;

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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] shadow-2xl flex flex-col">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 bg-white border-b border-slate-200 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {application.fullName}
              </h2>
              <p className="text-slate-600">
                Applied for {application.jobTitle} • {formatDate(application.appliedAt)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(application.status)}
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex flex-1 min-h-0">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <div className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Icon name="User" size={20} className="text-primary" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Email</label>
                    <p className="text-slate-800">{application.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Phone</label>
                    <p className="text-slate-800">{application.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Current Position</label>
                    <p className="text-slate-800">{application.currentPosition || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Experience</label>
                    <p className="text-slate-800">{jobApplicationApi.formatExperience(application.experience)}</p>
                  </div>
                </div>
              </div>

              {/* Professional Details */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Icon name="Briefcase" size={20} className="text-primary" />
                  Professional Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Current Location</label>
                    <p className="text-slate-800">{application.currentLocation}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Willing to Relocate</label>
                    <p className="text-slate-800">{application.willingToRelocate ? 'Yes' : 'No'}</p>
                  </div>
                  {application.expectedSalary && (
                    <div>
                      <label className="text-sm font-medium text-slate-600">Expected Salary</label>
                      <p className="text-slate-800">{application.expectedSalary}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Icon name="Zap" size={20} className="text-primary" />
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {application.skills && application.skills.length > 0 ? (
                    application.skills.map((skill, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/20">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-500 italic">No skills specified</p>
                  )}
                </div>
              </div>

              {/* Resume */}
              {application.resumeUrl && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Icon name="Download" size={20} className="text-primary" />
                    Resume
                  </h3>
                  <a
                    href={application.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Icon name="Download" size={16} />
                    Download Resume ({application.resumeFileName})
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Fixed */}
          <div className="w-80 border-l border-slate-200 bg-slate-50 overflow-y-auto scrollbar-hide">
            <div className="p-6 space-y-6">
              {/* Actions */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Actions</h3>
                <div className="space-y-3">
                  <Button
                    variant="default"
                    className="w-full bg-primary hover:bg-primary/90"
                    iconName="Edit"
                    iconPosition="left"
                    onClick={onUpdateStatus}
                  >
                    Update Status
                  </Button>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-300 hover:border-slate-400"
                      iconName="Calendar"
                      iconPosition="left"
                      onClick={() => onSendEmail('interview')}
                    >
                      Schedule Interview
                    </Button>
                   
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-red-300 hover:border-red-400 text-red-600 hover:text-red-700"
                      iconName="X"
                      iconPosition="left"
                      onClick={() => onSendEmail('rejection')}
                    >
                      Send Rejection
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-red-300 hover:border-red-400 text-red-600 hover:text-red-700"
                      iconName="Trash2"
                      iconPosition="left"
                      onClick={onDeleteApplication}
                    >
                      Delete Application
                    </Button>
                  </div>
                </div>
              </div>

              {/* Add Note */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Add Note</h3>
                <div className="space-y-3">
                  <textarea
                    value={newNote.note}
                    onChange={(e) => onNewNoteChange({ ...newNote, note: e.target.value })}
                    placeholder="Add a note about this application..."
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    iconName={isAddingNote ? "Loader2" : "Plus"}
                    iconPosition="left"
                    onClick={onAddNote}
                    disabled={!newNote.note.trim() || isAddingNote}
                  >
                    {isAddingNote ? "Adding..." : "Add Note"}
                  </Button>
                </div>
              </div>

              {/* Admin Notes */}
              {application.adminNotes && application.adminNotes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Admin Notes</h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-hide">
                    {application.adminNotes.map((note, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-slate-200">
                        <p className="text-sm text-slate-700 mb-2">{note.note}</p>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{note.addedBy}</span>
                          <span>{formatDate(note.addedAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Communications */}
              {application.communications && application.communications.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Communications</h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-hide">
                    {application.communications.map((comm, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon
                            name={comm.type === 'email' ? 'Mail' : comm.type === 'phone' ? 'Phone' : 'Users'}
                            size={16}
                            className="text-primary"
                          />
                          <span className="font-medium text-sm text-slate-800">{comm.subject}</span>
                        </div>
                        <p className="text-sm text-slate-700 mb-2">{comm.message}</p>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>From: {comm.sentBy} → To: {comm.sentTo}</span>
                          <span>{formatDate(comm.sentAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailModal; 