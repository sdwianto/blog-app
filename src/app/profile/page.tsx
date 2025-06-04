// src/app/profile/page.tsx

'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { PostCard } from '@/components/post/PostCard';

import { getRecommendedPosts } from '@/lib/api/posts';
import { getUserByEmail } from '@/lib/api/users';

export default function UserProfilePage() {
  const { email } = useParams<{ email: string }>();

  const { data: user } = useQuery({
    queryKey: ['user', email],
    queryFn: () => getUserByEmail(email),
  });

  const { data: posts } = useQuery({
    queryKey: ['user-posts', email],
    queryFn: () => getRecommendedPosts(20, 1),
  });

  return (
    <div className='custom-container mt-24'>
      <h1 className='text-2xl font-bold'>{user?.name}</h1>
      <p className='text-neutral-600'>{user?.headline}</p>

      <div className='mt-6 flex flex-col gap-4'>
        <h2 className='text-lg font-semibold'>Posts</h2>
        {posts?.data
          .filter((p: any) => p.author.email === email)
          .map((post: any) => <PostCard key={post.id} {...post} />)}
      </div>
    </div>
  );
}
