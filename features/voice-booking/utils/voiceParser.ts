/**
 * Rule-based parser to extract booking intent from natural language text.
 * No external API needed — uses regex + keyword matching.
 */

export interface ParsedBookingIntent {
  placeName: string | null;
  date: string | null; // YYYY-MM-DD
  visitors: { type: string; count: number }[];
  raw: string;
}

/* ── Date parsing ───────────────────────────────────────────────────────────── */

const MONTH_MAP: Record<string, number> = {
  january: 0, jan: 0, february: 1, feb: 1, march: 2, mar: 2,
  april: 3, apr: 3, may: 4, june: 5, jun: 5, july: 6, jul: 6,
  august: 7, aug: 7, september: 8, sep: 8, sept: 8,
  october: 9, oct: 9, november: 10, nov: 10, december: 11, dec: 11,
};

const DAY_OFFSETS: Record<string, number> = {
  today: 0, tomorrow: 1, 'day after tomorrow': 2,
};

const WEEKDAYS: Record<string, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6,
};

function parseDate(text: string): string | null {
  const lower = text.toLowerCase();

  // "today", "tomorrow"
  for (const [word, offset] of Object.entries(DAY_OFFSETS)) {
    if (lower.includes(word)) {
      const d = new Date();
      d.setDate(d.getDate() + offset);
      return fmt(d);
    }
  }

  // "next monday", "this friday"
  for (const [day, dayIdx] of Object.entries(WEEKDAYS)) {
    const rx = new RegExp(`(next|this|coming)\\s+${day}`, 'i');
    if (rx.test(lower)) {
      const d = new Date();
      const diff = (dayIdx - d.getDay() + 7) % 7 || 7;
      d.setDate(d.getDate() + diff);
      return fmt(d);
    }
  }

  // "25 april", "april 25", "25th april", "april 25th"
  for (const [name, monthIdx] of Object.entries(MONTH_MAP)) {
    const rx1 = new RegExp(`(\\d{1,2})(?:st|nd|rd|th)?\\s+(?:of\\s+)?${name}(?:\\s+(\\d{4}))?`, 'i');
    const rx2 = new RegExp(`${name}\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:\\s*,?\\s*(\\d{4}))?`, 'i');

    let m = lower.match(rx1);
    if (m) {
      const year = m[2] ? parseInt(m[2]) : guessYear(monthIdx);
      return fmt(new Date(year, monthIdx, parseInt(m[1])));
    }
    m = lower.match(rx2);
    if (m) {
      const year = m[2] ? parseInt(m[2]) : guessYear(monthIdx);
      return fmt(new Date(year, monthIdx, parseInt(m[1])));
    }
  }

  // DD/MM/YYYY or DD-MM-YYYY
  const slashMatch = lower.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (slashMatch) {
    return fmt(new Date(parseInt(slashMatch[3]), parseInt(slashMatch[2]) - 1, parseInt(slashMatch[1])));
  }

  return null;
}

function guessYear(month: number): number {
  const now = new Date();
  return month < now.getMonth() ? now.getFullYear() + 1 : now.getFullYear();
}

function fmt(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/* ── Visitor parsing ────────────────────────────────────────────────────────── */

const VISITOR_TYPES: { keywords: string[]; type: string }[] = [
  { keywords: ['indian adult', 'indian', 'adult indian', 'desi'], type: 'Indian Adult' },
  { keywords: ['foreign adult', 'foreigner', 'foreign', 'international', 'tourist foreign'], type: 'Foreign Tourist' },
  { keywords: ['child', 'children', 'kid', 'kids', 'minor'], type: 'Child' },
  { keywords: ['student', 'students'], type: 'Student' },
  { keywords: ['adult', 'person', 'people', 'visitor', 'visitors', 'ticket', 'tickets'], type: 'Indian Adult' },
];

const WORD_NUMBERS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  a: 1, an: 1,
};

