// src/components/post/PostForm.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { CloudUpload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import LexicalRichTextEditor from '@/components/ui/LexicalRichTextEditor';

import { createPost, updatePost } from '@/lib/api/posts';

const postSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  content: z.string().min(10, 'Content must be at least 10 characters long'),
  tags: z.string().min(1, 'Tags is required'),
  image: z
    .union([z.instanceof(File), z.undefined()])
    .optional()
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: 'Max image size is 5MB',
    }),
});

type PostFormValues = z.infer<typeof postSchema>;

type PostFormProps = {
  mode: 'create' | 'edit';
  initialData?: Partial<PostFormValues>;
  postId?: number;
};

export const PostForm = ({ mode, initialData, postId }: PostFormProps) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    watch,
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      tags: initialData?.tags || '',
      image: undefined,
    },
  });

  const imageFile = watch('image');

  const mutation = useMutation({
    mutationFn: async (data: PostFormValues) => {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      data.tags
        .split(',')
        .map((tag) => tag.trim())
        .forEach((tag) => formData.append('tags', tag));
      if (data.image) formData.append('image', data.image);

      return mode === 'create'
        ? createPost(formData)
        : updatePost(postId!, formData);
    },
    onSuccess: () => router.push('/'),
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className='flex flex-col gap-4'
    >
      {/* Title */}
      <div className='flex flex-col gap-1'>
        <p className='text-sm-semibold text-neutral-950'>Title</p>
        <input
          {...register('title')}
          placeholder='Enter your title'
          className='input rounded-xl border border-neutral-300 px-4 py-2'
        />
        {errors.title && <p className='text-red-500'>{errors.title.message}</p>}
      </div>

      {/* Lexical Editor for Content */}
      <div className='flex flex-col gap-1.5'>
        <p className='text-sm-semibold text-neutral-950'>Content</p>
        <Controller
          control={control}
          name='content'
          render={({ field }) => (
            <LexicalRichTextEditor
              initialContent={field.value}
              onChange={(value) => setValue('content', value)}
            />
          )}
        />
        {errors.content && (
          <p className='text-red-500'>{errors.content.message}</p>
        )}
      </div>

      {/* Cover Image */}
      <div className='flex flex-col gap-1.5'>
        <p className='text-sm-semibold text-neutral-950'>Cover Image</p>
        <div className='gap-1 rounded-xl border border-dashed border-neutral-300 px-8 py-4'>
          <div className='flex flex-col items-center justify-center gap-3'>
            <CloudUpload
              className='h-10 w-10 cursor-pointer rounded-md border border-neutral-300 p-2 text-neutral-950'
              onClick={() => fileInputRef.current?.click()}
            />
            <input
              type='file'
              ref={fileInputRef}
              accept='image/*'
              className='hidden'
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setValue('image', file);
                }
              }}
            />
            <div className='flex-between flex items-center gap-1'>
              <p className='text-sm-semibold text-primary-300'>
                Click to upload
              </p>
              <p className='text-xs-regular text-neutral-700'>
                or drag and drop
              </p>
            </div>
            <p className='text-xs-regular text-neutral-700'>
              PNG or JPG (max. 5MB)
            </p>
            {imageFile && (
              <p className='text-xs text-neutral-600'>
                Selected: {imageFile.name}
              </p>
            )}
            {errors.image && (
              <p className='text-red-500'>{errors.image.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className='flex flex-col gap-1'>
        <p className='text-sm-semibold text-neutral-950'>Tags</p>
        <input
          {...register('tags')}
          placeholder='Tags (comma-separated)'
          className='input rounded-xl border border-neutral-300 px-4 py-2'
        />
        {errors.tags && <p className='text-red-500'>{errors.tags.message}</p>}
      </div>

      {/* Submit Button */}
      <div className='flex justify-end'>
        <Button
          type='submit'
          disabled={mutation.isPending}
          className='h-11 w-66.25'
        >
          {mode === 'create' ? 'Finish' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default PostForm;
