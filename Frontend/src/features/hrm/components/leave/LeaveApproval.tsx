import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, User, Calendar, FileText, CheckSquare, X } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { leaveService } from '../../services/leaveService';
import { hrmService } from '../../services/hrmService';
import type { LeaveRequest, Employee } from '../../types/hrm.types';
import { useToast } from '@/context/ToastContext';

interface LeaveApprovalProps {
  currentUserId: string;
  onUpdate?: () => void;
}

export const LeaveApproval: React.FC<LeaveApprovalProps> = ({
  currentUserId,
  onUpdate,
}) => {
  const { showToast } = useToast();
  const [pendingRequests, setPendingRequests] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [reviewComments, setReviewComments] = useState('');
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const requests = leaveService.getPendingLeaveRequests();
      const employeesData = await hrmService.getEmployees();
      
      // Sort by requested date (oldest first)
      const sorted = requests.sort((a, b) => 
        new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime()
      );
      
      setPendingRequests(sorted);
      setEmployees(employeesData);
    } catch (error) {
      console.error('Error loading leave requests:', error);
      showToast('Fout bij laden van verlofaanvragen', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeName = (employeeId: string): string => {
    const employee = employees.find(e => e.id === employeeId);
    return employee?.name || 'Onbekend';
  };

  const getLeaveTypeLabel = (type: LeaveRequest['type']): string => {
    const labels: Record<LeaveRequest['type'], string> = {
      vacation: 'Vakantie',
      sick: 'Ziekte',
      care: 'Zorgverlof',
      parental: 'Ouderschapsverlof',
      special: 'Bijzonder verlof',
      unpaid: 'Onbetaald verlof',
      compensatory: 'Compensatieverlof',
    };
    return labels[type] || type;
  };

  const handleApprove = async (requestId: string, comments?: string) => {
    try {
      leaveService.approveLeaveRequest(requestId, currentUserId, comments);
      showToast('Verlofaanvraag goedgekeurd', 'success');
      await loadData();
      if (onUpdate) onUpdate();
      setShowDetailModal(false);
      setSelectedRequest(null);
      setReviewComments('');
    } catch (error) {
      console.error('Error approving request:', error);
      showToast('Fout bij goedkeuren van aanvraag', 'error');
    }
  };

  const handleReject = async (requestId: string, comments?: string) => {
    try {
      leaveService.rejectLeaveRequest(requestId, currentUserId, comments || 'Afgewezen zonder opmerkingen');
      showToast('Verlofaanvraag afgewezen', 'success');
      await loadData();
      if (onUpdate) onUpdate();
      setShowDetailModal(false);
      setSelectedRequest(null);
      setReviewComments('');
    } catch (error) {
      console.error('Error rejecting request:', error);
      showToast('Fout bij afwijzen van aanvraag', 'error');
    }
  };

  const handleBulkApprove = async () => {
    if (selectedRequests.size === 0) {
      showToast('Selecteer minimaal één aanvraag', 'warning');
      return;
    }

    try {
      for (const requestId of selectedRequests) {
        leaveService.approveLeaveRequest(requestId, currentUserId);
      }
      showToast(`${selectedRequests.size} aanvragen goedgekeurd`, 'success');
      setSelectedRequests(new Set());
      await loadData();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error bulk approving:', error);
      showToast('Fout bij bulk goedkeuren', 'error');
    }
  };

  const toggleSelectRequest = (requestId: string) => {
    const newSelected = new Set(selectedRequests);
    if (newSelected.has(requestId)) {
      newSelected.delete(requestId);
    } else {
      newSelected.add(requestId);
    }
    setSelectedRequests(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedRequests.size === pendingRequests.length) {
      setSelectedRequests(new Set());
    } else {
      setSelectedRequests(new Set(pendingRequests.map(r => r.id)));
    }
  };

  const openDetailModal = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setReviewComments('');
    setShowDetailModal(true);
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
            Verlofaanvragen Goedkeuren
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {pendingRequests.length} wachtende aanvraag{pendingRequests.length !== 1 ? 'en' : ''}
          </p>
        </div>
        {pendingRequests.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={toggleSelectAll}
            >
              {selectedRequests.size === pendingRequests.length ? 'Deselecteer Alles' : 'Selecteer Alles'}
            </Button>
            {selectedRequests.size > 0 && (
              <Button
                leftIcon={<CheckSquare className="h-4 w-4" />}
                onClick={handleBulkApprove}
              >
                Goedkeuren ({selectedRequests.size})
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Requests List */}
      {pendingRequests.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              Geen wachtende aanvragen
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Alle verlofaanvragen zijn verwerkt
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map(request => {
            const employee = employees.find(e => e.id === request.employeeId);
            const isSelected = selectedRequests.has(request.id);

            return (
              <Card
                key={request.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : ''
                }`}
                onClick={() => openDetailModal(request)}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <div
                    className="mt-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelectRequest(request.id);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {getEmployeeName(request.employeeId)}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {employee?.email}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        request.type === 'vacation' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' :
                        request.type === 'sick' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300' :
                        'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
                      }`}>
                        {getLeaveTypeLabel(request.type)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-300">
                          {new Date(request.startDate).toLocaleDateString('nl-NL')} - {new Date(request.endDate).toLocaleDateString('nl-NL')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-300">
                          {request.totalDays} {request.totalDays === 1 ? 'dag' : 'dagen'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-300">
                          Aangevraagd: {new Date(request.requestedAt).toLocaleDateString('nl-NL')}
                        </span>
                      </div>
                    </div>

                    {request.reason && (
                      <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          <span className="font-medium">Reden:</span> {request.reason}
                        </p>
                      </div>
                    )}

                    {request.comments && (
                      <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          <span className="font-medium">Opmerkingen:</span> {request.comments}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<CheckCircle className="h-4 w-4" />}
                        onClick={() => handleApprove(request.id)}
                        className="flex-1"
                      >
                        Goedkeuren
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<XCircle className="h-4 w-4" />}
                        onClick={() => handleReject(request.id, 'Afgewezen zonder opmerkingen')}
                        className="flex-1"
                      >
                        Afwijzen
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedRequest(null);
          setReviewComments('');
        }}
        title="Verlofaanvraag Details"
        className="max-w-2xl"
      >
        {selectedRequest && (
          <div className="space-y-6">
            {/* Employee Info */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-full">
                <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {getEmployeeName(selectedRequest.employeeId)}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {employees.find(e => e.id === selectedRequest.employeeId)?.email}
                </p>
              </div>
            </div>

            {/* Request Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Type</label>
                <p className="text-slate-900 dark:text-white">{getLeaveTypeLabel(selectedRequest.type)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Aantal Dagen</label>
                <p className="text-slate-900 dark:text-white">{selectedRequest.totalDays} dagen</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Startdatum</label>
                <p className="text-slate-900 dark:text-white">
                  {new Date(selectedRequest.startDate).toLocaleDateString('nl-NL')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Einddatum</label>
                <p className="text-slate-900 dark:text-white">
                  {new Date(selectedRequest.endDate).toLocaleDateString('nl-NL')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Aangevraagd Op</label>
                <p className="text-slate-900 dark:text-white">
                  {new Date(selectedRequest.requestedAt).toLocaleDateString('nl-NL')}
                </p>
              </div>
            </div>

            {selectedRequest.reason && (
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Reden</label>
                <p className="text-slate-900 dark:text-white mt-1">{selectedRequest.reason}</p>
              </div>
            )}

            {selectedRequest.comments && (
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Opmerkingen</label>
                <p className="text-slate-900 dark:text-white mt-1">{selectedRequest.comments}</p>
              </div>
            )}

            {/* Review Comments */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Opmerkingen bij Beoordeling (optioneel)
              </label>
              <textarea
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg 
                         bg-white dark:bg-slate-700 text-slate-900 dark:text-white
                         focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Voeg eventuele opmerkingen toe..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedRequest(null);
                  setReviewComments('');
                }}
                className="flex-1"
              >
                Annuleren
              </Button>
              <Button
                variant="outline"
                leftIcon={<XCircle className="h-4 w-4" />}
                onClick={() => handleReject(selectedRequest.id, reviewComments)}
                className="flex-1"
              >
                Afwijzen
              </Button>
              <Button
                leftIcon={<CheckCircle className="h-4 w-4" />}
                onClick={() => handleApprove(selectedRequest.id, reviewComments)}
                className="flex-1"
              >
                Goedkeuren
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

