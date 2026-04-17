'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import type { BookingState } from '../../types/booking.types';
import {
  useJkkCategories,
  useJkkSubCategories,
  useJkkPlaceTypes,
  useJkkTicketConfig,
  useJkkShifts,
  useJkkPriceCalculation,
  useCreateJkkBooking,
  useConfirmJkkBooking,
  useJkkCalendarAvailability,
  useJkkCheckAvailability,
  useObmsPlaceId,
  useFileUpload,
} from '../../hooks/useBookingApi';
import LoadingSpinner from '../shared/LoadingSpinner';
import { formatRupees, handlePaymentRedirect } from '../../utils/payment';
import { showSuccessToastMessage, showErrorToastMessage } from '@/utils/toast.utils';

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

/* ─── Types ─────────────────────────────────────────────────────────────────── */

interface Props {
  state: BookingState;
  onUpdate: (patch: Partial<BookingState>) => void;
  onBack: () => void;
  userId: string;
}

type SubStep =
  | 'disclaimer'
  | 'dates'
  | 'category'
  | 'subcategory'
  | 'shifts'
  | 'type'
  | 'applicant'
  | 'event'
  | 'review';

/* ─── Constants ─────────────────────────────────────────────────────────────── */

const PREP_DAY_VENUES = ['shilpgram', 'south extension'];

const GALLERY_CATEGORIES = [
  'SOLO', 'GROUP', 'ACADEMIC_INSTITUTION_EDUCATIONAL', 'COMMERCIAL',
];

const PLACES_CATEGORIES = [
  'INDIVIDUAL', 'ACADEMIC', 'GOVERNMENT', 'COMMERCIAL',
  'NON_COMMERCIAL', 'NON_GOVERNMENT_ORGANISATION', 'OTHERS',
];

/* ─── Helper: date string offset ────────────────────────────────────────────── */

function dateStringOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

/* ─── Component ─────────────────────────────────────────────────────────────── */

