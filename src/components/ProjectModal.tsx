import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Upload, Trash2, FileText, Plus } from 'lucide-react';
import { Project, ProjectFile } from '../types';
import { projectService } from '../services/projectService';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onSave: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, project, onSave }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'deadline' | 'files' | 'qa' | 'downloads'>('general');
  const [uploadedFiles, setUploadedFiles] = useState<ProjectFile[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: '',
    quantity: 1,
    floor: '',
    materiality: '',
    surface: 0,
    enclosure: '',
    principal1: '',
    principal2: '',
    professionals: [''],
    specialists: [''],
    contact: '',
    additionalInfo: '',
    publicationDate: '',
    startDate: '',
    finishDate: '',
    offersLimit: 10,
    asksLimit: 50,
    responseLimit: 30,
    status: 'pending' as const,
    userId: user?.id || '',
    licenseId: ''
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        location: project.location,
        type: project.type,
        quantity: project.quantity,
        floor: project.floor,
        materiality: project.materiality,
        surface: project.surface,
        enclosure: project.enclosure,
        principal1: project.principal1,
        principal2: project.principal2,
        professionals: project.professionals,
        specialists: project.specialists,
        contact: project.contact,
        additionalInfo: project.additionalInfo,
        publicationDate: new Date(project.publicationDate).toISOString().split('T')[0],
        startDate: new Date(project.startDate).toISOString().split('T')[0],
        finishDate: new Date(project.finishDate).toISOString().split('T')[0],
        offersLimit: project.offersLimit,
        asksLimit: project.asksLimit,
        responseLimit: project.responseLimit,
        status: project.status,
        userId: project.userId,
        licenseId: project.licenseId
      });
      // Load existing files if editing
      loadProjectFiles(project.id);
    } else {
      // Reset form for new project
      setFormData({
        title: '',
        description: '',
        location: '',
        type: '',
        quantity: 1,
        floor: '',
        materiality: '',
        surface: 0,
        enclosure: '',
        principal1: '',
        principal2: '',
        professionals: [''],
        specialists: [''],
        contact: '',
        additionalInfo: '',
        publicationDate: '',
        startDate: '',
        finishDate: '',
        offersLimit: 10,
        asksLimit: 50,
        responseLimit: 30,
        status: 'pending',
        userId: user?.id || '',
        licenseId: ''
      });
      setUploadedFiles([]);
    }
  }, [project, user]);

  const loadProjectFiles = async (projectId: string) => {
    try {
      const files = await projectService.getProjectFiles(projectId);
      setUploadedFiles(files);
    } catch (error) {
      console.error('Error loading project files:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || !user) return;

    setIsUploading(true);
    try {
      const newFiles: ProjectFile[] = [];
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        // Validate file type
        const allowedTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/acad',
          'application/dwg',
          'image/jpeg',
          'image/jpg',
          'image/png'
        ];
        
        if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.dwg')) {
          alert(`File type not supported: ${file.name}`);
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert(`File too large: ${file.name}. Maximum size is 10MB.`);
          continue;
        }

        const newFile: ProjectFile = {
          id: `temp_${Date.now()}_${i}`,
          projectId: project?.id || 'new',
          filename: file.name,
          originalName: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date(),
          uploadedBy: user.name
        };
        
        newFiles.push(newFile);
      }
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
      
      // Clear the input
      event.target.value = '';
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getFileIcon = (fileType: string, fileName: string) => {
    if (fileType.includes('image') || fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) {
      return '🖼️';
    } else if (fileType.includes('pdf')) {
      return '📄';
    } else if (fileType.includes('word') || fileName.toLowerCase().match(/\.(doc|docx)$/)) {
      return '📝';
    } else if (fileName.toLowerCase().endsWith('.dwg')) {
      return '📐';
    } else {
      return '📁';
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const projectData = {
        ...formData,
        publicationDate: new Date(formData.publicationDate),
        startDate: new Date(formData.startDate),
        finishDate: new Date(formData.finishDate),
        professionals: formData.professionals.filter(p => p.trim() !== ''),
        specialists: formData.specialists.filter(s => s.trim() !== '')
      };

      let savedProject: Project;
      if (project) {
        savedProject = await projectService.updateProject(project.id, projectData) as Project;
      } else {
        savedProject = await projectService.createProject(projectData);
      }

      // Handle file uploads for new project
      if (!project && uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          // In a real implementation, you would upload the actual file here
          // For now, we'll just associate the file metadata with the project
          await projectService.associateFileWithProject(savedProject.id, {
            ...file,
            projectId: savedProject.id
          });
        }
      }
      
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addProfessional = () => {
    setFormData(prev => ({
      ...prev,
      professionals: [...prev.professionals, '']
    }));
  };

  const removeProfessional = (index: number) => {
    setFormData(prev => ({
      ...prev,
      professionals: prev.professionals.filter((_, i) => i !== index)
    }));
  };

  const updateProfessional = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      professionals: prev.professionals.map((p, i) => i === index ? value : p)
    }));
  };

  const addSpecialist = () => {
    setFormData(prev => ({
      ...prev,
      specialists: [...prev.specialists, '']
    }));
  };

  const removeSpecialist = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specialists: prev.specialists.filter((_, i) => i !== index)
    }));
  };

  const updateSpecialist = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      specialists: prev.specialists.map((s, i) => i === index ? value : s)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {project ? t('projects.title.edit') : t('projects.title.new')}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="mt-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('general')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'general'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
               {t('tab.general')}
              </button>
              <button
                onClick={() => setActiveTab('deadline')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'deadline'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
               {t('tab.deadline')}
              </button>
              <button
                onClick={() => setActiveTab('files')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'files'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
               {t('tab.files')}
              </button>
            </nav>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-8">
              {/* General Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('project.general.title')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('project.general.name')}</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('project.general.location')}</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('project.general.description')}</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('project.detail.title')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('project.detail.type')}</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">{t('common.select')}</option>
                      <option value="Commercial">{t('project.select.commercial')}</option>
                      <option value="Residential">{t('project.select.residential')}</option>
                      <option value="Industrial">{t('project.select.industrial')}</option>
                      <option value="Infrastructure">{t('project.select.infrastructure')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('project.detail.quantity')}</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('project.detail.surface')} (m²)</label>
                    <input
                      type="number"
                      value={formData.surface}
                      onChange={(e) => setFormData(prev => ({ ...prev, surface: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('project.detail.floor')}</label>
                    <input
                      type="text"
                      value={formData.floor}
                      onChange={(e) => setFormData(prev => ({ ...prev, floor: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('project.detail.materiality')}</label>
                    <input
                      type="text"
                      value={formData.materiality}
                      onChange={(e) => setFormData(prev => ({ ...prev, materiality: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('project.detail.enclosure')}</label>
                    <input
                      type="text"
                      value={formData.enclosure}
                      onChange={(e) => setFormData(prev => ({ ...prev, enclosure: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Responsible Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('project.officer.title')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('project.officer.principal1')}</label>
                    <input
                      type="text"
                      value={formData.principal1}
                      onChange={(e) => setFormData(prev => ({ ...prev, principal1: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('project.officer.principal2')}</label>
                    <input
                      type="text"
                      value={formData.principal2}
                      onChange={(e) => setFormData(prev => ({ ...prev, principal2: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Professionals */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">{t('project.officer.professional')}</label>
                    <button
                      type="button"
                      onClick={addProfessional}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                    >
                      <Plus className="h-4 w-4" />
                      <span>{t('project.officer.professional.add')}</span>
                    </button>
                  </div>
                  {formData.professionals.map((professional, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={professional}
                        onChange={(e) => updateProfessional(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Professional role/title"
                      />
                      {formData.professionals.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProfessional(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Specialists */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">{t('project.officer.specialist')}</label>
                    <button
                      type="button"
                      onClick={addSpecialist}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                    >
                      <Plus className="h-4 w-4" />
                      <span>{t('project.officer.specialist.add')}</span>
                    </button>
                  </div>
                  {formData.specialists.map((specialist, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={specialist}
                        onChange={(e) => updateSpecialist(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Specialist role/title"
                      />
                      {formData.specialists.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSpecialist(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('project.officer.contact')}</label>
                  <input
                    type="email"
                    value={formData.contact}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Others Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('project.addition.title')}</h3>
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('project.addition.title.placeholder')}
                />
              </div>
            </div>
          )}

          {activeTab === 'deadline' && (
            <div className="space-y-8">
              {/* Date Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('project.deadline.date')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('project.deadline.publication')}</label>
                    <input
                      type="date"
                      value={formData.publicationDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, publicationDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('project.deadline.start')}</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('project.deadline.end')}</label>
                    <input
                      type="date"
                      value={formData.finishDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, finishDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Limits Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('project.deadline.limits')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('project.deadline.offers')}</label>
                    <input
                      type="number"
                      value={formData.offersLimit}
                      onChange={(e) => setFormData(prev => ({ ...prev, offersLimit: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('project.deadline.ask')}</label>
                    <input
                      type="number"
                      value={formData.asksLimit}
                      onChange={(e) => setFormData(prev => ({ ...prev, asksLimit: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('project.deadline.response')}</label>
                    <input
                      type="number"
                      value={formData.responseLimit}
                      onChange={(e) => setFormData(prev => ({ ...prev, responseLimit: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">{t('project.files.title')}</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.dwg,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="file-upload"
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all cursor-pointer flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>{t('project.files.upload')}</span>
                  </label>
                  {isUploading && <Loader2 className="h-5 w-5 animate-spin text-blue-600" />}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">{t('project.files.support')}:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• {t('project.files.documents')}</p>
                  <p>• {t('project.files.cad')}</p>
                  <p>• {t('project.files.images')}</p>
                  <p>• {t('project.files.size')}</p>
                </div>
              </div>

              {uploadedFiles.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">{t('project.files.without')}</p>
                  <p className="text-sm text-gray-400">{t('project.files.attach')}</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('project.files.table.file')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('project.files.table.date')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('project.files.table.by')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('project.files.table.size')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('project.files.table.action')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {uploadedFiles.map((file) => (
                          <tr key={file.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-2xl mr-3">
                                  {getFileIcon(file.type, file.originalName)}
                                </span>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {file.originalName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {file.type}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(file.uploadDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {file.uploadedBy}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatFileSize(file.size)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleDeleteFile(file.id)}
                                className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                                title="Delete file"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {uploadedFiles.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm text-blue-800">
                      {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} {t('project.files.message')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t('common.files.size')}</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{t('project.button.save')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;