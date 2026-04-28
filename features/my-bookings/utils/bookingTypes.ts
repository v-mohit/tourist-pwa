/**
 * Source of a booking. Each booking item in the merged list carries a `bookingSource`
 * field set by `useMergedBookings`.
 *
 *   - regular : /booking/get-ticket-v1  (standard / inventory / package)
 *   - jkk     : /jkk/reportForUser      (Jawahar Kala Kendra and similar cultural venues)
 *   - igprs   : /igprgvs/report         (IGPRGVS guest houses)
 *   - asi     : /asi/ticket             (Archaeological Survey of India monuments)
 */
export type BookingSource = 'regular' | 'jkk' | 'igprs' | 'asi';

export interface MergedBooking {
  bookingSource: BookingSource;
  [key: string]: any;
}

export function isJkkBooking(b: any): boolean {
  if (!b) return false;
  if (b.bookingSource === 'jkk') return true;
  return String(b?.placeName || '').toLowerCase().includes('jawahar');
}

export function isIgprsBooking(b: any): boolean {
  if (!b) return false;
  if (b.bookingSource === 'igprs') return true;
  const name = String(b?.placeName || '').toLowerCase();
  return name.includes('indira gandhi') || name.includes('igpr');
}

export function isAsiBooking(b: any): boolean {
  if (!b) return false;
  if (b.bookingSource === 'asi') return true;
  return !!b?.asiTicketDto;
}
