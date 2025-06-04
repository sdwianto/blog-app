//All shared types and interfaces

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  tags: string[];
  image?: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  commentsCount: number;
}

export interface Comment {
  id: number;
  content: string;
  author: User;
  post: Post;
  createdAt: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  tags: string[];
  image?: File;
}

export interface CreateCommentRequest {
  userId: number;
  content: string;
}
