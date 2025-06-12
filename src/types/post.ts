export interface Post extends Record<string, any> {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  likes: number;
  comments: number;
  tags: string[];
  author: {
    id: number;
    name: string;
    image?: string;
  };
  imageUrl: string;
}
