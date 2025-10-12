'use client';

import React, { useState, useEffect, useRef } from 'react';
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
}

export const ChatBox: React.FC<ChatBoxProps> = ({
  otherUser,
  messages,
  onSendMessage,
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
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex items-center space-x-3 p-4 border-b">
        <Avatar
          firstName={otherUser.firstName}
          lastName={otherUser.lastName}
          src={otherUser.profileImage}
          size="md"
        />
        <div>
          <h3 className="font-semibold text-gray-900">
            {otherUser.firstName} {otherUser.lastName}
          </h3>
          {otherUser.username && (
            <p className="text-sm text-gray-600">@{otherUser.username}</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.senderId === user?.id;
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] ${
                    isOwnMessage
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  } rounded-lg px-4 py-2`}
                >
                  <p className="text-sm">{message.content}</p>
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
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={sending}
          />
          <Button type="submit" variant="primary" disabled={sending || !newMessage.trim()}>
            {sending ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </form>
    </div>
  );
};
