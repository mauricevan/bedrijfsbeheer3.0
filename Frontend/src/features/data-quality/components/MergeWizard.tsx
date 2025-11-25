import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { AlertTriangle, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import type { EntityType, MergePreview } from '../types/data-quality.types';
import { cn } from '@/utils/cn';

interface MergeWizardProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: EntityType;
  masterRecordId: string;
  recordsToMergeIds: string[];
  preview: MergePreview | null;
  isGeneratingPreview: boolean;
  isMerging: boolean;
  onGeneratePreview: () => Promise<void>;
  onMerge: (fieldResolutions?: Record<string, any>) => Promise<void>;
}

export const MergeWizard: React.FC<MergeWizardProps> = ({
  isOpen,
  onClose,
  entityType,
  masterRecordId,
  recordsToMergeIds,
  preview,
  isGeneratingPreview,
  isMerging,
  onGeneratePreview,
  onMerge,
}) => {
  const [fieldResolutions, setFieldResolutions] = useState<Record<string, any>>({});
  const [step, setStep] = useState<'preview' | 'confirm'>('preview');

  useEffect(() => {
    if (isOpen && !preview && !isGeneratingPreview) {
      onGeneratePreview();
    }
  }, [isOpen, preview, isGeneratingPreview, onGeneratePreview]);

  useEffect(() => {
    if (isOpen) {
      setStep('preview');
      setFieldResolutions({});
    }
  }, [isOpen]);

  const handleFieldResolution = (field: string, value: any) => {
    setFieldResolutions(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMerge = async () => {
    await onMerge(fieldResolutions);
    onClose();
  };

  const conflicts = preview?.fieldsToMerge.filter(f => f.conflict) || [];
  const relationsCount = preview?.relationsToRelocate.reduce((sum, r) => sum + r.count, 0) || 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Records Samenvoegen"
      className="max-w-4xl max-h-[90vh] overflow-y-auto"
    >
      {isGeneratingPreview ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Merge preview genereren...</p>
        </div>
      ) : !preview ? (
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">
            Kon geen preview genereren. Probeer het opnieuw.
          </p>
        </div>
      ) : step === 'preview' ? (
        <div className="space-y-6">
          {/* Summary */}
          <Card variant="outline">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-600 dark:text-slate-400 mb-1">Master Record</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {preview.masterRecord.name || preview.masterRecord.id}
                </p>
              </div>
              <div>
                <p className="text-slate-600 dark:text-slate-400 mb-1">Te mergen records</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {preview.recordsToMerge.length}
                </p>
              </div>
            </div>
          </Card>

          {/* Conflicts */}
          {conflicts.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Conflicten ({conflicts.length})
              </h4>
              <div className="space-y-3">
                {conflicts.map((field) => (
                  <Card key={field.field} variant="outline">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                          {field.field}
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Master</p>
                            <p className="text-sm text-slate-900 dark:text-slate-100">
                              {String(field.masterValue || '-')}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Te mergen</p>
                            <p className="text-sm text-slate-900 dark:text-slate-100">
                              {String(field.mergeValue || '-')}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          size="sm"
                          variant={fieldResolutions[field.field] === field.masterValue ? 'primary' : 'outline'}
                          onClick={() => handleFieldResolution(field.field, field.masterValue)}
                        >
                          Master
                        </Button>
                        <Button
                          size="sm"
                          variant={fieldResolutions[field.field] === field.mergeValue ? 'primary' : 'outline'}
                          onClick={() => handleFieldResolution(field.field, field.mergeValue)}
                        >
                          Merge
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Relations to relocate */}
          {relationsCount > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Te verplaatsen relaties ({relationsCount})
              </h4>
              <div className="space-y-2">
                {preview.relationsToRelocate.map((relation) => (
                  <Card key={relation.entityType} variant="outline">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 capitalize">
                          {relation.entityType}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {relation.count} record(s) worden verplaatst naar master record
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-400" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button variant="outline" onClick={onClose}>
              Annuleren
            </Button>
            <Button
              variant="primary"
              onClick={() => setStep('confirm')}
              disabled={conflicts.length > 0 && Object.keys(fieldResolutions).length < conflicts.length}
            >
              Volgende
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Confirmation */}
          <Card variant="outline" className="bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Bevestig samenvoeging
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Deze actie kan niet ongedaan worden gemaakt. De gemergde records worden soft-deleted
                  en alle relaties worden verplaatst naar het master record.
                </p>
              </div>
            </div>
          </Card>

          {/* Summary */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Master record:</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {preview.masterRecord.name || preview.masterRecord.id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Te mergen records:</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {preview.recordsToMerge.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Te verplaatsen relaties:</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {relationsCount}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button variant="outline" onClick={() => setStep('preview')}>
              Terug
            </Button>
            <Button variant="primary" onClick={handleMerge} isLoading={isMerging}>
              Bevestig Merge
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

