import type {
  Lead,
  LeadConversionMetrics,
  LeadVelocityMetrics,
  RevenueForecast,
} from '../types/crm.types';
import { crmService } from './crmService';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Lead pipeline stages in order
const PIPELINE_STAGES: Lead['status'][] = [
  'new',
  'contacted',
  'qualified',
  'proposal',
  'negotiation',
  'won',
  'lost',
];

export const leadAnalyticsService = {
  // Calculate conversion metrics
  async getConversionMetrics(
    startDate?: string,
    endDate?: string
  ): Promise<LeadConversionMetrics> {
    await delay(500);
    const leads = await crmService.getLeads();
    
    // Filter by date range if provided
    let filteredLeads = leads;
    if (startDate || endDate) {
      filteredLeads = leads.filter(lead => {
        if (!lead.createdDate) return false;
        const createdDate = new Date(lead.createdDate);
        if (startDate && createdDate < new Date(startDate)) return false;
        if (endDate && createdDate > new Date(endDate)) return false;
        return true;
      });
    }
    
    const totalLeads = filteredLeads.length;
    const convertedLeads = filteredLeads.filter(
      l => l.status === 'won' || l.convertedToCustomerId
    ).length;
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
    
    // Conversion by source
    const sourceMap = new Map<string, { total: number; converted: number }>();
    filteredLeads.forEach(lead => {
      const source = lead.source || 'Unknown';
      const current = sourceMap.get(source) || { total: 0, converted: 0 };
      current.total++;
      if (lead.status === 'won' || lead.convertedToCustomerId) {
        current.converted++;
      }
      sourceMap.set(source, current);
    });
    
    const conversionBySource = Array.from(sourceMap.entries()).map(([source, data]) => ({
      source,
      count: data.converted,
      conversionRate: data.total > 0 ? (data.converted / data.total) * 100 : 0,
    }));
    
    // Conversion by status
    const statusMap = new Map<string, { total: number; converted: number }>();
    filteredLeads.forEach(lead => {
      const status = lead.status;
      const current = statusMap.get(status) || { total: 0, converted: 0 };
      current.total++;
      if (status === 'won' || lead.convertedToCustomerId) {
        current.converted++;
      }
      statusMap.set(status, current);
    });
    
    const conversionByStatus = Array.from(statusMap.entries()).map(([status, data]) => ({
      status,
      count: data.converted,
      conversionRate: data.total > 0 ? (data.converted / data.total) * 100 : 0,
    }));
    
    // Win/Loss ratio
    const wonLeads = filteredLeads.filter(l => l.status === 'won').length;
    const lostLeads = filteredLeads.filter(l => l.status === 'lost').length;
    const winLossRatio = lostLeads > 0 ? wonLeads / lostLeads : wonLeads;
    
    // Average conversion time (in days)
    const convertedLeadsWithDates = filteredLeads
      .filter(l => (l.status === 'won' || l.convertedToCustomerId) && l.createdDate && l.updatedAt)
      .map(lead => {
        const created = new Date(lead.createdDate!);
        const converted = new Date(lead.updatedAt);
        return (converted.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
      });
    
    const averageConversionTime = convertedLeadsWithDates.length > 0
      ? convertedLeadsWithDates.reduce((sum, days) => sum + days, 0) / convertedLeadsWithDates.length
      : 0;
    
    return {
      totalLeads,
      convertedLeads,
      conversionRate,
      conversionBySource,
      conversionByStatus,
      winLossRatio,
      averageConversionTime,
    };
  },

  // Calculate velocity metrics
  async getVelocityMetrics(): Promise<LeadVelocityMetrics> {
    await delay(500);
    const leads = await crmService.getLeads();
    
    // Calculate average time per stage
    const stageTimes = new Map<string, number[]>();
    
    leads.forEach(lead => {
      if (!lead.createdDate || !lead.updatedAt) return;
      
      const created = new Date(lead.createdDate);
      const updated = new Date(lead.updatedAt);
      const totalDays = (updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
      
      // Distribute time across stages (simplified - assumes linear progression)
      const currentStageIndex = PIPELINE_STAGES.indexOf(lead.status);
      if (currentStageIndex === -1) return;
      
      const stagesPassed = currentStageIndex + 1;
      const avgDaysPerStage = totalDays / stagesPassed;
      
      for (let i = 0; i <= currentStageIndex; i++) {
        const stage = PIPELINE_STAGES[i];
        const times = stageTimes.get(stage) || [];
        times.push(avgDaysPerStage);
        stageTimes.set(stage, times);
      }
    });
    
    const averageTimePerStage = Array.from(stageTimes.entries()).map(([stage, times]) => ({
      stage,
      averageDays: times.length > 0
        ? times.reduce((sum, days) => sum + days, 0) / times.length
        : 0,
    }));
    
    // Identify bottlenecks (stages with above-average time)
    const overallAverage = averageTimePerStage.length > 0
      ? averageTimePerStage.reduce((sum, s) => sum + s.averageDays, 0) / averageTimePerStage.length
      : 0;
    
    const bottlenecks = averageTimePerStage
      .filter(stage => stage.averageDays > overallAverage * 1.5)
      .map(stage => {
        // Count leads stuck in this stage
        const leadsStuck = leads.filter(
          l => l.status === stage.stage && 
          l.createdDate && 
          (new Date().getTime() - new Date(l.createdDate).getTime()) / (1000 * 60 * 60 * 24) > stage.averageDays
        ).length;
        
        return {
          stage: stage.stage,
          averageDays: stage.averageDays,
          leadsStuck,
        };
      });
    
    // Determine velocity trend (compare last 30 days vs previous 30 days)
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last60Days = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    
    const recentLeads = leads.filter(l => {
      if (!l.createdDate) return false;
      const created = new Date(l.createdDate);
      return created >= last30Days;
    });
    
    const previousLeads = leads.filter(l => {
      if (!l.createdDate) return false;
      const created = new Date(l.createdDate);
      return created >= last60Days && created < last30Days;
    });
    
    const recentAvgTime = recentLeads.length > 0
      ? recentLeads.reduce((sum, lead) => {
          if (!lead.createdDate || !lead.updatedAt) return sum;
          const days = (new Date(lead.updatedAt).getTime() - new Date(lead.createdDate).getTime()) / (1000 * 60 * 60 * 24);
          return sum + days;
        }, 0) / recentLeads.length
      : 0;
    
    const previousAvgTime = previousLeads.length > 0
      ? previousLeads.reduce((sum, lead) => {
          if (!lead.createdDate || !lead.updatedAt) return sum;
          const days = (new Date(lead.updatedAt).getTime() - new Date(lead.createdDate).getTime()) / (1000 * 60 * 60 * 24);
          return sum + days;
        }, 0) / previousLeads.length
      : 0;
    
    let velocityTrend: 'improving' | 'declining' | 'stable';
    if (previousAvgTime === 0) {
      velocityTrend = 'stable';
    } else {
      const change = ((previousAvgTime - recentAvgTime) / previousAvgTime) * 100;
      if (change > 10) velocityTrend = 'improving';
      else if (change < -10) velocityTrend = 'declining';
      else velocityTrend = 'stable';
    }
    
    return {
      averageTimePerStage,
      bottlenecks,
      velocityTrend,
    };
  },

  // Calculate revenue forecast
  async getRevenueForecast(period: 'month' | 'quarter' | 'year' = 'month'): Promise<RevenueForecast[]> {
    await delay(500);
    const leads = await crmService.getLeads();
    
    // Get active leads (not won/lost)
    const activeLeads = leads.filter(
      l => l.status !== 'won' && l.status !== 'lost'
    );
    
    // Calculate pipeline value
    const pipelineValue = activeLeads.reduce((sum, lead) => {
      return sum + (lead.estimatedValue || 0);
    }, 0);
    
    // Calculate weighted value based on stage probability
    const stageProbabilities: Record<Lead['status'], number> = {
      'new': 0.10,
      'contacted': 0.20,
      'qualified': 0.40,
      'proposal': 0.60,
      'negotiation': 0.80,
      'won': 1.0,
      'lost': 0.0,
    };
    
    const weightedValue = activeLeads.reduce((sum, lead) => {
      const probability = stageProbabilities[lead.status] || 0.1;
      return sum + ((lead.estimatedValue || 0) * probability);
    }, 0);
    
    // Expected revenue (weighted value with confidence adjustment)
    const expectedRevenue = weightedValue * 0.85; // 85% confidence
    
    // Determine confidence level
    let confidence: 'high' | 'medium' | 'low';
    if (activeLeads.length >= 20 && weightedValue > pipelineValue * 0.5) {
      confidence = 'high';
    } else if (activeLeads.length >= 10 && weightedValue > pipelineValue * 0.3) {
      confidence = 'medium';
    } else {
      confidence = 'low';
    }
    
    // Generate forecasts for multiple periods
    const periods: string[] = [];
    const now = new Date();
    
    if (period === 'month') {
      for (let i = 0; i < 3; i++) {
        const month = new Date(now.getFullYear(), now.getMonth() + i, 1);
        periods.push(month.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' }));
      }
    } else if (period === 'quarter') {
      for (let i = 0; i < 4; i++) {
        const quarter = new Date(now.getFullYear(), now.getMonth() + i * 3, 1);
        const quarterNum = Math.floor(quarter.getMonth() / 3) + 1;
        periods.push(`Q${quarterNum} ${quarter.getFullYear()}`);
      }
    } else {
      for (let i = 0; i < 3; i++) {
        periods.push(`${now.getFullYear() + i}`);
      }
    }
    
    return periods.map((periodLabel, index) => {
      // Adjust forecast for future periods (assume growth)
      const growthFactor = 1 + (index * 0.1); // 10% growth per period
      
      return {
        period: periodLabel,
        pipelineValue: pipelineValue * growthFactor,
        weightedValue: weightedValue * growthFactor,
        expectedRevenue: expectedRevenue * growthFactor,
        confidence: index === 0 ? confidence : 'low' as const,
        forecastAccuracy: index === 0 ? 85 : undefined,
      };
    });
  },
};

