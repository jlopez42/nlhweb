import React, { useState } from 'react';
import { Save, Lock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const ProfileView: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.new !== passwords.confirm) {
      setMessage(t('project.password.match'));
      return;
    }
    
    if (passwords.new.length < 6) {
      setMessage(t('project.password.long'));
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setMessage(t('project.password.success'));
      setPasswords({ current: '', new: '', confirm: '' });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.profile')}</h1>
        <p className="text-gray-600 mt-2">{t('project.profile.title')}</p>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
            <span className="inline-block mt-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full capitalize">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Lock className="h-6 w-6 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">{t('project.password.change')}</h2>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div>
            <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-2">
              {t('project.password.current')}
            </label>
            <input
              type="password"
              id="current-password"
              value={passwords.current}
              onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
              {t('project.password.new')}
            </label>
            <input
              type="password"
              id="new-password"
              value={passwords.new}
              onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
              {t('project.password.confirm')}
            </label>
            <input
              type="password"
              id="confirm-password"
              value={passwords.confirm}
              onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {message && (
            <div className={`p-3 rounded-lg ${
              message.includes('successfully') 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Save className="h-5 w-5" />
            <span>{isLoading ? t('project.password.updating') : t('project.password.update')}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileView;