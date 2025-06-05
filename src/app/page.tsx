// src/app/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

import { MostLikedPostCard } from '@/components/post/MostLiked';
import { PostCard } from '@/components/post/PostCard';

import { getMostLikedPosts, getRecommendedPosts } from '@/lib/api/posts';
import type { Post } from '@/types';

import Footer from './home/partials/footer';
import Navbar from './home/partials/navbar';

// Komponen Pagination
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          '...',
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        );
      }
    }

    return pages;
  };

  return (
    <div className='mt-8 flex items-center justify-center gap-2'>
      {/* Previous Button */}
      <button
        onClick={() => {
          onPageChange(currentPage - 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        disabled={currentPage === 1}
        className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          currentPage === 1
            ? 'cursor-not-allowed bg-neutral-100 text-neutral-400'
            : 'bg-white text-neutral-700 hover:bg-neutral-50'
        }`}
      >
        <div className='flex items-center gap-1.5'>
          <ChevronLeft />
          Previous
        </div>
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className='px-3 py-2 text-neutral-500'>...</span>
          ) : (
            <button
              onClick={() =>
                typeof page === 'number' ? onPageChange(page) : undefined
              }
              className={`flex h-12 w-12 items-center justify-center rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-primary-300 text-white'
                  : 'bg-white text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          currentPage === totalPages
            ? 'cursor-not-allowed bg-neutral-100 text-neutral-400'
            : 'bg-white text-neutral-700 hover:bg-neutral-50'
        }`}
      >
        <div className='flex items-center gap-1.5'>
          Next
          <ChevronRight />
        </div>
      </button>
    </div>
  );
};

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch data berdasarkan halaman aktif
  const { data: recommended, isLoading: loadingRecommended } = useQuery({
    queryKey: ['recommended-posts', currentPage],
    queryFn: () => getRecommendedPosts(itemsPerPage, currentPage),
  });

  const { data: mostLiked, isLoading: loadingMostLiked } = useQuery({
    queryKey: ['most-liked-posts'],
    queryFn: () => getMostLikedPosts(10, 1),
  });

  // Hitung total halaman dari API response
  const totalPages = recommended?.lastPage || 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll ke top saat ganti halaman
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />
      <div className='custom-container mt-24 grid grid-cols-1 gap-8 md:grid-cols-3'>
        {/* Left column - Recommended with Pagination */}
        <div className='col-span-2 flex flex-col gap-6'>
          <h1 className='text-display-sm font-bold text-neutral-900'>
            Recommended for you
          </h1>

          {loadingRecommended ? (
            <p>Loading recommended...</p>
          ) : (
            <>
              {/* Render posts langsung dari API */}
              {recommended?.data.map((post: any, index: number) => (
                <React.Fragment key={post.id}>
                  <PostCard {...post} />
                  {index !== recommended.data.length - 1 && (
                    <hr className='border-t border-neutral-200' />
                  )}
                </React.Fragment>
              ))}

              {/* Pagination Component */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}

          {/* Total post info */}
          <p>total post: {recommended?.total}</p>
        </div>

        {/* Right column - Most liked */}
        <div className='flex flex-col gap-6'>
          <h1 className='text-display-xs font-bold text-neutral-900'>
            Most liked
          </h1>
          {loadingMostLiked ? (
            <p>Loading most liked...</p>
          ) : (
            mostLiked?.data
              .sort((a: Post, b: Post) => b.likes - a.likes)
              .slice(0, 3)
              .map((post: any, index: number) => (
                <React.Fragment key={post.id}>
                  <MostLikedPostCard {...post} hideImage />
                  {index !== mostLiked.data.length - 1 && (
                    <hr className='border-t border-neutral-200' />
                  )}
                </React.Fragment>
              ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
