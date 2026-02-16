import ApiClient from '../http/apiClient';
import { User } from '../../types/index';

export default class UsersService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient('http://localhost:3000/api/v1/users');
  }

  async getUserById(userId: number): Promise<User> {
    const response = await this.apiClient.get(`/${userId}`);
    return response.data;
  }

  async updateUser(userId: number, userData: Partial<User>): Promise<User> {
    const response = await this.apiClient.put(`/${userId}`, userData);
    return response.data;
  }

  async getAllUsers(): Promise<User[]> {
    const response = await this.apiClient.get('/');
    return response;
  }

  async deleteUser(userId: number): Promise<void> {
    await this.apiClient.delete(`/${userId}`);
  }

  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const response = await this.apiClient.post('/', userData);
    return response.data;
  }

  async authenticate(username: string, password: string): Promise<User | null> {
    try {
      const response = await this.apiClient.post('/auth/login', { username, password });
      return response;
    } catch (error) {
      console.error('Authentication failed:', error);
      return null;
    }
  }
  
}