export default function JkkStep({ state, onUpdate, onBack, userId }: Props) {
  const [subStep, setSubStep] = useState<SubStep>('disclaimer');
  const [processing, setProcessing] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Preparation days (for Shilpgram / South Extension)
  const [prepDays, setPrepDays] = useState(1);

  // Multi-select shifts
  const [selectedShifts, setSelectedShifts] = useState<{ id: string; name: string }[]>([]);
  const [availShifts, setAvailShifts] = useState<any[]>([]);

  // Availability messages
  const [calAvailMsg, setCalAvailMsg] = useState('');
  const [shiftAvailMsg, setShiftAvailMsg] = useState('');

  // Applicant form
  const [applicant, setApplicant] = useState({
    fullName: '', email: '', mobileNo: '', address: '',
    category: '',
    isSponsored: '', sponsorName: '',
    haveGst: '', gstNo: '',
    isSocietyRegistered: '',
    acRequired: '',
    lightCategory: '',
    fifteenLights: false,
    thirtyLights: false,
  });

  // Event/venue form
  const [eventForm, setEventForm] = useState({
    programDetails: '',
    previousDetails: '',
    guestDetails: '',
    organizationDetails: '',
    projectorRequired: false,
    audienceEntryBy: '',
  });

  // Bank form
  const [bankForm, setBankForm] = useState({
    bankName: '', accountNumber: '', ifscCode: '',
    accountHolderName: '', accountType: '',
  });

  // File uploads: each is an array of { url, name }
  const [societyDoc, setSocietyDoc] = useState<{ url: string; name: string } | null>(null);
  const [programDocs, setProgramDocs] = useState<{ url: string; name: string }[]>([]);
  const [prevProgramDocs, setPrevProgramDocs] = useState<{ url: string; name: string }[]>([]);
  const [guestDocs, setGuestDocs] = useState<{ url: string; name: string }[]>([]);
  const [orgDocs, setOrgDocs] = useState<{ url: string; name: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  /* ── Booking state shortcut ────────────────────────────────────────────────── */

  const jkk = state.jkk;

  function updateJkk(patch: Partial<typeof state.jkk>) {
    onUpdate({ jkk: { ...jkk, ...patch } });
  }

  /* ── API hooks ─────────────────────────────────────────────────────────────── */

  const { data: categories = [], isLoading: loadingCats } = useJkkCategories();
  const { data: subCategories = [], isLoading: loadingSubs } = useJkkSubCategories(jkk.selectedCategory?.id ?? null);
  const { data: placeTypes = [], isLoading: loadingTypes } = useJkkPlaceTypes(jkk.selectedSubCategory?.id ?? null);
  const { data: ticketConfigs = [] } = useJkkTicketConfig(jkk.selectedPlaceType?.id ?? null);

  const shiftsMutation = useJkkShifts();
  const priceCalc = useJkkPriceCalculation();
  const createJkk = useCreateJkkBooking();
  const confirmJkk = useConfirmJkkBooking();
  const calendarAvail = useJkkCalendarAvailability();
  const shiftAvail = useJkkCheckAvailability();
  const obmsPlaceMutation = useObmsPlaceId();
  const fileUpload = useFileUpload();

  /* ── Resolve OBMS placeId from Strapi locationId on mount ──────────────────── */
  const [obmsPlaceId, setObmsPlaceId] = useState<string>('');
  const resolvedRef = useRef(false);

  useEffect(() => {
    if (resolvedRef.current) return;
    const locationId = state.config.locationId;
    if (!locationId) return;

    resolvedRef.current = true;
    obmsPlaceMutation.mutateAsync(locationId)
      .then((place: any) => {
        if (place?.id) {
          setObmsPlaceId(place.id);
        }
      })
      .catch(() => {
        resolvedRef.current = false;
      });
  }, [state.config.locationId]);

  /* ── Derived flags ─────────────────────────────────────────────────────────── */

  const isGalleries = jkk.selectedCategory?.name?.toLowerCase?.()?.includes('galleries') ?? false;
  const isPlaces = jkk.selectedCategory?.name?.toLowerCase?.()?.includes('place') ?? false;
  const categoryOptions = isGalleries ? GALLERY_CATEGORIES : PLACES_CATEGORIES;

  const needsPrepDays = PREP_DAY_VENUES.some(
    (v) => jkk.selectedSubCategory?.name?.toLowerCase?.()?.includes(v),
  );

  const showProjector = (ticketConfigs as any[]).some(
    (t: any) => t?.name?.toLowerCase?.()?.includes('projector fee'),
  );
  const showAcOption = (ticketConfigs as any[]).some(
    (t: any) => {
      const n = t?.name?.toLowerCase?.() ?? '';
      return (n.includes('with ac') || n.includes('without ac')) && !n.includes('risl');
    },
  );
  const showLights = jkk.selectedSubCategory?.name?.toLowerCase?.()?.includes('madhyavarti') ?? false;

  // JKK min date = today + 3 days; max = +93 days
  const minDate = useMemo(() => dateStringOffset(3), []);
  const maxDate = useMemo(() => dateStringOffset(93), []);

  /* ── Actions ───────────────────────────────────────────────────────────────── */

  async function checkCalendarAvailability() {
    if (!jkk.selectedCategory?.id || !jkk.selectedSubCategory?.id ||
        !jkk.bookingStartDate || !jkk.bookingEndDate) return;
    setCalAvailMsg('');
    try {
      const result = await calendarAvail.mutateAsync({
        bookingStartDate: new Date(jkk.bookingStartDate).getTime(),
        bookingEndDate: new Date(jkk.bookingEndDate).getTime(),
        categoryId: jkk.selectedCategory.id,
        subCategoryId: jkk.selectedSubCategory.id,
        preDays: needsPrepDays ? prepDays : 0,
        auth: true,
      });
      const status = result?.status ?? result;
      if (status === 'SUCCESS') {
        setCalAvailMsg('Available');
      } else {
        setCalAvailMsg(typeof result === 'string' ? result : result?.message || 'Not available for selected dates');
      }
    } catch {
      setCalAvailMsg('Availability check failed');
    }
  }

  async function fetchShifts() {
    try {
      const startMs = new Date(jkk.bookingStartDate).getTime();
      const endMs = new Date(jkk.bookingEndDate).getTime();
      const result = await shiftsMutation.mutateAsync({
        startDate: String(startMs),
        endDate: String(endMs),
        categoryId: jkk.selectedCategory?.id ?? '',
        subCategoryId: jkk.selectedSubCategory?.id ?? '',
      });
      setAvailShifts(result ?? []);
      setSelectedShifts([]);
      setShiftAvailMsg('');
      setSubStep('shifts');
    } catch {
      showErrorToastMessage('Failed to fetch shifts');
    }
  }

  async function checkShiftAvailability(shifts: { id: string; name: string }[]) {
    if (!shifts.length) return;
    setShiftAvailMsg('');
    try {
      const result = await shiftAvail.mutateAsync({
        bookingStartDate: new Date(jkk.bookingStartDate).getTime(),
        bookingEndDate: new Date(jkk.bookingEndDate).getTime(),
        categoryId: jkk.selectedCategory?.id,
        subCategoryId: jkk.selectedSubCategory?.id,
        shiftId: [shifts[0]?.id],
      });
      const status = result?.status ?? result;
      if (status === 'SUCCESS') {
        setShiftAvailMsg('Available');
        updateJkk({ selectedShift: shifts[0], shifts: availShifts });
      } else {
        setShiftAvailMsg(typeof result === 'string' ? result : result?.message || 'Selected shift not available');
      }
    } catch {
      setShiftAvailMsg('Shift availability check failed');
    }
  }

  function toggleShift(shift: any) {
    setShiftAvailMsg('');
    setSelectedShifts((prev) => {
      const exists = prev.find((s) => s.id === shift.id);
      const next = exists
        ? prev.filter((s) => s.id !== shift.id)
        : [...prev, { id: shift.id, name: shift.name }];
      if (next.length > 0) {
        checkShiftAvailability(next);
      }
      return next;
    });
  }

  async function calculatePrice() {
    try {
      const result = await priceCalc.mutateAsync({
        categoryId: jkk.selectedCategory?.id,
        subCategoryId: jkk.selectedSubCategory?.id,
        typeId: jkk.selectedPlaceType?.id,
        ac: needsPrepDays ? false : applicant.acRequired?.toLowerCase() === 'yes',
        projector: eventForm.projectorRequired,
        bookingStartDate: new Date(jkk.bookingStartDate).getTime(),
        bookingEndDate: new Date(jkk.bookingEndDate).getTime(),
        shiftId: selectedShifts.map((s) => s.id),
        preDays: needsPrepDays ? prepDays : 0,
        fifteenLights: applicant.fifteenLights,
        thirtyLights: applicant.thirtyLights,
      });
      updateJkk({ calculatedPrice: result?.totalAmount ?? result?.total ?? 0 });
      setSubStep('review');
    } catch {
      // error handled by hook
    }
  }

  /* ── Validations ───────────────────────────────────────────────────────────── */

  function validateApplicant(): boolean {
    if (!applicant.fullName.trim()) { showErrorToastMessage('Full name is required'); return false; }
    if (!applicant.email.trim() || !/\S+@\S+\.\S+/.test(applicant.email)) { showErrorToastMessage('Valid email is required'); return false; }
    if (!applicant.mobileNo.trim()) { showErrorToastMessage('Mobile number is required'); return false; }
    if (!applicant.category) { showErrorToastMessage('Category is required'); return false; }
    if (!applicant.address.trim()) { showErrorToastMessage('Address is required'); return false; }
    if (!applicant.isSocietyRegistered) { showErrorToastMessage('Society registration status required'); return false; }
    if (applicant.isSponsored === 'yes' && !applicant.sponsorName.trim()) { showErrorToastMessage('Sponsor name required'); return false; }
    return true;
  }

  function validateEvent(): boolean {
    if (!eventForm.programDetails.trim()) { showErrorToastMessage('Program details required'); return false; }
    if (!bankForm.bankName.trim()) { showErrorToastMessage('Bank name required'); return false; }
    if (!bankForm.accountNumber.trim()) { showErrorToastMessage('Account number required'); return false; }
    if (!bankForm.ifscCode.trim()) { showErrorToastMessage('IFSC code required'); return false; }
    if (!bankForm.accountHolderName.trim()) { showErrorToastMessage('Account holder name required'); return false; }
    if (!bankForm.accountType) { showErrorToastMessage('Account type required'); return false; }
    return true;
  }

  /* ── File upload helper ─────────────────────────────────────────────────────── */

  async function handleFileUpload(
    file: File,
    setter: (fn: (prev: any) => any) => void,
    maxCount: number,
    currentCount: number,
    isSingle = false,
  ) {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      showErrorToastMessage('Only JPG, JPEG, PNG images or PDF files are allowed.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      showErrorToastMessage('File size must not exceed 2MB.');
      return;
    }
    if (!isSingle && currentCount >= maxCount) {
      showErrorToastMessage(`Maximum ${maxCount} files allowed.`);
      return;
    }
    setUploading(true);
    try {
      const result = await fileUpload.mutateAsync(file);
      const url = result?.url || result;
      if (isSingle) {
        setter(() => ({ url, name: file.name }));
      } else {
        setter((prev: any[]) => [...prev, { url, name: file.name }]);
      }
    } catch { /* handled by hook */ }
    setUploading(false);
  }

  /* ── Create + Confirm + Pay ────────────────────────────────────────────────── */

  async function handlePay() {
    if (!termsAccepted) { showErrorToastMessage('Please accept the terms'); return; }
    setProcessing(true);
    try {
      const resolvedPlaceId = obmsPlaceId || state.config.placeId || state.config.locationId;
      const payload: any = {
        placeId: resolvedPlaceId,
        categoryId: jkk.selectedCategory?.id,
        subCategoryId: jkk.selectedSubCategory?.id,
        shiftId: selectedShifts.map((s) => s.id),
        typeId: jkk.selectedPlaceType?.id,
        exhibitionType: jkk.selectedPlaceType?.name,
        bookingStartDate: new Date(jkk.bookingStartDate).getTime(),
        bookingEndDate: new Date(jkk.bookingEndDate).getTime(),
        preDays: needsPrepDays ? prepDays : 0,
        applicantName: applicant.fullName,
        address: applicant.address,
        gstNo: applicant.haveGst === 'yes' ? applicant.gstNo : '',
        mobileNo: applicant.mobileNo,
        email: applicant.email,
        category: applicant.category,
        societyRegistered: applicant.isSocietyRegistered === 'yes',
        societyRegisteredDocUrl: societyDoc?.url ?? '',
        projector: eventForm.projectorRequired,
        ac: needsPrepDays ? false : applicant.acRequired?.toLowerCase() === 'yes',
        fifteenLights: applicant.fifteenLights,
        thirtyLigths: applicant.thirtyLights, // keep backend typo
        detailsOfProgram: [{ description: eventForm.programDetails, imageList: programDocs.map((d) => ({ imageUrl: d.url })) }],
        guestDetails: [{ description: eventForm.guestDetails || '', imageList: guestDocs.map((d) => ({ imageUrl: d.url })) }],
        organizationDetails: [{ description: eventForm.organizationDetails || '', imageList: orgDocs.map((d) => ({ imageUrl: d.url })) }],
        previousDetails: [{ description: eventForm.previousDetails || '', imageList: prevProgramDocs.map((d) => ({ imageUrl: d.url })) }],
        jkkBankDetails: {
          bankName: bankForm.bankName,
          accountNumber: bankForm.accountNumber,
          bankIfsc: bankForm.ifscCode,
          accountHolderName: bankForm.accountHolderName,
          accountType: bankForm.accountType,
        },
        sponsoredName: applicant.isSponsored === 'yes' ? applicant.sponsorName : '',
        audienceEntryByTicket: eventForm.audienceEntryBy === 'TICKET',
        audienceEntryByInvitation: eventForm.audienceEntryBy === 'INVITATION',
        bankDetails: true,
        dataConsent: false,
      };

      const bookingResult = await createJkk.mutateAsync(payload);
      if (!bookingResult?.id) { setProcessing(false); return; }

      showSuccessToastMessage('JKK booking created! Proceeding to payment...');
      const confirmResult = await confirmJkk.mutateAsync({ bookingId: bookingResult.id });
      handlePaymentRedirect(confirmResult);
    } catch {
      setProcessing(false);
    }
  }

  /* ── Style constants ───────────────────────────────────────────────────────── */

  const inputCls = 'w-full px-3.5 py-2.5 border border-[#E8DAC5] rounded-[10px] text-sm focus:outline-none focus:border-[#E8631A]';
  const labelCls = 'block text-[10px] font-bold text-[#2C2017] mb-1.5 uppercase tracking-[0.3px]';
  const btnBack = 'flex-1 py-3 border-2 border-[#E8DAC5] text-[#2C2017] font-semibold rounded-full hover:bg-[#F5E8CC] transition-colors text-sm';
  const btnNext = 'flex-1 py-3 bg-[#E8631A] text-white font-bold rounded-full hover:bg-[#C04E0A] disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm';
  const cardCls = 'w-full p-3.5 rounded-[10px] border-2 border-[#E8DAC5] text-sm font-medium text-left text-[#2C2017] hover:border-[#E8631A] hover:bg-[#FFF5EE] transition-all';
  const cardActiveCls = 'w-full p-3.5 rounded-[10px] border-2 border-[#E8631A] bg-[#FFF5EE] text-sm font-medium text-left text-[#E8631A] transition-all';

  /* ── File upload UI helper ───────────────────────────────────────────────── */

  function renderFileUpload(
    label: string,
    files: { url: string; name: string }[],
    setter: React.Dispatch<React.SetStateAction<{ url: string; name: string }[]>>,
    maxCount: number,
  ) {
    return (
      <div>
        <label className={labelCls}>{label} (max {maxCount})</label>
        <div className="space-y-1">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] text-[#2C2017] bg-[#F5E8CC] px-2 py-1 rounded-lg">
              <span className="truncate flex-1">{f.name}</span>
              <button type="button" onClick={() => setter((p) => p.filter((_, j) => j !== i))} className="text-red-500 text-xs">✕</button>
            </div>
          ))}
          {files.length < maxCount && (
            <label className="inline-flex items-center gap-1 px-3 py-1.5 border border-dashed border-[#E8DAC5] rounded-lg text-[10px] text-[#7A6A58] cursor-pointer hover:border-[#E8631A] hover:text-[#E8631A] transition-colors">
              {uploading ? 'Uploading...' : '+ Upload File'}
              <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, setter as any, maxCount, files.length);
                  e.target.value = '';
                }} />
            </label>
          )}
        </div>
        <p className="text-[9px] text-[#7A6A58] mt-0.5">JPG, PNG, PDF — max 2MB each</p>
      </div>
    );
  }

  function renderSingleFileUpload(
    label: string,
    file: { url: string; name: string } | null,
    setter: React.Dispatch<React.SetStateAction<{ url: string; name: string } | null>>,
    disabled = false,
  ) {
    return (
      <div>
        <label className={labelCls}>{label}</label>
        {file ? (
          <div className="flex items-center gap-2 text-[10px] text-[#2C2017] bg-[#F5E8CC] px-2 py-1 rounded-lg">
            <span className="truncate flex-1">{file.name}</span>
            <button type="button" onClick={() => setter(null)} className="text-red-500 text-xs">✕</button>
          </div>
        ) : (
          <label className={`inline-flex items-center gap-1 px-3 py-1.5 border border-dashed border-[#E8DAC5] rounded-lg text-[10px] text-[#7A6A58] transition-colors ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:border-[#E8631A] hover:text-[#E8631A]'}`}>
            {uploading ? 'Uploading...' : '+ Upload File'}
            <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf"
              disabled={disabled || uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, setter as any, 1, 0, true);
                e.target.value = '';
              }} />
          </label>
        )}
        <p className="text-[9px] text-[#7A6A58] mt-0.5">JPG, PNG, PDF — max 2MB</p>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════════════════════
     RENDER STEPS — same sequence as old project
     ═══════════════════════════════════════════════════════════════════════════ */

  /* ── Step 0: Disclaimer ────────────────────────────────────────────────────── */
  if (subStep === 'disclaimer') {
    return (
      <div className="space-y-4">
        <div className="bg-[#FFF5EE] rounded-[12px] p-4 text-xs text-[#2C2017] leading-relaxed space-y-2">
          <p className="font-bold text-sm">Important Notice</p>
          <p>1. Jawahar Kala Kendra (JKK) bookings require advance planning. Minimum booking date is 3 days from today.</p>
          <p>2. All bookings are subject to availability and approval by the JKK administration.</p>
          <p>3. Please ensure all applicant and event details are accurate before submitting.</p>
          <p>4. Bank details are mandatory for security deposit processing.</p>
          <p>5. Cancellation and refund policies as per JKK rules apply.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onBack} className={btnBack}>← Close</button>
          <button onClick={() => setSubStep('dates')} className={btnNext}>
            Click to Proceed →
          </button>
        </div>
      </div>
    );
  }

  /* ── Step 1: Date Range Selection ──────────────────────────────────────────── */
  if (subStep === 'dates') {
    return (
      <div className="space-y-4">
        <p className="text-xs text-[#7A6A58] font-semibold">Select Booking Dates</p>
        <p className="text-[10px] text-[#7A6A58]">
          JKK bookings must be at least 3 days in advance. You can book up to 90 days ahead.
        </p>
        <div>
          <label className={labelCls}>Start Date</label>
          <input type="date" value={jkk.bookingStartDate} min={minDate} max={maxDate}
            onChange={(e) => {
              const val = e.target.value;
              updateJkk({
                bookingStartDate: val,
                bookingEndDate: val > jkk.bookingEndDate ? val : jkk.bookingEndDate,
              });
            }}
            className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>End Date</label>
          <input type="date"
            value={jkk.bookingEndDate}
            min={jkk.bookingStartDate || minDate}
            max={maxDate}
            onChange={(e) => updateJkk({ bookingEndDate: e.target.value })}
            className={inputCls} />
        </div>
        <div className="flex gap-3">
          <button onClick={() => setSubStep('disclaimer')} className={btnBack}>← Back</button>
          <button
            onClick={() => setSubStep('category')}
            disabled={!jkk.bookingStartDate || !jkk.bookingEndDate || jkk.bookingStartDate < minDate}
            className={btnNext}>
            Continue →
          </button>
        </div>
      </div>
    );
  }

  /* ── Step 2: Booking Type (Category) ───────────────────────────────────────── */
  if (subStep === 'category') {
    if (loadingCats) return <LoadingSpinner message="Loading booking types..." />;
    return (
      <div className="space-y-4">
        <p className="text-xs text-[#7A6A58] font-semibold">Select Booking Type</p>
        <p className="text-[10px] text-[#7A6A58]">
          📅 {jkk.bookingStartDate} → {jkk.bookingEndDate}
        </p>
        <div className="space-y-2">
          {(categories as any[]).map((cat: any) => (
            <button key={cat.id}
              onClick={() => {
                updateJkk({
                  selectedCategory: cat,
                  selectedSubCategory: null,
                  selectedPlaceType: null,
                });
                setCalAvailMsg('');
                setSubStep('subcategory');
              }}
              className={cardCls}>
              {cat.name}
            </button>
          ))}
        </div>
        <button onClick={() => setSubStep('dates')} className={`w-full ${btnBack}`}>← Back</button>
      </div>
    );
  }

  /* ── Step 3: Sub-category (Gallery / Venue) + Prep Days + Availability ────── */
  if (subStep === 'subcategory') {
    if (loadingSubs) return <LoadingSpinner message="Loading sub-categories..." />;
    return (
      <div className="space-y-4">
        <p className="text-xs text-[#7A6A58] font-semibold">
          {isGalleries ? 'Select Gallery' : 'Select Auditorium / Venue'}
        </p>
        <p className="text-[10px] text-[#7A6A58]">
          {jkk.selectedCategory?.name} · {jkk.bookingStartDate} → {jkk.bookingEndDate}
        </p>

        <div className="space-y-2">
          {(subCategories as any[]).map((sub: any) => (
            <button key={sub.id}
              onClick={() => {
                updateJkk({ selectedSubCategory: sub, selectedPlaceType: null });
                setCalAvailMsg('');
              }}
              className={jkk.selectedSubCategory?.id === sub.id ? cardActiveCls : cardCls}>
              {sub.name}
            </button>
          ))}
        </div>

        {/* Preparation days — only for Shilpgram / South Extension */}
        {jkk.selectedSubCategory && needsPrepDays && (
          <div>
            <label className={labelCls}>Preparation Days</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((d) => (
                <button key={d} onClick={() => { setPrepDays(d); setCalAvailMsg(''); }}
                  className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${prepDays === d ? 'border-[#E8631A] bg-[#FFF5EE] text-[#E8631A]' : 'border-[#E8DAC5] text-[#2C2017]'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Availability result */}
        {calAvailMsg && (
          <div className={`px-4 py-2.5 rounded-[10px] text-xs font-medium ${calAvailMsg === 'Available' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {calAvailMsg === 'Available' ? '✓ Dates are available' : calAvailMsg}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={() => { updateJkk({ selectedSubCategory: null }); setCalAvailMsg(''); setSubStep('category'); }} className={btnBack}>← Back</button>
          {!jkk.selectedSubCategory?.id ? (
            <button disabled className={btnNext}>Select a venue</button>
          ) : calAvailMsg !== 'Available' ? (
            <button
              onClick={checkCalendarAvailability}
              disabled={calendarAvail.isPending}
              className={btnNext}>
              {calendarAvail.isPending ? 'Checking...' : 'Check Availability'}
            </button>
          ) : (
            <button onClick={fetchShifts} disabled={shiftsMutation.isPending} className={btnNext}>
              {shiftsMutation.isPending ? 'Loading...' : 'Continue →'}
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ── Step 4: Shift Selection (multi-select) + Availability ─────────────────── */
  if (subStep === 'shifts') {
    return (
      <div className="space-y-4">
        <p className="text-xs text-[#7A6A58] font-semibold">Select Shift Type</p>
        <p className="text-[10px] text-[#7A6A58]">
          {jkk.selectedCategory?.name} · {jkk.selectedSubCategory?.name}
        </p>

        {availShifts.length === 0 ? (
          <div className="text-xs text-[#7A6A58] py-4 text-center">No shifts available for selected dates.</div>
        ) : (
          <div className="space-y-2">
            {availShifts.map((shift: any) => {
              const isSelected = selectedShifts.some((s) => s.id === shift.id);
              return (
                <button key={shift.id} onClick={() => toggleShift(shift)}
                  className={isSelected ? cardActiveCls : cardCls}>
                  <div className="flex items-center justify-between">
                    <span>{shift.name}</span>
                    {isSelected && <span className="text-[#E8631A]">✓</span>}
                  </div>
                  {(shift.startTime || shift.endTime) && (
                    <div className="text-[10px] opacity-60 mt-0.5">
                      {shift.startTime} — {shift.endTime}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {shiftAvailMsg && (
          <div className={`px-4 py-2.5 rounded-[10px] text-xs font-medium ${shiftAvailMsg === 'Available' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {shiftAvailMsg === 'Available' ? '✓ Shift is available' : shiftAvailMsg}
          </div>
        )}

        {shiftAvail.isPending && (
          <div className="text-xs text-[#E8631A] flex items-center gap-1.5">
            <div className="w-3 h-3 border-2 border-[#E8631A]/30 border-t-[#E8631A] rounded-full animate-spin" />
            Checking availability...
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={() => { setSelectedShifts([]); setShiftAvailMsg(''); setSubStep('subcategory'); }} className={btnBack}>← Back</button>
          <button
            onClick={() => setSubStep('type')}
            disabled={selectedShifts.length === 0 || shiftAvailMsg !== 'Available'}
            className={btnNext}>
            Continue →
          </button>
        </div>
      </div>
    );
  }

  /* ── Step 5: Exhibition / Venue Use Type ────────────────────────────────────── */
  if (subStep === 'type') {
    if (loadingTypes) return <LoadingSpinner message="Loading venue types..." />;
    return (
      <div className="space-y-4">
        <p className="text-xs text-[#7A6A58] font-semibold">Select Exhibition Type</p>
        <p className="text-[10px] text-[#7A6A58]">
          {jkk.selectedCategory?.name} · {jkk.selectedSubCategory?.name} · {selectedShifts.map((s) => s.name).join(', ')}
        </p>
        <div className="space-y-2">
          {(placeTypes as any[]).map((type: any) => (
            <button key={type.id}
              onClick={() => {
                updateJkk({ selectedPlaceType: type });
                setSubStep('applicant');
              }}
              className={cardCls}>
              {type.name}
            </button>
          ))}
        </div>
        <button onClick={() => setSubStep('shifts')} className={`w-full ${btnBack}`}>← Back</button>
      </div>
    );
  }

  /* ── Step 6: Applicant / Organizer Details ──────────────────────────────────── */
  if (subStep === 'applicant') {
    return (
      <div className="space-y-3">
        <p className="text-xs text-[#7A6A58] font-semibold">Organizer Details</p>

        <div>
          <label className={labelCls}>Full Name *</label>
          <input type="text" maxLength={30} value={applicant.fullName}
            onChange={(e) => setApplicant((p) => ({ ...p, fullName: e.target.value }))}
            className={inputCls} placeholder="Enter full name" />
        </div>

        <div>
          <label className={labelCls}>Email *</label>
          <input type="email" value={applicant.email}
            onChange={(e) => setApplicant((p) => ({ ...p, email: e.target.value }))}
            className={inputCls} placeholder="Enter email" />
        </div>

        <div>
          <label className={labelCls}>Mobile No *</label>
          <input type="tel" value={applicant.mobileNo}
            onChange={(e) => setApplicant((p) => ({ ...p, mobileNo: e.target.value }))}
            className={inputCls} placeholder="Enter mobile number" />
        </div>

        <div>
          <label className={labelCls}>Category *</label>
          <select value={applicant.category}
            onChange={(e) => setApplicant((p) => ({ ...p, category: e.target.value }))}
            className={inputCls}>
            <option value="">Select Category</option>
            {categoryOptions.map((c) => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
          </select>
        </div>

        {/* Sponsored */}
        <div>
          <label className={labelCls}>Is Sponsored?</label>
          <div className="flex gap-2">
            {['yes', 'no'].map((v) => (
              <button key={v}
                onClick={() => setApplicant((p) => ({ ...p, isSponsored: v, sponsorName: v === 'no' ? '' : p.sponsorName }))}
                className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all ${applicant.isSponsored === v ? 'border-[#E8631A] bg-[#FFF5EE] text-[#E8631A]' : 'border-[#E8DAC5] text-[#2C2017]'}`}>
                {v === 'yes' ? 'Yes' : 'No'}
              </button>
            ))}
          </div>
        </div>
        {applicant.isSponsored === 'yes' && (
          <div>
            <label className={labelCls}>Sponsor Name *</label>
            <input type="text" value={applicant.sponsorName}
              onChange={(e) => setApplicant((p) => ({ ...p, sponsorName: e.target.value }))}
              className={inputCls} placeholder="Enter sponsor name" />
          </div>
        )}

        {/* GST */}
        <div>
          <label className={labelCls}>Have GST?</label>
          <div className="flex gap-2">
            {['yes', 'no'].map((v) => (
              <button key={v}
                onClick={() => setApplicant((p) => ({ ...p, haveGst: v, gstNo: v === 'no' ? '' : p.gstNo }))}
                className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all ${applicant.haveGst === v ? 'border-[#E8631A] bg-[#FFF5EE] text-[#E8631A]' : 'border-[#E8DAC5] text-[#2C2017]'}`}>
                {v === 'yes' ? 'Yes' : 'No'}
              </button>
            ))}
          </div>
        </div>
        {applicant.haveGst === 'yes' && (
          <div>
            <label className={labelCls}>GST No</label>
            <input type="text" value={applicant.gstNo}
              onChange={(e) => setApplicant((p) => ({ ...p, gstNo: e.target.value }))}
              className={inputCls} placeholder="Enter GST number" />
          </div>
        )}

        {/* AC — conditional (not for prep-day venues) */}
        {showAcOption && !needsPrepDays && (
          <div>
            <label className={labelCls}>AC Required?</label>
            <div className="flex gap-2">
              {['yes', 'no'].map((v) => (
                <button key={v}
                  onClick={() => setApplicant((p) => ({ ...p, acRequired: v }))}
                  className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all ${applicant.acRequired === v ? 'border-[#E8631A] bg-[#FFF5EE] text-[#E8631A]' : 'border-[#E8DAC5] text-[#2C2017]'}`}>
                  {v === 'yes' ? 'Yes' : 'No'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Lights — only for madhyavarti */}
        {showLights && (
          <div>
            <label className={labelCls}>Light Category</label>
            <select value={applicant.lightCategory}
              onChange={(e) => {
                const val = e.target.value;
                setApplicant((p) => ({
                  ...p, lightCategory: val,
                  fifteenLights: val === '15',
                  thirtyLights: val === '30',
                }));
              }}
              className={inputCls}>
              <option value="">None</option>
              <option value="15">Upto 15 Lights</option>
              <option value="30">Upto 16-30 Lights</option>
            </select>
          </div>
        )}

        {/* Address */}
        <div>
          <label className={labelCls}>Address *</label>
          <textarea rows={2} value={applicant.address}
            onChange={(e) => setApplicant((p) => ({ ...p, address: e.target.value }))}
            className={inputCls} placeholder="Enter address" />
        </div>

        {/* Society registered */}
        <div>
          <label className={labelCls}>Is Society Registered / Affiliated? *</label>
          <div className="flex gap-2">
            {['yes', 'no'].map((v) => (
              <button key={v}
                onClick={() => setApplicant((p) => ({ ...p, isSocietyRegistered: v }))}
                className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all ${applicant.isSocietyRegistered === v ? 'border-[#E8631A] bg-[#FFF5EE] text-[#E8631A]' : 'border-[#E8DAC5] text-[#2C2017]'}`}>
                {v === 'yes' ? 'Yes' : 'No'}
              </button>
            ))}
          </div>
        </div>

        {/* Society document upload — enabled when society registered = yes */}
        {renderSingleFileUpload(
          'Upload Society Document',
          societyDoc,
          setSocietyDoc,
          applicant.isSocietyRegistered !== 'yes',
        )}

        <div className="flex gap-3 pt-2">
          <button onClick={() => setSubStep('type')} className={btnBack}>← Back</button>
          <button onClick={() => { if (validateApplicant()) setSubStep('event'); }} className={btnNext}>Continue →</button>
        </div>
      </div>
    );
  }

  /* ── Step 7: Event Details + Bank Details ───────────────────────────────────── */
  if (subStep === 'event') {
    return (
      <div className="space-y-3">
        <p className="text-xs text-[#7A6A58] font-semibold">Event / Venue Details</p>

        {/* Program details + upload */}
        <div>
          <label className={labelCls}>Details of Program *</label>
          <textarea rows={2} value={eventForm.programDetails}
            onChange={(e) => setEventForm((p) => ({ ...p, programDetails: e.target.value }))}
            className={inputCls} placeholder="Describe your program / event" />
        </div>
        {renderFileUpload('Upload Program Details', programDocs, setProgramDocs, 3)}

        {/* Previous program details + upload */}
        <div>
          <label className={labelCls}>Previous Program Details</label>
          <textarea rows={2} value={eventForm.previousDetails}
            onChange={(e) => setEventForm((p) => ({ ...p, previousDetails: e.target.value }))}
            className={inputCls} placeholder="Previous event details (optional)" />
        </div>
        {renderFileUpload('Upload 3 Previous Program Photos', prevProgramDocs, setPrevProgramDocs, 3)}

        {/* PLACES only: guest + org details with photo uploads */}
        {isPlaces && (
          <>
            <div>
              <label className={labelCls}>Guest Details *</label>
              <textarea rows={2} value={eventForm.guestDetails}
                onChange={(e) => setEventForm((p) => ({ ...p, guestDetails: e.target.value }))}
                className={inputCls} placeholder="Guest information" />
            </div>
            {renderFileUpload('Upload Guest Details', guestDocs, setGuestDocs, 3)}

            <div>
              <label className={labelCls}>Organisation Details</label>
              <textarea rows={2} value={eventForm.organizationDetails}
                onChange={(e) => setEventForm((p) => ({ ...p, organizationDetails: e.target.value }))}
                className={inputCls} placeholder="Organisation details (optional)" />
            </div>
            {renderFileUpload('Upload Organisation Profile', orgDocs, setOrgDocs, 3)}
          </>
        )}

        {/* Projector — PLACES only + ticket config has projector fee */}
        {isPlaces && showProjector && (
          <div>
            <label className={labelCls}>Projector Required?</label>
            <div className="flex gap-2">
              {[
                { val: true, label: 'Yes' },
                { val: false, label: 'No' },
              ].map(({ val, label }) => (
                <button key={label}
                  onClick={() => setEventForm((p) => ({ ...p, projectorRequired: val }))}
                  className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all ${eventForm.projectorRequired === val ? 'border-[#E8631A] bg-[#FFF5EE] text-[#E8631A]' : 'border-[#E8DAC5] text-[#2C2017]'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Audience entry — PLACES only */}
        {isPlaces && (
          <div>
            <label className={labelCls}>Entry Audience By</label>
            <div className="flex gap-2">
              {['INVITATION', 'TICKET'].map((v) => (
                <button key={v}
                  onClick={() => setEventForm((p) => ({ ...p, audienceEntryBy: v }))}
                  className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all ${eventForm.audienceEntryBy === v ? 'border-[#E8631A] bg-[#FFF5EE] text-[#E8631A]' : 'border-[#E8DAC5] text-[#2C2017]'}`}>
                  {v === 'INVITATION' ? 'Invitation' : 'Ticket'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Bank Details ─────────────────── */}
        <p className="text-xs text-[#7A6A58] font-semibold pt-2">Bank Details</p>

        <div>
          <label className={labelCls}>Bank Name *</label>
          <input type="text" value={bankForm.bankName}
            onChange={(e) => setBankForm((p) => ({ ...p, bankName: e.target.value }))}
            className={inputCls} placeholder="Enter bank name" />
        </div>
        <div>
          <label className={labelCls}>Account Number *</label>
          <input type="text" value={bankForm.accountNumber}
            onChange={(e) => setBankForm((p) => ({ ...p, accountNumber: e.target.value }))}
            className={inputCls} placeholder="Enter account number" />
        </div>
        <div>
          <label className={labelCls}>IFSC Code *</label>
          <input type="text" value={bankForm.ifscCode}
            onChange={(e) => setBankForm((p) => ({ ...p, ifscCode: e.target.value }))}
            className={inputCls} placeholder="Enter IFSC code" />
        </div>
        <div>
          <label className={labelCls}>Account Holder Name *</label>
          <input type="text" value={bankForm.accountHolderName}
            onChange={(e) => setBankForm((p) => ({ ...p, accountHolderName: e.target.value }))}
            className={inputCls} placeholder="Enter account holder name" />
        </div>
        <div>
          <label className={labelCls}>Account Type *</label>
          <div className="flex gap-2">
            {[
              { v: 'savings', l: 'Savings' },
              { v: 'current', l: 'Current' },
            ].map(({ v, l }) => (
              <button key={v}
                onClick={() => setBankForm((p) => ({ ...p, accountType: v }))}
                className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all ${bankForm.accountType === v ? 'border-[#E8631A] bg-[#FFF5EE] text-[#E8631A]' : 'border-[#E8DAC5] text-[#2C2017]'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={() => setSubStep('applicant')} className={btnBack}>← Back</button>
          <button
            onClick={() => { if (validateEvent()) calculatePrice(); }}
            disabled={priceCalc.isPending}
            className={btnNext}>
            {priceCalc.isPending ? 'Calculating Price...' : 'Continue →'}
          </button>
        </div>
      </div>
    );
  }

  /* ── Step 8: Review & Pay ──────────────────────────────────────────────────── */
  return (
    <div className="space-y-4">
      <div className="bg-[#F5E8CC] rounded-[12px] p-4 space-y-1.5">
        <div className="font-bold text-sm text-[#2C2017]">{state.config.placeName}</div>
        <div className="text-xs text-[#7A6A58]">{jkk.selectedCategory?.name} · {jkk.selectedSubCategory?.name}</div>
        <div className="text-xs text-[#7A6A58]">Type: {jkk.selectedPlaceType?.name}</div>
        <div className="text-xs text-[#7A6A58]">📅 {jkk.bookingStartDate} → {jkk.bookingEndDate}</div>
        <div className="text-xs text-[#7A6A58]">Shifts: {selectedShifts.map((s) => s.name).join(', ')}</div>

        <div className="border-t border-[#E8DAC5] my-2" />
        <div className="text-xs text-[#7A6A58]">Applicant: {applicant.fullName}</div>
        <div className="text-xs text-[#7A6A58]">Email: {applicant.email} · Mobile: {applicant.mobileNo}</div>
        {applicant.isSponsored === 'yes' && (
          <div className="text-xs text-[#7A6A58]">Sponsored by: {applicant.sponsorName}</div>
        )}

        {jkk.calculatedPrice !== null && (
          <div className="text-lg font-bold text-[#E8631A] pt-1">{formatRupees(jkk.calculatedPrice)}</div>
        )}
      </div>

      <label className="flex items-start gap-2 cursor-pointer">
        <input type="checkbox" checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="mt-0.5 accent-[#E8631A]" />
        <span className="text-xs text-[#7A6A58] leading-relaxed">
          I agree to the <a href="#" className="text-[#E8631A] underline">Terms &amp; Conditions</a> and confirm that all information provided is accurate.
        </span>
      </label>

      {processing && (
        <div className="flex items-center gap-2 text-sm text-[#E8631A] bg-[#FFF5EE] px-4 py-3 rounded-[10px]">
          <div className="w-4 h-4 border-2 border-[#E8631A]/30 border-t-[#E8631A] rounded-full animate-spin flex-shrink-0" />
          <span>Processing your booking...</span>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={() => setSubStep('event')} disabled={processing} className={btnBack}>← Back</button>
        <button onClick={handlePay} disabled={!termsAccepted || processing} className={btnNext}>
          {processing ? 'Processing...' : `Pay ${jkk.calculatedPrice ? formatRupees(jkk.calculatedPrice) : ''} →`}
        </button>
      </div>
    </div>
  );
}
