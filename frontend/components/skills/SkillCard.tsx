import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { UserSkill } from '@/types/skill';
import { PROFICIENCY_LEVELS } from '@/utils/constants';

interface SkillCardProps {
  userSkill: UserSkill;
  onDelete?: () => void;
  showActions?: boolean;
}

export const SkillCard: React.FC<SkillCardProps> = ({
  userSkill,
  onDelete,
  showActions = true,
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">
            {userSkill.skill.name}
          </h4>
          <Badge variant="secondary" className="mt-2">
            {userSkill.skill.category}
          </Badge>
        </div>
        {showActions && onDelete && (
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Remove
          </button>
        )}
      </div>

      {userSkill.proficiencyLevel && (
        <div className="mt-3">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Level:</span>{' '}
            {PROFICIENCY_LEVELS[userSkill.proficiencyLevel]}
          </p>
        </div>
      )}

      {userSkill.description && (
        <p className="mt-2 text-sm text-gray-700">{userSkill.description}</p>
      )}

      <div className="mt-3">
        <Badge variant={userSkill.type === 'OFFERED' ? 'primary' : 'success'}>
          {userSkill.type === 'OFFERED' ? 'Can Teach' : 'Want to Learn'}
        </Badge>
      </div>
    </Card>
  );
};
