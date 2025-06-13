//src/app/search/SearchContent.tsx
'use client';

interface SearchContentProps {
  query?: string;
  searchResults?: any[];
  isLoading?: boolean;
}

export default function SearchContent({
  query,
  searchResults = [],
  isLoading = false,
}: SearchContentProps) {
  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='mb-6 text-3xl font-bold'>Search Results</h1>

      {query ? (
        <div className='rounded-lg bg-white p-6 shadow-md'>
          <p className='mb-4 text-gray-600'>
            Showing results for: &quot;{query}&quot;
          </p>

          {isLoading ? (
            <div className='flex items-center justify-center p-4'>
              <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900'></div>
            </div>
          ) : searchResults.length === 0 ? (
            <p className='text-gray-500'>
              No results found for &quot;{query}&quot;
            </p>
          ) : (
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {searchResults.map((result, index) => (
                <div key={index} className='rounded-lg bg-white p-4 shadow-md'>
                  <h3 className='mb-2 text-lg font-semibold'>{result.title}</h3>
                  <p className='text-gray-600'>{result.excerpt}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className='text-gray-500'>Enter a search term to find posts.</p>
      )}
    </div>
  );
}
