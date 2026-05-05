'use client';

import { useEffect, useState } from 'react';
import { GetDownloadTicket } from '@/services/apiCalls/booking.services';
import { printBoardingPass } from '@/utils/printBoardingPass.utils';
import { showErrorToastMessage } from '@/utils/toast.utils';

/**
 * "Boarding Pass" tab on inventory place-detail pages.
 *
 * Mirrors the old project's BordingPass popup: the user enters their booking
 * ID and the last 4 digits of the ID card used during booking, and we look
 * the boarding pass up via /booking/getTouristTicketByDocument and render it
 * in the standard print popup.
 */
export default function BoardingPassTab({ placeName }: { placeName: string }) {
  const [bookingId, setBookingId] = useState('');
  const [identification, setIdentification] = useState('');
  const [bookingIdTouched, setBookingIdTouched] = useState(false);
  const [identificationTouched, setIdentificationTouched] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);

  const trimmedId = bookingId.trim();
  const trimmedAuth = identification.trim();

  const bookingIdError =
    trimmedId.length === 0
      ? 'Booking Id is required'
      : trimmedId.length < 13 || trimmedId.length > 20
        ? 'Booking Id must be correct'
        : '';
  const identificationError =
    trimmedAuth.length === 0
      ? 'Identification is required'
      : trimmedAuth.length !== 4
        ? 'Identification must be exactly 4 digits'
        : '';
  const isValid = !bookingIdError && !identificationError;

  const { data, isFetching } = GetDownloadTicket(
    trimmedId,
    trimmedAuth,
    shouldFetch && isValid,
  );

  useEffect(() => {
    if (!shouldFetch || !data?.result) return;
    setShouldFetch(false);
    const passes =
      data.result.boardingPassDetailDtos ??
      data.result.ticketBookingDetailDtos ??
      [];
    const pass = passes[0] ?? data.result;
    if (!pass) {
      showErrorToastMessage('Boarding pass not available for this booking');
      return;
    }
    if (!pass.boardingPassId && !passes.length) {
      showErrorToastMessage('Boarding pass not yet generated for this booking');
      return;
    }
    printBoardingPass(pass);
    // Clear the form so the user can pull another pass.
    setBookingId('');
    setIdentification('');
    setBookingIdTouched(false);
    setIdentificationTouched(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.result, shouldFetch]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBookingIdTouched(true);
    setIdentificationTouched(true);
    if (!isValid) return;
    setShouldFetch(true);
  }

  return (
    <div className="max-w-xl">
      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: '#2C2017',
          marginBottom: 6,
        }}
      >
        Download Boarding Pass
      </h3>
      <p style={{ fontSize: 12, color: '#7A6A58', marginBottom: 12 }}>
        Available before 1 hour of shift start. Boarding passes are issued by
        the forest department after vehicle / guide allocation.
      </p>

      <div
        style={{
          background: '#FFF5EE',
          border: '1px solid #F5D2B5',
          borderRadius: 10,
          padding: 12,
          fontSize: 11,
          color: '#5A2D10',
          lineHeight: 1.5,
          marginBottom: 16,
        }}
      >
        <strong>Note </strong>
        <span style={{ color: '#dc2626' }}>*</span> The ID proof produced at
        the time of collecting the boarding pass should be the same ID used
        while booking the online permit. Failing this, the permit will be
        deemed fake and liable to be cancelled. Please carry the original ID
        or a DigiLocker copy during the visit.
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label
            style={{
              display: 'block',
              fontSize: 11,
              fontWeight: 600,
              color: '#2C2017',
              marginBottom: 4,
            }}
          >
            Enter Booking Request Id
          </label>
          <input
            type="text"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            onBlur={() => setBookingIdTouched(true)}
            placeholder="Enter Booking Id"
            maxLength={20}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #E8DAC5',
              borderRadius: 8,
              fontSize: 14,
              outline: 'none',
            }}
          />
          {bookingIdTouched && bookingIdError && (
            <p style={{ fontSize: 11, color: '#dc2626', marginTop: 4 }}>
              {bookingIdError}
            </p>
          )}
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontSize: 11,
              fontWeight: 600,
              color: '#2C2017',
              marginBottom: 4,
            }}
          >
            Enter any one member&apos;s last 4 digits (Voter, Aadhar Id, etc.)
            <span style={{ color: '#dc2626', marginLeft: 2 }}>*</span>
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={identification}
            onChange={(e) => setIdentification(e.target.value.replace(/\D/g, ''))}
            onBlur={() => setIdentificationTouched(true)}
            placeholder="Last 4 digits"
            maxLength={4}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #E8DAC5',
              borderRadius: 8,
              fontSize: 14,
              outline: 'none',
            }}
          />
          {identificationTouched && identificationError && (
            <p style={{ fontSize: 11, color: '#dc2626', marginTop: 4 }}>
              {identificationError}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid || isFetching}
          style={{
            marginTop: 8,
            width: '100%',
            padding: '12px 16px',
            background: !isValid || isFetching ? '#d1d5db' : '#E8631A',
            color: '#fff',
            fontWeight: 700,
            fontSize: 14,
            borderRadius: 999,
            border: 'none',
            cursor: !isValid || isFetching ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s ease',
          }}
        >
          {isFetching ? 'Fetching boarding pass…' : `Download ${placeName ? placeName + ' ' : ''}Boarding Pass`}
        </button>
      </form>
    </div>
  );
}
