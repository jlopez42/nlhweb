import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CreditCard, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { License } from '../types';
import { licenseService } from '../services/licenseService';
import LicenseModal from './LicenseModal';

const LicenseView: React.FC = () => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLicense, setEditingLicense] = useState<License | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    loadLicenses();
  }, [user]);

  const loadLicenses = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = user.role === 'administrator' 
        ? await licenseService.getLicenses()
        : await licenseService.getLicensesByUserId(user.id);
      setLicenses(data);
    } catch (error) {
      console.error('Error loading licenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewLicense = () => {
    if (user?.role === 'administrator') {
      setEditingLicense(null);
      setIsModalOpen(true);
    }
  };

  const handleEditLicense = (license: License) => {
    if (user?.role === 'administrator') {
      setEditingLicense(license);
      setIsModalOpen(true);
    }
  };

  const handleDeleteLicense = async (licenseId: string) => {
    if (user?.role !== 'administrator') return;
    
    try {
      await licenseService.deleteLicense(licenseId);
      setLicenses(licenses.filter(l => l.id !== licenseId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting license:', error);
    }
  };

  const getStatusIcon = (status: License['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'expiring':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'expired':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: License['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expiring':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.license')}</h1>
          <p className="text-gray-600 mt-2">{t('project.binding.title')}</p>
        </div>
        
        {user?.role === 'administrator' && (
          <button
            onClick={handleNewLicense}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all flex items-center space-x-2 shadow-md"
          >
            <Plus className="h-5 w-5" />
            <span>{t('project.binding.new')}</span>
          </button>
        )}
      </div>

      {licenses.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <CreditCard className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500">{t('project.binding.without')}</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {licenses.map((license) => (
            <div key={license.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 w-12 h-12 rounded-full flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{license.name}</h3>
                      <p className="text-gray-600">{license.type}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">{t('project.binding.authority')}:</span>
                      <p className="text-gray-900">{license.issuingAuthority}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">{t('project.binding.date')}:</span>
                      <p className="text-gray-900">{formatDate(license.issueDate)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">{t('project.binding.expiry')}:</span>
                      <p className="text-gray-900">{formatDate(license.expiryDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(license.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(license.status)}`}>
                      {license.status}
                    </span>
                  </div>
                </div>
                
                {user?.role === 'administrator' && (
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEditLicense(license)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      title="Edit License"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    
                    <button
                      onClick={() => setDeleteConfirm(license.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete License"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('common.delete.confirm')}</h3>
            <p className="text-gray-600 mb-6">
              {t('project.binding.confirm')}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={() => handleDeleteLicense(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      <LicenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        license={editingLicense}
        onSave={loadLicenses}
      />
    </div>
  );
};

export default LicenseView;