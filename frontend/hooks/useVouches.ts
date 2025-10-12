import { useState } from 'react';
import api from '@/lib/api';
import { VouchStats } from '@/types/vouch';

export const useVouches = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserVouches = async (userId: string): Promise<VouchStats | null> => {
    try {
      setLoading(true);
      const response = await api.get(`/vouches/user/${userId}`);
      return response.data;
    } catch (err) {
      console.error('Failed to fetch vouches:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createVouch = async (data: {
    vouchedId: string;
    skillId?: string;
    comment?: string;
    rating?: number;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/vouches/create', data);
      return { success: true, vouch: response.data.vouch };
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to create vouch';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const deleteVouch = async (vouchId: string) => {
    try {
      await api.delete(`/vouches/${vouchId}`);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Failed to delete vouch' };
    }
  };

  return {
    loading,
    error,
    getUserVouches,
    createVouch,
    deleteVouch,
  };
};
