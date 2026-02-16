import React, { useState, useEffect } from 'react';
import { User, LogOut, FolderOpen, CreditCard, Settings as SettingsIcon} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import logo from '../assets/icons/logo.png';
import ProjectsView from '../components/ProjectsView';
import ProfileView from '../components/ProfileView';
import SettingsView from '../components/SettingsView';

type DashboardSection = 'projects' | 'profile' | 'settings';

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<DashboardSection>('projects');
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { id: 'projects', label: t('dashboard.projects.title'), icon: FolderOpen, visible: true },
    { id: 'profile', label: t('dashboard.profile'), icon: User, visible: true },
    { id: 'settings', label: t('dashboard.settings'), icon: SettingsIcon, visible: user?.role === 'administrador' },
  ];

  const renderContent = () => {
    console.log('Rendering content for section:', activeSection);
    console.log('Current user role:', user?.role);
    switch (activeSection) {
      case 'projects':
        return <ProjectsView />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return user?.role === 'administrador' ? <SettingsView /> : <ProjectsView />;
      default:
        return <ProjectsView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <img src={logo} alt="NLH Logo" className="h-14 w-14 ml-2" />
            <span className="ml-3 text-2xl font-bold text-gray-900">Nosotros Lo Hacemos</span>            
          </div>
        </div>
        
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              src={user?.avatar || `https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150`}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.filter(item => item.visible).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as DashboardSection)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                activeSection === item.id
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-all mt-4"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">{t('dashboard.logout')}</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;