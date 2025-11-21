import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, Palette } from 'lucide-react';
import { Card } from '@/components/common/Card';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your application settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900/20">
              <SettingsIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">General Settings</h3>
              <p className="text-sm text-slate-500">Basic application configuration</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
              <Bell className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
              <p className="text-sm text-slate-500">Manage notification preferences</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-violet-100 dark:bg-violet-900/20">
              <Shield className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Security</h3>
              <p className="text-sm text-slate-500">Security and privacy settings</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/20">
              <Palette className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Appearance</h3>
              <p className="text-sm text-slate-500">Customize look and feel</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
