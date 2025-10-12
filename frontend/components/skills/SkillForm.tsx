'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AddSkillData, SkillType } from '@/types/skill';
import { SKILL_CATEGORIES, PROFICIENCY_LEVELS } from '@/utils/constants';

interface SkillFormProps {
  onSubmit: (data: AddSkillData) => Promise<{ success: boolean; error?: string }>;
  onCancel?: () => void;
  type: SkillType;
}

export const SkillForm: React.FC<SkillFormProps> = ({
  onSubmit,
  onCancel,
  type,
}) => {
  const [formData, setFormData] = useState({
    skillName: '',
    category: 'Other',
    proficiencyLevel: type === 'OFFERED' ? 'INTERMEDIATE' : '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.skillName.trim()) {
      setError('Skill name is required');
      return;
    }

    setLoading(true);

    const data: AddSkillData = {
      skillName: formData.skillName.trim(),
      category: formData.category,
      type,
      proficiencyLevel: formData.proficiencyLevel ? formData.proficiencyLevel as any : undefined,
      description: formData.description || undefined,
    };

    const result = await onSubmit(data);

    if (result.success) {
      setFormData({
        skillName: '',
        category: 'Other',
        proficiencyLevel: type === 'OFFERED' ? 'INTERMEDIATE' : '',
        description: '',
      });
    } else {
      setError(result.error || 'Failed to add skill');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-500 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <Input
        label="Skill Name"
        type="text"
        required
        value={formData.skillName}
        onChange={(e) =>
          setFormData({ ...formData, skillName: e.target.value })
        }
        placeholder="e.g., Guitar, Web Development, Cooking"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          {SKILL_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {type === 'OFFERED' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Proficiency Level
          </label>
          <select
            value={formData.proficiencyLevel}
            onChange={(e) =>
              setFormData({ ...formData, proficiencyLevel: e.target.value })
            }
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select level</option>
            {Object.entries(PROFICIENCY_LEVELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (Optional)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Add any additional details..."
        />
      </div>

      <div className="flex space-x-4">
        <Button type="submit" disabled={loading} variant="primary">
          {loading ? 'Adding...' : `Add ${type === 'OFFERED' ? 'Skill to Offer' : 'Skill to Learn'}`}
        </Button>
        {onCancel && (
          <Button type="button" onClick={onCancel} variant="secondary">
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
