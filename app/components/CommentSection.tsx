'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

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
  blogId: string;
  currentUser: {
    id: string;
    fullname: string;
    username: string;
  } | null;
}

function buildCommentTree(comments: Omit<Comment, 'replies'>[]): Comment[] {
  const map = new Map<string, Comment>();
  const roots: Comment[] = [];

  comments.forEach((comment) => {
    map.set(comment.id, { ...comment, replies: [] });
  });

  map.forEach((comment) => {
    if (comment.parentId) {
      const parent = map.get(comment.parentId);
      parent?.replies.push(comment);
    } else {
      roots.push(comment);
    }
  });

  return roots;
}

export default function CommentSection({ blogId, currentUser }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    axios.get(`/api/blog/${blogId}/comment`).then((res) => {
      const tree = buildCommentTree(res.data);
      setComments(tree);
    });
  }, [blogId]);
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;

    await axios.post(`/api/blog/${blogId}/comment`, {
      content: newComment,
      parentId: replyTo,
    });

    setNewComment('');
    setReplyTo(null);

    const res = await axios.get(`/api/blog/${blogId}/comment`);
    setComments(buildCommentTree(res.data));
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setShowSidebar(true)}
        className="text-sm text-blue-600 underline mt-2"
      >
        Hiển thị {comments.length} bình luận
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-lg border-l z-50 transform transition-transform duration-300 ${
          showSidebar ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold">Bình luận</h2>
          <button
            onClick={() => setShowSidebar(false)}
            className="text-red-500 text-sm"
          >
            Đóng
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
          {currentUser && (
            <form onSubmit={handleSubmit} className="mb-4">
              {replyTo && (
                <div className="text-sm text-blue-500 mb-1">
                  Trả lời một bình luận.{' '}
                  <button
                    onClick={() => setReplyTo(null)}
                    type="button"
                    className="text-red-500 underline ml-2"
                  >
                    Huỷ
                  </button>
                </div>
              )}
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={2}
                placeholder="Viết bình luận..."
                className="w-full border rounded p-2 focus:outline-none focus:ring"
              />
              <button
                type="submit"
                className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Gửi
              </button>
            </form>
          )}

          <div className="space-y-3">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUser={currentUser}
                onReply={setReplyTo}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

interface CommentItemProps {
  comment: Comment;
  currentUser: Props['currentUser'];
  onReply: (id: string) => void;
}

function CommentItem({ comment, currentUser, onReply }: CommentItemProps) {
  return (
    <div className="ml-2 mt-2">
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

      {/* Replies */}
      {comment.replies.length > 0 && (
        <div className="ml-4 border-l pl-2 mt-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUser={currentUser}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}
