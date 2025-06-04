'use client';

import { Icon } from '@iconify/react';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

type PostCardProps = {
  id: number;
  title: string;
  content: string;
  tags: string[];
  imageUrl: string;
  author: {
    name: string;
    image?: string;
  };
  createdAt: string;
  likes: number;
  comments: number;
};

// Fallback author image URL
const FALLBACK_AUTHOR_IMAGE = '/images/default-author.jpg';

export const PostCard = ({
  id,
  title,
  content,
  tags,
  imageUrl,
  author,
  createdAt,
  likes,
  comments,
}: PostCardProps) => {
  return (
    <div
      className='flex cursor-pointer gap-6'
      onClick={() => (window.location.href = `/post/${id}`)}
    >
      <Image
        src={imageUrl}
        alt={title}
        width={340}
        height={258}
        className='rounded-sm object-cover'
      />
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-6'>
          <h2 className='text-xl font-bold text-neutral-900'>{title}</h2>
          <div className='font-regular flex flex-wrap gap-2 text-xs text-neutral-900'>
            {tags.map((tag) => (
              <span
                key={tag}
                className='rounded-md border border-neutral-300 px-2 py-1'
              >
                {tag}
              </span>
            ))}
          </div>
          <p className='font-regular text-sm text-neutral-900'>
            {content?.slice(0, 120)}...
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-2'>
            <Image
              src={author.image || FALLBACK_AUTHOR_IMAGE}
              alt={author.name}
              width={40}
              height={40}
              className='rounded-full'
            />
            <p className='text-xl text-neutral-900'>{author.name}</p>
          </div>
          <Icon
            icon='ion:ellipse'
            width='4'
            height='4'
            className='text-neutral-400'
          />
          <p className='font-regular text-sm text-neutral-600'>
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className='flex items-center gap-5 text-neutral-600'>
          <div className='flex items-center gap-1.5'>
            <ThumbsUp /> {likes}
          </div>
          <div className='flex items-center gap-1.5'>
            <MessageSquare /> {comments}
          </div>
        </div>
      </div>
    </div>
  );
};
