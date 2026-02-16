import ApiClient from '../http/apiClient';
import { ContactMessage } from '../../types/index';

class ContactMessagesService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient('http://localhost:3000/api/v1');
  }

  async sendMessage(contactMessage: ContactMessage): Promise<ContactMessage> {
    const response = await this.apiClient.post<ContactMessage>('/contact-messages', contactMessage);
    return response.data;
  }

  async getMessages(): Promise<ContactMessage[]> {
    const response = await this.apiClient.get<ContactMessage[]>('/contact-messages');
    return response.data;
  }

  async getMessageById(id: number): Promise<ContactMessage> {
    const response = await this.apiClient.get<ContactMessage>(`/contact-messages/${id}`);
    return response.data;
  }
}

export default ContactMessagesService;