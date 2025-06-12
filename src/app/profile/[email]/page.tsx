'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React from 'react';

import { PostCard, FALLBACK_AUTHOR_IMAGE } from '@/components/post/PostCard';

import { getRecommendedPosts } from '@/lib/api/posts';
import { getUserByEmail } from '@/lib/api/users';

export default function PublicProfilePage() {
  const { email } = useParams<{ email: string }>();

  const { data: user } = useQuery({
    queryKey: ['user-by-email', email],
    queryFn: () => getUserByEmail(email),
    enabled: !!email,
  });

  const { data: posts } = useQuery({
    queryKey: ['posts-by-email', email],
    queryFn: () => getRecommendedPosts(50, 1),
    enabled: !!email,
  });

  const userPosts = posts?.data.filter((p: any) => p.author.email === email);

  return (
    <>
      <Navbar />
      <div className='custom-container mt-32 flex flex-col items-center'>
        <div className='flex w-full max-w-4xl flex-col gap-6'>
          {user ? (
            <div className='flex items-center gap-4'>
              <Image
                src={user.image || FALLBACK_AUTHOR_IMAGE}
                alt={user.name}
                width={60}
                height={60}
                className='rounded-full'
              />
              <div>
                <h1 className='text-xl font-bold'>{user.name}</h1>
                <p className='text-sm text-neutral-600'>{user.headline}</p>
              </div>
            </div>
          ) : (
            <p>User not found.</p>
          )}
          <p className='text-sm text-neutral-700'>
            {userPosts?.length || 0} Posts
          </p>
          <div className='flex flex-col gap-4'>
            {userPosts?.map((post) => <PostCard key={post.id} {...post} />)}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
