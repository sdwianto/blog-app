// /lib/api/auth.ts  --> register & login
import { apiClient } from './client';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    image?: string;
  };
}

export const login = (email: string, password: string) =>
  apiClient<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const register = (name: string, email: string, password: string) =>
  apiClient<LoginResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
