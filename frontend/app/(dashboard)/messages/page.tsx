'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ChatBox } from '@/components/messages/ChatBox';
import { Card } from '@/components/ui/Card';
import api from '@/lib/api';
import { User } from '@/types';
import { Message } from '@/types/message';

export default function MessagesPage() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (status === 'authenticated') {
      const userId = searchParams.get('user');
      if (userId) {
        loadUserAndMessages(userId);
      }
    }
  }, [status, searchParams]);

  const loadUserAndMessages = async (userId: string) => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch user details
      const userResponse = await api.get(`/users/${userId}`);
      setSelectedUser(userResponse.data.user);
      
      // Fetch conversation
      const messagesResponse = await api.get(`/messages/conversation/${userId}`);
      setMessages(messagesResponse.data.messages || []);
      
    } catch (err: any) {
      console.error('Error loading user/messages:', err);
      setError(err.response?.data?.error || 'Failed to load conversation');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedUser) return;
    
    try {
      const response = await api.post('/messages/send', {
        receiverId: selectedUser.id,
        content,
      });
      
      // Reload messages
      await loadUserAndMessages(selectedUser.id);
      
    } catch (err: any) {
      console.error('Error sending message:', err);
      alert(err.response?.data?.error || 'Failed to send message');
    }
  };

  if (status === 'loading' || loading) {
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">Chat with your connections</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500 p-4 rounded-md">
            <strong>Error:</strong> {error}
          </div>
        )}

        {selectedUser ? (
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 && (
              <div className="mb-4 bg-blue-50 border border-blue-200 p-4 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>💬 Start your conversation!</strong><br />
                  No messages yet with {selectedUser.firstName}. Send your first message below to begin chatting.
                </p>
              </div>
            )}
            
            <ChatBox
              otherUser={selectedUser}
              messages={messages}
              onSendMessage={handleSendMessage}
            />
          </div>
        ) : (
          <Card className="h-[600px] flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-lg font-medium">Select a connection to start chatting</p>
              <p className="text-sm mt-2 text-gray-400">
                Go to <a href="/connections" className="text-indigo-600 hover:underline">Connections</a> and click "Message"
              </p>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
