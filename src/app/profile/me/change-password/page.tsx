// src/app/profile/me/change-password/page.tsx
'use client';

import { ChangePasswordForm } from '@/components/forms/ChangePasswordForm';

export default function ChangePasswordPage() {
  return (
    <div className='custom-container flex min-h-screen items-center justify-center'>
      <ChangePasswordForm />
    </div>
  );
}
