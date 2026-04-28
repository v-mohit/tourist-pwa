'use client';

import { useEffect, useRef, useState } from 'react';
import axiosInstance from '@/configs/axios.config';
import { apiendpoints } from '@/utils/constants/api-endpoints.constants';
import { useSpecificCharges, useAsiTicketTypes } from '../../../hooks/useBookingApi';
import { SPECIFIC_CHARGES } from '@/utils/constants/common.constants';
import { getBookingDateEpochIST } from '@/utils/common.utils';
import type { BookingState } from '../../../types/booking.types';
import {
  ASI_NATIONALITIES,
  ASI_SHIFT_SLOTS,
  COUNTRY_CODE_BY_NATIONALITY,
} from '../../../utils/asi.constants';
import LoadingSpinner from '../../shared/LoadingSpinner';

interface Props {
  state: BookingState;
  onUpdate: (patch: Partial<BookingState>) => void;
  onNext: () => void;
}

/**
 * Parses the /asi/placeAvail response into a simple { F, A, E } availability map.
 * The API returns shift-keyed counts under different shapes depending on the
 * monument; walk the payload loosely and take the first numeric value for each
 * slot letter.
 */
function extractAvailability(resp: any): Record<string, number> {
  const payload = resp?.result ?? resp;
  if (!payload || typeof payload !== 'object') return {};

  const map: Record<string, number> = {};
  const scan = (obj: any) => {
    if (!obj || typeof obj !== 'object') return;
    for (const [key, val] of Object.entries(obj)) {
      const k = key.toUpperCase();
      if ((k === 'F' || k === 'A' || k === 'E') && typeof val === 'number') {
        if (map[k] == null) map[k] = val as number;
      } else if (val && typeof val === 'object') {
        scan(val);
      }
    }
  };
  scan(payload);
  return map;
}

