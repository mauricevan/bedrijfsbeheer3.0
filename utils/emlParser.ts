
export interface ParsedEmail {
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  htmlBody?: string;
  date?: string;
  attachments?: Array<{
    filename: string;
    contentType: string;
    size: number;
  }>;
}

export function parseEmlFile(content: string): ParsedEmail {
  const parts = content.split(/\r?\n\r?\n/);
  const headers = parts[0];
  const bodyStartIndex = content.indexOf('\n\n') !== -1 
    ? content.indexOf('\n\n') + 2 
    : content.indexOf('\r\n\r\n') !== -1 
    ? content.indexOf('\r\n\r\n') + 4 
    : headers.length;

  const headerLines = headers.split(/\r?\n/);
  const headerMap: Record<string, string> = {};
  
  let currentHeader = '';
  let currentValue = '';
  
  for (const line of headerLines) {
    if (/^\s/.test(line)) {
      currentValue += ' ' + line.trim();
    } else {
      if (currentHeader) {
        headerMap[currentHeader.toLowerCase()] = currentValue.trim();
      }
      const colonIndex = line.indexOf(':');
      if (colonIndex !== -1) {
        currentHeader = line.substring(0, colonIndex).trim().toLowerCase();
        currentValue = line.substring(colonIndex + 1).trim();
      }
    }
  }
  if (currentHeader) {
    headerMap[currentHeader.toLowerCase()] = currentValue.trim();
  }

  function extractEmailAddresses(value: string): string[] {
    if (!value) return [];
    const emailRegex = /<?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})>?/g;
    const matches = value.matchAll(emailRegex);
    return Array.from(matches, m => m[1]);
  }

  const from = extractEmailAddresses(headerMap['from'] || '')[0] || headerMap['from'] || '';

  const to = extractEmailAddresses(headerMap['to'] || '');

  const cc = headerMap['cc'] ? extractEmailAddresses(headerMap['cc']) : undefined;

  const bcc = headerMap['bcc'] ? extractEmailAddresses(headerMap['bcc']) : undefined;

  const subject = decodeHeader(headerMap['subject'] || '');

  const date = headerMap['date'] || undefined;

  const bodyContent = content.substring(bodyStartIndex).trim();
  
  const contentType = headerMap['content-type'] || '';
  let body = '';
  let htmlBody: string | undefined = undefined;

  if (contentType.includes('multipart/alternative') || contentType.includes('multipart/mixed')) {
    const boundaryMatch = contentType.match(/boundary="?([^";\s]+)"?/);
    if (boundaryMatch) {
      const boundary = boundaryMatch[1];
      const parts = bodyContent.split(`--${boundary}`);
      
      for (const part of parts) {
        if (part.trim() === '' || part.trim() === '--') continue;
        
        const partHeadersEnd = part.indexOf('\n\n') !== -1 
          ? part.indexOf('\n\n') 
          : part.indexOf('\r\n\r\n') !== -1 
          ? part.indexOf('\r\n\r\n') 
          : 0;
        
        const partHeaders = part.substring(0, partHeadersEnd);
        const partBody = part.substring(partHeadersEnd).trim();
        
        const partContentType = partHeaders.match(/content-type:\s*([^\r\n]+)/i)?.[1] || '';
        
        if (partContentType.includes('text/plain') && !body) {
          body = decodeBody(partBody, partContentType);
        } else if (partContentType.includes('text/html') && !htmlBody) {
          htmlBody = decodeBody(partBody, partContentType);
        }
      }
    }
  } else {
    if (contentType.includes('text/html')) {
      htmlBody = decodeBody(bodyContent, contentType);
      body = stripHtml(htmlBody);
    } else {
      body = decodeBody(bodyContent, contentType);
    }
  }

  if (!body && htmlBody) {
    body = stripHtml(htmlBody);
  }

  body = body.replace(/--[a-zA-Z0-9_-]+--?\s*$/gm, '').trim();

  return {
    from,
    to,
    cc,
    bcc,
    subject,
    body,
    htmlBody,
    date,
  };
}

function decodeHeader(header: string): string {
  const encodedWordRegex = /=\?([^?]+)\?([BQ])\?([^?]+)\?=/gi;
  
  return header.replace(encodedWordRegex, (match, charset, encoding, text) => {
    try {
      if (encoding.toUpperCase() === 'B') {
        return atob(text);
      } else if (encoding.toUpperCase() === 'Q') {
        return text.replace(/=([0-9A-F]{2})/gi, (_, hex) => {
          return String.fromCharCode(parseInt(hex, 16));
        }).replace(/_/g, ' ');
      }
    } catch (e) {
      console.warn('Failed to decode header:', match);
    }
    return match;
  });
}

function decodeBody(body: string, contentType: string): string {
  let decoded = body;

  const transferEncodingMatch = contentType.match(/charset=([^;\s]+)/i);
  const charset = transferEncodingMatch ? transferEncodingMatch[1] : 'utf-8';

  if (contentType.includes('quoted-printable')) {
    decoded = decoded.replace(/=\r?\n/g, ''); // Remove soft line breaks
    decoded = decoded.replace(/=([0-9A-F]{2})/gi, (_, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    });
  }

  if (contentType.includes('base64')) {
    try {
      decoded = atob(decoded.replace(/\s/g, ''));
    } catch (e) {
      console.warn('Failed to decode base64 body');
    }
  }

  return decoded.trim();
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove scripts
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove styles
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

