import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Trash2, Search, Filter } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Modal } from '@/components/common/Modal';
import { documentService } from '../../services/documentService';
import type { CRMDocument } from '../../types/crm.types';
import { useToast } from '@/context/ToastContext';

interface DocumentListProps {
  customerId?: string;
  leadId?: string;
  onUpdate?: () => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  customerId,
  leadId,
  onUpdate,
}) => {
  const { showToast } = useToast();
  const [documents, setDocuments] = useState<CRMDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [selectedDocument, setSelectedDocument] = useState<CRMDocument | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [customerId, leadId]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const data = await documentService.getDocuments({
        customerId,
        leadId,
        category: categoryFilter as CRMDocument['category'] || undefined,
      });
      setDocuments(data);
    } catch (error) {
      console.error('Error loading documents:', error);
      showToast('Fout bij laden van documenten', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [categoryFilter]);

  const handleDownload = async (document: CRMDocument) => {
    try {
      const url = await documentService.downloadDocument(document.id);
      const link = document.createElement('a');
      link.href = url;
      link.download = document.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Document gedownload', 'success');
    } catch (error) {
      console.error('Error downloading document:', error);
      showToast('Fout bij downloaden van document', 'error');
    }
  };

  const handlePreview = async (document: CRMDocument) => {
    try {
      const url = await documentService.getPreviewUrl(document.id);
      setSelectedDocument({ ...document, url });
      setShowPreview(true);
    } catch (error) {
      console.error('Error previewing document:', error);
      showToast('Fout bij preview van document', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je dit document wilt verwijderen?')) return;

    try {
      await documentService.deleteDocument(id);
      showToast('Document verwijderd', 'success');
      await loadDocuments();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error deleting document:', error);
      showToast('Fout bij verwijderen van document', 'error');
    }
  };

  const filteredDocuments = documents.filter(doc => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return doc.name.toLowerCase().includes(query) ||
             doc.fileName.toLowerCase().includes(query) ||
             doc.tags.some(tag => tag.toLowerCase().includes(query));
    }
    return true;
  });

  const getCategoryLabel = (category: CRMDocument['category']): string => {
    const labels: Record<CRMDocument['category'], string> = {
      contract: 'Contract',
      quote: 'Offerte',
      invoice: 'Factuur',
      correspondence: 'Correspondentie',
      other: 'Anders',
    };
    return labels[category] || category;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Zoek documenten..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-48"
        >
          <option value="">Alle categorieën</option>
          <option value="contract">Contract</option>
          <option value="quote">Offerte</option>
          <option value="invoice">Factuur</option>
          <option value="correspondence">Correspondentie</option>
          <option value="other">Anders</option>
        </Select>
      </div>

      {/* Documents List */}
      {filteredDocuments.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              Geen documenten gevonden
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {searchQuery || categoryFilter ? 'Probeer andere zoektermen' : 'Upload je eerste document'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredDocuments.map(doc => (
            <Card key={doc.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                    <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {doc.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                      {doc.fileName} • {formatFileSize(doc.fileSize)} • Versie {doc.version}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        doc.category === 'contract' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' :
                        doc.category === 'quote' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300' :
                        doc.category === 'invoice' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300'
                      }`}>
                        {getCategoryLabel(doc.category)}
                      </span>
                      {doc.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                      Geüpload op {new Date(doc.createdAt).toLocaleDateString('nl-NL')}
                      {doc.downloadCount > 0 && ` • ${doc.downloadCount} download${doc.downloadCount !== 1 ? 's' : ''}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Eye className="h-4 w-4" />}
                    onClick={() => handlePreview(doc)}
                  >
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Download className="h-4 w-4" />}
                    onClick={() => handleDownload(doc)}
                  >
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Trash2 className="h-4 w-4" />}
                    onClick={() => handleDelete(doc.id)}
                  >
                    Verwijderen
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => {
          setShowPreview(false);
          setSelectedDocument(null);
        }}
        title={selectedDocument?.name || 'Document Preview'}
        className="max-w-4xl"
      >
        {selectedDocument && (
          <div className="space-y-4">
            <iframe
              src={selectedDocument.url}
              className="w-full h-96 border border-slate-200 dark:border-slate-700 rounded-lg"
              title="Document Preview"
            />
            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPreview(false);
                  setSelectedDocument(null);
                }}
                className="flex-1"
              >
                Sluiten
              </Button>
              <Button
                leftIcon={<Download className="h-4 w-4" />}
                onClick={() => handleDownload(selectedDocument)}
                className="flex-1"
              >
                Downloaden
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

