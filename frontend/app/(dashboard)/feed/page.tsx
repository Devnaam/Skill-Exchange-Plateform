'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { usePosts } from '@/hooks/usePosts';
import { CreatePost } from '@/components/feed/CreatePost';
import { PostList } from '@/components/feed/PostList';
import { Card } from '@/components/ui/Card';

export default function FeedPage() {
  const { status } = useSession();
  const router = useRouter();
  const {
    posts,
    loading,
    fetchFeed,
    createPost,
    deletePost,
    likePost,
    unlikePost,
    addComment,
    deleteComment,
  } = usePosts();
  const [activeFilter, setActiveFilter] = useState<'all' | 'connections'>('all');
  const [activeType, setActiveType] = useState<string>('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleFilterChange = (filter: 'all' | 'connections') => {
    setActiveFilter(filter);
    fetchFeed(filter, activeType || undefined);
  };

  const handleTypeChange = (type: string) => {
    setActiveType(type);
    fetchFeed(activeFilter, type || undefined);
  };

  const handleCreatePost = async (data: any) => {
    const result = await createPost(data);
    if (result.success) {
      await fetchFeed(activeFilter, activeType || undefined);
    }
    return result;
  };

  const handleLike = async (postId: string) => {
    await likePost(postId);
  };

  const handleUnlike = async (postId: string) => {
    await unlikePost(postId);
  };

  const handleComment = async (postId: string, content: string) => {
    await addComment(postId, content);
  };

  const handleDelete = async (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await deletePost(postId);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      await deleteComment(commentId);
    }
  };

  if (status === 'loading') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Feed</h1>
          <p className="text-gray-600 mt-2">
            Share your skills, tips, and connect with the community
          </p>
        </div>

        {/* Filters */}
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* View Filter */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleFilterChange('all')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🌍 All Posts
              </button>
              <button
                onClick={() => handleFilterChange('connections')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeFilter === 'connections'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                👥 Connections
              </button>
            </div>

            {/* Type Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleTypeChange('')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeType === ''
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleTypeChange('TEXT')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeType === 'TEXT'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                💬 Text
              </button>
              <button
                onClick={() => handleTypeChange('SKILL_SHOWCASE')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeType === 'SKILL_SHOWCASE'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🎯 Skills
              </button>
              <button
                onClick={() => handleTypeChange('TIP')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeType === 'TIP'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                💡 Tips
              </button>
              <button
                onClick={() => handleTypeChange('EVENT')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeType === 'EVENT'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📅 Events
              </button>
            </div>
          </div>
        </Card>

        {/* Create Post */}
        <CreatePost onSubmit={handleCreatePost} />

        {/* Posts List */}
        <PostList
          posts={posts}
          loading={loading}
          emptyMessage={
            activeFilter === 'connections'
              ? 'No posts from your connections yet. Connect with more people!'
              : 'No posts yet. Be the first to share something!'
          }
          onLike={handleLike}
          onUnlike={handleUnlike}
          onComment={handleComment}
          onDelete={handleDelete}
          onDeleteComment={handleDeleteComment}
        />
      </div>
    </DashboardLayout>
  );
}
