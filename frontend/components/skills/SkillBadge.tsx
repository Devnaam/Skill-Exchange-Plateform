import React from 'react';
import { Badge } from '@/components/ui/Badge';

interface SkillBadgeProps {
  name: string;
  type?: 'offered' | 'wanted';
  proficiencyLevel?: string;
  onRemove?: () => void;
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({
  name,
  type,
  proficiencyLevel,
  onRemove,
}) => {
  const variant = type === 'offered' ? 'primary' : type === 'wanted' ? 'success' : 'secondary';

  return (
    <div className="inline-flex items-center gap-2">
      <Badge variant={variant}>
        {name}
        {proficiencyLevel && ` • ${proficiencyLevel}`}
      </Badge>
      {onRemove && (
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 text-sm font-bold"
          aria-label="Remove skill"
        >
          ×
        </button>
      )}
    </div>
  );
};
