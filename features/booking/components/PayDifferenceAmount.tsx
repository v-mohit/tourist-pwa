'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import moment from 'moment-timezone';
import Link from 'next/link';
import { TIMEZONES } from '@/utils/constants/common.constants';
import { formatPriceInDisplayFormat } from '@/utils/common.utils';
import { confirmPayDiffAmount } from '@/services/apiCalls/booking.services';
import { handlePaymentRedirect } from '@/features/booking/utils/payment';
import { showErrorToastMessage } from '@/utils/toast.utils';
import MakePaymentModal from './MakePaymentModal';

function generateCaptcha(): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let captcha = '';
  for (let i = 0; i < 6; i++) {
    captcha += chars[Math.floor(Math.random() * chars.length)];
  }
  return captcha;
}

export default function PayDifferenceAmount() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const diffAmount = searchParams.get('diffAmount') ?? '';
  const requestId  = searchParams.get('requestId') ?? '';
  const id         = searchParams.get('id') ?? '';

  const [bookingData, setBookingData] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState('');
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);

  useEffect(() => {
    setCaptcha(generateCaptcha());
    try {
      const stored = sessionStorage.getItem('payDiffBookingData');
      if (stored) setBookingData(JSON.parse(stored));
    } catch {}
  }, []);

  const payDiff = confirmPayDiffAmount(
    (res: any) => {
      try { sessionStorage.removeItem('payDiffBookingData'); } catch {}
      handlePaymentRedirect(res);
    },
    () => {
      setRedirecting(false);
      setIsPaymentModalOpen(false);
    },
  );

  function reloadCaptcha() {
    setCaptcha(generateCaptcha());
    setCaptchaInput('');
    setCaptchaVerified(false);
    setCaptchaError('');
  }

  function handleCaptchaChange(value: string) {
    setCaptchaInput(value);
    if (!value) {
      setCaptchaVerified(false);
      setCaptchaError('');
      return;
    }
    if (value === captcha) {
      setCaptchaVerified(true);
      setCaptchaError('');
    } else {
      setCaptchaVerified(false);
      setCaptchaError('Please complete the CAPTCHA correctly');
    }
  }

  function makePayment() {
    if (!requestId) {
      showErrorToastMessage('Request ID is missing');
      return;
    }
    setRedirecting(true);
    payDiff.mutate({ requestId });
  }

  const validOn = bookingData?.bookingDate
    ? moment(Number(bookingData.bookingDate)).tz(TIMEZONES.india).format('dddd, DD MMM, YYYY')
    : '—';
  const shiftRange = (bookingData?.shiftDto?.startTime && bookingData?.shiftDto?.endTime)
    ? `${moment(Number(bookingData.shiftDto.startTime)).tz(TIMEZONES.india).format('hh:mm a')} to ${moment(Number(bookingData.shiftDto.endTime)).tz(TIMEZONES.india).format('hh:mm a')}`
    : '—';

  const canPay = captchaVerified && privacyPolicyAccepted;

  return (
    <div className="bg-[#FBF7EF] min-h-[calc(100vh-200px)] py-8">
      <MakePaymentModal
        open={isPaymentModalOpen}
        onClose={() => { if (!redirecting) setIsPaymentModalOpen(false); }}
        onConfirm={makePayment}
        loading={redirecting}
        isLoading={payDiff.isPending}
      />

      <div className="max-w-6xl mx-auto px-4">
        <div className="text-xs text-[#7A6A58] mb-3">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-1.5">›</span>
          <Link href="/my-bookings" className="hover:underline">My Bookings</Link>
          <span className="mx-1.5">›</span>
          <span>Pay Difference Amount</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT: details */}
          <div className="md:col-span-2 bg-white rounded-[14px] border border-[#E8DAC5] p-5 shadow-sm">
            <h1 className="text-xl font-bold text-[#2C2017] mb-3">
              {bookingData?.placeDetailDto?.name || bookingData?.placeName || 'Pay Difference Amount'}
            </h1>
            <div className="text-sm text-[#5A2D10] leading-relaxed bg-[#FFF5EE] border border-[#F5D2B5] rounded-[10px] p-4">
              <p className="mb-2">
                As per the administration decision, tourist has to pay difference amount on advance booking made before <span className="font-semibold">1 April 2026</span>.
              </p>
              <p>
                Difference Amount you have to pay on booking <span className="font-bold text-[#2C2017]">{id || '—'}</span> is
                <span className="font-bold text-[#2C2017]"> Rs. {diffAmount || '0'}</span>.
              </p>
            </div>
          </div>

          {/* RIGHT: payment summary */}
          <div className="bg-white rounded-[14px] border border-[#E8DAC5] p-5 shadow-sm md:sticky md:top-4 self-start space-y-4">
            <h4 className="text-base font-bold text-[#2C2017]">Payment Details</h4>
            <div className="text-xs text-[#7A6A58]">Total Tickets: <span className="font-semibold text-[#2C2017]">{bookingData?.totalUsers ?? '—'}</span></div>

            <div className="flex justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.4px] text-[#7A6A58]">Valid On</div>
                <div className="text-xs font-semibold text-[#2C2017] mt-0.5">{validOn}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-[0.4px] text-[#7A6A58]">Time Slot</div>
                <div className="text-xs font-semibold text-[#2C2017] mt-0.5">{shiftRange}</div>
              </div>
            </div>

            <div className="flex justify-between gap-3 border-t border-[#E8DAC5] pt-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.4px] text-[#7A6A58]">Zone</div>
                <div className="text-xs font-semibold text-[#2C2017] mt-0.5">{bookingData?.zoneName || '—'}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-[0.4px] text-[#7A6A58]">Booking Type</div>
                <div className="text-xs font-semibold text-[#2C2017] mt-0.5">{bookingData?.paymentType || '—'}</div>
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-[#E8DAC5] pt-3">
              <div>
                <div className="text-sm font-bold text-[#2C2017]">Payable Amount</div>
                <p className="text-[10px] text-[#7A6A58] mt-1 leading-tight max-w-[180px]">
                  This amount includes all the taxes and charges. Except payment gateway charges.
                </p>
              </div>
              <div className="text-lg font-bold text-[#E8631A]">
                ₹ {formatPriceInDisplayFormat(diffAmount)}
              </div>
            </div>

            {/* Privacy / Terms */}
            <label className="flex items-center gap-2 text-xs text-[#2C2017]">
              <input
                type="checkbox"
                checked={privacyPolicyAccepted}
                onChange={(e) => setPrivacyPolicyAccepted(e.target.checked)}
                className="accent-[#E8631A]"
              />
              <span>Agree to</span>
              <Link href="/terms-conditions" className="text-[#E8631A] underline">Terms &amp; Conditions</Link>
            </label>

            {/* CAPTCHA */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div
                  className="select-none px-4 py-2 bg-[#F5E8CC] rounded-md text-sm font-mono font-bold tracking-[3px] text-[#2C2017]"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.04) 4px, rgba(0,0,0,0.04) 8px)',
                  }}
                >
                  {captcha}
                </div>
                <button
                  type="button"
                  onClick={reloadCaptcha}
                  aria-label="Reload captcha"
                  className="w-8 h-8 rounded-full border border-[#E8DAC5] flex items-center justify-center text-[#2C2017] hover:bg-[#FFF5EE]"
                >
                  ↻
                </button>
              </div>
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => handleCaptchaChange(e.target.value)}
                placeholder="Enter the text above"
                className="w-full px-3 py-2 border border-[#E8DAC5] rounded-[8px] text-sm focus:outline-none focus:border-[#E8631A]"
              />
              {captchaError && <div className="text-xs text-red-600">{captchaError}</div>}
            </div>

            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(true)}
              disabled={!canPay}
              className="w-full py-3 bg-[#E8631A] text-white font-bold rounded-full hover:bg-[#C04E0A] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Make Payment
            </button>

            <button
              type="button"
              onClick={() => router.push('/my-bookings')}
              className="w-full py-2 text-xs text-[#7A6A58] hover:text-[#2C2017]"
            >
              ← Back to My Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
