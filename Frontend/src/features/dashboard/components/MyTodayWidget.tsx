import React from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ClipboardList, CheckSquare, Calendar, Clock, ArrowRight } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';

interface MyTodayData {
  workOrders: {
    inProgress: number;
    toDo: number;
    pending: number;
  };
  tasks: {
    todo: number;
    overdue: number;
    dueToday: number;
  };
  appointments: Array<{
    id: string;
    time: string;
    title: string;
  }>;
}

export const MyTodayWidget: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data - in real app, this would come from API/context
  const myTodayData: MyTodayData = {
    workOrders: {
      inProgress: 3,
      toDo: 2,
      pending: 1,
    },
    tasks: {
      todo: 5,
      overdue: 2,
      dueToday: 3,
    },
    appointments: [
      { id: '1', time: '10:00', title: 'Client Meeting - ABC Corp' },
      { id: '2', time: '14:00', title: 'Team Standup' },
    ],
  };

  const totalWorkOrders =
    myTodayData.workOrders.inProgress +
    myTodayData.workOrders.toDo +
    myTodayData.workOrders.pending;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            My Today
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Welcome back, {user?.name || 'User'}!
          </p>
        </div>
        <Clock className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
      </div>

      <div className="space-y-6">
        {/* Work Orders Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-slate-900 dark:text-white">
                My Work Orders ({totalWorkOrders})
              </h3>
            </div>
            <button
              onClick={() => navigate('/work-orders')}
              className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1"
            >
              View All
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {myTodayData.workOrders.inProgress}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                In Progress
              </div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {myTodayData.workOrders.toDo}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                To Do
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {myTodayData.workOrders.pending}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Pending
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-semibold text-slate-900 dark:text-white">
              My Tasks ({myTodayData.tasks.todo})
            </h3>
          </div>
          <div className="space-y-2">
            {myTodayData.tasks.overdue > 0 && (
              <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Overdue
                </span>
                <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                  {myTodayData.tasks.overdue} ⚠️
                </span>
              </div>
            )}
            <div className="flex items-center justify-between p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Due Today
              </span>
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {myTodayData.tasks.dueToday}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <span className="text-sm text-slate-700 dark:text-slate-300">
                This Week
              </span>
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                {myTodayData.tasks.todo - myTodayData.tasks.dueToday}
              </span>
            </div>
          </div>
        </div>

        {/* Appointments Section */}
        {myTodayData.appointments.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-semibold text-slate-900 dark:text-white">
                My Appointments ({myTodayData.appointments.length})
              </h3>
            </div>
            <div className="space-y-2">
              {myTodayData.appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg"
                >
                  <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 min-w-[50px]">
                    {appointment.time}
                  </div>
                  <div className="text-sm text-slate-700 dark:text-slate-300">
                    {appointment.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/work-orders')}
            className="w-full"
          >
            <Clock className="h-4 w-4 mr-2" />
            Log Time
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/work-orders')}
            className="w-full"
          >
            <ClipboardList className="h-4 w-4 mr-2" />
            New Work Order
          </Button>
        </div>
      </div>
    </Card>
  );
};
