// src/app/register/page.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';

import { register as registerApi } from '@/lib/api/auth';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: RegisterForm) =>
      registerApi(data.name, data.email, data.password),
    onSuccess: () => {
      router.push('/login');
    },
    onError: (err: any) => {
      alert(err.message || 'Registration failed');
    },
  });

  const onSubmit = (data: RegisterForm) => {
    mutation.mutate(data);
  };

  return (
    <div className='custom-container flex min-h-screen items-center justify-center'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex w-[345px] flex-col gap-5 rounded-xl border border-neutral-200 p-6 md:w-[360px]'
      >
        <p className='text-xl font-semibold'>Sign Up</p>

        <div>
          <p>Name</p>
          <input
            className='w-full rounded-xl border border-neutral-200 p-2'
            type='text'
            placeholder='Enter your name'
            {...register('name')}
          />
          {errors.name && (
            <p className='text-sm text-red-500'>{errors.name.message}</p>
          )}
        </div>

        <div>
          <p>Email</p>
          <input
            className='w-full rounded-xl border border-neutral-200 p-2'
            type='email'
            placeholder='Enter your email'
            {...register('email')}
          />
          {errors.email && (
            <p className='text-sm text-red-500'>{errors.email.message}</p>
          )}
        </div>

        <div>
          <p>Password</p>
          <input
            className='w-full rounded-xl border border-neutral-200 p-2'
            type='password'
            placeholder='Enter your password'
            {...register('password')}
          />
          {errors.password && (
            <p className='text-sm text-red-500'>{errors.password.message}</p>
          )}
        </div>

        <div>
          <p>Confirm Password</p>
          <input
            className='w-full rounded-xl border border-neutral-200 p-2'
            type='password'
            placeholder='Enter your confirm password'
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className='text-sm text-red-500'>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button className='w-full' type='submit' disabled={mutation.isPending}>
          {mutation.isPending ? 'Registering...' : 'Register'}
        </Button>

        <p className='text-center text-sm'>
          Already have an account?{' '}
          <a href='/login' className='text-blue-600 hover:underline'>
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
