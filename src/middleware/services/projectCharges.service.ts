import ApiClient from '../http/apiClient';
import { ProjectCharge } from '../../types/index';

export default class ProjectChargesService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient('http://localhost:3000/api/v1');
  }

  async createCharge(charge: ProjectCharge): Promise<ProjectCharge> {
    const response = await this.apiClient.post('/project-charges', charge);
    return response.data;
  }

  async getCharge(chargeId: number): Promise<ProjectCharge> {
    const response = await this.apiClient.get(`/project-charges/${chargeId}`);
    return response.data;
  }

  async getChargesByProject(projectId: number): Promise<ProjectCharge[]> {
    const response = await this.apiClient.get(`/projects/${projectId}/charges`);
    return response.data;
  }

}