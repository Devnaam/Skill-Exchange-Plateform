'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useMatches } from '@/hooks/useMatches';
import { ConnectionRequest } from '@/components/connections/ConnectionRequest';
import { VouchSection } from '@/components/profile/VouchSection';
import { VouchModal } from '@/components/profile/VouchModal';
import { ReportModal } from '@/components/report/ReportModal';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MatchDetails } from '@/types/match';
import { formatDate } from '@/utils/formatters';

export default function UserProfilePage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const { getMatchDetails } = useMatches();
  const [matchDetails, setMatchDetails] = useState<MatchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVouchModal, setShowVouchModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [vouchKey, setVouchKey] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      loadMatchDetails();
    }
  }, [status, userId]);

  const loadMatchDetails = async () => {
    setLoading(true);
    const details = await getMatchDetails(userId);
    setMatchDetails(details);
    setLoading(false);
  };

  const handleVouchSuccess = () => {
    setVouchKey((prev) => prev + 1);
  };

  if (loading || status === 'loading') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-lg text-gray-600">Loading profile...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!matchDetails) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-lg text-red-600">User not found</div>
        </div>
      </DashboardLayout>
    );
  }

  const { user, matchType, theyCanTeachMe, iCanTeachThem } = matchDetails;

  const getMatchTypeDisplay = () => {
    switch (matchType) {
      case 'PERFECT_SWAP':
        return (
          <Badge variant="success" className="text-lg">
            🎯 Perfect Match - You can teach each other!
          </Badge>
        );
      case 'TEACHER':
        return (
          <Badge variant="primary" className="text-lg">
            👨‍🏫 They can teach you
          </Badge>
        );
      case 'LEARNER':
        return (
          <Badge variant="warning" className="text-lg">
            👨‍🎓 They want to learn from you
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Avatar
                firstName={user.firstName}
                lastName={user.lastName}
                src={user.profileImage}
                size="xl"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h1>
                {user.username && (
                  <p className="text-gray-600">@{user.username}</p>
                )}
                {user.location && (
                  <p className="text-gray-500 mt-1">📍 {user.location}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Member since {formatDate(user.createdAt || '')}
                </p>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <ConnectionRequest userId={user.id} userName={user.firstName} />
              <Button
                onClick={() => setShowVouchModal(true)}
                variant="secondary"
                size="sm"
              >
                ⭐ Vouch
              </Button>
              <button
                onClick={() => setShowReportModal(true)}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Report User
              </button>
            </div>
          </div>

          {user.bio && <p className="mt-4 text-gray-700">{user.bio}</p>}

          <div className="mt-4">{getMatchTypeDisplay()}</div>
        </Card>

        {theyCanTeachMe.length > 0 && (
          <Card>
            <h2 className="text-xl font-bold text-indigo-600 mb-4">
              They Can Teach You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {theyCanTeachMe.map((us) => (
                <div key={us.id} className="p-3 bg-indigo-50 rounded-lg">
                  <p className="font-semibold">{us.skill.name}</p>
                  {us.proficiencyLevel && (
                    <p className="text-sm text-gray-600">Level: {us.proficiencyLevel}</p>
                  )}
                  {us.description && (
                    <p className="text-sm text-gray-700 mt-1">{us.description}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {iCanTeachThem.length > 0 && (
          <Card>
            <h2 className="text-xl font-bold text-green-600 mb-4">
              You Can Teach Them
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {iCanTeachThem.map((us) => (
                <div key={us.id} className="p-3 bg-green-50 rounded-lg">
                  <p className="font-semibold">{us.skill.name}</p>
                  {us.proficiencyLevel && (
                    <p className="text-sm text-gray-600">Level: {us.proficiencyLevel}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        <VouchSection key={vouchKey} userId={user.id} />

        <Card>
          <h2 className="text-xl font-bold mb-4">All Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-indigo-600 mb-3">Can Teach</h3>
              <div className="flex flex-wrap gap-2">
                {user.userSkills
                  ?.filter((us) => us.type === 'OFFERED')
                  .map((us) => (
                    <Badge key={us.id} variant="primary">
                      {us.skill.name}
                    </Badge>
                  ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-green-600 mb-3">Wants to Learn</h3>
              <div className="flex flex-wrap gap-2">
                {user.userSkills
                  ?.filter((us) => us.type === 'WANTED')
                  .map((us) => (
                    <Badge key={us.id} variant="success">
                      {us.skill.name}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {showVouchModal && (
        <VouchModal
          userId={user.id}
          userName={user.firstName}
          onClose={() => setShowVouchModal(false)}
          onSuccess={handleVouchSuccess}
        />
      )}

      {showReportModal && (
        <ReportModal
          userId={user.id}
          userName={`${user.firstName} ${user.lastName}`}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </DashboardLayout>
  );
}
