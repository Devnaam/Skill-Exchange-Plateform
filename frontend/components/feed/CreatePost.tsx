'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { CreatePostData, PostType, PostVisibility } from '@/types/post';

interface CreatePostProps {
  onSubmit: (data: CreatePostData) => Promise<{ success: boolean; error?: string }>;
}

export const CreatePost: React.FC<CreatePostProps> = ({ onSubmit }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<PostType>('TEXT');
  const [visibility, setVisibility] = useState<PostVisibility>('PUBLIC');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please write something');
      return;
    }

    setLoading(true);
    setError('');

    const result = await onSubmit({
      content: content.trim(),
      postType,
      visibility,
    });

    if (result.success) {
      setContent('');
      setPostType('TEXT');
      setVisibility('PUBLIC');
    } else {
      setError(result.error || 'Failed to create post');
    }

    setLoading(false);
  };

  if (!user) return null;

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Avatar and Textarea */}
        <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-3">
          {/* Avatar - Hidden on mobile, shown on tablet+ */}
          <div className="hidden sm:block">
            <Avatar
              firstName={user.firstName}
              lastName={user.lastName}
              src={user.profileImage}
              size="md"
            />
          </div>
          
          {/* Mobile Avatar and Name */}
          <div className="flex sm:hidden items-center space-x-2 w-full">
            <Avatar
              firstName={user.firstName}
              lastName={user.lastName}
              src={user.profileImage}
              size="sm"
            />
            <span className="text-sm font-medium text-gray-700">
              {user.firstName} {user.lastName}
            </span>
          </div>
          
          {/* Textarea */}
          <div className="flex-1 w-full">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts, tips, or experiences..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-sm sm:text-base"
              disabled={loading}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500 p-2 rounded text-xs sm:text-sm">
            {error}
          </div>
        )}

        {/* Controls - Responsive Layout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          {/* Dropdowns */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            {/* Post Type */}
            <select
              value={postType}
              onChange={(e) => setPostType(e.target.value as PostType)}
              className="w-full sm:w-auto text-xs sm:text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              disabled={loading}
            >
              <option value="TEXT">💬 Text</option>
              <option value="SKILL_SHOWCASE">🎯 Skill Showcase</option>
              <option value="TIP">💡 Tip</option>
              <option value="EVENT">📅 Event</option>
            </select>

            {/* Visibility */}
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as PostVisibility)}
              className="w-full sm:w-auto text-xs sm:text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              disabled={loading}
            >
              <option value="PUBLIC">🌍 Public</option>
              <option value="CONNECTIONS">👥 Connections Only</option>
              <option value="PRIVATE">🔒 Private</option>
            </select>
          </div>

          {/* Post Button */}
          <Button 
            type="submit" 
            variant="primary" 
            disabled={loading || !content.trim()}
            className="w-full sm:w-auto"
          >
            {loading ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
