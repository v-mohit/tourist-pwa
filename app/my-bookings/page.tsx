'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { QRCodeCanvas } from 'qrcode.react';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  GetBookingDetails,
  CancelBookingById,
  CheckRefundable,
  GetDownloadTicket,
  WebCheckIn,
} from '@/services/apiCalls/booking.services';
import { showErrorToastMessage, showSuccessToastMessage } from '@/utils/toast.utils';
import moment from 'moment';
import RaiseIssueModal from '@/features/booking/components/RaiseIssueModal';

type TabKey = 'all' | 'upcoming' | 'completed' | 'cancelled' | 'failed';
type DateFilterType = 'Visit' | 'Current' | '';

const CANCEL_REASONS = [
  { value: 'changedPlans', label: 'Changed Plans' },
  { value: 'notNeeded', label: 'Not Needed Anymore' },
  { value: 'foundAnotherOption', label: 'Found Another Option' },
  { value: 'financialReasons', label: 'Financial Reasons' },
  { value: 'other', label: 'Other' },
];

const ACCOUNT_TYPES = [
  { value: 'current', label: 'Current' },
  { value: 'saving', label: 'Saving' },
];

function formatDate(ts?: number | string): string {
  if (!ts) return '—';
  return moment(ts).format('DD MMM YYYY');
}

function formatTime(ts?: number | string): string {
  if (!ts) return '';
  return moment(ts).format('hh:mm A');
}

function getBookingStatus(b: any): { label: string; key: string; cls: string } {
  if (b.cancelled || b.refund) return { label: '✕ Cancelled', key: 'cancelled', cls: 'status-cancelled' };
  if (b.paymentStatus === 'FAIL') return { label: '⚠ Failed', key: 'failed', cls: 'status-cancelled' };
  if (b.paymentStatus === 'PENDING' || b.paymentStatus === 'IN_PROGRESS') return { label: '⏳ Payment Pending', key: 'pending', cls: 'status-upcoming' };
  const visitDateMs = b.bookingDate;
  if (visitDateMs && visitDateMs < Date.now()) return { label: '✔ Completed', key: 'completed', cls: 'status-completed' };
  return { label: '✅ Confirmed', key: 'confirmed', cls: 'status-confirmed' };
}

