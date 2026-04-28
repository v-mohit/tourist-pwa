'use client';

import { useMemo, useState } from 'react';
import { getCookie, setCookie } from 'cookies-next';
import type { BookingState } from '../../../types/booking.types';
import { useCreateBooking, useConfirmBooking } from '../../../hooks/useBookingApi';
import { formatRupees, handlePaymentRedirect } from '../../../utils/payment';
import { showErrorToastMessage, showSuccessToastMessage } from '@/utils/toast.utils';
import { getIpAddress } from '@/utils/common.utils';
import { generateCaptchaText } from '../../../utils/asi.constants';

interface Props {
  state: BookingState;
  onBack: () => void;
}

function getOrCreateDeviceId(): string {
  let deviceId = getCookie('app_captcha') as string | undefined;
  if (!deviceId) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    deviceId = Array.from({ length: 8 }, () =>
      chars[Math.floor(Math.random() * chars.length)],
    ).join('');
    setCookie('app_captcha', deviceId);
  }
  return deviceId;
}

/**
 * Builds the ASI booking payload sent to /booking/create/v2?onSite=false.
 * Mirrors the old project (`CreateBookingByPlace` -> `ConfirmBookingById` -> eMitra),
 * adding the ASI-only fields (visitorType, adultCount, childCount, proofType,
 * token/orderId) that the backend expects.
 */
function buildAsiPayload(state: BookingState, ipAddress: string) {
  const { config, selectedDateMs, selectedTickets, allShiftIds, asi } = state;
  const visitor = asi.visitor;
  const adultCount = selectedTickets.reduce((s, t) => s + t.quantity, 0);

  const ticketUserDtoClone = selectedTickets.map(({ ticketType, quantity }) => ({
    ticketTypeId: ticketType.id,
    qty: quantity,
    addOnList: [],
  }));

  return {
    bookingDate: selectedDateMs,
    placeId: config.placeId,
    device: 'Web' as const,
    seasonId: state.season?.id ?? selectedTickets[0]?.ticketType?.seasonId ?? '',
    ticketUserDtoClone,
    shiftId: allShiftIds,
    vip: false,
    deviceId: getOrCreateDeviceId(),
    ipAddress,
    visitorName: visitor.visitorName,
    mobileNo: visitor.mobileNo,
    slot: asi.shiftSlot,
    emailId: visitor.email,
    countryCode: visitor.countryCode || 91,
    gender: visitor.gender,
    age: Number(visitor.age) || 0,
    visitorType: asi.nationality?.code ?? 101,
    nationality: visitor.nationality,
    adultCount,
    childCount: asi.childCount,
    proofType: visitor.idProofType?.code ?? 0,
    proofValue: visitor.documentNumber,
    partnerCode: 0,
    orderId: asi.orderId,
    token: asi.token,
  };
}

