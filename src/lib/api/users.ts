// /lib/api/users.ts --> Get/Update user
import { apiClient } from './client';

export const getUserByEmail = (email: string) => apiClient(`/users/${email}`);

export const updateProfile = (formData: FormData) =>
  fetch('https://truthful-simplicity-production.up.railway.app/users/profile', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    },
    body: formData,
  }).then((res) => res.json());

export const changePassword = (body: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) =>
  apiClient('/users/password', {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(body),
  });
