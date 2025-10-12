'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useSkills } from '@/hooks/useSkills';
import { SkillList } from '@/components/skills/SkillList';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function SkillsPage() {
  const { status } = useSession();
  const router = useRouter();
  const { userSkills, loading, deleteSkill } = useSkills();
  const [activeTab, setActiveTab] = useState<'offered' | 'wanted'>('offered');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this skill?')) {
      await deleteSkill(id);
    }
  };

  if (loading || status === 'loading') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-lg text-gray-600">Loading skills...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My Skills</h1>
          <Link href="/skills/add">
            <Button variant="primary">+ Add New Skill</Button>
          </Link>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('offered')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'offered'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Skills I Offer ({userSkills.offered.length})
            </button>
            <button
              onClick={() => setActiveTab('wanted')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'wanted'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Skills I Want to Learn ({userSkills.wanted.length})
            </button>
          </nav>
        </div>

        {activeTab === 'offered' ? (
          <div>
            <SkillList
              skills={userSkills.offered}
              onDelete={handleDelete}
              emptyMessage="You haven't added any skills to offer yet. Add skills you can teach!"
            />
          </div>
        ) : (
          <div>
            <SkillList
              skills={userSkills.wanted}
              onDelete={handleDelete}
              emptyMessage="You haven't added any skills to learn yet. Add skills you want to learn!"
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
