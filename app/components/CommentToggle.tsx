'use client';

import { useState } from 'react';
import CommentSection from './CommentSection';

type Props = {
  blogId: string;
  currentUser: {
    id: string;
    fullname: string;
    username: string;
  } | null;
};

export default function CommentToggle({ blogId, currentUser }: Props) {
  const [showComments, setShowComments] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 rounded-lg flex-1 justify-center transition-colors w-full"
      >
        <span className="text-gray-600">💬</span>
        <span className="text-gray-600 font-medium">Bình luận</span>
      </button>

      {showComments && (
        <div className="mt-2">
          <CommentSection blogId={blogId} currentUser={currentUser} />
        </div>
      )}
    </div>
  );
}
