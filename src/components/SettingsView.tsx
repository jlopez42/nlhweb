import React, { useState, useEffect } from 'react';
import { Users, Database, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { User, UserRole } from '../types';
import { projectService } from '../services/projectService';
const SettingsView: React.FC = () => {
  const { user } = useAuth();
  console.log('Current User in SettingsView:', user);
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'users' | 'templates' | 'backup'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    role: 'cliente' as UserRole
  });

  useEffect(() => {
      loadUsers();
  });

  const loadUsers = async () => {

    setIsLoading(true);
    try {
      const data = await projectService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = () => {
    const user: User = {
      id: Date.now().toString(),
      ...newUser
    };
    setUsers([...users, user]);
    setIsUserModalOpen(false);
    setNewUser({ username: '', password: '', name: '', email: '', role: 'cliente' });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    setDeleteConfirm(null);
  };

  const tabs = [
    { id: 'users', label: t('project.setting.tab.user'), icon: Users },
    { id: 'backup', label: t('project.setting.tab.backup'), icon: Database },
  ];

  if (user?.role !== 'administrador') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t('project.setting.denied')}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('project.setting.title')}</h1>
        <p className="text-gray-600 mt-2">{t('project.setting.description')}</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'users' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">{t('project.setting.tab.user')}</h2>
            <button
              onClick={() => setIsUserModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>{t('project.setting.new')}</span>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('project.setting.user.table.user')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('project.setting.user.table.role')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('project.setting.user.table.username')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('project.setting.user.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((userRow) => (
                  <tr key={userRow.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">
                          <span className="text-white font-medium">{userRow.name.charAt(0)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{userRow.name}</div>
                          <div className="text-sm text-gray-500">{userRow.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                        userRow.role === 'administrador' ? 'bg-purple-100 text-purple-800' :
                        userRow.role === 'cliente' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {userRow.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {userRow.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingUser(userRow);
                            setIsUserModalOpen(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        {user?.role === 'administrador' && (
                          <button
                            onClick={() => setDeleteConfirm(userRow.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Delete Confirmation Modal */}
          {deleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.projects.delete.title')}</h3>
                <p className="text-gray-600 mb-6">
                  {t('project.setting.user.delete.confirmation')}
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(deleteConfirm)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    {t('projects.delete')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'backup' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('project.setting.backup.title')}</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 mb-6">{t('project.setting.backup.description')}</p>
            <div className="space-y-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                {t('project.setting.backup.create')}
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors ml-4">
                {t('project.setting.backup.export')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingUser ? t('project.setting.user.edit') : t('project.setting.user.create')}
            </h3>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('project.setting.user.name')}</label>
                <input
                  type="text"
                  value={editingUser ? editingUser.name : newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('project.setting.user.email')}</label>
                <input
                  type="email"
                  value={editingUser ? editingUser.email : newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('project.setting.user.username')}</label>
                <input
                  type="text"
                  value={editingUser ? editingUser.username : newUser.username}
                  onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('project.setting.user.password')}</label>
                <input
                  type="password"
                  value={editingUser ? editingUser.password : newUser.password}
                  onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('project.setting.user.role')}</label>
                <select
                  value={editingUser ? editingUser.role : newUser.role}
                  onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as UserRole }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="administrator">{t('project.setting.user.administrator')}</option>
                  <option value="customer">{t('project.setting.user.customer')}</option>
                  <option value="provider">{t('project.setting.user.provider')}</option>
                  <option value="professional">{t('project.setting.user.professional')}</option>
                </select>
              </div>
            </form>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setIsUserModalOpen(false);
                  setEditingUser(null);
                  setNewUser({ username: '', password: '', name: '', email: '', role: 'customer' });
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleCreateUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingUser ? t('project.setting.update') : t('project.setting.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;