import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Select } from '@/components/common/Select';
import { Input } from '@/components/common/Input';
import { documentService } from '../../services/documentService';
import type { CreateCRMDocumentInput, CRMDocument } from '../../types/crm.types';
import { useToast } from '@/context/ToastContext';

interface DocumentUploadProps {
  customerId?: string;
  leadId?: string;
  onSuccess?: (document: CRMDocument) => void;
  onCancel?: () => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  customerId,
  leadId,
  onSuccess,
  onCancel,
}) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateCRMDocumentInput>>({
    customerId,
    leadId,
    name: '',
    category: 'other',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showToast('Bestand is te groot (max 10MB)', 'error');
        return;
      }
      setSelectedFile(file);
      if (!formData.name) {
        setFormData({ ...formData, name: file.name.split('.')[0] });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('Bestand is te groot (max 10MB)', 'error');
        return;
      }
      setSelectedFile(file);
      if (!formData.name) {
        setFormData({ ...formData, name: file.name.split('.')[0] });
      }
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(t => t !== tag) || [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      showToast('Selecteer een bestand', 'error');
      return;
    }

    if (!formData.name) {
      showToast('Voer een naam in', 'error');
      return;
    }

    setUploading(true);
    try {
      const document = await documentService.uploadDocument(selectedFile, {
        customerId: formData.customerId,
        leadId: formData.leadId,
        name: formData.name,
        category: formData.category || 'other',
        tags: formData.tags || [],
        uploadedBy: 'current-user', // TODO: Get from auth context
        sharedWith: [],
      });

      showToast('Document geüpload', 'success');
      if (onSuccess) onSuccess(document);
      
      // Reset form
      setSelectedFile(null);
      setFormData({
        customerId,
        leadId,
        name: '',
        category: 'other',
        tags: [],
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      showToast('Fout bij uploaden van document', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          selectedFile
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
            : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
        }`}
      >
        {selectedFile ? (
          <div className="space-y-2">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <p className="font-medium text-slate-900 dark:text-white">{selectedFile.name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            >
              Verwijderen
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="h-12 w-12 text-slate-400 mx-auto" />
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                Sleep een bestand hierheen of klik om te selecteren
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Maximaal 10MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button type="button" variant="outline" as="span">
                Bestand Selecteren
              </Button>
            </label>
          </div>
        )}
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Document Naam *
          </label>
          <Input
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Bijv. Contract 2025"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Categorie *
          </label>
          <Select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as CRMDocument['category'] })}
          >
            <option value="contract">Contract</option>
            <option value="quote">Offerte</option>
            <option value="invoice">Factuur</option>
            <option value="correspondence">Correspondentie</option>
            <option value="other">Anders</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Voeg tag toe..."
            />
            <Button type="button" onClick={addTag}>
              Toevoegen
            </Button>
          </div>
          {formData.tags && formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-indigo-900 dark:hover:text-indigo-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Annuleren
          </Button>
        )}
        <Button
          type="submit"
          disabled={!selectedFile || uploading}
          className="flex-1"
        >
          {uploading ? 'Uploaden...' : 'Uploaden'}
        </Button>
      </div>
    </form>
  );
};

