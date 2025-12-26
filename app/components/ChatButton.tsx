'use client';
import { useState } from 'react';
import ChatWindow from './ChatWindow';

export default function ChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(!open)} className="fixed bottom-4 right-4 p-3 bg-blue-500 text-white rounded-full">
        💬
      </button>
      {open && <ChatWindow targetUserId={''} onClose={function (): void {
        throw new Error('Function not implemented.');
      } } />}
    </>
  );
}
