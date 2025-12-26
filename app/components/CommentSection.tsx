'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { CurrentUserSafe } from '@/types/dto';

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
  likeCount?: number;
  liked?: boolean;
}

interface Props {
  blogId: string;
  currentUser: CurrentUserSafe;
  onCommentAdded?: () => void;
  onClose?: () => void;
  inline?: boolean;
  showComposer?: boolean;
  inlineScrollable?: boolean;
  reloadKey?: number;
}

function buildCommentTree(comments: Omit<Comment, 'replies'>[]): Comment[] {
  const map = new Map<string, Comment>();
  const roots: Comment[] = [];

  comments.forEach((comment) => {
    map.set(comment.id, { 
      ...comment, 
      replies: [],
      likeCount: comment.likeCount || 0,
      liked: comment.liked || false
    });
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

export default function CommentSection({
  blogId,
  currentUser,
  onCommentAdded,
  onClose,
  inline = false,
  showComposer = true,
  inlineScrollable = true,
  reloadKey,
}: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/blog/${blogId}/comment`, {
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error(`Failed to load comments: HTTP ${res.status}`);
        }
        const data = await res.json();
        const tree = buildCommentTree(data);
        setComments(tree);
      } catch (err) {
        console.error('Error loading comments:', err);
      }
    };

    load();
  }, [blogId, reloadKey]);
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const createRes = await fetch(`/api/blog/${blogId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          content: newComment,
          parentId: replyTo,
        }),
      });

      if (!createRes.ok) {
        const errText = await createRes.text().catch(() => '');
        throw new Error(`Failed to submit comment: HTTP ${createRes.status} ${errText}`);
      }

      setNewComment('');
      setReplyTo(null);

      const res = await fetch(`/api/blog/${blogId}/comment`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setComments(buildCommentTree(data));
      }
      
      // Gọi callback để cập nhật số lượng bình luận
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (err) {
      console.error('Error submitting comment:', err);
      alert('Không thể gửi bình luận. Vui lòng thử lại.');
    }
  }

  if (inline) {
    return (
      <div className="flex flex-col">
        {/* Comments List */}
        <div className={`space-y-3 mb-4 ${inlineScrollable ? 'max-h-96 overflow-y-auto' : ''}`}>
          {comments.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">Chưa có bình luận nào</p>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUser={currentUser}
                onReply={setReplyTo}
                inline={true}
              />
            ))
          )}
        </div>

        {/* Comment Form */}
        {showComposer && currentUser && (
          <div className="pt-3 border-t border-gray-800">
            <form onSubmit={handleSubmit}>
              {replyTo && (
                <div className="text-sm text-purple-primary mb-2">
                  Trả lời một bình luận.{' '}
                  <button
                    onClick={() => setReplyTo(null)}
                    type="button"
                    className="text-gray-400 underline ml-2 hover:text-gray-300"
                  >
                    Huỷ
                  </button>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={1}
                  placeholder="Thêm bình luận..."
                  className="flex-1 bg-transparent border border-gray-700 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-primary resize-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-primary text-white rounded-lg hover:bg-purple-primary-dark transition-colors font-medium"
                >
                  Gửi
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-black">
        <h2 className="text-lg font-semibold text-white">Bình luận</h2>
        <button
          onClick={onClose}
          className="text-gray-400 text-xl font-bold hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Comments List - Scrollable */}
      <div className="flex-1 p-4 overflow-y-auto bg-black">
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

      {/* Comment Form - Fixed at Bottom */}
      {currentUser && (
        <div className="border-t border-gray-800 bg-black p-4">
          <form onSubmit={handleSubmit}>
            {replyTo && (
              <div className="text-sm text-purple-primary mb-2">
                Trả lời một bình luận.{' '}
                <button
                  onClick={() => setReplyTo(null)}
                  type="button"
                  className="text-gray-400 underline ml-2 hover:text-gray-300"
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
              className="w-full bg-transparent border border-gray-700 rounded-lg p-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-primary resize-none"
            />
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-purple-primary text-white rounded-lg hover:bg-purple-primary-dark transition-colors"
            >
              Gửi
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  currentUser: Props['currentUser'];
  onReply: (id: string) => void;
  inline?: boolean;
}

function CommentItem({ comment, currentUser, onReply, inline = false }: CommentItemProps) {
  const [liked, setLiked] = useState(comment.liked || false)
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0)
  const [likeAnimating, setLikeAnimating] = useState(false)

  const handleLike = () => {
    if (!currentUser) return
    
    // Animation
    setLikeAnimating(true)
    setTimeout(() => setLikeAnimating(false), 300)
    
    // Toggle liked state
    const newLiked = !liked
    setLiked(newLiked)
    setLikeCount(newLiked ? likeCount + 1 : Math.max(0, likeCount - 1))
    
    // TODO: Call API to like/unlike comment
  }

  if (inline) {
    return (
      <div className="ml-2 mt-2">
        <div className="flex items-start space-x-2">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs">
              {comment.author.fullname.charAt(0).toUpperCase()}
            </span>
          </div>
          
          {/* Comment content */}
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-gray-200">
                {comment.author.fullname}
              </p>
              <span className="text-gray-500 text-xs font-normal">
                {new Date(comment.createdAt).toLocaleString('vi-VN', { 
                  day: 'numeric', 
                  month: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <p className="text-sm text-gray-300 mt-1">{comment.content}</p>
            <div className="flex items-center space-x-4 mt-1">
              {currentUser && (
                <>
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-1 text-gray-400 hover:text-gray-300 transition-all duration-300 ${
                      likeAnimating ? 'scale-75' : 'scale-100'
                    }`}
                  >
                    <Image 
                      src={liked ? '/icons/liked.svg' : '/icons/like.svg'} 
                      alt="Thích" 
                      width={16} 
                      height={16}
                    />
                    <span className="text-xs">{likeCount}</span>
                  </button>
                  <button
                    onClick={() => onReply(comment.id)}
                    className="text-xs text-gray-400 hover:text-purple-primary transition-colors"
                  >
                    Trả lời
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Replies */}
        {comment.replies.length > 0 && (
          <div className="ml-4 border-l border-gray-800 pl-3 mt-2">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                currentUser={currentUser}
                onReply={onReply}
                inline={true}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="ml-2 mt-2">
      <div className="p-3 bg-gray-900/60 rounded-lg border border-gray-800">
        <p className="text-sm font-medium text-gray-100">
          {comment.author.fullname}{' '}
          <span className="text-gray-500 text-xs font-normal">
            {new Date(comment.createdAt).toLocaleString()}
          </span>
        </p>
        <p className="text-sm text-gray-300 mt-1">{comment.content}</p>
        {currentUser && (
          <button
            onClick={() => onReply(comment.id)}
            className="text-xs text-gray-400 hover:text-purple-primary transition-colors mt-2"
          >
            Trả lời
          </button>
        )}
      </div>

      {/* Replies */}
      {comment.replies.length > 0 && (
        <div className="ml-4 border-l border-gray-800 pl-3 mt-2">
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
