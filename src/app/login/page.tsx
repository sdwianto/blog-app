'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';

import { login } from '@/lib/api/auth';
import { getUserByEmail } from '@/lib/api/users';
import { setProfile } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await login(data.email, data.password);
      return response;
    },
    onSuccess: async (data) => {
      localStorage.setItem('token', data.token);
      const decoded: { email: string } = jwtDecode(data.token);
      const user = await getUserByEmail(decoded.email);
      console.log('user:', user);
      console.log('login response:', data);
      // Store profile data from login response
      setProfile({
        name: user.name,
        email: user.email,
        image: user.image,
      });
      router.push('/');
    },
    onError: (err: any) => {
      alert(err.message || 'Login gagal');
    },
  });

  const onSubmit = (data: LoginForm) => {
    mutation.mutate(data);
  };

  return (
    <div className='custom-container flex min-h-screen items-center justify-center'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex w-[345px] flex-col gap-5 rounded-xl border border-neutral-200 p-6 md:w-[360px]'
      >
        <p className='text-xl font-semibold'>Sign In</p>

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

        <Button className='w-full' type='submit' disabled={mutation.isPending}>
          <span className='inline-block min-w-[6rem] text-center'>
            {mutation.isPending ? 'Logging in...' : 'Login'}
          </span>
        </Button>

        <p className='text-center text-sm'>
          Don&apos;t have an account?{' '}
          <a href='/register' className='text-blue-600 hover:underline'>
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
