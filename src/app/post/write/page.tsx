// src/app/post/write/page.tsx

import { PostForm } from '@/components/post/PostForm';

import { useAuthGuard } from '@/lib/hooks/useAuthGuard';

export default function WritePostPage() {
  useAuthGuard();
  return (
    <div className='custom-container mt-24'>
      <h1 className='mb-6 text-2xl font-bold'>Write a new post</h1>
      <PostForm mode='create' />
    </div>
  );
}
