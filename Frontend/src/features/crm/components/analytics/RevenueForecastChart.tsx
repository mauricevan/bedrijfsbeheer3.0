import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { RevenueForecast } from '../../types/crm.types';

interface RevenueForecastChartProps {
  forecasts: RevenueForecast[];
}

export const RevenueForecastChart: React.FC<RevenueForecastChartProps> = ({ forecasts }) => {
  const maxValue = Math.max(...forecasts.map(f => f.expectedRevenue), 0);

  return (
    <div className="space-y-4">
      {forecasts.map((forecast, index) => {
        const percentage = maxValue > 0 ? (forecast.expectedRevenue / maxValue) * 100 : 0;
        const isFirst = index === 0;
        const trend = index > 0
          ? forecast.expectedRevenue > forecasts[index - 1].expectedRevenue
            ? 'up'
            : forecast.expectedRevenue < forecasts[index - 1].expectedRevenue
            ? 'down'
            : 'stable'
          : 'stable';

        return (
          <div key={forecast.period} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {forecast.period}
                </span>
                {isFirst && (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    forecast.confidence === 'high'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                      : forecast.confidence === 'medium'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                  }`}>
                    {forecast.confidence === 'high' ? 'Hoge zekerheid' :
                     forecast.confidence === 'medium' ? 'Gemiddelde zekerheid' : 'Lage zekerheid'}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                {trend !== 'stable' && (
                  <div className="flex items-center gap-1">
                    {trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                )}
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    €{forecast.expectedRevenue.toLocaleString('nl-NL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pipeline: €{forecast.pipelineValue.toLocaleString('nl-NL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
            </div>
            <div className="relative h-6 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  isFirst
                    ? 'bg-indigo-500'
                    : 'bg-indigo-400'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            {forecast.forecastAccuracy && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Nauwkeurigheid: {forecast.forecastAccuracy}%
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

