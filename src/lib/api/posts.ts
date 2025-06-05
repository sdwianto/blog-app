// /lib/api/posts.ts --> All post related API

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getPostById(id: number) {
  const res = await fetch(`${BASE_URL}/posts/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch post with id ${id}`);
  }
  return res.json();
}

export async function getPostLikes(id: number) {
  const res = await fetch(`${BASE_URL}/posts/${id}/likes`);
  if (!res.ok) throw new Error(`Failed to fetch likes for post ${id}`);
  return res.json();
}

export async function getRecommendedPosts(limit = 10, page = 1) {
  const res = await fetch(
    `${BASE_URL}/posts/recommended?limit=${limit}&page=${page}`
  );
  if (!res.ok) throw new Error('Failed to fetch recommended posts');
  return res.json();
}

export async function getMostLikedPosts(limit = 10, page = 1) {
  const res = await fetch(
    `${BASE_URL}/posts/most-liked?limit=${limit}&page=${page}`
  );
  if (!res.ok) throw new Error('Failed to fetch most liked posts');
  return res.json();
}

export async function searchPosts(query: string, limit = 10, page = 1) {
  const res = await fetch(
    `${BASE_URL}/posts/search?query=${encodeURIComponent(query)}&limit=${limit}&page=${page}`
  );
  if (!res.ok) throw new Error('Failed to search posts');
  return res.json();
}

export async function createPost(formData: FormData) {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to create post');
  return res.json();
}

export async function updatePost(id: number, formData: FormData) {
  const res = await fetch(`${BASE_URL}/posts/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to update post');
  return res.json();
}

export async function likePost(id: number) {
  const res = await fetch(`${BASE_URL}/posts/${id}/like`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!res.ok) throw new Error('Failed to like post');
  return res.json();
}
