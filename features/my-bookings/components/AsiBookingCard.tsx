'use client';

import moment from 'moment-timezone';

interface Props {
  booking: any;
  onOpen: (b: any) => void;
  onRaiseIssue: (b: any) => void;
  onDownload: (b: any) => void;
  pdfGenerating: string;
}

function formatDate(ts?: number | string): string {
  if (!ts) return '—';
  return moment(ts).format('DD MMM YYYY');
}

function getStatus(b: any): { label: string; cls: string } {
  if (b.cancelled || b.refund) return { label: '✕ Cancelled', cls: 'status-cancelled' };
  const paid = String(b?.paymentStatus || '').toLowerCase().includes('success');
  if (!paid) return { label: '⚠ Failed', cls: 'status-cancelled' };
  if (b.bookingDate && b.bookingDate < Date.now()) {
    return { label: '✔ Completed', cls: 'status-completed' };
  }
  return { label: '✅ Confirmed', cls: 'status-confirmed' };
}

/**
 * Booking card for ASI (Archaeological Survey of India) monuments. The data shape
 * is close to regular monument bookings but carries `asiTicketDto` with the
 * adult / child breakdown that's specific to ASI ticketing.
 */
export default function AsiBookingCard({
  booking: b,
  onOpen,
  onRaiseIssue,
  onDownload,
  pdfGenerating,
}: Props) {
  const status = getStatus(b);
  const placeName =
    b.placeName || b.placeDetailDto?.name || 'ASI Monument';
  const district = b.placeDetailDto?.districtName || '';
  const bookingId = String(b.bookingId || b.id);
  const isPaid = String(b?.paymentStatus || '').toLowerCase().includes('success');
  const adultCount = b?.asiTicketDto?.adultCount ?? b?.adultCount ?? 0;
  const childCount = b?.asiTicketDto?.childCount ?? b?.childCount ?? 0;
  const totalUsers =
    b.totalUsers ||
    adultCount + childCount ||
    (b.ticketUserDto?.reduce((s: number, t: any) => s + (t.qty || 0), 0)) ||
    0;
  const isGen = pdfGenerating === bookingId;

  return (
    <div className="booking-card" onClick={() => onOpen(b)}>
      <div className="booking-card-inner">
        <div
          className="booking-img"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop&q=80')`,
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
              ASI MONUMENT
            </span>
            {district && <span style={{ marginLeft: 8 }}>· {district}</span>}
          </div>
          <div className="booking-meta">
            <div className="bm-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Visit Date: <span>{formatDate(b.bookingDate)}</span>
            </div>
            {(b.shiftName || b.shiftDto?.name || b?.asiTicketDto?.slot) && (
              <div className="bm-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Shift: <span>{b.shiftName || b.shiftDto?.name || b?.asiTicketDto?.slot}</span>
              </div>
            )}
            <div className="bm-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              Visitors: <span>{totalUsers}</span>
            </div>
            {(adultCount > 0 || childCount > 0) && (
              <div className="bm-item">
                👨‍👩‍👧 Adults: <span>{adultCount}</span>
                {childCount > 0 && <> · Children: <span>{childCount}</span></>}
              </div>
            )}
          </div>
          {Array.isArray(b.ticketUserDto) && b.ticketUserDto.length > 0 && (
            <div className="booking-tickets">
              {b.ticketUserDto.slice(0, 4).map((t: any, i: number) => (
                <div key={i} className="tkt">
                  <span className="tkt-icon">🎟</span>
                  {t.ticketName} × {t.qty}
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
              <>
                <button
                  className="bc-btn bc-btn-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen(b);
                  }}
                >
                  View Ticket
                </button>
                <button
                  className="bc-btn bc-btn-outline"
                  disabled={isGen}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload(b);
                  }}
                >
                  {isGen ? '⏳ Generating...' : '📥 Download'}
                </button>
              </>
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
