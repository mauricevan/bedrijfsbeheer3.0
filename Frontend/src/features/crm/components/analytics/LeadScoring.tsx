import React, { useState, useEffect } from 'react';
import { Flame, Thermometer, Snowflake, TrendingUp, RefreshCw } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { leadScoringService } from '../../services/leadScoringService';
import type { LeadScore } from '../../types/crm.types';
import { useToast } from '@/context/ToastContext';

interface LeadScoringProps {
  leadId: string;
  onUpdate?: () => void;
}

export const LeadScoring: React.FC<LeadScoringProps> = ({ leadId, onUpdate }) => {
  const { showToast } = useToast();
  const [score, setScore] = useState<LeadScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);

  useEffect(() => {
    loadScore();
  }, [leadId]);

  const loadScore = async () => {
    setLoading(true);
    try {
      const leadScore = await leadScoringService.getLeadScore(leadId);
      if (!leadScore) {
        // Calculate if doesn't exist
        const newScore = await leadScoringService.calculateLeadScore(leadId);
        setScore(newScore);
      } else {
        setScore(leadScore);
      }
    } catch (error) {
      console.error('Error loading lead score:', error);
      showToast('Fout bij laden van lead score', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculate = async () => {
    setRecalculating(true);
    try {
      const newScore = await leadScoringService.calculateLeadScore(leadId);
      setScore(newScore);
      showToast('Lead score bijgewerkt', 'success');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error recalculating score:', error);
      showToast('Fout bij herberekenen van score', 'error');
    } finally {
      setRecalculating(false);
    }
  };

  const getCategoryIcon = (category: LeadScore['category']) => {
    switch (category) {
      case 'hot':
        return <Flame className="h-6 w-6 text-red-500" />;
      case 'warm':
        return <Thermometer className="h-6 w-6 text-orange-500" />;
      case 'cold':
        return <Snowflake className="h-6 w-6 text-blue-500" />;
    }
  };

  const getCategoryColor = (category: LeadScore['category']) => {
    switch (category) {
      case 'hot':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300';
      case 'warm':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300';
      case 'cold':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
    }
  };

  const getCategoryLabel = (category: LeadScore['category']) => {
    switch (category) {
      case 'hot':
        return 'Hot Lead';
      case 'warm':
        return 'Warm Lead';
      case 'cold':
        return 'Cold Lead';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!score) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-slate-500 dark:text-slate-400">Geen score beschikbaar</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Lead Score
        </h3>
        <Button
          size="sm"
          variant="outline"
          leftIcon={<RefreshCw className={`h-4 w-4 ${recalculating ? 'animate-spin' : ''}`} />}
          onClick={handleRecalculate}
          disabled={recalculating}
        >
          Herberekenen
        </Button>
      </div>

      {/* Score Display */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center gap-3 mb-4">
          {getCategoryIcon(score.category)}
          <div>
            <p className="text-4xl font-bold text-slate-900 dark:text-white">
              {score.totalScore}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">van 100</p>
          </div>
        </div>
        <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getCategoryColor(score.category)}`}>
          {getCategoryLabel(score.category)}
        </span>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Score Breakdown
        </h4>
        
        {[
          { label: 'Geschatte Waarde', value: score.factors.estimatedValue, weight: 30 },
          { label: 'Lead Bron', value: score.factors.leadSource, weight: 20 },
          { label: 'Interacties', value: score.factors.interactionCount, weight: 20 },
          { label: 'Tijd in Pipeline', value: score.factors.timeInPipeline, weight: 15 },
          { label: 'Engagement Niveau', value: score.factors.engagementLevel, weight: 15 },
        ].map((factor, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">
                {factor.label} ({factor.weight}%)
              </span>
              <span className="font-medium text-slate-900 dark:text-white">
                {factor.value.toFixed(0)}/100
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all"
                style={{ width: `${factor.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Score History */}
      {score.scoreHistory && score.scoreHistory.length > 1 && (
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Score Geschiedenis
          </h4>
          <div className="space-y-2">
            {score.scoreHistory.slice(-5).reverse().map((entry, index) => {
              const previousScore = index < score.scoreHistory.length - 1
                ? score.scoreHistory[score.scoreHistory.length - 2 - index]?.score
                : null;
              const trend = previousScore
                ? entry.score > previousScore
                  ? 'up'
                  : entry.score < previousScore
                  ? 'down'
                  : 'stable'
                : 'stable';

              return (
                <div key={entry.date} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    {new Date(entry.date).toLocaleDateString('nl-NL')}
                  </span>
                  <div className="flex items-center gap-2">
                    {trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                    {trend === 'down' && <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />}
                    <span className="font-medium text-slate-900 dark:text-white">
                      {entry.score}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Laatst berekend: {new Date(score.lastCalculated).toLocaleString('nl-NL')}
        </p>
      </div>
    </Card>
  );
};

