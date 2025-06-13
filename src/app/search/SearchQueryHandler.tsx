// src/app/search/SearchQueryHandler.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { redirect, useSearchParams } from 'next/navigation';

import { PostCard } from '@/components/post/PostCard';
import { Button } from '@/components/ui/Button';

import { searchPosts } from '@/lib/api/posts';

export default function SearchQueryHandler() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  if (!query) redirect('/');

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchPosts(query),
    enabled: !!query,
  });

  const searchResults = data?.data ?? [];

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='mb-6 text-3xl font-bold'>Search Results</h1>

      <p className='mb-4 text-gray-600'>
        Showing results for: <strong>{query}</strong>
      </p>

      {isLoading ? (
        <div className='flex items-center justify-center p-4'>
          <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900'></div>
        </div>
      ) : searchResults.length === 0 ? (
        <div className='mt-20 flex flex-col items-center gap-6'>
          <Image
            src='/icons/notFound.svg'
            alt='not-found'
            width={118}
            height={135}
          />
          <p className='text-gray-500'>No results found for ${query}</p>
          <Button
            onClick={() => redirect('/')}
            className='text-neutral-25 text-sm font-medium'
          >
            Back to Home
          </Button>
        </div>
      ) : (
        <div className='w-full overflow-hidden'>
          <div className='grid grid-cols-1 gap-6'>
            {searchResults.map((post: any) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>{' '}
        </div>
      )}
    </div>
  );
}
