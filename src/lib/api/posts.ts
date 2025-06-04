// /lib/api/posts.ts --> All post related API
import { apiClient } from './client';

export const getRecommendedPosts = (limit = 10, page = 1) =>
  apiClient(`/posts/recommended?limit=${limit}&page=${page}`);

export const getMostLikedPosts = (limit = 10, page = 1) =>
  apiClient(`/posts/most-liked?limit=${limit}&page=${page}`);

export const searchPosts = (query: string, limit = 10, page = 1) =>
  apiClient(
    `/posts/search?query=${encodeURIComponent(query)}&limit=${limit}&page=${page}`
  );

export const getPostComments = (postId: number) =>
  apiClient(`/posts/${postId}/comments`);

export const getPostLikes = (postId: number) =>
  apiClient(`/posts/${postId}/likes`);

export const likePost = (postId: number) =>
  apiClient(`/posts/${postId}/like`, {
    method: 'POST',
    auth: true,
  });

export const deletePost = (id: number) =>
  apiClient(`/posts/${id}`, {
    method: 'DELETE',
    auth: true,
    body: JSON.stringify({}),
  });

export const createPost = (formData: FormData) =>
  fetch('https://truthful-simplicity-production.up.railway.app/posts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    },
    body: formData,
  }).then((res) => {
    if (!res.ok) throw new Error('Failed to create post');
    return res.json();
  });

export const updatePost = (id: number, formData: FormData) =>
  fetch(`https://truthful-simplicity-production.up.railway.app/posts/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    },
    body: formData,
  }).then((res) => {
    if (!res.ok) throw new Error('Failed to update post');
    return res.json();
  });
