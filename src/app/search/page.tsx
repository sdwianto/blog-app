// src/app/search/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import { PostCard } from '@/components/post/PostCard';
import { Button } from '@/components/ui/Button';

import Footer from '../home/partials/footer';
import Navbar from '../home/partials/navbar';

import { searchPosts } from '@/lib/api/posts';

export default function SearchPage() {
  const params = useSearchParams();
  const query = params.get('query') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchPosts(query),
    enabled: !!query,
  });

  return (
    <>
      <Navbar />
      <div className='custom-container mt-24 mb-77.25'>
        <h1 className='text-display-sm mb-6 font-bold text-neutral-900'>
          Result for:{' '}
          <span className='text-neutral-900'>{'"' + query + '"'}</span>
        </h1>

        {isLoading ? (
          <p>Loading search results...</p>
        ) : data?.data?.length ? (
          <div className='flex flex-col gap-6'>
            {data.data.map((post: any) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        ) : (
          <div className='mt-87 flex flex-col items-center gap-6'>
            <Image
              src='/icons/notFound.svg'
              alt='not-found'
              width={118}
              height={135}
            />
            <div className='flex flex-col items-center gap-2'>
              <p className='text-sm font-semibold text-neutral-950'>
                No results found
              </p>
              <p className='font-regular text-sm text-neutral-950'>
                Try using different keywords.
              </p>
            </div>
            <Button className='text-neutral-25 text-sm font-medium'>
              Back to Home
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
