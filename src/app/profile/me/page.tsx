'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { PostCard } from '@/components/post/PostCard';

import { getRecommendedPosts } from '@/lib/api/posts';
import { getUserByEmail } from '@/lib/api/users';
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';

export default function MyProfilePage() {
  useAuthGuard();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    setEmail(storedEmail);
  }, []);

  const { data: user } = useQuery({
    queryKey: ['me', email],
    queryFn: () => getUserByEmail(email || ''),
    enabled: !!email,
  });

  const { data: posts } = useQuery({
    queryKey: ['my-posts'],
    queryFn: () => getRecommendedPosts(50, 1),
  });

  return (
    <div className='custom-container mt-24'>
      <h1 className='text-2xl font-bold'>{user?.name}</h1>
      <p className='mb-4 text-neutral-500'>{user?.headline}</p>

      <h2 className='mb-2 text-lg font-semibold'>My Posts</h2>
      <div className='flex flex-col gap-4'>
        {posts?.data
          .filter((p: any) => p.author.email === user?.email)
          .map((post: any) => <PostCard key={post.id} {...post} />)}
      </div>
    </div>
  );
}
