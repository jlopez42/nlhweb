import ApiClient from '../http/apiClient';
import { ProjectCharge, ProjectChargeProfessional, ProjectChargeSpecialist } from '../types';

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

  async assignProfessionalToCharge(chargeId: number, professional: ProjectChargeProfessional): Promise<void> {
    await this.apiClient.post(`/project-charges/${chargeId}/professionals`, professional);
  }

  async assignSpecialistToCharge(chargeId: number, specialist: ProjectChargeSpecialist): Promise<void> {
    await this.apiClient.post(`/project-charges/${chargeId}/specialists`, specialist);
  }
}