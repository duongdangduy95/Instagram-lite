// app/components/CommentItem.tsx
'use client';
import React from 'react';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  parentId: string | null;
  author: {
    fullname: string;
    username: string;
  };
  replies: Comment[];
}

interface Props {
  comment: Comment;
  onReply: (parentId: string) => void;
  currentUser: {
    id: string;
    fullname: string;
    username: string;
  } | null;
}

export function CommentItem({ comment, onReply, currentUser }: Props) {
  return (
    <div className="ml-2 border-l pl-2 mb-2">
      <div className="p-2 bg-gray-100 rounded-lg border border-gray-200">
        <p className="text-sm font-medium text-gray-800">
          {comment.author.fullname}{' '}
          <span className="text-gray-500 text-xs">
            {new Date(comment.createdAt).toLocaleString()}
          </span>
        </p>
        <p className="text-sm text-gray-700">{comment.content}</p>
        {currentUser && (
          <button
            onClick={() => onReply(comment.id)}
            className="text-xs text-blue-500 hover:underline mt-1"
          >
            Trả lời
          </button>
        )}
      </div>

      {/* Render replies */}
      {comment.replies.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          onReply={onReply}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
}
