// src/app/profile/me/change-password/page.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

import { changePassword } from '@/lib/api/users';

const schema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New passwords do not match',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

export function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await changePassword(data);
      alert('Password changed successfully');
    } catch {
      alert('Failed to change password');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='max-w-md space-y-4'>
      <div>
        <Label className='text-sm font-semibold text-neutral-950'>
          Current Password
        </Label>
        <Input
          type='password'
          {...register('currentPassword')}
          placeholder='Enter current password'
          className='text-sm-regular w-full gap-2 rounded-xl border border-neutral-300 px-4 py-2 text-neutral-500 placeholder:text-neutral-500'
        />
        {errors.currentPassword && (
          <p className='text-sm text-red-500'>
            {errors.currentPassword.message}
          </p>
        )}
      </div>
      <div>
        <Label className='text-sm font-semibold text-neutral-950'>
          New Password
        </Label>
        <Input
          type='password'
          {...register('newPassword')}
          placeholder='Enter new password'
          className='text-sm-regular w-full gap-2 rounded-xl border border-neutral-300 px-4 py-2 text-neutral-500 placeholder:text-neutral-500'
        />
        {errors.newPassword && (
          <p className='text-sm text-red-500'>{errors.newPassword.message}</p>
        )}
      </div>
      <div>
        <Label className='text-sm font-semibold text-neutral-950'>
          Confirm New Password
        </Label>
        <Input
          type='password'
          {...register('confirmPassword')}
          placeholder='Enter confirm new password'
          className='text-sm-regular w-full gap-2 rounded-xl border border-neutral-300 px-4 py-2 text-neutral-500 placeholder:text-neutral-500'
        />
        {errors.confirmPassword && (
          <p className='text-sm text-red-500'>
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      <Button type='submit' className='mt-2' disabled={isSubmitting}>
        <span className='inline-block min-w-[6rem] text-center'>
          {isSubmitting ? 'Saving...' : 'Change Password'}
        </span>
      </Button>
    </form>
  );
}
