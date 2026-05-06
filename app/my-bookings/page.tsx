'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';
import QRCode from 'qrcode-generator';
import {
  CancelBookingById,
  CheckRefundable,
  GetDownloadTicket,
  GetAllBoardingPassBookings2,
  GetInvoiceForDifferenceAmount,
  WebCheckIn,
  BookingReverified,
} from '@/services/apiCalls/booking.services';
import { ConfirmJkkBookingById } from '@/services/apiCalls/jkk.service';
import { handlePaymentRedirect } from '@/features/booking/utils/payment';
import { printBoardingPass } from '@/utils/printBoardingPass.utils';
import { printDifferenceInvoice } from '@/utils/printDifferenceInvoice.utils';
import { showErrorToastMessage, showSuccessToastMessage } from '@/utils/toast.utils';
import moment from 'moment-timezone';
import RaiseIssueModal from '@/features/booking/components/RaiseIssueModal';
import { useMergedBookings } from '@/features/my-bookings/hooks/useMergedBookings';
import { isAsiBooking, isIgprsBooking, isJkkBooking } from '@/features/my-bookings/utils/bookingTypes';
import IgprsBookingCard from '@/features/my-bookings/components/IgprsBookingCard';
import AsiBookingCard from '@/features/my-bookings/components/AsiBookingCard';
import { openInventoryTicket, buildInventoryShareFile } from '@/utils/ticket-designs/inventoryTicket';
import { openNonInventoryTicket, buildNonInventoryShareFile } from '@/utils/ticket-designs/nonInventoryTicket';
import { openJkkTicket, buildJkkShareFile } from '@/utils/ticket-designs/jkkTicket';
import { openAsiTicket, buildAsiShareFile } from '@/utils/ticket-designs/asiTicket';
import { 
  generateQrDataUrl, 
  toNum, 
  pickNum, 
  computeAddonTotal, 
  computeRislTotal,
  classifyChargeRowExtended
} from '@/utils/ticket-designs/ticketUtils';

type TabKey = 'all' | 'upcoming' | 'completed' | 'cancelled' | 'failed';
type DateFilterType = 'Visit' | 'Current' | '';

const CANCEL_REASONS = [
  { value: 'changedPlans',       label: 'Changed Plans' },
  { value: 'notNeeded',          label: 'Not Needed Anymore' },
  { value: 'foundAnotherOption', label: 'Found Another Option' },
  { value: 'financialReasons',   label: 'Financial Reasons' },
  { value: 'other',              label: 'Other' },
];

const ACCOUNT_TYPES = [
  { value: 'current', label: 'Current' },
  { value: 'saving',  label: 'Saving'  },
];

function formatDate(ts?: number | string): string {
  if (!ts) return '—';
  return moment(ts).format('DD MMM YYYY');
}

function isPaymentSuccess(b: any): boolean {
  return String(b?.paymentStatus || '').toLowerCase().includes('success');
}

function isPaymentFailed(b: any): boolean {
  return String(b?.paymentStatus || '').toLowerCase().includes('fail');
}

function isJkkBookingRow(b: any): boolean {
  if (!b) return false;
  if (b.bookingSource === 'jkk') return true;
  return String(b?.placeName || '').toLowerCase().includes('jawahar');
}

function getJkkStatus(b: any): { label: string; key: string; cls: string } {
  if (b.cancelled || b.refund)
    return { label: '✕ Cancelled', key: 'cancelled', cls: 'status-cancelled' };
  if (isPaymentFailed(b))
    return { label: '⚠ Payment Failed', key: 'failed', cls: 'status-cancelled' };
  const approved = String(b?.approved || '').toUpperCase();
  if (approved === 'REJECT' || approved === 'REJECTED')
    return { label: '✕ Rejected', key: 'rejected', cls: 'status-cancelled' };
  if (approved === 'APPROVED') {
    if (isPaymentSuccess(b)) {
      if (b.bookingDate && b.bookingDate < Date.now())
        return { label: '✔ Completed', key: 'completed', cls: 'status-completed' };
      return { label: '✅ Approved & Paid', key: 'confirmed', cls: 'status-confirmed' };
    }
    return { label: '💳 Approved · Pay Now', key: 'approved', cls: 'status-confirmed' };
  }
  return { label: '⏳ Pending Approval', key: 'pending', cls: 'status-pending' };
}

function getBookingStatus(b: any): { label: string; key: string; cls: string } {
  if (isJkkBooking(b)) return getJkkStatus(b);
  if (b.cancelled || b.refund)
    return { label: '✕ Cancelled', key: 'cancelled', cls: 'status-cancelled' };
  if (!isPaymentSuccess(b))
    return { label: '⚠ Failed', key: 'failed', cls: 'status-cancelled' };
  if (b.bookingDate && b.bookingDate < Date.now())
    return { label: '✔ Completed', key: 'completed', cls: 'status-completed' };
  return { label: '✅ Confirmed', key: 'confirmed', cls: 'status-confirmed' };
}

function isWithinReverifyWindow(b: any): boolean {
  if (isPaymentSuccess(b)) return false;
  if (b?.cancelled || b?.refund) return false;
  const isJkk = String(b?.placeName || '').toLowerCase().includes('jawahar');
  const t     = isJkk ? b?.updatedDate : b?.createdDate;
  if (!t) return false;
  const start = new Date(t).getTime();
  const now   = Date.now();
  return now >= start && now <= start + 5 * 60 * 1000;
}

