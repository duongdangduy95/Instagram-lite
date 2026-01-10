'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { CurrentUserSafe } from '@/types/dto';

interface Comment {
  blogAuthorId: string;
  id: string;
  blogId: string;
  content: string;
  createdAt: string;
  parentId: string | null;
  author: {
    fullname: string;
    username: string;
    image?: string | null;
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
  // Dành cho màn có composer riêng (vd: BlogPostModal). Khi click "Trả lời",
  // component sẽ gọi callback này thay vì tự hiện composer nội bộ.
  onRequestReply?: (args: { parentId: string; username: string; fullname: string }) => void;
}

function updateCommentInTree(
  items: Comment[],
  commentId: string,
  newContent: string
): Comment[] {
  return items.map((c) => {
    if (c.id === commentId) {
      return { ...c, content: newContent }
    }

    if (c.replies?.length) {
      return {
        ...c,
        replies: updateCommentInTree(c.replies, commentId, newContent),
      }
    }

    return c
  })
}

function removeCommentFromTree(
  items: Comment[],
  commentId: string
): Comment[] {
  return items
    .filter((c) => c.id !== commentId)
    .map((c) => ({
      ...c,
      replies: removeCommentFromTree(c.replies || [], commentId),
    }))
}


function renderContentWithMentions(content: string) {
  // Split giữ lại token @xxx để render link nổi bật
  const parts = content.split(/(@[a-zA-Z0-9._]{1,30})/g);
  return parts.map((part, idx) => {
    if (part.startsWith('@') && part.length > 1) {
      const username = part.slice(1);
      return (
        <Link
          key={`${part}-${idx}`}
          href={`/user/${username}`}
          className="text-purple-primary hover:text-purple-primary-dark font-medium"
        >
          {part}
        </Link>
      );
    }
    return <span key={idx}>{part}</span>;
  });
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
  onRequestReply,
}: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<null | { id: string; username: string; fullname: string }>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);

  const focusComposer = () => {
    // Chờ DOM cập nhật rồi focus
    requestAnimationFrame(() => {
      composerRef.current?.focus();
    });
  };

  const handleReply = (comment: Comment) => {
    const username = comment.author?.username || '';
    const fullname = comment.author?.fullname || '';

    // Nếu màn cha có composer riêng (BlogPostModal), chuyển request lên cha xử lý.
    if (onRequestReply) {
      onRequestReply({ parentId: comment.id, username, fullname });
      return;
    }

    setReplyTo({ id: comment.id, username, fullname });

    // Prefill mention cơ bản: @username (nếu có)
    if (username) {
      const mention = `@${username}`;
      setNewComment((prev) => {
        const prevTrim = prev.trimStart();
        // Nếu đang reply người khác và đã có @... đầu câu, replace
        const replaced = prevTrim.replace(/^@[^\s]+\s+/, '');
        const nextBase = replaced.length > 0 ? replaced : '';
        return `${mention} ${nextBase}`.trimEnd() + ' ';
      });
    }

    focusComposer();
  };

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

  // Realtime update avatar/fullname/username trong comment list (khi user vừa đổi profile)
  useEffect(() => {
    const onProfileChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as
        | { userId: string; fullname?: string | null; username?: string | null; image?: string | null }
        | undefined
      if (!detail?.userId) return

      const patchTree = (items: Comment[]): Comment[] =>
        items.map((c) => {
          const next = { ...c }
          if (next.author?.username && next.author.username === detail.username) {
            // no-op (username changed) - handled below by id-less comments; fall back to fullname/image update by username
          }
          // Comments API hiện không trả author.id, nên match theo username cũ (tối thiểu) và update image/fullname.
          if (next.author?.username && (detail.username || detail.fullname || typeof detail.image !== 'undefined')) {
            if (next.author.username === (detail.username ?? next.author.username)) {
              next.author = {
                ...next.author,
                fullname: (detail.fullname ?? next.author.fullname) as string,
                username: (detail.username ?? next.author.username) as string,
                image: typeof detail.image !== 'undefined' ? detail.image : next.author.image,
              }
            }
          }
          next.replies = patchTree(next.replies || [])
          return next
        })

      setComments((prev) => patchTree(prev))
    }

    window.addEventListener('user:profile-change', onProfileChange as EventListener)
    return () => window.removeEventListener('user:profile-change', onProfileChange as EventListener)
  }, []);

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
          parentId: replyTo?.id ?? null,
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
        <div className={`space-y-3 mb-4 ${inlineScrollable ? 'max-h-96 overflow-y-auto scrollbar-win' : ''}`}>
          {comments.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">Chưa có bình luận nào</p>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUser={currentUser}
                onReply={handleReply}
                onUpdate={(id, content) => {
                  setComments((prev) =>
                    updateCommentInTree(prev, id, content)
                  )
                }}
                onDelete={(id) => {
                  setComments((prev) =>
                    removeCommentFromTree(prev, id)
                  )
                }}
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
                  Đang trả lời{' '}
                  <span className="font-semibold">
                    {replyTo.username ? `@${replyTo.username}` : replyTo.fullname}
                  </span>
                  .{' '}
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
                  ref={composerRef}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={1}
                  placeholder="Thêm bình luận..."
                  className="flex-1 bg-transparent border border-gray-700 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-primary resize-none"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-purple-primary text-white rounded-lg hover:bg-purple-primary-dark transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!newComment.trim()}
                >
                  <img 
                    src="/icons/send-solid-purple.svg" 
                    alt="Gửi" 
                    className="w-6 h-6"
                  />
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
      <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-[#0B0E11]">
        <h2 className="text-lg font-semibold text-white">Bình luận</h2>
        <button
          onClick={onClose}
          className="text-gray-400 text-xl font-bold hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Comments List - Scrollable */}
      <div className="flex-1 p-4 overflow-y-auto scrollbar-win bg-[#0B0E11]">
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
              onReply={handleReply}
              onUpdate={(id, content) => {
                setComments((prev) =>
                  updateCommentInTree(prev, id, content)
                )
              }}
              onDelete={(id) => {
                setComments((prev) =>
                  removeCommentFromTree(prev, id)
                )
              }}
            />
          ))}
        </div>
      </div>

      {/* Comment Form - Fixed at Bottom */}
      {currentUser && (
        <div className="border-t border-gray-800 bg-[#0B0E11] p-4">
          <form onSubmit={handleSubmit}>
            {replyTo && (
              <div className="text-sm text-purple-primary mb-2">
                Đang trả lời{' '}
                <span className="font-semibold">
                  {replyTo.username ? `@${replyTo.username}` : replyTo.fullname}
                </span>
                .{' '}
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
              ref={composerRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={2}
              placeholder="Viết bình luận..."
              className="w-full bg-transparent border border-gray-700 rounded-lg p-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-primary resize-none"
            />
            <button
              type="submit"
              className="mt-2 p-2.5 bg-purple-primary text-white rounded-lg hover:bg-purple-primary-dark transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!newComment.trim()}
            >
              <img 
                src="/icons/send-solid-purple.svg" 
                alt="Gửi" 
                className="w-6 h-6 "
              />
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
  onReply: (comment: Comment) => void;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  inline?: boolean;
}

function CommentItem({ comment, currentUser, onReply, onUpdate, onDelete, inline = false }: CommentItemProps) {
  const [liked, setLiked] = useState(comment.liked || false)
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0)
  const [likeAnimating, setLikeAnimating] = useState(false)
  const [loading, setLoading] = useState(false)

  const [showOptions, setShowOptions] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)

  const isCommentOwner = currentUser?.username === comment.author.username
  const isBlogOwner = currentUser?.id === comment.blogAuthorId

  const canEdit = isCommentOwner
  const canDelete = isCommentOwner || isBlogOwner



  const optionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(e.target as Node)) {
        setShowOptions(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])



  useEffect(() => {
    setLiked(comment.liked || false)
    setLikeCount(comment.likeCount || 0)
  }, [comment.liked, comment.likeCount])


  const handleLike = async () => {
    if (!currentUser) return
    if (loading) return
    setLoading(true)

    const prevLiked = liked
    const prevCount = likeCount

    // Toggle liked state
    const newLiked = !liked
    setLiked(newLiked)
    setLikeCount(newLiked ? likeCount + 1 : Math.max(0, likeCount - 1))

    // Animation
    setLikeAnimating(true)
    setTimeout(() => setLikeAnimating(false), 300)



    try {
      const res = await fetch(
        `/api/blog/${comment.blogId}/comment/${comment.id}/like`,
        {
          method: 'POST',
          credentials: 'include',
        }
      )

      if (!res.ok) throw new Error('Like failed')

      const data: { liked: boolean; likeCount: number } = await res.json()

      setLiked(data.liked)
      setLikeCount(data.likeCount)
    } catch (err) {
      console.error(err)


      setLiked(prevLiked)
      setLikeCount(prevCount)
    } finally {
      setLoading(false)
    }
  }

  if (inline) {
    return (
      <div className="ml-2 mt-2">
        <div className="flex items-start justify-between space-x-2">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {comment.author.image ? (
              <Image src={comment.author.image} alt={comment.author.username} width={32} height={32} className="object-cover w-full h-full" />
            ) : (
              <span className="text-white font-bold text-xs">
                {comment.author.username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Comment content */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center space-x-2">
                <Link
                  href={`/user/${comment.author.username}`}
                  className="text-sm font-medium text-gray-200 hover:text-purple-primary transition-colors"
                >
                  {comment.author.username}
                </Link>
                <span className="text-gray-500 text-xs font-normal">
                  {new Date(comment.createdAt).toLocaleString('vi-VN', {
                    day: 'numeric',
                    month: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {(canEdit || canDelete) && (
                <div className="relative" ref={optionsRef}>
                  <button
                    onClick={() => setShowOptions(!showOptions)}
                    className="p-1 rounded-full hover:bg-gray-800"
                  >
                    <span className="text-gray-400 text-lg">⋯</span>
                  </button>

                  {showOptions && (
                    <div className="absolute right-0 mt-1 w-36 bg-[#0B0E11] border border-gray-800 rounded-lg shadow-lg z-50">
                      {canEdit && (
                        <button
                          onClick={() => {
                            setEditing(true)
                            setShowOptions(false)
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-800"
                        >
                          Chỉnh sửa
                        </button>
                      )}

                      {canDelete && (
                        <button
                          onClick={async () => {
                            if (!confirm('Xóa bình luận này?')) return

                            try {
                              const res = await fetch(`/api/blog/${comment.blogId}/comment`, {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                                credentials: 'include',
                                body: JSON.stringify({
                                  commentId: comment.id,
                                }),
                              })


                              onDelete(comment.id)
                              if (!res.ok) throw new Error('Delete failed')

                              
                            } catch (err) {
                              console.error(err)
                              alert('Không thể xóa bình luận')
                            } finally {
                              setShowOptions(false)
                            }
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800"
                        >
                          Xóa bình luận
                        </button>

                      )}
                    </div>
                  )}
                </div>
              )}

            </div>


            {editing ? (
              <>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-transparent border border-gray-700 rounded p-2 text-gray-200 text-sm"
                />
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={async () => {
                      if (!editContent.trim()) return

                      try {
                        const res = await fetch(`/api/blog/${comment.blogId}/comment`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          credentials: 'include',
                          body: JSON.stringify({
                            commentId: comment.id,
                            content: editContent,
                          }),
                        })

                        onUpdate(comment.id, editContent)
                        setEditing(false)
                        
                        if (!res.ok) throw new Error('Update failed')
                        
                      } catch (err) {
                        console.error(err)
                        alert('Không thể sửa bình luận')
                      }
                    }}
                    className="text-xs text-purple-primary"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="text-xs text-gray-400"
                  >
                    Hủy
                  </button>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-300 mt-1">
                {renderContentWithMentions(comment.content)}
              </p>
            )}

            <div className="flex items-center space-x-4 mt-1">
              {currentUser && (
                <>
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-1 text-gray-400 hover:text-gray-300 transition-all duration-300 ${likeAnimating ? 'scale-75' : 'scale-100'
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
                    type="button"
                    onClick={() => onReply(comment)}
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
                onUpdate={onUpdate}
                onDelete={onDelete}
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
          <Link
            href={`/user/${comment.author.username}`}
            className="hover:text-purple-primary transition-colors"
          >
            {comment.author.username}
          </Link>{' '}
          <span className="text-gray-500 text-xs font-normal">
            {new Date(comment.createdAt).toLocaleString()}
          </span>
        </p>
        <p className="text-sm text-gray-300 mt-1">{renderContentWithMentions(comment.content)}</p>
        {currentUser && (
          <button
            type="button"
            onClick={() => onReply(comment)}
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
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
