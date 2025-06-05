// src/components/post/PostForm.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';

import { createPost, updatePost } from '@/lib/api/posts';

const postSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
  tags: z.string(), // comma-separated
  image: z.any(),
});

type PostFormProps = {
  mode: 'create' | 'edit';
  initialData?: any;
  postId?: number;
};

export const PostForm = ({ mode, initialData, postId }: PostFormProps) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: initialData || {},
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      data.tags
        .split(',')
        .forEach((tag: string) => formData.append('tags', tag.trim()));
      if (data.image[0]) formData.append('image', data.image[0]);

      if (mode === 'create') return createPost(formData);
      return updatePost(postId!, formData);
    },
    onSuccess: () => router.push('/'),
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className='flex flex-col gap-4'
    >
      <input {...register('title')} placeholder='Title' className='input' />
      {errors.title && (
        <p className='text-red-500'>{errors.title.message as string}</p>
      )}

      <textarea
        {...register('content')}
        placeholder='Content'
        className='input min-h-[120px]'
      />
      {errors.content?.message && (
        <p className='text-red-500'>{errors.content.message as string}</p>
      )}

      <input
        {...register('tags')}
        placeholder='Tags (comma-separated)'
        className='input'
      />
      <input type='file' {...register('image')} />

      <Button type='submit' disabled={mutation.isPending}>
        {mode === 'create' ? 'Publish' : 'Update'}
      </Button>
    </form>
  );
};
