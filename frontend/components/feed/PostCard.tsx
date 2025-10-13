'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Post } from '@/types/post';
import { useAuth } from '@/hooks/useAuth';
import { formatRelativeTime } from '@/utils/formatters';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => Promise<void>;
  onUnlike: (postId: string) => Promise<void>;
  onComment: (postId: string, content: string) => Promise<void>;
  onDelete: (postId: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onUnlike,
  onComment,
  onDelete,
  onDeleteComment,
}) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const isLiked = post.likes.some((like) => like.userId === user?.id);
  const isOwner = post.userId === user?.id;

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    if (isLiked) {
      await onUnlike(post.id);
    } else {
      await onLike(post.id);
    }
    setIsLiking(false);
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    setCommenting(true);
    await onComment(post.id, commentText.trim());
    setCommentText('');
    setCommenting(false);
  };

  const getPostTypeIcon = () => {
    switch (post.postType) {
      case 'SKILL_SHOWCASE': return '🎯';
      case 'TIP': return '💡';
      case 'EVENT': return '📅';
      default: return null;
    }
  };

  const getPostTypeLabel = () => {
    switch (post.postType) {
      case 'SKILL_SHOWCASE': return 'Skill Showcase';
      case 'TIP': return 'Tip';
      case 'EVENT': return 'Event';
      default: return null;
    }
  };

  return (
    <Card className="border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <Link href={`/users/${post.user.id}`}>
            <Avatar
              firstName={post.user.firstName}
              lastName={post.user.lastName}
              src={post.user.profileImage}
              size="md"
              className="ring-2 ring-slate-100 hover:ring-indigo-200 transition-all"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <Link href={`/users/${post.user.id}`}>
              <h4 className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors truncate">
                {post.user.firstName} {post.user.lastName}
              </h4>
            </Link>
            {post.user.username && (
              <p className="text-sm text-slate-500 truncate">@{post.user.username}</p>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-400">
                {formatRelativeTime(post.createdAt)}
              </span>
              {getPostTypeLabel() && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    {getPostTypeIcon()} {getPostTypeLabel()}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {isOwner && (
          <button
            onClick={() => onDelete(post.id)}
            className="text-slate-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
            aria-label="Delete post"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-slate-800 text-[15px] leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
        {post.skill && (
          <div className="mt-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
              #{post.skill.name}
            </span>
          </div>
        )}
      </div>

      {/* Engagement Stats */}
      <div className="flex items-center gap-4 py-3 border-y border-slate-100">
        <button className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">
          {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
        >
          {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
            isLiked
              ? 'bg-red-50 text-red-600 hover:bg-red-100'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <svg className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {isLiked ? 'Liked' : 'Like'}
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm bg-slate-50 text-slate-700 hover:bg-slate-100 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Comment
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
          {/* Comment List */}
          {post.comments.length > 0 && (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 group">
                  <Avatar
                    firstName={comment.user.firstName}
                    lastName={comment.user.lastName}
                    src={comment.user.profileImage}
                    size="sm"
                  />
                  <div className="flex-1 bg-slate-50 rounded-xl p-3 group-hover:bg-slate-100 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {comment.user.firstName} {comment.user.lastName}
                      </p>
                      {comment.userId === user?.id && (
                        <button
                          onClick={() => onDeleteComment(comment.id)}
                          className="opacity-0 group-hover:opacity-100 text-xs text-red-500 hover:text-red-700 transition-all"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{comment.content}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatRelativeTime(comment.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment */}
          <div className="flex gap-3">
            <Avatar
              firstName={user?.firstName || ''}
              lastName={user?.lastName || ''}
              src={user?.profileImage}
              size="sm"
            />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                disabled={commenting}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !commenting) {
                    handleComment();
                  }
                }}
              />
              <Button
                onClick={handleComment}
                disabled={commenting || !commentText.trim()}
                size="sm"
                variant="primary"
              >
                {commenting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
