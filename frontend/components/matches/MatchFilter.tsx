'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SKILL_CATEGORIES } from '@/utils/constants';

interface MatchFilterProps {
  onSearch: (query: string, filters: any) => void;
}

export const MatchFilter: React.FC<MatchFilterProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    skillType: '',
  });

  const handleSearch = () => {
    onSearch(query, filters);
  };

  const handleReset = () => {
    setQuery('');
    setFilters({ category: '', location: '', skillType: '' });
    onSearch('', {});
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <Input
        type="text"
        placeholder="Search by name or username..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Categories</option>
            {SKILL_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Location"
          type="text"
          placeholder="City, area..."
          value={filters.location}
          onChange={(e) =>
            setFilters({ ...filters, location: e.target.value })
          }
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skill Type
          </label>
          <select
            value={filters.skillType}
            onChange={(e) =>
              setFilters({ ...filters, skillType: e.target.value })
            }
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Types</option>
            <option value="OFFERED">Can Teach</option>
            <option value="WANTED">Wants to Learn</option>
          </select>
        </div>
      </div>

      <div className="flex space-x-4">
        <Button onClick={handleSearch} variant="primary">
          Search
        </Button>
        <Button onClick={handleReset} variant="secondary">
          Reset
        </Button>
      </div>
    </div>
  );
};
