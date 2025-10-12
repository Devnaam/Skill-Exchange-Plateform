import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Connection, ConnectionStatusResponse } from '@/types/connection';

export const useConnections = () => {
  const [connections, setConnections] = useState<{
    sent: Connection[];
    received: Connection[];
    accepted: Connection[];
  }>({ sent: [], received: [], accepted: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/connections');
      setConnections({
        sent: response.data.sent,
        received: response.data.received,
        accepted: response.data.accepted,
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch connections');
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (receiverId: string, message?: string) => {
    try {
      const response = await api.post('/connections/request', {
        receiverId,
        message,
      });
      await fetchConnections();
      return { success: true, connection: response.data.connection };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Failed to send request' };
    }
  };

  const acceptRequest = async (connectionId: string) => {
    try {
      await api.put(`/connections/${connectionId}/accept`);
      await fetchConnections();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Failed to accept request' };
    }
  };

  const rejectRequest = async (connectionId: string) => {
    try {
      await api.put(`/connections/${connectionId}/reject`);
      await fetchConnections();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Failed to reject request' };
    }
  };

  const cancelRequest = async (connectionId: string) => {
    try {
      await api.delete(`/connections/${connectionId}/cancel`);
      await fetchConnections();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Failed to cancel request' };
    }
  };

  const getConnectionStatus = async (targetUserId: string): Promise<ConnectionStatusResponse | null> => {
    try {
      const response = await api.get(`/connections/status/${targetUserId}`);
      return response.data;
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return {
    connections,
    loading,
    error,
    fetchConnections,
    sendRequest,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    getConnectionStatus,
  };
};
