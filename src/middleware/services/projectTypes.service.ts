import ApiClient from '../http/apiClient';
import { ProjectType } from '../../types/index';

class ProjectTypesService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient('http://localhost:3000/api/v1');
  }

  async getAllProjectTypes(): Promise<ProjectType[]> {
    const response = { data: [] as ProjectType[] };
    response.data = await this.apiClient.get('/project-types');
    console.log("API response for project types:", response.data);
    return response.data;
  }

  async getProjectTypeById(id: number): Promise<ProjectType> {
    const response = await this.apiClient.get(`/project-types/${id}`);
    return response.data;
  }

  async createProjectType(projectType: ProjectType): Promise<ProjectType> {
    const response = await this.apiClient.post('/project-types', projectType);
    return response.data;
  }

  async updateProjectType(id: number, projectType: ProjectType): Promise<ProjectType> {
    const response = await this.apiClient.put(`/project-types/${id}`, projectType);
    return response.data;
  }

  async deleteProjectType(id: number): Promise<void> {
    await this.apiClient.delete(`/project-types/${id}`);
  }
}

export default ProjectTypesService;