import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Match } from '@/types/match';
import { formatName } from '@/utils/formatters';

interface MatchCardProps {
  match: Match;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const getMatchBadge = () => {
    switch (match.matchType) {
      case 'PERFECT_SWAP':
        return <Badge variant="success">🎯 Perfect Match</Badge>;
      case 'TEACHER':
        return <Badge variant="primary">👨‍🏫 Can Teach You</Badge>;
      case 'LEARNER':
        return <Badge variant="warning">👨‍🎓 Wants to Learn</Badge>;
      default:
        return null;
    }
  };

  const offeredSkills = match.userSkills?.filter((us) => us.type === 'OFFERED') || [];
  const wantedSkills = match.userSkills?.filter((us) => us.type === 'WANTED') || [];

  return (
    <Link href={`/users/${match.id}`}>
      <Card className="hover:shadow-xl transition-shadow cursor-pointer">
        <div className="flex items-start space-x-4">
          <Avatar
            firstName={match.firstName}
            lastName={match.lastName}
            src={match.profileImage}
            size="lg"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {formatName(match.firstName, match.lastName)}
              </h3>
              {getMatchBadge()}
            </div>
            {match.username && (
              <p className="text-sm text-gray-600">@{match.username}</p>
            )}
            {match.location && (
              <p className="text-sm text-gray-500 mt-1">📍 {match.location}</p>
            )}
            {match.bio && (
              <p className="text-sm text-gray-700 mt-2 line-clamp-2">{match.bio}</p>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Can Teach</p>
            <div className="flex flex-wrap gap-1">
              {offeredSkills.slice(0, 3).map((us) => (
                <Badge key={us.id} variant="primary" className="text-xs">
                  {us.skill.name}
                </Badge>
              ))}
              {offeredSkills.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{offeredSkills.length - 3}
                </Badge>
              )}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Wants to Learn</p>
            <div className="flex flex-wrap gap-1">
              {wantedSkills.slice(0, 3).map((us) => (
                <Badge key={us.id} variant="success" className="text-xs">
                  {us.skill.name}
                </Badge>
              ))}
              {wantedSkills.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{wantedSkills.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
