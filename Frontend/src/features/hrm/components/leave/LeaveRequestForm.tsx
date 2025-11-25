import React, { useState, useEffect } from 'react';
import { Calendar, Clock, FileText, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import type { LeaveType, LeaveStatus, CreateLeaveRequestInput, LeaveAttachment } from '../../types/hrm.types';
import { leaveService, calculateBusinessDays } from '../../services/leaveService';
import { leaveBalanceService } from '../../services/leaveService';

interface LeaveRequestFormProps {
  employeeId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({
  employeeId,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<CreateLeaveRequestInput>>({
    employeeId,
    type: 'vacation',
    startDate: '',
    endDate: '',
    halfDayStart: false,
    halfDayEnd: false,
    reason: '',
    comments: '',
    attachments: [],
    status: 'pending',
  });

  const [calculatedDays, setCalculatedDays] = useState<number>(0);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [balance, setBalance] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate days when dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (end >= start) {
        const days = calculateBusinessDays(
          start,
          end,
          formData.halfDayStart,
          formData.halfDayEnd
        );
        setCalculatedDays(days);

        // Check for conflicts
        const existingConflicts = leaveService.checkLeaveConflicts(
          employeeId,
          formData.startDate,
          formData.endDate
        );
        setConflicts(existingConflicts);
      } else {
        setCalculatedDays(0);
        setErrors(prev => ({ ...prev, endDate: 'End date must be after start date' }));
      }
    }
  }, [formData.startDate, formData.endDate, formData.halfDayStart, formData.halfDayEnd, employeeId]);

  // Load balance when leave type changes
  useEffect(() => {
    if (formData.type && formData.startDate) {
      const year = new Date(formData.startDate).getFullYear();
      const leaveBalance = leaveBalanceService.getLeaveBalance(employeeId, year, formData.type);
      setBalance(leaveBalance);
    }
  }, [formData.type, formData.startDate, employeeId]);

  const handleInputChange = (field: keyof CreateLeaveRequestInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.type) newErrors.type = 'Leave type is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (calculatedDays <= 0) {
      newErrors.endDate = 'Invalid date range';
    }

    // Check if sufficient balance
    if (balance && formData.type !== 'sick' && formData.type !== 'unpaid') {
      if (calculatedDays > balance.remainingDays) {
        newErrors.balance = `Insufficient balance. You have ${balance.remainingDays} days remaining.`;
      }
    }

    // Check for conflicts
    if (conflicts.length > 0) {
      newErrors.conflicts = `You have ${conflicts.length} conflicting leave request(s)`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const leaveRequest = leaveService.createLeaveRequest(formData as CreateLeaveRequestInput);
      
      if (onSuccess) {
        onSuccess();
      }

      // Reset form
      setFormData({
        employeeId,
        type: 'vacation',
        startDate: '',
        endDate: '',
        halfDayStart: false,
        halfDayEnd: false,
        reason: '',
        comments: '',
        attachments: [],
        status: 'pending',
      });
      setCalculatedDays(0);
      setConflicts([]);
      setBalance(null);
    } catch (error) {
      console.error('Error creating leave request:', error);
      setErrors({ submit: 'Failed to create leave request. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const leaveTypeLabels: Record<LeaveType, string> = {
    vacation: 'Vakantie',
    sick: 'Ziekte',
    care: 'Zorgverlof',
    parental: 'Ouderschapsverlof',
    special: 'Bijzonder verlof',
    unpaid: 'Onbetaald verlof',
    compensatory: 'Compensatieverlof',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Verlofaanvraag
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Dien een nieuwe verlofaanvraag in
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Leave Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type Verlof *
          </label>
          <select
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value as LeaveType)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Object.entries(leaveTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.type}</p>
          )}
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Startdatum *
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.startDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Einddatum *
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.endDate}</p>
            )}
          </div>
        </div>

        {/* Half Day Options */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.halfDayStart || false}
              onChange={(e) => handleInputChange('halfDayStart', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Halve dag start
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.halfDayEnd || false}
              onChange={(e) => handleInputChange('halfDayEnd', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Halve dag eind
            </span>
          </label>
        </div>

        {/* Calculated Days Display */}
        {calculatedDays > 0 && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Totaal: {calculatedDays} werkdag{calculatedDays !== 1 ? 'en' : ''}
              </span>
            </div>
            {balance && (
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                Resterend saldo: {balance.remainingDays} dagen
              </div>
            )}
          </div>
        )}

        {/* Balance Warning */}
        {errors.balance && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-900 dark:text-red-100">
                {errors.balance}
              </span>
            </div>
          </div>
        )}

        {/* Conflicts Warning */}
        {conflicts.length > 0 && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                Conflicterende verlofaanvragen
              </span>
            </div>
            <ul className="ml-7 text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              {conflicts.map(conflict => (
                <li key={conflict.id}>
                  {new Date(conflict.startDate).toLocaleDateString()} - {new Date(conflict.endDate).toLocaleDateString()} 
                  ({conflict.status})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Reden
          </label>
          <input
            type="text"
            value={formData.reason || ''}
            onChange={(e) => handleInputChange('reason', e.target.value)}
            placeholder="Optionele reden voor verlof"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Comments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Opmerkingen
          </label>
          <textarea
            value={formData.comments || ''}
            onChange={(e) => handleInputChange('comments', e.target.value)}
            rows={3}
            placeholder="Eventuele aanvullende opmerkingen"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-900 dark:text-red-100">
                {errors.submit}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700
                       transition-colors"
            >
              Annuleren
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || Object.keys(errors).length > 0}
            className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400
                     text-white rounded-lg font-medium transition-colors
                     disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Indienen...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Verlof Aanvragen
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
