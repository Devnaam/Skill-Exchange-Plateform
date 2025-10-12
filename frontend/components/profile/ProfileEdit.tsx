'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ProfileWithSkills, UpdateProfileData } from '@/types';
import { EXCHANGE_PREFERENCES } from '@/utils/constants';

interface ProfileEditProps {
  profile: ProfileWithSkills;
  onSave: (data: UpdateProfileData) => Promise<void>;
  onCancel: () => void;
}

export const ProfileEdit: React.FC<ProfileEditProps> = ({
  profile,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    username: profile.username || '',
    bio: profile.bio || '',
    location: profile.location || '',
    exchangePreference: profile.exchangePreference || 'FLEXIBLE',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSave(formData);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-500 p-3 rounded-md text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            type="text"
            required
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
          <Input
            label="Last Name"
            type="text"
            required
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
        </div>

        <Input
          label="Username"
          type="text"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          placeholder="Choose a unique username"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) =>
              setFormData({ ...formData, bio: e.target.value })
            }
            rows={4}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Tell us about yourself..."
          />
        </div>

        <Input
          label="Location"
          type="text"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          placeholder="City, Area"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Exchange Preference
          </label>
          <select
            value={formData.exchangePreference}
            onChange={(e) =>
              setFormData({ ...formData, exchangePreference: e.target.value as any })
            }
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {Object.entries(EXCHANGE_PREFERENCES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-4 pt-4">
          <Button type="submit" disabled={loading} variant="primary">
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button type="button" onClick={onCancel} variant="secondary">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
