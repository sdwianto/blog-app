// src/app/post/edit/page.tsx

'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { PostForm } from '@/components/post/PostForm';

import { useAuthGuard } from '@/lib/hooks/useAuthGuard';

export default function EditPostPage() {
  useAuthGuard();
  const { id } = useParams<{ id: string }>();
  const { data } = useQuery({
    queryKey: ['edit-post', id],
    queryFn: () => fetch(`/api/posts/${id}`).then((res) => res.json()),
  });

  return (
    <div className='custom-container mt-24'>
      <h1 className='mb-6 text-2xl font-bold'>Edit Post</h1>
      {data ? (
        <PostForm mode='edit' postId={Number(id)} initialData={data} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
