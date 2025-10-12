'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useMessages } from '@/hooks/useMessages';
import { ChatBox } from '@/components/messages/ChatBox';
import { ConversationList } from '@/components/messages/ConversationList';
import { Card } from '@/components/ui/Card';

export default function MessagesPage() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    conversations,
    currentConversation,
    loading,
    fetchConversation,
    sendMessage,
    fetchConversations,
  } = useMessages();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      const userId = searchParams.get('user');
      if (userId) {
        handleSelectConversation(userId);
      }
    }
  }, [status, searchParams]);

  const handleSelectConversation = async (userId: string) => {
    setSelectedUserId(userId);
    await fetchConversation(userId);
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedUserId) return;
    const result = await sendMessage(selectedUserId, content);
    if (result.success) {
      await fetchConversation(selectedUserId);
      await fetchConversations();
    }
  };

  const selectedUser = conversations.find((c) => c.user.id === selectedUserId)?.user;

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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">
            Chat with your connections
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversation List */}
          <div className="lg:col-span-1">
            <Card>
              <h3 className="font-semibold text-lg mb-4">Conversations</h3>
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : (
                <ConversationList
                  conversations={conversations}
                  onSelectConversation={handleSelectConversation}
                  selectedUserId={selectedUserId || undefined}
                />
              )}
            </Card>
          </div>

          {/* Chat Box */}
          <div className="lg:col-span-2">
            {selectedUser ? (
              <ChatBox
                otherUser={selectedUser}
                messages={currentConversation}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <Card className="h-[600px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <p className="text-lg">Select a conversation to start chatting</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
