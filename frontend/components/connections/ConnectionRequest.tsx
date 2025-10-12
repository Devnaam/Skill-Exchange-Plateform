'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { useConnections } from '@/hooks/useConnections';
import { ConnectionStatusResponse } from '@/types/connection';

interface ConnectionRequestProps {
  userId: string;
  userName: string;
}

export const ConnectionRequest: React.FC<ConnectionRequestProps> = ({
  userId,
  userName,
}) => {
  const { sendRequest, cancelRequest, getConnectionStatus } = useConnections();
  const [status, setStatus] = useState<ConnectionStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showMessageInput, setShowMessageInput] = useState(false);

  useEffect(() => {
    loadStatus();
  }, [userId]);

  const loadStatus = async () => {
    const result = await getConnectionStatus(userId);
    setStatus(result);
  };

  const handleSendRequest = async () => {
    setLoading(true);
    const result = await sendRequest(userId, message);
    if (result.success) {
      await loadStatus();
      setShowMessageInput(false);
      setMessage('');
    }
    setLoading(false);
  };

  const handleCancel = async () => {
    if (status?.connection) {
      setLoading(true);
      await cancelRequest(status.connection.id);
      await loadStatus();
      setLoading(false);
    }
  };

  if (!status) {
    return null;
  }

  if (status.status === 'NONE') {
    return (
      <div>
        {!showMessageInput ? (
          <Button
            onClick={() => setShowMessageInput(true)}
            variant="primary"
            disabled={loading}
          >
            Send Connection Request
          </Button>
        ) : (
          <div className="space-y-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Add a message to ${userName}...`}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="flex space-x-2">
              <Button
                onClick={handleSendRequest}
                variant="primary"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Request'}
              </Button>
              <Button
                onClick={() => setShowMessageInput(false)}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (status.status === 'PENDING' && status.isSender) {
    return (
      <div className="space-y-2">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-md">
          ⏳ Connection request sent
        </div>
        <Button
          onClick={handleCancel}
          variant="secondary"
          size="sm"
          disabled={loading}
        >
          Cancel Request
        </Button>
      </div>
    );
  }

  if (status.status === 'PENDING' && !status.isSender) {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-md">
        📨 Sent you a connection request (check Connections page)
      </div>
    );
  }

  if (status.status === 'ACCEPTED') {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-md">
        ✓ Connected
      </div>
    );
  }

  if (status.status === 'REJECTED') {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-md">
        Connection request declined
      </div>
    );
  }

  return null;
};
