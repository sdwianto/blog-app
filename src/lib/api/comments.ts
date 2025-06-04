// /lib/api/comments.ts  --> All comment related API
import { apiClient } from './client';

export const getCommentsByPost = (postId: number) =>
  apiClient(`/comments/${postId}`);

export const postComment = (postId: number, userId: number, content: string) =>
  apiClient(`/comments/${postId}`, {
    method: 'POST',
    body: JSON.stringify({ userId, content }),
  });
