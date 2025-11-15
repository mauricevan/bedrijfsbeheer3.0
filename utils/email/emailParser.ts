
import { Quote, QuoteItem, QuoteLabor, Customer, Email } from '../../types';

export interface ParsedEmailData {
  customer: Partial<Customer>;
  items: QuoteItem[];
  labor: QuoteLabor[];
  notes: string;
  estimatedValue?: number;
}

export function parseEmailForCustomer(from: string, subject: string, body: string): Partial<Customer> {
  const nameMatch = from.match(/^([^<@]+)/);
  const name = nameMatch ? nameMatch[1].trim() : from.split('@')[0];
  
  const emailMatch = from.match(/<(.+?)>/) || from.match(/([^\s]+@[^\s]+)/);
  const email = emailMatch ? emailMatch[1] : from;
  
  const phoneRegex = /(\+31|0)[- ]?(\d{1,3})[- ]?(\d{6,7})/g;
  const phoneMatch = subject.match(phoneRegex) || body.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[0].replace(/[- ]/g, '') : '';
  
  const hasCompanyIndicators = /B\.?V\.?|N\.?V\.?|VOF|Eenmanszaak|bedrijf|company/i.test(body);
  const type = hasCompanyIndicators ? 'business' : 'private';
  
  const companyMatch = body.match(/(?:bedrijf|company)[:;]?\s*([^\n]+)/i);
  const company = companyMatch ? companyMatch[1].trim() : undefined;
  
  return {
    name,
    email,
    phone,
    type,
    company,
    source: 'email',
    since: new Date().toISOString(),
  };
}

export function parseEmailForItems(body: string, subject: string): { items: QuoteItem[]; labor: QuoteLabor[] } {
  const items: QuoteItem[] = [];
  const labor: QuoteLabor[] = [];
  
  const itemPatterns = [
    /(\d+)x?\s+([^€\n]+?)\s*[-–]\s*€\s*(\d+(?:[.,]\d{2})?)/gi,
    /([^€\n]+?)\s*[-–:]\s*(\d+)\s*stuks?\s*[aà@]\s*€\s*(\d+(?:[.,]\d{2})?)/gi,
    /([^€\n]+?)\s*[-–:]\s*€\s*(\d+(?:[.,]\d{2})?)/gi,
  ];
  
  itemPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(body)) !== null) {
      const quantity = match[1] && /^\d+$/.test(match[1]) ? parseInt(match[1]) : 1;
      const description = match[2] ? match[2].trim() : match[1].trim();
      const priceStr = match[3] ? match[3] : match[2];
      const pricePerUnit = parseFloat(priceStr.replace(',', '.'));
      
      if (description && pricePerUnit > 0) {
        items.push({
          description,
          quantity,
          pricePerUnit,
          total: quantity * pricePerUnit,
        });
      }
    }
  });
  
  const laborPatterns = [
    /(\d+)\s*(?:uur|uren|hours?)\s+(?:werk|arbeid|montage)?(?:\s*[aà@]\s*€\s*(\d+(?:[.,]\d{2})?))?/gi,
    /([^:\n]+?):\s*(\d+)\s*(?:uur|uren|hours?)/gi,
  ];
  
  laborPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(body)) !== null) {
      const hours = parseInt(match[2] || match[1]);
      const description = match[1] && !/^\d+$/.test(match[1]) ? match[1].trim() : 'Werkuren';
      const hourlyRate = match[2] ? parseFloat(match[2].replace(',', '.')) : 75; // Default €75/uur
      
      if (hours > 0) {
        labor.push({
          description,
          hours,
          hourlyRate,
          total: hours * hourlyRate,
        });
      }
    }
  });
  
  if (items.length === 0 && subject) {
    const productKeywords = ['offerte', 'prijsopgave', 'quote', 'aanvraag', 'bestelling'];
    const hasProductKeyword = productKeywords.some(kw => subject.toLowerCase().includes(kw));
    
    if (hasProductKeyword) {
      items.push({
        description: subject.replace(/^(re:|fw:|offerte|prijsopgave|quote|aanvraag)[:;]?\s*/gi, '').trim(),
        quantity: 1,
        pricePerUnit: 0, // Moet handmatig ingevuld worden
        total: 0,
      });
    }
  }
  
  return { items, labor };
}

export function parseEmailToQuote(email: Partial<Email>): Partial<Quote> {
  const { from = '', subject = '', body = '' } = email;
  
  const { items, labor } = parseEmailForItems(body, subject);
  
  const itemsSubtotal = items.reduce((sum, item) => sum + item.total, 0);
  const laborSubtotal = labor.reduce((sum, l) => sum + l.total, 0);
  const subtotal = itemsSubtotal + laborSubtotal;
  const vatRate = 21; // Standaard 21% BTW
  const vatAmount = subtotal * (vatRate / 100);
  const total = subtotal + vatAmount;
  
  const locationPatterns = [
    /(?:locatie|adres|address)[:;]?\s*([^\n]+)/i,
    /(?:op|naar|aan)\s+(?:het\s+)?([A-Z][a-zé]+(?:\s+\d+)?(?:,\s*\d{4}\s*[A-Z]{2})?)/,
  ];
  
  let location: string | undefined;
  for (const pattern of locationPatterns) {
    const match = body.match(pattern);
    if (match) {
      location = match[1].trim();
      break;
    }
  }
  
  const datePatterns = [
    /(\d{1,2})[/-](\d{1,2})[/-](\d{4})/,
    /(\d{4})[/-](\d{1,2})[/-](\d{1,2})/,
  ];
  
  let scheduledDate: string | undefined;
  for (const pattern of datePatterns) {
    const match = body.match(pattern);
    if (match) {
      const date = new Date(match[0]);
      if (!isNaN(date.getTime())) {
        scheduledDate = date.toISOString();
      }
      break;
    }
  }
  
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 30);
  
  return {
    items,
    labor: labor.length > 0 ? labor : undefined,
    subtotal,
    vatRate,
    vatAmount,
    total,
    status: 'draft',
    createdDate: new Date().toISOString(),
    validUntil: validUntil.toISOString(),
    notes: `Offerte aangemaakt van email:\nVan: ${from}\nOnderwerp: ${subject}\n\nOriginele email:\n${body.substring(0, 500)}${body.length > 500 ? '...' : ''}`,
    location,
    scheduledDate,
  };
}

export function parseEmailForStorage(emailData: any): Partial<Email> {
  const { from, to, subject, body, date, htmlBody } = emailData;
  
  return {
    from,
    to: Array.isArray(to) ? to : [to].filter(Boolean),
    subject,
    body,
    htmlBody,
    status: 'received',
    priority: 'normal',
    receivedDate: date || new Date().toISOString(),
    isRead: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function getEmailSummary(email: Partial<Email>): string {
  const { from = 'Onbekend', subject = 'Geen onderwerp' } = email;
  const fromName = from.split('<')[0].trim() || from.split('@')[0];
  return `Email van ${fromName}: ${subject}`;
}
