import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ClientAPI from '../../utils/clientApi';

const ClientForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    logo: null,
    logoPreview: '',
    logoPublicId: '',
    name: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Load client data if editing
  useEffect(() => {
    if (isEditing && id) {
      loadClientData();
    }
  }, [isEditing, id]);

  const loadClientData = async () => {
    setIsLoadingData(true);
    try {
      const client = await ClientAPI.getClient(id);
      setFormData({
        logo: null, // Don't set file object for existing logo
        logoPreview: client.logo, // Use existing logo URL for preview
        logoPublicId: client.logoPublicId || '',
        name: client.name || ''
      });
    } catch (error) {
      console.error('Error loading client:', error);
      setErrors({ general: error.message });
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file using utility
      const validation = ClientAPI.validateFile(file);
      if (!validation.isValid) {
        setErrors((prev) => ({ ...prev, logo: validation.errors.join(', ') }));
        return;
      }
      
      setFormData((prev) => ({ 
        ...prev, 
        logo: file, 
        logoPreview: URL.createObjectURL(file) 
      }));
      
      // Clear any existing logo error
      if (errors.logo) {
        setErrors((prev) => ({ ...prev, logo: '' }));
      }
    }
  };

  const validateForm = () => {
    const validation = ClientAPI.validateClientData(formData);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      let logoUrl = formData.logoPreview;
      let logoPublicId = formData.logoPublicId;
      
      // Upload new logo if a file was selected
      if (formData.logo) {
        const uploadResult = await ClientAPI.uploadImage(formData.logo);
        logoUrl = uploadResult.url;
        logoPublicId = uploadResult.publicId;
      }
      
      // Prepare data for API using utility
      const clientData = ClientAPI.formatClientData({
        ...formData,
        logoPreview: logoUrl,
        logoPublicId: logoPublicId
      });
      
      // Make API call
      if (isEditing) {
        await ClientAPI.updateClient(id, clientData);
        toast.success('Client updated successfully!');
      } else {
        await ClientAPI.createClient(clientData);
        toast.success('Client created successfully!');
      }
      
      navigate('/admin/clients');
    } catch (error) {
      console.error('Error saving client:', error);
      setErrors({ general: error.message });
      toast.error(error.message || 'Failed to save client');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="animate-spin mx-auto mb-4 text-primary" />
          <p className="text-slate-600">Loading client data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin/clients')}
                iconName="ArrowLeft"
                iconPosition="left"
                iconSize={16}
              >
                Back to Clients
              </Button>
              <div className="h-6 w-px bg-slate-300"></div>
              <h1 className="text-xl font-semibold text-slate-800">
                {isEditing ? 'Edit Client' : 'Add New Client'}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/clients')}
                disabled={isLoading}
                iconName="X"
                iconPosition="left"
                iconSize={16}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                className="cta-button text-white font-medium"
                onClick={handleSubmit}
                disabled={isLoading}
                iconName={isLoading ? 'Loader2' : 'Save'}
                iconPosition="left"
                iconSize={16}
              >
                {isLoading ? 'Saving...' : 'Save Client'}
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {errors.general && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <Icon name="AlertCircle" size={20} className="text-red-400 mr-3 mt-0.5" />
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Logo Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Client Logo *</h3>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-primary/50 transition-colors duration-200">
                <input
                  type="file"
                  id="logo"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <label htmlFor="logo" className="cursor-pointer">
                  <Icon name="Upload" size={32} className="mx-auto text-slate-400 mb-2" />
                  <p className="text-sm text-slate-600">Click to upload client logo</p>
                  <p className="text-xs text-slate-500 mt-1">Recommended: 200x200px, PNG/JPG, Max 5MB</p>
                </label>
              </div>
              {formData.logoPreview && (
                <div className="relative w-32 h-32 mx-auto">
                  <img
                    src={formData.logoPreview}
                    alt="Client Logo Preview"
                    className="w-full h-full object-contain rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, logo: null, logoPreview: '' }))}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              )}
              {errors.logo && <p className="mt-2 text-sm text-red-600">{errors.logo}</p>}
            </div>
          </div>

          {/* Client Name */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Client Information</h3>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Client Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${errors.name ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
                placeholder="Enter client name..."
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientForm;