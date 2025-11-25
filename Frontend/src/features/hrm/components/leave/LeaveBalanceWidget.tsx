import React, { useEffect, useState } from 'react';
import { Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { LeaveBalance, LeaveType } from '../../types/hrm.types';
import { leaveBalanceService } from '../../services/leaveService';

interface LeaveBalanceWidgetProps {
  employeeId: string;
  year?: number;
  compact?: boolean;
}

export const LeaveBalanceWidget: React.FC<LeaveBalanceWidgetProps> = ({
  employeeId,
  year = new Date().getFullYear(),
  compact = false,
}) => {
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBalances();
  }, [employeeId, year]);

  const loadBalances = () => {
    setLoading(true);
    
    // Initialize balances if they don't exist
    const existingBalances = leaveBalanceService.getLeaveBalancesByEmployee(employeeId);
    const yearBalances = existingBalances.filter(b => b.year === year);
    
    if (yearBalances.length === 0) {
      const initialized = leaveBalanceService.initializeEmployeeLeaveBalances(employeeId, year);
      setBalances(initialized);
    } else {
      setBalances(yearBalances);
    }
    
    setLoading(false);
  };

  const leaveTypeLabels: Record<LeaveType, string> = {
    vacation: 'Vakantie',
    sick: 'Ziekte',
    care: 'Zorgverlof',
    parental: 'Ouderschapsverlof',
    special: 'Bijzonder verlof',
    unpaid: 'Onbetaald',
    compensatory: 'Compensatie',
  };

  const leaveTypeColors: Record<LeaveType, { bg: string; text: string; border: string }> = {
    vacation: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
    },
    sick: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-700 dark:text-red-300',
      border: 'border-red-200 dark:border-red-800',
    },
    care: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-200 dark:border-purple-800',
    },
    parental: {
      bg: 'bg-pink-50 dark:bg-pink-900/20',
      text: 'text-pink-700 dark:text-pink-300',
      border: 'border-pink-200 dark:border-pink-800',
    },
    special: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      text: 'text-yellow-700 dark:text-yellow-300',
      border: 'border-yellow-200 dark:border-yellow-800',
    },
    unpaid: {
      bg: 'bg-gray-50 dark:bg-gray-900/20',
      text: 'text-gray-700 dark:text-gray-300',
      border: 'border-gray-200 dark:border-gray-800',
    },
    compensatory: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-700 dark:text-green-300',
      border: 'border-green-200 dark:border-green-800',
    },
  };

  const getUsagePercentage = (balance: LeaveBalance): number => {
    if (balance.totalDays === 0) return 0;
    return (balance.usedDays / balance.totalDays) * 100;
  };

  const getUsageTrend = (balance: LeaveBalance): 'up' | 'down' | 'stable' => {
    const percentage = getUsagePercentage(balance);
    if (percentage > 75) return 'up';
    if (percentage < 25) return 'down';
    return 'stable';
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Filter out leave types with no allocation (except sick and unpaid which are unlimited)
  const displayBalances = balances.filter(b => 
    b.totalDays > 0 || b.leaveType === 'sick' || b.leaveType === 'unpaid'
  );

  if (compact) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayBalances.map(balance => {
          const colors = leaveTypeColors[balance.leaveType];
          const percentage = getUsagePercentage(balance);

          return (
            <div
              key={balance.id}
              className={`p-4 rounded-lg border ${colors.bg} ${colors.border}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${colors.text}`}>
                  {leaveTypeLabels[balance.leaveType]}
                </span>
                {balance.totalDays > 0 && (
                  <span className={`text-xs ${colors.text}`}>
                    {balance.remainingDays}/{balance.totalDays}
                  </span>
                )}
              </div>
              
              {balance.totalDays > 0 ? (
                <>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        percentage > 75 ? 'bg-red-500' :
                        percentage > 50 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className={colors.text}>Gebruikt: {balance.usedDays}</span>
                    {balance.pendingDays > 0 && (
                      <span className={colors.text}>Pending: {balance.pendingDays}</span>
                    )}
                  </div>
                </>
              ) : (
                <div className={`text-xs ${colors.text}`}>
                  {balance.leaveType === 'sick' ? 'Onbeperkt' : 'Geen toewijzing'}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Verlofsaldo {year}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Overzicht van je verlofrechten
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {displayBalances.map(balance => {
          const colors = leaveTypeColors[balance.leaveType];
          const percentage = getUsagePercentage(balance);
          const trend = getUsageTrend(balance);

          return (
            <div
              key={balance.id}
              className={`p-4 rounded-lg border ${colors.bg} ${colors.border}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className={`font-medium ${colors.text}`}>
                    {leaveTypeLabels[balance.leaveType]}
                  </h4>
                  {balance.carriedOverDays && balance.carriedOverDays > 0 && (
                    <p className={`text-xs mt-1 ${colors.text} opacity-75`}>
                      Inclusief {balance.carriedOverDays} overgedragen dagen
                      {balance.expiryDate && ` (vervalt ${new Date(balance.expiryDate).toLocaleDateString()})`}
                    </p>
                  )}
                </div>
                
                {balance.totalDays > 0 && (
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${colors.text}`}>
                      {balance.remainingDays}
                    </div>
                    <div className={`text-xs ${colors.text} opacity-75`}>
                      van {balance.totalDays} dagen
                    </div>
                  </div>
                )}
              </div>

              {balance.totalDays > 0 ? (
                <>
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          percentage > 75 ? 'bg-red-500' :
                          percentage > 50 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className={`text-xs ${colors.text} opacity-75 mb-1`}>
                        Gebruikt
                      </div>
                      <div className={`text-lg font-semibold ${colors.text}`}>
                        {balance.usedDays}
                      </div>
                    </div>

                    {balance.pendingDays > 0 && (
                      <div>
                        <div className={`text-xs ${colors.text} opacity-75 mb-1`}>
                          In behandeling
                        </div>
                        <div className={`text-lg font-semibold ${colors.text}`}>
                          {balance.pendingDays}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className={`text-xs ${colors.text} opacity-75 mb-1`}>
                        Beschikbaar
                      </div>
                      <div className={`text-lg font-semibold ${colors.text} flex items-center gap-1`}>
                        {balance.remainingDays}
                        {trend === 'up' && <TrendingUp className="w-4 h-4" />}
                        {trend === 'down' && <TrendingDown className="w-4 h-4" />}
                        {trend === 'stable' && <Minus className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Usage Warning */}
                  {percentage > 75 && (
                    <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded border border-yellow-300 dark:border-yellow-700">
                      <p className="text-xs text-yellow-800 dark:text-yellow-200">
                        ⚠️ Je hebt meer dan 75% van je {leaveTypeLabels[balance.leaveType].toLowerCase()} gebruikt
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className={`text-center py-4 ${colors.text}`}>
                  <p className="text-sm font-medium">
                    {balance.leaveType === 'sick' ? '∞ Onbeperkt' : 'Geen toewijzing voor dit jaar'}
                  </p>
                  {balance.leaveType === 'sick' && (
                    <p className="text-xs mt-1 opacity-75">
                      Ziekteverlof is onbeperkt volgens Nederlandse wetgeving
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Total Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Totaal beschikbaar (met limiet)
          </span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {leaveBalanceService.getTotalRemainingDays(employeeId, year)} dagen
          </span>
        </div>
      </div>
    </div>
  );
};