export default function AsiReviewPayStep({ state, onBack }: Props) {
  const { asi, config, selectedTickets, selectedDate } = state;
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [refundAccepted, setRefundAccepted] = useState(false);
  const [captchaInput, setCaptchaInput] = useState(asi.captchaInput);
  // Initialize captcha once (lazy initializer). Stays stable across renders
  // until the user clicks "refresh", which is the desired behavior.
  const [captchaText, setCaptchaText] = useState(
    () => asi.captcha || generateCaptchaText(),
  );
  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const createBooking = useCreateBooking();
  const confirmBooking = useConfirmBooking();

  const adultCount = useMemo(
    () => selectedTickets.reduce((s, t) => s + t.quantity, 0),
    [selectedTickets],
  );

  const total = useMemo(
    () =>
      selectedTickets.reduce((sum, { ticketType, quantity }) => {
        const charge = ticketType.specificCharges?.[0];
        const price = charge?.totalAmount ?? charge?.amount ?? ticketType.amount ?? 0;
        return sum + price * quantity;
      }, 0),
    [selectedTickets],
  );

  const captchaVerified =
    !!captchaInput && captchaInput.trim().toUpperCase() === captchaText.toUpperCase();

  function refreshCaptcha() {
    setCaptchaText(generateCaptchaText());
    setCaptchaInput('');
  }

  async function handlePay() {
    if (!captchaVerified) {
      showErrorToastMessage('Please enter the captcha correctly.');
      return;
    }
    if (!refundAccepted || !termsAccepted) {
      showErrorToastMessage('Please accept the refund policy and terms.');
      return;
    }

    setProcessing(true);
    try {
      const ip = localStorage.getItem('ipaddress') ?? (await getIpAddress()) ?? '';
      const payload = buildAsiPayload(state, ip);

      setStatusMessage('Creating booking...');
      const bookingResult = await createBooking.mutateAsync(payload);
      if (!bookingResult?.id) {
        showErrorToastMessage('Booking creation failed. Please try again.');
        setProcessing(false);
        setStatusMessage('');
        return;
      }

      // Free tickets don't go through the payment gateway — the old project
      // considers `freeTicket: true` bookings done at this point.
      if (bookingResult.freeTicket) {
        showSuccessToastMessage('Booking confirmed.');
        window.location.href = `/my-bookings`;
        return;
      }

      setStatusMessage('Confirming booking...');
      const confirmResult = await confirmBooking.mutateAsync({
        bookingId: bookingResult.id,
      });

      if (
        !confirmResult?.ENCDATA ||
        !confirmResult?.MERCHANTCODE ||
        !confirmResult?.SERVICEID
      ) {
        showErrorToastMessage('Payment gateway data is incomplete. Please try again.');
        setProcessing(false);
        setStatusMessage('');
        return;
      }

      setStatusMessage('Redirecting to payment gateway...');
      handlePaymentRedirect(confirmResult);
      setTimeout(() => setProcessing(false), 3000);
    } catch {
      setProcessing(false);
      setStatusMessage('');
    }
  }

  const canPay = captchaVerified && refundAccepted && termsAccepted && !processing;

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="bg-[#F5E8CC] rounded-[12px] p-4 space-y-1.5">
        <div className="text-xs font-bold text-[#2C2017] uppercase tracking-[0.5px]">
          {config.placeName}
        </div>
        <div className="text-xs text-[#7A6A58] flex gap-3 flex-wrap">
          <span>📅 {selectedDate}</span>
          <span>⏱ {asi.shiftSlot === 'F' ? 'Forenoon' : asi.shiftSlot === 'A' ? 'Afternoon' : 'Evening'}</span>
          <span>🌐 {asi.nationality?.label}</span>
        </div>
      </div>

      {/* Visitor recap */}
      <div className="space-y-1 text-xs">
        <div className="text-[10px] font-bold text-[#2C2017] uppercase tracking-[0.3px] mb-1">
          Primary Visitor
        </div>
        <div className="text-[#2C2017] font-semibold">{asi.visitor.visitorName}</div>
        <div className="text-[#7A6A58]">
          {asi.visitor.mobileNo} · {asi.visitor.email}
        </div>
        <div className="text-[#7A6A58]">
          {asi.visitor.gender} · Age {asi.visitor.age} ·{' '}
          {asi.visitor.idProofType?.label} {asi.visitor.documentNumber}
        </div>
      </div>

      {/* Ticket breakdown */}
      <div className="space-y-2">
        <div className="text-[10px] font-bold text-[#2C2017] uppercase tracking-[0.3px]">
          Tickets
        </div>
        {selectedTickets.map(({ ticketType, quantity }) => {
          const charge = ticketType.specificCharges?.[0];
          const price = charge?.totalAmount ?? charge?.amount ?? ticketType.amount ?? 0;
          return (
            <div key={ticketType.id} className="flex items-center justify-between text-sm">
              <span className="text-[#2C2017]">
                {ticketType.masterTicketTypeName} × {quantity}
              </span>
              <span className="font-semibold text-[#2C2017]">
                {formatRupees(price * quantity)}
              </span>
            </div>
          );
        })}
        {asi.childCount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#7A6A58]">
              Children × {asi.childCount} <span className="text-[10px]">(under 15)</span>
            </span>
            <span className="text-green-700 font-semibold">Free</span>
          </div>
        )}
        <div className="flex items-center justify-between pt-2 border-t-2 border-[#E8DAC5]">
          <span className="font-bold text-[#2C2017]">Total Payable</span>
          <span className="text-lg font-bold text-[#E8631A]">{formatRupees(total)}</span>
        </div>
        <div className="text-[10px] text-[#7A6A58]">
          {adultCount} adult{adultCount > 1 ? 's' : ''}
          {asi.childCount > 0 ? ` + ${asi.childCount} child${asi.childCount > 1 ? 'ren' : ''}` : ''}
        </div>
      </div>

      {/* Captcha */}
      <div>
        <div className="text-[10px] font-bold text-[#2C2017] uppercase tracking-[0.3px] mb-2">
          Security Check
        </div>
        <div className="flex items-center gap-2">
          <div
            className="flex-1 px-4 py-3 text-center font-bold tracking-[6px] select-none rounded-[10px] border-2 border-[#E8DAC5]"
            style={{
              background:
                'repeating-linear-gradient(45deg, #FFF5EE, #FFF5EE 8px, #F5E8CC 8px, #F5E8CC 16px)',
              letterSpacing: 6,
              fontFamily: 'monospace',
              color: '#2C2017',
              fontSize: 20,
              textDecoration: 'line-through',
            }}
          >
            {captchaText}
          </div>
          <button
            onClick={refreshCaptcha}
            type="button"
            className="w-10 h-10 rounded-full border-2 border-[#E8DAC5] flex items-center justify-center hover:border-[#E8631A]"
            aria-label="Refresh captcha"
            title="Refresh"
          >
            ↻
          </button>
        </div>
        <input
          type="text"
          value={captchaInput}
          onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
          placeholder="Type the code above"
          maxLength={captchaText.length}
          className={`mt-2 w-full px-3 py-2 border rounded-[8px] text-sm focus:outline-none ${
            captchaInput && !captchaVerified
              ? 'border-red-400 focus:border-red-500'
              : captchaVerified
                ? 'border-green-500 focus:border-green-600'
                : 'border-[#E8DAC5] focus:border-[#E8631A]'
          }`}
        />
        {captchaInput && !captchaVerified && (
          <div className="text-[10px] text-red-500 mt-1">Captcha does not match.</div>
        )}
      </div>

      {/* Terms */}
      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={refundAccepted}
          onChange={(e) => setRefundAccepted(e.target.checked)}
          className="mt-0.5 accent-[#E8631A]"
        />
        <span className="text-xs text-[#7A6A58] leading-relaxed">
          I have read and accept the{' '}
          <a
            href="/refund-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E8631A] underline"
          >
            Refund Policy
          </a>
          .
        </span>
      </label>
      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="mt-0.5 accent-[#E8631A]"
        />
        <span className="text-xs text-[#7A6A58] leading-relaxed">
          I agree to the{' '}
          <a
            href="/terms-and-conditions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E8631A] underline"
          >
            Terms &amp; Conditions
          </a>{' '}
          and confirm that the visitor details are correct.
        </span>
      </label>

      {/* Processing indicator */}
      {processing && (
        <div className="flex items-center gap-2 text-sm text-[#E8631A] bg-[#FFF5EE] px-4 py-3 rounded-[10px]">
          <div className="w-4 h-4 border-2 border-[#E8631A]/30 border-t-[#E8631A] rounded-full animate-spin" />
          <span>{statusMessage || 'Processing...'}</span>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={processing}
          className="flex-1 py-3 border-2 border-[#E8DAC5] text-[#2C2017] font-semibold rounded-full hover:bg-[#F5E8CC] disabled:opacity-40"
        >
          ← Back
        </button>
        <button
          onClick={handlePay}
          disabled={!canPay}
          className="flex-1 py-3 bg-[#E8631A] text-white font-bold rounded-full hover:bg-[#C04E0A] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {processing ? 'Processing...' : `Pay ${formatRupees(total)} →`}
        </button>
      </div>
    </div>
  );
}
