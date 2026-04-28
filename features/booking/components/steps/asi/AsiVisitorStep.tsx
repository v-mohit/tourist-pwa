'use client';

import { useMemo } from 'react';
import type { BookingState, TicketType } from '../../../types/booking.types';
import { GENDER_OPTIONS } from '../../../types/booking.types';
import {
  ASI_ID_PROOFS_FOREIGN,
  ASI_ID_PROOFS_INDIAN,
} from '../../../utils/asi.constants';
import { formatRupees } from '../../../utils/payment';

interface Props {
  state: BookingState;
  onUpdate: (patch: Partial<BookingState>) => void;
  onNext: () => void;
  onBack: () => void;
}

function getPrice(ticketType: TicketType): number {
  const charge = ticketType.specificCharges?.[0];
  return charge?.totalAmount ?? charge?.amount ?? ticketType.amount ?? 0;
}

/**
 * ASI-specific single-step form. Unlike the generic flow (one visitor form per
 * ticket quantity), ASI collects ONE primary visitor and separate adult/child
 * counts. Child count is capped at 3 (kids under 15, free of charge).
 * Adult tickets are selected via per-category quantity steppers.
 */
export default function AsiVisitorStep({ state, onUpdate, onNext, onBack }: Props) {
  const { asi, ticketTypes, selectedTickets } = state;
  const isIndian = asi.nationality?.label === 'INDIAN';
  const idProofOptions = isIndian ? ASI_ID_PROOFS_INDIAN : ASI_ID_PROOFS_FOREIGN;

  const adultCount = useMemo(
    () => selectedTickets.reduce((s, t) => s + t.quantity, 0),
    [selectedTickets],
  );

  const total = useMemo(
    () =>
      selectedTickets.reduce(
        (sum, { ticketType, quantity }) => sum + getPrice(ticketType) * quantity,
        0,
      ),
    [selectedTickets],
  );

  function setQty(ticketType: TicketType, qty: number) {
    const next = selectedTickets.filter((t) => t.ticketType.id !== ticketType.id);
    if (qty > 0) next.push({ ticketType, quantity: qty });
    onUpdate({ selectedTickets: next });
  }

  function getQty(id: string) {
    return selectedTickets.find((t) => t.ticketType.id === id)?.quantity ?? 0;
  }

  function updateVisitor(patch: Partial<typeof asi.visitor>) {
    onUpdate({ asi: { ...asi, visitor: { ...asi.visitor, ...patch } } });
  }

  const visitor = asi.visitor;
  const requiresDocNumber = !!visitor.idProofType;
  const formValid =
    !!visitor.visitorName.trim() &&
    /^\d{10,15}$/.test(visitor.mobileNo) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(visitor.email) &&
    !!visitor.age &&
    Number(visitor.age) >= 15 &&
    Number(visitor.age) <= 120 &&
    !!visitor.gender &&
    !!visitor.idProofType &&
    (!requiresDocNumber || !!visitor.documentNumber.trim()) &&
    adultCount > 0;

  return (
    <div className="space-y-5">
      {/* Adult ticket quantities */}
      <div>
        <div className="text-[10px] font-bold text-[#2C2017] mb-2 uppercase tracking-[0.3px]">
          Adult Tickets
        </div>
        <p className="text-[11px] text-[#7A6A58] mb-2">
          Max 5 per category. Children under 15 are free and counted separately below.
        </p>
        <div className="space-y-2">
          {ticketTypes.map((tt) => {
            const qty = getQty(tt.id);
            const price = getPrice(tt);
            return (
              <div
                key={tt.id}
                className={`flex items-center justify-between p-3 rounded-[10px] border-2 transition-all duration-150 ${
                  qty > 0 ? 'border-[#E8631A] bg-[#FFF5EE]' : 'border-[#E8DAC5] bg-white'
                }`}
              >
                <div className="flex-1 min-w-0 mr-3">
                  <div className="font-semibold text-sm text-[#2C2017] truncate">
                    {tt.masterTicketTypeName}
                  </div>
                  <div className="text-sm font-bold text-[#E8631A] mt-0.5">
                    {price > 0 ? formatRupees(price) : 'Free'}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setQty(tt, Math.max(0, qty - 1))}
                    disabled={qty === 0}
                    className="w-8 h-8 rounded-full border-2 border-[#E8DAC5] flex items-center justify-center text-[#2C2017] font-bold text-base disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-bold text-[#2C2017] text-sm">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(tt, Math.min(5, qty + 1))}
                    disabled={qty >= 5}
                    className="w-8 h-8 rounded-full bg-[#E8631A] flex items-center justify-center text-white font-bold text-base disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Child count */}
      <div>
        <div className="text-[10px] font-bold text-[#2C2017] mb-1 uppercase tracking-[0.3px]">
          Children (under 15)
        </div>
        <div className="flex items-center justify-between p-3 rounded-[10px] border-2 border-[#E8DAC5] bg-white">
          <div className="text-xs text-[#7A6A58]">No charge. Max 3 children per booking.</div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() =>
                onUpdate({
                  asi: { ...asi, childCount: Math.max(0, asi.childCount - 1) },
                })
              }
              disabled={asi.childCount === 0}
              className="w-8 h-8 rounded-full border-2 border-[#E8DAC5] flex items-center justify-center text-[#2C2017] font-bold text-base disabled:opacity-30"
            >
              −
            </button>
            <span className="w-6 text-center font-bold text-[#2C2017] text-sm">
              {asi.childCount}
            </span>
            <button
              onClick={() =>
                onUpdate({
                  asi: { ...asi, childCount: Math.min(3, asi.childCount + 1) },
                })
              }
              disabled={asi.childCount >= 3}
              className="w-8 h-8 rounded-full bg-[#E8631A] flex items-center justify-center text-white font-bold text-base disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Primary visitor */}
      <div className="space-y-3">
        <div className="text-[10px] font-bold text-[#2C2017] uppercase tracking-[0.3px]">
          Primary Visitor
        </div>

        <div>
          <label className="block text-[10px] font-bold text-[#2C2017] mb-1 uppercase tracking-[0.3px]">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={visitor.visitorName}
            onChange={(e) => updateVisitor({ visitorName: e.target.value })}
            placeholder="As per ID proof"
            className="w-full px-3 py-2 border border-[#E8DAC5] rounded-[8px] text-sm focus:outline-none focus:border-[#E8631A]"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-bold text-[#2C2017] mb-1 uppercase tracking-[0.3px]">
              Mobile <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={visitor.mobileNo}
              onChange={(e) =>
                updateVisitor({ mobileNo: e.target.value.replace(/[^0-9]/g, '') })
              }
              placeholder="10-digit number"
              maxLength={15}
              className="w-full px-3 py-2 border border-[#E8DAC5] rounded-[8px] text-sm focus:outline-none focus:border-[#E8631A]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#2C2017] mb-1 uppercase tracking-[0.3px]">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={visitor.email}
              onChange={(e) => updateVisitor({ email: e.target.value })}
              placeholder="name@example.com"
              className="w-full px-3 py-2 border border-[#E8DAC5] rounded-[8px] text-sm focus:outline-none focus:border-[#E8631A]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-bold text-[#2C2017] mb-1 uppercase tracking-[0.3px]">
              Age <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={15}
              max={120}
              value={visitor.age}
              onChange={(e) =>
                updateVisitor({ age: e.target.value === '' ? '' : Number(e.target.value) })
              }
              placeholder="15 – 120"
              className="w-full px-3 py-2 border border-[#E8DAC5] rounded-[8px] text-sm focus:outline-none focus:border-[#E8631A]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#2C2017] mb-1 uppercase tracking-[0.3px]">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              value={visitor.gender}
              onChange={(e) => updateVisitor({ gender: e.target.value })}
              className="w-full px-3 py-2 border border-[#E8DAC5] rounded-[8px] text-sm focus:outline-none focus:border-[#E8631A] bg-white"
            >
              <option value="">Select</option>
              {GENDER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-bold text-[#2C2017] mb-1 uppercase tracking-[0.3px]">
              Country Code
            </label>
            <input
              type="text"
              readOnly
              value={visitor.countryCode !== '' ? `+${visitor.countryCode}` : ''}
              className="w-full px-3 py-2 border border-[#E8DAC5] rounded-[8px] text-sm bg-[#F5F1EA] text-[#7A6A58]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#2C2017] mb-1 uppercase tracking-[0.3px]">
              Nationality
            </label>
            <input
              type="text"
              readOnly
              value={visitor.nationality}
              className="w-full px-3 py-2 border border-[#E8DAC5] rounded-[8px] text-sm bg-[#F5F1EA] text-[#7A6A58]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-bold text-[#2C2017] mb-1 uppercase tracking-[0.3px]">
              ID Proof <span className="text-red-500">*</span>
            </label>
            <select
              value={visitor.idProofType?.code ?? ''}
              onChange={(e) => {
                const code = Number(e.target.value);
                const match = idProofOptions.find((o) => o.code === code) ?? null;
                updateVisitor({ idProofType: match });
              }}
              className="w-full px-3 py-2 border border-[#E8DAC5] rounded-[8px] text-sm focus:outline-none focus:border-[#E8631A] bg-white"
            >
              <option value="">Select</option>
              {idProofOptions.map((o) => (
                <option key={o.code} value={o.code}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#2C2017] mb-1 uppercase tracking-[0.3px]">
              ID Number {requiresDocNumber && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              value={visitor.documentNumber}
              onChange={(e) =>
                updateVisitor({ documentNumber: e.target.value.toUpperCase() })
              }
              placeholder="ID number"
              className="w-full px-3 py-2 border border-[#E8DAC5] rounded-[8px] text-sm focus:outline-none focus:border-[#E8631A]"
            />
          </div>
        </div>
      </div>

      {/* Running total */}
      {total > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-[#F5E8CC] rounded-[10px]">
          <span className="text-sm font-semibold text-[#2C2017]">
            {adultCount} adult{adultCount > 1 ? 's' : ''}
            {asi.childCount > 0 ? ` · ${asi.childCount} child${asi.childCount > 1 ? 'ren' : ''}` : ''}
          </span>
          <span className="text-base font-bold text-[#E8631A]">{formatRupees(total)}</span>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 border-2 border-[#E8DAC5] text-[#2C2017] font-semibold rounded-full hover:bg-[#F5E8CC]"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!formValid}
          className="flex-1 py-3 bg-[#E8631A] text-white font-bold rounded-full hover:bg-[#C04E0A] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Review & Pay →
        </button>
      </div>
    </div>
  );
}
