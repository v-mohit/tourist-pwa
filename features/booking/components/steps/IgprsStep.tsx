'use client';

import { useState } from 'react';
import type { BookingState } from '../../types/booking.types';
import {
  useIgprsCategories,
  useIgprsPriceCalculation,
  useCreateIgprsBooking,
  useConfirmIgprsBooking,
} from '../../hooks/useBookingApi';
import LoadingSpinner from '../shared/LoadingSpinner';
import { formatRupees, handlePaymentRedirect } from '../../utils/payment';
import { showSuccessToastMessage } from '@/utils/toast.utils';

interface Props {
  state: BookingState;
  onUpdate: (patch: Partial<BookingState>) => void;
  onBack: () => void;
  userId: string;
}

type IgSubStep = 'dates' | 'price' | 'review';

export default function IgprsStep({ state, onUpdate, onBack, userId }: Props) {
  const [subStep, setSubStep] = useState<IgSubStep>('dates');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [processing, setProcessing] = useState(false);

  const igprs = state.igprs;
  const { data: categories = [], isLoading: loadingCats } = useIgprsCategories();
  const priceCalc = useIgprsPriceCalculation();
  const createIgprs = useCreateIgprsBooking();
  const confirmIgprs = useConfirmIgprsBooking();

  function updateIgprs(patch: Partial<typeof state.igprs>) {
    onUpdate({ igprs: { ...igprs, ...patch } });
  }

  async function fetchPrice() {
    const checkIn = new Date(igprs.checkInDate).getTime();
    const checkOut = igprs.checkOutDate ? new Date(igprs.checkOutDate).getTime() : null;

    const result = await priceCalc.mutateAsync({
      capacity: igprs.capacity,
      categoryId: igprs.selectedCategory?.id,
      bookingStartDate: checkIn,
      bookingEndDate: checkOut,
    });

    updateIgprs({
      calculatedPrice: result?.totalAmount ?? result?.total ?? 0,
      priceData: result,
    });
    setSubStep('price');
  }

  async function handlePay() {
    if (!termsAccepted) return;
    setProcessing(true);
    try {
      const bookingResult = await createIgprs.mutateAsync({
        userId,
        categoryId: igprs.selectedCategory?.id,
        capacity: igprs.capacity,
        bookingStartDate: new Date(igprs.checkInDate).getTime(),
        bookingEndDate: igprs.checkOutDate ? new Date(igprs.checkOutDate).getTime() : null,
      });

      if (!bookingResult?.id) {
        setProcessing(false);
        return;
      }

      showSuccessToastMessage('Room booking created! Proceeding to payment...');
      const confirmResult = await confirmIgprs.mutateAsync({ bookingId: bookingResult.id });
      handlePaymentRedirect(confirmResult);
    } catch {
      setProcessing(false);
    }
  }

  const today = new Date().toISOString().split('T')[0];

  // ── Dates & Category ─────────────────────────────────────────────────────
  if (subStep === 'dates') {
    if (loadingCats) return <LoadingSpinner message="Loading room types..." />;
    return (
      <div className="space-y-4">
        <p className="text-xs text-[#7A6A58]">Select room type, capacity and your stay dates.</p>

        {/* Category */}
        {(categories as any[]).length > 0 && (
          <div>
            <label className="block text-[10px] font-bold text-[#2C2017] mb-2 uppercase tracking-[0.3px]">Room Type</label>
            <div className="space-y-2">
              {(categories as any[]).map((cat: any) => (
                <button key={cat.id}
                  onClick={() => updateIgprs({ selectedCategory: cat })}
                  className={`w-full p-3.5 rounded-[10px] border-2 text-sm font-medium text-left transition-all ${
                    igprs.selectedCategory?.id === cat.id
                      ? 'border-[#E8631A] bg-[#FFF5EE] text-[#E8631A]'
                      : 'border-[#E8DAC5] text-[#2C2017] hover:border-[#E8631A]/50'
                  }`}
                >
                  🏠 {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Check-in / Check-out */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-[#2C2017] mb-1 uppercase tracking-[0.3px]">Check-in *</label>
            <input type="date" value={igprs.checkInDate} min={today}
              onChange={(e) => updateIgprs({ checkInDate: e.target.value })}
              className="w-full px-3 py-2.5 border border-[#E8DAC5] rounded-[10px] text-sm focus:outline-none focus:border-[#E8631A]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#2C2017] mb-1 uppercase tracking-[0.3px]">Check-out</label>
            <input type="date" value={igprs.checkOutDate} min={igprs.checkInDate}
              onChange={(e) => updateIgprs({ checkOutDate: e.target.value })}
              className="w-full px-3 py-2.5 border border-[#E8DAC5] rounded-[10px] text-sm focus:outline-none focus:border-[#E8631A]"
            />
          </div>
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-[10px] font-bold text-[#2C2017] mb-1.5 uppercase tracking-[0.3px]">
            Number of Guests
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateIgprs({ capacity: Math.max(1, igprs.capacity - 1) })}
              className="w-10 h-10 rounded-full border-2 border-[#E8DAC5] flex items-center justify-center font-bold text-lg disabled:opacity-30"
              disabled={igprs.capacity <= 1}
            >−</button>
            <span className="text-xl font-bold text-[#2C2017] w-8 text-center">{igprs.capacity}</span>
            <button
              onClick={() => updateIgprs({ capacity: igprs.capacity + 1 })}
              className="w-10 h-10 rounded-full bg-[#E8631A] flex items-center justify-center text-white font-bold text-lg"
            >+</button>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onBack} className="flex-1 py-3 border-2 border-[#E8DAC5] text-[#2C2017] font-semibold rounded-full hover:bg-[#F5E8CC] transition-colors">← Back</button>
          <button
            onClick={fetchPrice}
            disabled={priceCalc.isPending || !igprs.checkInDate}
            className="flex-1 py-3 bg-[#E8631A] text-white font-bold rounded-full hover:bg-[#C04E0A] disabled:opacity-40 transition-all"
          >
            {priceCalc.isPending ? 'Calculating...' : 'Check Price →'}
          </button>
        </div>
      </div>
    );
  }

  // ── Price Summary ─────────────────────────────────────────────────────────
  if (subStep === 'price') {
    return (
      <div className="space-y-5">
        <div className="bg-[#F5E8CC] rounded-[12px] p-4 space-y-3">
          <div className="font-bold text-sm text-[#2C2017]">Booking Summary</div>
          <div className="space-y-1.5 text-xs text-[#7A6A58]">
            {igprs.selectedCategory && <div>🏠 {igprs.selectedCategory.name}</div>}
            <div>📅 Check-in: {igprs.checkInDate}</div>
            {igprs.checkOutDate && <div>📅 Check-out: {igprs.checkOutDate}</div>}
            <div>👥 Guests: {igprs.capacity}</div>
          </div>
          {/* Price breakdown from API */}
          {igprs.priceData && (
            <div className="space-y-1 border-t border-[#E8DAC5] pt-2 mt-2">
              {Object.entries(igprs.priceData).filter(([k]) => !['totalAmount', 'total', 'id'].includes(k)).map(([key, val]: any) => (
                typeof val === 'number' && val > 0 ? (
                  <div key={key} className="flex justify-between text-xs">
                    <span className="text-[#7A6A58] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-semibold">{formatRupees(val)}</span>
                  </div>
                ) : null
              ))}
            </div>
          )}
          {igprs.calculatedPrice !== null && (
            <div className="flex justify-between items-center pt-2 border-t-2 border-[#E8DAC5]">
              <span className="font-bold text-[#2C2017]">Total</span>
              <span className="text-lg font-bold text-[#E8631A]">{formatRupees(igprs.calculatedPrice)}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={() => setSubStep('dates')} className="flex-1 py-3 border-2 border-[#E8DAC5] text-[#2C2017] font-semibold rounded-full hover:bg-[#F5E8CC] transition-colors">← Back</button>
          <button onClick={() => setSubStep('review')} className="flex-1 py-3 bg-[#E8631A] text-white font-bold rounded-full hover:bg-[#C04E0A] transition-all">
            Continue →
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
        <div className="text-xs text-[#7A6A58]">📅 {igprs.checkInDate}{igprs.checkOutDate ? ` → ${igprs.checkOutDate}` : ''}</div>
        <div className="text-xs text-[#7A6A58]">👥 {igprs.capacity} guests</div>
        {igprs.calculatedPrice !== null && (
          <div className="text-base font-bold text-[#E8631A] pt-1">{formatRupees(igprs.calculatedPrice)}</div>
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
        <button onClick={() => setSubStep('price')} disabled={processing} className="flex-1 py-3 border-2 border-[#E8DAC5] text-[#2C2017] font-semibold rounded-full hover:bg-[#F5E8CC] disabled:opacity-40 transition-colors">← Back</button>
        <button onClick={handlePay} disabled={!termsAccepted || processing}
          className="flex-1 py-3 bg-[#E8631A] text-white font-bold rounded-full hover:bg-[#C04E0A] disabled:opacity-40 transition-all">
          {processing ? 'Processing...' : `Confirm & Pay →`}
        </button>
      </div>
    </div>
  );
}
