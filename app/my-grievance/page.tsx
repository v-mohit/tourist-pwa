'use client';

import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';

type GrievanceStatus = 'ongoing' | 'resolved' | 'cancelled';

type GrievanceMessage = {
  from: 'support' | 'user';
  text: string;
  time: string;
};

type GrievanceUser = {
  name: string;
  email: string;
  mobile: string;
};

type Grievance = {
  id: string;
  issueType: string;
  ticketNo: string;
  bookingNo: string;
  raisedAt: string;
  status: GrievanceStatus;
  badgeClass: string;
  badgeLabel: string;
  subject: string;
  description: string;
  user: GrievanceUser;
  attachment: string | null;
  chatStatus: string;
  messages: GrievanceMessage[];
};

type GrievanceGroups = {
  ongoing: Grievance[];
  resolved: Grievance[];
  cancelled: Grievance[];
};

type DetailSectionKey = 'user' | 'description' | 'attachment';

const initialGrievances: GrievanceGroups = {
  ongoing: [
    {
      id: 'GRV-2024-007',
      issueType: 'URGENT',
      ticketNo: '7823041290',
      bookingNo: 'RJ2024001',
      raisedAt: '12/04/2026 9:15:30 AM',
      status: 'ongoing',
      badgeClass: 'badge-ongoing',
      badgeLabel: '🟠 Ongoing',
      subject: 'Ticket not received after payment',
      description:
        'I completed the payment for Amber Fort ticket on 12 April 2026 but have not received any confirmation email or ticket. Transaction ID: TXN89201234.',
      user: {
        name: 'PANKAJ GURJAR',
        email: 'pankaj.gurjar@yatra.com',
        mobile: '6350548682',
      },
      attachment: 'payment_screenshot.png',
      chatStatus: 'Scheduled',
      messages: [
        {
          from: 'support',
          text: 'Hello Pankaj! Thank you for reaching out. We have received your complaint regarding ticket delivery for Amber Fort.',
          time: '9:20 AM',
        },
        {
          from: 'user',
          text: 'Yes, I made the payment but the ticket never arrived. Please help.',
          time: '9:22 AM',
        },
        {
          from: 'support',
          text: 'We are investigating this issue. Could you please share the transaction ID?',
          time: '9:25 AM',
        },
        {
          from: 'user',
          text: 'Transaction ID is TXN89201234',
          time: '9:27 AM',
        },
      ],
    },
  ],
  resolved: [
    {
      id: 'GRV-2024-003',
      issueType: 'NORMAL',
      ticketNo: '4591680841',
      bookingNo: 'N/A',
      raisedAt: '04/07/2024 12:02:20 PM',
      status: 'resolved',
      badgeClass: 'badge-resolved',
      badgeLabel: '✅ Resolved',
      subject: 'Images are not correct',
      description: 'Images are not correct',
      user: {
        name: 'PANKAJ GURJAR',
        email: 'pankaj.gurjar@yatra.com',
        mobile: '6350548682',
      },
      attachment: 'Screenshot 2024-06-26 110849.png',
      chatStatus: 'Resolved',
      messages: [],
    },
    {
      id: 'GRV-2024-001',
      issueType: 'NORMAL',
      ticketNo: '3310294877',
      bookingNo: 'RJ2024003',
      raisedAt: '01/03/2026 10:44:00 AM',
      status: 'resolved',
      badgeClass: 'badge-resolved',
      badgeLabel: '✅ Resolved',
      subject: 'Refund not processed for cancelled booking',
      description:
        'I cancelled my booking for Hawa Mahal on 28 Feb 2026 but the refund has not been credited to my bank account after 3 days.',
      user: {
        name: 'PANKAJ GURJAR',
        email: 'pankaj.gurjar@yatra.com',
        mobile: '6350548682',
      },
      attachment: null,
      chatStatus: 'Resolved',
      messages: [
        {
          from: 'support',
          text: 'Your refund of ₹150 has been processed. It will reflect in 2–3 working days.',
          time: '11:00 AM',
        },
        {
          from: 'user',
          text: 'Thank you, received it.',
          time: '3:30 PM',
        },
      ],
    },
  ],
  cancelled: [
    {
      id: 'GRV-2024-005',
      issueType: 'NORMAL',
      ticketNo: '6012839451',
      bookingNo: 'N/A',
      raisedAt: '15/01/2026 4:55:00 PM',
      status: 'cancelled',
      badgeClass: 'badge-cancelled',
      badgeLabel: '✕ Cancelled',
      subject: 'General enquiry about fort timings',
      description:
        'Wanted to know the exact timing of Mehrangarh Fort for Republic Day as the website was showing different information.',
      user: {
        name: 'PANKAJ GURJAR',
        email: 'pankaj.gurjar@yatra.com',
        mobile: '6350548682',
      },
      attachment: null,
      chatStatus: 'Cancelled',
      messages: [],
    },
  ],
};

