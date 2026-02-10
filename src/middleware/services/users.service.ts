import ApiClient from '../http/apiClient';
import { User } from '../types/index';

export default class UsersService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient('http://localhost:3000/api/v1');
  }

  async getUserById(userId: number): Promise<User> {
    const response = await this.apiClient.get(`/users/${userId}`);
    return response.data;
  }

  async updateUser(userId: number, userData: Partial<User>): Promise<User> {
    const response = await this.apiClient.put(`/users/${userId}`, userData);
    return response.data;
  }

  async getAllUsers(): Promise<User[]> {
    const response = await this.apiClient.get('/users');
    return response.data;
  }

  async deleteUser(userId: number): Promise<void> {
    await this.apiClient.delete(`/users/${userId}`);
  }
}