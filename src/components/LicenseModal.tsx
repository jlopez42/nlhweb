import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { License } from '../types';
import { licenseService } from '../services/licenseService';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  license: License | null;
  onSave: () => void;
}

const LicenseModal: React.FC<LicenseModalProps> = ({ isOpen, onClose, license, onSave }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    issuingAuthority: '',
    issueDate: '',
    expiryDate: '',
    userId: user?.id || ''
  });

  useEffect(() => {
    if (license) {
      setFormData({
        name: license.name,
        type: license.type,
        issuingAuthority: license.issuingAuthority,
        issueDate: new Date(license.issueDate).toISOString().split('T')[0],
        expiryDate: new Date(license.expiryDate).toISOString().split('T')[0],
        userId: license.userId
      });
    } else {
      setFormData({
        name: '',
        type: '',
        issuingAuthority: '',
        issueDate: '',
        expiryDate: '',
        userId: user?.id || ''
      });
    }
  }, [license, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const licenseData = {
        ...formData,
        issueDate: new Date(formData.issueDate),
        expiryDate: new Date(formData.expiryDate)
      };

      if (license) {
        await licenseService.updateLicense(license.id, licenseData);
      } else {
        await licenseService.createLicense(licenseData);
      }
      
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving license:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              {license ? t('project.binding.edit') : t('project.binding.add')}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('project.binding.name')}</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('project.binding.type')}</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">{t('common.select')}</option>
              <option value="Construction">{t('project.binding.construction')}</option>
              <option value="Electrical">{t('project.binding.electrical')}</option>
              <option value="Plumbing">{t('project.binding.plumbing')}</option>
              <option value="HVAC">{t('project.binding.hvac')}</option>
              <option value="Engineering">{t('project.binding.engineering')}</option>
              <option value="Architecture">{t('project.binding.architecture')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('project.binding.issuing')}</label>
            <input
              type="text"
              value={formData.issuingAuthority}
              onChange={(e) => setFormData(prev => ({ ...prev, issuingAuthority: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('project.binding.date.issue')}</label>
            <input
              type="date"
              value={formData.issueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('project.binding.date.expiry')}</label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t('common.saving')}</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{t('project.binding.save')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LicenseModal;