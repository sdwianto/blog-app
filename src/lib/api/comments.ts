// /lib/api/comments.ts  --> All comment related API

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getCommentsByPost(postId: number) {
  const res = await fetch(`${BASE_URL}/comments/${postId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!res.ok) throw new Error('Failed to get comments');
  return res.json();
}

export async function postComment(
  postId: number,
  userId: number,
  content: string
) {
  const profile = JSON.parse(localStorage.getItem('profile') || '{}');
  const res = await fetch(`${BASE_URL}/comments/${postId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ userId: profile.id, content }),
  });
  if (!res.ok) throw new Error('Failed to post comment');
  return res.json();
}
