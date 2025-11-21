import React from 'react';
import { Calendar, MapPin, User, DollarSign, Clock, Package, FileText } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import type { WorkOrder } from '../types';

interface WorkOrderDetailProps {
  workOrder: WorkOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const WorkOrderDetail: React.FC<WorkOrderDetailProps> = ({
  workOrder,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!workOrder) return null;

  const statusColors = {
    todo: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  };

  const statusLabels = {
    todo: 'Te Doen',
    pending: 'In Afwachting',
    in_progress: 'Bezig',
    completed: 'Voltooid',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Werkorder: ${workOrder.title}`} className="max-w-3xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[workOrder.status]}`}>
                {statusLabels[workOrder.status]}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400">{workOrder.description}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workOrder.assignedToName && (
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Toegewezen aan</p>
                <p className="font-medium text-slate-900 dark:text-white">{workOrder.assignedToName}</p>
              </div>
            </div>
          )}
          {workOrder.customerName && (
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Klant</p>
                <p className="font-medium text-slate-900 dark:text-white">{workOrder.customerName}</p>
              </div>
            </div>
          )}
          {workOrder.location && (
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Locatie</p>
                <p className="font-medium text-slate-900 dark:text-white">{workOrder.location}</p>
              </div>
            </div>
          )}
          {workOrder.scheduledDate && (
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Geplande datum</p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {new Date(workOrder.scheduledDate).toLocaleDateString('nl-NL')}
                </p>
              </div>
            </div>
          )}
          {workOrder.completedDate && (
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Voltooid op</p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {new Date(workOrder.completedDate).toLocaleDateString('nl-NL')}
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Geschatte uren</p>
              <p className="font-medium text-slate-900 dark:text-white">{workOrder.estimatedHours} uur</p>
            </div>
          </div>
          {workOrder.hoursSpent > 0 && (
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Gewerkte uren</p>
                <p className="font-medium text-slate-900 dark:text-white">{workOrder.hoursSpent} uur</p>
              </div>
            </div>
          )}
          {workOrder.estimatedCost > 0 && (
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Geschatte kosten</p>
                <p className="font-medium text-slate-900 dark:text-white">€{workOrder.estimatedCost.toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Materials */}
        {workOrder.materials && workOrder.materials.length > 0 && (
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Benodigde Materialen
            </h3>
            <div className="space-y-2">
              {workOrder.materials.map((material, index) => (
                <div
                  key={index}
                  className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{material.name}</p>
                      {material.inventoryItemId && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">Uit voorraad</p>
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      {material.quantity} {material.unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {workOrder.notes && (
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notities
            </h3>
            <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{workOrder.notes}</p>
            </div>
          </div>
        )}

        {/* Pending Reason */}
        {workOrder.pendingReason && (
          <div>
            <h3 className="font-semibold text-amber-700 dark:text-amber-300 mb-3">Reden voor afwachting</h3>
            <div className="p-3 border border-amber-200 dark:border-amber-800 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <p className="text-amber-800 dark:text-amber-300">{workOrder.pendingReason}</p>
            </div>
          </div>
        )}

        {/* Related Documents */}
        {(workOrder.quoteId || workOrder.invoiceId) && (
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Gerelateerde Documenten</h3>
            <div className="space-y-2">
              {workOrder.quoteId && (
                <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Offerte ID: {workOrder.quoteId}</p>
                </div>
              )}
              {workOrder.invoiceId && (
                <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Factuur ID: {workOrder.invoiceId}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button variant="outline" onClick={onDelete}>
            Verwijderen
          </Button>
          <Button onClick={onEdit}>
            Bewerken
          </Button>
        </div>
      </div>
    </Modal>
  );
};

