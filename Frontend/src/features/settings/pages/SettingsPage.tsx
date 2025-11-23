import React, { useState, useMemo, useEffect } from 'react';
import { Settings, Building2, Users, Shield, Database, Bell, BarChart3 } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { storage } from '@/utils/storage';
import { buildAnalyticsDashboard, clearAnalytics, type AnalyticsDashboard } from '@/utils/analytics';
import { getModulesConfig, toggleModule, type ModuleConfig } from '@/utils/moduleConfig';

const SETTINGS_KEY = 'bedrijfsbeheer_settings';

interface AppSettings {
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyPostalCode: string;
  companyCountry: string;
  kvkNumber: string;
  vatNumber: string;
  defaultVatRate: number;
  currency: string;
  language: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  companyName: '',
  companyAddress: '',
  companyCity: '',
  companyPostalCode: '',
  companyCountry: 'Netherlands',
  kvkNumber: '',
  vatNumber: '',
  defaultVatRate: 21,
  currency: 'EUR',
  language: 'nl',
};

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(
    storage.get<AppSettings>(SETTINGS_KEY, DEFAULT_SETTINGS)
  );
  const [activeTab, setActiveTab] = useState<'company' | 'vat' | 'users' | 'modules' | 'notifications' | 'analytics' | 'database'>('company');
  const [analyticsPeriod, setAnalyticsPeriod] = useState<AnalyticsDashboard['period']>('month');
  const [isSaving, setIsSaving] = useState(false);
  const [modules, setModules] = useState<ModuleConfig[]>(getModulesConfig());

  useEffect(() => {
    setModules(getModulesConfig());
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    storage.set(SETTINGS_KEY, settings);
    setIsSaving(false);
    alert('Instellingen opgeslagen!');
  };

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const analytics = useMemo(() => buildAnalyticsDashboard(analyticsPeriod), [analyticsPeriod]);

  // Mock database diagnostics data
  const databaseDiagnostics = useMemo(() => [
    {
      category: 'Performance',
      issue: 'Slow Query Detected',
      severity: 'high' as const,
      message: 'Query execution time exceeds 2 seconds',
      diagnostic_steps: [
        'Check query execution plan',
        'Review database indexes',
        'Analyze table statistics',
      ],
      suggested_fix: [
        'Add index on frequently queried columns',
        'Optimize query structure',
        'Consider query caching',
      ],
      test_action: 'run_query_analysis',
      latency: 2340,
      occurrences: 15,
    },
    {
      category: 'Connectivity',
      issue: 'Connection Pool Exhaustion',
      severity: 'medium' as const,
      message: 'Connection pool reaching maximum capacity',
      diagnostic_steps: [
        'Check active connections',
        'Review connection pool settings',
        'Monitor connection usage patterns',
      ],
      suggested_fix: [
        'Increase connection pool size',
        'Implement connection timeout',
        'Review connection lifecycle management',
      ],
      test_action: 'check_connection_pool',
      occurrences: 8,
    },
    {
      category: 'Data Integrity',
      issue: 'Missing Foreign Key Constraints',
      severity: 'low' as const,
      message: 'Some tables lack foreign key constraints',
      diagnostic_steps: [
        'Review table relationships',
        'Check data consistency',
        'Validate referential integrity',
      ],
      suggested_fix: [
        'Add foreign key constraints',
        'Validate existing data',
        'Update application logic',
      ],
      test_action: 'validate_foreign_keys',
    },
  ], []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Instellingen</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Beheer systeeminstellingen</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('company')}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'company'
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Building2 className="h-5 w-5" />
                <span>Bedrijfsgegevens</span>
              </button>
              <button
                onClick={() => setActiveTab('vat')}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'vat'
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Shield className="h-5 w-5" />
                <span>BTW Instellingen</span>
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'users'
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Users className="h-5 w-5" />
                <span>Gebruikers</span>
              </button>
              <button
                onClick={() => setActiveTab('modules')}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'modules'
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Settings className="h-5 w-5" />
                <span>Modules</span>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'notifications'
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Bell className="h-5 w-5" />
                <span>Notificaties</span>
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'analytics'
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <BarChart3 className="h-5 w-5" />
                <span>Analytics</span>
              </button>
              <button
                onClick={() => setActiveTab('database')}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'database'
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Database className="h-5 w-5" />
                <span>Database</span>
              </button>
            </nav>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="p-6">
            {activeTab === 'company' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Bedrijfsgegevens</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Bedrijfsnaam
                    </label>
                    <Input
                      value={settings.companyName}
                      onChange={(e) => updateSetting('companyName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Adres
                    </label>
                    <Input
                      value={settings.companyAddress}
                      onChange={(e) => updateSetting('companyAddress', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Stad
                    </label>
                    <Input
                      value={settings.companyCity}
                      onChange={(e) => updateSetting('companyCity', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Postcode
                    </label>
                    <Input
                      value={settings.companyPostalCode}
                      onChange={(e) => updateSetting('companyPostalCode', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Land
                    </label>
                    <Input
                      value={settings.companyCountry}
                      onChange={(e) => updateSetting('companyCountry', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      KvK Nummer
                    </label>
                    <Input
                      value={settings.kvkNumber}
                      onChange={(e) => updateSetting('kvkNumber', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      BTW Nummer
                    </label>
                    <Input
                      value={settings.vatNumber}
                      onChange={(e) => updateSetting('vatNumber', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'vat' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">BTW Instellingen</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Standaard BTW Tarief (%)
                    </label>
                    <Input
                      type="number"
                      value={settings.defaultVatRate}
                      onChange={(e) => updateSetting('defaultVatRate', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Valuta
                    </label>
                    <select
                      value={settings.currency}
                      onChange={(e) => updateSetting('currency', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="EUR">EUR (€)</option>
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Gebruikersbeheer</h2>
                <p className="text-slate-500 dark:text-slate-400">
                  Gebruikersbeheer wordt beheerd via het HRM module.
                </p>
              </div>
            )}

            {activeTab === 'modules' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Module Beheer</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {modules.filter(m => m.enabled).length} van {modules.length} modules actief
                  </p>
                </div>
                <div className="space-y-3">
                  {modules.map((module) => (
                    <div
                      key={module.key}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{module.icon}</span>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{module.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{module.description}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={module.enabled}
                          onChange={(e) => {
                            const newEnabled = e.target.checked;
                            toggleModule(module.key, newEnabled);
                            setModules(getModulesConfig());
                            // Show notification
                            if (newEnabled) {
                              alert(`Module "${module.name}" is nu ingeschakeld. Herlaad de pagina om de wijzigingen te zien.`);
                            } else {
                              alert(`Module "${module.name}" is nu uitgeschakeld. Herlaad de pagina om de wijzigingen te zien.`);
                            }
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    💡 <strong>Tip:</strong> Uitgeschakelde modules worden verborgen in het navigatiemenu. 
                    Herlaad de pagina na het wijzigen van module-instellingen om de wijzigingen te zien.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Notificatie Instellingen</h2>
                <p className="text-slate-500 dark:text-slate-400">
                  Notificatie-instellingen komen binnenkort beschikbaar.
                </p>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Systeem Analytics</h2>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Periode:</label>
                    <select
                      value={analyticsPeriod}
                      onChange={(e) => setAnalyticsPeriod(e.target.value as AnalyticsDashboard['period'])}
                      className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="day">Vandaag</option>
                      <option value="week">Laatste Week</option>
                      <option value="month">Laatste Maand</option>
                      <option value="quarter">Laatste Kwartaal</option>
                      <option value="year">Laatste Jaar</option>
                    </select>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        if (confirm('Weet u zeker dat u alle analytics data wilt wissen?')) {
                          clearAnalytics();
                          window.location.reload();
                        }
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Totale Events</p>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {analytics.totalEvents.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      {analytics.trends.usageGrowth > 0 ? '↑' : '↓'}{' '}
                      {Math.abs(analytics.trends.usageGrowth).toFixed(1)}% vs vorige periode
                    </p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Actieve Gebruikers</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {analytics.totalUsers}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Unieke gebruikers</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Totale Gebruikstijd</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {analytics.totalTime}h
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">In {analytics.period}</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Efficiency Verandering</p>
                    <p
                      className={`text-2xl font-bold ${
                        analytics.trends.efficiencyChange >= 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {analytics.trends.efficiencyChange >= 0 ? '+' : ''}
                      {analytics.trends.efficiencyChange.toFixed(1)}%
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">vs vorige periode</p>
                  </Card>
                </div>

                {/* Module Stats Table */}
                {analytics.moduleStats.length > 0 && (
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      Module Gebruik Statistieken
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="text-left py-2 px-2 text-slate-700 dark:text-slate-300">Module</th>
                            <th className="text-right py-2 px-2 text-slate-700 dark:text-slate-300">Sessies</th>
                            <th className="text-right py-2 px-2 text-slate-700 dark:text-slate-300">Tijd (min)</th>
                            <th className="text-right py-2 px-2 text-slate-700 dark:text-slate-300">Acties</th>
                            <th className="text-right py-2 px-2 text-slate-700 dark:text-slate-300">Fouten</th>
                            <th className="text-center py-2 px-2 text-slate-700 dark:text-slate-300">Trend</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analytics.moduleStats.map((stat) => (
                            <tr
                              key={stat.module}
                              className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                              <td className="py-2 px-2 font-medium text-slate-900 dark:text-white">
                                {stat.module}
                              </td>
                              <td className="text-right py-2 px-2 text-slate-600 dark:text-slate-400">
                                {stat.totalSessions}
                              </td>
                              <td className="text-right py-2 px-2 text-slate-600 dark:text-slate-400">
                                {stat.totalTime}
                              </td>
                              <td className="text-right py-2 px-2 text-slate-600 dark:text-slate-400">
                                {stat.actionsCount}
                              </td>
                              <td className="text-right py-2 px-2">
                                <span
                                  className={
                                    stat.errorCount > 0 ? 'text-red-600 dark:text-red-400 font-semibold' : ''
                                  }
                                >
                                  {stat.errorCount}
                                </span>
                              </td>
                              <td className="text-center py-2 px-2">
                                {stat.usageTrend === 'increasing' && (
                                  <span className="text-green-600 dark:text-green-400">↑</span>
                                )}
                                {stat.usageTrend === 'decreasing' && (
                                  <span className="text-red-600 dark:text-red-400">↓</span>
                                )}
                                {stat.usageTrend === 'stable' && (
                                  <span className="text-slate-400">→</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                )}

                {/* Empty State */}
                {analytics.totalEvents === 0 && (
                  <Card className="p-12 text-center">
                    <p className="text-slate-500 dark:text-slate-400 text-lg mb-4">
                      📊 Geen analytics data beschikbaar
                    </p>
                    <p className="text-sm text-slate-400 dark:text-slate-500">
                      Begin met gebruik van het systeem om analytics data te verzamelen.
                    </p>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'database' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Database Diagnostics</h2>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Card className="p-4 border-l-4 border-red-500">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">High Severity</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {databaseDiagnostics.filter((d) => d.severity === 'high').length}
                    </p>
                  </Card>
                  <Card className="p-4 border-l-4 border-orange-500">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Medium Severity</p>
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {databaseDiagnostics.filter((d) => d.severity === 'medium').length}
                    </p>
                  </Card>
                  <Card className="p-4 border-l-4 border-blue-500">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Low Severity</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {databaseDiagnostics.filter((d) => d.severity === 'low').length}
                    </p>
                  </Card>
                  <Card className="p-4 border-l-4 border-purple-500">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Issues</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {databaseDiagnostics.length}
                    </p>
                  </Card>
                </div>

                {/* Issues List */}
                <div className="space-y-4">
                  {databaseDiagnostics.map((issue, index) => {
                    const severityColors = {
                      high: 'border-red-500 bg-red-50 dark:bg-red-900/20',
                      medium: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20',
                      low: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
                    };

                    const severityTextColors = {
                      high: 'text-red-700 dark:text-red-300',
                      medium: 'text-orange-700 dark:text-orange-300',
                      low: 'text-blue-700 dark:text-blue-300',
                    };

                    return (
                      <Card
                        key={index}
                        className={`p-4 border-l-4 ${severityColors[issue.severity]} dark:border-opacity-50`}
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h4 className="font-semibold text-slate-900 dark:text-white text-base sm:text-lg">
                                {issue.issue}
                              </h4>
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded ${severityTextColors[issue.severity]} bg-white dark:bg-slate-800 border`}
                              >
                                {issue.severity.toUpperCase()}
                              </span>
                              <span className="px-2 py-1 text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded">
                                {issue.category}
                              </span>
                              {issue.latency && (
                                <span className="px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                                  ⏱️ {issue.latency}ms
                                </span>
                              )}
                              {issue.occurrences && (
                                <span className="px-2 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded">
                                  📊 {issue.occurrences}x
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">{issue.message}</p>
                          </div>
                        </div>

                        {/* Diagnostic Steps */}
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
                            🔍 Diagnostische Stappen:
                          </p>
                          <ul className="text-xs space-y-1 ml-4">
                            {issue.diagnostic_steps.map((step, idx) => (
                              <li key={idx} className="text-slate-600 dark:text-slate-400 list-disc">
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Suggested Fixes */}
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
                            ✅ Voorgestelde Oplossingen:
                          </p>
                          <ul className="text-xs space-y-1 ml-4">
                            {issue.suggested_fix.map((fix, idx) => (
                              <li key={idx} className="text-slate-600 dark:text-slate-400 list-disc">
                                {fix}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Test Action Button */}
                        <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-700">
                          <Button
                            size="sm"
                            onClick={() => {
                              alert(
                                `Test actie "${issue.test_action}" zou worden uitgevoerd.\n\nIn productie zou dit een backend API call zijn naar:\nPOST /api/diagnostics/${issue.test_action}`
                              );
                            }}
                          >
                            🧪 Test: {issue.test_action.replace(/_/g, ' ')}
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <Button variant="outline" onClick={() => setSettings(storage.get<AppSettings>(SETTINGS_KEY, DEFAULT_SETTINGS))}>
                Annuleren
              </Button>
              <Button onClick={handleSave} isLoading={isSaving}>
                Opslaan
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

