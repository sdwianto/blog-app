// src/app/profile/page.tsx

'use client';

import { useQuery } from '@tanstack/react-query';
import { PenLine } from 'lucide-react';
import Image from 'next/image';
import router from 'next/router';
import React, { useEffect, useState } from 'react';

import { ChangePasswordForm } from '@/components/forms/ChangePasswordForm';
import { EditProfileModal } from '@/components/post/EditProfileModal';
import { FALLBACK_AUTHOR_IMAGE } from '@/components/post/PostCard';
import type { PostCardProps } from '@/components/post/PostCard';
import { PostCardProfile } from '@/components/post/PostCardProfile';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import { getRecommendedPosts } from '@/lib/api/posts';
import { getUserByEmail } from '@/lib/api/users';
import { getProfile } from '@/lib/auth';

import Footer from '../home/partials/footer';
import Navbar from '../home/partials/navbar';

export default function OwnProfilePage() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const profile = getProfile();
    setEmail(profile?.email || null);
  }, []);

  const { data: user } = useQuery({
    queryKey: ['user-self', email],
    queryFn: () => getUserByEmail(email as string),
    enabled: !!email,
  });

  const { data: posts } = useQuery({
    queryKey: ['user-posts', email],
    queryFn: () => getRecommendedPosts(50, 1),
    enabled: !!email,
  });

  const userPosts = posts?.data.filter((p: any) => p.author.email === email);
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Navbar />
      <div className='custom-container mt-32 flex flex-col items-center'>
        <div className='flex w-full max-w-4xl flex-col gap-6 py-6'>
          {/* Profile Header */}
          {user ? (
            <div className='flex-between flex items-center gap-4 rounded-[13px] border border-neutral-300 p-8'>
              <div className='flex items-center gap-3'>
                <Image
                  src={user.image || FALLBACK_AUTHOR_IMAGE}
                  alt={user.name}
                  width={60}
                  height={60}
                  className='rounded-full'
                />
                <div>
                  <h1 className='text-lg font-bold text-neutral-900'>
                    {user.name}
                  </h1>
                  <p className='text-md font-regular text-neutral-600'>
                    {user.headline || 'No headline'}
                  </p>
                </div>
              </div>
              <p
                onClick={() => setShowModal(true)}
                className='text-sm-semibold text-primary-300 cursor-pointer underline'
              >
                Edit Profile
              </p>
            </div>
          ) : (
            <p>Loading user profile...</p>
          )}

          {/* Tabs */}
          <Tabs defaultValue='posts' className='w-full'>
            <TabsList>
              <TabsTrigger className='w-44' value='posts'>
                Your Post
              </TabsTrigger>
              <TabsTrigger className='w-44' value='password'>
                Change Password
              </TabsTrigger>
            </TabsList>
            <hr className='border-t border-neutral-300' />
            {/* Posts Tab */}
            <TabsContent value='posts' className='border border-green-300 pt-6'>
              {userPosts?.length ? (
                <>
                  {userPosts?.length > 0 && (
                    <div className='flex w-full items-center justify-between'>
                      <p className='display-xs-bold text-neutral-900'>
                        {userPosts?.length} Posts
                      </p>
                      <Button
                        className='w-50 gap-2 rounded-full p-2'
                        onClick={() => router.push('/write')}
                      >
                        <PenLine className='h-6 w-6' />
                        Write Post
                      </Button>
                    </div>
                  )}
                  <div className='flex flex-col gap-4'>
                    {userPosts.map((post: PostCardProps, index: number) => (
                      <React.Fragment key={post.id}>
                        <PostCardProfile {...post} />
                        {index < userPosts.length - 1 && (
                          <hr className='border-t border-neutral-300' />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </>
              ) : (
                <div className='flex flex-col items-center gap-6'>
                  <Image
                    src='/icons/notFound.svg'
                    alt='No Post'
                    width={118.12}
                    height={135}
                  />
                  <div className='flex flex-col gap-1 text-center'>
                    <p className='text-sm-semibold text-neutral-950'>
                      Your writing journey starts here
                    </p>
                    <p className='text-sm-regular text-neutral-600'>
                      No posts yet, but every great writer starts with the first
                      one.
                    </p>
                  </div>
                  <Button
                    className='w-50 gap-2 rounded-full p-2'
                    onClick={() => router.push('/write')}
                  >
                    <PenLine className='h-6 w-6' />
                    Write Post
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Change Password Tab */}
            <TabsContent value='password'>
              <ChangePasswordForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>{' '}
      {showModal && <EditProfileModal onClose={() => setShowModal(false)} />}
      <Footer />
    </>
  );
}
