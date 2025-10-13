'use client';

import { useState, useEffect, useRef } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Message } from '@/types/message';
import { User } from '@/types';
import { formatRelativeTime } from '@/utils/formatters';
import { useAuth } from '@/hooks/useAuth';

interface ChatBoxProps {
  otherUser: User;
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const ChatBox: React.FC<ChatBoxProps> = ({
  otherUser,
  messages,
  onSendMessage,
  onBack,
  showBackButton = false,
}) => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    await onSendMessage(newMessage.trim());
    setNewMessage('');
    setSending(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] sm:h-[calc(100vh-220px)] lg:h-[calc(100vh-250px)] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center space-x-3 px-3 sm:px-4 py-3 sm:py-4 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
        {showBackButton && (
          <button
            onClick={onBack}
            className="lg:hidden p-2 hover:bg-white rounded-full transition-colors"
            aria-label="Back to conversations"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        
        <Avatar
          firstName={otherUser.firstName}
          lastName={otherUser.lastName}
          src={otherUser.profileImage}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
            {otherUser.firstName} {otherUser.lastName}
          </h3>
          {otherUser.username && (
            <p className="text-xs text-gray-600 truncate">@{otherUser.username}</p>
          )}
        </div>
        
        {/* More options button */}
        <button className="p-2 hover:bg-white rounded-full transition-colors">
          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 bg-gradient-to-b from-gray-50 to-white">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="bg-indigo-50 rounded-full p-6 mb-4">
              <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium mb-1">Start your conversation!</p>
            <p className="text-sm text-gray-500">
              Send a message to {otherUser.firstName} to begin chatting
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {messages.map((message) => {
              const isOwnMessage = message.senderId === user?.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[70%] ${
                      isOwnMessage
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    } rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm`}
                  >
                    <p className="text-sm sm:text-base break-words">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isOwnMessage ? 'text-indigo-200' : 'text-gray-500'
                      }`}
                    >
                      {formatRelativeTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="px-3 sm:px-4 py-3 sm:py-4 border-t bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message ${otherUser.firstName}...`}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 sm:p-2.5 rounded-full hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            {sending ? (
              <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
