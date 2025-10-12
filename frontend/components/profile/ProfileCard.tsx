import React from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { EXCHANGE_PREFERENCES } from '@/utils/constants';
import { formatDate } from '@/utils/formatters';
import { ProfileWithSkills } from '@/types';

interface ProfileCardProps {
  profile: ProfileWithSkills;
  isOwner?: boolean;
  onEdit?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  isOwner = false,
  onEdit,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Avatar
            firstName={profile.firstName}
            lastName={profile.lastName}
            src={profile.profileImage}
            size="xl"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {profile.firstName} {profile.lastName}
            </h2>
            {profile.username && (
              <p className="text-gray-600">@{profile.username}</p>
            )}
            {profile.location && (
              <p className="text-gray-500 text-sm mt-1">📍 {profile.location}</p>
            )}
          </div>
        </div>
        {isOwner && onEdit && (
          <button
            onClick={onEdit}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Edit Profile
          </button>
        )}
      </div>

      {profile.bio && (
        <div className="mt-4">
          <p className="text-gray-700">{profile.bio}</p>
        </div>
      )}

      <div className="mt-4 flex items-center space-x-4">
        <Badge variant="primary">
          {EXCHANGE_PREFERENCES[profile.exchangePreference || 'FLEXIBLE']}
        </Badge>
        {profile.isVerified && (
          <Badge variant="success">✓ Verified</Badge>
        )}
        <span className="text-sm text-gray-500">
          Member since {formatDate(profile.createdAt || new Date().toISOString())}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-4">
        <div>
          <p className="text-2xl font-bold text-indigo-600">
            {profile.skillsOffered?.length || 0}
          </p>
          <p className="text-sm text-gray-600">Skills Offered</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-green-600">
            {profile.skillsWanted?.length || 0}
          </p>
          <p className="text-sm text-gray-600">Skills Wanted</p>
        </div>
      </div>
    </div>
  );
};
