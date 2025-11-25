import React, { useState, useEffect } from 'react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { AlertTriangle, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useCustomerWarnings } from '../hooks/useCustomerWarnings';
import { useToast } from '@/context/ToastContext';
import type { Customer, CreateCustomerInput, CustomerWarningNote } from '../types/crm.types';

interface CustomerFormProps {
  customer?: Customer | null;
  onSubmit: (data: CreateCustomerInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ customer, onSubmit, onCancel, isLoading }) => {
  const { addWarningNote, updateWarningNote, deleteWarningNote, getAllWarnings } = useCustomerWarnings();
  const { showToast } = useToast();
  const [warningNotes, setWarningNotes] = useState<CustomerWarningNote[]>([]);
  const [showAddWarningForm, setShowAddWarningForm] = useState(false);
  const [editingWarningId, setEditingWarningId] = useState<string | null>(null);
  const [newWarningNote, setNewWarningNote] = useState('');
  const [editWarningNote, setEditWarningNote] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    type: 'business' as 'business' | 'private' | 'individual',
    address: '',
    city: '',
    postalCode: '',
    country: 'Netherlands',
    kvk: '',
    vatNumber: '',
    creditLimit: '',
    paymentTerms: '',
    notes: '',
    source: '',
    tags: [] as string[],
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        company: customer.company || '',
        type: customer.type || 'business',
        address: customer.address || '',
        city: customer.city || '',
        postalCode: customer.postalCode || '',
        country: customer.country || 'Netherlands',
        kvk: customer.kvk || '',
        vatNumber: customer.vatNumber || '',
        creditLimit: customer.creditLimit?.toString() || '',
        paymentTerms: customer.paymentTerms?.toString() || '',
        notes: customer.notes || '',
        source: customer.source || '',
        tags: customer.tags || [],
      });
      // Load warning notes
      if (customer.id) {
        loadWarningNotes(customer.id);
      }
    } else {
      setWarningNotes([]);
    }
  }, [customer]);

  const loadWarningNotes = async (customerId: string) => {
    try {
      const notes = await getAllWarnings(customerId);
      setWarningNotes(notes);
    } catch (error) {
      console.error('Failed to load warning notes:', error);
    }
  };

  const handleAddWarning = async () => {
    if (!customer?.id || !newWarningNote.trim()) return;

    try {
      await addWarningNote(customer.id, newWarningNote.trim());
      await loadWarningNotes(customer.id);
      setNewWarningNote('');
      setShowAddWarningForm(false);
      showToast('Waarschuwing toegevoegd', 'success');
    } catch (error) {
      showToast('Fout bij toevoegen waarschuwing', 'error');
    }
  };

  const handleUpdateWarning = async (noteId: string) => {
    if (!customer?.id || !editWarningNote.trim()) return;

    try {
      await updateWarningNote(customer.id, noteId, { note: editWarningNote.trim() });
      await loadWarningNotes(customer.id);
      setEditingWarningId(null);
      setEditWarningNote('');
      showToast('Waarschuwing bijgewerkt', 'success');
    } catch (error) {
      showToast('Fout bij bijwerken waarschuwing', 'error');
    }
  };

  const handleDeleteWarning = async (noteId: string) => {
    if (!customer?.id) return;

    if (!confirm('Weet je zeker dat je deze waarschuwing wilt verwijderen?')) return;

    try {
      await deleteWarningNote(customer.id, noteId);
      await loadWarningNotes(customer.id);
      showToast('Waarschuwing verwijderd', 'success');
    } catch (error) {
      showToast('Fout bij verwijderen waarschuwing', 'error');
    }
  };

  const handleToggleWarningActive = async (noteId: string, currentStatus: boolean) => {
    if (!customer?.id) return;

    try {
      await updateWarningNote(customer.id, noteId, { isActive: !currentStatus });
      await loadWarningNotes(customer.id);
      showToast('Waarschuwing status bijgewerkt', 'success');
    } catch (error) {
      showToast('Fout bij bijwerken status', 'error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      creditLimit: formData.creditLimit ? parseFloat(formData.creditLimit) : undefined,
      paymentTerms: formData.paymentTerms ? parseInt(formData.paymentTerms) : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Naam *
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            E-mail *
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Telefoon
          </label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="business">Bedrijf</option>
            <option value="private">Particulier</option>
            <option value="individual">Individu</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Bedrijfsnaam
          </label>
          <Input
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            KvK Nummer
          </label>
          <Input
            value={formData.kvk}
            onChange={(e) => setFormData({ ...formData, kvk: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            BTW Nummer
          </label>
          <Input
            value={formData.vatNumber}
            onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Adres
          </label>
          <Input
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Stad
          </label>
          <Input
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Postcode
          </label>
          <Input
            value={formData.postalCode}
            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Land
          </label>
          <Input
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Kredietlimiet (€)
          </label>
          <Input
            type="number"
            value={formData.creditLimit}
            onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Betaaltermijn (dagen)
          </label>
          <Input
            type="number"
            value={formData.paymentTerms}
            onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Bron
          </label>
          <Input
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            placeholder="Website, Referral, etc."
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Notities
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Warning Notes Section */}
      {customer?.id && (
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Waarschuwingsnotities
              </h3>
            </div>
            {!showAddWarningForm && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAddWarningForm(true)}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Waarschuwing toevoegen
              </Button>
            )}
          </div>

          {/* Add Warning Form */}
          {showAddWarningForm && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex gap-2">
                <Input
                  value={newWarningNote}
                  onChange={(e) => setNewWarningNote(e.target.value)}
                  placeholder="Bijv. Klant moet altijd identificeren, Klant moet contant betalen..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleAddWarning}
                  disabled={!newWarningNote.trim()}
                >
                  Toevoegen
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddWarningForm(false);
                    setNewWarningNote('');
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Warning Notes List */}
          {warningNotes.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Geen waarschuwingsnotities
            </p>
          ) : (
            <div className="space-y-2">
              {warningNotes.map((note) => (
                <div
                  key={note.id}
                  className={`p-3 rounded-lg border ${
                    note.isActive
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60'
                  }`}
                >
                  {editingWarningId === note.id ? (
                    <div className="flex gap-2">
                      <Input
                        value={editWarningNote}
                        onChange={(e) => setEditWarningNote(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => handleUpdateWarning(note.id)}
                        disabled={!editWarningNote.trim()}
                      >
                        Opslaan
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingWarningId(null);
                          setEditWarningNote('');
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className={`text-sm ${note.isActive ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                          {note.note}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          {new Date(note.createdAt).toLocaleDateString('nl-NL')}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleToggleWarningActive(note.id, note.isActive)}
                          className={`px-2 py-1 text-xs rounded ${
                            note.isActive
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                          }`}
                          title={note.isActive ? 'Deactiveren' : 'Activeren'}
                        >
                          {note.isActive ? 'Actief' : 'Inactief'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingWarningId(note.id);
                            setEditWarningNote(note.note);
                          }}
                          className="p-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                          title="Bewerken"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteWarning(note.id)}
                          className="p-1 text-slate-500 hover:text-red-600 dark:hover:text-red-400"
                          title="Verwijderen"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuleren
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {customer ? 'Bijwerken' : 'Aanmaken'}
        </Button>
      </div>
    </form>
  );
};

