// components/EmailPreviewModal.tsx - Refactored < 300 lines
import React from 'react';

interface ParsedEmail {
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  cc?: string;
  attachments?: Array<{ name: string; size: number }>;
}

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: ParsedEmail | null;
  onCreateWorkOrder?: () => void;
  onCreateQuote?: () => void;
  onCreateTask?: () => void;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({
  isOpen,
  onClose,
  email,
  onCreateWorkOrder,
  onCreateQuote,
  onCreateTask,
}) => {
  if (!isOpen || !email) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Email Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Email Content */}
        <div className="p-6 space-y-4">
          {/* Email Headers */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="grid grid-cols-4 gap-2 text-sm">
              <span className="font-semibold">Van:</span>
              <span className="col-span-3">{email.from}</span>

              <span className="font-semibold">Aan:</span>
              <span className="col-span-3">{email.to}</span>

              {email.cc && (
                <>
                  <span className="font-semibold">CC:</span>
                  <span className="col-span-3">{email.cc}</span>
                </>
              )}

              <span className="font-semibold">Datum:</span>
              <span className="col-span-3">{email.date}</span>

              <span className="font-semibold">Onderwerp:</span>
              <span className="col-span-3 font-medium">{email.subject}</span>
            </div>
          </div>

          {/* Email Body */}
          <div className="bg-white border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Inhoud:</h3>
            <div className="whitespace-pre-wrap text-sm">{email.body}</div>
          </div>

          {/* Attachments */}
          {email.attachments && email.attachments.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Bijlagen ({email.attachments.length}):</h3>
              <ul className="space-y-1">
                {email.attachments.map((att, idx) => (
                  <li key={idx} className="text-sm flex items-center gap-2">
                    <span className="text-blue-600">📎</span>
                    <span>{att.name}</span>
                    <span className="text-gray-500">({(att.size / 1024).toFixed(1)} KB)</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t p-6">
          <div className="flex flex-wrap gap-3">
            {onCreateWorkOrder && (
              <button
                onClick={() => {
                  onCreateWorkOrder();
                  onClose();
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                🔧 Werkorder Aanmaken
              </button>
            )}
            {onCreateQuote && (
              <button
                onClick={() => {
                  onCreateQuote();
                  onClose();
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                📄 Offerte Aanmaken
              </button>
            )}
            {onCreateTask && (
              <button
                onClick={() => {
                  onCreateTask();
                  onClose();
                }}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
              >
                ✓ Taak Aanmaken
              </button>
            )}
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold"
            >
              Sluiten
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
