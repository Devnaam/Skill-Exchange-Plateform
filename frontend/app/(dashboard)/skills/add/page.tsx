'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useSkills } from '@/hooks/useSkills';
import { SkillForm } from '@/components/skills/SkillForm';
import { Card } from '@/components/ui/Card';
import { SkillType } from '@/types/skill';

export default function AddSkillPage() {
  const { status } = useSession();
  const router = useRouter();
  const { addSkill } = useSkills();
  const [skillType, setSkillType] = useState<SkillType>('OFFERED');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleSubmit = async (data: any) => {
    const result = await addSkill(data);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
    return result;
  };

  if (status === 'loading') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Skill</h1>
          <p className="text-gray-600 mt-2">
            Add skills you can teach or skills you want to learn
          </p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md">
            ✓ Skill added successfully!
          </div>
        )}

        <Card>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Skill Type
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => setSkillType('OFFERED')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                  skillType === 'OFFERED'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                I Can Teach This
              </button>
              <button
                onClick={() => setSkillType('WANTED')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                  skillType === 'WANTED'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                I Want to Learn This
              </button>
            </div>
          </div>

          <SkillForm
            type={skillType}
            onSubmit={handleSubmit}
            onCancel={() => router.push('/skills')}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}
