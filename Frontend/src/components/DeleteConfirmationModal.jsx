import React from 'react';
import Icon from './AppIcon';
import Button from './ui/Button';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Delete Confirmation",
  message = "Are you sure you want to delete this item?",
  itemName = "",
  itemType = "item",
  isLoading = false,
  isBulk = false,
  itemCount = 0
}) => {
  if (!isOpen) return null;

  const getMessage = () => {
    if (isBulk && itemCount > 0) {
      return `Are you sure you want to delete ${itemCount} ${itemType}${itemCount > 1 ? 's' : ''}? This action cannot be undone.`;
    }
    if (itemName) {
      return `Are you sure you want to delete "${itemName}"? This action cannot be undone.`;
    }
    return message;
  };

  const getTitle = () => {
    if (isBulk && itemCount > 0) {
      return `Delete ${itemCount} ${itemType}${itemCount > 1 ? 's' : ''}`;
    }
    return title;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Icon name="Trash2" className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">{getTitle()}</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-400 hover:text-slate-600 w-8 h-8 rounded-lg"
            iconName="X"
            iconSize={16}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon name="AlertTriangle" className="h-3 w-3 text-red-600" />
            </div>
            <div className="space-y-2">
              <p className="text-slate-700 leading-relaxed">{getMessage()}</p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Icon name="Info" className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700">
                    This action is permanent and cannot be undone. All associated data will be permanently removed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200 bg-slate-50/50">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            loading={isLoading}
            iconName="Trash2"
            iconSize={16}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal; 