'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosInstance from '@/configs/axios.config';
import { apiendpoints } from '@/utils/constants/api-endpoints.constants';
import { SaveUserLogs } from '@/services/apiCalls/booking.services';
import { handlePaymentRedirect } from '@/features/booking/utils/payment';
import { showErrorToastMessage } from '@/utils/toast.utils';
import moment from 'moment-timezone';

// Mirrors the old project's /payment-failed page: payment gateway returns
// here on failure (or any non-success outcome) with bookingId in the URL.
// "Retry" re-checks the booking status — if it has flipped to SUCCESS the
// user is sent on to the booking ticket; otherwise we re-trigger the
// EMITRA confirm flow so they can pay again.
export default function PaymentFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const bookingId       = searchParams.get('bookingId') ?? '';
  const bookingObjectId = searchParams.get('bookingObjectId') ?? '';
  const message         = searchParams.get('message') ?? '';

  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (message) showErrorToastMessage(message);
  }, [message]);

  useEffect(() => {
    if (!bookingId) router.replace('/');
  }, [bookingId, router]);

  const { mutate: saveUserLogs } = SaveUserLogs();

  // Direct axios calls are used (instead of the `GetBookingStatus`/
  // `ConfirmBookingById` useQuery/useMutation hooks) because react-query
  // returns the cached response on a re-check and never re-runs the
  // callback inside `queryFn`, so the user's second Retry click is silent.
  async function handleRetry() {
    if (!bookingObjectId || retrying) return;
    setRetrying(true);
    try {
      // Endpoint expects the booking *object* id (e.g. 69f19d…) as the
      // `bookingId` query param, not the human-readable booking id (HAW…).
      const { data } = await axiosInstance.get(
        `${apiendpoints.GetBookingStatus}?bookingId=${bookingObjectId}`,
      );
      const result = data?.result;
      const ip = typeof window !== 'undefined' ? localStorage.getItem('ipaddress') ?? '' : '';

      if (result?.paymentStatus === 'SUCCESS') {
        if (ip) saveUserLogs({ date: moment().valueOf(), ipAddress: ip, action: 'User Payment Successful' });
        router.push(`/my-booking-ticket?bookingId=${bookingId}&paymentStatus=SUCCESS`);
        return;
      }

      if (result?.paymentStatus === 'FAIL') {
        if (ip) saveUserLogs({ date: moment().valueOf(), ipAddress: ip, action: 'User Payment Failed' });
        if (!bookingObjectId) {
          showErrorToastMessage('Cannot retry payment without booking reference.');
          return;
        }
        const { data: confirmData } = await axiosInstance.post(
          `${apiendpoints.confirmBookingById}?bookingId=${bookingObjectId}`,
        );
        handlePaymentRedirect(confirmData?.result);
        return;
      }

      if (result?.msg) showErrorToastMessage(result.msg);
    } catch (err: any) {
      showErrorToastMessage(err?.response?.data?.message || 'Could not refresh payment status.');
    } finally {
      setRetrying(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-24 h-24 rounded-[24px] bg-gradient-to-br from-red-500 to-[#E8631A] flex items-center justify-center text-5xl mb-6 shadow-[0_8px_32px_rgba(232,99,26,0.25)]">
        ⚠️
      </div>

      <h1 className="font-['Playfair_Display',serif] text-2xl md:text-3xl font-bold text-[#2C2017] mb-3">
        Payment Failed
      </h1>

      <p className="text-[#7A6A58] text-base max-w-md mb-2">
        Booking unsuccessful. Kindly review payment details for a successful transaction.
      </p>
      <p className="text-[#7A6A58] text-xs max-w-md mb-8">
        Note: If the booking fails and an amount has been deducted, it will be automatically
        refunded to the same account.
      </p>

      {bookingId && (
        <p className="text-[11px] text-[#7A6A58] mb-6">
          Booking ID: <span className="font-semibold text-[#2C2017]">#{bookingId}</span>
        </p>
      )}

      <div className="flex gap-3">
        <Link
          href="/"
          className="px-6 py-3 border-2 border-[#E8DAC5] text-[#2C2017] font-semibold rounded-full hover:bg-[#F5E8CC] transition-colors"
        >
          ← Back to Home
        </Link>
        <button
          onClick={handleRetry}
          disabled={retrying || !bookingObjectId}
          className="px-6 py-3 bg-[#E8631A] text-white font-bold rounded-full hover:bg-[#C04E0A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {retrying ? 'Checking…' : 'Retry'}
        </button>
      </div>
    </div>
  );
}
