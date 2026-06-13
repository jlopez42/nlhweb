import ApiClient from '../http/apiClient';
import { ProjectMember } from '../../types/index';

class ProjectMembersService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient('https://backend.nlh.cl/api/v1/project-members');
  }

  async addMember(projectId: number, userId: number, role: string): Promise<ProjectMember> {
    const response = await this.apiClient.post(`/projects/${projectId}/members`, { userId, role });
    return response.data;
  }

  async removeMember(projectId: number, userId: number): Promise<void> {
    await this.apiClient.delete(`/projects/${projectId}/members/${userId}`);
  }

  async getMembers(projectId: number): Promise<ProjectMember[]> {
    const response = await this.apiClient.get(`/project/${projectId}/members`);
    return response;
  }

  async getAllMembers(): Promise<ProjectMember[]> {
    const response = await this.apiClient.get(`/`);
    return response;
  }
}

export default ProjectMembersService;