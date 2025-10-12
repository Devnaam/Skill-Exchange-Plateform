'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useMatches } from '@/hooks/useMatches';
import { MatchList } from '@/components/matches/MatchList';
import { MatchFilter } from '@/components/matches/MatchFilter';
import { Card } from '@/components/ui/Card';

export default function MatchesPage() {
  const { status } = useSession();
  const router = useRouter();
  const { matches, loading, fetchMatches, searchUsers } = useMatches();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      fetchMatches();
    } else if (filter === 'perfect') {
      fetchMatches('perfect');
    } else if (filter === 'teachers') {
      fetchMatches('teachers');
    } else if (filter === 'learners') {
      fetchMatches('learners');
    }
  };

  const handleSearch = (query: string, filters: any) => {
    searchUsers(query, filters);
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Find Matches</h1>
          <p className="text-gray-600 mt-2">
            Discover people to exchange skills with
          </p>
        </div>

        <MatchFilter onSearch={handleSearch} />

        <Card>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Matches ({matches.length})
            </button>
            <button
              onClick={() => handleFilterChange('perfect')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                activeFilter === 'perfect'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🎯 Perfect Swaps
            </button>
            <button
              onClick={() => handleFilterChange('teachers')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                activeFilter === 'teachers'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              👨‍🏫 Teachers
            </button>
            <button
              onClick={() => handleFilterChange('learners')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                activeFilter === 'learners'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              👨‍🎓 Learners
            </button>
          </div>
        </Card>

        <MatchList
          matches={matches}
          loading={loading}
          emptyMessage="No matches found. Try adding more skills or adjusting your filters."
        />
      </div>
    </DashboardLayout>
  );
}
