import React from 'react';
import { Loader2, Check } from 'lucide-react';
import { Button } from './Button';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  isSuccess?: boolean;
  loadingText?: string;
  successText?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading = false,
  isSuccess = false,
  loadingText = 'Saving...',
  successText = 'Saved',
  variant = 'primary',
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}) => {
  const getContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{loadingText}</span>
        </>
      );
    }

    if (isSuccess) {
      return (
        <>
          <Check className="h-4 w-4" />
          <span>{successText}</span>
        </>
      );
    }

    return (
      <>
        {leftIcon}
        <span>{children}</span>
        {rightIcon}
      </>
    );
  };

  return (
    <Button
      variant={variant}
      disabled={disabled || isLoading || isSuccess}
      className="inline-flex items-center gap-2"
      {...props}
    >
      {getContent()}
    </Button>
  );
};
