'use client';

import { Icon } from '@iconify/react';
import { Cat, PenLine, Search } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

const Navbar = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Cek token
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Handle ketika user enter di input search
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim() !== '') {
      router.push(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.refresh();
  };

  return (
    <header className='fixed top-0 right-0 left-0 z-50 w-full border-b border-neutral-300 bg-white'>
      <div className='flex-between custom-container h-16 md:h-20'>
        {/* Logo */}
        <div className='flex-between h-9 gap-2.5'>
          <Image
            src='/icons/logo-symbol.svg'
            alt='logo'
            width={30}
            height={32}
          />
          <p className='text-display-xs font-semibold text-neutral-950'>
            Your Logo
          </p>
        </div>

        {/* Search */}
        <div className='relative w-93.25 max-w-sm'>
          <input
            className='w-full rounded-xl border border-neutral-200 px-10 py-2 pl-12'
            type='text'
            placeholder='Search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
          <div className='absolute inset-y-0 left-3 flex items-center'>
            <Search className='h-6 w-6 text-neutral-500' />
          </div>
        </div>

        {/* Auth / Profile */}
        <div className='flex-between h-11 gap-6'>
          {isLoggedIn ? (
            <>
              <div
                className='flex cursor-pointer items-center gap-2'
                onClick={() => router.push('/write')}
              >
                <PenLine className='text-primary-300 h-6 w-6' />
                <button
                  // onClick={handleLogout}
                  className='text-primary-300 text-sm font-medium'
                >
                  Write Post
                </button>
              </div>
              {/* Divider */}
              <div className='h-11 w-px bg-neutral-200'></div>
              <div
                className='relative flex cursor-pointer items-center gap-2'
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {isLoggedIn && localStorage.getItem('image') ? (
                  <Image
                    src={localStorage.getItem('image') || ''}
                    alt={localStorage.getItem('name') || 'Profile'}
                    width={40}
                    height={40}
                    className='rounded-full'
                    unoptimized
                  />
                ) : (
                  <Cat className='h-10 w-10 text-neutral-500' />
                )}
                <p className='text-sm font-medium text-neutral-900 opacity-100'>
                  {isLoggedIn
                    ? (localStorage.getItem('name') ?? 'Profile')
                    : 'Profile'}
                </p>
                {isDropdownOpen && (
                  <div className='absolute top-full right-0 mt-2 w-45.5 rounded-xl border border-neutral-300 bg-white shadow-md'>
                    <div className='flex items-center gap-2 p-2'>
                      <Icon
                        icon='iconoir:profile-circle'
                        width='20'
                        height='20'
                      />
                      <p className='font-reguler text-sm text-neutral-950'>
                        Profile
                      </p>
                    </div>
                    <div className='flex items-center gap-2 p-2'>
                      <Icon
                        icon='streamline-sharp:logout-2'
                        width='20'
                        height='20'
                      />
                      <button
                        onClick={handleLogout}
                        className='font-reguler w-full text-left text-sm text-neutral-950 hover:text-red-500'
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button onClick={() => router.push('/login')}>Login</button>
              <Button onClick={() => router.push('/register')}>Register</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
