import { useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type {
  Incident,
  Warning,
  ImprovementPlan,
  CreateIncidentInput,
  CreateWarningInput,
  CreateImprovementPlanInput,
  UpdateIncidentInput,
  UpdateWarningInput,
  UpdateImprovementPlanInput,
} from '../types/hrm.types';

const INCIDENTS_STORAGE_KEY = 'hrm_incidents';
const WARNINGS_STORAGE_KEY = 'hrm_warnings';
const IMPROVEMENT_PLANS_STORAGE_KEY = 'hrm_improvement_plans';

export const useDisciplinaryDossier = (employeeId?: string) => {
  const [incidents, setIncidents] = useLocalStorage<Incident[]>(INCIDENTS_STORAGE_KEY, []);
  const [warnings, setWarnings] = useLocalStorage<Warning[]>(WARNINGS_STORAGE_KEY, []);
  const [improvementPlans, setImprovementPlans] = useLocalStorage<ImprovementPlan[]>(
    IMPROVEMENT_PLANS_STORAGE_KEY,
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  // Filter by employee if employeeId is provided
  const employeeIncidents = useMemo(() => {
    if (!employeeId) return incidents;
    return incidents.filter(i => i.employeeId === employeeId);
  }, [incidents, employeeId]);

  const employeeWarnings = useMemo(() => {
    if (!employeeId) return warnings;
    return warnings.filter(w => w.employeeId === employeeId);
  }, [warnings, employeeId]);

  const employeeImprovementPlans = useMemo(() => {
    if (!employeeId) return improvementPlans;
    return improvementPlans.filter(p => p.employeeId === employeeId);
  }, [improvementPlans, employeeId]);

  // Incident CRUD operations
  const createIncident = useCallback(
    async (data: CreateIncidentInput): Promise<Incident> => {
      setIsLoading(true);
      try {
        const newIncident: Incident = {
          ...data,
          id: `incident_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setIncidents(prev => [newIncident, ...prev]);
        return newIncident;
      } finally {
        setIsLoading(false);
      }
    },
    [setIncidents]
  );

  const updateIncident = useCallback(
    async (id: string, data: UpdateIncidentInput): Promise<void> => {
      setIsLoading(true);
      try {
        setIncidents(prev =>
          prev.map(incident =>
            incident.id === id
              ? { ...incident, ...data, updatedAt: new Date().toISOString() }
              : incident
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [setIncidents]
  );

  const deleteIncident = useCallback(
    async (id: string): Promise<void> => {
      setIsLoading(true);
      try {
        setIncidents(prev => prev.filter(incident => incident.id !== id));
      } finally {
        setIsLoading(false);
      }
    },
    [setIncidents]
  );

  // Warning CRUD operations
  const createWarning = useCallback(
    async (data: CreateWarningInput): Promise<Warning> => {
      setIsLoading(true);
      try {
        const newWarning: Warning = {
          ...data,
          id: `warning_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setWarnings(prev => [newWarning, ...prev]);
        return newWarning;
      } finally {
        setIsLoading(false);
      }
    },
    [setWarnings]
  );

  const updateWarning = useCallback(
    async (id: string, data: UpdateWarningInput): Promise<void> => {
      setIsLoading(true);
      try {
        setWarnings(prev =>
          prev.map(warning =>
            warning.id === id
              ? { ...warning, ...data, updatedAt: new Date().toISOString() }
              : warning
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [setWarnings]
  );

  const deleteWarning = useCallback(
    async (id: string): Promise<void> => {
      setIsLoading(true);
      try {
        setWarnings(prev => prev.filter(warning => warning.id !== id));
      } finally {
        setIsLoading(false);
      }
    },
    [setWarnings]
  );

  // Improvement Plan CRUD operations
  const createImprovementPlan = useCallback(
    async (data: CreateImprovementPlanInput): Promise<ImprovementPlan> => {
      setIsLoading(true);
      try {
        const newPlan: ImprovementPlan = {
          ...data,
          id: `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setImprovementPlans(prev => [newPlan, ...prev]);
        return newPlan;
      } finally {
        setIsLoading(false);
      }
    },
    [setImprovementPlans]
  );

  const updateImprovementPlan = useCallback(
    async (id: string, data: UpdateImprovementPlanInput): Promise<void> => {
      setIsLoading(true);
      try {
        setImprovementPlans(prev =>
          prev.map(plan =>
            plan.id === id
              ? { ...plan, ...data, updatedAt: new Date().toISOString() }
              : plan
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [setImprovementPlans]
  );

  const deleteImprovementPlan = useCallback(
    async (id: string): Promise<void> => {
      setIsLoading(true);
      try {
        setImprovementPlans(prev => prev.filter(plan => plan.id !== id));
      } finally {
        setIsLoading(false);
      }
    },
    [setImprovementPlans]
  );

  // Get incident by ID
  const getIncidentById = useCallback(
    (id: string): Incident | undefined => {
      return incidents.find(i => i.id === id);
    },
    [incidents]
  );

  // Get warning by ID
  const getWarningById = useCallback(
    (id: string): Warning | undefined => {
      return warnings.find(w => w.id === id);
    },
    [warnings]
  );

  return {
    // Data
    incidents: employeeIncidents,
    warnings: employeeWarnings,
    improvementPlans: employeeImprovementPlans,
    allIncidents: incidents,
    allWarnings: warnings,
    allImprovementPlans: improvementPlans,
    isLoading,

    // Incident operations
    createIncident,
    updateIncident,
    deleteIncident,
    getIncidentById,

    // Warning operations
    createWarning,
    updateWarning,
    deleteWarning,
    getWarningById,

    // Improvement plan operations
    createImprovementPlan,
    updateImprovementPlan,
    deleteImprovementPlan,
  };
};
