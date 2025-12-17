'use client';

import { useState, useEffect } from 'react';
import CommentSection from './CommentSection';

type Props = {
  blogId: string;
  currentUser: {
    id: string;
    fullname: string;
    username: string;
  } | null;
  onCommentAdded?: () => void;
  onClose?: () => void;
  isOpen?: boolean;
};

export default function CommentToggle({ blogId, currentUser, onCommentAdded, onClose, isOpen }: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const showComments = isOpen !== undefined ? isOpen : internalOpen;

  useEffect(() => {
    if (showComments) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showComments]);

  const handleToggle = () => {
    if (isOpen !== undefined && onClose) {
      onClose();
    } else {
      setInternalOpen(!internalOpen);
    }
  };

  return (
    <>
      <button
        onClick={handleToggle}
        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 rounded-lg flex-1 justify-center transition-colors w-full"
      >
        <span className="text-gray-600">💬</span>
        <span className="text-gray-600 font-medium">Bình luận</span>
      </button>

      {showComments && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
            onClick={handleToggle}
          >
            {/* Modal */}
            <div 
              className="bg-white rounded-lg shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <CommentSection 
                blogId={blogId} 
                currentUser={currentUser}
                onCommentAdded={onCommentAdded}
                onClose={handleToggle}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
