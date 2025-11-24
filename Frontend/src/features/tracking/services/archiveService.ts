import { storage, STORAGE_KEYS } from '@/utils/storage';
import type { ArchivedDocument, ArchiveFilter } from '../types/tracking.types';
import { getEntityActivities } from './activityService';

const ARCHIVED_DOCUMENTS_KEY = 'archived_documents';
const QUOTES_KEY = 'bedrijfsbeheer_quotes';
const INVOICES_KEY = 'bedrijfsbeheer_invoices';
const WORK_ORDERS_KEY = STORAGE_KEYS.WORK_ORDERS;

/**
 * Get all archived documents
 */
export const getArchivedDocuments = (): ArchivedDocument[] => {
  return storage.get<ArchivedDocument[]>(ARCHIVED_DOCUMENTS_KEY, []);
};

/**
 * Get all documents (both active and archived) for the archive view
 */
export const getAllDocumentsForArchive = async (): Promise<ArchivedDocument[]> => {
  const archivedDocs = getArchivedDocuments();
  const allDocs: ArchivedDocument[] = [...archivedDocs];

  // Get active quotes
  const quotes = storage.get<any[]>(QUOTES_KEY, []);
  for (const quote of quotes) {
    if (!quote || !quote.id) continue; // Skip invalid entries
    const activities = getEntityActivities('offerte', quote.id);
    allDocs.push({
      id: quote.id,
      documentType: 'offerte',
      generalNumber: quote.generalNumber || `TEMP-${quote.id}`,
      documentNumber: quote.quoteNumber || `O-TEMP-${quote.id}`,
      documentData: quote,
      archivedAt: '', // Not archived
      archivedBy: '',
      archivedByName: '',
      archiveReason: undefined,
      createdAt: quote.createdAt || new Date().toISOString(),
      createdBy: quote.createdBy || '',
      createdByName: quote.createdByName || '',
      journey: quote.journey || [],
      activities: activities,
    });
  }

  // Get active invoices
  const invoices = storage.get<any[]>(INVOICES_KEY, []);
  for (const invoice of invoices) {
    if (!invoice || !invoice.id) continue; // Skip invalid entries
    const activities = getEntityActivities('factuur', invoice.id);
    allDocs.push({
      id: invoice.id,
      documentType: 'factuur',
      generalNumber: invoice.generalNumber || `TEMP-${invoice.id}`,
      documentNumber: invoice.invoiceNumber || `F-TEMP-${invoice.id}`,
      documentData: invoice,
      archivedAt: '', // Not archived
      archivedBy: '',
      archivedByName: '',
      archiveReason: undefined,
      createdAt: invoice.createdAt || new Date().toISOString(),
      createdBy: invoice.createdBy || '',
      createdByName: invoice.createdByName || '',
      journey: invoice.journey || [],
      activities: activities,
    });
  }

  // Get active work orders
  const workOrders = storage.get<any[]>(WORK_ORDERS_KEY, []);
  for (const workOrder of workOrders) {
    if (!workOrder || !workOrder.id) continue; // Skip invalid entries
    const activities = getEntityActivities('werkorder', workOrder.id);
    allDocs.push({
      id: workOrder.id,
      documentType: 'werkorder',
      generalNumber: workOrder.generalNumber || `TEMP-${workOrder.id}`,
      documentNumber: workOrder.workOrderNumber || `W-TEMP-${workOrder.id}`,
      documentData: workOrder,
      archivedAt: '', // Not archived
      archivedBy: '',
      archivedByName: '',
      archiveReason: undefined,
      createdAt: workOrder.createdAt || new Date().toISOString(),
      createdBy: workOrder.createdBy || '',
      createdByName: workOrder.createdByName || '',
      journey: workOrder.journey || [],
      activities: activities,
    });
  }

  // Sort by creation date descending (newest first)
  return allDocs.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

/**
 * Archive a document
 */
export const archiveDocument = (
  documentType: 'factuur' | 'werkorder' | 'offerte',
  documentData: Record<string, unknown>,
  generalNumber: string,
  documentNumber: string,
  journey: any[],
  activities: any[],
  archivedBy: string,
  archivedByName: string,
  archiveReason?: string
): ArchivedDocument => {
  const archived: ArchivedDocument = {
    id: documentData.id as string,
    documentType,
    generalNumber,
    documentNumber,
    documentData,
    archivedAt: new Date().toISOString(),
    archivedBy,
    archivedByName,
    archiveReason,
    createdAt: (documentData.createdAt as string) || new Date().toISOString(),
    createdBy: (documentData.createdBy as string) || '',
    createdByName: (documentData.createdByName as string) || '',
    journey: journey || [],
    activities: activities || [],
  };
  
  const archives = getArchivedDocuments();
  archives.push(archived);
  storage.set(ARCHIVED_DOCUMENTS_KEY, archives);
  
  return archived;
};

/**
 * Filter archived documents (only archived ones)
 */
export const filterArchivedDocuments = (filter: ArchiveFilter): ArchivedDocument[] => {
  let archives = getArchivedDocuments();
  
  return applyArchiveFilters(archives, filter);
};

/**
 * Filter all documents (active + archived)
 */
export const filterAllDocuments = async (filter: ArchiveFilter): Promise<ArchivedDocument[]> => {
  const allDocs = await getAllDocumentsForArchive();
  return applyArchiveFilters(allDocs, filter);
};

/**
 * Apply filters to documents
 */
const applyArchiveFilters = (documents: ArchivedDocument[], filter: ArchiveFilter): ArchivedDocument[] => {
  let filtered = documents;
  
  if (filter.documentType) {
    filtered = filtered.filter(arch => arch.documentType === filter.documentType);
  }
  
  if (filter.customerId) {
    filtered = filtered.filter(arch => 
      (arch.documentData.customerId as string) === filter.customerId
    );
  }
  
  if (filter.customerName) {
    filtered = filtered.filter(arch => {
      const customerName = (arch.documentData.customerName as string) || '';
      return customerName.toLowerCase().includes(filter.customerName!.toLowerCase());
    });
  }
  
  if (filter.generalNumber) {
    filtered = filtered.filter(arch => arch.generalNumber === filter.generalNumber);
  }
  
  if (filter.documentNumber) {
    filtered = filtered.filter(arch => arch.documentNumber === filter.documentNumber);
  }
  
  if (filter.createdBy) {
    filtered = filtered.filter(arch => arch.createdBy === filter.createdBy);
  }
  
  if (filter.archivedBy) {
    filtered = filtered.filter(arch => arch.archivedBy === filter.archivedBy);
  }
  
  if (filter.dateFrom) {
    filtered = filtered.filter(arch => arch.createdAt >= filter.dateFrom!);
  }
  
  if (filter.dateTo) {
    filtered = filtered.filter(arch => arch.createdAt <= filter.dateTo!);
  }
  
  if (filter.archivedDateFrom) {
    filtered = filtered.filter(arch => arch.archivedAt && arch.archivedAt >= filter.archivedDateFrom!);
  }
  
  if (filter.archivedDateTo) {
    filtered = filtered.filter(arch => arch.archivedAt && arch.archivedAt <= filter.archivedDateTo!);
  }
  
  if (filter.status) {
    filtered = filtered.filter(arch => 
      (arch.documentData.status as string) === filter.status
    );
  }
  
  if (filter.amountMin !== undefined) {
    filtered = filtered.filter(arch => {
      const total = (arch.documentData.total as number) || 0;
      return total >= filter.amountMin!;
    });
  }
  
  if (filter.amountMax !== undefined) {
    filtered = filtered.filter(arch => {
      const total = (arch.documentData.total as number) || 0;
      return total <= filter.amountMax!;
    });
  }
  
  if (filter.search) {
    const searchLower = filter.search.toLowerCase();
    filtered = filtered.filter(arch =>
      arch.generalNumber.toLowerCase().includes(searchLower) ||
      arch.documentNumber.toLowerCase().includes(searchLower) ||
      (arch.documentData.customerName as string)?.toLowerCase().includes(searchLower) ||
      arch.createdByName.toLowerCase().includes(searchLower)
    );
  }
  
  // Sort by creation date descending (newest first), archived documents at the end
  return filtered.sort((a, b) => {
    // Archived documents come after active ones
    if (a.archivedAt && !b.archivedAt) return 1;
    if (!a.archivedAt && b.archivedAt) return -1;
    // Both archived or both active - sort by creation date
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

/**
 * Get archived document by ID
 */
export const getArchivedDocumentById = (id: string): ArchivedDocument | null => {
  const archives = getArchivedDocuments();
  return archives.find(arch => arch.id === id) || null;
};

/**
 * Restore archived document (returns document data)
 */
export const restoreArchivedDocument = (id: string): Record<string, unknown> | null => {
  const archived = getArchivedDocumentById(id);
  if (!archived) return null;
  
  // Return the document data for restoration
  return archived.documentData;
};