export default function MyGrievancePage() {
  const { user, openLoginModal } = useAuth();

  const [currentTab, setCurrentTab] = useState<GrievanceStatus>('resolved');
  const [grievances, setGrievances] = useState<GrievanceGroups>(initialGrievances);
  const [newQueryOpen, setNewQueryOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState<Record<string, string>>({});
  const [fileName, setFileName] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [sectionsCollapsed, setSectionsCollapsed] = useState<Record<DetailSectionKey, boolean>>({
    user: false,
    description: false,
    attachment: false,
  });

  const overlayOpen = newQueryOpen || !!selectedId;

  useEffect(() => {
    if (!overlayOpen) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [overlayOpen]);

  const stats = useMemo(() => {
    const totalOngoing = grievances.ongoing.length;
    const totalResolved = grievances.resolved.length;
    const totalCancelled = grievances.cancelled.length;
    const total = totalOngoing + totalResolved + totalCancelled;
    return {
      total,
      totalOngoing,
      totalResolved,
      totalCancelled,
    };
  }, [grievances]);

  const currentList = grievances[currentTab];

  const selectedGrievance = useMemo(() => {
    if (!selectedId) {
      return null;
    }
    for (const status of ['ongoing', 'resolved', 'cancelled'] as GrievanceStatus[]) {
      const found = grievances[status].find((g) => g.id === selectedId);
      if (found) {
        return found;
      }
    }
    return null;
  }, [grievances, selectedId]);

  const handleTabChange = (tab: GrievanceStatus) => {
    setCurrentTab(tab);
  };

  const handleOpenNewQuery = () => {
    setNewQueryOpen(true);
  };

  const handleCloseNewQuery = () => {
    setNewQueryOpen(false);
    setFileName('');
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    setFileName(file ? file.name : '');
  };

  const handleOpenDrawer = (id: string) => {
    setSelectedId(id);
  };

  const handleCloseDrawer = () => {
    setSelectedId(null);
  };

  const toggleSection = (key: DetailSectionKey) => {
    setSectionsCollapsed((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSendMessage = (id: string) => {
    const text = (chatInput[id] || '').trim();
    if (!text) {
      return;
    }

    const time = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setGrievances((prev) => {
      const updateGroup = (groupKey: GrievanceStatus): Grievance[] =>
        prev[groupKey].map((g) => {
          if (g.id !== id) {
            return g;
          }
          return {
            ...g,
            messages: [
              ...g.messages,
              {
                from: 'user',
                text,
                time,
              },
            ],
          };
        });

      return {
        ongoing: updateGroup('ongoing'),
        resolved: updateGroup('resolved'),
        cancelled: updateGroup('cancelled'),
      };
    });

    setChatInput((prev) => ({
      ...prev,
      [id]: '',
    }));

    setTimeout(() => {
      setGrievances((prev) => {
        const responseTime = new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        });

        const updateGroup = (groupKey: GrievanceStatus): Grievance[] =>
          prev[groupKey].map((g) => {
            if (g.id !== id) {
              return g;
            }
            return {
              ...g,
              messages: [
                ...g.messages,
                {
                  from: 'support',
                  text: 'Thank you for your message. Our team will respond shortly.',
                  time: responseTime,
                },
              ],
            };
          });

        return {
          ongoing: updateGroup('ongoing'),
          resolved: updateGroup('resolved'),
          cancelled: updateGroup('cancelled'),
        };
      });
    }, 1200);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3500);
  };

  const handleSubmitTicket = () => {
    const now = new Date();
    const id = `GRV-${now.getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`;
    const ticketNo = String(Math.floor(Math.random() * 9000000000 + 1000000000));
    const raisedAt =
      now.toLocaleDateString('en-IN') +
      ' ' +
      now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      });

    const baseUser = {
      name: 'PANKAJ GURJAR',
      email: 'pankaj.gurjar@yatra.com',
      mobile: '6350548682',
    };

    const newGrievance: Grievance = {
      id,
      issueType: 'NORMAL',
      ticketNo,
      bookingNo: 'N/A',
      raisedAt,
      status: 'ongoing',
      badgeClass: 'badge-ongoing',
      badgeLabel: '🟠 Ongoing',
      subject: 'New Query',
      description: 'Submitted via New Query form.',
      user: baseUser,
      attachment: null,
      chatStatus: 'Scheduled',
      messages: [],
    };

    setGrievances((prev) => ({
      ...prev,
      ongoing: [...prev.ongoing, newGrievance],
    }));

    setCurrentTab('ongoing');
    setNewQueryOpen(false);
    setFileName('');
    showToast('✅ Your ticket has been submitted successfully!');
  };

  if (!user) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-title">Login to view grievances</div>
          <div className="empty-sub">
            Please login to track your support queries and complaints.
          </div>
          <button className="btn-p" onClick={openLoginModal}>
            Login →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-top">
          <div>
            <h1>My Grievance</h1>
            <p>Track and manage your support queries and complaints</p>
          </div>
          <button className="btn-p" onClick={handleOpenNewQuery}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{
                width: 15,
                height: 15,
              }}
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Query
          </button>
        </div>
      </div>

      <div className="stats-strip">
        <div className="stats-strip-item">
          <div className="ssi-num">{stats.total}</div>
          <div className="ssi-lbl">Total</div>
        </div>
        <div className="stats-strip-item">
          <div className="ssi-num orange">{stats.totalOngoing}</div>
          <div className="ssi-lbl">Ongoing</div>
        </div>
        <div className="stats-strip-item">
          <div className="ssi-num green">{stats.totalResolved}</div>
          <div className="ssi-lbl">Resolved</div>
        </div>
        <div className="stats-strip-item">
          <div className="ssi-num red">{stats.totalCancelled}</div>
          <div className="ssi-lbl">Cancelled</div>
        </div>
      </div>

      <div className="tabs-wrap">
        <button
          className={`tab-pill ${currentTab === 'ongoing' ? 'active' : ''}`}
          onClick={() => handleTabChange('ongoing')}
        >
          Ongoing
        </button>
        <button
          className={`tab-pill ${currentTab === 'resolved' ? 'active' : ''}`}
          onClick={() => handleTabChange('resolved')}
        >
          Resolved
        </button>
        <button
          className={`tab-pill ${currentTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => handleTabChange('cancelled')}
        >
          Cancelled
        </button>
      </div>

      <div className="grievances-body">
        {currentList.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <div className="empty-title">
              No {currentTab.charAt(0).toUpperCase() + currentTab.slice(1)} Queries
            </div>
            <div className="empty-sub">
              You do not have any {currentTab} grievances right now.
            </div>
            <button className="btn-p" onClick={handleOpenNewQuery}>
              New Query
            </button>
          </div>
        ) : (
          currentList.map((g) => (
            <div key={g.id} className="g-card">
              <div className="g-card-header">
                <div className="g-card-title">
                  <span>{g.subject}</span>
                </div>
                <span className={`g-badge ${g.badgeClass}`}>{g.badgeLabel}</span>
              </div>
              <div className="g-card-body">
                <div className="g-grid">
                  <div className="g-field">
                    <div className="g-field-lbl">Issue Type</div>
                    <div className="g-field-val">{g.issueType}</div>
                  </div>
                  <div className="g-field">
                    <div className="g-field-lbl">Ticket No</div>
                    <div className="g-field-val mono">{g.ticketNo}</div>
                  </div>
                  <div className="g-field">
                    <div className="g-field-lbl">Booking No</div>
                    <div className="g-field-val mono">{g.bookingNo}</div>
                  </div>
                  <div className="g-field">
                    <div className="g-field-lbl">Raised Date &amp; Time</div>
                    <div className="g-field-val">{g.raisedAt}</div>
                  </div>
                </div>
              </div>
              <div className="g-card-footer">
                <span className="g-foot-left">
                  🎫 Query ID: <strong>{g.id}</strong>
                </span>
                <div className="g-foot-right">
                  <button
                    className="btn-view-detail"
                    onClick={() => {
                      handleOpenDrawer(g.id);
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    View Details
                  </button>
                  <span className={`g-badge ${g.badgeClass}`}>{g.badgeLabel}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div
        className={`modal-overlay ${newQueryOpen ? 'open' : ''}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            handleCloseNewQuery();
          }
        }}
      >
        <div className="modal" role="dialog" aria-modal="true" aria-label="New Query">
          <div className="modal-top">
            <div className="modal-top-text">
              <h2>Welcome Guest</h2>
              <p>Please provide your information to continue</p>
            </div>
            <button
              type="button"
              className="modal-close-btn"
              onClick={handleCloseNewQuery}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="modal-body">
            <div className="section-heading">
              <div className="section-number">1</div>
              <h3>Personal Information</h3>
            </div>
            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  Mobile Number <span className="req">*</span>
                </label>
                <div className="phone-input-wrap">
                  <span className="phone-prefix">🇮🇳 IN +91</span>
                  <input
                    type="tel"
                    className="phone-input-inner"
                    placeholder="Enter mobile number"
                    defaultValue="6350548682"
                  />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  Full Name <span className="req">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Your full name"
                  defaultValue="PANKAJ GURJAR"
                />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 14 }}>
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter email address"
                  style={{
                    paddingLeft: 36,
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    left: 13,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: 14,
                    color: 'var(--mu)',
                  }}
                >
                  @
                </span>
              </div>
            </div>

            <div className="form-divider" />

            <div className="section-heading">
              <div className="section-number">2</div>
              <h3>Issue / Feedback Details</h3>
            </div>
            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  Select Place <span className="req">*</span>
                </label>
                <div className="select-wrap">
                  <select className="form-select" defaultValue="">
                    <option value="" disabled>
                      Choose location
                    </option>
                    <option>Amber Fort, Jaipur</option>
                    <option>Mehrangarh Fort, Jodhpur</option>
                    <option>Hawa Mahal, Jaipur</option>
                    <option>Jaisalmer Fort</option>
                    <option>City Palace, Udaipur</option>
                    <option>Ranthambore Tiger Reserve</option>
                    <option>Keoladeo National Park</option>
                    <option>General / Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  Issue Category <span className="req">*</span>
                </label>
                <div className="select-wrap">
                  <select className="form-select" defaultValue="">
                    <option value="" disabled>
                      Select issue type
                    </option>
                    <option>Booking Related</option>
                    <option>Payment Issue</option>
                    <option>Ticket Not Received</option>
                    <option>Cancellation/Refund</option>
                    <option>Website / App Bug</option>
                    <option>Images Incorrect</option>
                    <option>Staff Behaviour</option>
                    <option>Facility Complaint</option>
                    <option>General Enquiry</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 14 }}>
              <label className="form-label">Booking ID</label>
              <div className="select-wrap">
                <select className="form-select" defaultValue="">
                  <option value="">Select Booking Id</option>
                  <option>RJ2024001 — Amber Fort</option>
                  <option>RJ2024002 — Mehrangarh Fort</option>
                  <option>RJ2024003 — Hawa Mahal</option>
                  <option>RJ2024004 — Jaisalmer Fort</option>
                  <option>N/A</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <div style={{ position: 'relative' }}>
                <textarea
                  className="form-textarea"
                  placeholder="Please describe your issue in detail..."
                  rows={4}
                />
                <span
                  style={{
                    position: 'absolute',
                    right: 13,
                    bottom: 12,
                    fontSize: 16,
                    color: 'var(--mu)',
                    opacity: 0.4,
                  }}
                >
                  💬
                </span>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Attachment</label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <label className="attach-btn">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{
                      width: 14,
                      height: 14,
                    }}
                  >
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                  Choose File
                  <input
                    type="file"
                    accept=".jpg,.png,.pdf"
                    style={{
                      display: 'none',
                    }}
                    onChange={handleFileChange}
                  />
                </label>
                <span className="attach-hint">Max 2MB (JPG, PNG, PDF)</span>
                {fileName ? (
                  <span
                    style={{
                      fontSize: 11,
                      color: 'var(--sf)',
                      fontWeight: 600,
                    }}
                  >
                    {fileName}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel-modal" onClick={handleCloseNewQuery}>
              Cancel
            </button>
            <button type="button" className="btn-submit-ticket" onClick={handleSubmitTicket}>
              Submit Ticket
            </button>
          </div>
        </div>
      </div>

      <div
        className={`drawer-overlay ${selectedGrievance ? 'open' : ''}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            handleCloseDrawer();
          }
        }}
      >
        <div className="drawer-panel">
          <div className="drawer-close-bar">
            <button
              type="button"
              className="drawer-close-btn"
              onClick={handleCloseDrawer}
              aria-label="Close"
            >
              ←
            </button>
            <span className="drawer-close-title">Query Tickets</span>
            {selectedGrievance ? (
              <span
                className={`g-badge ${selectedGrievance.badgeClass}`}
                style={{
                  fontSize: 11,
                }}
              >
                {selectedGrievance.badgeLabel}
              </span>
            ) : null}
          </div>

          {selectedGrievance ? (
            <div className="drawer-content">
              <div className="qt-header">
                <div className="qt-title-row">
                  <div>
                    <div className="qt-title">{selectedGrievance.subject}</div>
                    <div className="qt-sub">
                      Ticket #{selectedGrievance.ticketNo} · Raised {selectedGrievance.raisedAt}
                    </div>
                  </div>
                </div>
              </div>

              <div className="chat-wrap">
                <div className="chat-left">
                  <div className="chat-messages">
                    {selectedGrievance.messages.length > 0 ? (
                      selectedGrievance.messages.map((m, index) => (
                        <div
                          key={`${selectedGrievance.id}-msg-${index}`}
                          className={m.from === 'user' ? 'msg-user' : 'msg-support'}
                        >
                          {m.text}
                          <div className="msg-time">{m.time}</div>
                        </div>
                      ))
                    ) : (
                      <div className="chat-empty">
                        <div className="chat-empty-icon">💬</div>
                        <div className="chat-empty-text">No Chat found</div>
                      </div>
                    )}
                  </div>
                  <div className="chat-input-bar">
                    <input
                      className="chat-input"
                      type="text"
                      placeholder="Type your Message..."
                      value={chatInput[selectedGrievance.id] || ''}
                      onChange={(event) => {
                        const value = event.target.value;
                        setChatInput((prev) => ({
                          ...prev,
                          [selectedGrievance.id]: value,
                        }));
                      }}
                      disabled={selectedGrievance.status !== 'ongoing'}
                    />
                    <button
                      type="button"
                      className="chat-send-btn"
                      onClick={() => handleSendMessage(selectedGrievance.id)}
                      disabled={selectedGrievance.status !== 'ongoing'}
                      style={
                        selectedGrievance.status !== 'ongoing'
                          ? {
                              opacity: 0.4,
                              cursor: 'not-allowed',
                            }
                          : undefined
                      }
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="chat-right">
                  <div className="detail-user-row">
                    <div className="detail-avatar">
                      {selectedGrievance.user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="detail-user-name">{selectedGrievance.user.name}</div>
                      <div className="detail-user-role">Registered User</div>
                    </div>
                    <div className="detail-status-pill">
                      <span className="g-badge badge-scheduled">
                        {selectedGrievance.chatStatus}
                      </span>
                    </div>
                  </div>

                  <div className="detail-section">
                    <button
                      type="button"
                      className={`detail-section-header ${
                        sectionsCollapsed.user ? 'collapsed' : ''
                      }`}
                      onClick={() => toggleSection('user')}
                    >
                      <h4>User Info</h4>
                      <span className="toggle-ico">▲</span>
                    </button>
                    <div
                      className="detail-section-body"
                      style={
                        sectionsCollapsed.user
                          ? {
                              display: 'none',
                            }
                          : undefined
                      }
                    >
                      <div className="di-row">
                        <span className="di-key">Email ID</span>
                        <span className="di-val highlight">{selectedGrievance.user.email}</span>
                      </div>
                      <div className="di-row">
                        <span className="di-key">Mobile Number</span>
                        <span className="di-val highlight">{selectedGrievance.user.mobile}</span>
                      </div>
                      <div className="di-row">
                        <span className="di-key">Issue Type</span>
                        <span className="di-val">{selectedGrievance.issueType}</span>
                      </div>
                      <div className="di-row">
                        <span className="di-key">Booking Number</span>
                        <span className="di-val highlight">{selectedGrievance.bookingNo}</span>
                      </div>
                      <div className="di-row">
                        <span className="di-key">Ticket Number</span>
                        <span className="di-val highlight">{selectedGrievance.ticketNo}</span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <button
                      type="button"
                      className={`detail-section-header ${
                        sectionsCollapsed.description ? 'collapsed' : ''
                      }`}
                      onClick={() => toggleSection('description')}
                    >
                      <h4>Description</h4>
                      <span className="toggle-ico">▲</span>
                    </button>
                    <div
                      className="detail-section-body"
                      style={
                        sectionsCollapsed.description
                          ? {
                              display: 'none',
                            }
                          : undefined
                      }
                    >
                      <div
                        style={{
                          fontSize: 13,
                          color: 'var(--sf)',
                          fontWeight: 600,
                          marginBottom: 4,
                        }}
                      >
                        {selectedGrievance.subject}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: 'var(--mu)',
                          lineHeight: 1.65,
                        }}
                      >
                        {selectedGrievance.description}
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <button
                      type="button"
                      className={`detail-section-header ${
                        sectionsCollapsed.attachment ? 'collapsed' : ''
                      }`}
                      onClick={() => toggleSection('attachment')}
                    >
                      <h4>Attachment</h4>
                      <span className="toggle-ico">▲</span>
                    </button>
                    <div
                      className="detail-section-body"
                      style={
                        sectionsCollapsed.attachment
                          ? {
                              display: 'none',
                            }
                          : undefined
                      }
                    >
                      {selectedGrievance.attachment ? (
                        <div className="attachment-row">
                          <span>📎 {selectedGrievance.attachment}</span>
                          <button type="button" className="attachment-view-btn">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div
                          style={{
                            fontSize: 12,
                            color: 'var(--mu)',
                            padding: '4px 0',
                          }}
                        >
                          No attachments
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className={`toast ${toastVisible ? 'show' : ''}`}>
        <span className="ti">✅</span>
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}
