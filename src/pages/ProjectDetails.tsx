import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, User, FileText, MessageSquare, Download, Upload, Trash2, Send, Loader2 } from 'lucide-react';
import { Manager, Project, ProjectConfig, ProjectFile, Question } from '../types';
import { projectService } from '../services/projectService';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext'

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [project, setProject] = useState<Project | null>(null);
  const [professionals, setProfessionals] = useState<Manager[]>([]);
  const [specialists, setSpecialists] = useState<Manager[]>([]);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [deadline, setDeadline] = useState<ProjectConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | 'deadline' | 'files' | 'qa' | 'downloads'>('general');
  const [newQuestion, setNewQuestion] = useState({
    subject: '',
    question: '',
    questionType: 'Technical'
  });
  const [isUploading, setIsUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadProjectData();
    }
  }, [id]);

  const loadProjectData = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const [projectData] = await Promise.all([
        projectService.getProjectById(id),
      ]);
      console.log('Loaded project data:', projectData);
      setProject(projectData.project);
      setProfessionals(projectData.professionals || []);
      setSpecialists(projectData.specialists || []);
      setFiles(projectData.files || []);
      setQuestions(projectData.questions || []);
      setDeadline(projectData.deadline || null);
    } catch (error) {
      console.error('Error loading project data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || !id || !user) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(selectedFiles).map(file =>
        projectService.uploadFile(id, file, user.name)
      );
      
      const uploadedFiles = await Promise.all(uploadPromises);
      setFiles(prev => [...prev, ...uploadedFiles]);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      await projectService.deleteFile(fileId);
      setFiles(files.filter(f => f.id !== fileId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !user) return;

    try {
      const question = await projectService.addQuestion({
        projectId: id,
        subject: newQuestion.subject,
        question: newQuestion.question,
        questionType: newQuestion.questionType,
        askedBy: user.name
      });
      
      setQuestions(prev => [...prev, question]);
      setNewQuestion({ subject: '', question: '', questionType: 'Technical' });
    } catch (error) {
      console.error('Error submitting question:', error);
    }
  };

  const handleRespondToQuestion = async (questionId: string, response: string) => {
    if (!user) return;

    try {
      const updatedQuestion = await projectService.respondToQuestion(questionId, response, user.name);
      if (updatedQuestion) {
        setQuestions(questions.map(q => q.id === questionId ? updatedQuestion : q));
      }
    } catch (error) {
      console.error('Error responding to question:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDateGeneral = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(date));
  };

  const canEditGeneral = user?.role === 'administrador';
  const canEditDeadline = user?.role === 'administrador';

  const tabs = [
    { id: 'general', label: t('tab.general'), visible: true },
    { id: 'deadline', label: t('tab.deadline'), visible: true },
    { id: 'files', label: t('tab.files'), visible: true },
    { id: 'qa', label: t('tab.qa'), visible: true },
    { id: 'downloads', label: t('tab.download'), visible: true },
  ];

  const tabsControl = [
    { id: 'general', label: t('tab.general'), visible: true },
    { id: 'deadline', label: t('tab.deadline'), visible: true },
    { id: 'files', label: t('tab.files'), visible: true },
    { id: 'qa', label: t('tab.qa'), visible: false },
    { id: 'downloads', label: t('tab.download'), visible: false },
  ];

  const selectTabs = (projectType: string) => {
    return projectType === 'Control de Obras' ? tabsControl : tabs;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{t(('project.general.notfound'))}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDateGeneral(project.created_at)}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'activo' ? 'bg-green-100 text-green-800' :
                    project.status === 'finalizado' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
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
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {selectTabs(project.type).filter(tab => tab.visible).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'general' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('project.detail.view')}</h3>
                <div className="space-y-4">
                  <div>
                    {project.description && (
                      <>
                        <label className="text-sm font-medium text-gray-500">{t('project.general.description')}</label>
                        <p className="text-gray-900">{project.description}</p>
                      </>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      {project.projectTypeId && (
                        <>
                          <label className="text-sm font-medium text-gray-500">{t('project.detail.type')}</label>
                          <p className="text-gray-900">{project.projectTypeName}</p>
                        </>
                      )}
                    </div>
                    <div>
                      {project.quantity !== null && (
                        <>
                          <label className="text-sm font-medium text-gray-500">{t('project.detail.quantity')}</label>
                          <p className="text-gray-900">{project.quantity}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      {project.surface !== null && (
                        <>
                          <label className="text-sm font-medium text-gray-500">{t('project.detail.surface')}</label>
                          <p className="text-gray-900">{project.surface} m²</p>
                        </>
                      )}
                    </div>
                    <div>
                      {project.floor && (
                        <>
                          <label className="text-sm font-medium text-gray-500">{t('project.detail.floor')}</label>
                          <p className="text-gray-900">{project.floor}</p>
                        </>
                      )}  
                    </div>
                  </div>
                  <div>
                    {project.materiality && (
                      <>
                        <label className="text-sm font-medium text-gray-500">{t('project.detail.materiality')}</label>
                        <p className="text-gray-900">{project.materiality}</p>
                      </>
                    )}
                  </div>
                  <div>
                    {project.enclosure && (
                      <>
                        <label className="text-sm font-medium text-gray-500">{t('project.detail.enclosure')}</label>
                        <p className="text-gray-900">{project.enclosure}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('project.officer.title')}</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      {project.principal1 && (
                        <>
                          <label className="text-sm font-medium text-gray-500">{t('project.officer.principal1')}</label>
                          <p className="text-gray-900">{project.principal1}</p>
                        </>
                      )}
                    </div>
                    <div>
                      {project.principal2 && (
                        <>
                          <label className="text-sm font-medium text-gray-500">{t('project.officer.principal2')}</label>
                          <p className="text-gray-900">{project.principal2}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    {professionals.length > 0 && (
                      <>
                        <label className="text-sm font-medium text-gray-500">{t('project.officer.professional')}</label>
                        <ul className="text-gray-900 list-disc list-inside">
                          {professionals.map((prof, index) => (
                            <li key={index}>{prof.name}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                  <div>
                    {specialists.length > 0 && (
                      <>
                        <label className="text-sm font-medium text-gray-500">{t('project.officer.specialist')}</label>
                        <ul className="text-gray-900 list-disc list-inside">
                          {specialists.map((spec, index) => (
                            <li key={index}>{spec.name}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                  <div>
                    {project.contact && (
                      <>
                        <label className="text-sm font-medium text-gray-500">{t('project.officer.contact')}</label>
                        <p className="text-gray-900">{project.contact}</p>
                      </>
                    )}
                  </div>
                  {project.additionalInfo && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">{t('project.addition.title')}</label>
                      <p className="text-gray-900">{project.additionalInfo}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'deadline' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('project.deadline.date')}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">{t('project.deadline.publication')}</label>
                    <p className="text-gray-900">{formatDate(deadline.publicationDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">{t('project.deadline.start')}</label>
                    <p className="text-gray-900">{formatDate(deadline.startDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">{t('project.deadline.end')}</label>
                    <p className="text-gray-900">{formatDate(deadline.finishDate)}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('project.deadline.limits')}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">{t('project.deadline.offers')}</label>
                    <p className="text-gray-900">{formatDate(deadline.offersLimit)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">{t('project.deadline.ask')}</label>
                    <p className="text-gray-900">{formatDate(deadline.asksLimit)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">{t('project.deadline.response')}</label>
                    <p className="text-gray-900">{formatDate(deadline.responseLimit)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
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

            {files.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{t('project.files.without')}</p>
              </div>
            ) : (
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
                    {files.map((file) => (
                      <tr key={file.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {file.originalName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(file.uploadDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(file.uploadedBy)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatFileSize(file.file_size)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setDeleteConfirm(file.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                            onClick={() => handleDeleteFile(deleteConfirm)}
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

          </div>
        )}

        {activeTab === 'qa' && (
          <div className="space-y-6">
            {/* New Question Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('project.qa.title')}</h3>
              <form onSubmit={handleSubmitQuestion} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('project.qa.subject')}</label>
                    <input
                      type="text"
                      value={newQuestion.subject}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('project.qa.type')}</label>
                    <select
                      value={newQuestion.questionType}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, questionType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="General">{t('project.qa.general')}</option>
                      <option value="Technical">{t('project.qa.technical')}</option>
                      <option value="Managment">{t('project.qa.procurement')}</option>
                      <option value="Declaim">{t('project.qa.schedule')}</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('project.qa.question')}</label>
                  <textarea
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setNewQuestion({ subject: '', question: '', questionType: 'Technical' })}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {t('project.qa.clear')}
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>{t('project.qa.send')}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Questions List */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('project.qa.list')}</h3>
              {questions.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">{t('project.qa.without')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((question) => (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{question.subject}</h4>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {question.questionType}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{question.question}</p>
                      <div className="text-sm text-gray-500 mb-3">
                        {t('project.qa.ask.by')}{question.askedBy} on {formatDate(question.askedAt)}
                      </div>
                      
                      {question.response ? (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-gray-700 mb-2">{question.response}</p>
                          <div className="text-sm text-gray-500">
                            {t('project.qa.response.by')}{question.respondedBy} on {question.respondedAt && formatDate(question.respondedAt)}
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              const response = prompt('Enter your response:');
                              if (response) {
                                handleRespondToQuestion(question.id, response);
                              }
                            }}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            {t('project.qa.response')}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'downloads' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('project.download.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                <Download className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="font-medium text-gray-900 mb-2">{t('project.download.complete')}</h4>
                <p className="text-gray-500 text-sm mb-4">{t('project.download.complete.description')}</p>
                <button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all">
                  {t('project.download.button')}
                </button>
              </div>
              
              <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="font-medium text-gray-900 mb-2">{t('project.download.questions')}</h4>
                <p className="text-gray-500 text-sm mb-4">{t('project.download.questions.description')}</p>
                <button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all">
                  {t('project.download.button')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;