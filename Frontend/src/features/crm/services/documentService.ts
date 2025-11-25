import type {
  CRMDocument,
  CreateCRMDocumentInput,
  UpdateCRMDocumentInput,
} from '../types/crm.types';
import { storage } from '@/utils/storage';

const DOCUMENTS_KEY = 'bedrijfsbeheer_crm_documents';
const DOCUMENT_FILES_KEY = 'bedrijfsbeheer_crm_document_files'; // Base64 encoded files

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper functions
function getAllDocuments(): CRMDocument[] {
  return storage.get<CRMDocument[]>(DOCUMENTS_KEY, []);
}

function saveDocuments(documents: CRMDocument[]): void {
  storage.set(DOCUMENTS_KEY, documents);
}

function getDocumentFiles(): Record<string, string> {
  return storage.get<Record<string, string>>(DOCUMENT_FILES_KEY, {});
}

function saveDocumentFiles(files: Record<string, string>): void {
  storage.set(DOCUMENT_FILES_KEY, files);
}

// Convert file to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Create data URL from base64
function base64ToDataUrl(base64: string, mimeType: string): string {
  return `data:${mimeType};base64,${base64}`;
}

// Get file extension from filename
function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

// Get MIME type from file extension
function getMimeType(filename: string): string {
  const ext = getFileExtension(filename);
  const mimeTypes: Record<string, string> = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'txt': 'text/plain',
    'csv': 'text/csv',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

export const documentService = {
  // Get all documents
  async getDocuments(filters?: {
    customerId?: string;
    leadId?: string;
    category?: CRMDocument['category'];
  }): Promise<CRMDocument[]> {
    await delay(300);
    let documents = getAllDocuments();
    
    if (filters?.customerId) {
      documents = documents.filter(d => d.customerId === filters.customerId);
    }
    
    if (filters?.leadId) {
      documents = documents.filter(d => d.leadId === filters.leadId);
    }
    
    if (filters?.category) {
      documents = documents.filter(d => d.category === filters.category);
    }
    
    return documents.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  },

  // Get document by ID
  async getDocument(id: string): Promise<CRMDocument | undefined> {
    await delay(200);
    const documents = getAllDocuments();
    return documents.find(d => d.id === id);
  },

  // Upload document
  async uploadDocument(
    file: File,
    input: Omit<CreateCRMDocumentInput, 'fileName' | 'fileType' | 'fileSize' | 'url'>
  ): Promise<CRMDocument> {
    await delay(1000); // Simulate upload time
    
    // Convert file to base64
    const base64 = await fileToBase64(file);
    const mimeType = getMimeType(file.name);
    
    // Create document record
    const now = new Date().toISOString();
    const document: CRMDocument = {
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...input,
      fileName: file.name,
      fileType: mimeType,
      fileSize: file.size,
      url: `data:${mimeType};base64,${base64}`, // Store as data URL for now
      version: 1,
      downloadCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    
    // Save document record
    const documents = getAllDocuments();
    documents.push(document);
    saveDocuments(documents);
    
    // Save file data separately (for better performance)
    const files = getDocumentFiles();
    files[document.id] = base64;
    saveDocumentFiles(files);
    
    return document;
  },

  // Update document metadata
  async updateDocument(id: string, updates: UpdateCRMDocumentInput): Promise<CRMDocument> {
    await delay(500);
    const documents = getAllDocuments();
    const index = documents.findIndex(d => d.id === id);
    
    if (index === -1) {
      throw new Error('Document not found');
    }
    
    const updated: CRMDocument = {
      ...documents[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    documents[index] = updated;
    saveDocuments(documents);
    
    return updated;
  },

  // Delete document
  async deleteDocument(id: string): Promise<void> {
    await delay(300);
    const documents = getAllDocuments();
    const filtered = documents.filter(d => d.id !== id);
    saveDocuments(filtered);
    
    // Remove file data
    const files = getDocumentFiles();
    delete files[id];
    saveDocumentFiles(files);
  },

  // Download document (returns data URL)
  async downloadDocument(id: string): Promise<string> {
    await delay(300);
    const document = await this.getDocument(id);
    
    if (!document) {
      throw new Error('Document not found');
    }
    
    // Increment download count
    await this.updateDocument(id, {
      downloadCount: document.downloadCount + 1,
      lastDownloaded: new Date().toISOString(),
    });
    
    // Return data URL
    return document.url;
  },

  // Get document preview URL
  async getPreviewUrl(id: string): Promise<string> {
    await delay(200);
    const document = await this.getDocument(id);
    
    if (!document) {
      throw new Error('Document not found');
    }
    
    return document.url;
  },

  // Share document with employees
  async shareDocument(id: string, employeeIds: string[]): Promise<CRMDocument> {
    await delay(500);
    const document = await this.getDocument(id);
    
    if (!document) {
      throw new Error('Document not found');
    }
    
    // Merge with existing sharedWith
    const existingShared = document.sharedWith || [];
    const newShared = [...new Set([...existingShared, ...employeeIds])];
    
    return await this.updateDocument(id, {
      sharedWith: newShared,
    });
  },

  // Unshare document
  async unshareDocument(id: string, employeeId: string): Promise<CRMDocument> {
    await delay(500);
    const document = await this.getDocument(id);
    
    if (!document) {
      throw new Error('Document not found');
    }
    
    const sharedWith = (document.sharedWith || []).filter(id => id !== employeeId);
    
    return await this.updateDocument(id, {
      sharedWith,
    });
  },

  // Upload new version of document
  async uploadNewVersion(
    documentId: string,
    file: File
  ): Promise<CRMDocument> {
    await delay(1000);
    const existingDocument = await this.getDocument(documentId);
    
    if (!existingDocument) {
      throw new Error('Document not found');
    }
    
    // Convert file to base64
    const base64 = await fileToBase64(file);
    const mimeType = getMimeType(file.name);
    
    // Update document with new version
    const updated: CRMDocument = {
      ...existingDocument,
      fileName: file.name,
      fileType: mimeType,
      fileSize: file.size,
      url: `data:${mimeType};base64,${base64}`,
      version: existingDocument.version + 1,
      updatedAt: new Date().toISOString(),
    };
    
    const documents = getAllDocuments();
    const index = documents.findIndex(d => d.id === documentId);
    documents[index] = updated;
    saveDocuments(documents);
    
    // Update file data
    const files = getDocumentFiles();
    files[documentId] = base64;
    saveDocumentFiles(files);
    
    return updated;
  },

  // Search documents
  async searchDocuments(query: string): Promise<CRMDocument[]> {
    await delay(300);
    const documents = getAllDocuments();
    const lowerQuery = query.toLowerCase();
    
    return documents.filter(doc => {
      return doc.name.toLowerCase().includes(lowerQuery) ||
             doc.fileName.toLowerCase().includes(lowerQuery) ||
             doc.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
    });
  },

  // Get document statistics
  async getDocumentStats(customerId?: string, leadId?: string): Promise<{
    totalDocuments: number;
    totalSize: number;
    byCategory: Record<string, number>;
    recentUploads: number; // Last 30 days
  }> {
    await delay(300);
    let documents = getAllDocuments();
    
    if (customerId) {
      documents = documents.filter(d => d.customerId === customerId);
    }
    
    if (leadId) {
      documents = documents.filter(d => d.leadId === leadId);
    }
    
    const totalSize = documents.reduce((sum, doc) => sum + doc.fileSize, 0);
    
    const byCategory: Record<string, number> = {};
    documents.forEach(doc => {
      byCategory[doc.category] = (byCategory[doc.category] || 0) + 1;
    });
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUploads = documents.filter(doc => {
      return new Date(doc.createdAt) >= thirtyDaysAgo;
    }).length;
    
    return {
      totalDocuments: documents.length,
      totalSize,
      byCategory,
      recentUploads,
    };
  },
};

