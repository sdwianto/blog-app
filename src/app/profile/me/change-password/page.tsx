'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { changePassword } from '@/lib/api/users';
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';

const schema = z
  .object({
    currentPassword: z.string(),
    newPassword: z.string().min(6),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function ChangePasswordPage() {
  useAuthGuard();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: any) => changePassword(data),
    onSuccess: () => router.push('/profile/me'),
  });

  return (
    <div className='custom-container mt-24'>
      <h1 className='mb-4 text-2xl font-bold'>Change Password</h1>
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className='flex flex-col gap-4'
      >
        <input
          {...register('currentPassword')}
          placeholder='Current Password'
          type='password'
          className='input'
        />
        <input
          {...register('newPassword')}
          placeholder='New Password'
          type='password'
          className='input'
        />
        <input
          {...register('confirmPassword')}
          placeholder='Confirm Password'
          type='password'
          className='input'
        />
        {errors.confirmPassword && (
          <p className='text-sm text-red-500'>
            {errors.confirmPassword.message}
          </p>
        )}
        <button className='btn btn-primary'>Save</button>
      </form>
    </div>
  );
}
