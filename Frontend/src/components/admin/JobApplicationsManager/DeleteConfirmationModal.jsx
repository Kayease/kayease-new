import React from "react";
import Icon from "../../AppIcon";
import Button from "../../ui/Button";

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  applicationName, 
  onDelete, 
  isDeleting 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800">Confirm Deletion</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            disabled={isDeleting}
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
            <Icon name="AlertTriangle" size={24} className="text-red-500" />
            <div>
              <h4 className="font-semibold text-red-800">Warning</h4>
              <p className="text-sm text-red-700">This action cannot be undone.</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-slate-700 mb-4">
              Are you sure you want to delete the application for <strong>{applicationName}</strong>?
            </p>
            <p className="text-sm text-slate-500">
              This will permanently remove the application and all associated data including the resume file.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={onDelete}
              iconName={isDeleting ? "Loader2" : "Trash2"}
              iconPosition="left"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Application"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal; 