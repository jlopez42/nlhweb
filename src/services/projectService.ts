import { Project, ProjectFile, ProjectType, Question } from '../types';
import { mockProjects, mockProjectFiles, mockQuestions, mockQuestionsSpanish } from '../data/mockData';
import ProjectsService from '../middleware/services/projects.service';
import ProjectTypesService from '../middleware/services/projectTypes.service';
import { util } from '../common';

export const projectService = {
  // Get all projects
  getProjects: async (): Promise<Project[]> => {
    return new Promise((resolve) => {    
      setTimeout(async () => {
        const response = await new ProjectsService().getAllProjects();
        resolve([...util.processProjects(response)]);
      }, 500);
    });
  },

  // Get projects by user ID
  getProjectsByUserId: async (userId: string): Promise<Project[]> => {
    console.log('Getting projects for user ID:', userId);
    return new Promise((resolve) => {
      setTimeout(() => {
        const userProjects = mockProjects.filter(p => p.userId == userId);
        resolve(userProjects);
      }, 500);
    });
  },

  // Get project by ID
  getProjectById: async (id: string) => {
    console.log('Fetching project with ID:', id);
    return new Promise((resolve) => {
      setTimeout(async () => {
        const response = await new ProjectsService().getProject(id);
        resolve(response);
      }, 500);
    });
  },

  // Create new project
  createProject: async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProject: Project = {
          ...projectData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        mockProjects.push(newProject);
        resolve(newProject);
      }, 800);
    });
  },

  // Update project
  updateProject: async (id: string, updates: Partial<Project>): Promise<Project | null> => {
    console.log('Updating project ID:', id, 'with updates:', updates);
    return new Promise((resolve) => {
      setTimeout(async () => {
        const project = await new ProjectsService().updateProject(id, updates);
        resolve(project || null);
      }, 600);
    });
  },

  // Delete project
  deleteProject: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockProjects.findIndex(p => p.id === id);
        if (index !== -1) {
          mockProjects.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 400);
    });
  },

  // Get project files
  getProjectFiles: async (projectId: string): Promise<ProjectFile[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const files = mockProjectFiles.filter(f => f.projectId === projectId);
        resolve(files);
      }, 300);
    });
  },

  // Upload file
  uploadFile: async (projectId: string, file: File, uploadedBy: string): Promise<ProjectFile> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newFile: ProjectFile = {
          id: Date.now().toString(),
          projectId,
          filename: file.name,
          originalName: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date(),
          uploadedBy
        };
        mockProjectFiles.push(newFile);
        resolve(newFile);
      }, 1000);
    });
  },

  // Associate file with project (for new projects)
  associateFileWithProject: async (projectId: string, file: any) => {
    const form = new FormData();

    // file.file_content may be a File, a Blob, or an object with .data
    if (file.file_content instanceof File) {
      form.append("file", file.file_content, file.originalName || file.filename);
    } else if (file.file_content?.data) {
      const blob = new Blob([file.file_content.data], { type: file.mime_type || "application/octet-stream" });
      form.append("file", blob, file.originalName || file.filename);
    }

    // metadata
    if (file.originalName) form.append("originalName", file.originalName);
    if (file.filename) form.append("filename", file.filename);
    if (file.mime_type) form.append("mime_type", file.mime_type);
    if (file.uploadedBy) form.append("uploadedBy", file.uploadedBy);

    const res = await fetch(`/api/projects/${projectId}/files`, {
      method: "POST",
      body: form,
    });

    if (!res.ok) throw new Error("Failed to associate file with project");
    return res.json();
  },

  // Delete file
  deleteFile: async (fileId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockProjectFiles.findIndex(f => f.id === fileId);
        if (index !== -1) {
          mockProjectFiles.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  },

  // Get project questions
  getProjectQuestions: async (projectId: string): Promise<Question[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const questions = mockQuestionsSpanish.filter(q => q.projectId === projectId);
        resolve(questions);
      }, 400);
    });
  },

  // Add question
  addQuestion: async (questionData: Omit<Question, 'id' | 'askedAt'>): Promise<Question> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newQuestion: Question = {
          ...questionData,
          id: Date.now().toString(),
          askedAt: new Date()
        };
        mockQuestionsSpanish.push(newQuestion);
        resolve(newQuestion);
      }, 500);
    });
  },

  // Respond to question
  respondToQuestion: async (questionId: string, response: string, respondedBy: string): Promise<Question | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockQuestionsSpanish.findIndex(q => q.id === questionId);
        if (index !== -1) {
          mockQuestionsSpanish[index] = {
            ...mockQuestions[index],
            response,
            respondedBy,
            respondedAt: new Date()
          };
          resolve(mockQuestionsSpanish[index]);
        } else {
          resolve(null);
        }
      }, 400);
    });
  },

  // New: fetch global customers pool
  getCustomersByProjectId: async (projectId: string) => {
    const res = await fetch(`/api/projects/${projectId}/customers`);
    if (!res.ok) {
      throw new Error("Failed to load customers for project");
    }
    return res.json();
  },

  // ... Additional project-related services can be added here
  // e.g., assignTeamMembers, setDeadlines, etc.
  // ...

  // Populate select options for projectType field
  getProjectTypes: async (): Promise<ProjectType[]> => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const options = await new ProjectTypesService().getAllProjectTypes();
        console.log("Fetched project types:", options);
        resolve(options);
      }, 200);
    });
  }
  
};