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
        <div className="flex items-start space-x-3">
          <Avatar
            firstName={user.firstName}
            lastName={user.lastName}
            src={user.profileImage}
            size="md"
          />
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts, tips, or experiences..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              disabled={loading}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500 p-2 rounded text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Post Type */}
            <select
              value={postType}
              onChange={(e) => setPostType(e.target.value as PostType)}
              className="text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            >
              <option value="PUBLIC">🌍 Public</option>
              <option value="CONNECTIONS">👥 Connections Only</option>
              <option value="PRIVATE">🔒 Private</option>
            </select>
          </div>

          <Button type="submit" variant="primary" disabled={loading || !content.trim()}>
            {loading ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
