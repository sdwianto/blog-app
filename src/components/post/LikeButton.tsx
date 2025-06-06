// src/components/post/LikeButton.tsx
'use client';

import { useMutation } from '@tanstack/react-query';

import { likePost } from '@/lib/api/posts';

import { Button } from '../ui/Button';

export const LikeButton = ({ postId }: { postId: number }) => {
  const mutation = useMutation({
    mutationFn: () => likePost(postId),
    onSuccess: () => window.location.reload(),
  });

  return (
    <Button
      className='text-sm text-blue-600 underline'
      onClick={() => mutation.mutate()}
    >
      👍 Like
    </Button>
  );
};
