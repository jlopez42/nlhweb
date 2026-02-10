import ApiClient from '../http/apiClient';
import { ProjectProfessional, ProjectSpecialist } from '../types/index';

export class ProjectRelationsService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient('http://localhost:3000/api/v1');
  }

  public async addProfessionalToProject(projectId: number, managerId: number): Promise<ProjectProfessional> {
    const response = await this.apiClient.post(`/projects/${projectId}/professionals`, { manager_id: managerId });
    return response.data;
  }

  public async addSpecialistToProject(projectId: number, managerId: number): Promise<ProjectSpecialist> {
    const response = await this.apiClient.post(`/projects/${projectId}/specialists`, { manager_id: managerId });
    return response.data;
  }

  public async getProjectProfessionals(projectId: number): Promise<ProjectProfessional[]> {
    const response = await this.apiClient.get(`/projects/${projectId}/professionals`);
    return response.data;
  }

  public async getProjectSpecialists(projectId: number): Promise<ProjectSpecialist[]> {
    const response = await this.apiClient.get(`/projects/${projectId}/specialists`);
    return response.data;
  }

  public async removeProfessionalFromProject(projectId: number, managerId: number): Promise<void> {
    await this.apiClient.delete(`/projects/${projectId}/professionals/${managerId}`);
  }

  public async removeSpecialistFromProject(projectId: number, managerId: number): Promise<void> {
    await this.apiClient.delete(`/projects/${projectId}/specialists/${managerId}`);
  }
}