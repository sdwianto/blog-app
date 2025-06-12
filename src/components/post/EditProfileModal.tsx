'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';

import { getUserByEmail, updateProfile } from '@/lib/api/users';

const schema = z.object({
  name: z.string().min(2),
  headline: z.string().optional(),
  avatar: z.any().optional(),
});

type EditProfileModalProps = {
  onClose: () => void;
};

export function EditProfileModal({ onClose }: EditProfileModalProps) {
  const [email, setEmail] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEmail(localStorage.getItem('userEmail'));
  }, []);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (form: any) => {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('headline', form.headline);
      if (form.avatar && form.avatar.length > 0) {
        formData.append('avatar', form.avatar[0]);
      }
      return updateProfile(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me', email] as const });
      onClose();
    },
  });

  const { data: user } = useQuery({
    queryKey: ['me', email],
    queryFn: () => getUserByEmail(email || ''),
    enabled: !!email,
  });

  const { register, handleSubmit, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      headline: '',
      avatar: [],
    },
  });

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('headline', user.headline || '');
    }
  }, [user, setValue]);

  const handleImageError = () => {
    console.error('❌ Image failed to load');
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='relative flex w-[450px] flex-col gap-5 rounded-2xl border border-neutral-300 bg-white p-6'>
        <button
          onClick={onClose}
          className='absolute top-6 right-6 text-neutral-950'
          aria-label='close modal'
        >
          <X className='h-6 w-6 text-neutral-950' />
        </button>

        <h1 className='text-xl-bold'>Edit Profile</h1>

        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className='gap-4 space-y-4'
        >
          <div className='flex flex-col items-center gap-2'>
            <div
              onClick={() => fileInputRef.current?.click()}
              className='relative flex h-16 w-16 items-center justify-center'
            >
              <Image
                src={
                  user?.image
                    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${user.image}`
                    : '/images/marco.png'
                }
                alt={user?.name || 'Profile avatar'}
                width={60}
                height={60}
                className='cursor-pointer rounded-full object-cover'
                onError={handleImageError}
              />

              <Image
                src='/icons/camera.svg'
                alt='Camera'
                width={24}
                height={24}
                className='absolute right-0 bottom-0 cursor-pointer'
              />
              <input
                type='file'
                {...register('avatar')}
                className='hidden'
                ref={fileInputRef}
              />
            </div>
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='name' className='text-sm-semibold text-neutral-950'>
              Name
            </label>
            <input
              {...register('name')}
              placeholder='John Doe'
              className='w-full rounded-xl border border-neutral-300 px-4 py-2 text-neutral-950 placeholder:text-neutral-600'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label
              htmlFor='headline'
              className='text-sm-semibold text-neutral-950'
            >
              Profile Headline
            </label>
            <input
              {...register('headline')}
              placeholder='Frontend Developer'
              className='w-full rounded-xl border border-neutral-300 px-4 py-2 text-neutral-950 placeholder:text-neutral-600'
            />
          </div>

          <Button type='submit' className='mt-5 h-11 w-full rounded-full p-2'>
            Update Profile
          </Button>
        </form>
      </div>
    </div>
  );
}
