import ApiClient from '../http/apiClient';
import { Project, ProjectStatus } from '../../types/index';

class ProjectsService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient('http://localhost:3000/api/v1');
  }

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const response = await this.apiClient.post('/projects', project);
    return response.data;
  }

  async updateProject(projectId: string, project: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>): Promise<Project> {
    const response = await this.apiClient.put(`/projects/${projectId}`, project);
    return response.data;
  }

  async getProject(projectId: string): Promise<Project> {
    const response = { data: {} as Project};
    response.data = await this.apiClient.get(`/projects/${projectId}`);
    return response.data;
  }

  async getAllProjects(): Promise<Project[]> {
    const response = { data: [] as Project[] };
    response.data = await this.apiClient.get('/projects');
    return response.data;
  }

  async deleteProject(projectId: number): Promise<void> {
    await this.apiClient.delete(`/projects/${projectId}`);
  }

  async updateProjectStatus(projectId: number, status: ProjectStatus): Promise<Project> {
    const response = await this.apiClient.patch(`/projects/${projectId}/status`, { status });
    return response.data;
  }
}

export default ProjectsService;