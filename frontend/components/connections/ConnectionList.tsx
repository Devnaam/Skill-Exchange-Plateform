import React from 'react';
import { Connection } from '@/types/connection';
import { ConnectionCard } from './ConnectionCard';

interface ConnectionListProps {
  connections: Connection[];
  type: 'sent' | 'received' | 'accepted';
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
  onMessage?: (userId: string) => void;
  emptyMessage?: string;
}

export const ConnectionList: React.FC<ConnectionListProps> = ({
  connections,
  type,
  onAccept,
  onReject,
  onCancel,
  onMessage,
  emptyMessage = 'No connections found',
}) => {
  if (connections.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {connections.map((connection) => (
        <ConnectionCard
          key={connection.id}
          connection={connection}
          type={type}
          onAccept={onAccept}
          onReject={onReject}
          onCancel={onCancel}
          onMessage={onMessage}
        />
      ))}
    </div>
  );
};
