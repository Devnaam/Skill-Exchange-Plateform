import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { ProfileWithSkills } from '@/types';

export const useProfile = () => {
  const [profile, setProfile] = useState<ProfileWithSkills | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/users/profile');
      setProfile(response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: any) => {
    try {
      const response = await api.put('/users/profile', data);
      setProfile(response.data.user);
      return { success: true, user: response.data.user };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Failed to update profile' };
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
  };
};
