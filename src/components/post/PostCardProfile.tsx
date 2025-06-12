// src/components/post/PostCardProfile.tsx
'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { DeleteProfileModal } from './DeleteProfileModal';

import { deleteProfile } from '@/lib/api/users';

export type PostCardProfileProps = {
  title: string;
  content: string;
  tags: string[];
  imageUrl: string;
  createdAt: string;
  updatedAt?: string;
};

// Fallback author image URL
export const FALLBACK_AUTHOR_IMAGE = '/images/John_doe.png';

export const PostCardProfile = ({
  title,
  content,
  tags,
  imageUrl,
  createdAt,
  updatedAt,
}: PostCardProfileProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Tanggal tidak valid';
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  const handleDelete = async () => {
    try {
      await deleteProfile();
      toast.success('Profile deleted');
      setShowDeleteModal(false);
      localStorage.clear();
      window.location.href = '/'; // Redirect ke home atau login
    } catch {
      toast.error('Failed to delete profile');
    }
  };

  return (
    <>
      <div className='flex gap-6'>
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
            <p className='font-regular text-sm text-neutral-600'>
              {formatDate(createdAt)}
            </p>
            {updatedAt && (
              <p className='font-regular text-sm text-neutral-600'>
                {formatDate(updatedAt)}
              </p>
            )}
          </div>
          <div className='flex items-center gap-3'>
            <p className='text-sm-semibold text-primary-300 cursor-pointer underline'>
              Statistic
            </p>
            <p className='text-sm-semibold text-primary-300 cursor-pointer underline'>
              Edit
            </p>
            <p
              onClick={() => setShowDeleteModal(true)}
              className='text-sm-semibold text-primary-300 cursor-pointer underline'
            >
              Delete
            </p>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteProfileModal
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};
