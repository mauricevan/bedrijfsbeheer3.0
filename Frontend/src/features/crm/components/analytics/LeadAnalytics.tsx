import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Users, Target, DollarSign, Clock } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Select } from '@/components/common/Select';
import { leadAnalyticsService } from '../../services/leadAnalyticsService';
import type { LeadConversionMetrics, LeadVelocityMetrics, RevenueForecast } from '../../types/crm.types';
import { ConversionFunnel } from './ConversionFunnel';
import { RevenueForecastChart } from './RevenueForecastChart';

export const LeadAnalytics: React.FC = () => {
  const [conversionMetrics, setConversionMetrics] = useState<LeadConversionMetrics | null>(null);
  const [velocityMetrics, setVelocityMetrics] = useState<LeadVelocityMetrics | null>(null);
  const [revenueForecast, setRevenueForecast] = useState<RevenueForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});

  useEffect(() => {
    loadAnalytics();
  }, [period, dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [conversion, velocity, forecast] = await Promise.all([
        leadAnalyticsService.getConversionMetrics(dateRange.start, dateRange.end),
        leadAnalyticsService.getVelocityMetrics(),
        leadAnalyticsService.getRevenueForecast(period),
      ]);
      setConversionMetrics(conversion);
      setVelocityMetrics(velocity);
      setRevenueForecast(forecast);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Lead Analytics
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Inzicht in lead conversie en pipeline performance
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value as 'month' | 'quarter' | 'year')}
            className="w-32"
          >
            <option value="month">Maandelijks</option>
            <option value="quarter">Kwartaal</option>
            <option value="year">Jaarlijks</option>
          </Select>
        </div>
      </div>

      {/* Conversion Metrics Cards */}
      {conversionMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Totaal Leads</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {conversionMetrics.totalLeads}
                </p>
              </div>
              <Users className="h-10 w-10 text-indigo-500" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Geconverteerd</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {conversionMetrics.convertedLeads}
                </p>
              </div>
              <Target className="h-10 w-10 text-green-500" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Conversiepercentage</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {conversionMetrics.conversionRate.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-emerald-500" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Gem. Conversietijd</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {conversionMetrics.averageConversionTime.toFixed(0)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">dagen</p>
              </div>
              <Clock className="h-10 w-10 text-blue-500" />
            </div>
          </Card>
        </div>
      )}

      {/* Conversion Funnel */}
      {conversionMetrics && (
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Conversie Funnel
          </h3>
          <ConversionFunnel metrics={conversionMetrics} />
        </Card>
      )}

      {/* Conversion by Source */}
      {conversionMetrics && conversionMetrics.conversionBySource.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Conversie per Bron
          </h3>
          <div className="space-y-3">
            {conversionMetrics.conversionBySource.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">{source.source}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {source.count} geconverteerd
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {source.conversionRate.toFixed(1)}%
                  </p>
                  <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-1">
                    <div
                      className="h-2 bg-indigo-500 rounded-full"
                      style={{ width: `${Math.min(source.conversionRate, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Velocity Metrics */}
      {velocityMetrics && (
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Pipeline Velocity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">Trend:</span>
              {velocityMetrics.velocityTrend === 'improving' ? (
                <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <TrendingUp className="h-4 w-4" />
                  Verbeterend
                </span>
              ) : velocityMetrics.velocityTrend === 'declining' ? (
                <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                  <TrendingDown className="h-4 w-4" />
                  Achteruitgaand
                </span>
              ) : (
                <span className="text-slate-600 dark:text-slate-400">Stabiel</span>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Gemiddelde Tijd per Fase
              </h4>
              {velocityMetrics.averageTimePerStage.map((stage, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                  <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">
                    {stage.stage}
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {stage.averageDays.toFixed(1)} dagen
                  </span>
                </div>
              ))}
            </div>

            {velocityMetrics.bottlenecks.length > 0 && (
              <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <h4 className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
                  Bottlenecks Geïdentificeerd
                </h4>
                {velocityMetrics.bottlenecks.map((bottleneck, index) => (
                  <div key={index} className="text-sm text-amber-800 dark:text-amber-200">
                    {bottleneck.stage}: {bottleneck.averageDays.toFixed(1)} dagen gemiddeld ({bottleneck.leadsStuck} leads vast)
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Revenue Forecast */}
      {revenueForecast.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Revenue Forecast
          </h3>
          <RevenueForecastChart forecasts={revenueForecast} />
        </Card>
      )}
    </div>
  );
};

