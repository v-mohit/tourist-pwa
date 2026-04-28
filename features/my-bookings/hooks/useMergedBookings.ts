'use client';

import { useMemo, useRef } from 'react';
import { GetBookingDetails } from '@/services/apiCalls/booking.services';
import { GetAsiBookingDetails } from '@/services/apiCalls/asi.service';
import { GetJkkTicketDetails } from '@/services/apiCalls/jkk.service';
import { GetIgprsReport } from '@/services/apiCalls/igprgvs.service';
import type { BookingSource, MergedBooking } from '../utils/bookingTypes';

interface MergedBookingsInput {
  callApi: boolean;
  setLoading: (flag: boolean) => void;
  userId?: string;
  bookingId?: string;
  searchKey?: string;
  size?: number;
  isOld?: boolean;
  isRefund?: boolean;
  status?: string;
  dateFilter?: string;
  startDay?: number;
  endDay?: number;
}

interface MergedBookingsResult {
  bookings: MergedBooking[];
  refetchAll: () => void;
}

/**
 * Picks the epoch-ms visit date for a booking, normalizing across sources:
 *   regular/asi : b.bookingDate
 *   jkk/igprs   : b.bookingStartDate
 */
function resolveVisitDate(b: any): number {
  return (
    b?.bookingDate ??
    b?.bookingStartDate ??
    b?.createdDate ??
    0
  );
}

function tag(items: any[] | undefined, source: BookingSource): MergedBooking[] {
  if (!Array.isArray(items)) return [];
  return items.map((item) => ({
    ...item,
    bookingSource: source,
    /**
     * Keep existing bookingDate if present; otherwise fall back to bookingStartDate
     * so cards/drawer using `b.bookingDate` keep working unchanged for JKK/IGPRS.
     */
    bookingDate: item?.bookingDate ?? item?.bookingStartDate ?? item?.createdDate ?? 0,
  }));
}

/**
 * Fans out to the four booking-list endpoints (regular, JKK, IGPRS, ASI), then merges
 * the responses into one flat array. Each item is tagged with its `bookingSource` so
 * downstream code (card rendering, type guards) can branch on it without inspecting
 * response shape.
 *
 * Merge strategy mirrors the old project's my-bookings page.
 */
export function useMergedBookings({
  callApi,
  setLoading,
  userId,
  bookingId,
  searchKey,
  size = 100,
  isOld,
  isRefund,
  status,
  dateFilter,
  startDay,
  endDay,
}: MergedBookingsInput): MergedBookingsResult {
  const baseParams = {
    callApi,
    setLoading,
    bookingId,
    searchKey,
    size,
    isOld: isOld ?? false,
    isRefund,
    status,
    dateFilter,
    startDay,
    endDay,
  };

  const { data: regularResp, refetch: refetchRegular } = GetBookingDetails(baseParams);

  const { data: asiResp, refetch: refetchAsi } = GetAsiBookingDetails(baseParams);

  /**
   * JKK + IGPRS need an explicit day range. When the user hasn't applied a
   * filter we default to TODAY's range (00:00 → 23:59:59), which matches the
   * old project's "show today's bookings" behavior and, crucially, keeps the
   * range stable across renders.
   *
   * Without this, using `Date.now()` as the default recomputed a new endDay
   * on every render — react-query treats the query key as changing each time
   * and refires `/jkk/reportForUser` continuously.
   *
   * todayRangeRef keeps the same range for the whole lifetime of this hook
   * instance; if the user keeps the page open past midnight they can refresh.
   */
  const todayRangeRef = useRef<{ start: number; end: number } | null>(null);
  if (!todayRangeRef.current) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    todayRangeRef.current = { start: start.getTime(), end: end.getTime() };
  }
  const defaultStart = todayRangeRef.current.start;
  const defaultEnd = todayRangeRef.current.end;

  const jkkStart = startDay ?? defaultStart;
  const jkkEnd = endDay ?? defaultEnd;
  const jkkDateType =
    dateFilter === 'Current' ? 'Booking' : dateFilter === 'Visit' ? 'Visit' : '';
  const { data: jkkResp, refetch: refetchJkk } = GetJkkTicketDetails(
    callApi ? jkkStart : undefined,
    callApi ? jkkEnd : undefined,
    jkkDateType,
    bookingId,
  );

  // IGPRS report requires a userId; its query is automatically disabled otherwise.
  const { data: igprsResp, refetch: refetchIgprs } = GetIgprsReport(
    callApi && userId ? (startDay ?? defaultStart) : undefined,
    callApi && userId ? (endDay ?? defaultEnd) : undefined,
    userId,
  );

  const bookings = useMemo<MergedBooking[]>(() => {
    const regular = tag(
      regularResp?.result?.ticketBookingDetailDtos,
      'regular',
    );

    const asi = tag(
      asiResp?.result?.ticketBookingDetailDtos,
      'asi',
    );

    const jkk = tag(
      jkkResp?.result?.jkkReportList,
      'jkk',
    );

    /**
     * IGPRS responses come in two shapes — wrapped (`result.igprgvsReportList`)
     * or a flat array under `result`. Normalize both.
     */
    const igprsRaw = Array.isArray(igprsResp?.result?.igprgvsReportList)
      ? igprsResp.result.igprgvsReportList
      : Array.isArray(igprsResp?.result)
        ? igprsResp.result
        : [];
    const igprs = tag(igprsRaw, 'igprs');

    // Drop JKK rows that also appear in the regular list (same bookingId) to avoid
    // duplicates — `/booking/get-ticket-v1` sometimes includes JKK bookings once
    // they're paid.
    const regularIds = new Set(
      regular.map((r) => String(r.bookingId ?? r.id)).filter(Boolean),
    );
    const dedupedJkk = jkk.filter(
      (j) => !regularIds.has(String(j.bookingId ?? j.id)),
    );

    const merged = [...regular, ...dedupedJkk, ...igprs, ...asi];

    // Newest visit-date first.
    merged.sort((a, b) => resolveVisitDate(b) - resolveVisitDate(a));

    return merged;
  }, [regularResp, asiResp, jkkResp, igprsResp]);

  const refetchAll = () => {
    refetchRegular();
    refetchAsi();
    refetchJkk();
    refetchIgprs();
  };

  return { bookings, refetchAll };
}
