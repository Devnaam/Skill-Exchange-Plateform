import React from 'react';
import { getInitials } from '@/utils/formatters';

interface AvatarProps {
  src?: string;
  firstName: string;
  lastName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  firstName,
  lastName,
  size = 'md',
  className = '',
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
  };

  const initials = getInitials(firstName, lastName);

  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={`${firstName} ${lastName || ''}`}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-indigo-600 text-white flex items-center justify-center">
          {initials}
        </div>
      )}
    </div>
  );
};
