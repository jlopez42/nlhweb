import { Project, ProjectFile, ProjectType, Question, User } from '../types';
import { mockProjects, mockProjectFiles, mockQuestions, mockQuestionsSpanish } from '../data/mockData';
import ProjectsService from '../middleware/services/projects.service';
import ProjectTypesService from '../middleware/services/projectTypes.service';
import ProjectMembersService from '../middleware/services/projectMembers.service';
import ProjectFilesService from '../middleware/services/projectFiles.service';
import UsersService from '../middleware/services/users.service';
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
    return new Promise((resolve) => {
      setTimeout(() => {
        const userProjects = mockProjects.filter(p => p.userId == userId);
        resolve(userProjects);
      }, 500);
    });
  },

  // Get project by ID
  getProjectById: async (id: string) => {
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
      setTimeout(async () => {
        const project = await new ProjectsService().createProject(projectData);
        resolve(project);
      }, 600);
    });
  },

  // Update project
  updateProject: async (id: string, updates: Partial<Project>): Promise<Project | null> => {
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
      setTimeout(async () => {
        const project = await new ProjectsService().deleteProject(id);
        if (project !== null && project !== undefined) {  
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
  uploadFile: async (newFile: ProjectFile, file: FormData, uploadedBy: string): Promise<ProjectFile> => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        file.append("newFile", JSON.stringify(newFile));
        file.append("uploadedBy", uploadedBy);
        const fileUploaded = await new ProjectFilesService().uploadFile(String(newFile.projectId), file);
        resolve(fileUploaded);
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

    return new Promise((resolve) => {
      setTimeout(async () => {
        const projectFile = await new ProjectFilesService().uploadFile(projectId, form);
        resolve(projectFile);   
      }, 600);
    });
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


  // ... Additional project-related services can be added here
  // e.g., assignTeamMembers, setDeadlines, etc.
  // ...


  // New: fetch global customers pool
  getCustomersByProjectId: async (projectId: string) => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const response = await new ProjectMembersService().getMembers(projectId);
        resolve(response);
      }, 500);
    });
  },

   getCustomers: async () => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const response = await new ProjectMembersService().getAllMembers();
        resolve(response);
      }, 500);
    });
  },

  // Populate select options for projectType field
  getProjectTypes: async (): Promise<ProjectType[]> => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const options = await new ProjectTypesService().getAllProjectTypes();
        resolve(options);
      }, 200);
    });
  },
  
  getAllUsers: async () => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const response = await new UsersService().getAllUsers();
        resolve(response);
      }, 500);
    });
  },

  // Create new user (for project members)
  createUser: async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const response = await new UsersService().createUser(userData);
        resolve(response);
      }, 500);
    });
  },

  deleteUser: async (userId: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        await new UsersService().deleteUser(userId);
        resolve();
      }, 300);
    });
  },

  updateUser: async (userId: number, userData: Partial<User>): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const response = await new UsersService().updateUser(userId, userData);
        resolve(response);
      }, 500);
    });
  },

  getUserById: async (userId: number): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const response = await new UsersService().getUserById(userId);
        resolve(response);
      }, 500);
    });
  },

  // Update user password
  updatePassword: async (userId: number | undefined, newPassword: string): Promise<User> => {
    if (!userId) {
      throw new Error("User ID is required to update password");
    }
    return new Promise((resolve) => {
      setTimeout(async () => {
        const response = await new UsersService().changePassword(userId, newPassword);
        resolve(response);
      }, 500);
    });
  }
  
};