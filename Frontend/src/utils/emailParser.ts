/**
 * Email Parser Utility
 * Parses .eml files (RFC 822 format) and extracts email content
 */

export interface ParsedEmail {
  from: string;
  to: string[];
  subject: string;
  body: string;
  date: string;
  attachments?: Array<{
    filename: string;
    contentType: string;
    content: string;
  }>;
}

/**
 * Parse .eml file content
 */
export const parseEmlFile = async (file: File): Promise<ParsedEmail> => {
  const text = await file.text();
  
  // Split headers and body
  const parts = text.split(/\r?\n\r?\n/);
  const headers = parts[0];
  const body = parts.slice(1).join('\n\n');

  // Parse headers
  const headerLines = headers.split(/\r?\n/);
  const headerMap: Record<string, string> = {};
  
  let currentHeader = '';
  for (const line of headerLines) {
    if (/^\s/.test(line)) {
      // Continuation of previous header
      headerMap[currentHeader] += ' ' + line.trim();
    } else {
      const match = line.match(/^([^:]+):\s*(.+)$/);
      if (match) {
        currentHeader = match[1].toLowerCase();
        headerMap[currentHeader] = match[2].trim();
      }
    }
  }

  // Extract from
  const from = decodeHeader(headerMap['from'] || '');

  // Extract to (can be comma-separated)
  const toHeader = headerMap['to'] || '';
  const to = toHeader.split(',').map(email => decodeHeader(email.trim()));

  // Extract subject
  const subject = decodeHeader(headerMap['subject'] || 'Geen onderwerp');

  // Extract date
  const date = headerMap['date'] || new Date().toISOString();

  // Parse body (handle quoted-printable, base64, etc.)
  let emailBody = body;
  const contentType = headerMap['content-type'] || '';
  
  // Check for multipart messages
  if (contentType.includes('multipart')) {
    // Extract text/plain or text/html part
    const boundary = contentType.match(/boundary="?([^";\s]+)"?/)?.[1];
    if (boundary) {
      const parts = body.split(`--${boundary}`);
      for (const part of parts) {
        if (part.includes('Content-Type: text/plain') || part.includes('Content-Type: text/html')) {
          const partBody = part.split(/\r?\n\r?\n/).slice(1).join('\n\n');
          emailBody = decodeBody(partBody, part.match(/Content-Transfer-Encoding:\s*([^\r\n]+)/i)?.[1] || '');
          break;
        }
      }
    }
  } else {
    // Single part message
    const encoding = headerMap['content-transfer-encoding'] || '';
    emailBody = decodeBody(body, encoding);
  }

  return {
    from,
    to,
    subject,
    body: emailBody.trim(),
    date,
  };
};

/**
 * Decode email header (handles encoded words)
 */
const decodeHeader = (header: string): string => {
  if (!header) return '';
  
  // Handle encoded words like =?UTF-8?Q?Hello?=
  return header.replace(/=\?([^?]+)\?([BQ])\?([^?]+)\?=/gi, (_match, _charset, encoding, text) => {
    if (encoding === 'Q' || encoding === 'q') {
      // Quoted-printable
      return text.replace(/=([0-9A-F]{2})/gi, (_match: string, hex: string) => {
        return String.fromCharCode(parseInt(hex, 16));
      }).replace(/_/g, ' ');
    } else if (encoding === 'B' || encoding === 'b') {
      // Base64
      try {
        return atob(text);
      } catch {
        return text;
      }
    }
    return text;
  });
};

/**
 * Decode email body based on encoding
 */
const decodeBody = (body: string, encoding: string): string => {
  if (!body) return '';
  
  const enc = encoding.toLowerCase();
  
  if (enc.includes('quoted-printable')) {
    return body.replace(/=([0-9A-F]{2})/gi, (_, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    }).replace(/=\r?\n/g, ''); // Remove soft line breaks
  } else if (enc.includes('base64')) {
    try {
      return atob(body.replace(/\s/g, ''));
    } catch {
      return body;
    }
  }
  
  return body;
};

/**
 * Detect workflow type from email content
 */
export const detectWorkflowType = (email: ParsedEmail): 'order' | 'task' | 'notification' => {
  const subjectLower = email.subject.toLowerCase();
  const bodyLower = email.body.toLowerCase();
  const combined = `${subjectLower} ${bodyLower}`;

  // Order keywords
  const orderKeywords = ['order', 'bestel', 'offerte', 'quote', 'factuur', 'invoice', 'bestelling'];
  if (orderKeywords.some(keyword => combined.includes(keyword))) {
    return 'order';
  }

  // Task keywords
  const taskKeywords = ['vraag', 'question', 'help', 'follow-up', 'reminder', 'actie', 'action', 'taak', 'task'];
  if (taskKeywords.some(keyword => combined.includes(keyword))) {
    return 'task';
  }

  return 'notification';
};

