import React from 'react';
import { Post } from '@/types/post';
import { PostCard } from './PostCard';

interface PostListProps {
  posts: Post[];
  loading?: boolean;
  emptyMessage?: string;
  onLike: (postId: string) => Promise<void>;
  onUnlike: (postId: string) => Promise<void>;
  onComment: (postId: string, content: string) => Promise<void>;
  onDelete: (postId: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
}

export const PostList: React.FC<PostListProps> = ({
  posts,
  loading = false,
  emptyMessage = 'No posts yet',
  onLike,
  onUnlike,
  onComment,
  onDelete,
  onDeleteComment,
}) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading posts...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <div className="text-6xl mb-4">📝</div>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={onLike}
          onUnlike={onUnlike}
          onComment={onComment}
          onDelete={onDelete}
          onDeleteComment={onDeleteComment}
        />
      ))}
    </div>
  );
};
