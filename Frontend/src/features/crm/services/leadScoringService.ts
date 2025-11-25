import type {
  Lead,
  LeadScore,
  LeadScoreFactors,
  CreateLeadScoreInput,
  UpdateLeadScoreInput,
  Interaction,
} from '../types/crm.types';
import { crmService } from './crmService';
import { storage } from '@/utils/storage';

const LEAD_SCORES_KEY = 'bedrijfsbeheer_lead_scores';

// Default scoring weights
const SCORING_WEIGHTS = {
  estimatedValue: 0.30,
  leadSource: 0.20,
  interactionCount: 0.20,
  timeInPipeline: 0.15,
  engagementLevel: 0.15,
};

// Lead source quality scores (higher = better source)
const SOURCE_SCORES: Record<string, number> = {
  'Referral': 90,
  'Website': 70,
  'Social Media': 60,
  'Email Campaign': 65,
  'Trade Show': 75,
  'Cold Call': 50,
  'Other': 55,
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to get all lead scores
function getAllLeadScores(): LeadScore[] {
  return storage.get<LeadScore[]>(LEAD_SCORES_KEY, []);
}

// Helper function to save lead scores
function saveLeadScores(scores: LeadScore[]): void {
  storage.set(LEAD_SCORES_KEY, scores);
}

// Calculate interaction count for a lead
async function getInteractionCount(leadId: string): Promise<number> {
  const interactions = await crmService.getInteractions({ leadId });
  return interactions.length;
}

// Calculate engagement level based on interactions
async function calculateEngagementLevel(leadId: string): Promise<number> {
  const interactions = await crmService.getInteractions({ leadId });
  
  if (interactions.length === 0) return 0;
  
  // Recent interactions weigh more
  const now = new Date();
  const recentInteractions = interactions.filter(interaction => {
    const interactionDate = new Date(interaction.date);
    const daysDiff = (now.getTime() - interactionDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 30; // Last 30 days
  });
  
  // Base score from interaction count
  let score = Math.min(interactions.length * 10, 50);
  
  // Bonus for recent activity
  score += Math.min(recentInteractions.length * 5, 30);
  
  // Bonus for different interaction types (shows engagement)
  const uniqueTypes = new Set(interactions.map(i => i.type)).size;
  score += uniqueTypes * 5;
  
  return Math.min(score, 100);
}

// Calculate time in pipeline score (shorter = better, but not too short)
function calculateTimeInPipelineScore(lead: Lead): number {
  if (!lead.createdDate) return 50; // Default if no date
  
  const createdDate = new Date(lead.createdDate);
  const now = new Date();
  const daysInPipeline = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
  
  // Optimal time is 7-14 days
  if (daysInPipeline >= 7 && daysInPipeline <= 14) return 100;
  if (daysInPipeline < 7) return 70; // Too new
  if (daysInPipeline <= 30) return 80; // Still good
  if (daysInPipeline <= 60) return 60; // Getting stale
  if (daysInPipeline <= 90) return 40; // Stale
  return 20; // Very stale
}

// Calculate estimated value score
function calculateEstimatedValueScore(estimatedValue?: number): number {
  if (!estimatedValue) return 30;
  
  // Normalize to 0-100 scale
  // Assuming max value is 100,000
  const maxValue = 100000;
  return Math.min((estimatedValue / maxValue) * 100, 100);
}

// Calculate lead source score
function calculateLeadSourceScore(source?: string): number {
  if (!source) return 50;
  return SOURCE_SCORES[source] || 55;
}

// Calculate total lead score
async function calculateLeadScore(lead: Lead): Promise<{
  totalScore: number;
  factors: LeadScoreFactors;
  category: 'hot' | 'warm' | 'cold';
}> {
  const interactionCount = await getInteractionCount(lead.id);
  const engagementLevel = await calculateEngagementLevel(lead.id);
  
  const estimatedValueScore = calculateEstimatedValueScore(lead.estimatedValue);
  const leadSourceScore = calculateLeadSourceScore(lead.source);
  const interactionCountScore = Math.min(interactionCount * 15, 100);
  const timeInPipelineScore = calculateTimeInPipelineScore(lead);
  
  const factors: LeadScoreFactors = {
    estimatedValue: estimatedValueScore,
    leadSource: leadSourceScore,
    interactionCount: interactionCountScore,
    timeInPipeline: timeInPipelineScore,
    engagementLevel,
  };
  
  // Calculate weighted total score
  const totalScore = Math.round(
    factors.estimatedValue * SCORING_WEIGHTS.estimatedValue +
    factors.leadSource * SCORING_WEIGHTS.leadSource +
    factors.interactionCount * SCORING_WEIGHTS.interactionCount +
    factors.timeInPipeline * SCORING_WEIGHTS.timeInPipeline +
    factors.engagementLevel * SCORING_WEIGHTS.engagementLevel
  );
  
  // Categorize lead
  let category: 'hot' | 'warm' | 'cold';
  if (totalScore >= 70) category = 'hot';
  else if (totalScore >= 40) category = 'warm';
  else category = 'cold';
  
  return { totalScore, factors, category };
}

export const leadScoringService = {
  // Get all lead scores
  async getLeadScores(): Promise<LeadScore[]> {
    await delay(300);
    return getAllLeadScores();
  },

  // Get score for a specific lead
  async getLeadScore(leadId: string): Promise<LeadScore | undefined> {
    await delay(200);
    const scores = getAllLeadScores();
    return scores.find(s => s.leadId === leadId);
  },

  // Calculate and update score for a lead
  async calculateLeadScore(leadId: string): Promise<LeadScore> {
    await delay(500);
    const leads = await crmService.getLeads();
    const lead = leads.find(l => l.id === leadId);
    
    if (!lead) {
      throw new Error('Lead not found');
    }
    
    const { totalScore, factors, category } = await calculateLeadScore(lead);
    const existingScores = getAllLeadScores();
    const existingScore = existingScores.find(s => s.leadId === leadId);
    
    const now = new Date().toISOString();
    const scoreHistory = existingScore?.scoreHistory || [];
    
    // Add current score to history (keep last 30 entries)
    const updatedHistory = [
      ...scoreHistory.slice(-29),
      { date: now, score: totalScore },
    ];
    
    const leadScore: LeadScore = {
      id: existingScore?.id || `score_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      leadId,
      totalScore,
      factors,
      category,
      lastCalculated: now,
      scoreHistory: updatedHistory,
      createdAt: existingScore?.createdAt || now,
      updatedAt: now,
    };
    
    if (existingScore) {
      const index = existingScores.findIndex(s => s.leadId === leadId);
      existingScores[index] = leadScore;
    } else {
      existingScores.push(leadScore);
    }
    
    saveLeadScores(existingScores);
    return leadScore;
  },

  // Calculate scores for all leads
  async calculateAllLeadScores(): Promise<LeadScore[]> {
    await delay(1000);
    const leads = await crmService.getLeads();
    const scores: LeadScore[] = [];
    
    for (const lead of leads) {
      try {
        const score = await this.calculateLeadScore(lead.id);
        scores.push(score);
      } catch (error) {
        console.error(`Failed to calculate score for lead ${lead.id}:`, error);
      }
    }
    
    return scores;
  },

  // Get leads by category
  async getLeadsByCategory(category: 'hot' | 'warm' | 'cold'): Promise<LeadScore[]> {
    await delay(300);
    const scores = getAllLeadScores();
    return scores.filter(s => s.category === category);
  },

  // Get top N leads by score
  async getTopLeads(limit: number = 10): Promise<LeadScore[]> {
    await delay(300);
    const scores = getAllLeadScores();
    return scores
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, limit);
  },

  // Update scoring weights (for future configuration)
  getScoringWeights() {
    return SCORING_WEIGHTS;
  },

  // Get source scores (for reference)
  getSourceScores() {
    return SOURCE_SCORES;
  },
};

