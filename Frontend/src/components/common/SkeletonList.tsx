import React from 'react';
import { SkeletonCard } from './SkeletonCard';

interface SkeletonListProps {
  count?: number;
  showAvatar?: boolean;
  showActions?: boolean;
}

export const SkeletonList: React.FC<SkeletonListProps> = ({
  count = 5,
  showAvatar = false,
  showActions = false,
}) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard
          key={i}
          lines={3}
          showAvatar={showAvatar}
          showActions={showActions}
        />
      ))}
    </div>
  );
};

