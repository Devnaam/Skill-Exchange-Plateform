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
  const { status, data: session } = useSession();
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
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200"></div>
              <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
            <p className="text-slate-600 font-medium">Loading feed...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar - User Quick Info (Hidden on mobile) */}
        <div className="hidden lg:block lg:col-span-3 space-y-4">
          <Card className="border border-slate-200 sticky top-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {session?.user?.firstName?.charAt(0)}{session?.user?.lastName?.charAt(0)}
              </div>
              <h3 className="font-bold text-slate-900 mb-1">
                {session?.user?.firstName} {session?.user?.lastName}
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Share your knowledge with the community
              </p>
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-2xl font-bold text-slate-900">{posts.length}</p>
                  <p className="text-xs text-slate-600">Posts</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {posts.reduce((acc, post) => acc + post.likes.length, 0)}
                  </p>
                  <p className="text-xs text-slate-600">Likes</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Links */}
          <Card className="border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-3 text-sm">Quick Links</h3>
            <div className="space-y-2">
              {[
                { icon: '🎯', label: 'Find Matches', href: '/matches' },
                { icon: '🤝', label: 'Connections', href: '/connections' },
                { icon: '💬', label: 'Messages', href: '/messages' },
              ].map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors group"
                >
                  <span className="text-lg">{link.icon}</span>
                  <span className="group-hover:text-indigo-600 transition-colors">{link.label}</span>
                </a>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-6 space-y-6">
          {/* Premium Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 shadow-xl">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Community Feed
            </h1>
            <p className="text-slate-300 text-sm sm:text-base">
              Discover insights, tips, and connect with skill enthusiasts
            </p>
          </div>

          {/* Elegant Filters */}
          <Card className="border border-slate-200">
            <div className="space-y-4">
              {/* View Toggle */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
                <button
                  onClick={() => handleFilterChange('all')}
                  className={`flex-1 px-4 py-2.5 rounded-md font-medium text-sm transition-all duration-200 ${
                    activeFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    All Posts
                  </span>
                </button>
                <button
                  onClick={() => handleFilterChange('connections')}
                  className={`flex-1 px-4 py-2.5 rounded-md font-medium text-sm transition-all duration-200 ${
                    activeFilter === 'connections'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Connections
                  </span>
                </button>
              </div>

              {/* Type Pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { value: '', label: 'All', icon: '📋' },
                  { value: 'TEXT', label: 'Posts', icon: '📝' },
                  { value: 'SKILL_SHOWCASE', label: 'Skills', icon: '🎯' },
                  { value: 'TIP', label: 'Tips', icon: '💡' },
                  { value: 'EVENT', label: 'Events', icon: '📅' },
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleTypeChange(type.value)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      activeType === type.value
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                  </button>
                ))}
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

        {/* Right Sidebar - Trending & Suggestions (Hidden on mobile) */}
        <div className="hidden lg:block lg:col-span-3 space-y-4">
          {/* Trending Topics */}
          <Card className="border border-slate-200 sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Trending Topics</h3>
              <span className="text-xs text-indigo-600 font-medium">Live</span>
            </div>
            <div className="space-y-3">
              {[
                { tag: 'WebDevelopment', posts: 45 },
                { tag: 'GraphicDesign', posts: 32 },
                { tag: 'CookingTips', posts: 28 },
                { tag: 'LanguageLearning', posts: 24 },
              ].map((trend, idx) => (
                <button
                  key={idx}
                  className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    #{trend.tag}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {trend.posts} posts today
                  </p>
                </button>
              ))}
            </div>
          </Card>

          {/* Community Stats */}
          <Card className="border border-slate-200 bg-gradient-to-br from-indigo-50 to-purple-50">
            <h3 className="font-semibold text-slate-900 mb-3">Community Impact</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700">Active Today</span>
                <span className="text-sm font-bold text-indigo-600">1,234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700">Skills Shared</span>
                <span className="text-sm font-bold text-indigo-600">5,678</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700">Connections Made</span>
                <span className="text-sm font-bold text-indigo-600">890</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-indigo-200">
              <p className="text-xs text-slate-600 leading-relaxed">
                Join a thriving community of learners and teachers exchanging skills every day!
              </p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
