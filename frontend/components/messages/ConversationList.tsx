import React from 'react';
import { Card } from '@/components/ui/Card';
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
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <Card
          key={conversation.user.id}
          onClick={() => onSelectConversation(conversation.user.id)}
          className={`cursor-pointer transition-colors ${
            selectedUserId === conversation.user.id
              ? 'bg-indigo-50 border-indigo-300'
              : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar
                firstName={conversation.user.firstName}
                lastName={conversation.user.lastName}
                src={conversation.user.profileImage}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">
                  {conversation.user.firstName} {conversation.user.lastName}
                </h4>
                {conversation.lastMessage && (
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage.content}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              {conversation.lastMessage && (
                <p className="text-xs text-gray-500">
                  {formatRelativeTime(conversation.lastMessage.createdAt)}
                </p>
              )}
              {conversation.unreadCount > 0 && (
                <Badge variant="danger" className="text-xs">
                  {conversation.unreadCount}
                </Badge>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
