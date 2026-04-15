'use client';

import { useState } from 'react';
import { getCookie, setCookie } from 'cookies-next';
import type { BookingState, TicketTypeConfigItem } from '../../types/booking.types';
import { useCreateBooking, useConfirmBooking, useCreatePackageBooking, useTicketTypeConfig } from '../../hooks/useBookingApi';
import { formatRupees, handlePaymentRedirect } from '../../utils/payment';
import { showErrorToastMessage, showSuccessToastMessage } from '@/utils/toast.utils';
import { getIpAddress } from '@/utils/common.utils';

interface Props {
  state: BookingState;
  onBack: () => void;
}

function getOrCreateDeviceId(): string {
  let deviceId = getCookie('app_captcha') as string | undefined;
  if (!deviceId) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    deviceId = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    setCookie('app_captcha', deviceId);
  }
  return deviceId;
}

function buildBookingPayload(state: BookingState, ipAddress: string) {
  const { config, selectedDateMs, selectedTickets, addonsMap, allShiftIds, season, visitorForms, choiceAddonSelections } = state;
  const addedChoiceAddonIds = new Set<string>();

  const ticketUserDtoClone = selectedTickets.map(({ ticketType, quantity }) => {
    const formsForTicket = visitorForms.filter((form) => form.ticketTypeId === ticketType.id);
    const ticketChoiceSelections = choiceAddonSelections[ticketType.id] ?? [];
    const choiceAddonIds = new Set(ticketChoiceSelections.map((item) => item.addonItemId));

    const aggregatedAddons = formsForTicket
      .flatMap((form) => form.addonItemIds)
      .filter((addonId) => !choiceAddonIds.has(addonId))
      .reduce((acc, addonId) => {
        acc[addonId] = (acc[addonId] ?? 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const normalAddOnList = Object.entries(aggregatedAddons).map(([addonId, qty]) => {
      const addon = (addonsMap[ticketType.id] ?? []).find((item) => item.id === addonId);

      return {
        id: addonId,
        qty,
        amount: addon?.amount ?? 0,
        name: addon?.name ?? '',
        masterTicketTypeName: ticketType.masterTicketTypeName,
      };
    });

    const choiceAddOnList = ticketChoiceSelections
      .filter((selection) => {
        if (addedChoiceAddonIds.has(selection.addonItemId)) return false;
        addedChoiceAddonIds.add(selection.addonItemId);
        return true;
      })
      .map((selection) => {
        const addon = (addonsMap[ticketType.id] ?? []).find((item) => item.id === selection.addonItemId);

        return {
          id: selection.addonItemId,
          qty: 1,
          amount: addon?.amount ?? 0,
          name: addon?.name ?? '',
          masterTicketTypeName: ticketType.masterTicketTypeName,
          ...(selection.type === 'vehicle' ? { vehicleId: selection.id, rosterId: selection.rosterId } : {}),
          ...(selection.type === 'guide' ? { guideId: selection.id } : {}),
        };
      });

    const ticketUserDocs = formsForTicket.map((form) => ({
      fullName: form.fullName,
      document: form.idProof,
      documentNo: form.idNo,
      gender: form.gender,
      mobile: form.mobileNo ?? '',
      nationality: form.nationality,
      profileUrl: null,
    }));

    return {
      ticketTypeId: ticketType.id,
      qty: ticketUserDocs.length || quantity,
      addOnList: [...normalAddOnList, ...choiceAddOnList],
      ...(ticketUserDocs.length > 0 ? { ticketUserDocs } : {}),
    };
  });

  // For inventory, season comes from the ticket type itself (old project: ticketTypes?.[0].seasonId)
  const resolvedSeasonId = config.category === 'inventory'
    ? (selectedTickets[0]?.ticketType?.seasonId ?? season?.id ?? '')
    : (season?.id ?? '');

  const base = {
    bookingDate: selectedDateMs,
    placeId: config.placeId,
    device: 'Web' as const,
    seasonId: resolvedSeasonId,
    ticketUserDtoClone,
    shiftId: allShiftIds,
    vip: false,
    deviceId: getOrCreateDeviceId(),
    ipAddress,
  };

  // Inventory-specific fields (only for safari/wildlife places)
  if (config.category === 'inventory') {
    return {
      ...base,
      // Override shiftId with the single selected shift (allShiftIds is empty for inventory)
      shiftId: state.selectedShift?.id ?? allShiftIds,
      zoneId: state.selectedZone?.id,
      inventoryId: state.selectedInventory?.id,
      // Old safari flow uses selected booking type id here.
      inventoryQuotaId: state.selectedBookingType?.id,
      // checkId links this booking back to the user-steps analytics record
      checkId: state.userStepsId,
    };
  }

  return base;
}

function formatDisplayDate(date: string) {
  if (!date) return '';
  const [year, month, day] = date.split('-').map(Number);
  if (!year || !month || !day) return date;

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(year, month - 1, day));
}

function formatClockTime(value?: string | number) {
  if (!value) return '';

  if (typeof value === 'number' || /^\d+$/.test(value)) {
    const parsedEpoch = new Date(Number(value));
    if (!Number.isNaN(parsedEpoch.getTime())) {
      return new Intl.DateTimeFormat('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(parsedEpoch);
    }
  }

  const strValue = String(value);
  const normalized = strValue.length === 5 ? `${strValue}:00` : strValue;
  const parsed = new Date(`1970-01-01T${normalized}`);
  if (Number.isNaN(parsed.getTime())) return String(value);

  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(parsed);
}

function getShiftLabel(selectedShift: BookingState['selectedShift']) {
  if (!selectedShift) return '';
  if (selectedShift.startTime || selectedShift.endTime) {
    const start = formatClockTime(selectedShift.startTime);
    const end = formatClockTime(selectedShift.endTime);
    if (start && end) return `${start} - ${end}`;
    return start || end || selectedShift.name;
  }

  return selectedShift.name;
}

function getInventoryFareDetails(state: BookingState, quantity: number) {
  if (state.config.category !== 'inventory' || !state.selectedInventory) return [];

  const vehicleAmount = Number(state.selectedInventory.inventoryAmount ?? 0);
  const bookingTypeAmount = Number(state.selectedInventory.quotaAmount ?? 0);
  const vehicleLabel = state.selectedInventory.inventoryName ?? state.selectedInventory.name ?? 'Vehicle';
  const bookingTypeLabel = state.selectedInventory.inventoryQuotaName
    ?? state.selectedBookingType?.inventoryQuotaName
    ?? state.selectedBookingType?.name
    ?? 'Booking Type';

  return [
    vehicleAmount > 0 ? { id: 'inventory-amount', label: vehicleLabel, amount: vehicleAmount * quantity } : null,
    bookingTypeAmount > 0 ? { id: 'quota-amount', label: bookingTypeLabel, amount: bookingTypeAmount * quantity } : null,
  ].filter(Boolean) as Array<{ id: string; label: string; amount: number }>;
}

export default function ReviewPayStep({ state, onBack }: Props) {
  const { config, selectedTickets, visitorForms, selectedDate, selectedShift } = state;
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [configByTicketId, setConfigByTicketId] = useState<Record<string, TicketTypeConfigItem[]>>({});
  const [openConfigTicketId, setOpenConfigTicketId] = useState<string | null>(null);
  const hasVisitorDetails = visitorForms.length > 0;
  const formattedDate = formatDisplayDate(selectedDate);
  const shiftLabel = getShiftLabel(selectedShift);

  const createBooking = useCreateBooking();
  const createPackageBooking = useCreatePackageBooking();
  const confirmBooking = useConfirmBooking();
  const ticketConfig = useTicketTypeConfig();

  const isInventory = config.category === 'inventory';

  const total = selectedTickets.reduce((sum, { ticketType, quantity }) => {
    const charge = ticketType.specificCharges?.[0];
    // Inventory tickets use ticketType.amount directly (no specificCharges from getTicketList)
    const price = isInventory
      ? (ticketType.amount ?? 0)
      : (charge?.totalAmount ?? charge?.amount ?? ticketType.amount ?? 0);
    return sum + price * quantity;
  }, 0);

  const countedChoiceAddonIds = new Set<string>();
  const addonTotal = selectedTickets.reduce((sum, { ticketType }) => {
    const addons = state.addonsMap[ticketType.id] ?? [];
    const selectedChoiceIds = new Set((state.choiceAddonSelections[ticketType.id] ?? []).map((item) => item.addonItemId));

    const perTouristAddonTotal = visitorForms
      .filter((form) => form.ticketTypeId === ticketType.id)
      .reduce((ticketSum, form) => ticketSum + addons
        .filter((a) => form.addonItemIds.includes(a.id) && !selectedChoiceIds.has(a.id))
        .reduce((s, a) => s + (a.totalAmount ?? a.amount ?? 0), 0), 0);

    const bookingLevelChoiceTotal = (state.choiceAddonSelections[ticketType.id] ?? []).reduce((ticketSum, selection) => {
      if (countedChoiceAddonIds.has(selection.addonItemId)) return ticketSum;
      countedChoiceAddonIds.add(selection.addonItemId);
      const addon = addons.find((item) => item.id === selection.addonItemId);
      return ticketSum + (addon?.totalAmount ?? addon?.amount ?? 0);
    }, 0);

    return sum + perTouristAddonTotal + bookingLevelChoiceTotal;
  }, 0);

  function displayOrHideCharge(configItem: TicketTypeConfigItem) {
    const amount = configItem.amount ?? configItem.totalAmount ?? 0;
    if (amount === 0) return false;
    // Inventory ticket configs from /booking/getTicketList are not charge-type gated —
    // show all non-zero items. For standard/ASI/package, filter by online specificChargeId.
    if (isInventory) return true;
    if (configItem.specificCharges === false) return true;
    return configItem.specificChargesIds?.includes(state.specificChargeId) ?? false;
  }

  async function toggleTicketConfig(ticketTypeId: string) {
    if (openConfigTicketId === ticketTypeId) {
      setOpenConfigTicketId(null);
      return;
    }

    setOpenConfigTicketId(ticketTypeId);
    if (configByTicketId[ticketTypeId]) return;

    const result = await ticketConfig.mutateAsync({ ticketTypeId, silent: isInventory }).catch(() => null);
    if (!result) return;

    setConfigByTicketId((prev) => ({
      ...prev,
      [ticketTypeId]: result,
    }));
  }

  function renderChargeRows(items: TicketTypeConfigItem[], quantity: number) {
    return items
      .filter(displayOrHideCharge)
      .map((item) => {
        const amount = item.amount ?? item.totalAmount ?? 0;

        return (
          <div key={item.id} className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-semibold text-[#2C2017]">{item.name}</div>
                <div className={`text-[10px] mt-0.5 ${item.refundable ? 'text-green-700' : 'text-[#E8631A]'}`}>
                  {item.refundable ? 'Refundable' : 'Non-refundable'}
                </div>
              </div>
              <div className="text-xs font-semibold text-[#2C2017]">{formatRupees(amount * quantity)}</div>
            </div>

            {item.taxable && item.taxation?.some(displayOrHideCharge) && (
              <div className="space-y-1 border-t border-[#E8DAC5] pt-2">
                {item.taxation.filter(displayOrHideCharge).map((tax) => {
                  const taxAmount = tax.amount ?? tax.totalAmount ?? 0;
                  return (
                    <div key={tax.id} className="flex items-start justify-between gap-3 text-[11px]">
                      <div className="min-w-0">
                        <div className="text-[#7A6A58]">{tax.name}</div>
                        <div className={`${tax.refundable ? 'text-green-700' : 'text-[#E8631A]'}`}>
                          {tax.refundable ? 'Refundable' : 'Non-refundable'}
                        </div>
                      </div>
                      <div className="font-medium text-[#7A6A58]">{formatRupees(taxAmount * quantity)}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      });
  }

  async function handlePay() {
    if (!termsAccepted) return;
    setProcessing(true);

    try {
      const ip = localStorage.getItem('ipaddress') ?? await getIpAddress() ?? '';
      const payload = buildBookingPayload(state, ip);

      setStatusMessage('Creating booking...');
      const isPackage = config.category === 'package';
      let bookingResult: any;

      if (isPackage) {
        bookingResult = await createPackageBooking.mutateAsync(payload);
      } else {
        bookingResult = await createBooking.mutateAsync(payload);
      }

      if (!bookingResult?.id) {
        showErrorToastMessage('Booking creation failed. Please try again.');
        setProcessing(false);
        return;
      }

      setStatusMessage('Confirming booking...');
      showSuccessToastMessage('Booking created! Proceeding to payment...');

      const confirmResult = await confirmBooking.mutateAsync({
        bookingId: bookingResult.id,
        isComposite: isPackage,
      });

      if (!confirmResult?.ENCDATA || !confirmResult?.MERCHANTCODE || !confirmResult?.SERVICEID) {
        showErrorToastMessage('Payment gateway data is incomplete. Please try again.');
        setProcessing(false);
        setStatusMessage('');
        return;
      }

      setStatusMessage('Redirecting to payment gateway...');
      handlePaymentRedirect(confirmResult);

      // If redirect didn't happen (e.g. free ticket), close gracefully
      setTimeout(() => setProcessing(false), 3000);
    } catch {
      setProcessing(false);
      setStatusMessage('');
    }
  }

  return (
    <div className="space-y-5">
      {/* Summary header */}
      <div className="bg-[#F5E8CC] rounded-[12px] p-4 space-y-1.5">
        <div className="text-xs font-bold text-[#2C2017] uppercase tracking-[0.5px]">
          {config.placeName}
        </div>
        <div className="text-xs text-[#7A6A58] flex gap-3 flex-wrap">
          <span>📅 {formattedDate || selectedDate}</span>
          {selectedShift && selectedShift.id !== 'general' && shiftLabel && (
            <span>⏰ {shiftLabel}</span>
          )}
        </div>
      </div>

      {/* Ticket breakdown */}
      <div className="space-y-2">
        <div className="text-[10px] font-bold text-[#2C2017] uppercase tracking-[0.3px]">Ticket Summary</div>
        {selectedTickets.map(({ ticketType, quantity }) => {
          const charge = ticketType.specificCharges?.[0];
          const price = charge?.totalAmount ?? charge?.amount ?? ticketType.amount ?? 0;
          const isConfigOpen = openConfigTicketId === ticketType.id;
          const configItems = configByTicketId[ticketType.id] ?? [];
          const visibleConfigItems = renderChargeRows(configItems, quantity);
          const inventoryFareDetails = getInventoryFareDetails(state, quantity);
          return (
            <div key={ticketType.id} className="relative">
              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[#2C2017]">
                    {ticketType.masterTicketTypeName} × {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleTicketConfig(ticketType.id)}
                    className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
                      isConfigOpen
                        ? 'border-[#E8631A] bg-[#FFF5EE] text-[#E8631A]'
                        : 'border-[#E8DAC5] bg-white text-[#7A6A58] hover:border-[#E8631A] hover:text-[#E8631A]'
                    }`}
                    aria-label={`View fare details for ${ticketType.masterTicketTypeName}`}
                  >
                    i
                  </button>
                </div>
                <span className="font-semibold text-[#2C2017]">{formatRupees(price * quantity)}</span>
              </div>

              {isConfigOpen && (
                <div className="mt-2 rounded-[12px] border border-[#E8DAC5] bg-[#FFF9F2] p-3 shadow-[0_8px_24px_rgba(44,32,23,0.08)]">
                  {ticketConfig.isPending && !configItems.length ? (
                    <div className="text-xs text-[#7A6A58]">Loading fare details...</div>
                  ) : visibleConfigItems.length > 0 || inventoryFareDetails.length > 0 ? (
                    <div className="space-y-3">
                      {visibleConfigItems}

                      {inventoryFareDetails.length > 0 && (
                        <div className={`${visibleConfigItems.length > 0 ? 'border-t border-[#E8DAC5] pt-3' : ''} space-y-2`}>
                          {inventoryFareDetails.map((item) => (
                            <div key={item.id} className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="text-xs font-semibold text-[#2C2017]">{item.label}</div>
                                <div className="text-[10px] mt-0.5 text-[#E8631A]">Non-refundable</div>
                              </div>
                              <div className="text-xs font-semibold text-[#2C2017]">{formatRupees(item.amount)}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-[#7A6A58]">No additional fare details available for this ticket.</div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {addonTotal > 0 && (
          <div className="flex items-center justify-between text-sm pt-1 border-t border-[#E8DAC5]">
            <span className="text-[#7A6A58]">Add-ons</span>
            <span className="font-semibold text-[#2C2017]">{formatRupees(addonTotal)}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t-2 border-[#E8DAC5]">
          <span className="font-bold text-[#2C2017]">Total Payable</span>
          <span className="text-lg font-bold text-[#E8631A]">{formatRupees(total + addonTotal)}</span>
        </div>
      </div>

      {/* Visitors summary */}
      {hasVisitorDetails && (
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-[#2C2017] uppercase tracking-[0.3px]">Visitors</div>
          {visitorForms.map((form, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-[#7A6A58]">
              <span className="w-5 h-5 rounded-full bg-[#E8DAC5] flex items-center justify-center text-[9px] font-bold text-[#2C2017] flex-shrink-0">
                {i + 1}
              </span>
              <span className="font-medium text-[#2C2017]">{form.fullName}</span>
              <span className="text-[#7A6A58]">· {form.ticketTypeName}</span>
            </div>
          ))}
        </div>
      )}

      {/* T&C */}
      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="mt-0.5 accent-[#E8631A] flex-shrink-0"
        />
        <span className="text-xs text-[#7A6A58] leading-relaxed">
          I agree to the{' '}
          <a href="#" target="_blank" className="text-[#E8631A] underline" rel="noopener noreferrer">
            Terms & Conditions
          </a>
          {hasVisitorDetails ? ' and confirm all visitor details are correct.' : '.'}
        </span>
      </label>

      {/* Processing status */}
      {processing && (
        <div className="flex items-center gap-2 text-sm text-[#E8631A] bg-[#FFF5EE] px-4 py-3 rounded-[10px]">
          <div className="w-4 h-4 border-2 border-[#E8631A]/30 border-t-[#E8631A] rounded-full animate-spin flex-shrink-0" />
          <span>{statusMessage || 'Processing...'}</span>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={processing}
          className="flex-1 py-3 border-2 border-[#E8DAC5] text-[#2C2017] font-semibold rounded-full hover:bg-[#F5E8CC] disabled:opacity-40 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handlePay}
          disabled={!termsAccepted || processing}
          className="flex-1 py-3 bg-[#E8631A] text-white font-bold rounded-full hover:bg-[#C04E0A] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {processing ? 'Processing...' : `Pay ${formatRupees(total + addonTotal)} →`}
        </button>
      </div>
    </div>
  );
}
