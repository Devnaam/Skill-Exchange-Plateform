import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Post, CreatePostData } from '@/types/post';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = async (filter?: 'all' | 'connections', postType?: string) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (filter === 'connections') params.append('filter', 'connections');
      if (postType) params.append('postType', postType);

      const response = await api.get(`/posts/feed?${params.toString()}`);
      setPosts(response.data.posts);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch feed');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (data: CreatePostData) => {
    try {
      const response = await api.post('/posts/create', data);
      await fetchFeed();
      return { success: true, post: response.data.post };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Failed to create post' };
    }
  };

  const deletePost = async (postId: string) => {
    try {
      await api.delete(`/posts/${postId}`);
      await fetchFeed();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Failed to delete post' };
    }
  };

  const likePost = async (postId: string) => {
    try {
      await api.post('/posts/like', { postId });
      await fetchFeed();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Failed to like post' };
    }
  };

  const unlikePost = async (postId: string) => {
    try {
      await api.delete(`/posts/unlike/${postId}`);
      await fetchFeed();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Failed to unlike post' };
    }
  };

  const addComment = async (postId: string, content: string) => {
    try {
      await api.post('/posts/comment', { postId, content });
      await fetchFeed();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Failed to add comment' };
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      await api.delete(`/posts/comment/${commentId}`);
      await fetchFeed();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Failed to delete comment' };
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return {
    posts,
    loading,
    error,
    fetchFeed,
    createPost,
    deletePost,
    likePost,
    unlikePost,
    addComment,
    deleteComment,
  };
};
