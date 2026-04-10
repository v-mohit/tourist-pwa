'use client';

import { useState } from 'react';
import type { BookingState } from '../../types/booking.types';
import {
  useJkkCategories,
  useJkkSubCategories,
  useJkkPlaceTypes,
  useJkkTicketConfig,
  useJkkShifts,
  useJkkPriceCalculation,
  useJkkBankDetails,
  useCreateJkkBooking,
  useConfirmJkkBooking,
} from '../../hooks/useBookingApi';
import LoadingSpinner from '../shared/LoadingSpinner';
import { formatRupees, handlePaymentRedirect } from '../../utils/payment';
import { showSuccessToastMessage, showErrorToastMessage } from '@/utils/toast.utils';

interface Props {
  state: BookingState;
  onUpdate: (patch: Partial<BookingState>) => void;
  onBack: () => void;
  userId: string;
}

type JkkSubStep = 'category' | 'subcategory' | 'dates' | 'type' | 'tickets' | 'bank' | 'review';

export default function JkkStep({ state, onUpdate, onBack, userId }: Props) {
  const [subStep, setSubStep] = useState<JkkSubStep>('category');
  const [processing, setProcessing] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});
  const [bankForm, setBankForm] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
  });

  const jkk = state.jkk;
  const { data: categories = [], isLoading: loadingCats } = useJkkCategories();
  const { data: subCategories = [], isLoading: loadingSubs } = useJkkSubCategories(jkk.selectedCategory?.id ?? null);
  const { data: placeTypes = [], isLoading: loadingTypes } = useJkkPlaceTypes(jkk.selectedSubCategory?.id ?? null);
  const { data: ticketConfigs = [], isLoading: loadingConfigs } = useJkkTicketConfig(jkk.selectedPlaceType?.id ?? null);
  const shiftsMutation = useJkkShifts();
  const priceCalc = useJkkPriceCalculation();
  const bankDetailsMutation = useJkkBankDetails();
  const createJkk = useCreateJkkBooking();
  const confirmJkk = useConfirmJkkBooking();

  function updateJkk(patch: Partial<typeof state.jkk>) {
    onUpdate({ jkk: { ...jkk, ...patch } });
  }

  async function fetchShifts() {
    const result = await shiftsMutation.mutateAsync({
      startDate: jkk.bookingStartDate,
      endDate: jkk.bookingEndDate,
      categoryId: jkk.selectedCategory?.id ?? '',
      subCategoryId: jkk.selectedSubCategory?.id ?? '',
    });
    updateJkk({ shifts: result ?? [] });
    setSubStep('type');
  }

  async function calculatePrice() {
    const tickets = Object.entries(selectedQuantities)
      .filter(([, qty]) => qty > 0)
      .map(([ticketTypeId, qty]) => ({ ticketTypeId, quantity: qty }));

    if (!tickets.length) return;

    const result = await priceCalc.mutateAsync({
      categoryId: jkk.selectedCategory?.id,
      subCategoryId: jkk.selectedSubCategory?.id,
      typeId: jkk.selectedPlaceType?.id,
      shiftId: jkk.selectedShift?.id,
      bookingStartDate: new Date(jkk.bookingStartDate).getTime(),
      bookingEndDate: new Date(jkk.bookingEndDate).getTime(),
      tickets,
    });
    updateJkk({ calculatedPrice: result?.totalAmount ?? result?.total ?? 0 });
    setSubStep('bank');
  }

  async function submitBankDetails() {
    if (!bankForm.accountHolderName || !bankForm.bankName || !bankForm.accountNumber || !bankForm.ifscCode) {
      showErrorToastMessage('Please fill all bank details');
      return;
    }
    await bankDetailsMutation.mutateAsync({
      ...bankForm,
      bookingId: null, // will be filled after booking creation
      userId,
    });
    updateJkk({ bankDetails: bankForm });
    setSubStep('review');
  }

  async function handlePay() {
    if (!termsAccepted) return;
    setProcessing(true);
    try {
      const tickets = Object.entries(selectedQuantities)
        .filter(([, qty]) => qty > 0)
        .map(([ticketTypeId, qty]) => ({ ticketTypeId, quantity: qty }));

      const bookingResult = await createJkk.mutateAsync({
        userId,
        categoryId: jkk.selectedCategory?.id,
        subCategoryId: jkk.selectedSubCategory?.id,
        typeId: jkk.selectedPlaceType?.id,
        shiftId: jkk.selectedShift?.id,
        bookingStartDate: new Date(jkk.bookingStartDate).getTime(),
        bookingEndDate: new Date(jkk.bookingEndDate).getTime(),
        tickets,
        bankDetails: jkk.bankDetails,
      });

      if (!bookingResult?.id) {
        setProcessing(false);
        return;
      }

      showSuccessToastMessage('JKK booking created! Proceeding to payment...');
      const confirmResult = await confirmJkk.mutateAsync({ bookingId: bookingResult.id });
      handlePaymentRedirect(confirmResult);
    } catch {
      setProcessing(false);
    }
  }

  // ── Category selection ────────────────────────────────────────────────────
  if (subStep === 'category') {
    if (loadingCats) return <LoadingSpinner message="Loading categories..." />;
    return (
      <div className="space-y-4">
        <p className="text-xs text-[#7A6A58]">Select the category for your JKK booking.</p>
        <div className="space-y-2">
          {(categories as any[]).map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => {
                updateJkk({ selectedCategory: cat, selectedSubCategory: null });
                setSubStep('subcategory');
              }}
              className="w-full p-3.5 rounded-[10px] border-2 border-[#E8DAC5] text-sm font-medium text-left text-[#2C2017] hover:border-[#E8631A] hover:bg-[#FFF5EE] transition-all"
            >
              {cat.name}
            </button>
          ))}
        </div>
        <button onClick={onBack} className="w-full py-3 border-2 border-[#E8DAC5] text-[#2C2017] font-semibold rounded-full hover:bg-[#F5E8CC] transition-colors">
          ← Back
        </button>
      </div>
    );
  }

  // ── Sub-category selection ────────────────────────────────────────────────
  if (subStep === 'subcategory') {
    if (loadingSubs) return <LoadingSpinner message="Loading sub-categories..." />;
    return (
      <div className="space-y-4">
        <p className="text-xs text-[#7A6A58]">Category: <strong>{jkk.selectedCategory?.name}</strong></p>
        <div className="space-y-2">
          {(subCategories as any[]).map((sub: any) => (
            <button
              key={sub.id}
              onClick={() => {
                updateJkk({ selectedSubCategory: sub });
                setSubStep('dates');
              }}
              className="w-full p-3.5 rounded-[10px] border-2 border-[#E8DAC5] text-sm font-medium text-left text-[#2C2017] hover:border-[#E8631A] hover:bg-[#FFF5EE] transition-all"
            >
              {sub.name}
            </button>
          ))}
        </div>
        <button onClick={() => setSubStep('category')} className="w-full py-3 border-2 border-[#E8DAC5] text-[#2C2017] font-semibold rounded-full hover:bg-[#F5E8CC] transition-colors">
          ← Back
        </button>
      </div>
    );
  }

  // ── Date selection ────────────────────────────────────────────────────────
  if (subStep === 'dates') {
    const today = new Date().toISOString().split('T')[0];
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-[#2C2017] mb-1.5 uppercase tracking-[0.3px]">Start Date</label>
          <input type="date" value={jkk.bookingStartDate} min={today}
            onChange={(e) => updateJkk({ bookingStartDate: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-[#E8DAC5] rounded-[10px] text-sm focus:outline-none focus:border-[#E8631A]"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-[#2C2017] mb-1.5 uppercase tracking-[0.3px]">End Date</label>
          <input type="date" value={jkk.bookingEndDate} min={jkk.bookingStartDate}
            onChange={(e) => updateJkk({ bookingEndDate: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-[#E8DAC5] rounded-[10px] text-sm focus:outline-none focus:border-[#E8631A]"
          />
        </div>
        <div className="flex gap-3">
          <button onClick={() => setSubStep('subcategory')} className="flex-1 py-3 border-2 border-[#E8DAC5] text-[#2C2017] font-semibold rounded-full hover:bg-[#F5E8CC] transition-colors">← Back</button>
          <button
            onClick={fetchShifts}
            disabled={shiftsMutation.isPending || !jkk.bookingStartDate || !jkk.bookingEndDate}
            className="flex-1 py-3 bg-[#E8631A] text-white font-bold rounded-full hover:bg-[#C04E0A] disabled:opacity-40 transition-all"
          >
            {shiftsMutation.isPending ? 'Loading...' : 'Continue →'}
          </button>
        </div>
      </div>
    );
  }

  // ── Place Type selection ──────────────────────────────────────────────────
  if (subStep === 'type') {
    if (loadingTypes) return <LoadingSpinner message="Loading venue types..." />;
    return (
      <div className="space-y-4">
        <p className="text-xs text-[#7A6A58]">Select venue type</p>
        <div className="space-y-2">
          {(placeTypes as any[]).map((type: any) => (
            <button key={type.id}
              onClick={() => { updateJkk({ selectedPlaceType: type }); setSubStep('tickets'); }}
              className="w-full p-3.5 rounded-[10px] border-2 border-[#E8DAC5] text-sm font-medium text-left text-[#2C2017] hover:border-[#E8631A] hover:bg-[#FFF5EE] transition-all"
            >
              {type.name}
            </button>
          ))}
        </div>
        <button onClick={() => setSubStep('dates')} className="w-full py-3 border-2 border-[#E8DAC5] text-[#2C2017] font-semibold rounded-full hover:bg-[#F5E8CC] transition-colors">← Back</button>
      </div>
    );
  }

  // ── Ticket config / quantity selection ────────────────────────────────────
  if (subStep === 'tickets') {
    if (loadingConfigs) return <LoadingSpinner message="Loading ticket types..." />;
    const total = (ticketConfigs as any[]).reduce((sum: number, tc: any) => {
      return sum + (tc.amount ?? 0) * (selectedQuantities[tc.id] ?? 0);
    }, 0);
    return (
      <div className="space-y-4">
        <p className="text-xs text-[#7A6A58]">Select number of tickets per category</p>
        <div className="space-y-3">
          {(ticketConfigs as any[]).map((tc: any) => {
            const qty = selectedQuantities[tc.id] ?? 0;
            return (
              <div key={tc.id} className="flex items-center justify-between p-3.5 rounded-[12px] border-2 border-[#E8DAC5]">
                <div>
                  <div className="font-semibold text-sm text-[#2C2017]">{tc.name}</div>
                  <div className="text-sm font-bold text-[#E8631A]">{formatRupees(tc.amount ?? 0)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSelectedQuantities((p) => ({ ...p, [tc.id]: Math.max(0, qty - 1) }))} disabled={qty === 0}
                    className="w-8 h-8 rounded-full border-2 border-[#E8DAC5] flex items-center justify-center font-bold disabled:opacity-30">−</button>
                  <span className="w-5 text-center font-bold text-sm">{qty}</span>
                  <button onClick={() => setSelectedQuantities((p) => ({ ...p, [tc.id]: qty + 1 }))}
                    className="w-8 h-8 rounded-full bg-[#E8631A] flex items-center justify-center text-white font-bold">+</button>
                </div>
              </div>
            );
          })}
        </div>
        {total > 0 && (
          <div className="flex justify-between items-center px-4 py-3 bg-[#F5E8CC] rounded-[10px]">
            <span className="font-bold text-[#2C2017]">Estimated Total</span>
            <span className="font-bold text-[#E8631A]">{formatRupees(total)}</span>
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={() => setSubStep('type')} className="flex-1 py-3 border-2 border-[#E8DAC5] text-[#2C2017] font-semibold rounded-full hover:bg-[#F5E8CC] transition-colors">← Back</button>
          <button onClick={calculatePrice} disabled={!Object.values(selectedQuantities).some((q) => q > 0) || priceCalc.isPending}
            className="flex-1 py-3 bg-[#E8631A] text-white font-bold rounded-full hover:bg-[#C04E0A] disabled:opacity-40 transition-all">
            {priceCalc.isPending ? 'Calculating...' : 'Continue →'}
          </button>
        </div>
      </div>
    );
  }

  // ── Bank details ──────────────────────────────────────────────────────────
  if (subStep === 'bank') {
    return (
      <div className="space-y-4">
        <p className="text-xs text-[#7A6A58]">Bank details are required for JKK bookings.</p>
        {jkk.calculatedPrice !== null && (
          <div className="flex justify-between items-center px-4 py-3 bg-[#F5E8CC] rounded-[10px]">
            <span className="font-bold text-[#2C2017]">Total Amount</span>
            <span className="text-lg font-bold text-[#E8631A]">{formatRupees(jkk.calculatedPrice)}</span>
          </div>
        )}
        {(['accountHolderName', 'bankName', 'accountNumber', 'ifscCode'] as const).map((field) => (
          <div key={field}>
            <label className="block text-[10px] font-bold text-[#2C2017] mb-1 uppercase tracking-[0.3px]">
              {field === 'accountHolderName' ? 'Account Holder Name' :
               field === 'bankName' ? 'Bank Name' :
               field === 'accountNumber' ? 'Account Number' : 'IFSC Code'} *
            </label>
            <input type="text" value={bankForm[field]}
              onChange={(e) => setBankForm((p) => ({ ...p, [field]: e.target.value }))}
              className="w-full px-3.5 py-2.5 border border-[#E8DAC5] rounded-[10px] text-sm focus:outline-none focus:border-[#E8631A]"
            />
          </div>
        ))}
        <div className="flex gap-3">
          <button onClick={() => setSubStep('tickets')} className="flex-1 py-3 border-2 border-[#E8DAC5] text-[#2C2017] font-semibold rounded-full hover:bg-[#F5E8CC] transition-colors">← Back</button>
          <button onClick={submitBankDetails} disabled={bankDetailsMutation.isPending}
            className="flex-1 py-3 bg-[#E8631A] text-white font-bold rounded-full hover:bg-[#C04E0A] disabled:opacity-40 transition-all">
            {bankDetailsMutation.isPending ? 'Saving...' : 'Continue →'}
          </button>
        </div>
      </div>
    );
  }

  // ── Review & Pay ──────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <div className="bg-[#F5E8CC] rounded-[12px] p-4 space-y-1.5">
        <div className="font-bold text-sm text-[#2C2017]">{state.config.placeName}</div>
        <div className="text-xs text-[#7A6A58]">{jkk.selectedCategory?.name} · {jkk.selectedSubCategory?.name}</div>
        <div className="text-xs text-[#7A6A58]">📅 {jkk.bookingStartDate} → {jkk.bookingEndDate}</div>
        {jkk.calculatedPrice !== null && (
          <div className="text-base font-bold text-[#E8631A] pt-1">{formatRupees(jkk.calculatedPrice)}</div>
        )}
      </div>

      <label className="flex items-start gap-2 cursor-pointer">
        <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-0.5 accent-[#E8631A]" />
        <span className="text-xs text-[#7A6A58] leading-relaxed">
          I agree to the <a href="#" target="_blank" rel="noopener noreferrer" className="text-[#E8631A] underline">Terms & Conditions</a>.
        </span>
      </label>

      {processing && (
        <div className="flex items-center gap-2 text-sm text-[#E8631A] bg-[#FFF5EE] px-4 py-3 rounded-[10px]">
          <div className="w-4 h-4 border-2 border-[#E8631A]/30 border-t-[#E8631A] rounded-full animate-spin flex-shrink-0" />
          <span>Processing your booking...</span>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={() => setSubStep('bank')} disabled={processing} className="flex-1 py-3 border-2 border-[#E8DAC5] text-[#2C2017] font-semibold rounded-full hover:bg-[#F5E8CC] disabled:opacity-40 transition-colors">← Back</button>
        <button onClick={handlePay} disabled={!termsAccepted || processing}
          className="flex-1 py-3 bg-[#E8631A] text-white font-bold rounded-full hover:bg-[#C04E0A] disabled:opacity-40 transition-all">
          {processing ? 'Processing...' : `Pay ${jkk.calculatedPrice ? formatRupees(jkk.calculatedPrice) : ''} →`}
        </button>
      </div>
    </div>
  );
}
