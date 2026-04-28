/**
 * ASI-specific constants. These values come from the old project and are what
 * the backend (`/booking/create/v2`) expects for ASI bookings.
 *
 * - NATIONALITIES: shown in the date-picker step; `code` maps to backend
 *   `visitorType` (101/102/103/104). Label is sent verbatim as `nationality`.
 * - SHIFT_SLOTS: ASI places have three fixed slots; `type` matches the shift
 *   letter used in /asi/placeAvail response keys.
 * - ID_PROOF_TYPES: foreigners can only present a passport (code 2); Indians
 *   have the usual set. IDs are the backend proofType codes.
 */

export const ASI_NATIONALITIES = [
  { label: 'INDIAN', code: 101 },
  { label: 'SAARC', code: 103 },
  { label: 'BIMSTEC', code: 104 },
  { label: 'FOREIGNER', code: 102 },
] as const;

export const ASI_SHIFT_SLOTS = [
  { type: 'F', name: 'Forenoon', time: '6:00 AM – 12:00 PM' },
  { type: 'A', name: 'Afternoon', time: '12:00 PM – 6:00 PM' },
  { type: 'E', name: 'Evening', time: '6:00 PM – 9:00 PM' },
] as const;

export const ASI_ID_PROOFS_INDIAN = [
  { label: 'Aadhaar Card', code: 1 },
  { label: 'Passport', code: 2 },
  { label: 'Driving License', code: 3 },
  { label: 'Voter ID', code: 4 },
  { label: 'PAN Card', code: 5 },
];

export const ASI_ID_PROOFS_FOREIGN = [
  { label: 'Passport', code: 2 },
];

// Country code mapping for a few common nationalities. The backend only needs
// a numeric phone country code; fall back to 91 for any unknown nationality.
export const COUNTRY_CODE_BY_NATIONALITY: Record<string, number> = {
  INDIAN: 91,
  SAARC: 91,
  BIMSTEC: 91,
  FOREIGNER: 1,
};

export function generateCaptchaText(length = 6): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}
