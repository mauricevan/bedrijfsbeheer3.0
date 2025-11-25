import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { AlertTriangle, FileWarning, Target, FileText, Download, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/common/Card';
import type { Incident, Warning, ImprovementPlan, Employee } from '../types/hrm.types';
import {
  getIncidentTypeLabel,
  getIncidentSeverityLabel,
  getIncidentStatusLabel,
  getWarningTypeLabel,
  getSeverityColorClasses,
  getStatusColorClasses,
  getWarningTypeColorClasses,
  formatFileSize,
} from '../utils/disciplinaryUtils';

type TimelineEvent = {
  id: string;
  type: 'incident' | 'warning' | 'improvement_plan';
  date: string;
  data: Incident | Warning | ImprovementPlan;
};

type DisciplinaryTimelineProps = {
  incidents: Incident[];
  warnings: Warning[];
  improvementPlans: ImprovementPlan[];
  employees: Employee[];
};

export const DisciplinaryTimeline: React.FC<DisciplinaryTimelineProps> = ({
  incidents,
  warnings,
  improvementPlans,
  employees,
}) => {
  const timeline = useMemo(() => {
    const events: TimelineEvent[] = [
      ...incidents.map(i => ({
        id: i.id,
        type: 'incident' as const,
        date: i.date,
        data: i,
      })),
      ...warnings.map(w => ({
        id: w.id,
        type: 'warning' as const,
        date: w.date,
        data: w,
      })),
      ...improvementPlans.map(p => ({
        id: p.id,
        type: 'improvement_plan' as const,
        date: p.startDate,
        data: p,
      })),
    ];

    // Sort by date (newest first)
    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [incidents, warnings, improvementPlans]);

  const getEmployeeName = (employeeId: string): string => {
    const employee = employees.find(e => e.id === employeeId);
    return employee?.name || 'Onbekend';
  };

  if (timeline.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <p className="text-slate-500 dark:text-slate-400">Geen gebeurtenissen in het dossier</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {timeline.map((event, index) => (
        <div key={event.id} className="relative">
          {/* Timeline line */}
          {index < timeline.length - 1 && (
            <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
          )}

          {event.type === 'incident' && (
            <IncidentTimelineItem
              incident={event.data as Incident}
              employees={employees}
              getEmployeeName={getEmployeeName}
            />
          )}

          {event.type === 'warning' && (
            <WarningTimelineItem
              warning={event.data as Warning}
              getEmployeeName={getEmployeeName}
            />
          )}

          {event.type === 'improvement_plan' && (
            <ImprovementPlanTimelineItem
              plan={event.data as ImprovementPlan}
              getEmployeeName={getEmployeeName}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// Incident Timeline Item
const IncidentTimelineItem: React.FC<{
  incident: Incident;
  employees: Employee[];
  getEmployeeName: (id: string) => string;
}> = ({ incident, employees, getEmployeeName }) => (
  <Card className="ml-14 relative">
    <div className="absolute -left-14 top-4 h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
      <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-300" />
    </div>

    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-slate-900 dark:text-white">Incident</h4>
            <span className={`px-2 py-0.5 text-xs rounded-full ${getSeverityColorClasses(incident.severity)}`}>
              {getIncidentSeverityLabel(incident.severity)}
            </span>
            <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColorClasses(incident.status)}`}>
              {getIncidentStatusLabel(incident.status)}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {format(new Date(incident.date), 'd MMMM yyyy', { locale: nl })} om {incident.time}
          </p>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
          {getIncidentTypeLabel(incident.type)}
        </span>
      </div>

      <p className="text-sm text-slate-700 dark:text-slate-300">{incident.description}</p>

      {incident.witnesses.length > 0 && (
        <div className="text-sm">
          <span className="text-slate-500 dark:text-slate-400">Getuigen: </span>
          <span className="text-slate-900 dark:text-white">
            {incident.witnesses.map(id => getEmployeeName(id)).join(', ')}
          </span>
        </div>
      )}

      {incident.attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {incident.attachments.map(att => (
            <a
              key={att.id}
              href={att.url}
              download={att.fileName}
              className="flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Download className="h-3 w-3" />
              {att.fileName} ({formatFileSize(att.fileSize)})
            </a>
          ))}
        </div>
      )}

      <div className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
        Toegevoegd door: {getEmployeeName(incident.createdBy)}
      </div>
    </div>
  </Card>
);

// Warning Timeline Item
const WarningTimelineItem: React.FC<{
  warning: Warning;
  getEmployeeName: (id: string) => string;
}> = ({ warning, getEmployeeName }) => (
  <Card className="ml-14 relative">
    <div className="absolute -left-14 top-4 h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
      <FileWarning className="h-6 w-6 text-amber-600 dark:text-amber-300" />
    </div>

    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-slate-900 dark:text-white">Waarschuwing</h4>
            <span className={`px-2 py-0.5 text-xs rounded-full ${getWarningTypeColorClasses(warning.type)}`}>
              {getWarningTypeLabel(warning.type)}
            </span>
            {warning.signedByEmployee && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Ondertekend
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {format(new Date(warning.date), 'd MMMM yyyy', { locale: nl })}
            {warning.validUntil && ` - Geldig tot ${format(new Date(warning.validUntil), 'd MMMM yyyy', { locale: nl })}`}
          </p>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reden:</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">{warning.reason}</p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Volledige tekst:</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{warning.fullText}</p>
      </div>

      {warning.employeeComments && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Opmerkingen medewerker:</p>
          <p className="text-sm text-blue-600 dark:text-blue-400">{warning.employeeComments}</p>
        </div>
      )}

      {warning.attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {warning.attachments.map(att => (
            <a
              key={att.id}
              href={att.url}
              download={att.fileName}
              className="flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Download className="h-3 w-3" />
              {att.fileName} ({formatFileSize(att.fileSize)})
            </a>
          ))}
        </div>
      )}

      <div className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
        Toegevoegd door: {getEmployeeName(warning.createdBy)}
      </div>
    </div>
  </Card>
);

// Improvement Plan Timeline Item
const ImprovementPlanTimelineItem: React.FC<{
  plan: ImprovementPlan;
  getEmployeeName: (id: string) => string;
}> = ({ plan, getEmployeeName }) => (
  <Card className="ml-14 relative">
    <div className="absolute -left-14 top-4 h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
      <Target className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
    </div>

    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-slate-900 dark:text-white">{plan.title}</h4>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              plan.status === 'active'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : plan.status === 'completed'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}>
              {plan.status === 'active' ? 'Actief' : plan.status === 'completed' ? 'Afgerond' : 'Geannuleerd'}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {format(new Date(plan.startDate), 'd MMMM yyyy', { locale: nl })} - {format(new Date(plan.endDate), 'd MMMM yyyy', { locale: nl })}
          </p>
        </div>
      </div>

      <p className="text-sm text-slate-700 dark:text-slate-300">{plan.description}</p>

      {plan.goals.length > 0 && (
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Doelen:</p>
          <ul className="space-y-1">
            {plan.goals.map((goal, idx) => (
              <li key={idx} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Voortgang:</span>
          <span className="text-sm text-slate-600 dark:text-slate-400">{plan.progress}%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all"
            style={{ width: `${plan.progress}%` }}
          />
        </div>
      </div>

      <div className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
        Toegevoegd door: {getEmployeeName(plan.createdBy)}
      </div>
    </div>
  </Card>
);
