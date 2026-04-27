'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth/context/AuthContext';
import QRCode from 'qrcode-generator';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import {
  GetBookingDetails,
  CancelBookingById,
  CheckRefundable,
  GetDownloadTicket,
  WebCheckIn,
  BookingReverified,
} from '@/services/apiCalls/booking.services';
import { showErrorToastMessage, showSuccessToastMessage } from '@/utils/toast.utils';
import moment from 'moment-timezone';
import RaiseIssueModal from '@/features/booking/components/RaiseIssueModal';

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

/**
 * Booking is "successful" only when paymentStatus contains "success".
 * Everything else (FAIL / PENDING / IN_PROGRESS / null) is treated as Failed.
 * Cancelled bookings keep their own status.
 */
function isPaymentSuccess(b: any): boolean {
  return String(b?.paymentStatus || '').toLowerCase().includes('success');
}

function getBookingStatus(b: any): { label: string; key: string; cls: string } {
  if (b.cancelled || b.refund)
    return { label: '✕ Cancelled', key: 'cancelled', cls: 'status-cancelled' };
  if (!isPaymentSuccess(b))
    return { label: '⚠ Failed', key: 'failed', cls: 'status-cancelled' };
  if (b.bookingDate && b.bookingDate < Date.now())
    return { label: '✔ Completed', key: 'completed', cls: 'status-completed' };
  return { label: '✅ Confirmed', key: 'confirmed', cls: 'status-confirmed' };
}

/**
 * Returns true if the booking is within its 5-minute reverify window
 * (measured from updatedDate for JKK, otherwise createdDate).
 */
function isWithinReverifyWindow(b: any): boolean {
  if (isPaymentSuccess(b)) return false;
  if (b?.cancelled || b?.refund) return false;
  const isJkk = String(b?.placeName || '').toLowerCase().includes('jawahar');
  const t = isJkk ? b?.updatedDate : b?.createdDate;
  if (!t) return false;
  const start = new Date(t).getTime();
  const now = Date.now();
  return now >= start && now <= start + 5 * 60 * 1000;
}

