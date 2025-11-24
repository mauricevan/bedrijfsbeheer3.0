import React, { useState, useMemo } from 'react';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { getActivityLogs, filterActivityLogs, exportActivityLogsToCSV, clearActivityLogs } from '../services/activityService';
import type { ActivityFilter, EntityType, ActivityType } from '../types/tracking.types';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Download, Trash2, Search, Filter, X } from 'lucide-react';

export const ActivityTrackingTab: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState(getActivityLogs());
  const [filter, setFilter] = useState<ActivityFilter>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  const filteredActivities = useMemo(() => {
    return filterActivityLogs(filter);
  }, [filter]);

  const handleFilterChange = (key: keyof ActivityFilter, value: string | undefined) => {
    setFilter(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
    setActivities(getActivityLogs());
  };

  const clearFilters = () => {
    setFilter({});
    setActivities(getActivityLogs());
  };

  const handleExport = () => {
    const csv = exportActivityLogsToCSV(filteredActivities);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearLogs = () => {
    if (confirm('Weet u zeker dat u alle activiteitslogs wilt wissen? Deze actie kan niet ongedaan worden gemaakt.')) {
      clearActivityLogs();
      setActivities([]);
      setFilter({});
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('nl-NL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActivityTypeLabel = (type: ActivityType): string => {
    const labels: Record<string, string> = {
      factuur_created: 'Factuur aangemaakt',
      factuur_updated: 'Factuur bijgewerkt',
      factuur_sent: 'Factuur verzonden',
      factuur_paid: 'Factuur betaald',
      factuur_deleted: 'Factuur verwijderd',
      werkorder_created: 'Werkorder aangemaakt',
      werkorder_updated: 'Werkorder bijgewerkt',
      werkorder_assigned: 'Werkorder toegewezen',
      werkorder_completed: 'Werkorder voltooid',
      werkorder_deleted: 'Werkorder verwijderd',
      offerte_created: 'Offerte aangemaakt',
      offerte_updated: 'Offerte bijgewerkt',
      offerte_sent: 'Offerte verzonden',
      offerte_deleted: 'Offerte verwijderd',
    };
    return labels[type] || type;
  };

  const getEntityTypeLabel = (type: EntityType): string => {
    const labels: Record<EntityType, string> = {
      factuur: 'Factuur',
      werkorder: 'Werkorder',
      offerte: 'Offerte',
      customer: 'Klant',
      inventory: 'Voorraad',
      employee: 'Medewerker',
      settings: 'Instellingen',
      system: 'Systeem',
    };
    return labels[type];
  };

  // Only show to admins
  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400">U heeft geen toegang tot deze pagina.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Activiteit Tracking</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Overzicht van alle gebruikersactiviteiten ({filteredActivities.length} activiteiten)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exporteer CSV
          </Button>
          {user.role === 'admin' && (
            <Button variant="danger" onClick={handleClearLogs}>
              <Trash2 className="h-4 w-4 mr-2" />
              Wissen
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Zoeken
              </label>
              <Input
                value={filter.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Zoek in activiteiten..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Entiteit Type
              </label>
              <select
                value={filter.entityType || ''}
                onChange={(e) => handleFilterChange('entityType', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="">Alle types</option>
                <option value="factuur">Factuur</option>
                <option value="werkorder">Werkorder</option>
                <option value="offerte">Offerte</option>
                <option value="customer">Klant</option>
                <option value="inventory">Voorraad</option>
                <option value="employee">Medewerker</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Van Datum
              </label>
              <Input
                type="date"
                value={filter.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tot Datum
              </label>
              <Input
                type="date"
                value={filter.dateTo || ''}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Filters wissen
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300 font-semibold">Tijd</th>
                <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300 font-semibold">Gebruiker</th>
                <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300 font-semibold">Type</th>
                <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300 font-semibold">Entiteit</th>
                <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300 font-semibold">Actie</th>
                <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300 font-semibold">Beschrijving</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500 dark:text-slate-400">
                    Geen activiteiten gevonden
                  </td>
                </tr>
              ) : (
                filteredActivities.map((activity) => (
                  <tr
                    key={activity.id}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    onClick={() => setSelectedActivity(selectedActivity === activity.id ? null : activity.id)}
                  >
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {formatDate(activity.timestamp)}
                    </td>
                    <td className="py-3 px-4 text-slate-900 dark:text-white font-medium">
                      {activity.userName}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded">
                        {getEntityTypeLabel(activity.entityType)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {activity.entityName || activity.entityId}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                        {activity.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {activity.description}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedActivity && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Activiteit Details</h3>
          {(() => {
            const activity = filteredActivities.find(a => a.id === selectedActivity);
            if (!activity) return null;
            return (
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tijd:</span>
                  <span className="ml-2 text-slate-600 dark:text-slate-400">{formatDate(activity.timestamp)}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Gebruiker:</span>
                  <span className="ml-2 text-slate-600 dark:text-slate-400">{activity.userName} ({activity.userEmail})</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Type:</span>
                  <span className="ml-2 text-slate-600 dark:text-slate-400">{getActivityTypeLabel(activity.activityType)}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Beschrijving:</span>
                  <span className="ml-2 text-slate-600 dark:text-slate-400">{activity.description}</span>
                </div>
                {activity.changes && activity.changes.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Wijzigingen:</span>
                    <ul className="mt-2 space-y-1">
                      {activity.changes.map((change, idx) => (
                        <li key={idx} className="text-sm text-slate-600 dark:text-slate-400">
                          <strong>{change.field}:</strong> {String(change.oldValue)} → {String(change.newValue)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })()}
        </Card>
      )}
    </div>
  );
};

