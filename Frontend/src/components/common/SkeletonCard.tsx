import React from 'react';
import { Skeleton } from './Skeleton';
import { Card } from './Card';

interface SkeletonCardProps {
  lines?: number;
  showAvatar?: boolean;
  showActions?: boolean;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  lines = 3,
  showAvatar = false,
  showActions = false,
}) => {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        {showAvatar && (
          <Skeleton width={40} height={40} rounded="full" />
        )}
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={20} />
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton
              key={i}
              width={i === lines - 1 ? '80%' : '100%'}
              height={16}
            />
          ))}
        </div>
        {showActions && (
          <div className="flex gap-2">
            <Skeleton width={24} height={24} rounded="md" />
            <Skeleton width={24} height={24} rounded="md" />
          </div>
        )}
      </div>
    </Card>
  );
};

