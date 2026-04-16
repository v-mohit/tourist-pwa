'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth/context/AuthContext';

export default function MyBookingsPage() {
  const { user, openLoginModal } = useAuth();

  type BookingStatus = 'upcoming' | 'completed' | 'cancelled' | 'confirmed';
  type TabKey = 'all' | 'upcoming' | 'completed' | 'cancelled';
  type DateFilterType = 'visit' | 'booking';

  type Booking = {
    id: string;
    name: string;
    location: string;
    city: string;
    state: string;
    image: string;
    status: BookingStatus;
    visitDateLabel: string; // "18 Apr 2026"
    slotLabel?: string; // "10:00 AM"
    visitors: number;
    tickets: { type: string; count: number }[];
    totalPaid: number;
    bookedOnLabel: string; // "10 Apr 2026"
    refundable?: boolean;
  };

  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilterOpen, setDateFilterOpen] = useState(false);
  const [dateType, setDateType] = useState<DateFilterType | ''>('');
  const [dateValue, setDateValue] = useState<string>('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const demoBookings: Booking[] = useMemo(
    () => [
      {
        id: 'RJ2024001',
        name: 'Amber Fort',
        location: 'Jaipur, Rajasthan',
        city: 'Jaipur',
        state: 'Rajasthan',
        image:
          'https://images.unsplash.com/photo-1477587458883-47145ed31f5e?w=400&auto=format&fit=crop&q=80',
        status: 'upcoming',
        visitDateLabel: '18 Apr 2026',
        slotLabel: '10:00 AM',
        visitors: 4,
        tickets: [
          { type: 'Adult', count: 2 },
          { type: 'Child', count: 1 },
          { type: 'Foreign', count: 1 },
        ],
        totalPaid: 600,
        bookedOnLabel: '10 Apr 2026',
        refundable: true,
      },
      {
        id: 'RJ2024002',
        name: 'Mehrangarh Fort',
        location: 'Jodhpur, Rajasthan',
        city: 'Jodhpur',
        state: 'Rajasthan',
        image:
          'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&auto=format&fit=crop&q=80',
        status: 'confirmed',
        visitDateLabel: '25 Apr 2026',
        slotLabel: '9:00 AM',
        visitors: 2,
        tickets: [{ type: 'Adult', count: 2 }],
        totalPaid: 200,
        bookedOnLabel: '11 Apr 2026',
        refundable: true,
      },
      {
        id: 'RJ2024003',
        name: 'Hawa Mahal',
        location: 'Jaipur, Rajasthan',
        city: 'Jaipur',
        state: 'Rajasthan',
        image:
          'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=400&auto=format&fit=crop&q=80',
        status: 'completed',
        visitDateLabel: '5 Mar 2026',
        visitors: 3,
        tickets: [
          { type: 'Adult', count: 2 },
          { type: 'Child', count: 1 },
        ],
        totalPaid: 150,
        bookedOnLabel: '1 Mar 2026',
        refundable: false,
      },
      {
        id: 'RJ2024005',
        name: 'Nahargarh Fort',
        location: 'Jaipur, Rajasthan',
        city: 'Jaipur',
        state: 'Rajasthan',
        image:
          'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&auto=format&fit=crop&q=80',
        status: 'cancelled',
        visitDateLabel: '20 Jan 2026',
        visitors: 2,
        tickets: [{ type: 'Adult', count: 2 }],
        totalPaid: 100,
        bookedOnLabel: '18 Jan 2026',
        refundable: false,
      },
    ],
    [],
  );

  const effectiveBookings = demoBookings;

  const selectedBooking = useMemo(() => {
    if (!selectedBookingId) return null;
    return effectiveBookings.find((b) => b.id === selectedBookingId) || null;
  }, [effectiveBookings, selectedBookingId]);

  const filteredBookings = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const wantedTab = activeTab;

    return effectiveBookings.filter((b) => {
      const tabOk =
        wantedTab === 'all'
          ? true
          : wantedTab === 'upcoming'
            ? b.status === 'upcoming' || b.status === 'confirmed'
            : b.status === wantedTab;
      if (!tabOk) return false;

      const searchOk = !q || b.id.toLowerCase().includes(q) || b.name.toLowerCase().includes(q);
      if (!searchOk) return false;

      if (dateType && dateValue) {
        // Minimal matching by formatted label (kept intentionally simple).
        // If needed we can map to real dates once API fields are confirmed.
        const label = dateType === 'visit' ? b.visitDateLabel : b.bookedOnLabel;
        if (!label.toLowerCase().includes(dateValue)) return false;
      }

      return true;
    });
  }, [effectiveBookings, activeTab, searchTerm, dateType, dateValue]);

  const stats = useMemo(() => {
    const total = effectiveBookings.length;
    const upcoming = effectiveBookings.filter((b) => b.status === 'upcoming' || b.status === 'confirmed').length;
    const completed = effectiveBookings.filter((b) => b.status === 'completed').length;
    const cancelled = effectiveBookings.filter((b) => b.status === 'cancelled').length;
    const spent = effectiveBookings
      .filter((b) => b.status !== 'cancelled')
      .reduce((sum, b) => sum + (b.totalPaid || 0), 0);
    return { total, upcoming, completed, cancelled, spent };
  }, [effectiveBookings]);

  const openDrawer = (id: string) => {
    setSelectedBookingId(id);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const closeDateFilter = () => {
    setDateFilterOpen(false);
    setDateType('');
    setDateValue('');
  };

  return (
    <div className="page">
      {!user ? (
        <div className="empty-state">
          <div className="empty-icon">🎟</div>
          <div className="empty-title">Login to view bookings</div>
          <div className="empty-sub">
            Please login to see your booking history and download tickets.
          </div>
          <button className="btn-p" onClick={openLoginModal}>
            Login →
          </button>
        </div>
      ) : (
        <>
          <div className="notice-bar">
            <span>✅</span>
            You have {stats.upcoming} upcoming visits. Check your tickets below.
          </div>

          <div className="page-header">
            <div className="breadcrumb" style={{ padding: '0 0 14px 0' }}>
              <Link href="/">Home</Link>
              <span>›</span>
              <span>My Bookings</span>
            </div>

            <div className="page-header-top">
              <div>
                <h1>My Bookings</h1>
                <p>View and manage all your ticket reservations across Rajasthan</p>
              </div>

              <div className="header-actions">
                <div className="filter-bar">
                  <div className="search-input-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search by Booking ID…"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <button className="filter-btn" onClick={() => setDateFilterOpen(true)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                    </svg>
                    Filter By Date
                  </button>
                </div>
              </div>
            </div>

            <div className="tabs-row">
              <button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
                All Bookings
              </button>
              <button className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')}>
                Upcoming
              </button>
              <button className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => setActiveTab('completed')}>
                Completed
              </button>
              <button className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`} onClick={() => setActiveTab('cancelled')}>
                Cancelled
              </button>
            </div>
          </div>

          <div className="stats-strip">
            <div className="stats-strip-item">
              <div className="ssi-num">{stats.total}</div>
              <div className="ssi-lbl">Total Bookings</div>
            </div>
            <div className="stats-strip-item">
              <div className="ssi-num orange">{stats.upcoming}</div>
              <div className="ssi-lbl">Upcoming</div>
            </div>
            <div className="stats-strip-item">
              <div className="ssi-num green">{stats.completed}</div>
              <div className="ssi-lbl">Completed</div>
            </div>
            <div className="stats-strip-item">
              <div className="ssi-num red">{stats.cancelled}</div>
              <div className="ssi-lbl">Cancelled</div>
            </div>
            <div className="stats-strip-item">
              <div className="ssi-num">₹{stats.spent}</div>
              <div className="ssi-lbl">Total Spent</div>
            </div>
          </div>

          <div className="bookings-body">
            <div className="section-label">
              {activeTab === 'all'
                ? 'All Bookings'
                : activeTab === 'upcoming'
                  ? 'Upcoming Visits'
                  : activeTab === 'completed'
                    ? 'Completed Visits'
                    : 'Cancelled'}
            </div>

            {filteredBookings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎫</div>
                <div className="empty-title">No Bookings Found</div>
                <div className="empty-sub">No tickets match your filter. Try changing filters.</div>
                <button
                  className="btn-p"
                  onClick={() => {
                    setSearchTerm('');
                    setActiveTab('all');
                    setDateType('');
                    setDateValue('');
                  }}
                >
                  View All Bookings
                </button>
              </div>
            ) : (
              filteredBookings.map((b) => {
                const statusLabel =
                  b.status === 'confirmed'
                    ? '✅ Confirmed'
                    : b.status === 'upcoming'
                      ? '🔵 Upcoming'
                      : b.status === 'completed'
                        ? '✔ Completed'
                        : '✕ Cancelled';
                const statusClass =
                  b.status === 'confirmed'
                    ? 'status-confirmed'
                    : b.status === 'upcoming'
                      ? 'status-upcoming'
                      : b.status === 'completed'
                        ? 'status-completed'
                        : 'status-cancelled';

                return (
                  <div
                    key={b.id}
                    className="booking-card"
                    onClick={() => openDrawer(b.id)}
                  >
                    <div className="booking-card-inner">
                      <div
                        className="booking-img"
                        style={{
                          backgroundImage: `url('${b.image}')`,
                          ...(b.status === 'cancelled' ? { filter: 'grayscale(.6)' } : {}),
                        }}
                      >
                        <div className="booking-img-overlay" />
                      </div>

                      <div className="booking-main">
                        <div className="booking-top">
                          <span className="booking-id">{b.id}</span>
                          <span className={`booking-status ${statusClass}`}>{statusLabel}</span>
                        </div>
                        <div className="booking-name">{b.name}</div>
                        <div className="booking-loc">
                          <img src="/icons/google-maps.png" width={12} height={12} alt="Location" className="loc-ico mr-1" />
                          {b.location}
                        </div>

                        <div className="booking-meta">
                          <div className="bm-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            {b.status === 'completed' ? 'Visited:' : 'Visit Date:'}{' '}
                            <span>{b.visitDateLabel}</span>
                          </div>
                          {b.slotLabel ? (
                            <div className="bm-item">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              Slot: <span>{b.slotLabel}</span>
                            </div>
                          ) : null}
                          <div className="bm-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            Visitors: <span>{b.visitors}</span>
                          </div>
                        </div>

                        <div className="booking-tickets">
                          {b.tickets.map((t) => (
                            <div key={`${b.id}-${t.type}`} className="tkt">
                              <span className="tkt-icon">🎟</span>
                              {t.type} × {t.count}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="booking-side">
                        <div className="booking-price-wrap">
                          <div className="booking-price-lbl">
                            {b.status === 'cancelled' ? 'Refunded' : 'Total Paid'}
                          </div>
                          <div
                            className="booking-price"
                            style={b.status === 'cancelled' ? { color: 'var(--mu)' } : undefined}
                          >
                            ₹{b.totalPaid}
                          </div>
                          <div className="booking-price-sub">
                            {b.status === 'completed' ? 'Visited' : 'Booked'} {b.bookedOnLabel}
                          </div>
                        </div>

                        <div className="booking-actions">
                          <button
                            className="bc-btn bc-btn-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDrawer(b.id);
                            }}
                          >
                            View Ticket
                          </button>
                          <button
                            className="bc-btn bc-btn-outline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Download
                          </button>
                          {b.status !== 'completed' && b.status !== 'cancelled' ? (
                            <button
                              className="bc-btn bc-btn-ghost"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Cancel
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Date Filter Modal */}
          <div className={`modal-overlay ${dateFilterOpen ? 'open' : ''}`} onClick={(e) => {
            if (e.target === e.currentTarget) closeDateFilter();
          }}>
            <div className="modal" role="dialog" aria-modal="true" aria-label="Filter By Date">
              <div className="modal-header">
                <div className="modal-title">Filter By Date</div>
                <button className="modal-close" onClick={closeDateFilter} aria-label="Close">
                  ✕
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">
                    Select Date Type <span className="req">*</span>
                  </label>
                  <div className="select-wrap">
                    <select
                      className="form-select"
                      value={dateType}
                      onChange={(e) => setDateType(e.target.value as any)}
                    >
                      <option value="" disabled>
                        Select Date Type
                      </option>
                      <option value="visit">Visit Date</option>
                      <option value="booking">Booking Date</option>
                    </select>
                  </div>
                </div>

                {dateType ? (
                  <div className="form-group">
                    <label className="form-label">
                      {dateType === 'visit' ? 'Select Visit Date' : 'Select Booking Date'}
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      value={dateValue}
                      onChange={(e) => setDateValue(e.target.value)}
                    />
                  </div>
                ) : null}
              </div>
              <div className="modal-footer">
                <button className="btn-modal-close" onClick={closeDateFilter}>
                  CLOSE
                </button>
                <button
                  className="btn-modal-confirm"
                  onClick={() => setDateFilterOpen(false)}
                  disabled={!dateType || !dateValue}
                >
                  CONFIRM
                </button>
              </div>
            </div>
          </div>

          {/* Ticket Drawer */}
          <div
            className={`drawer-overlay ${drawerOpen ? 'open' : ''}`}
            onClick={(e) => {
              if (e.target === e.currentTarget) closeDrawer();
            }}
          >
            <div className="drawer-panel">
              <div className="drawer-close-bar">
                <button className="drawer-close-btn" onClick={closeDrawer} aria-label="Close">
                  ✕
                </button>
                <span className="drawer-close-title">Booking Details</span>
              </div>

              {selectedBooking ? (
                <div>
                  <div
                    className="drawer-img"
                    style={{ backgroundImage: `url('${selectedBooking.image}')` }}
                  >
                    <div className="drawer-img-grad" />
                    <div className="drawer-img-foot">
                      <h2>{selectedBooking.name}</h2>
                      <p>
                        <img src="/icons/google-maps.png" width={12} height={12} alt="Location" className="loc-ico mr-1" />
                        {selectedBooking.city}, {selectedBooking.state}
                      </p>
                    </div>
                  </div>

                  <div className="drawer-content">
                    <div className="ticket-card">
                      <div className="ticket-header">
                        <div>
                          <h3>🎫 Official Entry Ticket</h3>
                          <p>Government of Rajasthan — OBMS</p>
                        </div>
                        <div className="ticket-qr">📲</div>
                      </div>
                      <div className="ticket-divider">
                        <div className="ticket-divider-circle" style={{ marginLeft: -9 }} />
                        <div className="ticket-divider-line" />
                        <div className="ticket-divider-circle" style={{ marginRight: -9 }} />
                      </div>
                      <div className="ticket-body">
                        <div className="ticket-row">
                          <div className="ticket-field">
                            <div className="ticket-field-lbl">Booking ID</div>
                            <div className="ticket-field-val">{selectedBooking.id}</div>
                          </div>
                          <div className="ticket-field">
                            <div className="ticket-field-lbl">Status</div>
                            <div className="ticket-field-val">
                              <span className="booking-status status-upcoming" style={{ fontSize: 11 }}>
                                {selectedBooking.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="ticket-row">
                          <div className="ticket-field">
                            <div className="ticket-field-lbl">Visit Date</div>
                            <div className="ticket-field-val">{selectedBooking.visitDateLabel}</div>
                          </div>
                          <div className="ticket-field">
                            <div className="ticket-field-lbl">Time Slot</div>
                            <div className="ticket-field-val">{selectedBooking.slotLabel || '—'}</div>
                          </div>
                        </div>

                        <div style={{ marginBottom: 10 }}>
                          <div className="ticket-field-lbl" style={{ marginBottom: 6 }}>
                            Visitors
                          </div>
                          <div className="ticket-visitors">
                            {selectedBooking.tickets.map((t) => (
                              <div key={`${selectedBooking.id}-${t.type}`} className="visitor-badge">
                                🎟 {t.type} × {t.count}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="ticket-total-bar">
                        <span className="ttb-lbl">Total Amount Paid</span>
                        <span className="ttb-val">₹{selectedBooking.totalPaid}</span>
                      </div>
                    </div>

                    <div className="drawer-actions">
                      <button className="btn-drawer btn-drawer-primary">📥 Download Ticket PDF</button>
                      <button className="btn-drawer btn-drawer-outline">📤 Share Ticket</button>
                      {selectedBooking.status !== 'completed' && selectedBooking.status !== 'cancelled' ? (
                        <button className="btn-drawer btn-drawer-danger">✕ Cancel Booking</button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🎫</div>
                  <div className="empty-title">No Booking Selected</div>
                  <div className="empty-sub">Select a booking to view details.</div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
