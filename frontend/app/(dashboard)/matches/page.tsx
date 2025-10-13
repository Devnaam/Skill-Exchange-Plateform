'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';

interface Match {
  id: string;
  firstName: string;
  lastName: string;
  username?: string;
  profileImage?: string;
  location?: string;
  bio?: string;
  matchType: 'PERFECT_SWAP' | 'TEACHER' | 'LEARNER';
  matchingSkills: Array<{ skill: { name: string } }>;
  skillsOffered?: Array<{ skill: { name: string } }>;
  skillsWanted?: Array<{ skill: { name: string } }>;
}

export default function MatchesPage() {
  const { status } = useSession();
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'PERFECT_SWAP' | 'TEACHER' | 'LEARNER'>('all');
  const [sending, setSending] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      loadMatches();
    }
  }, [status]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const response = await api.get('/matches');
      setMatches(response.data.matches || []);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (userId: string) => {
    try {
      setSending(userId);
      await api.post('/connections/send', {
        receiverId: userId,
        message: 'Hi! I would love to exchange skills with you.',
      });
      alert('Connection request sent!');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to send connection request');
    } finally {
      setSending(null);
    }
  };

  const filteredMatches = filter === 'all' 
    ? matches 
    : matches.filter(m => m.matchType === filter);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
            <p className="text-slate-600 font-medium">Finding your matches...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Find Your Matches</h1>
            <p className="text-slate-600 mt-1">
              {filteredMatches.length} {filteredMatches.length === 1 ? 'match' : 'matches'} found
            </p>
          </div>
          
          <Link
            href="/skills/add"
            className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Skills
          </Link>
        </div>

        {/* Filters */}
        <Card className="border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-sm font-medium text-slate-700">Filter by:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Matches ({matches.length})
              </button>
              <button
                onClick={() => setFilter('PERFECT_SWAP')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'PERFECT_SWAP'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Perfect Swap ({matches.filter(m => m.matchType === 'PERFECT_SWAP').length})
              </button>
              <button
                onClick={() => setFilter('TEACHER')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'TEACHER'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Can Teach You ({matches.filter(m => m.matchType === 'TEACHER').length})
              </button>
              <button
                onClick={() => setFilter('LEARNER')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'LEARNER'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Wants to Learn ({matches.filter(m => m.matchType === 'LEARNER').length})
              </button>
            </div>
          </div>
        </Card>

        {/* Matches Grid */}
        {filteredMatches.length === 0 ? (
          <Card className="border border-slate-200">
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No matches found</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Add more skills to your profile to find people who want to learn what you offer and can teach what you want.
              </p>
              <Link
                href="/skills/add"
                className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Add Your Skills
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match) => (
              <Card key={match.id} className="border border-slate-200 hover:shadow-lg transition-all duration-200 flex flex-col">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar
                        firstName={match.firstName}
                        lastName={match.lastName}
                        src={match.profileImage}
                        size="lg"
                      />
                      <div className="min-w-0">
                        <Link href={`/users/${match.id}`}>
                          <h3 className="font-bold text-slate-900 hover:text-indigo-600 transition-colors truncate">
                            {match.firstName} {match.lastName}
                          </h3>
                        </Link>
                        {match.username && (
                          <p className="text-sm text-slate-600 truncate">@{match.username}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  {match.location && (
                    <div className="flex items-center text-sm text-slate-600 mb-3">
                      <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">{match.location}</span>
                    </div>
                  )}

                  {/* Match Type Badge */}
                  <div className="mb-4">
                    {match.matchType === 'PERFECT_SWAP' && (
                      <Badge variant="primary" className="text-xs">
                        Perfect Match - Can teach each other!
                      </Badge>
                    )}
                    {match.matchType === 'TEACHER' && (
                      <Badge variant="secondary" className="text-xs">
                        Can teach you what you want to learn
                      </Badge>
                    )}
                    {match.matchType === 'LEARNER' && (
                      <Badge variant="secondary" className="text-xs">
                        Wants to learn what you offer
                      </Badge>
                    )}
                  </div>

                  {/* Bio */}
                  {match.bio && (
                    <p className="text-sm text-slate-700 mb-4 line-clamp-2">
                      {match.bio}
                    </p>
                  )}

                  {/* Matching Skills */}
                  {match.matchingSkills && match.matchingSkills.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-slate-600 mb-2">Matching Skills:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {match.matchingSkills.slice(0, 3).map((ms: any, idx: number) => (
                          <span
                            key={idx}
                            className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-200"
                          >
                            {ms.skill.name}
                          </span>
                        ))}
                        {match.matchingSkills.length > 3 && (
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                            +{match.matchingSkills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-4 border-t border-slate-200">
                  <Button
                    onClick={() => handleConnect(match.id)}
                    disabled={sending === match.id}
                    variant="primary"
                    className="flex-1"
                  >
                    {sending === match.id ? (
                      <>
                        <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Connect
                      </>
                    )}
                  </Button>
                  <Link
                    href={`/users/${match.id}`}
                    className="inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
