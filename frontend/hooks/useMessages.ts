import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Message, Conversation } from '@/types/message';

export const useMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/messages/conversations');
      setConversations(response.data.conversations);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversation = async (otherUserId: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/messages/conversation/${otherUserId}`);
      setCurrentConversation(response.data.messages);
    } catch (err) {
      console.error('Failed to fetch conversation:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (receiverId: string, content: string) => {
    try {
      const response = await api.post('/messages/send', {
        receiverId,
        content,
      });
      return { success: true, message: response.data.message };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Failed to send message' };
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/messages/unread-count');
      setUnreadCount(response.data.unreadCount);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  useEffect(() => {
    fetchConversations();
    fetchUnreadCount();
  }, []);

  return {
    conversations,
    currentConversation,
    unreadCount,
    loading,
    fetchConversations,
    fetchConversation,
    sendMessage,
    fetchUnreadCount,
  };
};
