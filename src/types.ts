export type Author = {
  name: string;
  image?: string;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  tags: string[];
  imageUrl: string;
  author: Author;
  createdAt: string;
  likes: number;
  comments: number;
};

export type ApiResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
};
