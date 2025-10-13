'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useProfile } from '@/hooks/useProfile';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();
  const { profile, loading } = useProfile();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status]);

  if (loading || status === 'loading') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
            <p className="text-slate-600 font-medium">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <Card className="text-center py-12">
          <p className="text-slate-600">Profile not found</p>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Card */}
        <Card className="border border-slate-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
              <Avatar
                firstName={profile.firstName}
                lastName={profile.lastName}
                src={profile.profileImage}
                size="xl"
                className="ring-4 ring-slate-100"
              />
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {profile.firstName} {profile.lastName}
                </h1>
                {profile.username && (
                  <p className="text-slate-600 mt-1">@{profile.username}</p>
                )}
                {profile.location && (
                  <div className="flex items-center text-slate-600 mt-2">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {profile.location}
                  </div>
                )}
              </div>
            </div>
            
            <Link
              href="/profile/edit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm w-full sm:w-auto text-center"
            >
              Edit Profile
            </Link>
          </div>

          {profile.bio && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="text-sm font-medium text-slate-600 mb-2">About</h3>
              <p className="text-slate-900 leading-relaxed">{profile.bio}</p>
            </div>
          )}
        </Card>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skills I Offer */}
          <Card className="border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Skills I Offer</h2>
              <Link
                href="/skills/add"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                + Add Skill
              </Link>
            </div>

            {profile.skillsOffered && profile.skillsOffered.length > 0 ? (
              <div className="space-y-3">
                {profile.skillsOffered.map((userSkill: any) => (
                  <div
                    key={userSkill.id}
                    className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-900">{userSkill.skill.name}</h4>
                      {userSkill.proficiencyLevel && (
                        <Badge variant="primary" className="text-xs">
                          {userSkill.proficiencyLevel}
                        </Badge>
                      )}
                    </div>
                    {userSkill.description && (
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {userSkill.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-slate-600 mb-4">No skills added yet</p>
                <Link
                  href="/skills/add"
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                >
                  Add your first skill →
                </Link>
              </div>
            )}
          </Card>

          {/* Skills I Want */}
          <Card className="border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Skills I Want to Learn</h2>
              <Link
                href="/skills/add"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                + Add Skill
              </Link>
            </div>

            {profile.skillsWanted && profile.skillsWanted.length > 0 ? (
              <div className="space-y-3">
                {profile.skillsWanted.map((userSkill: any) => (
                  <div
                    key={userSkill.id}
                    className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-900">{userSkill.skill.name}</h4>
                      {userSkill.proficiencyLevel && (
                        <Badge variant="secondary" className="text-xs">
                          {userSkill.proficiencyLevel}
                        </Badge>
                      )}
                    </div>
                    {userSkill.description && (
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {userSkill.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-slate-600 mb-4">No learning goals yet</p>
                <Link
                  href="/skills/add"
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                >
                  Add skills you want to learn →
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
