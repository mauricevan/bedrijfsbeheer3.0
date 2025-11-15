// components/common/modals/EmailWorkOrderEditModal.tsx - Refactored < 300 lines
import React, { useState } from 'react';
import type { WorkOrderStatus, InventoryItem, InventoryCategory } from '../../../types';

interface EmailInfo {
  from: string;
  to: string;
  subject: string;
  date: string;
  body: string;
}

export interface EmailWorkOrderData {
  title: string;
  description: string;
  location?: string;
  scheduledDate?: string;
  estimatedHours?: number;
  estimatedCost?: number;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: WorkOrderStatus;
  requiredInventory?: { itemId: string; quantity: number }[];
  notes?: string;
}

interface EmailWorkOrderEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EmailWorkOrderData) => void;
  emailInfo: EmailInfo;
  customerName: string;
  availableInventory?: InventoryItem[];
  categories?: InventoryCategory[];
}

export const EmailWorkOrderEditModal: React.FC<EmailWorkOrderEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  emailInfo,
  customerName,
  availableInventory = [],
  categories = [],
}) => {
  const [formData, setFormData] = useState<EmailWorkOrderData>({
    title: `${customerName} - Email: ${emailInfo.subject}`,
    description: emailInfo.body,
    location: '',
    scheduledDate: '',
    estimatedHours: undefined,
    estimatedCost: undefined,
    priority: 'normal',
    status: 'To Do' as WorkOrderStatus,
    requiredInventory: [],
    notes: '',
  });

  const [showEmailPreview, setShowEmailPreview] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Titel is verplicht');
      return;
    }
    onSave(formData);
    onClose();
  };

  const updateField = (field: keyof EmailWorkOrderData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Werkorder Aanmaken</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Email Preview Toggle */}
          <button
            type="button"
            onClick={() => setShowEmailPreview(!showEmailPreview)}
            className="w-full px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium"
          >
            {showEmailPreview ? '🔽' : '▶️'} Email Details
          </button>

          {showEmailPreview && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
              <p><strong>Van:</strong> {emailInfo.from}</p>
              <p><strong>Aan:</strong> {emailInfo.to}</p>
              <p><strong>Onderwerp:</strong> {emailInfo.subject}</p>
              <p><strong>Datum:</strong> {emailInfo.date}</p>
              <div className="mt-2 p-3 bg-white rounded border">
                <strong>Inhoud:</strong>
                <p className="mt-1 whitespace-pre-wrap">{emailInfo.body.substring(0, 500)}</p>
              </div>
            </div>
          )}

          {/* Klant */}
          <div>
            <label className="block text-sm font-medium mb-2">Klant</label>
            <input
              type="text"
              value={customerName}
              disabled
              className="w-full px-3 py-2 border rounded-lg bg-gray-100"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Titel *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Beschrijving</label>
            <textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Locatie</label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => updateField('location', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Geplande Datum</label>
              <input
                type="date"
                value={formData.scheduledDate || ''}
                onChange={(e) => updateField('scheduledDate', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Estimates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Geschatte Uren</label>
              <input
                type="number"
                value={formData.estimatedHours || ''}
                onChange={(e) => updateField('estimatedHours', parseFloat(e.target.value))}
                step="0.5"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Geschatte Kosten (€)</label>
              <input
                type="number"
                value={formData.estimatedCost || ''}
                onChange={(e) => updateField('estimatedCost', parseFloat(e.target.value))}
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Prioriteit</label>
              <select
                value={formData.priority}
                onChange={(e) => updateField('priority', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Laag</option>
                <option value="normal">Normaal</option>
                <option value="high">Hoog</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => updateField('status', e.target.value as WorkOrderStatus)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">Notities</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => updateField('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold"
            >
              Annuleren
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Werkorder Aanmaken
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
