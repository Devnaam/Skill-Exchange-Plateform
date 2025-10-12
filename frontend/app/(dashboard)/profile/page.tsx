'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useProfile } from '@/hooks/useProfile';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { Card } from '@/components/ui/Card';

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();
  const { profile, loading } = useProfile();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (loading || status === 'loading') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-lg text-gray-600">Loading profile...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-lg text-red-600">Profile not found</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <ProfileCard
          profile={profile}
          isOwner={true}
          onEdit={() => router.push('/profile/edit')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-xl font-bold mb-4 text-indigo-600">
              Skills I Offer
            </h3>
            {profile.skillsOffered && profile.skillsOffered.length > 0 ? (
              <div className="space-y-2">
                {profile.skillsOffered.map((userSkill) => (
                  <div
                    key={userSkill.id}
                    className="p-3 bg-indigo-50 rounded-lg"
                  >
                    <p className="font-semibold">{userSkill.skill.name}</p>
                    {userSkill.proficiencyLevel && (
                      <p className="text-sm text-gray-600">
                        Level: {userSkill.proficiencyLevel}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No skills added yet</p>
            )}
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-4 text-green-600">
              Skills I Want to Learn
            </h3>
            {profile.skillsWanted && profile.skillsWanted.length > 0 ? (
              <div className="space-y-2">
                {profile.skillsWanted.map((userSkill) => (
                  <div
                    key={userSkill.id}
                    className="p-3 bg-green-50 rounded-lg"
                  >
                    <p className="font-semibold">{userSkill.skill.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No skills added yet</p>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
