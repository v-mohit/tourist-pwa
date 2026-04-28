'use client';

import moment from 'moment-timezone';

interface Props {
  booking: any;
  onOpen: (b: any) => void;
  onRaiseIssue: (b: any) => void;
}

function formatDate(ts?: number | string): string {
  if (!ts) return '—';
  return moment(ts).format('DD MMM YYYY');
}

function getStatus(b: any): { label: string; cls: string } {
  if (b.cancelled || b.refund) return { label: '✕ Cancelled', cls: 'status-cancelled' };
  const paid = String(b?.paymentStatus || '').toLowerCase().includes('success');
  if (!paid) return { label: '⚠ Failed', cls: 'status-cancelled' };
  const endDate = b?.bookingEndDate ?? b?.bookingStartDate;
  if (endDate && endDate < Date.now()) return { label: '✔ Completed', cls: 'status-completed' };
  return { label: '✅ Confirmed', cls: 'status-confirmed' };
}

/**
 * Booking card for IGPRGVS guest-house reservations. The data shape here is distinct
 * from regular monument/ASI bookings:
 *   - visit window uses bookingStartDate / bookingEndDate
 *   - rooms are billed per-night, so we surface capacity, days, and totalGuest
 *   - ticketHeads[] is a flat list of charge-line items (room rent, cleaning, tax, …)
 *   - no shiftName, no zoneName, no ticketUserDto
 */
export default function IgprsBookingCard({ booking: b, onOpen, onRaiseIssue }: Props) {
  const status = getStatus(b);
  const placeName = b.placeName || b.categoryName || 'IGPRGVS Booking';
  const bookingId = b.bookingId || b.id;
  const startStr = formatDate(b.bookingStartDate);
  const endStr = b.bookingEndDate ? formatDate(b.bookingEndDate) : '';
  const dateRange = endStr && endStr !== startStr ? `${startStr} → ${endStr}` : startStr;
  const isPaid = String(b?.paymentStatus || '').toLowerCase().includes('success');
  const ticketHeads: any[] = Array.isArray(b.ticketHeads) ? b.ticketHeads : [];

  return (
    <div className="booking-card" onClick={() => onOpen(b)}>
      <div className="booking-card-inner">
        <div
          className="booking-img"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80')`,
            ...(b.cancelled || b.refund ? { filter: 'grayscale(.6)' } : {}),
          }}
        >
          <div className="booking-img-overlay" />
        </div>

        <div className="booking-main">
          <div className="booking-top">
            <span className="booking-id">#{bookingId}</span>
            <span className={`booking-status ${status.cls}`}>{status.label}</span>
          </div>
          <div className="booking-name">{placeName}</div>
          <div className="booking-loc">
            <span style={{ fontSize: 10, color: '#E8631A', fontWeight: 700, letterSpacing: 0.5 }}>
              GUEST HOUSE
            </span>
          </div>
          <div className="booking-meta">
            <div className="bm-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Stay: <span>{dateRange}</span>
            </div>
            <div className="bm-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              Guests: <span>{b.totalGuest ?? '—'}</span>
            </div>
            {b.capacity != null && (
              <div className="bm-item">🛏 Capacity: <span>{b.capacity}</span></div>
            )}
            {b.days != null && (
              <div className="bm-item">📅 Nights: <span>{b.days}</span></div>
            )}
          </div>
          {ticketHeads.length > 0 && (
            <div className="booking-tickets">
              {ticketHeads.slice(0, 4).map((t: any, i: number) => (
                <div key={i} className="tkt">
                  <span className="tkt-icon">🏷</span>
                  {t.name || t.masterTicketTypeName || 'Charge'}
                  {t.amount ? ` · ₹${t.amount}` : ''}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="booking-side">
          <div className="booking-price-wrap">
            <div className="booking-price-lbl">
              {b.cancelled || b.refund ? 'Refunded' : 'Total Paid'}
            </div>
            <div
              className="booking-price"
              style={b.cancelled || b.refund ? { color: 'var(--mu)' } : undefined}
            >
              ₹{b.totalAmount || 0}
            </div>
            <div className="booking-price-sub">Booked {formatDate(b.createdDate)}</div>
          </div>
          <div className="booking-actions">
            {isPaid && !b.cancelled && !b.refund && (
              <button
                className="bc-btn bc-btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen(b);
                }}
              >
                View Reservation
              </button>
            )}
            <button
              className="bc-btn bc-btn-ghost"
              style={{ color: '#7A6A58' }}
              onClick={(e) => {
                e.stopPropagation();
                onRaiseIssue(b);
              }}
            >
              🛟 Raise Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
