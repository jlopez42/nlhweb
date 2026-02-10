import ApiClient from '../http/apiClient';
import { ProjectFile } from '../types/index';

class ProjectFilesService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient('http://localhost:3000/api/v1');
  }

  async uploadFile(projectId: number, file: File): Promise<ProjectFile> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.apiClient.post(`/projects/${projectId}/files`, formData);
    return response.data;
  }

  async getFilesByProjectId(projectId: number): Promise<ProjectFile[]> {
    const response = await this.apiClient.get(`/projects/${projectId}/files`);
    return response.data;
  }

  async deleteFile(fileId: number): Promise<void> {
    await this.apiClient.delete(`/files/${fileId}`);
  }
}

export default ProjectFilesService;