function MyBookingsPageInner() {
  const { user, openLoginModal } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlBookingId     = searchParams.get('bookingId') ?? '';
  const urlPaymentStatus = searchParams.get('paymentStatus') ?? '';

  const [activeTab,              setActiveTab]              = useState<TabKey>('all');
  const [searchTerm,             setSearchTerm]             = useState('');
  const [searchInput,            setSearchInput]            = useState('');
  const [pageSize,               setPageSize]               = useState<10 | 50 | 100>(10);
  const [page,                   setPage]                   = useState(1);
  const [dateFilterOpen,         setDateFilterOpen]         = useState(false);
  const [dateType,               setDateType]               = useState<DateFilterType>('');
  const [startDate,              setStartDate]              = useState('');
  const [endDate,                setEndDate]                = useState('');
  const [appliedStartDay,        setAppliedStartDay]        = useState<number | undefined>();
  const [appliedEndDay,          setAppliedEndDay]          = useState<number | undefined>();
  const [appliedDateType,        setAppliedDateType]        = useState<DateFilterType>('');
  const [drawerOpen,             setDrawerOpen]             = useState(false);
  const [selectedBooking,        setSelectedBooking]        = useState<any>(null);
  const [loadingTickets,         setLoadingTickets]         = useState(false);
  const [cancelModalOpen,        setCancelModalOpen]        = useState(false);
  const [cancelReason,           setCancelReason]           = useState('');
  const [otherReason,            setOtherReason]            = useState('');
  const [refundableAmount,       setRefundableAmount]       = useState(0);
  const [bankForm,               setBankForm]               = useState({
    bankName: '', acNumber: '', ifscValue: '', acHolderName: '', accountType: '', branchCode: '',
  });
  const [bookingToCancel,        setBookingToCancel]        = useState<any>(null);
  const [pdfBookingId,           setPdfBookingId]           = useState('');
  const [pdfIdentification,      setPdfIdentification]      = useState('');
  const [shouldFetchPdf,         setShouldFetchPdf]         = useState(false);
  const [pdfGenerating,          setPdfGenerating]          = useState('');
  const [boardingFetchBookingId, setBoardingFetchBookingId] = useState('');
  const [boardingFetchPassId,    setBoardingFetchPassId]    = useState('');
  const [shouldFetchBoarding,    setShouldFetchBoarding]    = useState(false);
  const [boardingGenerating,     setBoardingGenerating]     = useState('');
  const [diffInvoiceBookingId,   setDiffInvoiceBookingId]   = useState('');
  const [diffInvoiceLoadingFor,  setDiffInvoiceLoadingFor]  = useState('');
  const [raiseIssueOpen,         setRaiseIssueOpen]         = useState(false);
  const [issueBooking,           setIssueBooking]           = useState<any>(null);
  const [qrModalOpen,            setQrModalOpen]            = useState(false);
  const [qrData,                 setQrData]                 = useState('');
  const [shareModalOpen,         setShareModalOpen]         = useState(false);
  const [shareBooking,           setShareBooking]           = useState<any>(null);
  const [shareLoading,           setShareLoading]           = useState('');

  useEffect(() => {
    const handle = window.setTimeout(() => setSearchTerm(searchInput), 350);
    return () => window.clearTimeout(handle);
  }, [searchInput]);

  // ─── Query params ──────────────────────────────────────────────────────────
  const queryParams = useMemo(() => {
    const normalized    = searchTerm.trim().replace(/^#/, '').trim();
    const compact       = normalized.replace(/\s+/g, '');
    const isNumeric     = /^\d+$/.test(compact);
    const isBookingIdLike = /^[a-z0-9]+$/i.test(compact) && /\d/.test(compact);
    const base: any = {
      callApi:    !!user,
      setLoading: setLoadingTickets,
      bookingId:  (isNumeric || isBookingIdLike) ? compact : undefined,
      searchKey:  (!isNumeric && !isBookingIdLike) ? normalized || undefined : undefined,
      size:       100,
      dateFilter: appliedDateType || undefined,
      startDay:   appliedStartDay,
      endDay:     appliedEndDay,
    };
    if (activeTab === 'all')       return { ...base, isOld: false, isRefund: true,  status: 'ALL' };
    if (activeTab === 'upcoming')  return { ...base, isOld: false, isRefund: false };
    if (activeTab === 'completed') return { ...base, isOld: true,  isRefund: false };
    if (activeTab === 'cancelled') return { ...base, isOld: false, isRefund: true  };
    if (activeTab === 'failed')    return { ...base, isOld: false, isRefund: true,  status: 'FAIL' };
    return { ...base, isOld: false };
  }, [activeTab, searchTerm, user, appliedDateType, appliedStartDay, appliedEndDay, urlBookingId]);

  const userId = (user as any)?.sub ?? (user as any)?.id ?? '';
  const { bookings: allBookings, refetchAll: refetchBookings } = useMergedBookings({
    ...queryParams,
    userId,
  });

  const filteredBookings = useMemo(() => {
    if (activeTab === 'cancelled') return allBookings.filter((b) => b.cancelled || b.refund);
    if (activeTab === 'completed') return allBookings.filter((b) => getBookingStatus(b).key === 'completed');
    return allBookings;
  }, [allBookings, activeTab]);

  useEffect(() => { setPage(1); }, [activeTab, searchTerm, appliedDateType, appliedStartDay, appliedEndDay, pageSize]);

  const totalPages = useMemo(() => {
    const total = Math.ceil(filteredBookings.length / pageSize);
    return total > 0 ? total : 1;
  }, [filteredBookings.length, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pagedBookings = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredBookings.slice(start, start + pageSize);
  }, [filteredBookings, page, pageSize]);

  const stats = useMemo(() => {
    const total     = allBookings.length;
    const upcoming  = allBookings.filter((b) => ['confirmed', 'pending'].includes(getBookingStatus(b).key)).length;
    const completed = allBookings.filter((b) => getBookingStatus(b).key === 'completed').length;
    const cancelled = allBookings.filter((b) => b.cancelled || b.refund).length;
    const spent     = allBookings.filter((b) => !b.cancelled && !b.refund).reduce((s, b) => s + (b.totalAmount || 0), 0);
    return { total, upcoming, completed, cancelled, spent };
  }, [allBookings]);

  // ─── Mutations ─────────────────────────────────────────────────────────────
  const checkRefundable = CheckRefundable(
    (res) => { setRefundableAmount(res?.refundableAmount ?? 0); setCancelModalOpen(true); },
    () => showErrorToastMessage('Failed to check refund eligibility'),
  );

  const cancelBooking = CancelBookingById(
    () => {
      showSuccessToastMessage('Booking cancelled successfully');
      setCancelModalOpen(false); setDrawerOpen(false); setBookingToCancel(null);
      setCancelReason(''); setOtherReason('');
      setBankForm({ bankName: '', acNumber: '', ifscValue: '', acHolderName: '', accountType: '', branchCode: '' });
      refetchBookings();
    },
    () => {},
  );

  const webCheckIn = WebCheckIn();
  function handleWebCheckIn(b: any) {
    webCheckIn.mutate({ ticketBookingId: String(b.id || b.bookingId) }, {
      onSuccess: (data: any) => { showSuccessToastMessage(data?.message || 'Web check-in successful'); refetchBookings(); },
      onError:   (err: any)  => showErrorToastMessage(err?.response?.data?.message || 'Check-in failed'),
    });
  }

  const reverifyMutation = BookingReverified();
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!urlPaymentStatus) return;
    const status = urlPaymentStatus.toUpperCase();
    if (status === 'SUCCESS') showSuccessToastMessage('Booking confirmed');
    else if (status === 'FAIL' || status === 'FAILED') showErrorToastMessage('Payment failed. Please try again.');
  }, [urlPaymentStatus]);

  function handleReverify(b: any) {
    const id = String(b.bookingId || b.id);
    reverifyMutation.mutate({ bookingId: id }, {
      onSuccess: () => { showSuccessToastMessage('Payment status refreshed'); refetchBookings(); },
    });
  }

  const confirmJkk = ConfirmJkkBookingById(
    (res: any) => { handlePaymentRedirect(res); },
    () => {},
  );

  function handleJkkMakePayment(b: any) {
    const id = String(b.id || b.bookingId);
    if (!id) { showErrorToastMessage('Booking ID is missing'); return; }
    confirmJkk.mutate({ bookingId: id });
  }

  function handlePayDifferenceAmount(b: any) {
    const requestId = String(b?.requestId || '');
    if (!requestId) { showErrorToastMessage('Request ID is missing for this booking'); return; }
    try { sessionStorage.setItem('payDiffBookingData', JSON.stringify(b)); } catch {}
    const params = new URLSearchParams({
      diffAmount: String(b.diffAmount ?? ''),
      requestId,
      id: String(b.bookingId ?? b.id ?? ''),
    });
    router.push(`/paydifference-amount?${params.toString()}`);
  }

  const { refetch: refetchDiffInvoice } = GetInvoiceForDifferenceAmount(
    diffInvoiceBookingId,
    (result: any) => {
      setDiffInvoiceLoadingFor('');
      setDiffInvoiceBookingId('');
      const items: any[] = Array.isArray(result) ? result : (result ? [result] : []);
      if (items.length === 0) { showErrorToastMessage('Invoice data not available'); return; }
      items.forEach((item) => printDifferenceInvoice(item));
    },
  );

  useEffect(() => {
    if (!diffInvoiceBookingId) return;
    void refetchDiffInvoice();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diffInvoiceBookingId]);

  function handleDownloadDiffInvoice(b: any) {
    const id = String(b.bookingId || b.id || '');
    if (!id) { showErrorToastMessage('Booking ID is missing'); return; }
    setDiffInvoiceLoadingFor(id);
    setDiffInvoiceBookingId(id);
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────
  function canViewJkkApplication(b: any): boolean {
    if (!isJkkBooking(b)) return false;
    if (b.cancelled || b.refund) return false;
    if (isPaymentFailed(b)) return false;
    const approved = String(b.approved || '').toUpperCase();
    if (approved === 'REJECT' || approved === 'REJECTED') return false;
    return true;
  }

  function canMakeJkkPayment(b: any): boolean {
    if (!isJkkBooking(b)) return false;
    if (b.cancelled || b.refund) return false;
    const approved = String(b.approved || '').toLowerCase();
    const pay      = String(b.paymentStatus || '').toLowerCase();
    return approved.includes('approved')
        && b.makePayment === false
        && !pay.includes('success')
        && !pay.includes('fail');
  }

  function isInventoryType(b: any) {
    return Boolean(
      b?.zoneName || b?.zoneAddress || b?.zoneMapLink || b?.vendorInventoryDetails ||
      Array.isArray(b?.ticketCharges) || Array.isArray(b?.chargeDetails) || Array.isArray(b?.charges) ||
      b?.ticketUserDto?.[0]?.ticketUserDocs?.[0]?.documentNo
    );
  }

  function isCheckinEligible(b: any) { return !!b?.zoneName && b.checkedIn !== 'Yes' && !b.cancelled && !b.refund; }

  function canCancel(b: any) {
    if (b.cancelled || b.refund || !b.cancelledPolicy) return false;
    const q = (b.quotaName || '').toLowerCase();
    if (q === 'tatkal' || q === 'current') return false;
    if (b.bookingDate && b.bookingDate - Date.now() < 3 * 24 * 60 * 60 * 1000) return false;
    return true;
  }

  function maskId(s: string | undefined | null): string {
    if (!s) return '—';
    const str = String(s);
    return str.length <= 4 ? str : '*'.repeat(str.length - 4) + str.slice(-4);
  }

  function checkNationality(n: any): string {
    const v = String(n || '').toLowerCase();
    return (v === 'foreigner' || v === 'foreign' || v === 'fn') ? 'Foreigner' : 'Indian';
  }

  function buildBookingImageUrl(rawUrl: any): string | null {
    const url = String(rawUrl || '').trim();
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL || ''}${url}`;
  }

  function resolveBookingImage(b: any): string {
    const candidates = [
      b?.placeDetailDto?.imageUrl, b?.placeDetailDto?.image, b?.placeDetailDto?.bannerImage,
      b?.placeDetailDto?.images?.data?.[0]?.attributes?.url, b?.placeDetailDto?.images?.[0]?.url,
      b?.packageDto?.imageUrl, b?.packageDto?.image, b?.packageDto?.images?.data?.[0]?.attributes?.url,
      b?.imageUrl, b?.image,
    ];
    for (const candidate of candidates) {
      const resolved = buildBookingImageUrl(candidate);
      if (resolved) return resolved;
    }
    return '';
  }

  // ─── PDF API fallback ──────────────────────────────────────────────────────
  const { data: pdfData } = GetDownloadTicket(pdfBookingId, pdfIdentification, shouldFetchPdf);
  useEffect(() => {
    if (!pdfData?.result || !shouldFetchPdf) return;
    setShouldFetchPdf(false);
    const passes = pdfData.result.boardingPassDetailDtos ?? pdfData.result.ticketBookingDetailDtos ?? [];
    const ticket = passes[0] ?? pdfData.result;
    if (ticket) void dispatchTicketDownload(ticket).finally(() => setPdfGenerating(''));
    else showErrorToastMessage('Ticket data not available');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfData?.result, shouldFetchPdf]);

  // ─── Boarding Pass API ─────────────────────────────────────────────────────
  const { data: boardingData } = GetAllBoardingPassBookings2(
    boardingFetchBookingId, boardingFetchPassId, shouldFetchBoarding, () => {},
  );
  useEffect(() => {
    if (!shouldFetchBoarding || !boardingData?.result) return;
    setShouldFetchBoarding(false);
    setBoardingGenerating('');
    const pass = boardingData.result.boardingPassDetailDtos?.[0];
    if (pass) printBoardingPass(pass);
    else showErrorToastMessage('Boarding pass data not available');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardingData?.result, shouldFetchBoarding]);

  function handlePrintBoardingPass(b: any) {
    const rowKey   = String(b.bookingId || b.id || '');
    const objectId = String(b.id || '');
    const passId   = String(b.boardingPassId || '');
    if (!objectId || !passId) {
      showErrorToastMessage('Boarding pass not yet generated for this booking');
      return;
    }
    setBoardingGenerating(rowKey);
    setBoardingFetchBookingId(objectId);
    setBoardingFetchPassId(passId);
    setShouldFetchBoarding(true);
  }

  function downloadFile(file: File) {
    const url = URL.createObjectURL(file);
    const a   = document.createElement('a');
    a.href = url; a.download = file.name;
    document.body.appendChild(a); a.click(); a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ─── Share Ticket ──────────────────────────────────────────────────────────

  /**
   * Builds the rich PDF used for the Share Ticket flow.
   * Dispatches to one of three distinct designs so each booking type
   * (JKK / Inventory / Non-Inventory) has its own visual identity.
   */
  async function createShareTicketFile(ticket: any): Promise<File> {
    if (isJkkBooking(ticket))      return buildJkkShareFile(ticket);
    if (isAsiBooking(ticket))      return buildAsiShareFile(ticket);
    if (isInventoryType(ticket))   return buildInventoryShareFile(ticket);
    return buildNonInventoryShareFile(ticket);
  }

  /**
   * Desktop fallback: WhatsApp Web, Facebook sharer, Instagram (download only).
   * Browsers cannot force-open a specific app — only the OS share sheet can do
   * that. Here we open the web version of each platform and also download the
   * PDF so the user can attach it manually.
   */
  async function handlePlatformFallback(
    platform: 'facebook' | 'whatsapp' | 'instagram',
    file: File,
    placeName: string,
    bookingId: string,
  ) {
    const text    = encodeURIComponent(`My entry ticket for ${placeName} — Booking #${bookingId} (Govt of Rajasthan OBMS)`);
    const pageUrl = encodeURIComponent(window.location.href);

    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener');
    } else if (platform === 'facebook') {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}&quote=${text}`,
        '_blank',
        'noopener,width=600,height=500',
      );
    }

    // Always download the PDF — user can attach it in the app
    downloadFile(file);
    showSuccessToastMessage(
      platform === 'instagram'
        ? 'Ticket downloaded. Open Instagram and share from your gallery.'
        : 'Ticket downloaded. You can attach it in the app.',
    );
  }

  /**
   * Main share handler.
   *
   * On mobile (Android / iOS):
   *   - Generates the ticket PDF.
   *   - Calls navigator.share({ files }) which opens the native OS share sheet.
   *   - The user picks WhatsApp / Facebook / Instagram from the sheet.
   *   - This is the ONLY standards-based way to pass a file to those apps.
   *
   * On desktop (Chrome / Firefox / Safari without share support):
   *   - Opens WhatsApp Web / Facebook sharer in a new tab.
   *   - Downloads the PDF so the user can attach it manually.
   *   - Instagram on desktop only supports downloading.
   */
  async function handleShareTicket(platform: 'facebook' | 'whatsapp' | 'instagram') {
    if (!shareBooking) return;

    const placeName = shareBooking.placeName
      || shareBooking.placeDetailDto?.name
      || shareBooking.packageDto?.packageName
      || 'Booking';
    const bookingId = String(shareBooking.bookingId || shareBooking.id || '');

    setShareLoading(platform);

    try {
      // Generate the rich PDF ticket file
      const file = await createShareTicketFile(shareBooking);

      const shareData: ShareData = {
        title: `${placeName} — Entry Ticket`,
        text:  `My ticket for ${placeName} (Booking #${bookingId}). Govt of Rajasthan — OBMS.`,
        files: [file],
      };

      // Check if the browser supports sharing files via the Web Share API.
      // navigator.canShare({ files }) is the correct guard — it returns false
      // on desktop browsers that don't support file sharing.
      const supportsFileShare =
        typeof navigator !== 'undefined' &&
        typeof (navigator as any).share === 'function' &&
        typeof (navigator as any).canShare === 'function' &&
        (navigator as any).canShare({ files: [file] });

      if (supportsFileShare) {
        // Opens the native OS share sheet (Android / iOS).
        // The user picks the target app from the sheet.
        await (navigator as any).share(shareData);
        // If we reach here the share sheet was opened successfully.
        setShareModalOpen(false);
        return;
      }

      // No native file-share support (desktop) — open web platform URLs
      // and download the PDF for manual attachment.
      await handlePlatformFallback(platform, file, placeName, bookingId);

    } catch (error: any) {
      if (error?.name === 'AbortError') {
        // User dismissed the share sheet — not an error, close the modal silently.
        setShareModalOpen(false);
        return;
      }

      // Any other error (PDF generation failed, share API threw unexpectedly, etc.)
      // — try to at least download the file so the user isn't left empty-handed.
      console.error('Share ticket error:', error);
      try {
        const file = await createShareTicketFile(shareBooking);
        downloadFile(file);
        showSuccessToastMessage('Ticket downloaded. You can share it from your device.');
      } catch {
        showErrorToastMessage('Unable to generate ticket. Please try again.');
      }
    } finally {
      setShareLoading('');
      setShareModalOpen(false);
    }
  }

  function openShareModalForBooking(b: any) {
    setShareBooking(b);
    setShareModalOpen(true);
  }

  // ─── Download router ────────────────────────────────────────────────────────
  async function dispatchTicketDownload(ticket: any) {
    if (isJkkBooking(ticket))       openJkkTicket(ticket);
    else if (isAsiBooking(ticket))   openAsiTicket(ticket);
    else if (isInventoryType(ticket)) openInventoryTicket(ticket);
    else                             openNonInventoryTicket(ticket);
  }

  // ─── Main download entry point ─────────────────────────────────────────────
  function handleDownloadTicket(b: any) {
    if (isJkkBooking(b)) { openJkkTicket(b); return; }
    const bId = String(b.bookingId || b.id);
    setPdfGenerating(bId);
    if (Array.isArray(b.ticketUserDto)) {
      void dispatchTicketDownload(b).finally(() => setPdfGenerating(''));
      return;
    }
    const identification = b.ticketUserDto?.[0]?.ticketUserDocs?.[0]?.identityNo
      || b.ticketUserDto?.[0]?.ticketUserDocs?.[0]?.identity || '';
    setPdfBookingId(bId);
    setPdfIdentification(identification);
    setShouldFetchPdf(true);
  }

  // ─── Date filter helpers ────────────────────────────────────────────────────
  function applyDateFilter() {
    if (!dateType || !startDate || !endDate) { showErrorToastMessage('Please select date type and both dates'); return; }
    const sMs = moment(startDate).startOf('day').valueOf();
    const eMs = moment(endDate).endOf('day').valueOf();
    if ((eMs - sMs) / (1000 * 60 * 60 * 24) > 5) { showErrorToastMessage('Date range cannot exceed 5 days'); return; }
    setAppliedDateType(dateType); setAppliedStartDay(sMs); setAppliedEndDay(eMs); setDateFilterOpen(false);
  }

  function clearDateFilter() {
    setDateType(''); setStartDate(''); setEndDate('');
    setAppliedDateType(''); setAppliedStartDay(undefined); setAppliedEndDay(undefined);
    setDateFilterOpen(false);
  }

  function openDrawer(b: any)        { setSelectedBooking(b); setDrawerOpen(true); }
  function openRaiseIssue(b: any)    { setIssueBooking(b);    setRaiseIssueOpen(true); }
  function handleCancelClick(b: any) { setBookingToCancel(b); checkRefundable.mutate({ bookingId: String(b.bookingId || b.id) }); }

  function handleCancelConfirm() {
    if (!cancelReason) { showErrorToastMessage('Please select a cancellation reason'); return; }
    if (cancelReason === 'other' && !otherReason.trim()) { showErrorToastMessage('Please specify the reason'); return; }
    const payload: any = {
      bookingId: bookingToCancel?.bookingId || bookingToCancel?.id,
      cancelledReason: cancelReason === 'other' ? otherReason : cancelReason,
      amount: refundableAmount,
    };
    if (refundableAmount > 0) {
      if (!bankForm.bankName || !bankForm.acNumber || !bankForm.ifscValue || !bankForm.acHolderName || !bankForm.accountType) {
        showErrorToastMessage('Please fill all bank details'); return;
      }
      Object.assign(payload, {
        bankName: bankForm.bankName, bankAccount: bankForm.acNumber, bankIfsc: bankForm.ifscValue,
        bankAccountName: bankForm.acHolderName, accountType: bankForm.accountType, branchCode: bankForm.branchCode,
      });
    }
    cancelBooking.mutate(payload);
  }

  // ─── Render ─────────────────────────────────────────────────────────────────
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
            <span>✅</span> You have {stats.upcoming} upcoming visits. Check your tickets below.
          </div>

          <div className="page-header">
            <div className="breadcrumb" style={{ padding: '0 0 14px 0' }}>
              <Link href="/">Home</Link><span>›</span><span>My Bookings</span>
            </div>
            <div className="page-header-top">
              <div>
                <h1>My Bookings</h1>
                <p>View and manage all your ticket reservations across Rajasthan</p>
              </div>
              <div style={{ marginTop: '16px' }} className="header-actions">
                <div className="filter-bar">
                  <div className="search-input-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <input
                      type="text" className="search-input"
                      placeholder="Search by Booking ID or place…"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') setSearchTerm(searchInput); }}
                    />
                  </div>
                  <button className="filter-btn" onClick={() => setDateFilterOpen(true)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                    </svg>
                    {appliedDateType ? `${appliedDateType} Date Filter` : 'Filter By Date'}
                  </button>
                  <div className="page-size-wrap">
                    <span className="page-size-label">Show</span>
                    <div className="select-wrap">
                      <select
                        className="form-select"
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value) as 10 | 50 | 100)}
                      >
                        <option value={10}>10</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                  </div>
                  {(appliedDateType || searchTerm) && (
                    <button
                      className="filter-btn"
                      style={{ background: '#FFE6E6', borderColor: '#E8631A' }}
                      onClick={() => { setSearchTerm(''); setSearchInput(''); clearDateFilter(); }}
                    >✕ Clear</button>
                  )}
                </div>
              </div>
            </div>
            <div className="tabs-row">
              {(['all', 'upcoming', 'completed', 'cancelled', 'failed'] as TabKey[]).map((tab) => (
                <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                  {tab === 'all' ? 'All Bookings' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="stats-strip">
            {[
              { num: stats.total,     lbl: 'Total Bookings', cls: ''       },
              { num: stats.upcoming,  lbl: 'Upcoming',       cls: 'orange' },
              { num: stats.completed, lbl: 'Completed',      cls: 'green'  },
              { num: stats.cancelled, lbl: 'Cancelled',      cls: 'red'    },
              { num: `₹${toNum(stats.spent).toFixed(2)}`, lbl: 'Total Spent', cls: '' },
            ].map((s) => (
              <div key={s.lbl} className="stats-strip-item">
                <div className={`ssi-num ${s.cls}`}>{s.num}</div>
                <div className="ssi-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>

          <div className="bookings-body">
            <div className="section-label">
              {activeTab === 'all' ? 'All Bookings' : activeTab === 'upcoming' ? 'Upcoming Visits'
                : activeTab === 'completed' ? 'Completed Visits' : activeTab === 'cancelled' ? 'Cancelled' : 'Failed Bookings'}
            </div>

            {loadingTickets ? (
              <div className="empty-state"><div className="empty-icon">⏳</div><div className="empty-title">Loading bookings...</div></div>
            ) : filteredBookings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎫</div>
                <div className="empty-title">No Bookings Found</div>
                <div className="empty-sub">No tickets match your filter. Try changing filters.</div>
                <button className="btn-p" onClick={() => { setSearchTerm(''); setSearchInput(''); setActiveTab('all'); clearDateFilter(); }}>
                  View All Bookings
                </button>
              </div>
            ) : pagedBookings.map((b) => {
              if (isIgprsBooking(b)) {
                return (
                  <IgprsBookingCard
                    key={`igprs-${b.id ?? b.bookingId}`}
                    booking={b}
                    onOpen={openDrawer}
                    onRaiseIssue={openRaiseIssue}
                  />
                );
              }
              if (isAsiBooking(b)) {
                return (
                  <AsiBookingCard
                    key={`asi-${b.id ?? b.bookingId}`}
                    booking={b}
                    onOpen={openDrawer}
                    onRaiseIssue={openRaiseIssue}
                    onDownload={handleDownloadTicket}
                    pdfGenerating={pdfGenerating}
                  />
                );
              }

              const status     = getBookingStatus(b);
              const placeName  = b.placeName || b.placeDetailDto?.name || b.packageDto?.packageName || 'Booking';
              const district   = b.placeDetailDto?.districtName || '';
              const fullImg    = resolveBookingImage(b);
              const totalUsers = b.totalUsers || (b.ticketUserDto?.reduce((s: number, t: any) => s + (t.qty || 0), 0)) || 0;
              const bId        = String(b.bookingId || b.id);
              const isGen      = pdfGenerating === bId;

              return (
                <div key={b.bookingId || b.id} className="booking-card" onClick={() => openDrawer(b)}>
                  <div className="booking-card-inner">
                    <div
                      className="booking-img"
                      style={{ backgroundImage: `url('${fullImg}')`, ...(b.cancelled || b.refund ? { filter: 'grayscale(.6)' } : {}) }}
                    >
                      <div className="booking-img-overlay"/>
                    </div>
                    <div className="booking-main">
                      <div className="booking-top">
                        <span className="booking-id">#{b.bookingId || b.id}</span>
                        <span className={`booking-status ${status.cls}`}>{status.label}</span>
                      </div>
                      <div className="booking-name">{placeName}</div>
                      {district && (
                        <div className="booking-loc">
                          <img src="/icons/google-maps.png" width={12} height={12} alt="" className="loc-ico mr-1"/>
                          {district}
                        </div>
                      )}
                      <div className="booking-meta">
                        <div className="bm-item">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          Visit Date: <span>{formatDate(b.bookingDate)}</span>
                        </div>
                        {(b.shiftName || b.shiftDto?.name) && (
                          <div className="bm-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                            </svg>
                            Shift: <span>{b.shiftName || b.shiftDto?.name}</span>
                          </div>
                        )}
                         {placeName.includes("Jawahar") ? "" :
                        <div className="bm-item">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                          </svg>
                           Visitors: <span>{totalUsers}</span>
                        </div>}
                        {b.zoneName && <div className="bm-item">📍 Zone: <span>{b.zoneName}</span></div>}
                      </div>
                      <div className="booking-tickets">
                        {(b.ticketUserDto || []).slice(0, 4).map((t: any, i: number) => (
                          <div key={i} className="tkt"><span className="tkt-icon">🎟</span>{t.ticketName} × {t.qty}</div>
                        ))}
                      </div>
                    </div>
                    <div className="booking-side">
                      <div className="booking-price-wrap">
                        <div className="booking-price-lbl">{b.cancelled || b.refund ? 'Refunded' : 'Total Paid'}</div>
                        <div className="booking-price" style={b.cancelled || b.refund ? { color: 'var(--mu)' } : undefined}>
                          ₹{toNum(b.totalAmount).toFixed(2)}
                        </div>
                        <div className="booking-price-sub">Booked {formatDate(b.createdDate)}</div>
                      </div>
                      <div className="booking-actions">
                        {((isPaymentSuccess(b) && !b.cancelled && !b.refund) || canViewJkkApplication(b)) && (
                          <button className="bc-btn bc-btn-primary" onClick={(e) => { e.stopPropagation(); openDrawer(b); }}>
                            {isJkkBooking(b) && !isPaymentSuccess(b) ? 'View Application' : 'View Ticket'}
                          </button>
                        )}
                        {((isPaymentSuccess(b) && !b.cancelled && !b.refund) || canViewJkkApplication(b)) && (
                          <button
                            className="bc-btn bc-btn-outline"
                            disabled={isGen}
                            onClick={(e) => { e.stopPropagation(); handleDownloadTicket(b); }}
                          >
                            {isGen ? '⏳ Generating...' : (isJkkBooking(b) && !isPaymentSuccess(b) ? '📥 Download Application' : '📥 Download')}
                          </button>
                        )}
                        {b.boardingPassId && isPaymentSuccess(b) && !b.cancelled && !b.refund && (
                          <button
                            className="bc-btn bc-btn-outline"
                            disabled={boardingGenerating === bId}
                            onClick={(e) => { e.stopPropagation(); handlePrintBoardingPass(b); }}
                          >
                            {boardingGenerating === bId ? '⏳ Loading...' : '🎫 Print Boarding Pass'}
                          </button>
                        )}
                        {Number(b.diffAmount) > 0 && b.diffAmountStatus !== 'SUCCESS' && !b.cancelled && !b.refund && (
                          <button
                            className="bc-btn bc-btn-primary"
                            onClick={(e) => { e.stopPropagation(); handlePayDifferenceAmount(b); }}
                          >
                            {`💳 Pay Difference ₹${Number(b.diffAmount).toFixed(2)}`}
                          </button>
                        )}
                        {b.diffAmountStatus === 'SUCCESS' && (
                          <button
                            className="bc-btn bc-btn-outline"
                            disabled={diffInvoiceLoadingFor === bId}
                            onClick={(e) => { e.stopPropagation(); handleDownloadDiffInvoice(b); }}
                          >
                            {diffInvoiceLoadingFor === bId ? '⏳ Loading…' : '📄 Difference Invoice'}
                          </button>
                        )}
                        {!isPaymentSuccess(b) && !b.cancelled && !b.refund && isWithinReverifyWindow(b) && (
                          <button
                            className="bc-btn bc-btn-primary"
                            disabled={reverifyMutation.isPending}
                            onClick={(e) => { e.stopPropagation(); handleReverify(b); }}
                          >
                            {reverifyMutation.isPending ? '⏳ Verifying…' : '🔄 Re-verify Payment'}
                          </button>
                        )}
                        {canMakeJkkPayment(b) && (
                          <button
                            className="bc-btn bc-btn-primary"
                            disabled={confirmJkk.isPending}
                            onClick={(e) => { e.stopPropagation(); handleJkkMakePayment(b); }}
                          >
                            {confirmJkk.isPending ? '⏳ Redirecting…' : '💳 Make Payment'}
                          </button>
                        )}
                        {isPaymentSuccess(b) && b.checkedIn === 'Yes' && (
                          <span style={{ fontSize: 10, color: '#2E7D32', padding: '4px 8px', background: '#E8F5E9', borderRadius: 12 }}>
                            ✓ Checked In
                          </span>
                        )}
                        {isPaymentSuccess(b) && canCancel(b) && (
                          <button className="bc-btn bc-btn-ghost" onClick={(e) => { e.stopPropagation(); handleCancelClick(b); }}>
                            Cancel
                          </button>
                        )}
                        <button
                          className="bc-btn bc-btn-ghost"
                          style={{ color: '#7A6A58' }}
                          onClick={(e) => { e.stopPropagation(); openRaiseIssue(b); }}
                        >🛟 Raise Issue</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {totalPages > 1 && (
              <div className="pagination-bar">
                <button className="filter-btn" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  ‹ Prev
                </button>
                <div className="pagination-info">
                  Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredBookings.length)} of {filteredBookings.length} · Page {page} / {totalPages}
                </div>
                <button className="filter-btn" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                  Next ›
                </button>
              </div>
            )}
          </div>

          {/* ── Date Filter Modal ── */}
          <div className={`modal-overlay ${dateFilterOpen ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setDateFilterOpen(false); }}>
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
                      <input type="date" className="form-input" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                    </div>
                    <div className="form-group">
                      <label className="form-label">End Date * (max 5 day range)</label>
                      <input type="date" className="form-input" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)}/>
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

          {/* ── Ticket Drawer ── */}
          <div className={`drawer-overlay ${drawerOpen ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setDrawerOpen(false); }}>
            <div className="drawer-panel">
              <div className="drawer-close-bar">
                <button className="drawer-close-btn" onClick={() => setDrawerOpen(false)}>✕</button>
                <span className="drawer-close-title">Booking Details</span>
              </div>
              {selectedBooking && (() => {
                const b         = selectedBooking;
                const status    = getBookingStatus(b);
                const placeName = b.placeName || b.placeDetailDto?.name || b.packageDto?.packageName || 'Booking';
                const district  = b.placeDetailDto?.districtName || '';
                const fullImg   = resolveBookingImage(b);
                const bId       = String(b.bookingId || b.id);
                const isGen     = pdfGenerating === bId;
                const isInv     = isInventoryType(b);
                const invTickets: any[] = Array.isArray(b.ticketUserDto) ? b.ticketUserDto : [];
                const invDocs: any[]   = invTickets.flatMap((t: any) => (Array.isArray(t?.ticketUserDocs) ? t.ticketUserDocs : []));
                const invTotalVisitors =
                  (invDocs.length || invTickets.reduce((s: number, t: any) => s + (Number(t?.qty) || 0), 0) || b.totalUsers || 0) as number;
                const invVisitorNames = invDocs
                  .map((d: any) => String(d?.name || d?.fullName || d?.visitorName || '').trim())
                  .filter(Boolean);

                const toNumLocal = (v: any) => { const n = Number(v); return Number.isFinite(n) ? n : 0; };

                const invChargeRows: any[] = Array.isArray(b?.ticketCharges) ? b.ticketCharges
                  : Array.isArray(b?.chargeDetails) ? b.chargeDetails
                  : Array.isArray(b?.charges) ? b.charges : [];

                const invChargesTotals = invChargeRows.reduce(
                  (acc: any, c: any) => {
                    const p = classifyChargeRowExtended(c);
                    acc.entryFeeVisitor  += p.entryFeeVisitor;
                    acc.entryFeeVehicle  += p.entryFeeVehicle;
                    acc.ecoDevVisitor    += p.ecoDevVisitor;
                    acc.ecoDevVehicle    += p.ecoDevVehicle;
                    acc.tigerReserveFund += p.tigerReserveFund;
                    acc.vehicleRent      += p.vehicleRent;
                    acc.vehicleGst       += p.vehicleGst;
                    acc.guideFee         += p.guideFee;
                    acc.guideGst         += p.guideGst;
                    return acc;
                  },
                  { 
                    entryFeeVisitor: 0, entryFeeVehicle: 0, ecoDevVisitor: 0, 
                    ecoDevVehicle: 0, tigerReserveFund: 0, vehicleRent: 0, 
                    vehicleGst: 0, guideFee: 0, guideGst: 0 
                  },
                );

                const entryFeeVisitor = invChargesTotals.entryFeeVisitor;
                const entryFeeVehicle = invChargesTotals.entryFeeVehicle;
                const ecoDevVisitor   = invChargesTotals.ecoDevVisitor;
                const ecoDevVehicle   = invChargesTotals.ecoDevVehicle;
                const tigerFund       = invChargesTotals.tigerReserveFund;
                const vehicleRent     = invChargesTotals.vehicleRent;
                const gst             = invChargesTotals.vehicleGst + invChargesTotals.guideGst;
                const guideFee        = invChargesTotals.guideFee;

                const rislCharge  = computeRislTotal(b);
                const addOnCharge = computeAddonTotal(b);
                const surcharge   = toNum(b?.rpacsCharges ?? b?.rpacsCharge ?? b?.rpacs ?? b?.surcharge ?? b?.surCharge ?? b?.surchargeCharges);

                return (
                  <div>
                    <div className="drawer-img" style={{ backgroundImage: `url('${fullImg}')` }}>
                      <div className="drawer-img-grad"/>
                      <div className="drawer-img-foot">
                        <h2>{placeName}</h2>
                        {district && <p><img src="/icons/google-maps.png" width={12} height={12} alt="" className="loc-ico mr-1"/>{district}</p>}
                      </div>
                    </div>
                    <div className="drawer-content">
                      <div className="ticket-card">
                        <div className="ticket-header">
                          <div><h3>🎫 Official Entry Ticket</h3><p>Government of Rajasthan — OBMS</p></div>
                          <div className="ticket-qr">📲</div>
                        </div>
                        <div className="ticket-divider">
                          <div className="ticket-divider-circle" style={{ marginLeft: -9 }}/>
                          <div className="ticket-divider-line"/>
                          <div className="ticket-divider-circle" style={{ marginRight: -9 }}/>
                        </div>
                        <div className="ticket-body">
                          <div className="ticket-row">
                            <div className="ticket-field"><div className="ticket-field-lbl">Booking ID</div><div className="ticket-field-val">#{b.bookingId || b.id}</div></div>
                            <div className="ticket-field"><div className="ticket-field-lbl">Status</div><div className="ticket-field-val"><span className={`booking-status ${status.cls}`} style={{ fontSize: 11 }}>{status.label}</span></div></div>
                          </div>
                          <div className="ticket-row">
                            <div className="ticket-field"><div className="ticket-field-lbl">Visit Date</div><div className="ticket-field-val">{formatDate(b.bookingDate)}</div></div>
                            <div className="ticket-field"><div className="ticket-field-lbl">Shift</div><div className="ticket-field-val">{b.shiftName || b.shiftDto?.name || '—'}</div></div>
                          </div>
                          {b.zoneName && (
                            <div className="ticket-row">
                              <div className="ticket-field"><div className="ticket-field-lbl">Zone</div><div className="ticket-field-val">{b.zoneName}</div></div>
                              {b.vehicleType && <div className="ticket-field"><div className="ticket-field-lbl">Vehicle Type</div><div className="ticket-field-val">{b.vehicleType}</div></div>}
                            </div>
                          )}
                          {b.vendorInventoryDetails?.vehicleNumber && (
                            <div className="ticket-row">
                              <div className="ticket-field"><div className="ticket-field-lbl">Vehicle No.</div><div className="ticket-field-val">{b.vendorInventoryDetails.vehicleNumber}</div></div>
                              {b.guideDetails?.name && <div className="ticket-field"><div className="ticket-field-lbl">Guide</div><div className="ticket-field-val">{b.guideDetails.name}</div></div>}
                            </div>
                          )}
                          <div style={{ marginBottom: 10 }}>
                            <div className="ticket-field-lbl" style={{ marginBottom: 6 }}>Visitors ({isInv ? invTotalVisitors : (b.totalUsers || 0)})</div>
                            <div className="ticket-visitors">
                              {isInv
                                ? (invVisitorNames.length > 0
                                  ? invVisitorNames.map((name: string, i: number) => (
                                    <div key={`${name}-${i}`} className="visitor-badge">👤 {name}</div>
                                  ))
                                  : <div className="visitor-badge">—</div>)
                                : (b.ticketUserDto || []).map((t: any, i: number) => (
                                  <div key={i} className="visitor-badge">🎟 {t.ticketName} × {t.qty}</div>
                                ))}
                            </div>
                          </div>
                          {isInv && (
                            <div style={{ marginBottom: 10 }}>
                              <div style={{ marginBottom: 6, fontSize: 11, fontWeight: 700, color: '#7A6A58' }}>Charges Detail Summary</div>
                              <div className="ticket-row">
                                <div className="ticket-field"><div className="ticket-field-lbl">Entry Fee (Visitor)</div><div className="ticket-field-val">₹{entryFeeVisitor.toFixed(2)}</div></div>
                                <div className="ticket-field"><div className="ticket-field-lbl">Entry Fee (Vehicle)</div><div className="ticket-field-val">₹{entryFeeVehicle.toFixed(2)}</div></div>
                              </div>
                              <div className="ticket-row">
                                <div className="ticket-field"><div className="ticket-field-lbl">Eco Dev (Visitor)</div><div className="ticket-field-val">₹{ecoDevVisitor.toFixed(2)}</div></div>
                                <div className="ticket-field"><div className="ticket-field-lbl">Eco Dev (Vehicle)</div><div className="ticket-field-val">₹{ecoDevVehicle.toFixed(2)}</div></div>
                              </div>
                              <div className="ticket-row">
                                <div className="ticket-field"><div className="ticket-field-lbl">Vehicle Rent</div><div className="ticket-field-val">₹{vehicleRent.toFixed(2)}</div></div>
                                <div className="ticket-field"><div className="ticket-field-lbl">Guide Fee</div><div className="ticket-field-val">₹{guideFee.toFixed(2)}</div></div>
                              </div>
                              <div className="ticket-row">
                                <div className="ticket-field"><div className="ticket-field-lbl">Tiger Reserve Dev Fund</div><div className="ticket-field-val">₹{tigerFund.toFixed(2)}</div></div>
                                <div className="ticket-field"><div className="ticket-field-lbl">GST</div><div className="ticket-field-val">₹{gst.toFixed(2)}</div></div>
                              </div>
                              <div className="ticket-row">
                                <div className="ticket-field"><div className="ticket-field-lbl">Surcharge (RPACS)</div><div className="ticket-field-val">₹{surcharge.toFixed(2)}</div></div>
                                <div className="ticket-field"><div className="ticket-field-lbl">Add-on Charges</div><div className="ticket-field-val">₹{addOnCharge.toFixed(2)}</div></div>
                              </div>
                              <div className="ticket-row">
                                <div className="ticket-field"><div className="ticket-field-lbl">RISL Charges</div><div className="ticket-field-val">₹{rislCharge.toFixed(2)}</div></div>
                                <div className="ticket-field"><div className="ticket-field-lbl">Grand Total</div><div className="ticket-field-val">₹{toNumLocal(b.totalAmount).toFixed(2)}</div></div>
                              </div>
                            </div>
                          )}
                          {isPaymentSuccess(b) && (b.qrDetail || b.id) && (
                            (() => {
                              const qrValue = b.qrDetail || JSON.stringify({ type: 'BOOKING', data: { ticketBookingId: b.id || b.bookingId } });
                              const qrUrl   = generateQrDataUrl(qrValue);
                              return (
                                <div style={{ textAlign: 'center', padding: '14px 0', cursor: 'pointer' }} onClick={() => { setQrData(qrValue); setQrModalOpen(true); }}>
                                  <div className="ticket-field-lbl">QR Code</div>
                                  <div style={{ display: 'inline-block', padding: 10, background: '#fff', border: '1px solid #E8DAC5', borderRadius: 8, marginTop: 8 }}>
                                    {qrUrl ? (
                                      <img src={qrUrl} alt="QR Code" style={{ width: 130, height: 130, display: 'block' }}/>
                                    ) : (
                                      <div style={{ width: 130, height: 130 }}/>
                                    )}
                                  </div>
                                  <div style={{ fontSize: 10, color: '#7A6A58', marginTop: 4 }}>Tap to enlarge · Scan at entry</div>
                                </div>
                              );
                            })()
                          )}
                        </div>
                        <div className="ticket-total-bar">
                          <span className="ttb-lbl">{b.cancelled || b.refund ? 'Refunded Amount' : 'Total Amount Paid'}</span>
                          <span className="ttb-val">₹{toNumLocal(b.totalAmount).toFixed(2)}</span>
                        </div>
                      </div>

                      {b.transactionId && String(b.transactionId) !== '0' && (
                        <div style={{ background: '#FDF2F8', border: '1px solid #F9C8D8', borderLeft: '4px solid #BE185D', borderRadius: 12, padding: 16, marginTop: 14 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#831843', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #F9C8D8' }}>
                            Transaction Details
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div>
                              <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>Transaction ID</div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: '#323232', wordBreak: 'break-all' }}>{b.transactionId}</div>
                            </div>
                            {b.transactionDate && (
                              <>
                                <div>
                                  <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>Transaction Date</div>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: '#323232' }}>{moment(Number(b.transactionDate)).format('DD MMM YYYY')}</div>
                                </div>
                                <div>
                                  <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>Transaction Time</div>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: '#323232' }}>{moment(Number(b.transactionDate)).format('h:mm:ss A')}</div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="drawer-actions">
                        {((isPaymentSuccess(b) && !b.cancelled && !b.refund) || canViewJkkApplication(b)) && (
                          <button className="btn-drawer btn-drawer-primary" disabled={isGen} onClick={() => handleDownloadTicket(b)}>
                            {isGen ? '⏳ Generating...' : (isJkkBooking(b) && !isPaymentSuccess(b) ? '🖨 Print Application' : '🖨 Print / Download Ticket')}
                          </button>
                        )}
                        {b.boardingPassId && isPaymentSuccess(b) && !b.cancelled && !b.refund && (
                          <button
                            className="btn-drawer btn-drawer-outline"
                            disabled={boardingGenerating === bId}
                            onClick={() => handlePrintBoardingPass(b)}
                          >
                            {boardingGenerating === bId ? '⏳ Loading…' : '🎫 Print Boarding Pass'}
                          </button>
                        )}
                        {Number(b.diffAmount) > 0 && b.diffAmountStatus !== 'SUCCESS' && !b.cancelled && !b.refund && (
                          <button className="btn-drawer btn-drawer-primary" onClick={() => handlePayDifferenceAmount(b)}>
                            {`💳 Pay Difference ₹${Number(b.diffAmount).toFixed(2)}`}
                          </button>
                        )}
                        {b.diffAmountStatus === 'SUCCESS' && (
                          <button
                            className="btn-drawer btn-drawer-outline"
                            disabled={diffInvoiceLoadingFor === bId}
                            onClick={() => handleDownloadDiffInvoice(b)}
                          >
                            {diffInvoiceLoadingFor === bId ? '⏳ Loading…' : '📄 Difference Invoice'}
                          </button>
                        )}
                        {!isPaymentSuccess(b) && !b.cancelled && !b.refund && isWithinReverifyWindow(b) && (
                          <button
                            className="btn-drawer btn-drawer-primary"
                            disabled={reverifyMutation.isPending}
                            onClick={() => handleReverify(b)}
                          >
                            {reverifyMutation.isPending ? '⏳ Verifying…' : '🔄 Re-verify Payment'}
                          </button>
                        )}
                        {canMakeJkkPayment(b) && (
                          <button
                            className="btn-drawer btn-drawer-primary"
                            disabled={confirmJkk.isPending}
                            onClick={() => handleJkkMakePayment(b)}
                          >
                            {confirmJkk.isPending ? '⏳ Redirecting…' : '💳 Make Payment'}
                          </button>
                        )}
                        {isJkkBooking(b) && b.approved && (
                          <div style={{ padding: '10px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600, textAlign: 'center',
                            background: b.approved === 'APPROVED' ? '#E8F5E9' : b.approved === 'REJECT' ? '#FFEBEE' : '#FFF8E1',
                            color: b.approved === 'APPROVED' ? '#2E7D32' : b.approved === 'REJECT' ? '#C62828' : '#F57F17' }}>
                            JKK Status: {b.approved}
                          </div>
                        )}
                        {isPaymentSuccess(b) && (
                          <button className="btn-drawer btn-drawer-outline" onClick={() => void openShareModalForBooking(b)}>📤 Share Ticket</button>
                        )}
                        <button className="btn-drawer btn-drawer-outline" onClick={() => openRaiseIssue(b)}>🛟 Raise Issue</button>
                        {isPaymentSuccess(b) && canCancel(b) && (
                          <button className="btn-drawer btn-drawer-danger" onClick={() => handleCancelClick(b)}>✕ Cancel Booking</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* ── Cancel Modal ── */}
          <div className={`modal-overlay ${cancelModalOpen ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setCancelModalOpen(false); }}>
            <div className="modal" role="dialog" aria-modal="true" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
              <div className="modal-header">
                <div className="modal-title">Cancel Booking</div>
                <button className="modal-close" onClick={() => setCancelModalOpen(false)}>✕</button>
              </div>
              <div className="modal-body">
                <div style={{ background: '#FFF5EE', padding: 12, borderRadius: 8, marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: '#7A6A58' }}>Refundable Amount</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#E8631A' }}>₹{refundableAmount}</div>
                  {refundableAmount === 0 && <div style={{ fontSize: 11, color: '#7A6A58', marginTop: 4 }}>Per cancellation policy, no refund is applicable.</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Cancellation Reason <span className="req">*</span></label>
                  <div className="select-wrap">
                    <select className="form-select" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}>
                      <option value="" disabled>Select reason</option>
                      {CANCEL_REASONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </div>
                </div>
                {cancelReason === 'other' && (
                  <div className="form-group">
                    <label className="form-label">Specify Reason *</label>
                    <input type="text" className="form-input" value={otherReason} onChange={(e) => setOtherReason(e.target.value)}/>
                  </div>
                )}
                {refundableAmount > 0 && (
                  <>
                    <div style={{ borderTop: '1px solid #E8DAC5', margin: '12px 0', paddingTop: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#2C2017', marginBottom: 8 }}>Bank Details for Refund</div>
                    </div>
                    {[
                      { lbl: 'Account Holder Name *', key: 'acHolderName' },
                      { lbl: 'Bank Name *',            key: 'bankName'     },
                      { lbl: 'Account Number *',       key: 'acNumber'     },
                      { lbl: 'IFSC Code *',            key: 'ifscValue'    },
                    ].map(({ lbl, key }) => (
                      <div className="form-group" key={key}>
                        <label className="form-label">{lbl}</label>
                        <input
                          type="text" className="form-input" value={(bankForm as any)[key]}
                          onChange={(e) => {
                            let v = e.target.value;
                            if (key === 'acNumber')  v = v.replace(/[^0-9]/g, '');
                            if (key === 'ifscValue') v = v.toUpperCase();
                            setBankForm({ ...bankForm, [key]: v });
                          }}
                        />
                      </div>
                    ))}
                    <div className="form-group">
                      <label className="form-label">Account Type *</label>
                      <div className="select-wrap">
                        <select className="form-select" value={bankForm.accountType} onChange={(e) => setBankForm({ ...bankForm, accountType: e.target.value })}>
                          <option value="" disabled>Select type</option>
                          {ACCOUNT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Branch Code (optional)</label>
                      <input type="text" className="form-input" value={bankForm.branchCode} onChange={(e) => setBankForm({ ...bankForm, branchCode: e.target.value })}/>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn-modal-close" onClick={() => setCancelModalOpen(false)}>BACK</button>
                <button className="btn-modal-confirm" onClick={handleCancelConfirm} disabled={cancelBooking.isPending} style={{ background: '#E84545' }}>
                  {cancelBooking.isPending ? 'CANCELLING...' : 'CONFIRM CANCEL'}
                </button>
              </div>
            </div>
          </div>

          {/* ── QR Modal ── */}
          {qrModalOpen && (
            <div className="modal-overlay open" style={{ zIndex: 9994 }} onClick={(e) => { if (e.target === e.currentTarget) setQrModalOpen(false); }}>
              <div className="modal" style={{ maxWidth: 360, textAlign: 'center' }}>
                <div className="modal-header">
                  <div className="modal-title">Entry QR Code</div>
                  <button className="modal-close" onClick={() => setQrModalOpen(false)}>✕</button>
                </div>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24 }}>
                  <div style={{ padding: 16, background: '#fff', border: '2px solid #E8DAC5', borderRadius: 12 }}>
                    {qrData && generateQrDataUrl(qrData) ? (
                      <img src={generateQrDataUrl(qrData)} alt="Entry QR Code" style={{ width: 240, height: 240, display: 'block' }}/>
                    ) : (
                      <div style={{ width: 240, height: 240 }}/>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: '#7A6A58', marginTop: 16 }}>Show this QR code at the entry gate for quick scanning</p>
                </div>
              </div>
            </div>
          )}

          {/* ── Share Modal ── */}
          {shareModalOpen && shareBooking && (
            <div className="modal-overlay open" style={{ zIndex: 9994 }} onClick={(e) => { if (e.target === e.currentTarget) setShareModalOpen(false); }}>
              <div className="modal" style={{ maxWidth: 380 }}>
                <div className="modal-header">
                  <div className="modal-title">Share Ticket</div>
                  <button className="modal-close" onClick={() => setShareModalOpen(false)}>✕</button>
                </div>
                <div className="modal-body" style={{ paddingTop: 16 }}>
                  <div style={{ fontSize: 12, color: '#7A6A58', marginBottom: 18 }}>
                    On mobile, tapping a platform opens your device&apos;s share sheet where you can choose the app.
                    On desktop, the ticket PDF is downloaded so you can attach it manually.
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    {[
                      {
                        key: 'whatsapp', label: 'WhatsApp', bg: '#E8F8EF', color: '#25D366',
                        icon: (
                          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <path d="M20.5 11.8c0 4.7-3.8 8.5-8.5 8.5-1.5 0-2.9-.4-4.2-1.1L3 20.5l1.3-4.6A8.4 8.4 0 0 1 3.5 12c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.3zm-8.5-7a7 7 0 0 0-6.1 10.4l.3.5-.8 2.8 2.8-.8.5.3a7 7 0 1 0 3.3-13.2zm4.1 8.9c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.4.1l-.6.7c-.1.1-.2.2-.4.1-.2-.1-.8-.3-1.5-1-.6-.6-1-1.3-1.1-1.5-.1-.2 0-.3.1-.4l.3-.3.2-.3.1-.3c0-.1 0-.2 0-.3l-.7-1.6c-.2-.4-.3-.3-.4-.3h-.4c-.1 0-.3.1-.4.2-.1.1-.6.5-.6 1.3s.6 1.5.7 1.6c.1.1 1.2 1.8 3 2.5 1.8.8 1.8.5 2.2.5.4-.1 1.2-.5 1.4-1 .2-.5.2-.9.1-1 0-.1-.2-.1-.4-.2z"/>
                          </svg>
                        ),
                      },
                      {
                        key: 'facebook', label: 'Facebook', bg: '#E8F0FE', color: '#1877F2',
                        icon: (
                          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.7-1.6h1.5V4.8c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4V11H8v3h2.5v8h3z"/>
                          </svg>
                        ),
                      },
                      {
                        key: 'instagram', label: 'Instagram', bg: '#FDF0F7', color: '#E1306C',
                        icon: (
                          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="5"/>
                            <circle cx="12" cy="12" r="4"/>
                            <circle cx="17.5" cy="6.5" r="1"/>
                          </svg>
                        ),
                      },
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => void handleShareTicket(item.key as 'facebook' | 'whatsapp' | 'instagram')}
                        disabled={!!shareLoading}
                        style={{
                          border: '1px solid #E8DAC5', borderRadius: 16, background: '#fff',
                          padding: '16px 10px', display: 'flex', flexDirection: 'column',
                          alignItems: 'center', gap: 10,
                          cursor: shareLoading ? 'not-allowed' : 'pointer',
                          opacity: shareLoading && shareLoading !== item.key ? 0.55 : 1,
                        }}
                      >
                        <span style={{ width: 52, height: 52, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: item.bg, color: item.color }}>
                          {item.icon}
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#2C2017' }}>
                          {shareLoading === item.key ? 'Opening...' : item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <RaiseIssueModal open={raiseIssueOpen} onClose={() => setRaiseIssueOpen(false)} booking={issueBooking}/>
        </>
      )}
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <Suspense fallback={null}>
      <MyBookingsPageInner />
    </Suspense>
  );
}
