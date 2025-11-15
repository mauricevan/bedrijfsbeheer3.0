// components/QuoteEmailIntegration.tsx - Refactored < 300 lines
import React, { useState } from 'react';
import type { Quote, Customer, InventoryItem } from '../types';
import { parseEmailForQuote } from '../utils/emailQuoteParser';
import { parseEmlFile } from '../utils/emlParser';

interface QuoteEmailIntegrationProps {
  quotes: Quote[];
  setQuotes: React.Dispatch<React.SetStateAction<Quote[]>>;
  customers: Customer[];
  inventory: InventoryItem[];
}

export const QuoteEmailIntegration: React.FC<QuoteEmailIntegrationProps> = ({
  quotes,
  setQuotes,
  customers,
  inventory,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [processedCount, setProcessedCount] = useState(0);

  const handleFilesDrop = async (files: FileList) => {
    setIsProcessing(true);
    setProcessedCount(0);
    setStatusMessage('Processing emails...');

    const emlFiles = Array.from(files).filter(
      file => file.name.endsWith('.eml') || file.type === 'message/rfc822'
    );

    if (emlFiles.length === 0) {
      setStatusMessage('No .eml files found');
      setIsProcessing(false);
      return;
    }

    let successCount = 0;
    for (const file of emlFiles) {
      try {
        const parsed = await parseEmlFile(file);
        const quoteData = parseEmailForQuote(parsed.body, parsed.subject);

        if (quoteData) {
          const newQuote: Quote = {
            ...quoteData,
            id: `QT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            quoteNumber: `OFF-${(quotes.length + 1).toString().padStart(5, '0')}`,
            status: 'draft',
            issueDate: new Date().toISOString().split('T')[0],
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          };

          setQuotes(prev => [...prev, newQuote]);
          successCount++;
        }
      } catch (error) {
        console.error('Failed to process email:', error);
      }
    }

    setProcessedCount(successCount);
    setStatusMessage(`Successfully processed ${successCount} of ${emlFiles.length} emails`);
    setIsProcessing(false);

    // Clear message after 5 seconds
    setTimeout(() => {
      setStatusMessage('');
      setProcessedCount(0);
    }, 5000);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFilesDrop(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFilesDrop(e.target.files);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Email naar Offerte</h3>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
      >
        <input
          type="file"
          accept=".eml"
          multiple
          onChange={handleFileInput}
          className="hidden"
          id="email-file-input"
        />
        <label htmlFor="email-file-input" className="cursor-pointer">
          <div className="text-4xl mb-2">📧</div>
          <p className="font-medium">Sleep .eml bestanden hierheen</p>
          <p className="text-sm text-gray-500">of klik om te bladeren</p>
        </label>
      </div>

      {/* Status */}
      {statusMessage && (
        <div className={`mt-4 p-3 rounded-lg ${processedCount > 0 ? 'bg-green-50 text-green-800' : 'bg-blue-50 text-blue-800'}`}>
          <p className="text-sm font-medium">{statusMessage}</p>
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="mt-4 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm text-gray-600">Verwerken...</span>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 text-xs text-gray-500">
        <p className="font-semibold mb-1">Hoe werkt het:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Sleep een .eml bestand van Outlook naar deze zone</li>
          <li>Het systeem leest automatisch klant, items en prijzen</li>
          <li>Een concept-offerte wordt aangemaakt</li>
          <li>Controleer en bewerk de offerte voordat je deze verstuurt</li>
        </ol>
      </div>
    </div>
  );
};
