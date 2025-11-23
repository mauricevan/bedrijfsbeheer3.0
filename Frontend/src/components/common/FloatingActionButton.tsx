import React, { useState } from 'react';
import { Plus, X, FileText, Package, Users, ClipboardList, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
}

export const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const quickActions: QuickAction[] = [
    {
      id: 'work-order',
      label: 'New Work Order',
      icon: <ClipboardList className="h-5 w-5" />,
      onClick: () => {
        navigate('/work-orders');
        setIsOpen(false);
      },
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      id: 'quote',
      label: 'New Quote',
      icon: <FileText className="h-5 w-5" />,
      onClick: () => {
        navigate('/accounting');
        setIsOpen(false);
      },
      color: 'bg-emerald-600 hover:bg-emerald-700',
    },
    {
      id: 'customer',
      label: 'New Customer',
      icon: <Users className="h-5 w-5" />,
      onClick: () => {
        navigate('/crm');
        setIsOpen(false);
      },
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      id: 'product',
      label: 'Add Product',
      icon: <Package className="h-5 w-5" />,
      onClick: () => {
        navigate('/inventory');
        setIsOpen(false);
      },
      color: 'bg-amber-600 hover:bg-amber-700',
    },
    {
      id: 'appointment',
      label: 'New Appointment',
      icon: <Calendar className="h-5 w-5" />,
      onClick: () => {
        navigate('/planning');
        setIsOpen(false);
      },
      color: 'bg-indigo-600 hover:bg-indigo-700',
    },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Quick Actions Menu */}
      <div className="fixed bottom-24 right-6 z-50 flex flex-col-reverse gap-3">
        {isOpen &&
          quickActions.map((action, index) => (
            <div
              key={action.id}
              className="flex items-center gap-3 animate-in slide-in-from-bottom-2 fade-in"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'backwards',
              }}
            >
              <span className="bg-slate-900 dark:bg-slate-700 text-white text-sm px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                {action.label}
              </span>
              <button
                onClick={action.onClick}
                className={`
                  ${action.color}
                  text-white p-3 rounded-full shadow-lg
                  transform transition-all duration-200
                  hover:scale-110 active:scale-95
                `}
                title={action.label}
              >
                {action.icon}
              </button>
            </div>
          ))}
      </div>

      {/* Main FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-6 right-6 z-50
          bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600
          text-white p-4 rounded-full shadow-lg
          transform transition-all duration-200
          hover:scale-110 active:scale-95
          ${isOpen ? 'rotate-45' : 'rotate-0'}
        `}
        title={isOpen ? 'Close' : 'Quick Actions'}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </button>
    </>
  );
};
