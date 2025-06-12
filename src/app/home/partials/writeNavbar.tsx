'use client';

import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const WriteNavbar = ({ title }: { title?: string }) => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setName(localStorage.getItem('name') || 'Profile');
      setImage(localStorage.getItem('image') || '');
    }
  }, []);

  return (
    <div className='fixed top-0 right-0 left-0 z-50 w-full border-b border-neutral-300 bg-white'>
      <div className='flex-between custom-container h-16 md:h-20'>
        <div className='flex items-center gap-4.25'>
          <ArrowLeft
            className='h-6 w-6 cursor-pointer'
            onClick={() => router.back()}
          />
          <p className='display-xs-bold text-neutral-900'>
            {title || 'Write Post'}
          </p>
        </div>
        <div className='flex items-center gap-3'>
          {image ? (
            <Image
              src={image}
              alt={name}
              width={40}
              height={40}
              className='rounded-full'
              unoptimized
            />
          ) : (
            <div className='h-10 w-10 rounded-full bg-neutral-200' />
          )}
          <p className='text-sm-medium text-neutral-900'>{name}</p>
        </div>
      </div>
    </div>
  );
};

export default WriteNavbar;
