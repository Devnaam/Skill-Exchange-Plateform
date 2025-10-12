import React from 'react';
import { UserSkill } from '@/types/skill';
import { SkillCard } from './SkillCard';

interface SkillListProps {
  skills: UserSkill[];
  onDelete?: (id: string) => void;
  emptyMessage?: string;
}

export const SkillList: React.FC<SkillListProps> = ({
  skills,
  onDelete,
  emptyMessage = 'No skills added yet',
}) => {
  if (skills.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {skills.map((skill) => (
        <SkillCard
          key={skill.id}
          userSkill={skill}
          onDelete={onDelete ? () => onDelete(skill.id) : undefined}
        />
      ))}
    </div>
  );
};