export default function AsiDateShiftStep({ state, onUpdate, onNext }: Props) {
  const { config, asi } = state;
  const { data: specificCharges = [], isLoading: loadingCharges } = useSpecificCharges();
  const asiMutation = useAsiTicketTypes();
  const [checkingAvail, setCheckingAvail] = useState(false);
  const lastFetchRef = useRef('');

  // Resolve "Online" specific charge once.
  useEffect(() => {
    if (!specificCharges.length || state.specificChargeId) return;
    const online = (specificCharges as any[]).find(
      (c) => c.name?.toLowerCase() === SPECIFIC_CHARGES.ONLINE.toLowerCase(),
    );
    if (online) onUpdate({ specificChargeId: online.id });
  }, [specificCharges]);

  // When date changes, fetch availability from /asi/placeAvail so we can show
  // per-shift seat counts and disable full slots.
  useEffect(() => {
    if (!state.selectedDate || !config.placeId) return;
    const key = `${config.placeId}:${state.selectedDate}`;
    if (lastFetchRef.current === key) return;
    lastFetchRef.current = key;

    const run = async () => {
      setCheckingAvail(true);
      try {
        const { data } = await axiosInstance.get(
          apiendpoints.getAsiPalceAvail(config.placeId, state.selectedDate),
        );
        const avail = extractAvailability(data);
        const token = data?.result?.token ?? data?.token ?? null;
        const orderId = data?.result?.orderId ?? data?.orderId ?? null;
        onUpdate({ asi: { ...asi, availability: avail, token, orderId } });
      } catch {
        onUpdate({ asi: { ...asi, availability: {}, token: null, orderId: null } });
      } finally {
        setCheckingAvail(false);
      }
    };
    void run();
  }, [state.selectedDate, config.placeId]);

  // When the user picks (or changes) nationality/shift AND we already have a
  // date + online charge id, fetch the ASI ticket type list.
  async function loadAsiTickets(nationalityLabel: string) {
    if (!state.selectedDate || !state.specificChargeId) return;
    const dateMs = getBookingDateEpochIST(state.selectedDate);
    const result = await asiMutation.mutateAsync({
      placeId: config.placeId,
      date: dateMs,
      specificChargeId: state.specificChargeId,
      type: nationalityLabel,
    });
    const ticketTypeDtos = result?.ticketTypeDtos ?? result?.ticketTypes ?? [];
    const shiftDtos = result?.shiftDtos ?? [];
    onUpdate({
      ticketTypes: ticketTypeDtos,
      selectedDateMs: dateMs,
      allShiftIds: shiftDtos.map((s: any) => s.id).join(','),
      season: ticketTypeDtos[0]?.seasonId
        ? { id: ticketTypeDtos[0].seasonId, name: '' }
        : null,
    });
  }

  function selectNationality(nat: (typeof ASI_NATIONALITIES)[number]) {
    onUpdate({
      asi: {
        ...asi,
        nationality: { label: nat.label, code: nat.code },
        visitor: {
          ...asi.visitor,
          nationality: nat.label,
          countryCode: COUNTRY_CODE_BY_NATIONALITY[nat.label] ?? 91,
        },
      },
    });
    void loadAsiTickets(nat.label);
  }

  function selectSlot(slot: (typeof ASI_SHIFT_SLOTS)[number]) {
    onUpdate({
      asi: { ...asi, shiftSlot: slot.type },
      selectedShift: { id: slot.type, name: slot.name },
    });
  }

  const canProceed =
    !!state.selectedDate &&
    !!asi.nationality &&
    !!asi.shiftSlot &&
    state.ticketTypes.length > 0;

  if (loadingCharges) return <LoadingSpinner message="Preparing booking..." />;

  return (
    <div className="space-y-5">
      {/* Date */}
      <div>
        <label className="block text-[10px] font-bold text-[#2C2017] mb-1.5 uppercase tracking-[0.3px]">
          Visit Date
        </label>
        <input
          type="date"
          value={state.selectedDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => {
            lastFetchRef.current = '';
            onUpdate({
              selectedDate: e.target.value,
              selectedShift: null,
              ticketTypes: [],
              selectedTickets: [],
              allShiftIds: '',
              season: null,
              asi: {
                ...asi,
                shiftSlot: '',
                availability: {},
                token: null,
                orderId: null,
              },
            });
          }}
          className="w-full px-3.5 py-2.5 border border-[#E8DAC5] rounded-[10px] text-sm focus:outline-none focus:border-[#E8631A] bg-white"
        />
      </div>

      {/* Shift */}
      {state.selectedDate && (
        <div>
          <label className="block text-[10px] font-bold text-[#2C2017] mb-2 uppercase tracking-[0.3px]">
            Time Slot
          </label>
          {checkingAvail && <LoadingSpinner message="Checking availability..." />}
          {!checkingAvail && (
            <div className="grid grid-cols-3 gap-2">
              {ASI_SHIFT_SLOTS.map((slot) => {
                const avail = asi.availability[slot.type];
                const full = typeof avail === 'number' && avail <= 0;
                const selected = asi.shiftSlot === slot.type;
                return (
                  <button
                    key={slot.type}
                    onClick={() => !full && selectSlot(slot)}
                    disabled={full}
                    className={`py-2.5 px-2 rounded-[10px] border-2 text-left transition-all duration-150 ${
                      selected
                        ? 'border-[#E8631A] bg-[#FFF5EE]'
                        : full
                          ? 'border-[#E8DAC5] bg-[#F5F1EA] opacity-60 cursor-not-allowed'
                          : 'border-[#E8DAC5] hover:border-[#E8631A]/50'
                    }`}
                  >
                    <div
                      className={`font-semibold text-xs ${
                        selected ? 'text-[#E8631A]' : 'text-[#2C2017]'
                      }`}
                    >
                      {slot.name}
                    </div>
                    <div className="text-[9px] text-[#7A6A58] mt-0.5">{slot.time}</div>
                    {typeof avail === 'number' && (
                      <div
                        className={`text-[10px] mt-0.5 font-semibold ${
                          full ? 'text-red-500' : 'text-green-600'
                        }`}
                      >
                        {full ? 'Full' : `${avail} seats`}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Nationality */}
      {state.selectedDate && asi.shiftSlot && (
        <div>
          <label className="block text-[10px] font-bold text-[#2C2017] mb-2 uppercase tracking-[0.3px]">
            Visitor Nationality
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ASI_NATIONALITIES.map((nat) => {
              const selected = asi.nationality?.code === nat.code;
              return (
                <button
                  key={nat.code}
                  onClick={() => selectNationality(nat)}
                  className={`py-2.5 px-3 rounded-[10px] border-2 text-left transition-all duration-150 ${
                    selected
                      ? 'border-[#E8631A] bg-[#FFF5EE]'
                      : 'border-[#E8DAC5] hover:border-[#E8631A]/50'
                  }`}
                >
                  <div
                    className={`font-semibold text-sm ${
                      selected ? 'text-[#E8631A]' : 'text-[#2C2017]'
                    }`}
                  >
                    {nat.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Loading tickets */}
      {asiMutation.isPending && <LoadingSpinner message="Loading ticket categories..." />}

      {/* Confirmation */}
      {!asiMutation.isPending && state.ticketTypes.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-2.5 rounded-[8px]">
          <span className="text-green-600 font-bold">✓</span>
          <span>
            {state.ticketTypes.length} ticket categor
            {state.ticketTypes.length > 1 ? 'ies' : 'y'} available for {asi.nationality?.label}.
          </span>
        </div>
      )}

      <button
        onClick={onNext}
        disabled={!canProceed}
        className="w-full py-3 bg-[#E8631A] text-white font-bold rounded-full transition-all duration-200 hover:bg-[#C04E0A] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue →
      </button>
    </div>
  );
}
