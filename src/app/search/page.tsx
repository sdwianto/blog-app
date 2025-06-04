// src/app/search/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import { PostCard } from '@/components/post/PostCard';

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
    <div className='custom-container mt-24'>
      <h1 className='mb-6 text-xl font-semibold'>
        Search results for: <span className='text-blue-600'>{query}</span>
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
        <p>No results found.</p>
      )}
    </div>
  );
}
