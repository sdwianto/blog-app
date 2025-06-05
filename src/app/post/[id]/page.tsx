// src/app/post/[id]/page.tsx
'use client';

import { Icon } from '@iconify/react';
import { useQuery } from '@tanstack/react-query';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React from 'react';

import { FALLBACK_AUTHOR_IMAGE } from '@/components/post/PostCard';

import Footer from '@/app/home/partials/footer';
import Navbar from '@/app/home/partials/navbar';
import { getCommentsByPost } from '@/lib/api/comments';
import { getPostById, getPostLikes } from '@/lib/api/posts';
import { Post } from '@/types/post';

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: post } = useQuery<Post | undefined>({
    queryKey: ['post', id],
    queryFn: () => getPostById(Number(id)),
  });

  const { data: comments } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => getCommentsByPost(Number(id)),
  });

  const { data: likes } = useQuery({
    queryKey: ['likes', id],
    queryFn: () => getPostLikes(Number(id)),
    enabled: !!post,
  });

  return (
    <>
      <Navbar />
      <div className='custom-container mt-24 flex flex-col gap-6 border border-red-500'>
        {post ? (
          <div className='flex flex-col gap-4 border border-yellow-500'>
            <div className='flex flex-col gap-4 border border-blue-500'>
              <h1 className='text-2xl font-bold'>{post?.title}</h1>
              <div className='flex gap-1'>
                {post?.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className='rounded-md border border-neutral-300 px-2 py-0.5 text-xs'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className='flex items-center gap-2 text-sm text-neutral-700'>
              <div>
                <div className='flex items-center gap-2'>
                  <Image
                    src={post.author?.image || FALLBACK_AUTHOR_IMAGE}
                    alt={post.author?.name}
                    width={40}
                    height={40}
                    className='rounded-full'
                  />
                  <p className='text-xl text-neutral-900'>
                    {post.author?.name}
                  </p>
                </div>
                <Icon
                  icon='ion:ellipse'
                  width='4'
                  height='4'
                  className='text-neutral-400'
                />
                <p className='font-regular text-sm text-neutral-600'>
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className='flex items-center gap-5 text-neutral-600'>
                <div className='flex items-center gap-1.5'>
                  <ThumbsUp /> {likes?.length}
                </div>
                <div className='flex items-center gap-1.5'>
                  <MessageSquare /> {post?.commentsCount}
                </div>
              </div>
            </div>
            {post?.imageUrl ? (
              <Image
                src={post?.imageUrl}
                alt={post?.title}
                width={800}
                height={400}
                className='rounded-lg object-cover'
              />
            ) : null}
            <p className='mt-4 text-neutral-700'>{post?.content}</p>
          </div>
        ) : (
          <p>Loading post yaaaa...</p>
        )}
        <hr className='border-t border-neutral-300' />

        <div className='gap-4 border border-blue-200'>
          <h2 className='text-display-xs font-bold text-neutral-900'>
            Comments ({comments?.length})
          </h2>
          <div className='flex items-center gap-2'>
            <Image
              src={comments?.[0]?.author?.image || FALLBACK_AUTHOR_IMAGE}
              alt={comments?.[0]?.author?.name || 'Author profile picture'}
              width={40}
              height={40}
              className='rounded-full'
            />
            <p className='text-sm font-medium'>{comments?.[0]?.author?.name}</p>
          </div>
          <div className='flex flex-col gap-1'>
            <p className='text-sm font-semibold text-neutral-950'>
              Give your Comments
            </p>
            <textarea
              className='w-full rounded-xl border border-neutral-300 p-4 placeholder:text-neutral-500'
              placeholder='Enter your comments'
              onClick={(e: any) => {
                e.target.value = '';
              }}
            />
          </div>
          <div className='flex justify-end'>
            <button
              className='bg-primary-300 mt-4 w-51 cursor-pointer rounded-full p-2 text-sm font-medium text-white'
              onClick={(e) => {
                const textArea =
                  e.currentTarget.parentElement!.querySelector('textarea');
                if (textArea) {
                  const comment = textArea.value;
                  if (comment) {
                    setComments((prev: any) => [
                      ...prev,
                      {
                        author: { name: 'You' },
                        content: comment,
                        id: Date.now(),
                      },
                    ]);
                    textArea.value = '';
                  }
                }
              }}
            >
              Send
            </button>
          </div>
        </div>
        <hr className='border-t border-neutral-300' />
        <div className='gap-4 border border-blue-200'>
          {comments?.length ? (
            <div className='mt-4 flex flex-col gap-4 border border-green-200'>
              {comments.map((c: any) => (
                <React.Fragment key={c.id}>
                  <div className='border border-neutral-300'>
                    <p className='text-sm font-medium'>{c.author?.name}</p>
                    <p className='text-sm text-neutral-700'>{c.content}</p>
                  </div>
                  <hr className='border-t border-neutral-300' />
                </React.Fragment>
              ))}
            </div>
          ) : (
            <p className='mt-2 text-neutral-500'>No comments yet.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