function parseVisitors(text: string): { type: string; count: number }[] {
  const lower = text.toLowerCase();
  const results: { type: string; count: number }[] = [];
  const matched = new Set<string>();

  for (const { keywords, type } of VISITOR_TYPES) {
    for (const kw of keywords) {
      // "2 indian adult", "three foreign", "1 child"
      const rx = new RegExp(`(\\d+|one|two|three|four|five|six|seven|eight|nine|ten|a|an)\\s+${kw}`, 'i');
      const m = lower.match(rx);
      if (m && !matched.has(type)) {
        const count = (WORD_NUMBERS[m[1].toLowerCase()] ?? parseInt(m[1])) || 1;
        results.push({ type, count });
        matched.add(type);
      }
    }
  }

  // If no visitors parsed but there's a bare number like "book 3 tickets"
  if (results.length === 0) {
    const bareNumber = lower.match(/(\d+)\s*(?:ticket|entry|booking)/i);
    if (bareNumber) {
      results.push({ type: 'Indian Adult', count: parseInt(bareNumber[1]) });
    }
  }

  return results;
}

/* ── Place name extraction ──────────────────────────────────────────────────── */

// Remove common booking-related words to isolate the place name
const STOP_WORDS = [
  'book', 'booking', 'ticket', 'tickets', 'entry', 'visit', 'for', 'to', 'at', 'in',
  'on', 'the', 'a', 'an', 'i', 'want', 'need', 'would', 'like', 'please', 'can',
  'you', 'me', 'my', 'get', 'make', 'do', 'with', 'of', 'and', 'or',
  'indian', 'foreign', 'foreigner', 'adult', 'child', 'children', 'kid', 'kids',
  'student', 'person', 'people', 'visitor', 'visitors', 'tourist',
  'today', 'tomorrow', 'next', 'this', 'coming',
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
  'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august',
  'september', 'october', 'november', 'december',
  'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
];

function extractPlaceName(text: string): string | null {
  // Try "for <place>" or "at <place>" or "to <place>" patterns
  const prepositionMatch = text.match(/(?:for|at|to|of)\s+(.+?)(?:\s+on\s+|\s+with\s+|\s+tomorrow|\s+today|\s+next|\s+\d|\s*$)/i);
  if (prepositionMatch) {
    const candidate = cleanPlace(prepositionMatch[1]);
    if (candidate.length >= 3) return candidate;
  }

  // Remove numbers, dates, visitor types, stop words — what remains is likely the place
  let cleaned = text;
  // Remove date patterns
  cleaned = cleaned.replace(/\b\d{1,2}(?:st|nd|rd|th)?\s+(?:of\s+)?(?:january|february|march|april|may|june|july|august|september|october|november|december)\b/gi, '');
  cleaned = cleaned.replace(/\b(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(?:st|nd|rd|th)?\b/gi, '');
  cleaned = cleaned.replace(/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}/g, '');
  // Remove numbers
  cleaned = cleaned.replace(/\b\d+\b/g, '');

  const words = cleaned.split(/\s+/).filter((w) => {
    const lw = w.toLowerCase().replace(/[^a-z]/g, '');
    return lw.length > 0 && !STOP_WORDS.includes(lw);
  });

  if (words.length > 0) {
    return words.join(' ').trim();
  }

  return null;
}

function cleanPlace(text: string): string {
  return text
    .replace(/\b\d+\b/g, '')
    .split(/\s+/)
    .filter((w) => {
      const lw = w.toLowerCase().replace(/[^a-z]/g, '');
      return lw.length > 0 && !['ticket', 'tickets', 'entry', 'booking', 'adult', 'child', 'indian', 'foreign', 'foreigner', 'student'].includes(lw);
    })
    .join(' ')
    .trim();
}

/* ── Main parser ────────────────────────────────────────────────────────────── */

export function parseVoiceInput(text: string): ParsedBookingIntent {
  return {
    placeName: extractPlaceName(text),
    date: parseDate(text),
    visitors: parseVisitors(text),
    raw: text,
  };
}
