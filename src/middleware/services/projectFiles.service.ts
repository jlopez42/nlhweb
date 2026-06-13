import ApiClient from '../http/apiClient';
import { ProjectFile } from '../../types/index';

class ProjectFilesService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient('https://backend.nlh.cl/api/v1/project-files');
  }

  async uploadFile(projectId: string, formData: FormData): Promise<ProjectFile> {
    const response = await this.apiClient.post(`/${projectId}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  }

  async getFilesByProjectId(projectId: string): Promise<ProjectFile[]> {
    const response = await this.apiClient.get(`/${projectId}/files`);
    return response.data;
  }

  async deleteFile(fileId: string): Promise<void> {
    await this.apiClient.delete(`/files/${fileId}`);
  }
}

export default ProjectFilesService;