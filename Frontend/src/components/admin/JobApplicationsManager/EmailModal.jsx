import React, { useEffect } from "react";
import Icon from "../../AppIcon";
import Button from "../../ui/Button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EmailModal = ({ 
  isOpen, 
  onClose, 
  emailModal, 
  onEmailModalChange, 
  onSend, 
  isSending, 
  application 
}) => {
  if (!isOpen) return null;

  // React Quill modules configuration for email modal
  const emailQuillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "blockquote"],
      [{ align: [] }],
      ["clean"],
    ],
  };

  // Custom styles for email modal React Quill
  const emailQuillStyles = `
    .email-quill .ql-toolbar {
      border: none !important;
      background-color: rgb(249 250 251) !important;
      border-bottom: 1px solid #e5e7eb !important;
      border-top-left-radius: 0.75rem;
      border-top-right-radius: 0.75rem;
      padding: 0.75rem !important;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .email-quill .ql-toolbar button {
      padding: 0.5rem !important;
      height: 36px !important;
      width: 36px !important;
      border-radius: 0.5rem;
    }

    .email-quill .ql-toolbar button svg {
      width: 18px !important;
      height: 18px !important;
    }

    .email-quill .ql-toolbar .ql-picker {
      height: 36px !important;
    }

    .email-quill .ql-toolbar .ql-picker-label {
      padding: 0.5rem !important;
      border-radius: 0.5rem;
    }

    .email-quill .ql-toolbar button:hover {
      background-color: rgb(229 231 235) !important;
    }

    .email-quill .ql-formats {
      display: flex !important;
      gap: 0.25rem;
      align-items: center;
    }

    .email-quill .ql-container {
      border: none !important;
      font-size: 1rem !important;
    }

    .email-quill .ql-editor {
      padding: 1rem !important;
      min-height: 200px !important;
      font-size: 15px;
      line-height: 1.6;
      color: #374151;
    }

    .email-quill .ql-editor.ql-blank::before {
      color: #9ca3af !important;
      font-style: italic;
    }
  `;

  // Handle form changes directly without debouncing
  const handleFormChange = (field, value) => {
    onEmailModalChange(prev => ({ ...prev, [field]: value }));
  };

  // Inject custom styles for email quill
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = emailQuillStyles;
    document.head.appendChild(styleElement);

    return () => {
      try {
        if (document.head.contains(styleElement)) {
          document.head.removeChild(styleElement);
        }
      } catch (err) {
        console.warn("Error removing email quill style element:", err);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] shadow-2xl flex flex-col">
        {/* Enhanced Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-slate-200 rounded-t-3xl bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Icon name="Mail" size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Send Email</h3>
              <p className="text-sm text-slate-600">Send a professional email to the applicant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Enhanced Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <div className="">
            {/* Right Column - Email Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Subject Line */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                  <Icon name="Hash" size={16} className="text-primary" />
                  Subject Line
                </label>
                <input
                  type="text"
                  value={emailModal.subject}
                  onChange={(e) => handleFormChange('subject', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-base"
                  placeholder="Enter email subject..."
                />
              </div>

              {/* Message Editor */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                  <Icon name="Edit3" size={16} className="text-primary" />
                  Message Content
                </label>
                <div className="border border-slate-300 rounded-xl overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={emailModal.message}
                    onChange={(content) => handleFormChange('message', content)}
                    modules={emailQuillModules}
                    placeholder="Write your professional email message here..."
                    className="email-quill"
                  />
                </div>
                <div className="mt-3 text-xs text-slate-500 flex items-center gap-2">
                  <Icon name="Info" size={12} />
                  Professional rich text editor with formatting options
                </div>
                
                {/* Signature Note */}
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Icon name="Info" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="text-sm font-medium text-blue-800 mb-1">Important Note</h5>
                      <p className="text-xs text-blue-700">
                        <strong>Professional signature will be automatically added from the backend.</strong> 
                        Please write your email message without including any signature or closing remarks. 
                        The system will automatically append the company signature with all contact details.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Preview */}
              {emailModal.subject || emailModal.message ? (
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Icon name="Eye" size={18} className="text-primary" />
                    Email Preview
                  </h4>
                  <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="mb-3">
                      <span className="text-xs font-medium text-slate-600">To:</span>
                      <span className="text-sm text-slate-800 ml-2">{application?.email || 'N/A'}</span>
                    </div>
                    <div className="mb-3">
                      <span className="text-xs font-medium text-slate-600">Subject:</span>
                      <span className="text-sm text-slate-800 ml-2">{emailModal.subject || 'No subject'}</span>
                    </div>
                    <div className="border-t border-slate-200 pt-3">
                      <div 
                        className="text-sm text-slate-700 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: emailModal.message || 'No message content' }}
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="flex-shrink-0 border-t border-slate-200 p-6 rounded-b-3xl bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Icon name="Shield" size={16} />
              <span>Email will be sent from noreply@kayease.in</span>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="px-6 py-2.5"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                className="px-6 py-2.5 bg-primary hover:bg-primary/90"
                onClick={onSend}
                disabled={!emailModal.subject.trim() || !emailModal.message.trim() || isSending}
                iconName={isSending ? "Loader2" : "Send"}
                iconPosition="right"
              >
                {isSending ? "Sending..." : "Send Email"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailModal; 