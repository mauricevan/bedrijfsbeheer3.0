import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface CustomerWarningIndicatorProps {
  hasWarnings: boolean;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CustomerWarningIndicator: React.FC<CustomerWarningIndicatorProps> = ({
  hasWarnings,
  onClick,
  className,
  size = 'md',
}) => {
  if (!hasWarnings) return null;

  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center rounded-full text-red-600 dark:text-red-400',
        'hover:bg-red-50 dark:hover:bg-red-900/20',
        'transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1',
        onClick && 'cursor-pointer',
        !onClick && 'cursor-default',
        className
      )}
      title="Customer heeft waarschuwingen"
      aria-label="Customer waarschuwing indicator"
    >
      <AlertTriangle className={sizes[size]} fill="currentColor" />
    </button>
  );
};

