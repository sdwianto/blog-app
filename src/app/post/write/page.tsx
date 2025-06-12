// src/app/post/write/page.tsx
'use client';

import PostForm from '@/components/post/PostForm';

import Footer from '@/app/home/partials/footer';
import WriteNavbar from '@/app/home/partials/writeNavbar';
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';

export default function WritePostPage() {
  useAuthGuard();
  return (
    <>
      <WriteNavbar title='Write Post' />
      <div className='custom-container mt-32'>
        <div className='flex items-center justify-center'>
          <div className='flex w-183.5 flex-col gap-5'>
            <PostForm mode='create' />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
