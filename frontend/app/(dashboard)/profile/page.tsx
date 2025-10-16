'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useProfile } from '@/hooks/useProfile';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import api from '@/lib/api';

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();
  const { profile, loading } = useProfile();
  const [stats, setStats] = useState({
    connections: 0,
    vouches: 0,
    skillsShared: 0,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && profile) {
      loadStats();
    }
  }, [status, profile]);

  const loadStats = async () => {
    try {
      const connectionsRes = await api.get('/connections?status=ACCEPTED');
      const allConnections = [
        ...connectionsRes.data.sent,
        ...connectionsRes.data.received,
        ...connectionsRes.data.accepted,
      ];
      const uniqueConnections = Array.from(
        new Map(allConnections.map(c => [c.id, c])).values()
      );

      setStats({
        connections: uniqueConnections.length,
        vouches: 0, // TODO: Implement vouches
        skillsShared: (profile?.skillsOffered?.length || 0) + (profile?.skillsWanted?.length || 0),
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  if (loading || status === 'loading') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200"></div>
              <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
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

  const completionPercentage = Math.round(
    ((profile.firstName ? 1 : 0) +
      (profile.lastName ? 1 : 0) +
      (profile.bio ? 1 : 0) +
      (profile.location ? 1 : 0) +
      (profile.skillsOffered?.length > 0 ? 1 : 0) +
      (profile.skillsWanted?.length > 0 ? 1 : 0)) /
      6 *
      100
  );

  const memberSince = new Date(profile.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Cover Photo & Profile Header */}
        <div className="relative">
          {/* Cover Photo */}
          <div className="h-48 sm:h-64 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          </div>

          {/* Profile Info Overlay */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="relative -mt-16 sm:-mt-20">
              <Card className="border border-slate-200 p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="absolute -inset-1 bg-white rounded-full"></div>
                    <Avatar
                      firstName={profile.firstName}
                      lastName={profile.lastName}
                      src={profile.profileImage}
                      size="2xl"
                      className="relative ring-4 ring-white"
                    />
                    {/* Online Status */}
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                          {profile.firstName} {profile.lastName}
                        </h1>
                        {profile.username && (
                          <p className="text-slate-600 mt-1">@{profile.username}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 mt-3">
                          {profile.location && (
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="text-sm">{profile.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm">Joined {memberSince}</span>
                          </div>
                        </div>
                      </div>

                      <Link
                        href="/profile/edit"
                        className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Profile
                      </Link>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200">
                      <Link href="/connections" className="text-center hover:bg-slate-50 rounded-lg p-2 transition-colors">
                        <p className="text-2xl font-bold text-slate-900">{stats.connections}</p>
                        <p className="text-xs text-slate-600 mt-1">Connections</p>
                      </Link>
                      <div className="text-center p-2">
                        <p className="text-2xl font-bold text-slate-900">{stats.skillsShared}</p>
                        <p className="text-xs text-slate-600 mt-1">Total Skills</p>
                      </div>
                      <div className="text-center p-2">
                        <p className="text-2xl font-bold text-slate-900">{stats.vouches}</p>
                        <p className="text-xs text-slate-600 mt-1">Vouches</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Profile Completion */}
              {completionPercentage < 100 && (
                <Card className="border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-4">Complete Your Profile</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-slate-600">Profile Strength</span>
                        <span className="font-semibold text-indigo-600">{completionPercentage}%</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 transition-all duration-500"
                          style={{ width: `${completionPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      {!profile.bio && (
                        <Link href="/profile/edit" className="flex items-center justify-between text-slate-700 hover:text-indigo-600 transition-colors">
                          <span>Add bio</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      )}
                      {!profile.location && (
                        <Link href="/profile/edit" className="flex items-center justify-between text-slate-700 hover:text-indigo-600 transition-colors">
                          <span>Add location</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      )}
                      {profile.skillsOffered?.length === 0 && (
                        <Link href="/skills/add" className="flex items-center justify-between text-slate-700 hover:text-indigo-600 transition-colors">
                          <span>Add skills you offer</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              )}

              {/* About */}
              {profile.bio && (
                <Card className="border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-3">About</h3>
                  <p className="text-slate-700 leading-relaxed text-sm">{profile.bio}</p>
                </Card>
              )}

              {/* Location Details (Future Feature Preview) */}
              {profile.location && (
                <Card className="border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-900">Location</h3>
                    <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 text-sm">{profile.location}</p>
                        <p className="text-xs text-slate-600 mt-1">Open to in-person & online exchanges</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600">
                      <p className="font-medium mb-1">🎯 Nearby Search Coming Soon!</p>
                      <p>Soon you'll be able to find skills within 5km, 10km, or 25km radius.</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column - Skills */}
            <div className="lg:col-span-2 space-y-6">
              {/* Skills I Offer */}
              <Card className="border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Skills I Offer</h2>
                      <p className="text-xs text-slate-600">What I can teach you</p>
                    </div>
                  </div>
                  <Link
                    href="/skills/add"
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    + Add Skill
                  </Link>
                </div>

                {profile.skillsOffered && profile.skillsOffered.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.skillsOffered.map((userSkill: any) => (
                      <div
                        key={userSkill.id}
                        className="group p-4 bg-slate-50 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                            {userSkill.skill.name}
                          </h4>
                          {userSkill.proficiencyLevel && (
                            <Badge variant="primary" className="text-xs">
                              {userSkill.proficiencyLevel}
                            </Badge>
                          )}
                        </div>
                        {userSkill.description && (
                          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                            {userSkill.description}
                          </p>
                        )}
                        {userSkill.skill.category && (
                          <p className="text-xs text-slate-500 mt-2">
                            {userSkill.skill.category.name}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-xl">
                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
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
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Skills I Want to Learn</h2>
                      <p className="text-xs text-slate-600">What I'm looking for</p>
                    </div>
                  </div>
                  <Link
                    href="/skills/add"
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    + Add Skill
                  </Link>
                </div>

                {profile.skillsWanted && profile.skillsWanted.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.skillsWanted.map((userSkill: any) => (
                      <div
                        key={userSkill.id}
                        className="group p-4 bg-slate-50 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                            {userSkill.skill.name}
                          </h4>
                        </div>
                        {userSkill.description && (
                          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                            {userSkill.description}
                          </p>
                        )}
                        {userSkill.skill.category && (
                          <p className="text-xs text-slate-500 mt-2">
                            {userSkill.skill.category.name}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-xl">
                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
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
        </div>
      </div>
    </DashboardLayout>
  );
}
