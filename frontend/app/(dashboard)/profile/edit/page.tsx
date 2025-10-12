'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useProfile } from '@/hooks/useProfile';
import { ProfileEdit } from '@/components/profile/ProfileEdit';
import { UpdateProfileData } from '@/types';

export default function EditProfilePage() {
  const { status } = useSession();
  const router = useRouter();
  const { profile, loading, updateProfile } = useProfile();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleSave = async (data: UpdateProfileData) => {
    const result = await updateProfile(data);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } else {
      throw new Error(result.error);
    }
  };

  if (loading || status === 'loading') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-lg text-gray-600">Loading...</div>
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
      <div className="max-w-2xl mx-auto">
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-md">
            ✓ Profile updated successfully! Redirecting...
          </div>
        )}
        <ProfileEdit
          profile={profile}
          onSave={handleSave}
          onCancel={() => router.push('/profile')}
        />
      </div>
    </DashboardLayout>
  );
}
