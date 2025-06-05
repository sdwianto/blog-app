import React from 'react';

import { Button } from '@/components/ui/button';

const Register = () => {
  return (
    <div className='custom-container flex min-h-screen items-center justify-center'>
      <div className='flex w-[345px] flex-col gap-5 rounded-xl border border-neutral-200 p-6 md:w-[360px]'>
        <p>Sign Up</p>
        <div>
          <p>Name</p>
          <input
            className='w-full rounded-xl border border-neutral-200 p-2'
            type='text'
            placeholder='Enter your name'
          />
        </div>
        <div>
          <p>Email</p>
          <input
            className='w-full rounded-xl border border-neutral-200 p-2'
            type='text'
            placeholder='Enter your email'
          />
        </div>
        <div>
          <p>Password</p>
          <input
            className='w-full rounded-xl border border-neutral-200 p-2'
            type='password'
            placeholder='Enter your password'
          />
        </div>
        <div>
          <p>Confirm Password</p>
          <input
            className='w-full rounded-xl border border-neutral-200 p-2'
            type='password'
            placeholder='Enter your confirm password'
          />
        </div>
        <Button className='w-full'>Register</Button>
        <p>
          Already have an account?{' '}
          <span className='text-primary-300'>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
