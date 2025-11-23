import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'f',
      ctrl: true,
      description: 'Open global search',
      action: () => {
        // Focus search input
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      },
    },
    {
      key: 's',
      ctrl: true,
      description: 'Save (context-aware)',
      action: () => {
        // Trigger save button click
        const saveButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (saveButton) {
          saveButton.click();
        }
      },
    },
    {
      key: 'n',
      ctrl: true,
      description: 'New (context-aware)',
      action: () => {
        // This would be context-aware based on current page
        const addButton = document.querySelector('[data-action="add"]') as HTMLButtonElement;
        if (addButton) {
          addButton.click();
        }
      },
    },
    {
      key: '1',
      ctrl: true,
      description: 'Go to Dashboard',
      action: () => navigate('/'),
    },
    {
      key: '2',
      ctrl: true,
      description: 'Go to Work Orders',
      action: () => navigate('/work-orders'),
    },
    {
      key: '3',
      ctrl: true,
      description: 'Go to Inventory',
      action: () => navigate('/inventory'),
    },
    {
      key: '4',
      ctrl: true,
      description: 'Go to POS',
      action: () => navigate('/pos'),
    },
    {
      key: '5',
      ctrl: true,
      description: 'Go to CRM',
      action: () => navigate('/crm'),
    },
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Allow Ctrl+S even in inputs
        if (!(event.ctrlKey && event.key === 's')) {
          return;
        }
      }

      shortcuts.forEach((shortcut) => {
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;

        if (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlMatch &&
          shiftMatch &&
          altMatch
        ) {
          event.preventDefault();
          shortcut.action();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return { shortcuts };
};
