import React from 'react';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Connection } from '@/types/connection';
import { formatRelativeTime } from '@/utils/formatters';
import { useAuth } from '@/hooks/useAuth';

interface ConnectionCardProps {
  connection: Connection;
  type: 'sent' | 'received' | 'accepted';
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
  onMessage?: (userId: string) => void;
}

export const ConnectionCard: React.FC<ConnectionCardProps> = ({
  connection,
  type,
  onAccept,
  onReject,
  onCancel,
  onMessage,
}) => {
  const { user: currentUser } = useAuth();
  
  // IMPORTANT: Determine which user is the "other" user
  const otherUser = connection.senderId === currentUser?.id 
    ? connection.receiver 
    : connection.sender;

  console.log('ConnectionCard Debug:', {
    currentUserId: currentUser?.id,
    senderId: connection.senderId,
    receiverId: connection.receiverId,
    otherUserId: otherUser.id,
    otherUserName: `${otherUser.firstName} ${otherUser.lastName}`
  });

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Avatar
            firstName={otherUser.firstName}
            lastName={otherUser.lastName}
            src={otherUser.profileImage}
            size="md"
          />
          <div>
            <h4 className="font-semibold text-gray-900">
              {otherUser.firstName} {otherUser.lastName}
            </h4>
            {otherUser.username && (
              <p className="text-sm text-gray-600">@{otherUser.username}</p>
            )}
            {otherUser.location && (
              <p className="text-xs text-gray-500">📍 {otherUser.location}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {formatRelativeTime(connection.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          {type === 'received' && (
            <>
              <Button
                onClick={() => onAccept && onAccept(connection.id)}
                variant="primary"
                size="sm"
              >
                Accept
              </Button>
              <Button
                onClick={() => onReject && onReject(connection.id)}
                variant="danger"
                size="sm"
              >
                Reject
              </Button>
            </>
          )}

          {type === 'sent' && (
            <Button
              onClick={() => onCancel && onCancel(connection.id)}
              variant="secondary"
              size="sm"
            >
              Cancel
            </Button>
          )}

          {type === 'accepted' && (
            <Button
              onClick={() => {
                console.log('Message button clicked for user:', otherUser.id);
                onMessage && onMessage(otherUser.id);
              }}
              variant="primary"
              size="sm"
            >
              Message
            </Button>
          )}
        </div>
      </div>

      {connection.message && (
        <p className="mt-3 text-sm text-gray-700 bg-gray-50 p-3 rounded">
          "{connection.message}"
        </p>
      )}
    </Card>
  );
};
