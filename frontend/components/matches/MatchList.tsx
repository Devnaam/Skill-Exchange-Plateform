import React from 'react';
import { Match } from '@/types/match';
import { MatchCard } from './MatchCard';

interface MatchListProps {
  matches: Match[];
  loading?: boolean;
  emptyMessage?: string;
}

export const MatchList: React.FC<MatchListProps> = ({
  matches,
  loading = false,
  emptyMessage = 'No matches found',
}) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Finding your matches...</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
};
