// src/app/post/[id]/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useParams } from 'next/navigation';

import { getCommentsByPost } from '@/lib/api/comments';

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: comments } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => getCommentsByPost(Number(id)),
  });

  const { data: post } = useQuery({
    queryKey: ['post', id],
    queryFn: () => fetch(`/api/posts/${id}`).then((res) => res.json()),
  });

  return (
    <div className='custom-container mt-24 flex flex-col gap-6'>
      {post ? (
        <>
          <h1 className='text-2xl font-bold'>{post.title}</h1>
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={800}
            height={400}
            className='rounded-lg object-cover'
          />
          <p className='text-neutral-700'>{post.content}</p>
          <div className='text-sm text-neutral-400'>
            Tags: {post.tags.map((tag: string) => `#${tag} `)}
          </div>
        </>
      ) : (
        <p>Loading post...</p>
      )}

      <hr />

      <div>
        <h2 className='text-lg font-semibold'>Comments</h2>
        {comments?.length ? (
          <div className='mt-4 flex flex-col gap-4'>
            {comments.map((c: any) => (
              <div key={c.id} className='border-b pb-2'>
                <p className='text-sm font-medium'>{c.author.name}</p>
                <p className='text-sm text-neutral-700'>{c.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className='mt-2 text-neutral-500'>No comments yet.</p>
        )}
      </div>
    </div>
  );
}
