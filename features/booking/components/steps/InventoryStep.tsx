'use client';

import { useEffect } from 'react';
import type { BookingState, Zone, InventoryType, Quota } from '../../types/booking.types';
import { useZoneList, useShiftList, useInventoryList, useInventoryBookingTypes, useInventoryTicketList } from '../../hooks/useBookingApi';
import { getBookingDateEpochIST, getBookingDayEndEpochIST, convertTimeIST } from '@/utils/common.utils';
import LoadingSpinner from '../shared/LoadingSpinner';

interface Props {
  state: BookingState;
  onUpdate: (patch: Partial<BookingState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function InventoryStep({ state, onUpdate, onNext, onBack }: Props) {
  const { config, selectedDate, season, userStepsId } = state;
  const zonesMutation = useZoneList();
  const shiftsMutation = useShiftList();
  const inventoryMutation = useInventoryList();
  const bookingTypesMutation = useInventoryBookingTypes();
  const inventoryTicketsMutation = useInventoryTicketList();

  const seasonId = season?.id ?? '';
  const uniqueId = userStepsId || '';
  const bookingDateMs = selectedDate ? getBookingDateEpochIST(selectedDate).toString() : '';
  const bookingDateEndMs = selectedDate ? getBookingDayEndEpochIST(selectedDate).toString() : '';
  const bookingTypeQuotaId = state.selectedBookingType?.id ?? '';
  const inventoryQuotaId = state.selectedBookingType?.inventoryQuotaId ?? bookingTypeQuotaId;

  // Load booking types once date/session/season are ready
  useEffect(() => {
    if (!seasonId || !uniqueId || !bookingDateMs) return;
    bookingTypesMutation.mutateAsync({
      seasonId,
      uniqueId,
      startDay: bookingDateMs,
      endDay: bookingDateEndMs,
    }).then((bookingTypes) => {
      const normalized: Quota[] = (bookingTypes as any[]).map((item) => ({
        id: item.id,
        name: item.inventoryQuotaName ?? item.name,
        // Do NOT map `remaining` here — getQuotaList returns seasonal totals, not per-day
        // availability. Per-day availability is checked at shift/zone/inventory steps.
        inventoryQuotaId: item.inventoryQuotaId,
        inventoryQuotaName: item.inventoryQuotaName,
        masterTicketTypeName: item.masterTicketTypeName,
      }));
      onUpdate({
        inventoryBookingTypes: normalized,
        selectedBookingType: state.selectedBookingType ?? normalized[0] ?? null,
      });
    }).catch(() => {});
  }, [seasonId, uniqueId, bookingDateMs]);

  // Load shifts once booking type is selected
  useEffect(() => {
    if (!bookingTypeQuotaId || !uniqueId || !bookingDateMs) return;
    shiftsMutation.mutateAsync({
      placeId: config.placeId,
      quotaId: bookingTypeQuotaId,
      uniqueId,
      startDay: bookingDateMs,
      endDay: bookingDateEndMs,
    }).then((shifts) => {
      const allShifts = (shifts as any[]).map((shift) => ({
        id: shift.id,
        name: shift.name,
        startTime: shift.startTime,
        endTime: shift.endTime,
        availability: shift.remaining ?? shift.availability,
      }));

      // For today: filter out shifts whose start time (minus 1hr buffer) has already passed,
      // matching the live project's behaviour in Shift.tsx
      const isToday = selectedDate === new Date().toISOString().split('T')[0];
      const normalizedShifts = isToday
        ? allShifts.filter((shift) => {
            if (!shift.startTime) return true;
            const now = Date.now();
            const shiftStart = Number(shift.startTime) - 60 * 60 * 1000; // 1hr before shift
            return now < shiftStart;
          })
        : allShifts;

      const preferredShift = normalizedShifts.find((shift: any) => shift.id === state.selectedShift?.id) ?? normalizedShifts[0] ?? null;
      onUpdate({
        jkk: {
          ...state.jkk,
          shifts: normalizedShifts,
        },
        selectedShift: preferredShift,
        selectedZone: null,
        zones: [],
        selectedInventory: null,
        inventoryTypes: [],
        selectedQuota: null,
        quotas: [],
      });
    }).catch(() => {});
  }, [bookingTypeQuotaId, uniqueId, bookingDateMs]);

  // Load zones when booking type + shift selected
  useEffect(() => {
    if (!bookingTypeQuotaId || !uniqueId || !bookingDateMs || !state.selectedShift) return;
    zonesMutation.mutateAsync({
      placeId: config.placeId,
      quotaId: bookingTypeQuotaId,
      uniqueId,
      startDay: bookingDateMs,
      endDay: bookingDateEndMs,
      shiftId: state.selectedShift.id,
    }).then((zones) => {
      onUpdate({
        zones,
        selectedZone: null,
        selectedInventory: null,
        inventoryTypes: [],
        selectedQuota: null,
        quotas: [],
      });
    }).catch(() => {});
  }, [bookingTypeQuotaId, uniqueId, bookingDateMs, bookingDateEndMs, state.selectedShift?.id]);

  // Load inventory when zone + shift selected
  useEffect(() => {
    if (!state.selectedZone || !state.selectedShift || !seasonId || !uniqueId || !inventoryQuotaId) return;
    inventoryMutation.mutateAsync({
      bookingDate: bookingDateMs,
      placeId: config.placeId,
      uniqueId,
      quotaId: inventoryQuotaId,
      zoneId: state.selectedZone.id,
      shiftId: state.selectedShift.id,
      seasonId,
    }).then((inv) => onUpdate({ inventoryTypes: inv, selectedInventory: null, ticketTypes: [] })).catch(() => {});
  }, [state.selectedZone?.id, state.selectedShift?.id, seasonId, uniqueId, inventoryQuotaId, bookingDateMs]);

  // Load ticket types when inventory is selected.
  // quotaId = bookingTypeQuotaId (the booking-type quota from step 1),
  // matching old project's SafariTicketOptions which uses selectedQuotaDataFromStore?.id
  useEffect(() => {
    if (!state.selectedInventory || !state.selectedZone || !seasonId || !uniqueId || !bookingTypeQuotaId) return;
    inventoryTicketsMutation.mutateAsync({
      placeId: config.placeId,
      seasonId,
      inventoryId: state.selectedInventory.id,
      inventoryName: state.selectedInventory.name,
      quotaId: bookingTypeQuotaId,
      uniqueId,
      zoneId: state.selectedZone.id,
    }).then((tickets) => onUpdate({ ticketTypes: tickets })).catch(() => {});
  }, [state.selectedInventory?.id, state.selectedZone?.id, seasonId, uniqueId, bookingTypeQuotaId]);

  const zones: Zone[] = state.zones;
  const inventoryTypes: InventoryType[] = state.inventoryTypes;
  const bookingTypes: Quota[] = state.inventoryBookingTypes;
  const shifts = state.jkk.shifts;

  const isLoading = bookingTypesMutation.isPending || shiftsMutation.isPending || zonesMutation.isPending;
  const isLoadingTickets = inventoryTicketsMutation.isPending;
  // No separate quota selection step — ticket types are fetched immediately after vehicle selection
  const canProceed = !!state.selectedZone && !!state.selectedInventory && state.ticketTypes.length > 0 && !isLoadingTickets;

  if (isLoading) return <LoadingSpinner message="Loading available options..." />;

  return (
    <div className="space-y-5">
      <p className="text-xs text-[#7A6A58]">
        Select your zone, vehicle type and slot for <strong>{config.placeName}</strong>.
      </p>

      {bookingTypes.length > 0 && (
        <div>
          <label className="block text-[10px] font-bold text-[#2C2017] mb-2 uppercase tracking-[0.3px]">
            Select Booking Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {bookingTypes.map((bookingType) => (
              <button
                key={bookingType.id}
                onClick={() => onUpdate({
                  selectedBookingType: bookingType,
                  selectedShift: null,
                  selectedZone: null,
                  zones: [],
                  selectedInventory: null,
                  inventoryTypes: [],
                  selectedQuota: null,
                  quotas: [],
                })}
                className={`p-3 rounded-[10px] border-2 text-sm font-medium text-left transition-all ${
                  state.selectedBookingType?.id === bookingType.id
                    ? 'border-[#E8631A] bg-[#FFF5EE] text-[#E8631A]'
                    : 'border-[#E8DAC5] text-[#2C2017] hover:border-[#E8631A]/50'
                }`}
              >
                {bookingType.inventoryQuotaName ?? bookingType.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {shifts.length > 0 && (
        <div>
          <label className="block text-[10px] font-bold text-[#2C2017] mb-2 uppercase tracking-[0.3px]">
            Select Shift
          </label>
          <div className="grid grid-cols-2 gap-2">
            {shifts.map((shift) => (
              <button
                key={shift.id}
                onClick={() => onUpdate({
                  selectedShift: shift,
                  selectedZone: null,
                  zones: [],
                  selectedInventory: null,
                  inventoryTypes: [],
                  selectedQuota: null,
                  quotas: [],
                })}
                className={`p-3 rounded-[10px] border-2 text-sm font-medium text-left transition-all ${
                  state.selectedShift?.id === shift.id
                    ? 'border-[#E8631A] bg-[#FFF5EE] text-[#E8631A]'
                    : 'border-[#E8DAC5] text-[#2C2017] hover:border-[#E8631A]/50'
                }`}
              >
                <div>{shift.name}</div>
                {(shift.startTime || shift.endTime) && (
                  <div className="text-[10px] mt-0.5 text-[#7A6A58]">
                    {shift.startTime ? convertTimeIST(shift.startTime) : ''}
                    {shift.endTime ? ` - ${convertTimeIST(shift.endTime)}` : ''}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Zone Selection */}
      {zones.length > 0 && (
        <div>
          <label className="block text-[10px] font-bold text-[#2C2017] mb-2 uppercase tracking-[0.3px]">
            Select Zone
          </label>
          <div className="grid grid-cols-2 gap-2">
            {zones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => onUpdate({ selectedZone: zone, selectedInventory: null, selectedQuota: null, inventoryTypes: [], quotas: [] })}
                className={`p-3 rounded-[10px] border-2 text-sm font-medium text-left transition-all ${
                  state.selectedZone?.id === zone.id
                    ? 'border-[#E8631A] bg-[#FFF5EE] text-[#E8631A]'
                    : 'border-[#E8DAC5] text-[#2C2017] hover:border-[#E8631A]/50'
                }`}
              >
                🗺 {zone.name}
                {typeof zone.availability === 'number' && (
                  <div className={`text-[10px] mt-0.5 ${zone.availability > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {zone.availability > 0 ? `${zone.availability} seats` : 'Full'}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Inventory/Vehicle Type */}
      {inventoryMutation.isPending ? (
        <LoadingSpinner message="Loading vehicles..." />
      ) : inventoryTypes.length > 0 ? (
        <div>
          <label className="block text-[10px] font-bold text-[#2C2017] mb-2 uppercase tracking-[0.3px]">
            Select Your Choice of Vehicle
          </label>
          <div className="space-y-3">
            {inventoryTypes.map((inv: any) => {
              const isSelected = state.selectedInventory?.id === (inv.id ?? inv.inventoryId);
              const isUnavailable = (inv.available ?? inv.availability ?? 1) <= 0;
              return (
                <button
                  key={inv.id ?? inv.inventoryId}
                  disabled={isUnavailable}
                  onClick={() => onUpdate({
                    selectedInventory: {
                      id: inv.id ?? inv.inventoryId,
                      name: inv.name ?? inv.inventoryName,
                      capacity: inv.capacity,
                      availability: inv.available ?? inv.availability,
                      inventoryAmount: Number(inv.inventoryAmount ?? inv.amount ?? 0),
                      quotaAmount: Number(inv.quotaAmount ?? 0),
                      inventoryName: inv.inventoryName ?? inv.name,
                      inventoryQuotaName: inv.inventoryQuotaName,
                    },
                    selectedQuota: null,
                    quotas: [],
                  })}
                  className={`w-full rounded-[12px] p-4 text-left transition-all border-2 ${
                    isSelected
                      ? 'bg-[#E8631A] border-[#E8631A] text-white'
                      : isUnavailable
                        ? 'border-[#E8DAC5] bg-[#F5F5F5] opacity-50 cursor-not-allowed'
                        : 'border-[#E8DAC5] hover:border-[#E8631A]/60 bg-white'
                  }`}
                >
                  <div className={`font-bold text-base ${isSelected ? 'text-white' : 'text-[#2C2017]'}`}>
                    {inv.name ?? inv.inventoryName}
                  </div>
                  <div className={`text-sm mt-1 ${isSelected ? 'text-white/90' : 'text-[#2C2017]'}`}>
                    Available Seats : {inv.available ?? inv.availability ?? 0}
                  </div>
                  {typeof inv.pending === 'number' && (
                    <div className={`text-sm mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#394EAC]'}`}>
                      Payment in process(seats) : {inv.pending}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {isLoadingTickets && (
        <LoadingSpinner message="Loading ticket types..." />
      )}

      {state.selectedInventory && !isLoadingTickets && state.ticketTypes.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-2.5 rounded-[8px]">
          <span className="text-green-600 font-bold">✓</span>
          <span>{state.ticketTypes.length} ticket categor{state.ticketTypes.length > 1 ? 'ies' : 'y'} available. Continue to select tickets.</span>
        </div>
      )}

      {zones.length === 0 && !isLoading && (
        <div className="text-center py-8 text-sm text-[#7A6A58]">
          {bookingTypes.length === 0
            ? 'No booking types available for the selected date.'
            : shifts.length === 0
              ? 'No shifts available for the selected booking type.'
              : 'No zones available for the selected date.'}
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 border-2 border-[#E8DAC5] text-[#2C2017] font-semibold rounded-full hover:bg-[#F5E8CC] transition-colors">
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
