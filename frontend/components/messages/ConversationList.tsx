import React from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Conversation } from '@/types/message';
import { formatRelativeTime } from '@/utils/formatters';

interface ConversationListProps {
  conversations: Conversation[];
  onSelectConversation: (userId: string) => void;
  selectedUserId?: string;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  onSelectConversation,
  selectedUserId,
}) => {
  if (conversations.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {conversations.map((conversation) => (
        <button
          key={conversation.user.id}
          onClick={() => onSelectConversation(conversation.user.id)}
          className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
            selectedUserId === conversation.user.id ? 'bg-indigo-50' : ''
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar
                firstName={conversation.user.firstName}
                lastName={conversation.user.lastName}
                src={conversation.user.profileImage}
                size="md"
              />
              {conversation.unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {conversation.unreadCount}
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-sm text-gray-900 truncate">
                  {conversation.user.firstName} {conversation.user.lastName}
                </h4>
                {conversation.lastMessage && (
                  <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                    {formatRelativeTime(conversation.lastMessage.createdAt)}
                  </span>
                )}
              </div>
              
              {conversation.lastMessage ? (
                <p className="text-xs text-gray-600 truncate">
                  {conversation.lastMessage.content}
                </p>
              ) : (
                <p className="text-xs text-gray-400 italic">No messages yet</p>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
