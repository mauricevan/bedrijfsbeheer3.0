import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from './Button';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="rounded-full w-9 h-9 p-0"
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4 transition-all" />
      ) : (
        <Sun className="h-4 w-4 transition-all" />
      )}
    </Button>
  );
};
