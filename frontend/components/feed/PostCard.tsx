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

  const isLiked = post.likes.some((like) => like.userId === user?.id);
  const isOwner = post.userId === user?.id;

  const handleLike = async () => {
    if (isLiked) {
      await onUnlike(post.id);
    } else {
      await onLike(post.id);
    }
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
      case 'SKILL_SHOWCASE':
        return '🎯';
      case 'TIP':
        return '💡';
      case 'EVENT':
        return '📅';
      default:
        return '💬';
    }
  };

  const getPostTypeLabel = () => {
    switch (post.postType) {
      case 'SKILL_SHOWCASE':
        return 'Skill Showcase';
      case 'TIP':
        return 'Tip';
      case 'EVENT':
        return 'Event';
      default:
        return 'Post';
    }
  };

  return (
    <Card>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Link href={`/users/${post.user.id}`}>
            <Avatar
              firstName={post.user.firstName}
              lastName={post.user.lastName}
              src={post.user.profileImage}
              size="md"
            />
          </Link>
          <div>
            <Link href={`/users/${post.user.id}`}>
              <h4 className="font-semibold text-gray-900 hover:text-indigo-600">
                {post.user.firstName} {post.user.lastName}
              </h4>
            </Link>
            {post.user.username && (
              <p className="text-xs text-gray-500">@{post.user.username}</p>
            )}
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-400">
                {formatRelativeTime(post.createdAt)}
              </span>
              <Badge variant="secondary" className="text-xs">
                {getPostTypeIcon()} {getPostTypeLabel()}
              </Badge>
            </div>
          </div>
        </div>

        {isOwner && (
          <button
            onClick={() => onDelete(post.id)}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Delete
          </button>
        )}
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
        {post.skill && (
          <div className="mt-3">
            <Badge variant="primary">#{post.skill.name}</Badge>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-6 pt-3 border-t">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 text-sm ${
            isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
          }`}
        >
          <span className="text-lg">{isLiked ? '❤️' : '🤍'}</span>
          <span>{post.likes.length}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-indigo-600"
        >
          <span className="text-lg">💬</span>
          <span>{post.comments.length}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t space-y-4">
          {/* Comment List */}
          {post.comments.length > 0 && (
            <div className="space-y-3">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <Avatar
                    firstName={comment.user.firstName}
                    lastName={comment.user.lastName}
                    src={comment.user.profileImage}
                    size="sm"
                  />
                  <div className="flex-1 bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">
                        {comment.user.firstName} {comment.user.lastName}
                      </p>
                      {comment.userId === user?.id && (
                        <button
                          onClick={() => onDeleteComment(comment.id)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatRelativeTime(comment.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment */}
          <div className="flex space-x-3">
            <Avatar
              firstName={user?.firstName || ''}
              lastName={user?.lastName || ''}
              src={user?.profileImage}
              size="sm"
            />
            <div className="flex-1 flex space-x-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
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
                {commenting ? '...' : 'Post'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