export default function MyBookingsPage() {
  const { user, openLoginModal } = useAuth();

  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [dateFilterOpen, setDateFilterOpen] = useState(false);
  const [dateType, setDateType] = useState<DateFilterType>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [appliedStartDay, setAppliedStartDay] = useState<number | undefined>();
  const [appliedEndDay, setAppliedEndDay] = useState<number | undefined>();
  const [appliedDateType, setAppliedDateType] = useState<DateFilterType>('');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [loadingTickets, setLoadingTickets] = useState(false);

  // Cancel modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [refundableAmount, setRefundableAmount] = useState<number>(0);
  const [bankForm, setBankForm] = useState({
    bankName: '', acNumber: '', ifscValue: '',
    acHolderName: '', accountType: '', branchCode: '',
  });
  const [bookingToCancel, setBookingToCancel] = useState<any>(null);

  // PDF download
  const [pdfBookingId, setPdfBookingId] = useState<string>('');
  const [pdfIdentification, setPdfIdentification] = useState<string>('');
  const [shouldFetchPdf, setShouldFetchPdf] = useState(false);

  // Raise Issue
  const [raiseIssueOpen, setRaiseIssueOpen] = useState(false);
  const [issueBooking, setIssueBooking] = useState<any>(null);

  // QR modal
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrData, setQrData] = useState('');

  // Determine query params based on active tab
  const queryParams = useMemo(() => {
    const isNumeric = /^\d+$/.test(searchTerm.trim());
    const base: any = {
      callApi: !!user,
      setLoading: setLoadingTickets,
      bookingId: isNumeric ? searchTerm.trim() : undefined,
      searchKey: !isNumeric ? searchTerm.trim() || undefined : undefined,
      size: 100,
      dateFilter: appliedDateType || undefined,
      startDay: appliedStartDay,
      endDay: appliedEndDay,
    };
    if (activeTab === 'all') return { ...base, isOld: false, isRefund: true, status: 'ALL' };
    if (activeTab === 'upcoming') return { ...base, isOld: false, isRefund: false };
    if (activeTab === 'completed') return { ...base, isOld: true, isRefund: false };
    if (activeTab === 'cancelled') return { ...base, isOld: false, isRefund: true };
    if (activeTab === 'failed') return { ...base, isOld: false, isRefund: true, status: 'FAIL' };
    return { ...base, isOld: false };
  }, [activeTab, searchTerm, user, appliedDateType, appliedStartDay, appliedEndDay]);

  const { data: bookingResp, refetch: refetchBookings } = GetBookingDetails(queryParams);

  const allBookings: any[] = useMemo(() => {
    return bookingResp?.result?.ticketBookingDetailDtos ?? [];
  }, [bookingResp]);

  // For tab filtering after fetch (when status doesn't filter perfectly)
  const filteredBookings = useMemo(() => {
    if (activeTab === 'cancelled') return allBookings.filter((b) => b.cancelled || b.refund);
    if (activeTab === 'completed') return allBookings.filter((b) => {
      const s = getBookingStatus(b);
      return s.key === 'completed';
    });
    return allBookings;
  }, [allBookings, activeTab]);

  // Stats
  const stats = useMemo(() => {
    const total = allBookings.length;
    const upcoming = allBookings.filter((b) => {
      const s = getBookingStatus(b);
      return s.key === 'confirmed' || s.key === 'pending';
    }).length;
    const completed = allBookings.filter((b) => getBookingStatus(b).key === 'completed').length;
    const cancelled = allBookings.filter((b) => b.cancelled || b.refund).length;
    const spent = allBookings.filter((b) => !b.cancelled && !b.refund).reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    return { total, upcoming, completed, cancelled, spent };
  }, [allBookings]);

  // Refundable check
  const checkRefundable = CheckRefundable(
    (res) => {
      setRefundableAmount(res?.refundableAmount ?? 0);
      setCancelModalOpen(true);
    },
    () => showErrorToastMessage('Failed to check refund eligibility'),
  );

  // Cancel mutation
  const cancelBooking = CancelBookingById(
    () => {
      showSuccessToastMessage('Booking cancelled successfully');
      setCancelModalOpen(false);
      setDrawerOpen(false);
      setBookingToCancel(null);
      setCancelReason('');
      setOtherReason('');
      setBankForm({ bankName: '', acNumber: '', ifscValue: '', acHolderName: '', accountType: '', branchCode: '' });
      refetchBookings();
    },
    () => {},
  );

  // Web Check-in mutation
  const webCheckIn = WebCheckIn();

  function handleWebCheckIn(b: any) {
    const id = String(b.id || b.bookingId);
    webCheckIn.mutate({ ticketBookingId: id }, {
      onSuccess: (data: any) => {
        showSuccessToastMessage(data?.message || 'Web check-in successful');
        refetchBookings();
      },
      onError: (err: any) => showErrorToastMessage(err?.response?.data?.message || 'Check-in failed'),
    });
  }

  function openQrModal(b: any) {
    const data = b?.qrDetail || JSON.stringify({ type: 'BOOKING', data: { ticketBookingId: b.id || b.bookingId } });
    setQrData(data);
    setQrModalOpen(true);
  }

  function openRaiseIssue(b: any) {
    setIssueBooking(b);
    setRaiseIssueOpen(true);
  }

  // Cancel eligibility — based on old project rules
  function canCancel(b: any): boolean {
    if (b.cancelled || b.refund) return false;
    if (!b.cancelledPolicy) return false;
    const quota = (b.quotaName || '').toLowerCase();
    if (quota === 'tatkal' || quota === 'current') return false;
    // Min 3 days before visit date
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
    if (b.bookingDate && b.bookingDate - Date.now() < threeDaysMs) return false;
    return true;
  }

  function isJkkBooking(b: any): boolean {
    return (b?.placeName || '').toLowerCase().includes('jawahar');
  }

  function isInventoryBooking(b: any): boolean {
    return !!b?.zoneName;
  }

  function isCheckinEligible(b: any): boolean {
    return isInventoryBooking(b) && b.checkedIn !== 'Yes' && !b.cancelled && !b.refund;
  }

  // PDF download
  const { data: pdfData, isFetching: pdfLoading } = GetDownloadTicket(
    pdfBookingId,
    pdfIdentification,
    shouldFetchPdf,
  );

  useEffect(() => {
    if (pdfData?.result && shouldFetchPdf) {
      const passes = pdfData?.result?.boardingPassDetailDtos ?? pdfData?.result?.ticketBookingDetailDtos ?? [];
      const ticket = passes[0] ?? pdfData?.result;
      if (ticket) {
        // Open print-friendly view of the ticket in a new window
        printTicket(ticket);
        showSuccessToastMessage('Opening ticket for download...');
      } else {
        showErrorToastMessage('Ticket data not available');
      }
      setShouldFetchPdf(false);
    }
  }, [pdfData, shouldFetchPdf]);

  function maskString(s: string | undefined | null): string {
    if (!s) return '';
    const str = String(s);
    if (str.length <= 4) return str;
    return '*'.repeat(str.length - 4) + str.slice(-4);
  }

  function checkNationality(n: any): string {
    const v = String(n || '').toLowerCase();
    if (v === 'foreigner' || v === 'foreign' || v === 'fn') return 'Foreigner';
    return 'Indian';
  }

  function printTicket(ticket: any) {
    const w = window.open('', '_blank', 'width=1000,height=900');
    if (!w) { showErrorToastMessage('Please allow popups to download ticket'); return; }

    const placeName = ticket.placeDetailDto?.name || ticket.placeName || 'Booking';
    const districtName = ticket.placeDetailDto?.districtName || '';
    const bookingDate = ticket.bookingDate ? moment(ticket.bookingDate).format('DD MMM YYYY') : '';
    const createdDate = ticket.createdDate ? moment(ticket.createdDate).format('DD MMM YYYY') : '';
    const shiftName = ticket.shiftDto?.name || '';
    const shiftStart = ticket.shiftDto?.startTime ? moment(ticket.shiftDto.startTime).format('hh:mm A') : '';
    const shiftEnd = ticket.shiftDto?.endTime ? moment(ticket.shiftDto.endTime).format('hh:mm A') : '';
    const totalAmount = ticket.totalAmount || 0;

    const qrValue = ticket.qrDetail || JSON.stringify({ type: 'BOOKING', data: { ticketBookingId: ticket.id || ticket.bookingId } });
    const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrValue)}`;

    const visitors = (ticket.ticketUserDto || [])
      .map((t: any) => `${t.ticketName} × ${t.qty}`)
      .join('<br />');

    const addons = (ticket.ticketUserDto || [])
      .flatMap((t: any) => (t.addonItems || []).filter((a: any) => a?.name).map((a: any) => a.name))
      .join(', ');

    const imageUrl = ticket.placeDetailDto?.imageUrl;
    const fullImg = imageUrl
      ? (imageUrl.startsWith('http') ? imageUrl : `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${imageUrl}`)
      : '';

    const isComposite = ticket.ticketType === 'COMPOSITE' || !!ticket.packageDto;
    const isInventory = !!ticket.ticketUserDto?.[0]?.ticketUserDocs?.[0]?.documentNo;

    let bodyHtml = '';

    if (isComposite) {
      // Composite/package ticket
      const packageName = ticket.packageDto?.packageName || placeName;
      const duration = ticket.packageDto?.duration || 0;
      const placeNames = (ticket.placeNames || []).join(', ');
      bodyHtml = `
        <div style="margin: 20px; display: flex; background-color: #ffffff; border-radius: 20px; box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.1); border: 2px solid #dddddd;">
          <div style="background-color: #ff016e; padding: 30px 0px; width: 50px; border-radius: 10px 0px 0px 10px; position: relative;">
            <h4 style="position: absolute; top: 10%; transform: rotate(-90deg); color: #fff; font-weight: 600; white-space: nowrap;">${duration} Days</h4>
            <h5 style="position: absolute; top: 66%; transform: rotate(-90deg); color: #fff; font-weight: 600; white-space: nowrap;">${packageName}</h5>
          </div>
          <div style="flex: 1; padding: 30px;">
            <div style="display: flex; justify-content: space-between; margin-top: 20px;">
              <div style="flex: 1;">
                <div style="display: flex; align-items: center;">
                  <div style="margin-right: 20px;">
                    <div style="height: 100px; width: 169px; border-radius: 12px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 40px;">📦</div>
                    <h4 style="margin-top: 13px; font-size: 15px; font-weight: 500;">Booking ID: #${ticket.bookingId || ticket.id}</h4>
                    <h4 style="margin-top: 8px; font-size: 15px; font-weight: 500;">Booking Date: ${createdDate}</h4>
                  </div>
                  <div>
                    <h3 style="font-size: 24px; font-weight: 700; margin-bottom: 5px;">${packageName}</h3>
                    <h4 style="color: #707070; font-size: 16px; font-weight: 500; margin: 0;">Total Places Included: ${placeNames}</h4>
                  </div>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 50px;">
                  <div>
                    <p style="color: #707070; font-size: 14px;">Valid on</p>
                    <h2 style="color: #343434; font-size: 16px; font-weight: 600;">${bookingDate} (${duration} Days)</h2>
                  </div>
                  <div>
                    <p style="color: #707070; font-size: 14px;">Ticket Category</p>
                    <ul style="list-style: none; padding: 0;">
                      ${(ticket.ticketUserDto || []).map((u: any) => `<li style="color: #343434; font-size: 16px; font-weight: 600;">${u.ticketName} × ${u.qty}</li>`).join('')}
                    </ul>
                  </div>
                </div>
                <div style="background: #ebebeb; border-radius: 10px; text-align: center; margin-top: 20px; color: #8f8f8f; padding: 21px;">
                  <p>Your pass includes entry of above mentioned places</p>
                </div>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; margin-left: 20px;">
                <img src="${qrImg}" style="width: 200px; height: 200px;" alt="QR Code" />
                <p style="color: #323232; font-size: 16px; font-weight: 600; text-align: center; margin-top: 10px;">Scan QR code for Entry</p>
              </div>
            </div>
          </div>
        </div>`;
    } else {
      // Standard ticket — same design pattern as old project (#ff016e accent, ashoka stambh, OBMS branding)
      bodyHtml = `
        <div style="margin: 20px; display: flex; background-color: #ffffff; border-radius: 20px; box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.1); border: 2px solid #dddddd;">
          <div style="background-color: #ff016e; padding: 10px 0px; width: 40px; border-radius: 10px 0px 0px 10px; position: relative;">
            <div style="height: 100%; letter-spacing: 2px; color: #ffffff; position: relative; font-size: 12px; white-space: nowrap; display: flex; justify-content: space-evenly; align-items: stretch; font-weight: 600;">
              <h4 style="position: absolute; top: 50%; transform: rotate(-90deg); width: auto; color: #fff;">OBMS</h4>
            </div>
          </div>
          <div style="flex: 1; padding: 30px 30px 30px 30px;">
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
              <div style="font-size: 40px;">🏛️</div>
              <span style="font-weight: 700;">Government of Rajasthan</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 20px;">
              <div style="display: flex; align-items: flex-start; margin-right: 10px;">
                ${fullImg
                  ? `<img src="${fullImg}" alt="Place" style="width: 80px; height: 50px; object-fit: cover;" />`
                  : `<div style="width: 80px; height: 50px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 24px;">🏛️</div>`}
              </div>
              <div style="flex-grow: 1;">
                <h3 style="font-size: 24px; font-weight: 700; margin-bottom: 10px;">${placeName}${districtName ? `, ${districtName}` : ''}.</h3>
                <h4 style="font-weight: 500;">Location: ${placeName}${districtName ? `, ${districtName}` : ''}, Rajasthan</h4>
                <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                  <div>
                    <p style="color: #707070; font-size: 14px;">Booking Date</p>
                    <h2 style="color: #343434; font-size: 16px; font-weight: 600; line-height: 25px;">${createdDate}</h2>
                  </div>
                  <div>
                    <p style="color: #707070; font-size: 14px;">Visit Date</p>
                    <h2 style="color: #343434; font-size: 16px; font-weight: 600; line-height: 25px;">${bookingDate}</h2>
                  </div>
                  <div style="margin-left: 40px; margin-right: 40px;">
                    <p style="color: #707070; font-size: 14px;">Booking Id</p>
                    <h2 style="color: #343434; font-size: 16px; font-weight: 600; line-height: 25px;">#${ticket.bookingId || ticket.id}</h2>
                  </div>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                  <div>
                    <p style="color: #707070; font-size: 14px;">Total Visitor</p>
                    <h2 style="color: #343434; font-size: 16px; font-weight: 600; line-height: 25px;">${visitors}</h2>
                  </div>
                  <div style="margin-left: 20px; margin-right: 40px;">
                    <p style="color: #707070; font-size: 14px;">Shift / Time</p>
                    <h2 style="color: #343434; font-size: 16px; font-weight: 600; line-height: 25px;">${shiftName}${shiftStart ? ` / ${shiftStart} - ${shiftEnd}` : ''}</h2>
                  </div>
                  <div style="margin-right: 10px;">
                    <p style="color: #707070; font-size: 14px;">Amount</p>
                    <h2 style="color: #343434; font-size: 16px; font-weight: 600; line-height: 25px;">₹${totalAmount}</h2>
                  </div>
                </div>
                <div style="background: #ebebeb; border-radius: 10px; text-align: center; margin-top: 15px; color: #8f8f8f; padding: 21px;">
                  <p style="margin: 0;">Your pass includes ${placeName} Entry${addons ? `, ${addons}.` : '.'}</p>
                </div>
                ${isInventory && ticket.zoneName ? `
                <div style="margin-top: 15px; padding: 12px; background: #fff5e6; border-radius: 8px;">
                  <strong style="font-size: 13px;">Zone:</strong> ${ticket.zoneName}
                  ${ticket.vendorInventoryDetails?.vehicleNumber ? `<br/><strong style="font-size: 13px;">Vehicle:</strong> ${ticket.vendorInventoryDetails.vehicleNumber}` : ''}
                  ${ticket.guideDetails?.name ? `<br/><strong style="font-size: 13px;">Guide:</strong> ${ticket.guideDetails.name}` : ''}
                </div>` : ''}
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; margin-left: 20px;">
                <img src="${qrImg}" alt="QR Code" style="width: 100px; height: 100px;" />
                <p style="color: #323232; font-size: 12px; font-weight: 600; text-align: center; margin-top: 8px;">Scan QR code for Entry</p>
              </div>
            </div>
            <div style="margin-top: 15px; margin-left: 200px; font-size: 12px; color: #707070;">
              For More Info — helpdesk.tourist@rajasthan.gov.in
            </div>
          </div>
        </div>`;
    }

    const html = `<!DOCTYPE html><html><head><title>Ticket #${ticket.bookingId || ticket.id}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; font-size: 12px; background: #ffffff; color: #323232; padding: 0; }
        @media print { body { padding: 0; } }
      </style></head>
      <body>
      <div style="width: 950px; margin: 0 auto; padding: 0; box-sizing: border-box;">
        ${bodyHtml}
      </div>
      <script>setTimeout(() => window.print(), 800);</script>
      </body></html>`;
    w.document.write(html);
    w.document.close();
  }

  // Apply date filter
  function applyDateFilter() {
    if (!dateType || !startDate || !endDate) {
      showErrorToastMessage('Please select date type and both dates');
      return;
    }
    const startMs = moment(startDate).startOf('day').valueOf();
    const endMs = moment(endDate).endOf('day').valueOf();
    const diffDays = (endMs - startMs) / (1000 * 60 * 60 * 24);
    if (diffDays > 5) {
      showErrorToastMessage('Date range cannot exceed 5 days');
      return;
    }
    setAppliedDateType(dateType);
    setAppliedStartDay(startMs);
    setAppliedEndDay(endMs);
    setDateFilterOpen(false);
  }

  function clearDateFilter() {
    setDateType('');
    setStartDate('');
    setEndDate('');
    setAppliedDateType('');
    setAppliedStartDay(undefined);
    setAppliedEndDay(undefined);
    setDateFilterOpen(false);
  }

  function openDrawer(b: any) {
    setSelectedBooking(b);
    setDrawerOpen(true);
  }

  function handleCancelClick(b: any) {
    setBookingToCancel(b);
    checkRefundable.mutate({ bookingId: String(b.bookingId || b.id) });
  }

  function handleCancelConfirm() {
    if (!cancelReason) {
      showErrorToastMessage('Please select a cancellation reason');
      return;
    }
    if (cancelReason === 'other' && !otherReason.trim()) {
      showErrorToastMessage('Please specify the reason');
      return;
    }
    const finalReason = cancelReason === 'other' ? otherReason : cancelReason;

    const basePayload: any = {
      bookingId: bookingToCancel?.bookingId || bookingToCancel?.id,
      cancelledReason: finalReason,
      amount: refundableAmount,
    };

    if (refundableAmount > 0) {
      // Validate bank details
      if (!bankForm.bankName || !bankForm.acNumber || !bankForm.ifscValue || !bankForm.acHolderName || !bankForm.accountType) {
        showErrorToastMessage('Please fill all bank details');
        return;
      }
      basePayload.bankName = bankForm.bankName;
      basePayload.bankAccount = bankForm.acNumber;
      basePayload.bankIfsc = bankForm.ifscValue;
      basePayload.bankAccountName = bankForm.acHolderName;
      basePayload.accountType = bankForm.accountType;
      basePayload.branchCode = bankForm.branchCode;
    }

    cancelBooking.mutate(basePayload);
  }

  function handleDownloadTicket(b: any) {
    const id = String(b.bookingId || b.id);
    const identification = b.ticketUserDto?.[0]?.ticketUserDocs?.[0]?.identityNo
      || b.ticketUserDto?.[0]?.ticketUserDocs?.[0]?.identity
      || '';
    setPdfBookingId(id);
    setPdfIdentification(identification);
    setShouldFetchPdf(true);
  }

  return (
    <div className="page">
      {!user ? (
        <div className="empty-state">
          <div className="empty-icon">🎟</div>
          <div className="empty-title">Login to view bookings</div>
          <div className="empty-sub">Please login to see your booking history and download tickets.</div>
          <button className="btn-p" onClick={openLoginModal}>Login →</button>
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
                      placeholder="Search by Booking ID or place…"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') setSearchTerm(searchInput); }}
                    />
                  </div>

                  <button className="filter-btn" onClick={() => setDateFilterOpen(true)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                    </svg>
                    {appliedDateType ? `${appliedDateType} Date Filter` : 'Filter By Date'}
                  </button>

                  {(appliedDateType || searchTerm) && (
                    <button
                      className="filter-btn"
                      style={{ background: '#FFE6E6', borderColor: '#E8631A' }}
                      onClick={() => {
                        setSearchTerm('');
                        setSearchInput('');
                        clearDateFilter();
                      }}
                    >
                      ✕ Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="tabs-row">
              {(['all', 'upcoming', 'completed', 'cancelled', 'failed'] as TabKey[]).map((tab) => (
                <button
                  key={tab}
                  className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'all' ? 'All Bookings' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
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
              {activeTab === 'all' ? 'All Bookings'
                : activeTab === 'upcoming' ? 'Upcoming Visits'
                  : activeTab === 'completed' ? 'Completed Visits'
                    : activeTab === 'cancelled' ? 'Cancelled'
                      : 'Failed Bookings'}
            </div>

            {loadingTickets ? (
              <div className="empty-state">
                <div className="empty-icon">⏳</div>
                <div className="empty-title">Loading bookings...</div>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎫</div>
                <div className="empty-title">No Bookings Found</div>
                <div className="empty-sub">No tickets match your filter. Try changing filters.</div>
                <button
                  className="btn-p"
                  onClick={() => {
                    setSearchTerm('');
                    setSearchInput('');
                    setActiveTab('all');
                    clearDateFilter();
                  }}
                >
                  View All Bookings
                </button>
              </div>
            ) : (
              filteredBookings.map((b) => {
                const status = getBookingStatus(b);
                const placeName = b.placeName || b.placeDetailDto?.name || b.packageDto?.packageName || 'Booking';
                const district = b.placeDetailDto?.districtName || '';
                const imgUrl = b.placeDetailDto?.imageUrl || b.packageDto?.imageUrl;
                const fullImg = imgUrl
                  ? (imgUrl.startsWith('http') ? imgUrl : `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${imgUrl}`)
                  : 'https://images.unsplash.com/photo-1477587458883-47145ed31f5e?w=400&auto=format&fit=crop&q=80';
                const totalUsers = b.totalUsers || (b.ticketUserDto?.reduce((s: number, t: any) => s + (t.qty || 0), 0)) || 0;

                return (
                  <div
                    key={b.bookingId || b.id}
                    className="booking-card"
                    onClick={() => openDrawer(b)}
                  >
                    <div className="booking-card-inner">
                      <div
                        className="booking-img"
                        style={{
                          backgroundImage: `url('${fullImg}')`,
                          ...(b.cancelled || b.refund ? { filter: 'grayscale(.6)' } : {}),
                        }}
                      >
                        <div className="booking-img-overlay" />
                      </div>

                      <div className="booking-main">
                        <div className="booking-top">
                          <span className="booking-id">#{b.bookingId || b.id}</span>
                          <span className={`booking-status ${status.cls}`}>{status.label}</span>
                        </div>
                        <div className="booking-name">{placeName}</div>
                        {district && (
                          <div className="booking-loc">
                            <img src="/icons/google-maps.png" width={12} height={12} alt="Location" className="loc-ico mr-1" />
                            {district}
                          </div>
                        )}

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
                          {b.shiftName || b.shiftDto?.name ? (
                            <div className="bm-item">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              Shift: <span>{b.shiftName || b.shiftDto?.name}</span>
                            </div>
                          ) : null}
                          <div className="bm-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                            </svg>
                            Visitors: <span>{totalUsers}</span>
                          </div>
                          {b.zoneName && (
                            <div className="bm-item">
                              📍 Zone: <span>{b.zoneName}</span>
                            </div>
                          )}
                        </div>

                        <div className="booking-tickets">
                          {(b.ticketUserDto || []).slice(0, 4).map((t: any, i: number) => (
                            <div key={i} className="tkt">
                              <span className="tkt-icon">🎟</span>
                              {t.ticketName} × {t.qty}
                            </div>
                          ))}
                        </div>
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
                          <div className="booking-price-sub">
                            Booked {formatDate(b.createdDate)}
                          </div>
                        </div>

                        <div className="booking-actions">
                          <button
                            className="bc-btn bc-btn-primary"
                            onClick={(e) => { e.stopPropagation(); openDrawer(b); }}
                          >
                            View Ticket
                          </button>
                          {!b.cancelled && !b.refund && status.key !== 'failed' && status.key !== 'pending' && (
                            <button
                              className="bc-btn bc-btn-outline"
                              onClick={(e) => { e.stopPropagation(); handleDownloadTicket(b); }}
                            >
                              {pdfLoading && pdfBookingId === String(b.bookingId || b.id) ? '⏳ Loading...' : '📥 Download'}
                            </button>
                          )}
                          {isCheckinEligible(b) && (
                            <button
                              className="bc-btn bc-btn-outline"
                              style={{ background: '#E8F5E9', borderColor: '#4CAF50', color: '#2E7D32' }}
                              onClick={(e) => { e.stopPropagation(); handleWebCheckIn(b); }}
                            >
                              ✓ Web Check-in
                            </button>
                          )}
                          {b.checkedIn === 'Yes' && (
                            <span style={{ fontSize: 10, color: '#2E7D32', padding: '4px 8px', background: '#E8F5E9', borderRadius: 12 }}>
                              ✓ Checked In
                            </span>
                          )}
                          {canCancel(b) && (
                            <button
                              className="bc-btn bc-btn-ghost"
                              onClick={(e) => { e.stopPropagation(); handleCancelClick(b); }}
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            className="bc-btn bc-btn-ghost"
                            style={{ color: '#7A6A58' }}
                            onClick={(e) => { e.stopPropagation(); openRaiseIssue(b); }}
                          >
                            🛟 Raise Issue
                          </button>
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
            if (e.target === e.currentTarget) setDateFilterOpen(false);
          }}>
            <div className="modal" role="dialog" aria-modal="true">
              <div className="modal-header">
                <div className="modal-title">Filter By Date</div>
                <button className="modal-close" onClick={() => setDateFilterOpen(false)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Select Date Type <span className="req">*</span></label>
                  <div className="select-wrap">
                    <select className="form-select" value={dateType} onChange={(e) => setDateType(e.target.value as DateFilterType)}>
                      <option value="" disabled>Select Date Type</option>
                      <option value="Visit">Visit Date</option>
                      <option value="Current">Booking Date</option>
                    </select>
                  </div>
                </div>

                {dateType && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Start Date *</label>
                      <input type="date" className="form-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">End Date * (max 5 day range)</label>
                      <input type="date" className="form-input" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn-modal-close" onClick={clearDateFilter}>CLEAR</button>
                <button className="btn-modal-confirm" onClick={applyDateFilter} disabled={!dateType || !startDate || !endDate}>APPLY</button>
              </div>
            </div>
          </div>

          {/* Ticket Drawer */}
          <div
            className={`drawer-overlay ${drawerOpen ? 'open' : ''}`}
            onClick={(e) => { if (e.target === e.currentTarget) setDrawerOpen(false); }}
          >
            <div className="drawer-panel">
              <div className="drawer-close-bar">
                <button className="drawer-close-btn" onClick={() => setDrawerOpen(false)}>✕</button>
                <span className="drawer-close-title">Booking Details</span>
              </div>

              {selectedBooking && (() => {
                const b = selectedBooking;
                const status = getBookingStatus(b);
                const placeName = b.placeName || b.placeDetailDto?.name || b.packageDto?.packageName || 'Booking';
                const district = b.placeDetailDto?.districtName || '';
                const imgUrl = b.placeDetailDto?.imageUrl || b.packageDto?.imageUrl;
                const fullImg = imgUrl
                  ? (imgUrl.startsWith('http') ? imgUrl : `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${imgUrl}`)
                  : 'https://images.unsplash.com/photo-1477587458883-47145ed31f5e?w=400&auto=format&fit=crop&q=80';

                return (
                  <div>
                    <div className="drawer-img" style={{ backgroundImage: `url('${fullImg}')` }}>
                      <div className="drawer-img-grad" />
                      <div className="drawer-img-foot">
                        <h2>{placeName}</h2>
                        {district && (
                          <p>
                            <img src="/icons/google-maps.png" width={12} height={12} alt="Location" className="loc-ico mr-1" />
                            {district}
                          </p>
                        )}
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
                              <div className="ticket-field-val">#{b.bookingId || b.id}</div>
                            </div>
                            <div className="ticket-field">
                              <div className="ticket-field-lbl">Status</div>
                              <div className="ticket-field-val">
                                <span className={`booking-status ${status.cls}`} style={{ fontSize: 11 }}>{status.label}</span>
                              </div>
                            </div>
                          </div>

                          <div className="ticket-row">
                            <div className="ticket-field">
                              <div className="ticket-field-lbl">Visit Date</div>
                              <div className="ticket-field-val">{formatDate(b.bookingDate)}</div>
                            </div>
                            <div className="ticket-field">
                              <div className="ticket-field-lbl">Shift</div>
                              <div className="ticket-field-val">{b.shiftName || b.shiftDto?.name || '—'}</div>
                            </div>
                          </div>

                          {b.zoneName && (
                            <div className="ticket-row">
                              <div className="ticket-field">
                                <div className="ticket-field-lbl">Zone</div>
                                <div className="ticket-field-val">{b.zoneName}</div>
                              </div>
                              {b.vehicleType && (
                                <div className="ticket-field">
                                  <div className="ticket-field-lbl">Vehicle Type</div>
                                  <div className="ticket-field-val">{b.vehicleType}</div>
                                </div>
                              )}
                            </div>
                          )}

                          {b.vendorInventoryDetails?.vehicleNumber && (
                            <div className="ticket-row">
                              <div className="ticket-field">
                                <div className="ticket-field-lbl">Vehicle Number</div>
                                <div className="ticket-field-val">{b.vendorInventoryDetails.vehicleNumber}</div>
                              </div>
                              {b.guideDetails?.name && (
                                <div className="ticket-field">
                                  <div className="ticket-field-lbl">Guide</div>
                                  <div className="ticket-field-val">{b.guideDetails.name}</div>
                                </div>
                              )}
                            </div>
                          )}

                          <div style={{ marginBottom: 10 }}>
                            <div className="ticket-field-lbl" style={{ marginBottom: 6 }}>Visitors ({b.totalUsers || 0})</div>
                            <div className="ticket-visitors">
                              {(b.ticketUserDto || []).map((t: any, i: number) => (
                                <div key={i} className="visitor-badge">
                                  🎟 {t.ticketName} × {t.qty}
                                </div>
                              ))}
                            </div>
                          </div>

                          {(b.qrDetail || b.id) && status.key !== 'failed' && status.key !== 'cancelled' && (
                            <div style={{ textAlign: 'center', padding: '14px 0', cursor: 'pointer' }} onClick={() => openQrModal(b)}>
                              <div className="ticket-field-lbl">QR Code</div>
                              <div style={{ display: 'inline-block', padding: 10, background: '#fff', border: '1px solid #E8DAC5', borderRadius: 8, marginTop: 8 }}>
                                <QRCodeCanvas value={b.qrDetail || JSON.stringify({ type: 'BOOKING', data: { ticketBookingId: b.id || b.bookingId } })} size={100} level="L" />
                              </div>
                              <div style={{ fontSize: 10, color: '#7A6A58', marginTop: 4 }}>
                                Tap to enlarge · Scan at entry
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="ticket-total-bar">
                          <span className="ttb-lbl">{b.cancelled || b.refund ? 'Refunded Amount' : 'Total Amount Paid'}</span>
                          <span className="ttb-val">₹{b.totalAmount || 0}</span>
                        </div>
                      </div>

                      <div className="drawer-actions">
                        {!b.cancelled && !b.refund && status.key !== 'failed' && status.key !== 'pending' && (
                          <button className="btn-drawer btn-drawer-primary" onClick={() => handleDownloadTicket(b)}>
                            📥 Download Ticket PDF
                          </button>
                        )}

                        {isCheckinEligible(b) && (
                          <button
                            className="btn-drawer btn-drawer-outline"
                            style={{ borderColor: '#2E7D32', color: '#2E7D32' }}
                            onClick={() => handleWebCheckIn(b)}
                          >
                            ✓ Web Check-in
                          </button>
                        )}

                        {isJkkBooking(b) && b.makePayment && (
                          <button
                            className="btn-drawer btn-drawer-primary"
                            onClick={() => showSuccessToastMessage('Redirecting to payment...')}
                          >
                            💳 Make Payment
                          </button>
                        )}

                        {isJkkBooking(b) && b.approved && (
                          <div style={{ padding: '10px 14px', borderRadius: 10, background: b.approved === 'APPROVED' ? '#E8F5E9' : b.approved === 'REJECT' ? '#FFEBEE' : '#FFF8E1', fontSize: 12, fontWeight: 600, textAlign: 'center', color: b.approved === 'APPROVED' ? '#2E7D32' : b.approved === 'REJECT' ? '#C62828' : '#F57F17' }}>
                            JKK Status: {b.approved}
                          </div>
                        )}

                        <button
                          className="btn-drawer btn-drawer-outline"
                          onClick={() => {
                            const text = `${placeName} - Booking #${b.bookingId || b.id}`;
                            if (navigator.share) navigator.share({ title: 'My Booking', text });
                            else navigator.clipboard?.writeText(text);
                            showSuccessToastMessage('Booking details copied');
                          }}
                        >
                          📤 Share Ticket
                        </button>

                        <button
                          className="btn-drawer btn-drawer-outline"
                          onClick={() => openRaiseIssue(b)}
                        >
                          🛟 Raise Issue
                        </button>

                        {canCancel(b) && (
                          <button className="btn-drawer btn-drawer-danger" onClick={() => handleCancelClick(b)}>
                            ✕ Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Cancel Booking Modal */}
          <div className={`modal-overlay ${cancelModalOpen ? 'open' : ''}`} onClick={(e) => {
            if (e.target === e.currentTarget) setCancelModalOpen(false);
          }}>
            <div className="modal" role="dialog" aria-modal="true" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
              <div className="modal-header">
                <div className="modal-title">Cancel Booking</div>
                <button className="modal-close" onClick={() => setCancelModalOpen(false)}>✕</button>
              </div>
              <div className="modal-body">
                <div style={{ background: '#FFF5EE', padding: 12, borderRadius: 8, marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: '#7A6A58' }}>Refundable Amount</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#E8631A' }}>₹{refundableAmount}</div>
                  {refundableAmount === 0 && (
                    <div style={{ fontSize: 11, color: '#7A6A58', marginTop: 4 }}>
                      Per cancellation policy, no refund is applicable for this booking.
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Cancellation Reason <span className="req">*</span></label>
                  <div className="select-wrap">
                    <select className="form-select" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}>
                      <option value="" disabled>Select reason</option>
                      {CANCEL_REASONS.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {cancelReason === 'other' && (
                  <div className="form-group">
                    <label className="form-label">Specify Reason *</label>
                    <input type="text" className="form-input" value={otherReason} onChange={(e) => setOtherReason(e.target.value)} />
                  </div>
                )}

                {refundableAmount > 0 && (
                  <>
                    <div style={{ borderTop: '1px solid #E8DAC5', margin: '12px 0', paddingTop: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#2C2017', marginBottom: 8 }}>Bank Details for Refund</div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Account Holder Name *</label>
                      <input type="text" className="form-input" value={bankForm.acHolderName}
                        onChange={(e) => setBankForm({ ...bankForm, acHolderName: e.target.value })} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Bank Name *</label>
                      <input type="text" className="form-input" value={bankForm.bankName}
                        onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Account Number *</label>
                      <input type="text" className="form-input" value={bankForm.acNumber}
                        onChange={(e) => setBankForm({ ...bankForm, acNumber: e.target.value.replace(/[^0-9]/g, '') })} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">IFSC Code *</label>
                      <input type="text" className="form-input" value={bankForm.ifscValue}
                        onChange={(e) => setBankForm({ ...bankForm, ifscValue: e.target.value.toUpperCase() })} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Account Type *</label>
                      <div className="select-wrap">
                        <select className="form-select" value={bankForm.accountType}
                          onChange={(e) => setBankForm({ ...bankForm, accountType: e.target.value })}>
                          <option value="" disabled>Select type</option>
                          {ACCOUNT_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Branch Code (optional)</label>
                      <input type="text" className="form-input" value={bankForm.branchCode}
                        onChange={(e) => setBankForm({ ...bankForm, branchCode: e.target.value })} />
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn-modal-close" onClick={() => setCancelModalOpen(false)}>BACK</button>
                <button
                  className="btn-modal-confirm"
                  onClick={handleCancelConfirm}
                  disabled={cancelBooking.isPending}
                  style={{ background: '#E84545' }}
                >
                  {cancelBooking.isPending ? 'CANCELLING...' : 'CONFIRM CANCEL'}
                </button>
              </div>
            </div>
          </div>

          {/* QR Code Enlarged Modal */}
          {qrModalOpen && (
            <div className="modal-overlay open" style={{ zIndex: 9994 }} onClick={(e) => {
              if (e.target === e.currentTarget) setQrModalOpen(false);
            }}>
              <div className="modal" style={{ maxWidth: 360, textAlign: 'center' }}>
                <div className="modal-header">
                  <div className="modal-title">Entry QR Code</div>
                  <button className="modal-close" onClick={() => setQrModalOpen(false)}>✕</button>
                </div>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24 }}>
                  <div style={{ padding: 16, background: '#fff', border: '2px solid #E8DAC5', borderRadius: 12 }}>
                    <QRCodeCanvas value={qrData} size={240} level="M" />
                  </div>
                  <p style={{ fontSize: 12, color: '#7A6A58', marginTop: 16 }}>
                    Show this QR code at the entry gate for quick scanning
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Raise Issue Modal */}
          <RaiseIssueModal
            open={raiseIssueOpen}
            onClose={() => setRaiseIssueOpen(false)}
            booking={issueBooking}
          />
        </>
      )}
    </div>
  );
}
