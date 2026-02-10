import ApiClient from '../http/apiClient';
import { Manager } from '../types/index';

export default class ManagersService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient('http://localhost:3000/api/v1');
  }

  async getManagers(): Promise<Manager[]> {
    const response = await this.apiClient.get('/managers');
    return response.data;
  }

  async getManagerById(id: number): Promise<Manager> {
    const response = await this.apiClient.get(`/managers/${id}`);
    return response.data;
  }

  async createManager(manager: Omit<Manager, 'id'>): Promise<Manager> {
    const response = await this.apiClient.post('/managers', manager);
    return response.data;
  }

  async updateManager(id: number, manager: Partial<Omit<Manager, 'id'>>): Promise<Manager> {
    const response = await this.apiClient.put(`/managers/${id}`, manager);
    return response.data;
  }

  async deleteManager(id: number): Promise<void> {
    await this.apiClient.delete(`/managers/${id}`);
  }
}