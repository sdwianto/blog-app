// /lib/api/users.ts --> Get/Update user
import { apiClient } from './client';
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getUserByEmail(email: string) {
  const res = await fetch(`${BASE_URL}/users/${email}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export async function updateProfile(formData: FormData) {
  const token = localStorage.getItem('token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

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

export const deleteProfile = async () => {
  const token = localStorage.getItem('token');
  console.log('using token: ', token);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  console.log('Delete response:', data);

  if (!res.ok) {
    throw new Error('Failed to delete profile');
  }

  return res.json();
};
