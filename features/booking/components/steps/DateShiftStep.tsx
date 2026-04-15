'use client';

import { useEffect, useRef, useState } from 'react';
import type { BookingState, Shift, Season } from '../../types/booking.types';
import { useSpecificCharges, useShiftsAndTicketTypes, useAsiTicketTypes,usePackageTicketTypes, useSaveUserSteps, useObmsPlaceId, useSeason } from '../../hooks/useBookingApi';
import { SPECIFIC_CHARGES } from '@/utils/constants/common.constants';
import { getBookingDateEpochIST } from '@/utils/common.utils';
import LoadingSpinner from '../shared/LoadingSpinner';

interface Props {
  state: BookingState;
  onUpdate: (patch: Partial<BookingState>) => void;
  onNext: () => void;
}

export default function DateShiftStep({ state, onUpdate, onNext }: Props) {
  const { config } = state;
  const isAsi = config.category === 'asi';
  const isInventory = config.category === 'inventory';

  const { data: specificCharges = [], isLoading: loadingCharges } = useSpecificCharges();
  const shiftsMutation = useShiftsAndTicketTypes();
  const asiMutation = useAsiTicketTypes();
  const packageTicketsMutation = usePackageTicketTypes();
  const saveUserSteps = useSaveUserSteps();
  const obmsPlaceMutation = useObmsPlaceId();
  const seasonMutation = useSeason();

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [resolvingPlace, setResolvingPlace] = useState(false);
  const [multipleShifts, setMultipleShifts] = useState<Shift[]>([]);
  // raw ticketTypeDtos keyed by shiftId (for multi-shift places)
  const shiftTicketsRef = useRef<Record<string, any[]>>({});
  // track last fetched date+chargeId to avoid duplicate fetches
  const lastFetchRef = useRef('');
  const lastResolvedLocationRef = useRef('');

  function mapPlaceTypeToCategory(placeType: unknown) {
    const normalized = Array.isArray(placeType) ? placeType[0] : placeType;
    if (normalized === 'INVENTORY') return 'inventory' as const;
    if (normalized === 'NON_INVENTORY') return 'standard' as const;
    return null;
  }

  useEffect(() => {
    if (!config.locationId) return;
    if (config.category === 'package') return;
    const locationKey = String(config.locationId);
    if (lastResolvedLocationRef.current === locationKey) return;

    lastResolvedLocationRef.current = locationKey;
    setResolvingPlace(true);

    obmsPlaceMutation.mutateAsync(config.locationId)
      .then((place) => {
        if (!place) return;

        const nextCategory = mapPlaceTypeToCategory(place.placeType) ?? config.category;
        const nextPlaceId = place.id ?? config.placeId;

        onUpdate({
          config: {
            ...config,
            placeId: nextPlaceId,
            category: nextCategory,
          },
        });
      })
      .catch(() => {
        lastResolvedLocationRef.current = '';
      })
      .finally(() => {
        setResolvingPlace(false);
      });
  }, [config.locationId]);

  // ── Step 1: resolve "Online" specificChargeId once charges load ──────────
  useEffect(() => {
    if (!specificCharges.length || state.specificChargeId) return;
    const online = (specificCharges as any[]).find(
      (c) => c.name?.toLowerCase() === SPECIFIC_CHARGES.ONLINE.toLowerCase(),
    );
    if (online) onUpdate({ specificChargeId: online.id });
  }, [specificCharges]);

  // ── Step 2: fetch slots whenever date or chargeId is ready ───────────────
  useEffect(() => {
    if (isInventory) return;
    if (resolvingPlace) return;
    if (!state.specificChargeId || !state.selectedDate) return;
    const key = `${state.selectedDate}:${state.specificChargeId}`;
    if (lastFetchRef.current === key) return;
    lastFetchRef.current = key;
    fetchSlots(state.selectedDate, state.specificChargeId);
  }, [state.selectedDate, state.specificChargeId, resolvingPlace, config.placeId, isInventory]);

  useEffect(() => {
    if (!isInventory || resolvingPlace) return;
    if (!state.selectedDate || !config.placeId) return;

    const dateMs = getBookingDateEpochIST(state.selectedDate);
    seasonMutation.mutateAsync({
      placeId: config.placeId,
      date: dateMs.toString(),
    }).then((seasonResult: any) => {
      const seasonId = seasonResult?.seasons?.[0]?.id ?? seasonResult?.id ?? '';
      const season = seasonId ? { id: seasonId, name: seasonResult?.seasons?.[0]?.name ?? seasonResult?.name ?? '' } : null;

      onUpdate({
        season,
        selectedDateMs: dateMs,
        selectedShift: null,
        selectedZone: null,
        zones: [],
        selectedInventory: null,
        inventoryTypes: [],
        selectedQuota: null,
        quotas: [],
        inventoryBookingTypes: [],
        selectedBookingType: null,
      });

      if (seasonId) {
        saveUserStepsBg({ placeId: config.placeId, seasonId, dateMs });
      }
    }).catch(() => {});
  }, [isInventory, resolvingPlace, state.selectedDate, config.placeId]);

  function normalizeTicketResponse(result: any) {
    const payload = result?.result ?? result;
    const shiftDtos = Array.isArray(payload?.shiftDtos)
      ? payload.shiftDtos
      : Array.isArray(payload?.shifts)
        ? payload.shifts
        : [];

    const ticketTypeDtos = Array.isArray(payload?.ticketTypeDtos)
      ? payload.ticketTypeDtos
      : Array.isArray(payload?.ticketTypes)
        ? payload.ticketTypes
        : Array.isArray(payload)
          ? payload
          : [];

    return { shiftDtos, ticketTypeDtos };
  }

  async function fetchSlots(date: string, specificChargeId: string) {
    const dateMs = getBookingDateEpochIST(date);
    setLoadingSlots(true);

    // Reset any previous selection
    onUpdate({ selectedShift: null, ticketTypes: [], selectedTickets: [], allShiftIds: '' });
    setMultipleShifts([]);
    shiftTicketsRef.current = {};

    try {
      let result: any;
      const isPackage = config.category === 'package';
      if (isAsi) {
        result = await asiMutation.mutateAsync({
          placeId: config.placeId,
          date: dateMs,
          specificChargeId,
          type: config.asiType ?? '',
        });
      } else if (isPackage) {
        result = await packageTicketsMutation.mutateAsync({  // ✅ calls /package/management/tickets
          packageId: config.placeId,
          date: dateMs,
          specificChargeId,
        });
      } else {
        result = await shiftsMutation.mutateAsync({
          placeId: config.placeId,
          date: dateMs,
          specificChargeId,
        });
      }

      // ── Actual API response shape from /booking/tickets: ────────────────
      //   result = { shiftDtos: ShiftModal[], ticketTypeDtos: TicketTypeModal[] }
      //   OR for ASI: result = { shiftDtos: [...], ticketTypeDtos: [...] }
      // All shift IDs are joined as comma-separated string in the booking payload.
      // Ticket types are flat (NOT per-shift) for non-inventory places.
      const { shiftDtos, ticketTypeDtos } = normalizeTicketResponse(result);

      const allShiftIds = shiftDtos.map((s: any) => s.id).join(',');
      const seasonId = ticketTypeDtos[0]?.seasonId ?? '';
      const season: Season | null = seasonId ? { id: seasonId, name: '' } : null;

      if (ticketTypeDtos.length === 0) {
        // Nothing available — show user feedback
        onUpdate({ ticketTypes: [], allShiftIds: '', season: null, selectedDateMs: dateMs });
        return;
      }

      if (shiftDtos.length <= 1) {
        // Single shift (or no shifts) — auto-select, user doesn't need to choose
        const shift: Shift = shiftDtos[0]
          ? { id: shiftDtos[0].id, name: shiftDtos[0].name, startTime: shiftDtos[0].startTime, endTime: shiftDtos[0].endTime }
          : { id: 'general', name: 'General Entry' };

        onUpdate({
          selectedShift: shift,
          ticketTypes: ticketTypeDtos,
          allShiftIds,
          season,
          selectedDateMs: dateMs,
        });

        // Background: save user steps (analytics/recovery)
        saveUserStepsBg({ placeId: config.placeId, seasonId, dateMs });

      } else {
        // Multiple shifts — show picker. Ticket types are shared (same for all shifts).
        const shifts: Shift[] = shiftDtos.map((s: any) => ({
          id: s.id,
          name: s.name,
          startTime: s.startTime,
          endTime: s.endTime,
          availability: s.availability,
        }));
        setMultipleShifts(shifts);
        // Store ticket types for all shifts (same set)
        shifts.forEach((s) => { shiftTicketsRef.current[s.id] = ticketTypeDtos; });
        const defaultShift = shifts.find((shift) => (shift.availability ?? 1) > 0) ?? shifts[0] ?? null;

        onUpdate({
          selectedShift: defaultShift,
          ticketTypes: ticketTypeDtos,
          allShiftIds,
          season,
          selectedDateMs: dateMs,
        });
      }
    } finally {
      setLoadingSlots(false);
    }
  }

  function selectShift(shift: Shift) {
    onUpdate({
      selectedShift: shift,
      ticketTypes: shiftTicketsRef.current[shift.id] ?? state.ticketTypes,
    });
  }

  // Background: save user steps (fire-and-forget, non-blocking)
  function saveUserStepsBg({ placeId, seasonId, dateMs }: { placeId: string | number; seasonId: string; dateMs: number }) {
    saveUserSteps.mutateAsync({
      placeId,
      dateSelect: true,
      seasonId,
      bookingDate: dateMs,
    }).then((res: any) => {
      // axiosInstance returns data directly; the mutation unwraps it already
      const id = res?.result?.id ?? res?.id;
      if (id) onUpdate({ userStepsId: id });
    }).catch(() => {}); // silent — analytics only
  }

  // canProceed: date is set + ticket types loaded + shift selected (if multiple shifts exist)
  const needsShiftSelection = multipleShifts.length > 1;
  const canProceed = isInventory
    ? !!state.selectedDate && !!state.season?.id && !!state.userStepsId
    : !!state.selectedDate &&
      state.ticketTypes.length > 0 &&
      (!needsShiftSelection || !!state.selectedShift);

  const hasAttemptedFetch = lastFetchRef.current !== '' && !loadingSlots;
  const noSlotsAvailable = hasAttemptedFetch && state.ticketTypes.length === 0;

  if (loadingCharges || resolvingPlace) return <LoadingSpinner message="Preparing booking..." />;

  return (
    <div className="space-y-5">
      {/* Date Picker */}
      <div>
        <label className="block text-[10px] font-bold text-[#2C2017] mb-1.5 uppercase tracking-[0.3px]">
          Select Visit Date
        </label>
        <input
          type="date"
          value={state.selectedDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => {
            lastFetchRef.current = '';
            setMultipleShifts([]);
            onUpdate({
              selectedDate: e.target.value,
              selectedShift: null,
              ticketTypes: [],
              selectedTickets: [],
              allShiftIds: '',
              season: null,
            });
          }}
          className="w-full px-3.5 py-2.5 border border-[#E8DAC5] rounded-[10px] text-sm focus:outline-none focus:border-[#E8631A] bg-white"
        />
      </div>

      {/* Loading slots */}
      {!isInventory && loadingSlots && <LoadingSpinner message="Checking availability..." />}

      {/* Multi-shift picker — only shown when a place has several time slots */}
      {!isInventory && !loadingSlots && multipleShifts.length > 1 && (
        <div>
          <label className="block text-[10px] font-bold text-[#2C2017] mb-2 uppercase tracking-[0.3px]">
            Select Time Slot
          </label>
          <div className="grid grid-cols-2 gap-2">
            {multipleShifts.map((shift) => (
              <button
                key={shift.id}
                onClick={() => selectShift(shift)}
                className={`py-2.5 px-3 rounded-[10px] border-2 text-left transition-all duration-150 ${
                  state.selectedShift?.id === shift.id
                    ? 'border-[#E8631A] bg-[#FFF5EE]'
                    : 'border-[#E8DAC5] hover:border-[#E8631A]/50'
                }`}
              >
                <div className={`font-semibold text-xs ${state.selectedShift?.id === shift.id ? 'text-[#E8631A]' : 'text-[#2C2017]'}`}>
                  {shift.name}
                </div>
                {(shift.startTime || shift.endTime) && (
                  <div className="text-[10px] text-[#7A6A58] mt-0.5">
                    {shift.startTime}{shift.endTime ? ` – ${shift.endTime}` : ''}
                  </div>
                )}
                {typeof shift.availability === 'number' && (
                  <div className={`text-[10px] mt-0.5 font-semibold ${shift.availability > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {shift.availability > 0 ? `${shift.availability} seats left` : 'Full'}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No slots available */}
      {!isInventory && noSlotsAvailable && (
        <div className="text-center py-6 text-sm text-[#7A6A58] bg-[#F5E8CC]/40 rounded-[10px]">
          No tickets available for this date. Please try another date.
        </div>
      )}

      {/* Availability confirmed */}
      {!isInventory && !loadingSlots && state.ticketTypes.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-2.5 rounded-[8px]">
          <span className="text-green-600 font-bold">✓</span>
          <span>
            {state.ticketTypes.length} ticket categor{state.ticketTypes.length > 1 ? 'ies' : 'y'} available
            {state.selectedShift && state.selectedShift.id !== 'general' && ` · ${state.selectedShift.name}`}
          </span>
        </div>
      )}

      {isInventory && state.season?.id && (
        <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-2.5 rounded-[8px]">
          <span className="text-green-600 font-bold">✓</span>
          <span>Booking date prepared. Continue to select booking type and safari options.</span>
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
