// src/app/search/page.tsx
'use client';
export const dynamic = 'force-dynamic';
import { Suspense } from 'react';

import SearchContent from './SearchContent';
import SearchQueryHandler from './SearchQueryHandler';
import Footer from '../home/partials/footer';
import Navbar from '../home/partials/navbar';

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <SearchQueryHandler />
        <SearchContent />
      </Suspense>
      <Footer />
    </>
  );
}
