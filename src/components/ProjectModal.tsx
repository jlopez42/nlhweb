import React, { useState, useEffect } from "react";
import { X, Save, Loader2, Upload, Trash2, FileText, Plus, Search, UserPlus, UserMinus, ChevronDown, ChevronUp, CheckCircle2, Notebook, ReceiptText, HandHelping, Eye, Download } from "lucide-react";
import { Project, ProjectFile } from "../types/index";
import { projectService } from "../services/projectService";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import FileViewer from "./FileViewer";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onSave: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  onSave,
}) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "deadline" | "files" | "qa" | "downloads">("general");
  const [uploadedFiles, setUploadedFiles] = useState<ProjectFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    type: "",
    typeId: undefined as number | undefined,
    quantity: 1,
    floor: "",
    materiality: "",
    surface: 0,
    enclosure: "",
    principal1: "",
    principal2: "",
    professionals: [{name: ""}],
    specialists: [{name: ""}],
    contact: "",
    additionalInfo: "",
    publicationDate: "",
    publicationTime: "",
    startDate: "",
    startTime: "",
    finishDate: "",
    finishTime: "",
    offersLimit: "",
    offersLimitTime: "",
    asksLimit: "",
    asksLimitTime: "",
    responseLimit: "",
    responseLimitTime: "",
    status: "pending" as const,
    userId: user?.id || "",
  });

  useEffect(() => {
    if (project) {
      const fetchProjectData = async () => {
        const [projectData] = await Promise.all([
          projectService.getProjectById(project.id),
        ]);
        console.log("Fetched project data:", projectData);
        setFormData({
          title: project.title,
          description: project.description,
          location: project.location,
          type: project.projectTypeName || projectData.project.projectTypeName || "",
          typeId: project.projectTypeId,
          quantity: project.quantity,
          floor: project.floor,
          materiality: project.materiality,
          surface: project.surface,
          enclosure: project.enclosure,
          principal1: projectData.charges[0]?.mandatory1 || "",
          principal2: projectData.charges[0]?.mandatory2 || "",
          professionals: projectData.professionals ?? [],
          specialists: projectData.specialists ?? [],
          contact: projectData.charges[0]?.contact || "",
          additionalInfo: project.additionalInfo,
          publicationDate: new Date(projectData.deadline.publicationDate).toISOString().split("T")[0],
          publicationTime: new Date(projectData.deadline.publicationDate).toISOString().split("T")[1].substring(0,5),
          startDate: new Date(projectData.deadline.startDate).toISOString().split("T")[0],
          startTime: new Date(projectData.deadline.startDate).toISOString().split("T")[1].substring(0,5),
          finishDate: new Date(projectData.deadline.finishDate).toISOString().split("T")[0],
          finishTime: new Date(projectData.deadline.finishDate).toISOString().split("T")[1].substring(0,5),
          offersLimit: new Date(projectData.deadline.offersLimit).toISOString().split("T")[0],
          offersLimitTime: new Date(projectData.deadline.offersLimit).toISOString().split("T")[1].substring(0,5),
          asksLimit: new Date(projectData.deadline.asksLimit).toISOString().split("T")[0],
          asksLimitTime: new Date(projectData.deadline.asksLimit).toISOString().split("T")[1].substring(0,5),
          responseLimit: new Date(projectData.deadline.responseLimit).toISOString().split("T")[0],
          responseLimitTime: new Date(projectData.deadline.responseLimit).toISOString().split("T")[1].substring(0,5),
          status: project.status,
          userId: project.userId
        });
        // Load existing files and associated customers if editing
        loadProjectFiles(projectData.files ?? []);
        setAssociatedCustomers(projectData.members ?? []);
      };
      fetchProjectData();
    } else {
      // Reset form for new project
      setFormData({
        title: "",
        description: "",
        location: "",
        type: "",
        typeId: undefined,
        quantity: 1,
        floor: "",
        materiality: "",
        surface: 0,
        enclosure: "",
        principal1: "",
        principal2: "",
        professionals: [{name: ""}],
        specialists: [{name: ""}],
        contact: "",
        additionalInfo: "",
        publicationDate: "",
        publicationTime: "",
        startDate: "",
        startTime: "",
        finishDate: "",
        finishTime: "",
        offersLimit: "",
        offersLimitTime: "",
        asksLimit: "",
        asksLimitTime: "",
        responseLimit: "",
        responseLimitTime: "",
        status: "pendiente",
        userId: user?.id || "",
      });
      setUploadedFiles([]);
    }
  }, [project, user]);
  const [isAdministrator] = useState(user?.role === "administrator");

  // 1. PROJECT FORM STATE
  const [projectDetails, setProjectDetails] = useState({
    name: '',
    description: '',
    address: ''
  });

  // Project meta from service
  const [projectTypes, setProjectTypes] = useState<{ id: number; title: string }[]>([]);

  // 2. CUSTOMER LISTS (Dummy Data)
  // The global pool of customers available to be added
  const [availableCustomers, setAvailableCustomers] = useState<
    { id: number; name: string; email?: string; role?: string}[]
  >([]);
 
   // The customers currently linked to this specific project
   const [associatedCustomers, setAssociatedCustomers] = useState([]);
 
  // load project meta (types, customers) once
  useEffect(() => {
    const loadMeta = async () => {
      try {
        const typesPromise = projectService.getProjectTypes?.() ?? Promise.resolve([]);
        const customersPromise = projectService.getCustomers();
        const [types, customers] = await Promise.all([typesPromise, customersPromise]);
        setProjectTypes(Array.isArray(types) ? types.map((t) => typeof t === 'string' ? { id: 0, title: t } : t) : []);
        setAvailableCustomers(Array.isArray(customers) ? customers : []);
      } catch (err) {
        console.error("Error loading project metadata:", err);
      }
    };
    loadMeta();
  }, [project]);

   // 3. UI STATE
   const [isAccordionDetailsOpen, setIsAccordionDetailsOpen] = useState(false);
   const [isAccordionResponsableOpen, setIsAccordionResponsableOpen] = useState(false);
   const [isAccordionCustomerOpen, setIsAccordionCustomerOpen] = useState(false);
   const [isAccordionAdditionalOpen, setIsAccordionAdditionalOpen] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');
 
   // 4. LOGIC
   const associateCustomer = (customer) => {
     if (!associatedCustomers.find(c => c.id === customer.id)) {
       setAssociatedCustomers([...associatedCustomers, customer]);
     }
   };
 
   const removeAssociation = (id) => {
     setAssociatedCustomers(associatedCustomers.filter(c => c.id !== id));
   };
 
   const filteredAvailable = availableCustomers.filter(c =>
     c.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
     !associatedCustomers.find(assoc => assoc.id === c.id)
   );
 
  const loadProjectFiles = async (projectFile: ProjectFile[]) => {
    try {
      setUploadedFiles(projectFile);
    } catch (error) {
      console.error("Error loading project files:", error);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || !user) return;

    setIsUploading(true);
    try {
      const newFiles: ProjectFile[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        // Validate file type
        const allowedTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/acad",
          "application/dwg",
          "image/jpeg",
          "image/jpg",
          "image/png",
        ];

        if (
          !allowedTypes.includes(file.type) &&
          !file.name.toLowerCase().endsWith(".dwg")
        ) {
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
          projectId: project?.id || "new",
          filename: file.name,
          originalName: file.name,
          file_size: file.size,
          mime_type: file.type,
          uploadDate: new Date(),
          uploadedBy: user.name,
          file_content: file,
        };

        newFiles.push(newFile);
      }

      setUploadedFiles((prev) => [...prev, ...newFiles]);

      // Clear the input
      event.target.value = "";
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading files. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (file: ProjectFile) => {
    try {
      
      const url = URL.createObjectURL(file.file_content.data ? new Blob([file.file_content.data], { type: file.mime_type || 'application/octet-stream' }) : file.file_content);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.originalName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file');
    }
  };

  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const getFileIcon = (fileType: string, fileName: string) => {
    if (
      fileType.includes("image") ||
      fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)
    ) {
      return "🖼️";
    } else if (fileType.includes("pdf")) {
      return "📄";
    } else if (
      fileType.includes("word") ||
      fileName.toLowerCase().match(/\.(doc|docx)$/)
    ) {
      return "📝";
    } else if (fileName.toLowerCase().endsWith(".dwg")) {
      return "📐";
    } else {
      return "📁";
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      console.log("Professionals before submit:", formData.professionals);
      const projectData = {
        ...formData,
        professionals: formData.professionals.filter((p) => p.name.trim() !== ""),
        specialists: formData.specialists.filter((s) => s.name.trim() !== ""),
        members: associatedCustomers,
        files: uploadedFiles.filter((f) => !f.id.toString().startsWith("temp_")), // Only include files that are not newly added
      };

      let savedProject: Project;
      if (project) {
        console.log('Data del Editar Proyecto ========================= ', projectData);
        savedProject = (await projectService.updateProject(
          project.id,
          projectData
        )) as Project;
      } else {
        console.log('Data del Nuevo Proyecto ', projectData);
        savedProject = await projectService.createProject(projectData);
      }

      // Handle file uploads for new project
      if (!project && uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          // In a real implementation, you would upload the actual file here
          // For now, we'll just associate the file metadata with the project
          await projectService.associateFileWithProject(savedProject.id, {
            ...file,
            projectId: savedProject.id,
          });
        }
      }

      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Error saving project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const addProfessional = () => {
    console.log("Adding professional. Current professionals:", formData.professionals);
    setFormData((prev) => ({
      ...prev,
      professionals: [...prev.professionals, {name: ""}],
    }));
  };

  const removeProfessional = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      professionals: prev.professionals.filter((_, i) => i !== index),
    }));
  };

  const updateProfessional = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      professionals: prev.professionals.map((p, i) =>
        i === index ? {...p, name: value} : p
      ),
    }));
  };

  const addSpecialist = () => {
    setFormData((prev) => ({
      ...prev,
      specialists: [...prev.specialists, {name: ""}],
    }));
  };

  const removeSpecialist = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specialists: prev.specialists.filter((_, i) => i !== index),
    }));
  };

  const updateSpecialist = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      specialists: prev.specialists.map((s, i) => (i === index ? {...s, name: value} : s)),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {project ? t("projects.title.edit") : t("projects.title.new")}
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
                onClick={() => setActiveTab("general")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "general"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                {t("tab.general")}
              </button>
              <button
                onClick={() => setActiveTab("deadline")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "deadline"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                {t("tab.deadline")}
              </button>
              <button
                onClick={() => setActiveTab("files")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "files"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                {t("tab.files")}
              </button>
            </nav>
          </div>
        </div>

        <div className="p-6">
          {activeTab === "general" && (
            <div className="space-y-8">
              {/* General Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <button
                  className="w-full px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Notebook className="text-blue-600" size={22} />
                    <h3 className="text-xl font-bold">{t("project.general.title")}</h3>
                  </div>
                </button>
                <div className="px-8 pb-8 animate-in fade-in duration-300">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("project.general.name")}
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder={t("project.general.namePlaceholder")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("project.general.location")}
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        placeholder={t("project.general.locationPlaceholder")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("project.general.description")}
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder={t("project.general.descriptionPlaceholder")}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Information Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setIsAccordionDetailsOpen(!isAccordionDetailsOpen)}
                  className="w-full px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ReceiptText className="text-blue-600" size={22} />
                    <h3 className="text-xl font-bold">{t("project.detail.title")}</h3>
                  </div>
                  {isAccordionDetailsOpen ? (
                    <ChevronUp className="text-blue-400" />
                  ) : (
                    <ChevronDown className="text-blue-400" />
                  )}
                </button>

                {isAccordionDetailsOpen && (
                  <div className="px-8 pb-8 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("project.detail.type")}
                        </label>
                        <select
                          value={formData.type}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              type: e.target.value,
                              typeId: projectTypes.find((pt) => pt.title === e.target.value)?.id,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">{t("common.select")}</option>
                          {projectTypes.length > 0
                            ? projectTypes.map((pt) => (
                                <option key={pt.id} value={pt.title}>
                                  {pt.title}
                                </option>
                              ))
                            : null}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("project.detail.quantity")}
                        </label>
                        <input
                          type="number"
                          value={formData.quantity}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              quantity: parseInt(e.target.value),
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="1"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("project.detail.surface")} (m²)
                        </label>
                        <input
                          type="number"
                          value={formData.surface}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              surface: parseFloat(e.target.value),
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("project.detail.floor")}
                        </label>
                        <input
                          type="text"
                          value={formData.floor}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              floor: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("project.detail.materiality")}
                        </label>
                        <input
                          type="text"
                          value={formData.materiality}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              materiality: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("project.detail.enclosure")}
                        </label>
                        <input
                          type="text"
                          value={formData.enclosure}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              enclosure: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Responsible Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setIsAccordionResponsableOpen(!isAccordionResponsableOpen)}
                  className="w-full px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <HandHelping className="text-blue-600" size={22} />
                    <h3 className="text-xl font-bold">{t("project.officer.title")}</h3>
                  </div>
                  {isAccordionResponsableOpen ? (
                    <ChevronUp className="text-blue-400" />
                  ) : (
                    <ChevronDown className="text-blue-400" />
                  )}
                </button>
                {isAccordionResponsableOpen && (
                  <div className="px-8 pb-8 animate-in fade-in duration-300">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("project.officer.principal1")}
                        </label>
                        <input
                          type="text"
                          value={formData.principal1}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              principal1: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("project.officer.principal2")}
                        </label>
                        <input
                          type="text"
                          value={formData.principal2}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              principal2: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Professionals */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {t("project.officer.professional")}
                        </label>
                        <button
                          type="button"
                          onClick={addProfessional}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                        >
                          <Plus className="h-4 w-4" />
                          <span>{t("project.officer.professional.add")}</span>
                        </button>
                      </div>
                      {formData.professionals.map((professional, index) => (
                        <div key={index} className="flex space-x-2 mb-2">
                          <input
                            type="text"
                            value={professional.name}
                            onChange={(e) =>
                              updateProfessional(index, e.target.value)
                            }
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
                        <label className="block text-sm font-medium text-gray-700">
                          {t("project.officer.specialist")}
                        </label>
                        <button
                          type="button"
                          onClick={addSpecialist}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                        >
                          <Plus className="h-4 w-4" />
                          <span>{t("project.officer.specialist.add")}</span>
                        </button>
                      </div>
                      {formData.specialists.map((specialist, index) => (
                        <div key={index} className="flex space-x-2 mb-2">
                          <input
                            type="text"
                            value={specialist.name}
                            onChange={(e) =>
                              updateSpecialist(index, e.target.value)
                            }
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("project.officer.contact")}
                      </label>
                      <input
                        type="email"
                        value={formData.contact}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            contact: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* CUSTOMERS ASSOCIATED */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setIsAccordionCustomerOpen(!isAccordionCustomerOpen)}
                  className="w-full px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <UserPlus className="text-blue-600" size={22} />
                    <h3 className="text-xl font-bold">{t("project.customer.title")}</h3>
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">
                      {associatedCustomers.length}
                    </span>
                  </div>
                  {isAccordionCustomerOpen ? (
                    <ChevronUp className="text-blue-400" />
                  ) : (
                    <ChevronDown className="text-blue-400" />
                  )}
                </button>

                {isAccordionCustomerOpen && (
                  <div className="px-8 pb-8 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                      {/* Search & Add Pool */}
                      <div className="border-r border-slate-100 pr-0 md:pr-4">
                        <p className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">
                          {t("project.customer.search.title")}
                        </p>
                        <div className="relative mb-4">
                          <Search
                            className="absolute left-3 top-2.5 text-slate-400"
                            size={16}
                          />
                          <input
                            type="text"
                            placeholder={t("project.customer.search.filter")}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400 bg-slate-50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                          {filteredAvailable.map((customer) => (
                            <div
                              key={customer.id}
                              className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg shadow-sm"
                            >
                              <div>
                                <p className="text-sm font-semibold">
                                  {customer.name}
                                </p>
                                <p className="text-[11px] text-slate-400">
                                  {customer.industry}
                                </p>
                              </div>
                              <button
                                onClick={() => associateCustomer(customer)}
                                className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-full transition-colors"
                              >
                                <Plus size={18} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Associated List */}
                      <div>
                        <p className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">
                          {t("project.customer.linked.title")}
                        </p>
                        <div className="space-y-3">
                          {associatedCustomers.length > 0 ? (
                            associatedCustomers.map((customer) => (
                              <div
                                key={customer.id}
                                className="flex items-center justify-between p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl group"
                              >
                                <div className="flex items-center gap-3">
                                  <CheckCircle2
                                    size={16}
                                    className="text-emerald-500"
                                  />
                                  <div>
                                    <p className="text-sm font-bold text-slate-800">
                                      {customer.name}
                                    </p>
                                    <p className="text-[11px] text-slate-500">
                                      {customer.email}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => removeAssociation(customer.id)}
                                  className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                  <UserMinus size={18} />
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="border-2 border-dashed border-slate-100 rounded-xl p-8 text-center">
                              <p className="text-sm text-slate-400 italic">
                                {t("project.customer.no.linked")}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Others Section */}
              <div className="rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setIsAccordionAdditionalOpen(!isAccordionAdditionalOpen)}
                  className="w-full px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Plus className="text-blue-600" size={22} />
                    <h3 className="text-xl font-bold">{t("project.addition.title")}</h3>
                  </div>
                  {isAccordionAdditionalOpen ? (
                    <ChevronUp className="text-blue-400" />
                  ) : (
                    <ChevronDown className="text-blue-400" />
                  )}
                </button>

                {isAccordionAdditionalOpen && (
                  <div className="px-8 pb-8 animate-in fade-in duration-300">
                    <textarea
                      value={formData.additionalInfo}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          additionalInfo: e.target.value,
                        }))
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={t("project.addition.title.placeholder")}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "deadline" && (
            <div className="space-y-8">
              {/* Date Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t("project.deadline.date")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("project.deadline.publication")}
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="date"
                        value={formData.publicationDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            publicationDate: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <input
                        type="time"
                        value={formData.publicationTime}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            publicationTime: e.target.value,
                          }))
                        }
                        step="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("project.deadline.start")}
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            startDate: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      /><input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            startTime: e.target.value,
                          }))
                        }
                        step="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("project.deadline.end")}
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="date"
                        value={formData.finishDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            finishDate: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <input
                        type="time"
                        value={formData.finishTime}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            finishTime: e.target.value,
                          }))
                        }
                        step="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Limits Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t("project.deadline.limits")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("project.deadline.offers")}
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="date"
                        value={formData.offersLimit}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            offersLimit: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <input
                        type="time"
                        value={formData.offersLimitTime}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            offersLimitTime: e.target.value,
                          }))
                        }
                        step="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("project.deadline.ask")}
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="date"
                        value={formData.asksLimit}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            asksLimit: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <input
                        type="time"
                        value={formData.asksLimitTime}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            asksLimitTime: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        step="1"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("project.deadline.response")}
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="date"
                        value={formData.responseLimit}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            responseLimit: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <input
                        type="time"
                        value={formData.responseLimitTime}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            responseLimitTime: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        step="1"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "files" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("project.files.title")}
                </h3>
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
                    <span>{t("project.files.upload")}</span>
                  </label>
                  {isUploading && (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  {t("project.files.support")}:
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• {t("project.files.documents")}</p>
                  <p>• {t("project.files.cad")}</p>
                  <p>• {t("project.files.images")}</p>
                  <p>• {t("project.files.size")}</p>
                </div>
              </div>

              {uploadedFiles.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">
                    {t("project.files.without")}
                  </p>
                  <p className="text-sm text-gray-400">
                    {t("project.files.attach")}
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t("project.files.table.file")}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t("project.files.table.date")}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t("project.files.table.by")}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t("project.files.table.size")}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t("project.files.table.action")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {uploadedFiles.map((file) => (
                          <tr key={file.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-2xl mr-3">
                                  {getFileIcon(file.mime_type, file.originalName)}
                                </span>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {file.originalName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {file.mime_type}
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
                              {formatFileSize(file.file_size)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => setSelectedFile(file)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="View"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDownload(file)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                title="Download"
                              >
                                <Download className="w-5 h-5" />
                              </button>
                              {isAdministrator && (
                                <button
                                  onClick={() => handleDeleteFile(file.id)}
                                  className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                                  title="Delete file"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selectedFile && (
                <FileViewer
                  file={selectedFile}
                  onClose={() => setSelectedFile(null)}
                />
              )}

              {uploadedFiles.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm text-blue-800">
                      {uploadedFiles.length} file
                      {uploadedFiles.length !== 1 ? "s" : ""}{" "}
                      {t("project.files.message")}
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
            {t("common.cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t("common.files.size")}</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{t("project.button.save")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;