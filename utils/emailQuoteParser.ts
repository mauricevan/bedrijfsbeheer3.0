import { QuoteItem, QuoteLabor } from "../types";
export interface ParsedQuoteData {
  items: QuoteItem[];
  labor?: QuoteLabor[];
  notes?: string;
  suggestedTotal?: number;
}
export function parseEmailForQuote(
  emailBody: string,
  emailSubject: string
): ParsedQuoteData {
  const items: QuoteItem[] = [];
  const labor: QuoteLabor[] = [];
  let notes = emailBody;
  const cleanBody = emailBody
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const productKeywords = [
    "product",
    "materiaal",
    "onderdeel",
    "item",
    "artikel",
    "stuk",
    "stuks",
    "x",
    "aantal",
    "hoeveelheid",
    "qty",
    "quantity",
  ];
  const serviceKeywords = [
    "dienst",
    "service",
    "werk",
    "werkzaamheden",
    "uren",
    "uur",
    "hour",
    "hours",
    "uitvoeren",
    "installeren",
    "plaatsen",
    "monteren",
    "repareren",
    "onderhoud",
  ];
  const priceKeywords = [
    "prijs",
    "prijzen",
    "kosten",
    "tarief",
    "tarieven",
    "euro",
    "eur",
    "€",
    "stukprijs",
    "per stuk",
    "per uur",
    "per uur",
  ];
  const pricePattern = /[\d.,]+/g;
  const lines = cleanBody.split(/\n/).map((line) => line.trim());
  const listPattern = /^[\d•\-\*]\s*(.+)/i;
  const numberedPattern = /^(\d+)[\.\)]\s*(.+)/i;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    const originalLine = lines[i];
    if (!line || line.length < 3) continue;
    const listMatch = originalLine.match(listPattern);
    const numberedMatch = originalLine.match(numberedPattern);
    const itemText = listMatch
      ? listMatch[1]
      : numberedMatch
      ? numberedMatch[2]
      : null;
    if (itemText) {
      const quantityMatch = itemText.match(/(\d+)\s*(?:x|stuks?|stuk|×)/i);
      const quantity = quantityMatch
        ? parseInt(quantityMatch[1], 10)
        : 1;
      let price = 0;
      const priceInLine = itemText.match(/(?:€|eur|euro)?\s*([\d.,]+)/i);
      if (priceInLine) {
        price = parseFloat(
          priceInLine[1].replace(",", ".")
        );
      } else if (i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        const nextPriceMatch = nextLine.match(
          /(?:prijs|kosten|€|eur|euro)?\s*([\d.,]+)/i
        );
        if (nextPriceMatch) {
          price = parseFloat(
            nextPriceMatch[1].replace(",", ".")
          );
        }
      }
      const isService = serviceKeywords.some((keyword) =>
        itemText.toLowerCase().includes(keyword)
      );
      const isProduct = productKeywords.some((keyword) =>
        itemText.toLowerCase().includes(keyword)
      );
      if (isService && (line.includes("uur") || line.includes("hour"))) {
        const hoursMatch = itemText.match(/(\d+(?:[.,]\d+)?)\s*(?:uur|hours?)/i);
        const hours = hoursMatch
          ? parseFloat(hoursMatch[1].replace(",", "."))
          : quantity;
        let hourlyRate = price || 50;
        if (!price) {
          const rateMatch = itemText.match(
            /(?:€|eur|euro)?\s*([\d.,]+)\s*(?:per\s*)?(?:uur|hour)/i
          );
          if (rateMatch) {
            hourlyRate = parseFloat(rateMatch[1].replace(",", "."));
          }
        }
        labor.push({
          description: itemText.trim(),
          hours: hours,
          hourlyRate: hourlyRate,
          total: hours * hourlyRate,
        });
      } else {
        const description = itemText.trim();
        if (description.length > 0) {
          items.push({
            description: description,
            quantity: quantity,
            pricePerUnit: price || 0,
            total: quantity * (price || 0),
          });
        }
      }
    }
  }
  if (items.length === 0 && labor.length === 0) {
    const explicitProductMatch = cleanBody.match(
      /(?:product|materiaal|onderdeel|artikel)[:\s]+(.+?)(?:[.,;]|$)/i
    );
    if (explicitProductMatch) {
      items.push({
        description: explicitProductMatch[1].trim(),
        quantity: 1,
        pricePerUnit: 0,
        total: 0,
      });
    }
    const explicitServiceMatch = cleanBody.match(
      /(?:werk|dienst|service|uren?)[:\s]+(.+?)(?:[.,;]|$)/i
    );
    if (explicitServiceMatch) {
      const serviceText = explicitServiceMatch[1].trim();
      const hoursMatch = serviceText.match(/(\d+(?:[.,]\d+)?)/);
      const hours = hoursMatch
        ? parseFloat(hoursMatch[1].replace(",", "."))
        : 1;
      labor.push({
        description: serviceText,
        hours: hours,
        hourlyRate: 50,
        total: hours * 50,
      });
    }
  }
  if (items.length === 0 && labor.length === 0) {
    const quantityMatches = cleanBody.match(/(\d+)\s*(?:x|stuks?|×)/gi);
    const priceMatches = cleanBody.match(/€?\s*([\d.,]+)/gi);
    if (quantityMatches && quantityMatches.length > 0) {
      const quantities = quantityMatches.map((m) =>
        parseInt(m.replace(/\D/g, ""), 10)
      );
      const totalQuantity = quantities.reduce((sum, qty) => sum + qty, 0);
      items.push({
        description: `Offerte aanvraag: ${emailSubject}`,
        quantity: totalQuantity,
        pricePerUnit: 0,
        total: 0,
      });
    } else {
      items.push({
        description: `Offerte aanvraag: ${emailSubject}`,
        quantity: 1,
        pricePerUnit: 0,
        total: 0,
      });
    }
  }
  const itemsSubtotal = items.reduce((sum, item) => sum + item.total, 0);
  const laborSubtotal = labor.reduce((sum, l) => sum + l.total, 0);
  const suggestedTotal = itemsSubtotal + laborSubtotal;
  return {
    items,
    labor: labor.length > 0 ? labor : undefined,
    notes: notes.length > 500 ? notes.substring(0, 500) + "..." : notes,
    suggestedTotal: suggestedTotal > 0 ? suggestedTotal : undefined,
  };
}
