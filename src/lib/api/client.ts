// /lib/api/client.ts  --> fetch wrapper URL + token
const BASE_URL = 'https://truthful-simplicity-production.up.railway.app';

type Options = RequestInit & {
  auth?: boolean; // pakai token atau tidak
};

export const apiClient = async <T = any>(
  endpoint: string,
  { auth = false, ...options }: Options = {}
): Promise<T> => {
  const headers: HeadersInit = {
    ...(options.headers || {}),
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (auth) {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'API Error');
  }

  return res.json();
};
