// src/components/profile/DeleteProfileModal.tsx
'use client';

import { X } from 'lucide-react';

type DeleteProfileModalProps = {
  onClose: () => void;
  onDelete: () => void;
};

export function DeleteProfileModal({
  onClose,
  onDelete,
}: DeleteProfileModalProps) {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='relative flex w-134.25 flex-col gap-6 rounded-4xl bg-white p-8 shadow-xl'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl-bold text-neutral-950'>Delete</h2>
          <X className='h-5 w-5 text-neutral-950' onClick={onClose} />
        </div>

        <p className='text-md-regular text-neutral-600'>
          Are you sure to delete?
        </p>
        <div className='flex justify-end'>
          <button
            onClick={onClose}
            className='w-30 rounded-full p-2 text-sm font-semibold text-neutral-950 hover:bg-neutral-100'
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className='w-42.75 rounded-full bg-rose-500 p-2 text-sm font-semibold text-white hover:bg-rose-600'
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
