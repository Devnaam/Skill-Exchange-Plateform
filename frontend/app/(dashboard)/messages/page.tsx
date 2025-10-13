'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ChatBox } from '@/components/messages/ChatBox';
import { ConversationList } from '@/components/messages/ConversationList';
import { Card } from '@/components/ui/Card';
import api from '@/lib/api';
import { User } from '@/types';
import { Message, Conversation } from '@/types/message';

export default function MessagesPage() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMobileList, setShowMobileList] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (status === 'authenticated') {
      loadConversations();
      
      const userId = searchParams.get('user');
      if (userId) {
        setShowMobileList(false);
        loadUserAndMessages(userId);
      }
    }
  }, [status]);

  useEffect(() => {
    if (status === 'authenticated') {
      const userId = searchParams.get('user');
      if (userId && userId !== selectedUser?.id) {
        setShowMobileList(false);
        loadUserAndMessages(userId);
      }
    }
  }, [searchParams]);

  const loadConversations = async () => {
    try {
      setConversationsLoading(true);
      
      const connectionsResponse = await api.get('/connections?status=ACCEPTED');
      const connections = [...connectionsResponse.data.sent, ...connectionsResponse.data.received, ...connectionsResponse.data.accepted];
      
      const uniqueConnections = Array.from(
        new Map(connections.map(c => [c.id, c])).values()
      );
      
      const conversationPromises = uniqueConnections.map(async (connection) => {
        const otherUser = connection.senderId === session?.user?.id 
          ? connection.receiver 
          : connection.sender;
        
        try {
          const messagesResponse = await api.get(`/messages/conversation/${otherUser.id}`);
          const userMessages = messagesResponse.data.messages || [];
          
          const unreadCount = userMessages.filter(
            (m: Message) => m.receiverId === session?.user?.id && !m.isRead
          ).length;
          
          return {
            user: otherUser,
            lastMessage: userMessages[userMessages.length - 1] || null,
            unreadCount,
          };
        } catch (err) {
          return {
            user: otherUser,
            lastMessage: null,
            unreadCount: 0,
          };
        }
      });
      
      const conversationsList = await Promise.all(conversationPromises);
      
      conversationsList.sort((a, b) => {
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime();
      });
      
      setConversations(conversationsList);
      
    } catch (err: any) {
      console.error('Error loading conversations:', err);
    } finally {
      setConversationsLoading(false);
    }
  };

  const loadUserAndMessages = async (userId: string) => {
    try {
      setLoading(true);
      setError('');
      
      const userResponse = await api.get(`/users/${userId}`);
      setSelectedUser(userResponse.data.user);
      
      const messagesResponse = await api.get(`/messages/conversation/${userId}`);
      setMessages(messagesResponse.data.messages || []);
      
      await loadConversations();
      
    } catch (err: any) {
      console.error('Error loading user/messages:', err);
      setError(err.response?.data?.error || 'Failed to load conversation');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = (userId: string) => {
    setShowMobileList(false);
    router.push(`/messages?user=${userId}`);
  };

  const handleBackToList = () => {
    setShowMobileList(true);
    setSelectedUser(null);
    router.push('/messages');
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedUser) return;
    
    try {
      await api.post('/messages/send', {
        receiverId: selectedUser.id,
        content,
      });
      
      await loadUserAndMessages(selectedUser.id);
      
    } catch (err: any) {
      console.error('Error sending message:', err);
      
      if (err.response?.status === 403) {
        alert('You must be connected with this user to send messages.');
      } else {
        alert(err.response?.data?.error || 'Failed to send message');
      }
    }
  };

  if (status === 'loading') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-gray-600">Loading messages...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header - Hidden on mobile when chat is open */}
        <div className={`${!showMobileList && selectedUser ? 'hidden sm:block' : 'block'}`}>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            Chat with your connections
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500 p-3 sm:p-4 rounded-lg text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Two-panel layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6">
          {/* Left Panel: Conversation List - Toggle on mobile */}
          <div className={`
            lg:col-span-4 xl:col-span-3
            ${showMobileList ? 'block' : 'hidden lg:block'}
          `}>
            <Card className="h-[calc(100vh-200px)] sm:h-[calc(100vh-220px)] lg:h-[calc(100vh-250px)] overflow-hidden flex flex-col shadow-lg">
              <div className="p-3 sm:p-4 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
                <h3 className="font-semibold text-base sm:text-lg text-gray-900">Conversations</h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-500">
                    {conversations.length} {conversations.length !== 1 ? 'chats' : 'chat'}
                  </p>
                  {conversations.filter(c => c.unreadCount > 0).length > 0 && (
                    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-medium">
                      {conversations.filter(c => c.unreadCount > 0).length} unread
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {conversationsLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                    <p className="text-sm text-gray-500">Loading conversations...</p>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="bg-indigo-50 rounded-full p-6 mb-4">
                      <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-2">No conversations yet</p>
                    <p className="text-xs text-gray-500 mb-4">
                      Connect with people to start chatting
                    </p>
                    <a 
                      href="/connections" 
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
                    >
                      Go to Connections →
                    </a>
                  </div>
                ) : (
                  <ConversationList
                    conversations={conversations}
                    onSelectConversation={handleSelectConversation}
                    selectedUserId={selectedUser?.id}
                  />
                )}
              </div>
            </Card>
          </div>

          {/* Right Panel: Chat Box - Toggle on mobile */}
          <div className={`
            lg:col-span-8 xl:col-span-9
            ${!showMobileList || selectedUser ? 'block' : 'hidden lg:block'}
          `}>
            {loading ? (
              <Card className="h-[calc(100vh-200px)] sm:h-[calc(100vh-220px)] lg:h-[calc(100vh-250px)] flex items-center justify-center">
                <div className="flex flex-col items-center space-y-3">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  <p className="text-gray-600">Loading conversation...</p>
                </div>
              </Card>
            ) : selectedUser ? (
              <div className="relative">
                <ChatBox
                  otherUser={selectedUser}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onBack={handleBackToList}
                  showBackButton={true}
                />
              </div>
            ) : (
              <Card className="h-[calc(100vh-200px)] sm:h-[calc(100vh-220px)] lg:h-[calc(100vh-250px)] flex items-center justify-center shadow-lg">
                <div className="text-center px-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full p-8 mb-6 inline-block">
                    <svg className="w-16 h-16 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Your Messages</h3>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto">
                    Select a conversation from the list to start chatting with your connections
                  </p>
                  
                  {/* Mobile CTA */}
                  <button
                    onClick={() => setShowMobileList(true)}
                    className="lg:hidden mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    View Conversations
                  </button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
