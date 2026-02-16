import ApiClient from '../http/apiClient';
import { ProjectFile } from '../../types/index';

class ProjectFilesService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient('http://localhost:3000/api/v1/project-files');
  }

  async uploadFile(projectId: number, formData: FormData): Promise<ProjectFile> {
    const response = await this.apiClient.post(`/${projectId}/files`, formData);
    console.log('ProjectFilesService.uploadFile response:', response);
    return response;
  }

  async getFilesByProjectId(projectId: number): Promise<ProjectFile[]> {
    const response = await this.apiClient.get(`/${projectId}/files`);
    return response.data;
  }

  async deleteFile(fileId: number): Promise<void> {
    await this.apiClient.delete(`/files/${fileId}`);
  }
}

export default ProjectFilesService;