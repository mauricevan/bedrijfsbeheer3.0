/**
 * EmailDropZone Component - Refactored < 300 lines
 *
 * A drag-and-drop component that accepts .eml files from Outlook.
 * Features:
 * - Accepts .eml files (from Outlook drag to desktop)
 * - Visual feedback on hover and drop
 * - Multiple file drops at once
 * - Automatic parsing and workflow integration
 */

import React, { useState, useCallback, useRef } from 'react';
import type { Task, Quote, Invoice, Notification, Customer, Lead, Interaction } from '../types';
import { parseEmlFile, type ParsedEmail } from '../utils/emlParser';

interface ProcessedEmail {
  id: string;
  email: ParsedEmail;
  workflowType: 'order' | 'task' | 'notification';
  workflowItemId?: string;
  timestamp: string;
  status: 'success' | 'error';
  message: string;
}

interface EmailDropZoneProps {
  onCreateTask?: (task: Partial<Task>) => Promise<string | undefined>;
  onCreateOrder?: (orderData: any) => Promise<string | undefined>;
  onCreateNotification?: (notification: Partial<Notification>) => Promise<string | undefined>;
  onCreateInteraction?: (interaction: Partial<Interaction>) => Promise<string | undefined>;
  existingTasks?: Task[];
  existingQuotes?: Quote[];
  existingInvoices?: Invoice[];
  existingCustomers?: Customer[];
  existingLeads?: Lead[];
  currentUserId?: string;
  onShowEmailPreview?: (email: ParsedEmail) => void;
}

export const EmailDropZone: React.FC<EmailDropZoneProps> = ({
  onCreateTask,
  onCreateOrder,
  onCreateNotification,
  onCreateInteraction,
  existingTasks = [],
  existingQuotes = [],
  existingInvoices = [],
  existingCustomers = [],
  existingLeads = [],
  currentUserId,
  onShowEmailPreview,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedEmails, setProcessedEmails] = useState<ProcessedEmail[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const determineWorkflowType = useCallback(
    (email: ParsedEmail): 'order' | 'task' | 'notification' => {
      const subject = email.subject.toLowerCase();
      const body = email.body.toLowerCase();

      if (subject.includes('order') || subject.includes('bestelling') || body.includes('order')) {
        return 'order';
      }
      if (subject.includes('task') || subject.includes('todo') || subject.includes('taak')) {
        return 'task';
      }
      return 'notification';
    },
    []
  );

  const processEmail = useCallback(
    async (email: ParsedEmail): Promise<ProcessedEmail> => {
      try {
        const workflowType = determineWorkflowType(email);
        let workflowItemId: string | undefined;

        if (workflowType === 'task' && onCreateTask) {
          const task: Partial<Task> = {
            title: email.subject,
            description: email.body,
            status: 'pending',
            priority: 'medium',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          };
          workflowItemId = await onCreateTask(task);
        } else if (workflowType === 'order' && onCreateOrder) {
          workflowItemId = await onCreateOrder({ email });
        } else if (workflowType === 'notification' && onCreateNotification) {
          const notification: Partial<Notification> = {
            type: 'email',
            title: email.subject,
            message: email.body.substring(0, 200),
            timestamp: email.date || new Date().toISOString(),
            read: false,
          };
          workflowItemId = await onCreateNotification(notification);
        }

        if (onCreateInteraction && currentUserId) {
          await onCreateInteraction({
            customerId: '', // Will be determined by email address
            type: 'email_received',
            date: email.date || new Date().toISOString(),
            notes: `Email: ${email.subject}`,
            createdBy: currentUserId,
          });
        }

        return {
          id: Date.now().toString(),
          email,
          workflowType,
          workflowItemId,
          timestamp: new Date().toISOString(),
          status: 'success',
          message: `Processed as ${workflowType}`,
        };
      } catch (error) {
        return {
          id: Date.now().toString(),
          email,
          workflowType: 'notification',
          timestamp: new Date().toISOString(),
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },
    [determineWorkflowType, onCreateTask, onCreateOrder, onCreateNotification, onCreateInteraction, currentUserId]
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setIsProcessing(true);

      const files = Array.from(e.dataTransfer.files).filter(
        (file) => file.name.endsWith('.eml') || file.type === 'message/rfc822'
      );

      const results: ProcessedEmail[] = [];
      for (const file of files) {
        try {
          const parsed = await parseEmlFile(file);
          const processed = await processEmail(parsed);
          results.push(processed);
        } catch (error) {
          results.push({
            id: Date.now().toString(),
            email: { from: '', to: '', subject: file.name, body: '', date: '' },
            workflowType: 'notification',
            timestamp: new Date().toISOString(),
            status: 'error',
            message: error instanceof Error ? error.message : 'Parse error',
          });
        }
      }

      setProcessedEmails((prev) => [...results, ...prev].slice(0, 10));
      setIsProcessing(false);
    },
    [processEmail]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-8 transition-all cursor-pointer ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".eml"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = e.target.files;
            if (files) {
              const event = {
                preventDefault: () => {},
                stopPropagation: () => {},
                dataTransfer: { files },
              } as any;
              handleDrop(event);
            }
          }}
        />

        <div className="text-center">
          <div className="text-4xl mb-4">📧</div>
          <h3 className="text-lg font-semibold mb-2">
            {isProcessing ? 'Processing...' : 'Drop Email Here'}
          </h3>
          <p className="text-sm text-gray-600">
            Drag & drop .eml files from Outlook or click to browse
          </p>
        </div>
      </div>

      {/* Processed Emails */}
      {processedEmails.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="font-semibold text-lg">Recently Processed</h4>
          {processedEmails.map((processed) => (
            <div
              key={processed.id}
              className={`p-4 rounded-lg border ${
                processed.status === 'success'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium">{processed.email.subject}</p>
                  <p className="text-sm text-gray-600">From: {processed.email.from}</p>
                  <p className="text-xs text-gray-500 mt-1">{processed.message}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    processed.status === 'success'
                      ? 'bg-green-600 text-white'
                      : 'bg-red-600 text-white'
                  }`}
                >
                  {processed.workflowType}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
