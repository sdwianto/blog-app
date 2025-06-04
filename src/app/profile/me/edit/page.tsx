'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { getUserByEmail, updateProfile } from '@/lib/api/users';
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';

const schema = z.object({
  name: z.string().min(2),
  headline: z.string().optional(),
  avatar: z.any().optional(),
});

export default function EditProfilePage() {
  useAuthGuard();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    setEmail(localStorage.getItem('userEmail'));
  }, []);

  const { data: user } = useQuery({
    queryKey: ['me', email],
    queryFn: () => getUserByEmail(email || ''),
    enabled: !!email,
  });

  const { register, handleSubmit, setValue } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('headline', user.headline || '');
    }
  }, [user, setValue]);

  const mutation = useMutation({
    mutationFn: (form: any) => {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('headline', form.headline);
      if (form.avatar[0]) formData.append('avatar', form.avatar[0]);
      return updateProfile(formData);
    },
    onSuccess: () => router.push('/profile/me'),
  });

  return (
    <div className='custom-container mt-24'>
      <h1 className='mb-4 text-2xl font-bold'>Edit Profile</h1>
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className='flex flex-col gap-4'
      >
        <input {...register('name')} placeholder='Name' className='input' />
        <input
          {...register('headline')}
          placeholder='Headline'
          className='input'
        />
        <input type='file' {...register('avatar')} />
        <button className='btn btn-primary'>Save</button>
      </form>
    </div>
  );
}
