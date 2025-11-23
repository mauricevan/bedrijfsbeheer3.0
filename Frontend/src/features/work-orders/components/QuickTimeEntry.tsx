import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useToast } from '@/context/ToastContext';
import { Clock, Play, Square } from 'lucide-react';

interface QuickTimeEntryProps {
  isOpen: boolean;
  onClose: () => void;
  workOrderId: string;
  workOrderTitle: string;
}

export const QuickTimeEntry: React.FC<QuickTimeEntryProps> = ({
  isOpen,
  onClose,
  workOrderTitle,
}) => {
  const [hours, setHours] = useState<string>('');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerStart, setTimerStart] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const startTimer = () => {
    setIsTimerRunning(true);
    setTimerStart(new Date());
    
    const interval = setInterval(() => {
      if (timerStart) {
        const elapsed = Math.floor((new Date().getTime() - timerStart.getTime()) / 1000);
        setElapsedTime(elapsed);
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    if (timerStart) {
      const elapsed = (new Date().getTime() - timerStart.getTime()) / 1000 / 3600; // Convert to hours
      setHours(elapsed.toFixed(2));
    }
    setTimerStart(null);
    setElapsedTime(0);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = async () => {
    if (!hours || parseFloat(hours) <= 0) {
      showToast('Please enter valid hours', 'warning');
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      showToast(`${hours} hours logged successfully!`, 'success');
      onClose();
      setHours('');
    } catch {
      showToast('Failed to log time', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Time">
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">Work Order</p>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            {workOrderTitle}
          </p>
        </div>

        {/* Timer Display */}
        {isTimerRunning && (
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 font-mono">
              {formatTime(elapsedTime)}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Timer running...
            </p>
          </div>
        )}

        {/* Timer Controls */}
        <div className="flex gap-3">
          {!isTimerRunning ? (
            <Button
              variant="primary"
              leftIcon={<Play className="h-4 w-4" />}
              onClick={startTimer}
              className="flex-1"
            >
              Start Timer
            </Button>
          ) : (
            <Button
              variant="danger"
              leftIcon={<Square className="h-4 w-4" />}
              onClick={stopTimer}
              className="flex-1"
            >
              Stop Timer
            </Button>
          )}
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-slate-800 text-slate-500">
              or enter manually
            </span>
          </div>
        </div>

        {/* Manual Entry */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Hours
          </label>
          <Input
            type="number"
            step="0.25"
            min="0"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="e.g., 2.5"
            disabled={isTimerRunning}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter time in increments of 0.25 hours (15 minutes)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            isLoading={isSaving}
            disabled={!hours || parseFloat(hours) <= 0 || isTimerRunning}
            className="flex-1"
          >
            Save Time
          </Button>
        </div>
      </div>
    </Modal>
  );
};
