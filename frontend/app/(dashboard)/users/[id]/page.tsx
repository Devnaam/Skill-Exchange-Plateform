'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { status, data: session } = useSession();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<string>('NONE');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      loadUserProfile();
    }
  }, [status, params.id]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const userResponse = await api.get(`/users/${params.id}`);
      setUser(userResponse.data.user);

      // Check connection status
      const statusResponse = await api.get(`/connections/status/${params.id}`);
      setConnectionStatus(statusResponse.data.status);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setSending(true);
      await api.post('/connections/send', {
        receiverId: params.id,
        message: 'Hi! I would love to connect and exchange skills with you.',
      });
      setConnectionStatus('PENDING');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to send connection request');
    } finally {
      setSending(false);
    }
  };

  const handleMessage = () => {
    router.push(`/messages?user=${params.id}`);
  };

  if (loading) {
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

  if (!user) {
    return (
      <DashboardLayout>
        <Card className="text-center py-12">
          <p className="text-slate-600">User not found</p>
        </Card>
      </DashboardLayout>
    );
  }

  const isOwnProfile = user.id === session?.user?.id;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Premium Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          
          <div className="relative px-6 sm:px-8 py-12 sm:py-16">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
              {/* Avatar with ring */}
              <div className="relative">
                <div className="absolute -inset-2 bg-white/20 rounded-full blur-xl"></div>
                <Avatar
                  firstName={user.firstName}
                  lastName={user.lastName}
                  src={user.profileImage}
                  size="2xl"
                  className="relative ring-4 ring-white/30 shadow-2xl"
                />
                {/* Online status indicator */}
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {user.firstName} {user.lastName}
                </h1>
                {user.username && (
                  <p className="text-xl text-indigo-100 mb-3">@{user.username}</p>
                )}
                {user.location && (
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg px-4 py-2 rounded-full border border-white/20">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-white font-medium">{user.location}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {isOwnProfile ? (
                  <Link
                    href="/profile/edit"
                    className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-lg font-semibold shadow-lg transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </Link>
                ) : (
                  <>
                    {connectionStatus === 'NONE' && (
                      <Button
                        onClick={handleConnect}
                        disabled={sending}
                        className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-lg font-semibold shadow-lg"
                      >
                        {sending ? 'Sending...' : 'Connect'}
                      </Button>
                    )}
                    {connectionStatus === 'PENDING' && (
                      <div className="bg-white/20 backdrop-blur-lg text-white px-6 py-3 rounded-lg font-semibold border border-white/30">
                        Request Pending
                      </div>
                    )}
                    {connectionStatus === 'ACCEPTED' && (
                      <Button
                        onClick={handleMessage}
                        className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-lg font-semibold shadow-lg"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Message
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        {user.bio && (
          <Card className="border border-slate-200">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-900 mb-2">About</h2>
                <p className="text-slate-700 leading-relaxed">{user.bio}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Skills Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skills Offered */}
          <Card className="border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Skills I Offer</h2>
                <p className="text-sm text-slate-600">What I can teach you</p>
              </div>
            </div>

            {user.skillsOffered && user.skillsOffered.length > 0 ? (
              <div className="space-y-3">
                {user.skillsOffered.map((userSkill: any) => (
                  <div
                    key={userSkill.id}
                    className="group p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl hover:from-green-50 hover:to-emerald-50 border border-slate-200 hover:border-green-300 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-900 group-hover:text-green-700 transition-colors">
                        {userSkill.skill.name}
                      </h4>
                      {userSkill.proficiencyLevel && (
                        <Badge variant="primary" className="text-xs">
                          {userSkill.proficiencyLevel}
                        </Badge>
                      )}
                    </div>
                    {userSkill.description && (
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {userSkill.description}
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
                <p className="text-slate-500 text-sm">No skills added yet</p>
              </div>
            )}
          </Card>

          {/* Skills Wanted */}
          <Card className="border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Skills I Want</h2>
                <p className="text-sm text-slate-600">What I want to learn</p>
              </div>
            </div>

            {user.skillsWanted && user.skillsWanted.length > 0 ? (
              <div className="space-y-3">
                {user.skillsWanted.map((userSkill: any) => (
                  <div
                    key={userSkill.id}
                    className="group p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl hover:from-indigo-50 hover:to-purple-50 border border-slate-200 hover:border-indigo-300 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
                        {userSkill.skill.name}
                      </h4>
                      {userSkill.proficiencyLevel && (
                        <Badge variant="secondary" className="text-xs">
                          {userSkill.proficiencyLevel}
                        </Badge>
                      )}
                    </div>
                    {userSkill.description && (
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {userSkill.description}
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
                <p className="text-slate-500 text-sm">No learning goals yet</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
