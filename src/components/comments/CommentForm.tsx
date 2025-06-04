// src/components/comments/CommentForm.tsx

'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { postComment } from '@/lib/api/comments';

export const CommentForm = ({
  postId,
  userId,
}: {
  postId: number;
  userId: number;
}) => {
  const [content, setContent] = useState('');
  const mutation = useMutation({
    mutationFn: () => postComment(postId, userId, content),
    onSuccess: () => setContent(''),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
      className='mt-4 flex flex-col gap-2'
    >
      <textarea
        className='input min-h-[80px]'
        placeholder='Write a comment...'
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type='submit' className='btn btn-primary'>
        Post Comment
      </button>
    </form>
  );
};
