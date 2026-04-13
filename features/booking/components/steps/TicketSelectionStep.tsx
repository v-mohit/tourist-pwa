'use client';

import type { BookingState, TicketType } from '../../types/booking.types';
import { formatRupees } from '../../utils/payment';

interface Props {
  state: BookingState;
  onUpdate: (patch: Partial<BookingState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function TicketSelectionStep({ state, onUpdate, onNext, onBack }: Props) {
  const { ticketTypes, selectedTickets } = state;

  function getQty(ticketTypeId: string): number {
    return selectedTickets.find((t) => t.ticketType.id === ticketTypeId)?.quantity ?? 0;
  }

  function setQty(ticketType: TicketType, qty: number) {
    const next = selectedTickets.filter((t) => t.ticketType.id !== ticketType.id);
    if (qty > 0) next.push({ ticketType, quantity: qty });
    onUpdate({ selectedTickets: next });
  }

  function getTicketPrice(ticketType: TicketType): number {
    const charge = ticketType.specificCharges?.[0];
    return charge?.totalAmount ?? charge?.amount ?? ticketType.amount ?? 0;
  }

  function getTicketLabel(ticketType: TicketType): string {
    return ticketType.masterTicketTypeName || 'Ticket';
  }

  const total = selectedTickets.reduce(
    (sum, { ticketType, quantity }) => sum + getTicketPrice(ticketType) * quantity,
    0,
  );

  const totalTickets = selectedTickets.reduce((s, t) => s + t.quantity, 0);
  const canProceed = totalTickets > 0;

  return (
    <div className="space-y-4">
      <p className="text-xs text-[#7A6A58]">
        Select the number of tickets for each visitor category.
      </p>

      {ticketTypes.length === 0 ? (
        <div className="text-center py-8 text-sm text-[#7A6A58]">
          No ticket types available for this slot.
        </div>
      ) : (
        <div className="space-y-3">
          {ticketTypes.map((ticketType) => {
            const qty = getQty(ticketType.id);
            const price = getTicketPrice(ticketType);
            const label = getTicketLabel(ticketType);

            return (
              <div
                key={ticketType.id}
                className={`flex items-center justify-between p-3.5 rounded-[12px] border-2 transition-all duration-150 ${
                  qty > 0
                    ? 'border-[#E8631A] bg-[#FFF5EE]'
                    : 'border-[#E8DAC5] bg-white'
                }`}
              >
                <div className="flex-1 min-w-0 mr-3">
                  <div className="font-semibold text-sm text-[#2C2017] truncate">{label}</div>
                  {ticketType.note && (
                    <div className="text-[10px] text-[#7A6A58] mt-0.5 line-clamp-1">{ticketType.note}</div>
                  )}
                  <div className="text-sm font-bold text-[#E8631A] mt-1">
                    {price > 0 ? formatRupees(price) : 'Free'}
                  </div>
                </div>

                {/* Qty stepper */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setQty(ticketType, Math.max(0, qty - 1))}
                    disabled={qty === 0}
                    className="w-8 h-8 rounded-full border-2 border-[#E8DAC5] flex items-center justify-center text-[#2C2017] font-bold text-base disabled:opacity-30 hover:border-[#E8631A] transition-colors"
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-bold text-[#2C2017] text-sm">{qty}</span>
                  <button
                    onClick={() => setQty(ticketType, qty + 1)}
                    className="w-8 h-8 rounded-full bg-[#E8631A] flex items-center justify-center text-white font-bold text-base hover:bg-[#C04E0A] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Total */}
      {total > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-[#F5E8CC] rounded-[10px]">
          <span className="text-sm font-semibold text-[#2C2017]">
            {totalTickets} ticket{totalTickets > 1 ? 's' : ''}
          </span>
          <span className="text-base font-bold text-[#E8631A]">{formatRupees(total)}</span>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 border-2 border-[#E8DAC5] text-[#2C2017] font-semibold rounded-full hover:bg-[#F5E8CC] transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="flex-1 py-3 bg-[#E8631A] text-white font-bold rounded-full hover:bg-[#C04E0A] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
