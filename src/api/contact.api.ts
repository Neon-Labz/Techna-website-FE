import apiClient from '../lib/axios';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export const sendContactMessage = async (data: ContactFormData) => {
  const response = await apiClient.post('/contact', data);
  return response.data;
};
