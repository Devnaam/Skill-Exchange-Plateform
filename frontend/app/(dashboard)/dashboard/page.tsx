'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useProfile } from '@/hooks/useProfile';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const { profile, loading, error } = useProfile();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (loading || status === 'loading') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-lg text-gray-600">Loading dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !profile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-lg text-red-600">Error loading profile</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile.firstName}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your skill exchanges
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProfileCard
              profile={profile}
              isOwner={true}
              onEdit={() => router.push('/profile/edit')}
            />

            <Card className="mt-6">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/skills/add">
                  <Button variant="primary" className="w-full">
                    + Add Skills
                  </Button>
                </Link>
                <Link href="/matches">
                  <Button variant="secondary" className="w-full">
                    Find Matches
                  </Button>
                </Link>
                <Link href="/connections">
                  <Button variant="ghost" className="w-full">
                    View Connections
                  </Button>
                </Link>
                <Link href="/messages">
                  <Button variant="ghost" className="w-full">
                    Messages
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold mb-3">Activity Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Profile Views</span>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Connections</span>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Matches Found</span>
                  <span className="font-bold">0</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-3">Complete Your Profile</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <span className={profile.bio ? 'text-green-600' : 'text-gray-400'}>
                    {profile.bio ? '✓' : '○'}
                  </span>
                  <span className="ml-2">Add bio</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className={profile.username ? 'text-green-600' : 'text-gray-400'}>
                    {profile.username ? '✓' : '○'}
                  </span>
                  <span className="ml-2">Set username</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className={profile.skillsOffered && profile.skillsOffered.length > 0 ? 'text-green-600' : 'text-gray-400'}>
                    {profile.skillsOffered && profile.skillsOffered.length > 0 ? '✓' : '○'}
                  </span>
                  <span className="ml-2">Add skills to offer</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className={profile.skillsWanted && profile.skillsWanted.length > 0 ? 'text-green-600' : 'text-gray-400'}>
                    {profile.skillsWanted && profile.skillsWanted.length > 0 ? '✓' : '○'}
                  </span>
                  <span className="ml-2">Add skills to learn</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
