import ApiClient from '../http/apiClient';
import { ProjectConfig } from '../types/index';

export class ProjectConfigService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient('http://localhost:3000/api/v1');
  }

  async getProjectConfig(projectId: number): Promise<ProjectConfig> {
    const response = await this.apiClient.get(`/project-config/${projectId}`);
    return response.data;
  }

  async createProjectConfig(projectConfig: ProjectConfig): Promise<ProjectConfig> {
    const response = await this.apiClient.post('/project-config', projectConfig);
    return response.data;
  }

  async updateProjectConfig(projectId: number, projectConfig: ProjectConfig): Promise<ProjectConfig> {
    const response = await this.apiClient.put(`/project-config/${projectId}`, projectConfig);
    return response.data;
  }

  async deleteProjectConfig(projectId: number): Promise<void> {
    await this.apiClient.delete(`/project-config/${projectId}`);
  }
}