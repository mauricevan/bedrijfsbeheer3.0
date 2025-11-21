import React from 'react';
import { cn } from '@/utils/cn';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'glass' | 'outline';
};

export const Card: React.FC<CardProps> = ({ 
  className, 
  variant = 'default', 
  children, 
  ...props 
}) => {
  const variants = {
    default: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm',
    glass: 'glass dark:glass-dark shadow-lg',
    outline: 'bg-transparent border border-slate-200 dark:border-slate-700',
  };

  return (
    <div
      className={cn(
        'rounded-xl p-6 transition-all duration-200',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
