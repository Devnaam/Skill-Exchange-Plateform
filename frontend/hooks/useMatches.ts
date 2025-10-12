import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Match, MatchDetails } from '@/types/match';

export const useMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async (type?: 'perfect' | 'teachers' | 'learners') => {
    try {
      setLoading(true);
      setError(null);
      const params = type ? `?type=${type}` : '';
      const response = await api.get(`/matches${params}`);
      setMatches(response.data.matches);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (query: string, filters?: any) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.location) params.append('location', filters.location);
      if (filters?.skillType) params.append('skillType', filters.skillType);

      const response = await api.get(`/matches/search?${params.toString()}`);
      setMatches(response.data.users);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const getMatchDetails = async (matchId: string): Promise<MatchDetails | null> => {
    try {
      const response = await api.get(`/matches/${matchId}`);
      return response.data;
    } catch (err: any) {
      console.error('Failed to fetch match details:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return {
    matches,
    loading,
    error,
    fetchMatches,
    searchUsers,
    getMatchDetails,
  };
};