export default function MyBookingsPage() {
  const { user, openLoginModal } = useAuth();

  const [activeTab,         setActiveTab]         = useState<TabKey>('all');
  const [searchTerm,        setSearchTerm]        = useState('');
  const [searchInput,       setSearchInput]       = useState('');
  const [dateFilterOpen,    setDateFilterOpen]    = useState(false);
  const [dateType,          setDateType]          = useState<DateFilterType>('');
  const [startDate,         setStartDate]         = useState('');
  const [endDate,           setEndDate]           = useState('');
  const [appliedStartDay,   setAppliedStartDay]   = useState<number | undefined>();
  const [appliedEndDay,     setAppliedEndDay]     = useState<number | undefined>();
  const [appliedDateType,   setAppliedDateType]   = useState<DateFilterType>('');
  const [drawerOpen,        setDrawerOpen]        = useState(false);
  const [selectedBooking,   setSelectedBooking]   = useState<any>(null);
  const [loadingTickets,    setLoadingTickets]    = useState(false);
  const [cancelModalOpen,   setCancelModalOpen]   = useState(false);
  const [cancelReason,      setCancelReason]      = useState('');
  const [otherReason,       setOtherReason]       = useState('');
  const [refundableAmount,  setRefundableAmount]  = useState(0);
  const [bankForm,          setBankForm]          = useState({
    bankName: '', acNumber: '', ifscValue: '', acHolderName: '', accountType: '', branchCode: '',
  });
  const [bookingToCancel,   setBookingToCancel]   = useState<any>(null);
  const [pdfBookingId,      setPdfBookingId]      = useState('');
  const [pdfIdentification, setPdfIdentification] = useState('');
  const [shouldFetchPdf,    setShouldFetchPdf]    = useState(false);
  const [pdfGenerating,     setPdfGenerating]     = useState('');
  const [raiseIssueOpen,    setRaiseIssueOpen]    = useState(false);
  const [issueBooking,      setIssueBooking]      = useState<any>(null);
  const [qrModalOpen,       setQrModalOpen]       = useState(false);
  const [qrData,            setQrData]            = useState('');
  const [shareModalOpen,    setShareModalOpen]    = useState(false);
  const [shareBooking,      setShareBooking]      = useState<any>(null);
  const [shareLoading,      setShareLoading]      = useState('');

  // ─── Query params ──────────────────────────────────────────────────────────
  const queryParams = useMemo(() => {
    const isNumeric = /^\d+$/.test(searchTerm.trim());
    const base: any = {
      callApi:    !!user,
      setLoading: setLoadingTickets,
      bookingId:  isNumeric ? searchTerm.trim() : undefined,
      searchKey:  !isNumeric ? searchTerm.trim() || undefined : undefined,
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
  }, [activeTab, searchTerm, user, appliedDateType, appliedStartDay, appliedEndDay]);

  const { data: bookingResp, refetch: refetchBookings } = GetBookingDetails(queryParams);

  const allBookings: any[] = useMemo(
    () => bookingResp?.result?.ticketBookingDetailDtos ?? [],
    [bookingResp],
  );

  const filteredBookings = useMemo(() => {
    if (activeTab === 'cancelled') return allBookings.filter((b) => b.cancelled || b.refund);
    if (activeTab === 'completed') return allBookings.filter((b) => getBookingStatus(b).key === 'completed');
    return allBookings;
  }, [allBookings, activeTab]);

  const stats = useMemo(() => {
    const total     = allBookings.length;
    const upcoming  = allBookings.filter((b) => ['confirmed', 'pending'].includes(getBookingStatus(b).key)).length;
    const completed = allBookings.filter((b) => getBookingStatus(b).key === 'completed').length;
    const cancelled = allBookings.filter((b) => b.cancelled || b.refund).length;
    const spent     = allBookings.filter((b) => !b.cancelled && !b.refund).reduce((s, b) => s + (b.totalAmount || 0), 0);
    return { total, upcoming, completed, cancelled, spent };
  }, [allBookings]);

  // ─── Mutations ────────────────────────────────────────────────────────────
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

  // ─── Reverify mutation + 5-min countdown tick ─────────────────────────────
  const reverifyMutation = BookingReverified();
  // Force a re-render every 30s so the reverify button auto-hides at the 5-min mark.
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 30000);
    return () => clearInterval(id);
  }, []);

  function handleReverify(b: any) {
    const id = String(b.bookingId || b.id);
    reverifyMutation.mutate({ bookingId: id }, {
      onSuccess: () => {
        showSuccessToastMessage('Payment status refreshed');
        refetchBookings();
      },
    });
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────
  function isJkkBooking(b: any)    { return (b?.placeName || '').toLowerCase().includes('jawahar'); }
  function isInventoryType(b: any) { return Boolean(b?.zoneName || b.ticketUserDto?.[0]?.ticketUserDocs?.[0]?.documentNo); }
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
    return "";
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

  // ─── QR helpers ───────────────────────────────────────────────────────────
  /**
   * Returns { rects, count } where rects use 1×1 cells.
   * Caller sets `viewBox="0 0 ${count} ${count}"` so the SVG scales to fill its
   * container exactly — no gaps, no centering math needed.
   */
  function generateQrSvgRects(value: string, _size = 96): { rects: string; count: number } {
    try {
      const qr = QRCode(0, 'M');
      qr.addData(value);
      qr.make();
      const count = qr.getModuleCount();
      let out = `<rect width="${count}" height="${count}" fill="#fff"/>`;
      for (let r = 0; r < count; r++)
        for (let c = 0; c < count; c++)
          if (qr.isDark(r, c))
            out += `<rect x="${c}" y="${r}" width="1" height="1" fill="#000"/>`;
      return { rects: out, count };
    } catch {
      const count = 33;
      return {
        rects: `<rect width="${count}" height="${count}" fill="#fff"/>
          <rect x="2" y="2" width="8" height="8" fill="none" stroke="#000" stroke-width=".8"/>
          <rect x="4" y="4" width="4" height="4" fill="#000"/>
          <rect x="${count - 10}" y="2" width="8" height="8" fill="none" stroke="#000" stroke-width=".8"/>
          <rect x="${count - 8}" y="4" width="4" height="4" fill="#000"/>
          <rect x="2" y="${count - 10}" width="8" height="8" fill="none" stroke="#000" stroke-width=".8"/>
          <rect x="4" y="${count - 8}" width="4" height="4" fill="#000"/>`,
        count,
      };
    }
  }

  function generateQrDataUrl(value: string): string {
    try {
      const qr = QRCode(0, 'M');
      qr.addData(value);
      qr.make();
      return qr.createDataURL(8, 0);
    } catch { return ''; }
  }

  function dataUrlToBytes(dataUrl: string): Uint8Array {
    const base64 = dataUrl.split(',')[1] || '';
    const bin    = atob(base64);
    const bytes  = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }

  function wrapLines(text: string, maxChars: number): string[] {
    const cleaned = String(text || '').replace(/\s+/g, ' ').trim();
    if (!cleaned) return [];
    const words: string[] = cleaned.split(' ');
    const lines: string[] = [];
    let cur = '';
    for (const w of words) {
      const next = cur ? `${cur} ${w}` : w;
      if (next.length <= maxChars) cur = next;
      else { if (cur) lines.push(cur); cur = w; }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  function downloadBytesAsFile(bytes: Uint8Array, fileName: string) {
    const normalized = new Uint8Array(bytes);
    const buffer = new ArrayBuffer(normalized.byteLength);
    new Uint8Array(buffer).set(normalized);
    const blob = new Blob([buffer], { type: 'application/pdf' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = fileName;
    document.body.appendChild(a); a.click(); a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function downloadFile(file: File) {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url; a.download = file.name;
    document.body.appendChild(a); a.click(); a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function createShareTicketFile(ticket: any): Promise<File> {
    const bookingId  = String(ticket.bookingId || ticket.id || '');
    const placeName  = ticket.placeName || ticket.placeDetailDto?.name || ticket.packageDto?.packageName || 'Booking';
    const district   = ticket.placeDetailDto?.districtName || '';
    const status     = getBookingStatus(ticket);
    const visitDate  = formatDate(ticket.bookingDate);
    const bookedDate = formatDate(ticket.createdDate);
    const totalAmt   = ticket.totalAmount || 0;
    const visitors: any[] = ticket.ticketUserDto || [];
    const visitorText = visitors.length
      ? visitors.map((item: any) => `${item.ticketName || 'Visitor'} x ${item.qty || 0}`).join(', ')
      : `${ticket.totalUsers || 0} visitor(s)`;
    const qrValue = ticket.qrDetail || JSON.stringify({ type: 'BOOKING', data: { ticketBookingId: ticket.id || ticket.bookingId } });

    const pdfDoc     = await PDFDocument.create();
    const page       = pdfDoc.addPage([595.28, 841.89]);
    const fontReg    = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold   = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const width      = page.getWidth();
    const height     = page.getHeight();
    const margin     = 42;
    const orange     = rgb(0.91, 0.39, 0.10);
    const dark       = rgb(0.17, 0.13, 0.09);
    const muted      = rgb(0.48, 0.42, 0.35);
    const sand       = rgb(0.96, 0.91, 0.84);

    page.drawRectangle({ x: 0, y: height - 112, width, height: 112, color: dark });
    page.drawRectangle({ x: 0, y: height - 118, width, height: 6, color: orange });
    page.drawText('Government of Rajasthan - OBMS', { x: margin, y: height - 40, size: 12, font: fontBold, color: rgb(1, 1, 1) });
    page.drawText(placeName, { x: margin, y: height - 72, size: 24, font: fontBold, color: rgb(1, 1, 1) });

    const qrDataUrl = generateQrDataUrl(qrValue);
    if (qrDataUrl) {
      try {
        const qrImage = await pdfDoc.embedPng(dataUrlToBytes(qrDataUrl));
        page.drawImage(qrImage, { x: width - 132, y: height - 94, width: 76, height: 76 });
      } catch {}
    }

    page.drawRectangle({ x: margin, y: height - 255, width: width - margin * 2, height: 118, color: sand });
    let y = height - 155;
    const drawRow = (label: string, value: string) => {
      page.drawText(label, { x: margin + 16, y, size: 10, font: fontBold, color: muted });
      page.drawText(value || '-', { x: margin + 150, y, size: 12, font: fontReg, color: dark });
      y -= 22;
    };
    drawRow('Booking ID', `#${bookingId}`);
    drawRow('Status', status.label.replace(/[^\x20-\x7E]/g, '').trim() || status.key);
    drawRow('Visit Date', visitDate);
    drawRow('Booked On', bookedDate);
    drawRow('Location', [district, 'Rajasthan'].filter(Boolean).join(', ') || placeName);

    y -= 8;
    page.drawText('Visitor Details', { x: margin, y, size: 13, font: fontBold, color: dark });
    y -= 18;
    for (const line of wrapLines(visitorText, 68)) {
      page.drawText(line, { x: margin, y, size: 11, font: fontReg, color: muted });
      y -= 16;
    }
    y -= 8;
    page.drawText(`Amount Paid: Rs ${totalAmt}`, { x: margin, y, size: 13, font: fontBold, color: orange });
    y -= 30;
    page.drawText('Official tourist ticket generated from My Bookings.', { x: margin, y, size: 10, font: fontReg, color: muted });

    const bytes = await pdfDoc.save();
    const normalized = new Uint8Array(bytes);
    const buffer = new ArrayBuffer(normalized.byteLength);
    new Uint8Array(buffer).set(normalized);
    return new File([buffer], `ticket_${bookingId}.pdf`, { type: 'application/pdf' });
  }

  function openShareModalForBooking(b: any) { setShareBooking(b); setShareModalOpen(true); }

  async function handleShareTicket(platform: 'facebook' | 'whatsapp' | 'instagram') {
    if (!shareBooking) return;
    const placeName = shareBooking.placeName || shareBooking.placeDetailDto?.name || shareBooking.packageDto?.packageName || 'Booking';
    const bookingId = String(shareBooking.bookingId || shareBooking.id || '');
    setShareLoading(platform);
    try {
      const file = await createShareTicketFile(shareBooking);
      const shareData: ShareData = { title: `${placeName} Ticket`, text: `${placeName} - Booking #${bookingId}`, files: [file] };
      if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
        await navigator.share(shareData);
      } else {
        downloadFile(file);
        showSuccessToastMessage('Ticket PDF downloaded. Share it from your device.');
      }
    } catch (error: any) {
      if (error?.name !== 'AbortError') showErrorToastMessage('Unable to share the ticket right now.');
    } finally {
      setShareLoading('');
      setShareModalOpen(false);
    }
  }

  // ─── Download router ───────────────────────────────────────────────────────
  async function dispatchTicketDownload(ticket: any) {
    if (isInventoryType(ticket)) printInventoryTicket(ticket);
    else printSandstoneImperialTicket(ticket);
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  INVENTORY → Sariska-style HTML popup
  // ══════════════════════════════════════════════════════════════════════════
  function printInventoryTicket(ticket: any) {
    const w = window.open('', '_blank', 'width=860,height=1000');
    if (!w) { showErrorToastMessage('Please allow popups to print / download the ticket'); return; }

    const bookingId    = String(ticket.bookingId || ticket.id || '');
    const placeName    = ticket.placeDetailDto?.name || ticket.placeName || 'Reserve';
    const districtName = ticket.placeDetailDto?.districtName || '';
    const zoneName     = ticket.zoneName || '';
    const location     = [zoneName, districtName, 'Rajasthan', 'India'].filter(Boolean).join(' · ');

    const bookedAt        = ticket.createdDate ? moment(ticket.createdDate).format('DD-MM-YYYY · HH:mm:ss · [ONLINE]') : '—';
    const bookedDateShort = ticket.createdDate
      ? moment(ticket.createdDate).format('DD-MM-YYYY') + '  ·  ' + moment(ticket.createdDate).format('HH:mm:ss') + '  ·  ONLINE'
      : '—';

    const visitDate  = ticket.bookingDate ? moment(ticket.bookingDate).format('DD MMM YYYY') : '—';
    const visitDay   = ticket.bookingDate ? moment(ticket.bookingDate).format('dddd') : '';
    const shiftName  = ticket.shiftDto?.name || ticket.shiftName || '';
    const shiftStart = ticket.shiftDto?.startTime ? moment(ticket.shiftDto.startTime).format('hh:mm A') : '';
    const shiftEnd   = ticket.shiftDto?.endTime   ? moment(ticket.shiftDto.endTime).format('hh:mm A')   : '';
    const shiftSub   = shiftStart ? `${shiftStart} – ${shiftEnd}` : '';

    const vehicleType = ticket.vehicleType || ticket.vendorInventoryDetails?.vehicleType || '';
    const vehicleNum  = ticket.vendorInventoryDetails?.vehicleNumber || '';
    const quotaName   = ticket.quotaName || 'Advance';
    const totalAmount = ticket.totalAmount || 0;
    const zoneAddress = ticket.zoneAddress || '';
    const mapLink     = ticket.zoneMapLink  || '';

    const visitors: any[]  = ticket.ticketUserDto || [];
    const totalVisitors     = visitors.reduce((s, t) => s + (t.qty || 0), 0);
    const firstNat          = visitors[0]?.ticketUserDocs?.[0]?.nationality || 'Indian';

    let srCounter = 0;
    const visitorRows = visitors.flatMap((t: any) => {
      const docs: any[] = t.ticketUserDocs || [];
      if (docs.length === 0) {
        srCounter++;
        const addonsText = (t.addonItems || []).filter((a: any) => a?.name).map((a: any) => a.name).join(', ') || '— None —';
        return [`<div class="visitor-row-data">
          <div class="vr-num">${srCounter}</div>
          <div class="vr-name">${t.ticketName || '—'}</div>
          <div class="vr-id">—</div>
          <div class="vr-nat">${checkNationality(t.nationality)}</div>
          <div class="vr-addon">${addonsText}</div>
        </div>`];
      }
      return docs.map((doc: any) => {
        srCounter++;
        const name   = doc.name || t.ticketName || '—';
        const idType = doc.identityType || doc.docType || '';
        const idNo   = maskId(doc.identityNo || doc.documentNo || doc.identity || '');
        const nat    = checkNationality(doc.nationality || t.nationality);
        const addons = (t.addonItems || []).filter((a: any) => a?.name).map((a: any) => a.name).join(', ') || '— None —';
        return `<div class="visitor-row-data">
          <div class="vr-num">${srCounter}</div>
          <div class="vr-name">${name}</div>
          <div class="vr-id">${idType ? `${idType} / ${idNo}` : idNo || '—'}</div>
          <div class="vr-nat">${nat}</div>
          <div class="vr-addon">${addons}</div>
        </div>`;
      });
    }).join('');

    const charges: any[] = ticket.ticketCharges || ticket.chargeDetails || [];
    let chargesBodyHtml = '';
    if (charges.length > 0) {
      chargesBodyHtml = charges.map((c: any) => `
        <tr>
          <td>${c.category || c.ticketName || '—'}</td>
          <td>₹ ${c.entryFeeVisitor ?? c.entryFee ?? 0}</td>
          <td>₹ ${c.entryFeeVehicle ?? 0}</td>
          <td>${c.ecoDevVisitor ?? 0}</td>
          <td>₹ ${c.ecoDevVehicle ?? 0}</td>
          <td>₹ ${c.tigerReserveFund ?? 0}</td>
          <td>₹ ${c.vehicleRent ?? 0}</td>
          <td>₹ ${c.guideFee ?? 0}</td>
          <td>₹ ${c.gst ?? 0}</td>
        </tr>`).join('');
    } else {
      chargesBodyHtml = visitors.map((t: any) => `
        <tr>
          <td>${t.ticketName} × ${t.qty}</td>
          <td>₹ ${t.entryFee ?? '—'}</td>
          <td>—</td><td>—</td><td>—</td>
          <td>₹ ${t.tigerFund ?? '—'}</td>
          <td>₹ ${t.vehicleRent ?? '—'}</td>
          <td>₹ ${t.guideFee ?? '—'}</td>
          <td>₹ ${t.gst ?? '—'}</td>
        </tr>`).join('') || `<tr><td colspan="9" style="text-align:center;color:#aaa;">Charge details not available</td></tr>`;
    }

    const addonTotal = ticket.addonTotal ?? ticket.addonCharges ?? 0;
    const rislTotal  = ticket.rislCharges ?? ticket.platformCharges ?? 0;

    const qrValue = ticket.qrDetail || JSON.stringify({ type: 'BOOKING', data: { ticketBookingId: ticket.id || ticket.bookingId } });
    const { rects: qrRects, count: qrCount } = generateQrSvgRects(qrValue, 96);

    const shiftIcon = (shiftName || '').toLowerCase().includes('morning') ? '🌅'
      : (shiftName || '').toLowerCase().includes('afternoon') ? '🌇'
      : (shiftName || '').toLowerCase().includes('evening')   ? '🌆' : '🌿';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Ticket #${bookingId} — ${placeName}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Rajdhani:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#1a0e06;background-image:radial-gradient(ellipse at 20% 20%,rgba(180,60,10,.15) 0%,transparent 60%),radial-gradient(ellipse at 80% 80%,rgba(120,30,5,.1) 0%,transparent 60%);font-family:'Rajdhani',sans-serif;padding:36px 20px;min-height:100vh;}
.ticket-wrap{max-width:680px;margin:0 auto;}
.ticket{background:#F7EDD8;border-radius:6px;overflow:hidden;box-shadow:0 32px 80px rgba(0,0,0,.7),0 0 0 1px rgba(184,74,14,.25),inset 0 1px 0 rgba(255,255,255,.6);}
.t-top{background:linear-gradient(140deg,#6B2309 0%,#A63A08 40%,#C9580F 70%,#D4691A 100%);padding:28px 36px 44px;position:relative;overflow:hidden;}
.t-top::before{content:'';position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.045'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");}
.t-top::after{content:'';position:absolute;bottom:-2px;left:50%;transform:translateX(-50%);width:115%;height:36px;background:#F7EDD8;border-radius:60% 60% 0 0;}
.t-header-row{display:flex;justify-content:space-between;align-items:flex-start;position:relative;z-index:2;gap:16px;}
.t-header-left{display:flex;flex-direction:column;gap:0;flex:1;min-width:0;}
.t-gov{display:flex;align-items:center;gap:14px;margin-bottom:16px;}
.t-emblem{width:50px;height:50px;background:rgba(255,255,255,.12);border:1.5px solid rgba(255,255,255,.3);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;box-shadow:0 2px 12px rgba(0,0,0,.2);flex-shrink:0;}
.t-gov-text .g1{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:rgba(255,255,255,.55);margin-bottom:2px;}
.t-gov-text .g2{font-family:'Rajdhani',sans-serif;font-size:15px;font-weight:700;color:#fff;letter-spacing:.5px;line-height:1.1;}
.t-gov-text .g3{font-size:9px;letter-spacing:1.5px;color:rgba(255,255,255,.4);margin-top:2px;}
.t-title-block{position:relative;z-index:2;}
.t-title-block h1{font-family:'Cinzel',serif;font-size:24px;font-weight:700;color:#fff;letter-spacing:1.5px;line-height:1.2;text-shadow:0 2px 12px rgba(0,0,0,.25);margin-bottom:6px;}
.t-title-block .t-loc{font-size:11px;color:rgba(255,255,255,.68);letter-spacing:2px;text-transform:uppercase;}
.t-qr-wrap{background:#fff;border-radius:7px;padding:6px;box-shadow:0 6px 20px rgba(0,0,0,.35);position:relative;z-index:2;flex-shrink:0;align-self:flex-start;width:120px;height:120px;display:flex;align-items:center;justify-content:center;}
.t-qr-wrap svg{display:block;width:100%;height:100%;}
.t-body{padding:26px 36px;}
.sec-head{font-family:'Cinzel',serif;font-size:10px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#9B4A1A;border-bottom:1px solid rgba(155,74,26,.2);padding-bottom:6px;margin-bottom:14px;display:flex;align-items:center;gap:8px;}
.sec-head::before{content:'';display:block;width:16px;height:2px;background:#B84A0E;border-radius:1px;}
.meta-row{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:22px;}
.meta-cell{text-align:center;padding:13px 8px;border:1px solid rgba(184,74,14,.2);border-radius:5px;background:rgba(184,74,14,.04);}
.meta-cell .mc-icon{font-size:20px;margin-bottom:6px;display:block;}
.meta-cell .mc-lbl{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#9B5520;margin-bottom:3px;}
.meta-cell .mc-val{font-family:'Cinzel',serif;font-size:14px;font-weight:600;color:#2D1400;line-height:1.1;}
.meta-cell .mc-sub{font-size:10px;color:#9B5520;margin-top:1px;}
.booking-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:22px;}
.booking-cell{padding:10px 14px;border:1px solid rgba(184,74,14,.18);border-radius:4px;background:rgba(184,74,14,.03);}
.booking-cell .bl{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#9B5520;margin-bottom:3px;}
.booking-cell .bv{font-family:'Space Mono',monospace;font-size:12px;color:#2D1400;line-height:1.3;}
.location-table{width:100%;border-collapse:collapse;margin-bottom:22px;border:1px solid rgba(184,74,14,.22);overflow:hidden;}
.location-table tr{border-bottom:1px solid rgba(184,74,14,.15);}
.location-table tr:last-child{border-bottom:none;}
.location-table td{padding:10px 14px;font-size:13px;vertical-align:middle;}
.location-table td.loc-label{font-family:'Cinzel',serif;font-size:12px;font-weight:700;color:#2D1400;letter-spacing:.5px;width:200px;background:rgba(184,74,14,.05);border-right:1px solid rgba(184,74,14,.15);}
.location-table td.loc-value{font-family:'Rajdhani',sans-serif;font-size:13.5px;font-weight:500;color:#3D1F00;}
.location-table td.loc-value a{color:#B84A0E;text-decoration:none;font-weight:600;display:inline-flex;align-items:center;gap:5px;}
.visitor-block{border:1.5px solid rgba(184,74,14,.25);border-radius:5px;overflow:hidden;margin-bottom:22px;}
.visitor-header{background:rgba(184,74,14,.08);padding:7px 16px;display:grid;grid-template-columns:40px 1fr 1fr 1fr 1fr;gap:8px;align-items:center;border-bottom:1px solid rgba(184,74,14,.15);}
.visitor-header span{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#9B5520;}
.visitor-row-data{padding:11px 16px;display:grid;grid-template-columns:40px 1fr 1fr 1fr 1fr;gap:8px;align-items:center;border-bottom:1px solid rgba(184,74,14,.06);}
.visitor-row-data:last-child{border-bottom:none;}
.visitor-row-data .vr-num{font-family:'Space Mono',monospace;font-size:12px;color:#B84A0E;font-weight:700;}
.visitor-row-data .vr-name{font-family:'Cinzel',serif;font-size:13px;color:#2D1400;font-weight:600;}
.visitor-row-data .vr-id{font-family:'Space Mono',monospace;font-size:11px;color:#6B3A1F;}
.visitor-row-data .vr-nat{font-size:12px;color:#6B3A1F;font-weight:600;}
.visitor-row-data .vr-addon{font-size:11px;color:#aaa;font-style:italic;}
.charges-table{width:100%;border-collapse:collapse;margin-bottom:22px;font-size:12px;}
.charges-table thead tr{background:rgba(184,74,14,.08);border-bottom:1px solid rgba(184,74,14,.2);}
.charges-table thead th{font-size:8.5px;letter-spacing:1.5px;text-transform:uppercase;color:#9B5520;padding:8px 10px;text-align:center;border-right:1px solid rgba(184,74,14,.1);}
.charges-table thead th:last-child{border-right:none;}
.charges-table tbody td{padding:8px 10px;text-align:center;border-right:1px solid rgba(184,74,14,.08);border-bottom:1px solid rgba(184,74,14,.08);color:#3D1F00;font-family:'Space Mono',monospace;font-size:11px;}
.charges-table tbody td:first-child{text-align:left;font-family:'Rajdhani',sans-serif;font-size:13px;font-weight:600;color:#3D1F00;}
.charges-table tbody td:last-child{border-right:none;}
.charges-table .addon-row td{color:#888;font-style:italic;font-size:10px;}
.charges-table .risl-row td{color:#6B3A1F;font-size:11px;}
.charges-table .total-row td{background:rgba(184,74,14,.07);border-top:1.5px solid rgba(184,74,14,.25);}
.charges-table .total-row td:first-child{font-family:'Cinzel',serif;font-size:14px;font-weight:700;color:#2D1400;}
.charges-table .total-row td:last-child{font-family:'Space Mono',monospace;font-size:15px;font-weight:700;color:#B84A0E;}
.t-divider{border:none;border-top:1px dashed rgba(184,74,14,.28);margin:4px -8px 22px;position:relative;}
.t-divider::before,.t-divider::after{content:'';position:absolute;top:-10px;width:19px;height:19px;background:#1a0e06;border-radius:50%;}
.t-divider::before{left:-28px;} .t-divider::after{right:-28px;}
.terms-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px 20px;margin-bottom:22px;}
.term-item{display:flex;gap:8px;align-items:flex-start;font-size:11.5px;color:#5A2D10;line-height:1.55;}
.term-item .tick{color:#B84A0E;font-weight:700;flex-shrink:0;margin-top:1px;}
.note-box{background:rgba(184,74,14,.06);border:1px solid rgba(184,74,14,.2);border-left:3px solid #B84A0E;border-radius:3px;padding:10px 14px;margin-bottom:22px;font-size:11.5px;color:#5A2D10;line-height:1.6;}
.note-box strong{color:#B84A0E;}
.refund-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:22px;}
.refund-cell{text-align:center;padding:10px 8px;border:1px solid rgba(184,74,14,.18);border-radius:4px;background:rgba(184,74,14,.03);}
.refund-cell .rf-pct{font-family:'Cinzel',serif;font-size:22px;font-weight:700;color:#B84A0E;line-height:1;margin-bottom:4px;}
.refund-cell .rf-lbl{font-size:10px;letter-spacing:1px;color:#9B5520;text-transform:uppercase;margin-bottom:2px;}
.refund-cell .rf-cond{font-family:'Space Mono',monospace;font-size:9px;color:#6B3A1F;line-height:1.4;}
.t-footer{background:#2D1400;border-top:1px solid rgba(255,255,255,.05);padding:16px 36px;display:flex;justify-content:space-between;align-items:center;}
.t-footer .fc{font-size:11px;color:rgba(255,255,255,.45);line-height:1.9;}
.t-footer .fb .bname{font-family:'Cinzel',serif;font-size:13px;color:#D4A017;letter-spacing:1.5px;text-align:right;}
.t-footer .fb .bsub{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:rgba(255,255,255,.25);text-align:right;margin-top:2px;}
.action-bar{display:flex;gap:10px;justify-content:center;margin-top:22px;}
.btn-print{background:linear-gradient(135deg,#6B2309,#B84A0E);color:#fff;font-family:'Rajdhani',sans-serif;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:none;border-radius:4px;padding:13px 36px;cursor:pointer;box-shadow:0 4px 16px rgba(184,74,14,.4);transition:opacity .15s;}
.btn-print:hover{opacity:.88;}
.btn-close{background:transparent;color:rgba(255,255,255,.45);font-family:'Rajdhani',sans-serif;font-size:14px;font-weight:600;letter-spacing:1px;border:1px solid rgba(255,255,255,.15);border-radius:4px;padding:13px 24px;cursor:pointer;}
@media print{body{background:#fff;padding:0;display:block;}.action-bar{display:none!important;}.ticket{box-shadow:none;border-radius:0;}.ticket-wrap{max-width:100%;}.t-top,.t-footer{-webkit-print-color-adjust:exact;print-color-adjust:exact;}.t-divider::before,.t-divider::after{background:#fff;}}
</style>
</head>
<body>
<div class="ticket-wrap">
<div class="ticket">
  <div class="t-top">
    <div class="t-header-row">
      <div class="t-header-left">
        <div class="t-gov">
          <div class="t-emblem">🏛</div>
          <div class="t-gov-text">
            <div class="g1">Government of Rajasthan</div>
            <div class="g2">Online Booking Management System</div>
            <div class="g3">obms-tourist.rajasthan.gov.in</div>
          </div>
        </div>
        <div class="t-title-block">
          <h1>${placeName}</h1>
          ${location ? `<div class="t-loc">📍 ${location}</div>` : ''}
        </div>
      </div>
      <div class="t-qr-wrap">
        <svg viewBox="0 0 ${qrCount} ${qrCount}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" shape-rendering="crispEdges">${qrRects}</svg>
      </div>
    </div>
  </div>
  <div class="t-body">
    <div class="sec-head">Booking Details</div>
    <div class="booking-row">
      <div class="booking-cell"><div class="bl">Booking ID</div><div class="bv">${bookingId}</div></div>
      <div class="booking-cell"><div class="bl">Booking Date &amp; Time</div><div class="bv">${bookedDateShort}</div></div>
      <div class="booking-cell"><div class="bl">Mode of Booking</div><div class="bv">ONLINE</div></div>
      ${zoneName  ? `<div class="booking-cell"><div class="bl">Route / Zone</div><div class="bv">${zoneName}</div></div>`  : ''}
      ${quotaName ? `<div class="booking-cell"><div class="bl">Quota Name</div><div class="bv">${quotaName}</div></div>` : ''}
      <div class="booking-cell"><div class="bl">Ticket Amount</div><div class="bv">₹ ${totalAmount}</div></div>
    </div>
    ${(zoneAddress || mapLink) ? `
    <table class="location-table">
      ${zoneAddress ? `<tr><td class="loc-label">Address</td><td class="loc-value">${zoneAddress}</td></tr>` : ''}
      ${mapLink     ? `<tr><td class="loc-label">Boarding Point Location</td><td class="loc-value"><a href="${mapLink}" target="_blank"><span>📍</span> Click here to view on map</a></td></tr>` : ''}
    </table>` : ''}
    <div class="sec-head">Visit Details</div>
    <div class="meta-row">
      <div class="meta-cell"><span class="mc-icon">📅</span><div class="mc-lbl">Visit Date</div><div class="mc-val">${visitDate}</div><div class="mc-sub">${visitDay}</div></div>
      <div class="meta-cell"><span class="mc-icon">${shiftIcon}</span><div class="mc-lbl">Shift</div><div class="mc-val">${shiftName || 'Full Day'}</div><div class="mc-sub">${shiftSub}</div></div>
      ${vehicleType ? `<div class="meta-cell"><span class="mc-icon">🚌</span><div class="mc-lbl">Vehicle</div><div class="mc-val">${vehicleType}</div><div class="mc-sub">${vehicleNum || quotaName}</div></div>` : ''}
      <div class="meta-cell"><span class="mc-icon">👥</span><div class="mc-lbl">Total Visitors</div><div class="mc-val">${totalVisitors || visitors.length}</div><div class="mc-sub">${checkNationality(firstNat)}</div></div>
    </div>
    <div class="sec-head">Visitor Information</div>
    <div class="visitor-block">
      <div class="visitor-header"><span>Sr.</span><span>Visitor Name</span><span>Identity Type / No.</span><span>Nationality</span><span>Add Ons</span></div>
      ${visitorRows || `<div class="visitor-row-data"><div class="vr-num">—</div><div class="vr-name">—</div><div class="vr-id">—</div><div class="vr-nat">—</div><div class="vr-addon">—</div></div>`}
    </div>
    <div class="sec-head">Charges Detail Summary</div>
    <table class="charges-table">
      <thead><tr>
        <th style="text-align:left;">Category</th>
        <th>Entry Fee<br/><span style="font-size:8px;opacity:.7;">Visitor</span></th>
        <th>Entry Fee<br/><span style="font-size:8px;opacity:.7;">Vehicle</span></th>
        <th>Eco-Dev<br/><span style="font-size:8px;opacity:.7;">Visitor</span></th>
        <th>Eco-Dev<br/><span style="font-size:8px;opacity:.7;">Vehicle</span></th>
        <th>Tiger Reserve Fund<br/><span style="font-size:8px;opacity:.7;">Visitor+Veh+Guide</span></th>
        <th>Vehicle Rent</th><th>Guide Fee</th><th>GST</th>
      </tr></thead>
      <tbody>
        ${chargesBodyHtml}
        <tr class="addon-row"><td>AddOn Charges</td><td colspan="8">₹ ${addonTotal.toFixed ? addonTotal.toFixed(2) : addonTotal}</td></tr>
        ${rislTotal ? `<tr class="risl-row"><td>RISL / Platform Charges</td><td colspan="8">₹ ${Number(rislTotal).toFixed(2)}</td></tr>` : ''}
        <tr class="total-row"><td>Grand Total</td><td colspan="8" style="text-align:right;padding-right:16px;">₹ ${totalAmount}</td></tr>
      </tbody>
    </table>
    <hr class="t-divider"/>
    <div class="sec-head">Terms &amp; Conditions for Visitors</div>
    <div class="terms-grid">
      <div class="term-item"><span class="tick">✓</span><span>The visitor must reach the Forest permit counter to collect the boarding pass at least <strong>45 minutes prior</strong> to entry time.</span></div>
      <div class="term-item"><span class="tick">✓</span><span>First visitor whose photo ID was uploaded is <strong>mandatory to visit</strong> so that ID can be verified at the gate.</span></div>
      <div class="term-item"><span class="tick">✓</span><span><strong>Mobile phone use</strong> within the tourism zone of the core habitat is <strong>not permitted</strong>.</span></div>
      <div class="term-item"><span class="tick">✓</span><span>ID proof at boarding pass collection must match booking ID; otherwise the permit will be deemed <strong>fake and liable to be cancelled</strong>.</span></div>
      <div class="term-item"><span class="tick">✓</span><span>Carry <strong>original ID / DigiLocker ID</strong> during visit — must be the same ID used at the time of booking.</span></div>
      <div class="term-item"><span class="tick">✓</span><span>The visitor must bring <strong>two printed copies</strong> of this slip at the time of collecting the boarding pass.</span></div>
      <div class="term-item"><span class="tick">✓</span><span>Seats <strong>vacant due to non-turn up</strong> may be filled by park management at the booking window.</span></div>
      <div class="term-item"><span class="tick">✓</span><span>Boarding pass collection begins <strong>two hours before</strong> the park entry time.</span></div>
      <div class="term-item"><span class="tick">✓</span><span>Maximum <strong>6 seats per transaction</strong> to avoid fake bookings.</span></div>
      <div class="term-item"><span class="tick">✓</span><span>For <strong>group bookings</strong>, park authorities will try to accommodate the group subject to space availability.</span></div>
      <div class="term-item"><span class="tick">✓</span><span><strong>Visitors under the influence</strong> of alcohol or intoxicating substances will be denied entry.</span></div>
      <div class="term-item"><span class="tick">✓</span><span>If passenger count is less than vehicle capacity, <strong>difference in vehicle rent &amp; guide fee</strong> will be charged extra.</span></div>
    </div>
    <div class="note-box">
      <strong>⚠ Indemnity Bond:</strong> By booking this permit the visitor acknowledges risks of visiting this reserve, enters at own risk and accepts full liability. The protected area management shall not be responsible in any manner. Any litigation shall be in a court of law in Rajasthan.<br/><br/>
      <strong>Please Note:</strong> We will not be responsible for costs arising out of unforeseen circumstances like landslides, road blocks, or bad weather.
    </div>
    <div class="sec-head">Cancellation &amp; Refund Policy</div>
    <div class="refund-row">
      <div class="refund-cell"><div class="rf-pct">75%</div><div class="rf-lbl">Refund</div><div class="rf-cond">If cancelled<br/>31+ days before<br/>visit date</div></div>
      <div class="refund-cell"><div class="rf-pct">50%</div><div class="rf-lbl">Refund</div><div class="rf-cond">If cancelled<br/>4–30 days before<br/>visit date</div></div>
      <div class="refund-cell"><div class="rf-pct">0%</div><div class="rf-lbl">Refund</div><div class="rf-cond">If cancelled<br/>within 3 days of<br/>visit date</div></div>
    </div>
  </div>
  <div class="t-footer">
    <div class="fc">📞 &nbsp;0141-282-0384<br/>✉ &nbsp;helpdesk[dot]tourist[at]rajasthan[dot]gov[dot]in<br/>🌐 &nbsp;obms-tourist.rajasthan.gov.in</div>
    <div class="fb"><div class="bname">OBMS</div><div class="bsub">Rajasthan Tourism</div></div>
  </div>
</div>
</div>
<div class="action-bar">
  <button class="btn-print" onclick="window.print()">🖨 &nbsp;Print / Save as PDF</button>
  <button class="btn-close" onclick="window.close()">✕ Close</button>
</div>
<script>document.fonts.ready.then(() => setTimeout(() => window.print(), 600));</script>
</body>
</html>`;

    w.document.write(html);
    w.document.close();
    setPdfGenerating('');
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  NON-INVENTORY → Sandstone Imperial
  //  Changes:
  //    1. Header: place name + location left-aligned beside QR (same as inventory)
  //    2. Arch removed (no longer needed with new layout)
  //    3. QR box: padding 5px all sides, no label, SVG fills full size (100×100)
  // ══════════════════════════════════════════════════════════════════════════
  function printSandstoneImperialTicket(ticket: any) {
    const w = window.open('', '_blank', 'width=820,height=960');
    if (!w) { showErrorToastMessage('Please allow popups to print / download the ticket'); return; }

    const bookingId  = String(ticket.bookingId || ticket.id || '');
    const placeName  = ticket.placeDetailDto?.name || ticket.placeName || 'Booking';
    const district   = ticket.placeDetailDto?.districtName || '';
    const location   = [district, 'Rajasthan', 'India'].filter(Boolean).join(', ');
    const bookedDate = ticket.createdDate  ? moment(ticket.createdDate).format('DD MMM YYYY')  : '—';
    const visitDay   = ticket.bookingDate  ? moment(ticket.bookingDate).format('DD MMM')        : '—';
    const visitYear  = ticket.bookingDate  ? moment(ticket.bookingDate).format('YYYY')          : '';
    const shiftName  = ticket.shiftDto?.name || '';
    const shiftStart = ticket.shiftDto?.startTime ? moment(ticket.shiftDto.startTime).format('hh:mm A') : '';
    const shiftEnd   = ticket.shiftDto?.endTime   ? moment(ticket.shiftDto.endTime).format('hh:mm A')   : '';
    const totalAmt   = ticket.totalAmount || 0;

    const visitors: any[] = ticket.ticketUserDto || [];
    const totalQty   = visitors.reduce((s, t) => s + (t.qty || 0), 0);
    const firstLabel = visitors[0]?.ticketName || 'General';
    const visitorVal = totalQty > 0 ? `${totalQty} ${firstLabel}` : '—';
    const visitorSub = visitors.length > 1
      ? visitors.slice(1).map((t) => `${t.qty} ${t.ticketName}`).join(', ')
      : (visitors[0]?.ticketName || 'General');

    const timeVal = shiftName || (shiftStart ? 'Slot' : 'Full Day');
    const timeSub = shiftStart ? `${shiftStart} – ${shiftEnd}` : '9:00 AM – 5:00 PM';
    const priceBadge = totalAmt > 0 ? `₹ ${totalAmt} / Ticket` : 'Entry Pass';

    const addons = visitors
      .flatMap((t) => (t.addonItems || []).filter((a: any) => a?.name).map((a: any) => a.name))
      .join(', ');

    const visitorBreakdownRows = visitors
      .map((t) => `<div class="d1-info-item"><span class="d1-check">✓</span><span>${t.ticketName} × ${t.qty}</span></div>`)
      .join('');

    const qrValue = ticket.qrDetail || JSON.stringify({ type: 'BOOKING', data: { ticketBookingId: ticket.id || ticket.bookingId } });
    // Use 100px viewBox for a larger, full-size QR with only 5px padding
    const { rects: qrRects, count: qrCount } = generateQrSvgRects(qrValue, 100);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Ticket #${bookingId} — ${placeName}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Rajdhani:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Rajdhani',sans-serif;background:#111;min-height:100vh;display:flex;align-items:flex-start;justify-content:center;padding:36px 16px;}
.wrap{max-width:600px;width:100%}
.top-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;}
.valid-pill{display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,.06);border:1px solid rgba(212,160,23,.35);border-radius:20px;padding:5px 14px;}
.valid-dot{width:7px;height:7px;background:#4ade80;border-radius:50%;box-shadow:0 0 6px #4ade80;}
.valid-lbl{font-family:'Space Mono',monospace;font-size:9px;color:rgba(255,255,255,.7);letter-spacing:1px;text-transform:uppercase;}
.booked-on{font-family:'Rajdhani',sans-serif;font-size:11px;color:rgba(255,255,255,.35);letter-spacing:.5px;}

/* card */
.d1{background:#F5ECD7;border-radius:4px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.5),0 0 0 1px rgba(184,74,14,.2);}

/* ── header ── */
.d1-top{
  background:linear-gradient(135deg,#7C2D12 0%,#B84A0E 45%,#D4691A 100%);
  /* reduced bottom padding — arch removed */
  padding:26px 32px 22px;
  position:relative;overflow:hidden;
}
.d1-top::before{
  content:'';position:absolute;inset:0;
  background-image:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
/* ── arch REMOVED — .d1-top::after deleted ── */

/*
 * Header row: left column (gov badge + place name/location) + right column (QR)
 * Mirrors the inventory ticket layout exactly.
 */
.d1-header-row{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  position:relative;z-index:2;
  gap:16px;
}
/* left column */
.d1-header-left{display:flex;flex-direction:column;gap:0;flex:1;min-width:0;}
.d1-gov{display:flex;align-items:center;gap:12px;margin-bottom:14px;}
.d1-emblem{
  width:44px;height:44px;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.3);
  border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;
}
.d1-gov-text .sub{font-family:'Rajdhani',sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.6);}
.d1-gov-text .main{font-family:'Rajdhani',sans-serif;font-size:14px;font-weight:700;color:#fff;letter-spacing:.5px;}

/* place name + location — directly below gov badge, left-aligned, no extra margin */
.d1-title-block{position:relative;z-index:2;}
.d1-title-block h1{font-family:'Cinzel',serif;font-size:24px;font-weight:700;color:#fff;letter-spacing:1px;line-height:1.2;margin-bottom:6px;}
.d1-title-block .loc{font-family:'Rajdhani',sans-serif;font-size:12px;color:rgba(255,255,255,.7);letter-spacing:2px;text-transform:uppercase;}

/*
 * QR block:
 *   - padding: 5px all sides
 *   - no label text
 *   - SVG size 100×100 (full size, centred)
 *   - align-self: flex-start so it stays at the top-right
 */
.d1-qr-wrap{
  background:#fff;border-radius:8px;
  padding:6px;
  box-shadow:0 4px 16px rgba(0,0,0,.3);
  flex-shrink:0;
  margin:0 auto;
  width:140px;height:140px;
  display:flex;align-items:center;justify-content:center;
}
.d1-qr-wrap svg{display:block;width:100%;height:100%;}

/* pass strip */
.d1-pass-strip{background:#D4A017;padding:8px 32px;display:flex;justify-content:space-between;align-items:center;}
.d1-pass-strip .badge{font-family:'Cinzel',serif;font-size:11px;font-weight:600;color:#3D1F00;letter-spacing:2px;}
.d1-pass-strip .price{font-family:'Space Mono',monospace;font-size:11px;color:#3D1F00;font-weight:700;}

/* body */
.d1-body{padding:28px 32px;}
.d1-meta-row{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px;}
.d1-meta-cell{text-align:center;padding:14px 8px;border:1px solid rgba(184,74,14,.2);border-radius:4px;background:rgba(184,74,14,.04);}
.d1-meta-cell .icon{font-size:20px;margin-bottom:6px;display:block;}
.d1-meta-cell .lbl{font-family:'Rajdhani',sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#9B5520;margin-bottom:3px;}
.d1-meta-cell .val{font-family:'Cinzel',serif;font-size:15px;font-weight:600;color:#3D1F00;line-height:1.1;}
.d1-meta-cell .sub2{font-family:'Rajdhani',sans-serif;font-size:11px;color:#9B5520;}
.d1-divider{border:none;border-top:1px dashed rgba(184,74,14,.25);margin:0 -8px 20px;position:relative;}
.d1-divider::before,.d1-divider::after{content:'';position:absolute;top:-10px;width:18px;height:18px;background:#F5ECD7;border-radius:50%;border:1px dashed rgba(184,74,14,.25);}
.d1-divider::before{left:-24px;} .d1-divider::after{right:-24px;}
.d1-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 16px;margin-bottom:20px;}
.d1-info-item{font-family:'Rajdhani',sans-serif;font-size:12px;color:#6B3A1F;display:flex;gap:6px;align-items:flex-start;line-height:1.5;}
.d1-check{color:#B84A0E;font-weight:700;}
.d1-breakdown{margin-bottom:20px;}
.d1-breakdown-title{font-family:'Rajdhani',sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#9B5520;margin-bottom:8px;}
.d1-breakdown-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px 16px;}
.d1-ref{background:#3D1F00;border-radius:4px;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;}
.d1-ref .rl{font-family:'Rajdhani',sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.4);}
.d1-ref .rv{font-family:'Space Mono',monospace;font-size:13px;color:#D4A017;letter-spacing:1.5px;}
.d1-footer{background:#3D1F00;padding:14px 32px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,.05);}
.d1-footer .contact{font-family:'Rajdhani',sans-serif;font-size:11px;color:rgba(255,255,255,.5);line-height:1.8;}
.d1-footer .brand{text-align:right;}
.d1-footer .brand .bname{font-family:'Cinzel',serif;font-size:12px;color:#D4A017;letter-spacing:1px;}
.d1-footer .brand .bsub{font-family:'Rajdhani',sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.3);margin-top:2px;}
.action-bar{display:flex;gap:10px;justify-content:center;margin-top:22px;}
.btn-print{background:linear-gradient(135deg,#7C2D12,#B84A0E);color:#fff;font-family:'Rajdhani',sans-serif;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:none;border-radius:4px;padding:13px 36px;cursor:pointer;box-shadow:0 4px 16px rgba(184,74,14,.4);transition:opacity .15s;}
.btn-print:hover{opacity:.88;}
.btn-close{background:transparent;color:rgba(255,255,255,.45);font-family:'Rajdhani',sans-serif;font-size:14px;font-weight:600;letter-spacing:1px;border:1px solid rgba(255,255,255,.15);border-radius:4px;padding:13px 24px;cursor:pointer;}
@media print{
  body{background:#fff;padding:0;display:block;}
  .action-bar,.top-row{display:none!important;}
  .d1{box-shadow:none;border-radius:0;}
  .wrap{max-width:100%;}
  .d1-top,.d1-pass-strip,.d1-ref,.d1-footer{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
}
</style>
</head>
<body>
<div class="wrap">
  <div class="top-row">
    <div class="valid-pill"><span class="valid-dot"></span><span class="valid-lbl">Valid Ticket</span></div>
    <span class="booked-on">Booked on ${bookedDate}</span>
  </div>

  <div class="d1">
    <!-- ── HEADER: gov badge + place name LEFT, QR RIGHT (no arch) ── -->
    <div class="d1-top">
      <div class="d1-header-row">

        <!-- Left: gov badge stacked above place name + location -->
        <div class="d1-header-left">
          <div class="d1-gov">
            <div class="d1-emblem">🏛</div>
            <div class="d1-gov-text">
              <div class="sub">Government of Rajasthan</div>
              <div class="main">Department of Tourism</div>
            </div>
          </div>
          <div class="d1-title-block">
            <h1>${placeName}</h1>
            <div class="loc">📍 ${location}</div>
          </div>
        </div>

        <!-- Right: QR — 5px padding, no label, full-size SVG -->
        <div class="d1-qr-wrap">
          <svg viewBox="0 0 ${qrCount} ${qrCount}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" shape-rendering="crispEdges">${qrRects}</svg>
        </div>

      </div>
      <!-- ── arch REMOVED ── -->
    </div>

    <!-- pass strip unchanged -->
    <div class="d1-pass-strip">
      <span class="badge">✦ Single Entry Pass ✦</span>
      <span class="price">${priceBadge}</span>
    </div>

    <div class="d1-body">
      <div class="d1-meta-row">
        <div class="d1-meta-cell"><span class="icon">📅</span><div class="lbl">Visit Date</div><div class="val">${visitDay}</div><div class="sub2">${visitYear}</div></div>
        <div class="d1-meta-cell"><span class="icon">🎟</span><div class="lbl">Visitors</div><div class="val">${visitorVal}</div><div class="sub2">${visitorSub}</div></div>
        <div class="d1-meta-cell"><span class="icon">🕐</span><div class="lbl">Time Slot</div><div class="val">${timeVal}</div><div class="sub2">${timeSub}</div></div>
      </div>
      <hr class="d1-divider"/>
      ${visitorBreakdownRows ? `<div class="d1-breakdown"><div class="d1-breakdown-title">Ticket Breakdown</div><div class="d1-breakdown-grid">${visitorBreakdownRows}${addons ? `<div class="d1-info-item"><span class="d1-check">✓</span><span>Add-ons: ${addons}</span></div>` : ''}</div></div>` : ''}
      <div class="d1-info-grid">
        <div class="d1-info-item"><span class="d1-check">✓</span><span>Carry valid ID proof for verification</span></div>
        <div class="d1-info-item"><span class="d1-check">✓</span><span>Entry on booked date and time only</span></div>
        <div class="d1-info-item"><span class="d1-check">✓</span><span>Non-transferable and non-refundable</span></div>
        <div class="d1-info-item"><span class="d1-check">✓</span><span>Photography restricted in some areas</span></div>
        <div class="d1-info-item"><span class="d1-check">✓</span><span>Arrive 15 mins before your time slot</span></div>
        <div class="d1-info-item"><span class="d1-check">✓</span><span>Follow museum guidelines and staff</span></div>
      </div>
      <div class="d1-ref"><span class="rl">Booking Reference</span><span class="rv">${bookingId}</span></div>
    </div>

    <div class="d1-footer">
      <div class="contact">📞 141-220-0234 &nbsp;|&nbsp; ✉ support@rajasthantourism.gov.in<br/>🌐 obms-tourist.rajasthan.gov.in</div>
      <div class="brand"><div class="bname">OBMS</div><div class="bsub">Rajasthan Tourism</div></div>
    </div>
  </div>

  <div class="action-bar">
    <button class="btn-print" onclick="window.print()">🖨 &nbsp;Print / Save as PDF</button>
    <button class="btn-close" onclick="window.close()">✕ Close</button>
  </div>
</div>
<script>document.fonts.ready.then(() => setTimeout(() => window.print(), 500));</script>
</body>
</html>`;

    w.document.write(html);
    w.document.close();
    setPdfGenerating('');
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  JKK — official application PDF (pdf-lib)
  // ══════════════════════════════════════════════════════════════════════════
  async function downloadJkkApplication(b: any) {
    const bookingId     = String(b.bookingId || b.id || '');
    const placeName     = b.placeName || b.placeDetailDto?.name || 'Jawahar Kala Kendra';
    const createdDate   = b.createdDate      ? moment(b.createdDate).format('DD MMM YYYY')      : '';
    const startDateStr  = b.bookingStartDate ? moment(b.bookingStartDate).format('DD MMM YYYY') : '';
    const endDateStr    = b.bookingEndDate   ? moment(b.bookingEndDate).format('DD MMM YYYY')   : '';
    const applicantName = b?.ticketUserDto?.[0]?.ticketName || b?.userName || '';
    const mobileNo      = b?.ticketUserDto?.[0]?.mobileNo   || b?.mobileNo || '';
    const amount        = b?.totalAmount || 0;

    setPdfGenerating(bookingId);
    try {
      const pdfDoc   = await PDFDocument.create();
      const fontReg  = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const PW = 595.28, PH = 841.89, M = 36;
      const accent = rgb(1, 0.0039, 0.431), muted = rgb(0.45, 0.45, 0.45), dark = rgb(0.1, 0.1, 0.1);
      const page = pdfDoc.addPage([PW, PH]);

      page.drawRectangle({ x: 0, y: PH - 90, width: PW, height: 90, color: rgb(0.09, 0.07, 0.06) });
      page.drawText('Official Application', { x: M, y: PH - 40, size: 12, font: fontBold, color: rgb(1, 1, 1) });
      page.drawText(placeName,              { x: M, y: PH - 64, size: 18, font: fontBold, color: rgb(1, 1, 1) });

      let y = PH - 120;
      const kv = (k: string, v: string) => {
        page.drawText(k, { x: M,       y, size: 10, font: fontBold, color: muted });
        page.drawText(v, { x: M + 140, y, size: 11, font: fontReg,  color: dark  });
        y -= 18;
      };
      kv('Booking ID',     `#${bookingId}`);
      kv('Booking Date',   createdDate || '—');
      kv('Booking Period', `${startDateStr || '—'}${endDateStr ? ` - ${endDateStr}` : ''}`);
      kv('Amount',         `₹${amount}`);
      y -= 8;
      page.drawLine({ start: { x: M, y }, end: { x: PW - M, y }, thickness: 1, color: rgb(0.86, 0.86, 0.86) });
      y -= 20;
      page.drawText('Applicant',                  { x: M, y, size: 12, font: fontBold, color: dark  }); y -= 16;
      page.drawText(applicantName || '—',         { x: M, y, size: 12, font: fontReg,  color: dark  }); y -= 16;
      page.drawText(`Mobile: ${mobileNo || '—'}`, { x: M, y, size: 11, font: fontReg,  color: muted });
      page.drawLine({ start: { x: M, y: M + 30 }, end: { x: PW - M, y: M + 30 }, thickness: 1, color: rgb(0.9, 0.9, 0.9) });
      page.drawText('obms-tourist.rajasthan.gov.in', { x: M, y: M + 14, size: 9, font: fontBold, color: accent });
      downloadBytesAsFile(await pdfDoc.save(), `jkk_booking_${bookingId}.pdf`);
    } catch (err) {
      console.error('JKK PDF error:', err);
      showErrorToastMessage('Failed to generate PDF. Please try again.');
    } finally {
      setPdfGenerating('');
    }
  }

  // ─── Main download entry point ─────────────────────────────────────────────
  function handleDownloadTicket(b: any) {
    if (isJkkBooking(b)) { void downloadJkkApplication(b); return; }
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

  // ─── Date filter helpers ───────────────────────────────────────────────────
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

  // ─── Render ────────────────────────────────────────────────────────────────
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
              <div  style={{marginTop: '16px'}} className="header-actions">
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
              { num: stats.total,       lbl: 'Total Bookings', cls: ''       },
              { num: stats.upcoming,    lbl: 'Upcoming',       cls: 'orange' },
              { num: stats.completed,   lbl: 'Completed',      cls: 'green'  },
              { num: stats.cancelled,   lbl: 'Cancelled',      cls: 'red'    },
              { num: `₹${stats.spent}`, lbl: 'Total Spent',    cls: ''       },
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
            ) : filteredBookings.map((b) => {
              const status    = getBookingStatus(b);
              const placeName = b.placeName || b.placeDetailDto?.name || b.packageDto?.packageName || 'Booking';
              const district  = b.placeDetailDto?.districtName || '';
              const fullImg   = resolveBookingImage(b);
              const totalUsers = b.totalUsers || (b.ticketUserDto?.reduce((s: number, t: any) => s + (t.qty || 0), 0)) || 0;
              const bId = String(b.bookingId || b.id);
              const isGen = pdfGenerating === bId;

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
                        <div className="bm-item">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                          </svg>
                          Visitors: <span>{totalUsers}</span>
                        </div>
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
                          ₹{b.totalAmount || 0}
                        </div>
                        <div className="booking-price-sub">Booked {formatDate(b.createdDate)}</div>
                      </div>
                      <div className="booking-actions">
                        {/* View Ticket — only when payment succeeded */}
                        {isPaymentSuccess(b) && !b.cancelled && !b.refund && (
                          <button className="bc-btn bc-btn-primary" onClick={(e) => { e.stopPropagation(); openDrawer(b); }}>
                            View Ticket
                          </button>
                        )}

                        {/* Download — only when payment succeeded */}
                        {isPaymentSuccess(b) && !b.cancelled && !b.refund && (
                          <button
                            className="bc-btn bc-btn-outline"
                            disabled={isGen}
                            onClick={(e) => { e.stopPropagation(); handleDownloadTicket(b); }}
                          >
                            {isGen ? '⏳ Generating...' : '📥 Download'}
                          </button>
                        )}

                        {/* Reverify Payment — for non-success bookings, within 5-min window */}
                        {!isPaymentSuccess(b) && !b.cancelled && !b.refund && isWithinReverifyWindow(b) && (
                          <button
                            className="bc-btn bc-btn-primary"
                            disabled={reverifyMutation.isPending}
                            onClick={(e) => { e.stopPropagation(); handleReverify(b); }}
                          >
                            {reverifyMutation.isPending ? '⏳ Verifying…' : '🔄 Re-verify Payment'}
                          </button>
                        )}

                        {/* Web Check-in — only when payment succeeded */}
                        {isPaymentSuccess(b) && isCheckinEligible(b) && (
                          <button
                            className="bc-btn bc-btn-outline"
                            style={{ background: '#E8F5E9', borderColor: '#4CAF50', color: '#2E7D32' }}
                            onClick={(e) => { e.stopPropagation(); handleWebCheckIn(b); }}
                          >✓ Web Check-in</button>
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
                const b = selectedBooking;
                const status = getBookingStatus(b);
                const placeName = b.placeName || b.placeDetailDto?.name || b.packageDto?.packageName || 'Booking';
                const district  = b.placeDetailDto?.districtName || '';
                const fullImg   = resolveBookingImage(b);
                const bId   = String(b.bookingId || b.id);
                const isGen = pdfGenerating === bId;
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
                            <div className="ticket-field-lbl" style={{ marginBottom: 6 }}>Visitors ({b.totalUsers || 0})</div>
                            <div className="ticket-visitors">
                              {(b.ticketUserDto || []).map((t: any, i: number) => (
                                <div key={i} className="visitor-badge">🎟 {t.ticketName} × {t.qty}</div>
                              ))}
                            </div>
                          </div>
                          {/* QR Code — only when payment succeeded */}
                          {isPaymentSuccess(b) && (b.qrDetail || b.id) && (
                            <div style={{ textAlign: 'center', padding: '14px 0', cursor: 'pointer' }} onClick={() => { setQrData(b.qrDetail || JSON.stringify({ type: 'BOOKING', data: { ticketBookingId: b.id || b.bookingId } })); setQrModalOpen(true); }}>
                              <div className="ticket-field-lbl">QR Code</div>
                              <div style={{ display: 'inline-block', padding: 10, background: '#fff', border: '1px solid #E8DAC5', borderRadius: 8, marginTop: 8 }}/>
                              <div style={{ fontSize: 10, color: '#7A6A58', marginTop: 4 }}>Tap to enlarge · Scan at entry</div>
                            </div>
                          )}
                        </div>
                        <div className="ticket-total-bar">
                          <span className="ttb-lbl">{b.cancelled || b.refund ? 'Refunded Amount' : 'Total Amount Paid'}</span>
                          <span className="ttb-val">₹{b.totalAmount || 0}</span>
                        </div>
                      </div>
                      <div className="drawer-actions">
                        {/* Print / Download — only for successful payments */}
                        {isPaymentSuccess(b) && !b.cancelled && !b.refund && (
                          <button className="btn-drawer btn-drawer-primary" disabled={isGen} onClick={() => handleDownloadTicket(b)}>
                            {isGen ? '⏳ Generating...' : '🖨 Print / Download Ticket'}
                          </button>
                        )}
                        {/* Reverify Payment — for non-success bookings, within 5-min window */}
                        {!isPaymentSuccess(b) && !b.cancelled && !b.refund && isWithinReverifyWindow(b) && (
                          <button
                            className="btn-drawer btn-drawer-primary"
                            disabled={reverifyMutation.isPending}
                            onClick={() => handleReverify(b)}
                          >
                            {reverifyMutation.isPending ? '⏳ Verifying…' : '🔄 Re-verify Payment'}
                          </button>
                        )}
                        {isPaymentSuccess(b) && isCheckinEligible(b) && (
                          <button className="btn-drawer btn-drawer-outline" style={{ borderColor: '#2E7D32', color: '#2E7D32' }} onClick={() => handleWebCheckIn(b)}>
                            ✓ Web Check-in
                          </button>
                        )}
                        {isJkkBooking(b) && b.makePayment && (
                          <button className="btn-drawer btn-drawer-primary" onClick={() => showSuccessToastMessage('Redirecting to payment...')}>💳 Make Payment</button>
                        )}
                        {isJkkBooking(b) && b.approved && (
                          <div style={{ padding: '10px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600, textAlign: 'center',
                            background: b.approved === 'APPROVED' ? '#E8F5E9' : b.approved === 'REJECT' ? '#FFEBEE' : '#FFF8E1',
                            color: b.approved === 'APPROVED' ? '#2E7D32' : b.approved === 'REJECT' ? '#C62828' : '#F57F17' }}>
                            JKK Status: {b.approved}
                          </div>
                        )}
                        {isPaymentSuccess(b) && (
                          <button className="btn-drawer btn-drawer-outline" onClick={() => openShareModalForBooking(b)}>📤 Share Ticket</button>
                        )}
                        <button className="btn-drawer btn-drawer-outline" onClick={() => openRaiseIssue(b)}>🛟 Raise Issue</button>
                        {isPaymentSuccess(b) && canCancel(b) && <button className="btn-drawer btn-drawer-danger" onClick={() => handleCancelClick(b)}>✕ Cancel Booking</button>}
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
                        <input type="text" className="form-input" value={(bankForm as any)[key]}
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
                  <div style={{ padding: 16, background: '#fff', border: '2px solid #E8DAC5', borderRadius: 12 }}/>
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
                    Choose an app to share the ticket PDF for booking #{shareBooking.bookingId || shareBooking.id}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    {[
                      {
                        key: 'facebook', label: 'Facebook', bg: '#E8F0FE', color: '#1877F2',
                        icon: (<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.7-1.6h1.5V4.8c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4V11H8v3h2.5v8h3z"/></svg>),
                      },
                      {
                        key: 'whatsapp', label: 'WhatsApp', bg: '#E8F8EF', color: '#25D366',
                        icon: (<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M20.5 11.8c0 4.7-3.8 8.5-8.5 8.5-1.5 0-2.9-.4-4.2-1.1L3 20.5l1.3-4.6A8.4 8.4 0 0 1 3.5 12c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.3zm-8.5-7a7 7 0 0 0-6.1 10.4l.3.5-.8 2.8 2.8-.8.5.3a7 7 0 1 0 3.3-13.2zm4.1 8.9c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.4.1l-.6.7c-.1.1-.2.2-.4.1-.2-.1-.8-.3-1.5-1-.6-.6-1-1.3-1.1-1.5-.1-.2 0-.3.1-.4l.3-.3.2-.3.1-.3c0-.1 0-.2 0-.3l-.7-1.6c-.2-.4-.3-.3-.4-.3h-.4c-.1 0-.3.1-.4.2-.1.1-.6.5-.6 1.3s.6 1.5.7 1.6c.1.1 1.2 1.8 3 2.5 1.8.8 1.8.5 2.2.5.4-.1 1.2-.5 1.4-1 .2-.5.2-.9.1-1 0-.1-.2-.1-.4-.2z"/></svg>),
                      },
                      {
                        key: 'instagram', label: 'Instagram', bg: '#FDF0F7', color: '#E1306C',
                        icon: (<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>),
                      },
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => void handleShareTicket(item.key as 'facebook' | 'whatsapp' | 'instagram')}
                        disabled={!!shareLoading}
                        style={{
                          border: '1px solid #E8DAC5', borderRadius: 16, background: '#fff',
                          padding: '16px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
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