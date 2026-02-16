import ApiClient from '../http/apiClient';
import { Question } from '../../types/index';

class QuestionsService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient('http://localhost:3000/api/v1');
  }

  async fetchQuestions(projectId: number): Promise<Question[]> {
    const response = await this.apiClient.get(`/projects/${projectId}/questions`);
    return response.data;
  }

  async submitQuestion(projectId: number, question: Omit<Question, 'id' | 'askedAt'>): Promise<Question> {
    const response = await this.apiClient.post(`/projects/${projectId}/questions`, question);
    return response.data;
  }

  async respondToQuestion(questionId: number, response: string): Promise<Question> {
    const response = await this.apiClient.put(`/questions/${questionId}/response`, { response });
    return response.data;
  }
}

export default QuestionsService;