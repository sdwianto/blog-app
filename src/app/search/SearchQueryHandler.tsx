'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { redirect, useSearchParams } from 'next/navigation';

import { PostCard } from '@/components/post/PostCard';
import { Button } from '@/components/ui/Button';

import { searchPosts } from '@/lib/api/posts';

export default function SearchQueryHandler() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  if (!query) redirect('/');

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchPosts(query),
    enabled: !!query,
  });

  return (
    <div className='custom-container mt-24 mb-77.25'>
      <h1 className='text-display-sm mb-6 font-bold text-neutral-900'>
        Result for:{' '}
        <span className='text-neutral-900'>{'"' + query + '"'}</span>
      </h1>
      {isLoading ? (
        <div className='flex min-h-[200px] items-center justify-center'>
          Loading...
        </div>
      ) : !data?.posts?.length ? (
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
      ) : (
        <div className='mt-87 flex flex-col items-center gap-6'>
          {data.data.map((post: any) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      )}
    </div>
  );
}
