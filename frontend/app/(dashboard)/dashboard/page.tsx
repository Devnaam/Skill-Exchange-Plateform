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

export default function DashboardPage() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const { profile, loading: profileLoading } = useProfile();
  const [stats, setStats] = useState({
    connections: 0,
    matches: 0,
    unreadMessages: 0,
    skillsOffered: 0,
    skillsWanted: 0,
  });
  const [recentMatches, setRecentMatches] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      loadDashboardData();
    }
  }, [status]);

  const loadDashboardData = async () => {
    try {
      setLoadingStats(true);

      const connectionsRes = await api.get('/connections?status=ACCEPTED');
      const allConnections = [
        ...connectionsRes.data.sent,
        ...connectionsRes.data.received,
        ...connectionsRes.data.accepted,
      ];
      const uniqueConnections = Array.from(
        new Map(allConnections.map(c => [c.id, c])).values()
      );

      const matchesRes = await api.get('/matches');
      const postsRes = await api.get('/posts/feed');
      
      setStats({
        connections: uniqueConnections.length,
        matches: matchesRes.data.matches?.length || 0,
        unreadMessages: 0,
        skillsOffered: profile?.skillsOffered?.length || 0,
        skillsWanted: profile?.skillsWanted?.length || 0,
      });

      setRecentMatches((matchesRes.data.matches || []).slice(0, 3));
      setRecentPosts((postsRes.data.posts || []).slice(0, 3));

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (status === 'loading' || profileLoading || loadingStats) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
            <p className="text-slate-600 font-medium">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const completionPercentage = Math.round(
    ((profile?.firstName ? 1 : 0) +
      (profile?.lastName ? 1 : 0) +
      (profile?.bio ? 1 : 0) +
      (profile?.location ? 1 : 0) +
      (stats.skillsOffered > 0 ? 1 : 0) +
      (stats.skillsWanted > 0 ? 1 : 0)) /
      6 *
      100
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Avatar
                firstName={profile?.firstName || ''}
                lastName={profile?.lastName || ''}
                src={profile?.profileImage}
                size="lg"
                className="ring-4 ring-slate-100"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Welcome back, {profile?.firstName}
                </h1>
                <p className="text-slate-600 mt-1">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            <Link
              href="/profile/edit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Profile Completion */}
        {completionPercentage < 100 && (
          <Card className="bg-slate-50 border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-900">Complete Your Profile</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Your profile is {completionPercentage}% complete. Complete profiles get 3x more matches.
                </p>
                <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {!profile?.bio && (
                    <Link href="/profile/edit" className="text-xs bg-white px-3 py-1.5 rounded-md border border-slate-300 hover:border-indigo-600 hover:text-indigo-600 transition-colors">
                      Add bio
                    </Link>
                  )}
                  {stats.skillsOffered === 0 && (
                    <Link href="/skills/add" className="text-xs bg-white px-3 py-1.5 rounded-md border border-slate-300 hover:border-indigo-600 hover:text-indigo-600 transition-colors">
                      Add skills you offer
                    </Link>
                  )}
                  {stats.skillsWanted === 0 && (
                    <Link href="/skills/add" className="text-xs bg-white px-3 py-1.5 rounded-md border border-slate-300 hover:border-indigo-600 hover:text-indigo-600 transition-colors">
                      Add skills you want
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Link href="/connections">
            <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group border border-slate-200 hover:border-indigo-600">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-slate-100 group-hover:bg-indigo-100 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats.connections}</p>
              <p className="text-sm text-slate-600 mt-1">Connections</p>
            </Card>
          </Link>

          <Link href="/matches">
            <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group border border-slate-200 hover:border-indigo-600">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-slate-100 group-hover:bg-indigo-100 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats.matches}</p>
              <p className="text-sm text-slate-600 mt-1">Matches</p>
            </Card>
          </Link>

          <Link href="/messages">
            <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group border border-slate-200 hover:border-indigo-600">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-slate-100 group-hover:bg-indigo-100 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats.unreadMessages}</p>
              <p className="text-sm text-slate-600 mt-1">Messages</p>
            </Card>
          </Link>

          <Link href="/skills">
            <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group border border-slate-200 hover:border-indigo-600">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-slate-100 group-hover:bg-indigo-100 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats.skillsOffered}</p>
              <p className="text-sm text-slate-600 mt-1">Skills Offered</p>
            </Card>
          </Link>

          <Link href="/skills">
            <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group border border-slate-200 hover:border-indigo-600">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-slate-100 group-hover:bg-indigo-100 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats.skillsWanted}</p>
              <p className="text-sm text-slate-600 mt-1">Skills Wanted</p>
            </Card>
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Recent Matches */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Matches */}
            <Card className="border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Your Top Matches</h2>
                <Link href="/matches" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  View all →
                </Link>
              </div>

              {recentMatches.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-600 mb-4">No matches yet</p>
                  <Link
                    href="/matches"
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                  >
                    Find your matches →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentMatches.map((match: any) => (
                    <Link
                      key={match.id}
                      href={`/users/${match.id}`}
                      className="flex items-center space-x-4 p-4 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100"
                    >
                      <Avatar
                        firstName={match.firstName}
                        lastName={match.lastName}
                        src={match.profileImage}
                        size="md"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 truncate">
                          {match.firstName} {match.lastName}
                        </h4>
                        <p className="text-sm text-slate-600 truncate">{match.location}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {match.matchType === 'PERFECT_SWAP' && (
                            <Badge variant="primary" className="text-xs">Perfect Match</Badge>
                          )}
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              )}
            </Card>

            {/* Recent Posts */}
            <Card className="border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Community Feed</h2>
                <Link href="/feed" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  View all →
                </Link>
              </div>

              {recentPosts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <p className="text-slate-600 mb-4">No posts yet</p>
                  <Link
                    href="/feed"
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                  >
                    Explore the feed →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentPosts.map((post: any) => (
                    <div key={post.id} className="p-4 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center space-x-3 mb-3">
                        <Avatar
                          firstName={post.user.firstName}
                          lastName={post.user.lastName}
                          src={post.user.profileImage}
                          size="sm"
                        />
                        <div>
                          <p className="font-semibold text-sm text-slate-900">
                            {post.user.firstName} {post.user.lastName}
                          </p>
                          <p className="text-xs text-slate-500">2 hours ago</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-700 line-clamp-2">{post.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  href="/skills/add"
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
                >
                  <span className="text-sm font-medium text-slate-700">Add New Skill</span>
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/matches"
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
                >
                  <span className="text-sm font-medium text-slate-700">Find Matches</span>
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/feed"
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
                >
                  <span className="text-sm font-medium text-slate-700">Create Post</span>
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </Card>

            {/* Daily Tip */}
            <Card className="border border-indigo-200 bg-indigo-50">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Tip of the Day</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Active users get 5x more connections! Try sending 3 connection requests today.
                  </p>
                </div>
              </div>
            </Card>

            {/* Profile Strength */}
            <Card className="border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Profile Strength</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Profile Photo</span>
                  <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Bio Added</span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${profile?.bio ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                    {profile?.bio && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Skills Added</span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${stats.skillsOffered > 0 ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                    {stats.skillsOffered > 0 && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">First Connection</span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${stats.connections > 0 ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                    {stats.connections > 0 && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
