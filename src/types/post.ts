export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  likes: number;
  comments: number;
  tags: string[];
  author: {
    name: string;
    image?: string;
  };
  imageUrl: string;
}
