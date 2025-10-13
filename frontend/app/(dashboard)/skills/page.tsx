'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useProfile } from '@/hooks/useProfile';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import api from '@/lib/api';

export default function SkillsPage() {
  const { status } = useSession();
  const router = useRouter();
  const { profile, loading } = useProfile();
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status]);

  const handleDelete = async (skillId: string, type: 'offered' | 'wanted') => {
    if (!confirm('Are you sure you want to remove this skill?')) return;

    try {
      setDeleting(skillId);
      await api.delete(`/skills/user/${skillId}`);
      window.location.reload();
    } catch (error) {
      alert('Failed to delete skill');
    } finally {
      setDeleting(null);
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
            <p className="text-slate-600 font-medium">Loading skills...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const skillsOffered = profile?.skillsOffered || [];
  const skillsWanted = profile?.skillsWanted || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Premium Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="relative px-6 sm:px-8 py-10 sm:py-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  My Skills Portfolio
                </h1>
                <p className="text-indigo-100 text-lg">
                  Manage what you can teach and what you want to learn
                </p>
              </div>

              {/* Stats */}
              <div className="flex gap-4">
                <div className="bg-white/10 backdrop-blur-lg rounded-xl px-6 py-4 border border-white/20 text-center">
                  <p className="text-3xl font-bold text-white">{skillsOffered.length}</p>
                  <p className="text-xs text-indigo-100 mt-1">Skills I Offer</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl px-6 py-4 border border-white/20 text-center">
                  <p className="text-3xl font-bold text-white">{skillsWanted.length}</p>
                  <p className="text-xs text-indigo-100 mt-1">Want to Learn</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action */}
        <Card className="border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Add Your Skills</h3>
                <p className="text-sm text-slate-600">
                  The more skills you add, the better matches you'll get!
                </p>
              </div>
            </div>
            <Link
              href="/skills/add"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Skill
            </Link>
          </div>
        </Card>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skills I Offer */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Skills I Offer</h2>
              </div>
              <Badge variant="primary" className="text-sm">
                {skillsOffered.length} {skillsOffered.length === 1 ? 'skill' : 'skills'}
              </Badge>
            </div>

            {skillsOffered.length > 0 ? (
              <div className="space-y-3">
                {skillsOffered.map((userSkill: any) => (
                  <Card
                    key={userSkill.id}
                    className="group border border-slate-200 hover:border-green-300 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-slate-900 group-hover:text-green-700 transition-colors text-lg">
                            {userSkill.skill.name}
                          </h4>
                          {userSkill.proficiencyLevel && (
                            <Badge variant="primary" className="text-xs">
                              {userSkill.proficiencyLevel}
                            </Badge>
                          )}
                        </div>
                        {userSkill.skill.category && (
                          <p className="text-xs text-slate-500 mb-2">
                            {userSkill.skill.category.name}
                          </p>
                        )}
                        {userSkill.description && (
                          <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                            {userSkill.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(userSkill.id, 'offered')}
                        disabled={deleting === userSkill.id}
                        className="ml-4 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
                        aria-label="Delete skill"
                      >
                        {deleting === userSkill.id ? (
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>

                    {/* Skill Meta */}
                    <div className="flex items-center gap-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Added {new Date(userSkill.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border border-slate-200">
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No skills added yet</h3>
                  <p className="text-slate-600 mb-6 max-w-sm mx-auto">
                    Add skills you can teach to start getting matched with learners!
                  </p>
                  <Link
                    href="/skills/add"
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                  >
                    Add Your First Skill
                  </Link>
                </div>
              </Card>
            )}
          </div>

          {/* Skills I Want */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Skills I Want</h2>
              </div>
              <Badge variant="secondary" className="text-sm">
                {skillsWanted.length} {skillsWanted.length === 1 ? 'skill' : 'skills'}
              </Badge>
            </div>

            {skillsWanted.length > 0 ? (
              <div className="space-y-3">
                {skillsWanted.map((userSkill: any) => (
                  <Card
                    key={userSkill.id}
                    className="group border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors text-lg">
                            {userSkill.skill.name}
                          </h4>
                          {userSkill.proficiencyLevel && (
                            <Badge variant="secondary" className="text-xs">
                              {userSkill.proficiencyLevel}
                            </Badge>
                          )}
                        </div>
                        {userSkill.skill.category && (
                          <p className="text-xs text-slate-500 mb-2">
                            {userSkill.skill.category.name}
                          </p>
                        )}
                        {userSkill.description && (
                          <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                            {userSkill.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(userSkill.id, 'wanted')}
                        disabled={deleting === userSkill.id}
                        className="ml-4 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
                        aria-label="Delete skill"
                      >
                        {deleting === userSkill.id ? (
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>

                    {/* Skill Meta */}
                    <div className="flex items-center gap-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Added {new Date(userSkill.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border border-slate-200">
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No learning goals yet</h3>
                  <p className="text-slate-600 mb-6 max-w-sm mx-auto">
                    Add skills you want to learn to find perfect teachers!
                  </p>
                  <Link
                    href="/skills/add"
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                  >
                    Add Learning Goals
                  </Link>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
