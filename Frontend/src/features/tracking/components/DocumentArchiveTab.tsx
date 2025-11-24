import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { getAllDocumentsForArchive, filterAllDocuments } from '../services/archiveService';
import type { ArchiveFilter, ArchivedDocument } from '../types/tracking.types';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Search, Filter, X, FileText, Receipt, Wrench, Eye, Archive } from 'lucide-react';

export const DocumentArchiveTab: React.FC = () => {
  const { user } = useAuth();
  const [allDocuments, setAllDocuments] = useState<ArchivedDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<ArchiveFilter>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedArchive, setSelectedArchive] = useState<string | null>(null);

  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoading(true);
      try {
        const docs = await getAllDocumentsForArchive();
        setAllDocuments(docs);
      } catch (error) {
        console.error('Error loading documents:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDocuments();
  }, []);

  const [filteredDocs, setFilteredDocs] = useState<ArchivedDocument[]>([]);

  useEffect(() => {
    const applyFilters = async () => {
      if (isLoading) return;
      const filtered = await filterAllDocuments(filter);
      setFilteredDocs(filtered);
    };
    applyFilters();
  }, [filter, allDocuments, isLoading]);

  const handleFilterChange = (key: keyof ArchiveFilter, value: string | number | undefined) => {
    setFilter(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const clearFilters = () => {
    setFilter({});
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('nl-NL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'factuur':
        return <Receipt className="h-5 w-5 text-red-500" />;
      case 'werkorder':
        return <Wrench className="h-5 w-5 text-blue-500" />;
      case 'offerte':
        return <FileText className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-slate-500" />;
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      factuur: 'Factuur',
      werkorder: 'Werkorder',
      offerte: 'Offerte',
    };
    return labels[type] || type;
  };

  // Only show to admins
  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400">U heeft geen toegang tot deze pagina.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Document Archief</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Alle documenten (actief en gearchiveerd) ({filteredDocs.length} documenten)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Zoeken
              </label>
              <Input
                value={filter.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Zoek in archief..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Document Type
              </label>
              <select
                value={filter.documentType || ''}
                onChange={(e) => handleFilterChange('documentType', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="">Alle types</option>
                <option value="factuur">Factuur</option>
                <option value="werkorder">Werkorder</option>
                <option value="offerte">Offerte</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Algemeen Nummer
              </label>
              <Input
                value={filter.generalNumber || ''}
                onChange={(e) => handleFilterChange('generalNumber', e.target.value)}
                placeholder="2024-0001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Document Nummer
              </label>
              <Input
                value={filter.documentNumber || ''}
                onChange={(e) => handleFilterChange('documentNumber', e.target.value)}
                placeholder="F-2024-0001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Klant Naam
              </label>
              <Input
                value={filter.customerName || ''}
                onChange={(e) => handleFilterChange('customerName', e.target.value)}
                placeholder="Klant naam..."
              />
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Filters wissen
              </Button>
            </div>
          </div>
        </Card>
      )}

      {isLoading ? (
        <Card className="p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-slate-500 dark:text-slate-400 mt-4">Documenten laden...</p>
        </Card>
      ) : (
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300 font-semibold">Alg. Nr.</th>
                  <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300 font-semibold">Doc. Nr.</th>
                  <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300 font-semibold">Klant</th>
                  <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300 font-semibold">Aangemaakt</th>
                  <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300 font-semibold">Gearchiveerd</th>
                  <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300 font-semibold">Acties</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-500 dark:text-slate-400">
                      Geen documenten gevonden
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((archive) => {
                    const isArchived = !!archive.archivedAt;
                    return (
                      <tr
                        key={archive.id}
                        className={`border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 ${isArchived ? 'opacity-75' : ''}`}
                      >
                        <td className="py-3 px-4">
                          {isArchived ? (
                            <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
                              <Archive className="h-3 w-3" />
                              Gearchiveerd
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                              Actief
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {getDocumentTypeIcon(archive.documentType)}
                            <span className="text-slate-900 dark:text-white font-medium">
                              {getDocumentTypeLabel(archive.documentType)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono text-xs">
                          {archive.generalNumber}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono text-xs">
                          {archive.documentNumber}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                          {(archive.documentData.customerName as string) || '-'}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                          {formatDate(archive.createdAt)}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                          {isArchived ? formatDate(archive.archivedAt) : '-'}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedArchive(selectedArchive === archive.id ? null : archive.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {selectedArchive && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Document Details</h3>
          {(() => {
            const archive = filteredDocs.find(a => a.id === selectedArchive);
            if (!archive) return null;
            return (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Type:</span>
                    <span className="ml-2 text-slate-600 dark:text-slate-400">
                      {getDocumentTypeLabel(archive.documentType)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Algemeen Nummer:</span>
                    <span className="ml-2 text-slate-600 dark:text-slate-400 font-mono">{archive.generalNumber}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Document Nummer:</span>
                    <span className="ml-2 text-slate-600 dark:text-slate-400 font-mono">{archive.documentNumber}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Klant:</span>
                    <span className="ml-2 text-slate-600 dark:text-slate-400">
                      {(archive.documentData.customerName as string) || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Aangemaakt door:</span>
                    <span className="ml-2 text-slate-600 dark:text-slate-400">{archive.createdByName}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Gearchiveerd door:</span>
                    <span className="ml-2 text-slate-600 dark:text-slate-400">{archive.archivedByName}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Aangemaakt op:</span>
                    <span className="ml-2 text-slate-600 dark:text-slate-400">{formatDate(archive.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Gearchiveerd op:</span>
                    <span className="ml-2 text-slate-600 dark:text-slate-400">{formatDate(archive.archivedAt)}</span>
                  </div>
                </div>

                {archive.archiveReason && (
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Reden:</span>
                    <span className="ml-2 text-slate-600 dark:text-slate-400">{archive.archiveReason}</span>
                  </div>
                )}

                {archive.journey && archive.journey.length > 0 && (
                  <div>
                    <h4 className="text-md font-semibold text-slate-900 dark:text-white mb-2">Journey</h4>
                    <div className="space-y-2">
                      {archive.journey.map((entry, idx) => (
                        <div key={entry.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-slate-900 dark:text-white">{entry.action}</span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {formatDate(entry.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{entry.description}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                              Door: {entry.performedByName}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {archive.activities && archive.activities.length > 0 && (
                  <div>
                    <h4 className="text-md font-semibold text-slate-900 dark:text-white mb-2">Activiteiten</h4>
                    <div className="space-y-1">
                      {archive.activities.slice(0, 10).map((activity) => (
                        <div key={activity.id} className="text-sm text-slate-600 dark:text-slate-400">
                          {formatDate(activity.timestamp)} - {activity.description} ({activity.userName})
                        </div>
                      ))}
                      {archive.activities.length > 10 && (
                        <div className="text-sm text-slate-500 dark:text-slate-500">
                          ... en {archive.activities.length - 10} meer activiteiten
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </Card>
      )}
    </div>
  );
};

