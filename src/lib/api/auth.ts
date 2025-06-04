// /lib/api/auth.ts  --> register & login
import { apiClient } from './client';

export const login = (email: string, password: string) =>
  apiClient<{ token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const register = (name: string, email: string, password: string) =>
  apiClient('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
