import ApiClient from '../http/apiClient';
import { ProjectMember } from '../../types/index';

class ProjectMembersService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient('http://localhost:3000/api/v1/project-members');
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
    console.log('ProjectMembersService.getMembers response:', response);
    return response;
  }

  async getAllMembers(): Promise<ProjectMember[]> {
    const response = await this.apiClient.get(`/`);
    console.log('ProjectMembersService.getAllMembers response:', response);
    return response;
  }
}

export default ProjectMembersService;