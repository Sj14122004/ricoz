import { api } from '@/lib/api';
import { User } from '@/types';

export const authService = {
  me: () => api.get<User>('/auth/me'),
  login: (email: string, password: string) => api.post<User>('/auth/login', { email, password }),
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post<User>('/auth/register', data),
  logout: () => api.post<null>('/auth/logout'),
};
