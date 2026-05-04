'use client';

import { useEffect, useState } from 'react';
import type { BookingState, VisitorForm, AddonItem, ChoiceAddonSelection, TicketType } from '../../types/booking.types';
import { ID_PROOF_OPTIONS, GENDER_OPTIONS } from '../../types/booking.types';
import { useAddonItems, useChoiceVehicles, useChoiceGuides } from '../../hooks/useBookingApi';
import { showErrorToastMessage } from '@/utils/toast.utils';

// Mirrors the old project: nationality is derived from the ticket type's
// master name ("Indian …" / "Foreign …") instead of being asked separately.
function deriveNationality(name: string | undefined): string {
  const first = (name ?? '').trim().split(/\s+/)[0]?.toLowerCase();
  if (first === 'foreign' || first === 'foreigner') return 'FOREIGNER';
  return 'INDIAN';
}

function nationalityForTicket(ticketTypes: TicketType[], ticketTypeId: string): string {
  const tt = ticketTypes.find((t) => t.id === ticketTypeId);
  return deriveNationality(tt?.masterTicketTypeName);
}

function countAddon(ids: string[], addonId: string): number {
  let n = 0;
  for (const id of ids) if (id === addonId) n++;
  return n;
}

function setAddonCount(ids: string[], addonId: string, qty: number): string[] {
  const next = ids.filter((id) => id !== addonId);
  for (let i = 0; i < Math.max(0, qty); i++) next.push(addonId);
  return next;
}

/**
 * Some add-ons are physically singular for the whole booking — e.g. the
 * "Shikar Hodi" hide at Jhalana Leopard Safari is one fixed structure, so
 * only one tourist in the entire booking can claim it. UI for these is
 * a checkbox (qty 0 or 1) and only one visitor can hold it.
 */
function isSinglePickAddon(addon: AddonItem | { name?: string }): boolean {
  const name = String((addon as any)?.name || '').toLowerCase().replace(/\s+/g, ' ').trim();
  return name.includes('shikar hodi') || name.includes('shikarhodi');
}

interface Props {
  state: BookingState;
  onUpdate: (patch: Partial<BookingState>) => void;
  onNext: () => void;
  onBack: () => void;
}

function buildEmptyForm(): Omit<VisitorForm, 'ticketTypeId' | 'ticketTypeName'> {
  return {
    fullName: '',
    idProof: '',
    idNo: '',
    gender: '',
    nationality: 'INDIAN',
    mobileNo: '',
    addonItemIds: [],
    addonItemsWithRemark: [],
    choiceAddonSelections: [],
  };
}

// ─── Standard flow: all forms shown at once (one per pre-selected ticket) ────
function StandardVisitorForms({ state, onUpdate, onNext, onBack }: Props) {
  const addonMutation = useAddonItems();
  const [addonsMap, setAddonsMap] = useState<Record<string, AddonItem[]>>(() => {
    // Eagerly fetch addons on first render
    const map = { ...state.addonsMap };
    return map;
  });

  // Build forms from selectedTickets if not already built
  const forms = state.visitorForms;
  if (forms.length === 0) {
    const newForms: VisitorForm[] = [];
    state.selectedTickets.forEach(({ ticketType, quantity }) => {
      for (let i = 0; i < quantity; i++) {
        newForms.push({
          ...buildEmptyForm(),
          ticketTypeId: ticketType.id,
          ticketTypeName: `${ticketType.masterTicketTypeName}${quantity > 1 ? ` #${i + 1}` : ''}`,
          nationality: deriveNationality(ticketType.masterTicketTypeName),
        });
      }
    });
    // Trigger the update on next tick to avoid render-during-render
    setTimeout(() => {
      onUpdate({ visitorForms: newForms });
      const uniqueIds = [...new Set(state.selectedTickets.map((t) => t.ticketType.id))];
      uniqueIds.forEach((id) => {
        if (addonsMap[id]) return;
        addonMutation.mutateAsync({ ticketTypeId: id, date: state.selectedDateMs }).then((result) => {
          setAddonsMap((prev) => ({ ...prev, [id]: result }));
          onUpdate({ addonsMap: { ...state.addonsMap, [id]: result } });
        }).catch(() => {});
      });
    }, 0);
  }

  function updateVisitor(index: number, patch: Partial<VisitorForm>) {
    const next = [...state.visitorForms];
    next[index] = { ...next[index], ...patch };
    onUpdate({ visitorForms: next });
  }

  function setAddonQty(index: number, addonId: string, qty: number) {
    const form = state.visitorForms[index];
    updateVisitor(index, { addonItemIds: setAddonCount(form.addonItemIds, addonId, qty) });
  }

  const isFormValid = state.visitorForms.every(
    (f) => f.fullName.trim() && f.idProof && f.idNo.trim() && f.gender && f.nationality,
  );

  return (
    <div className="space-y-5">
      <p className="text-xs text-[#7A6A58]">
        Fill in the details for each visitor.
      </p>

      {state.visitorForms.map((form, idx) => {
        const addons = addonsMap[form.ticketTypeId] ?? [];
        return (
          <div key={idx} className="border border-[#E8DAC5] rounded-[14px] overflow-hidden">
            <div className="bg-[#F5E8CC] px-4 py-2.5 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#E8631A] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                {idx + 1}
              </div>
              <span className="font-semibold text-sm text-[#2C2017]">{form.ticketTypeName}</span>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-[#2C2017] mb-1 uppercase tracking-[0.3px]">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => updateVisitor(idx, { fullName: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full px-3 py-2 border border-[#E8DAC5] rounded-[8px] text-sm focus:outline-none focus:border-[#E8631A]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#2C2017] mb-1 uppercase tracking-[0.3px]">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.gender}
                  onChange={(e) => updateVisitor(idx, { gender: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E8DAC5] rounded-[8px] text-sm focus:outline-none focus:border-[#E8631A] bg-white"
                >
                  <option value="">Select</option>
                  {GENDER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-[#2C2017] mb-1 uppercase tracking-[0.3px]">
                    ID Proof <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.idProof}
                    onChange={(e) => updateVisitor(idx, { idProof: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E8DAC5] rounded-[8px] text-sm focus:outline-none focus:border-[#E8631A] bg-white"
                  >
                    <option value="">Select</option>
                    {ID_PROOF_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#2C2017] mb-1 uppercase tracking-[0.3px]">
                    ID Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.idNo}
                    onChange={(e) => updateVisitor(idx, { idNo: e.target.value.toUpperCase() })}
                    placeholder="Enter ID number"
                    className="w-full px-3 py-2 border border-[#E8DAC5] rounded-[8px] text-sm focus:outline-none focus:border-[#E8631A]"
                  />
                </div>
              </div>

              {addons.length > 0 && (
                <div>
                  <label className="block text-[10px] font-bold text-[#2C2017] mb-2 uppercase tracking-[0.3px]">
                    Optional Add-ons
                  </label>
                  <div className="space-y-1.5">
                    {addons.map((addon) => {
                      const qty = countAddon(form.addonItemIds, addon.id);
                      const selected = qty > 0;

                      // Single-pick add-ons (e.g. Shikar Hodi) — one per booking, rendered as a checkbox.
                      if (isSinglePickAddon(addon)) {
                        const usedByOtherForms = state.visitorForms.reduce(
                          (sum, otherForm, otherIdx) => otherIdx === idx ? sum : sum + countAddon(otherForm.addonItemIds, addon.id),
                          0,
                        );
                        const locked = usedByOtherForms > 0 && !selected;
                        return (
                          <div
                            key={addon.id}
                            className={`flex items-center justify-between p-2.5 rounded-[8px] border transition-all ${selected ? 'border-[#E8631A] bg-[#FFF5EE]' : locked ? 'border-[#E8DAC5] bg-[#F5F5F5] opacity-70' : 'border-[#E8DAC5]'}`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selected}
                                disabled={locked}
                                onChange={() => setAddonQty(idx, addon.id, selected ? 0 : 1)}
                                className="accent-[#E8631A]"
                                aria-label={`${addon.name} — single-pick add-on`}
                              />
                              <div className="flex flex-col">
                                <span className="text-xs font-medium text-[#2C2017]">{addon.name}</span>
                                <span className="text-[10px] text-[#E8631A] font-bold">+₹{addon.totalAmount ?? addon.amount} · one per booking</span>
                              </div>
                            </div>
                            {locked && (
                              <span className="text-[10px] text-[#7A6A58] italic">Already added by another tourist</span>
                            )}
                          </div>
                        );
                      }

                      return (
                        <div
                          key={addon.id}
                          className={`flex items-center justify-between p-2.5 rounded-[8px] border transition-all ${selected ? 'border-[#E8631A] bg-[#FFF5EE]' : 'border-[#E8DAC5]'}`}
                        >
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-[#2C2017]">{addon.name}</span>
                            <span className="text-[10px] text-[#E8631A] font-bold">+₹{addon.totalAmount ?? addon.amount} each</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setAddonQty(idx, addon.id, qty - 1)}
                              disabled={qty <= 0}
                              aria-label={`Remove one ${addon.name}`}
                              className="w-7 h-7 rounded-full border border-[#E8DAC5] text-[#2C2017] font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FFF5EE]"
                            >−</button>
                            <span className="text-xs font-bold text-[#2C2017] min-w-[18px] text-center">{qty}</span>
                            <button
                              type="button"
                              onClick={() => setAddonQty(idx, addon.id, qty + 1)}
                              aria-label={`Add one ${addon.name}`}
                              className="w-7 h-7 rounded-full border border-[#E8631A] bg-[#E8631A] text-white font-bold hover:bg-[#C04E0A]"
                            >+</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 border-2 border-[#E8DAC5] text-[#2C2017] font-semibold rounded-full hover:bg-[#F5E8CC] transition-colors">
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!isFormValid}
          className="flex-1 py-3 bg-[#E8631A] text-white font-bold rounded-full hover:bg-[#C04E0A] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Review & Pay →
        </button>
      </div>
    </div>
  );
}

// ─── Inventory flow: one form at a time, user adds visitors one-by-one ────────
function InventoryVisitorForms({ state, onUpdate, onNext, onBack }: Props) {
  const addonMutation = useAddonItems();

  const ticketTypes = state.ticketTypes;
  const capacity = state.selectedInventory?.capacity ?? 0;
  const addedForms = state.visitorForms;

  // Current form being filled
  const [current, setCurrent] = useState<{
    ticketTypeId: string;
    fullName: string;
    mobileNo: string;
    idProof: string;
    idNo: string;
    gender: string;
    nationality: string;
    addonItemIds: string[];
  }>({
    ticketTypeId: ticketTypes[0]?.id ?? '',
    fullName: '',
    mobileNo: '',
    idProof: '',
    idNo: '',
    gender: '',
    nationality: deriveNationality(ticketTypes[0]?.masterTicketTypeName),
    addonItemIds: [],
  });

  const [addonsMap, setAddonsMap] = useState<Record<string, AddonItem[]>>(state.addonsMap);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const addons: AddonItem[] = addonsMap[current.ticketTypeId] ?? [];
  const selectedChoiceSelections = state.choiceAddonSelections[current.ticketTypeId] ?? [];
  const globallySelectedChoiceAddonIds = new Set(
    Object.values(state.choiceAddonSelections)
      .flat()
      .map((item) => item.addonItemId),
  );
  const { data: choiceVehicles = [] } = useChoiceVehicles({
    inventoryId: state.selectedInventory?.id,
    zoneId: state.selectedZone?.id,
    shiftId: state.selectedShift?.id,
    date: state.selectedDateMs,
  });
  const { data: choiceGuides = [] } = useChoiceGuides({
    placeId: state.config.placeId,
    zoneId: state.selectedZone?.id,
    shiftId: state.selectedShift?.id,
    date: state.selectedDateMs,
  });

  useEffect(() => {
    if (!current.ticketTypeId || addonsMap[current.ticketTypeId]) return;

    addonMutation.mutateAsync({ ticketTypeId: current.ticketTypeId, date: state.selectedDateMs }).then((result) => {
      setAddonsMap((prev) => ({ ...prev, [current.ticketTypeId]: result }));
      onUpdate({ addonsMap: { ...state.addonsMap, [current.ticketTypeId]: result } });
    }).catch(() => {});
  }, [current.ticketTypeId, state.selectedDateMs]);

  function handleTicketTypeChange(ticketTypeId: string) {
    setCurrent((prev) => ({
      ...prev,
      ticketTypeId,
      nationality: nationalityForTicket(ticketTypes, ticketTypeId),
      addonItemIds: [],
    }));
  }

  function setAddonQty(addonId: string, qty: number) {
    setCurrent((prev) => ({
      ...prev,
      addonItemIds: setAddonCount(prev.addonItemIds, addonId, qty),
    }));
  }

  function setChoiceAddonSelection(addon: AddonItem, selection: ChoiceAddonSelection | null) {
    const clearedSelections = Object.fromEntries(
      Object.entries(state.choiceAddonSelections).map(([ticketTypeId, selections]) => [
        ticketTypeId,
        selections.filter((item) => item.addonItemId !== addon.id),
      ]),
    );

    const currentSelections = clearedSelections[current.ticketTypeId] ?? [];
    const nextSelections = selection
      ? [...currentSelections, selection]
      : currentSelections;

    onUpdate({
      choiceAddonSelections: {
        ...clearedSelections,
        [current.ticketTypeId]: nextSelections,
      },
    });
  }

  function handleAdd() {
    if (!current.ticketTypeId) return showErrorToastMessage('Please select Tourist Type');
    if (!current.fullName.trim()) return showErrorToastMessage('Please enter full name');
    const isFirstMember = editIndex === null && addedForms.length === 0;
    if (isFirstMember && !current.mobileNo) return showErrorToastMessage('Please enter mobile number');
    if (current.mobileNo && !/^\d{10}$/.test(current.mobileNo)) return showErrorToastMessage('Please enter a valid 10-digit mobile number');
    if (!current.idProof) return showErrorToastMessage('Please select identity proof');
    if (!current.idNo.trim()) return showErrorToastMessage('Please enter identity number');
    if (!current.gender) return showErrorToastMessage('Please select gender');

    // Duplicate ID check
    const isDuplicate = addedForms.some(
      (f, i) => i !== editIndex && f.idNo === current.idNo.trim() && f.idProof === current.idProof,
    );
    if (isDuplicate) return showErrorToastMessage('This identity number already exists');

    const ticketType = ticketTypes.find((t: any) => t.id === current.ticketTypeId);
    const newForm: VisitorForm = {
      ticketTypeId: current.ticketTypeId,
      ticketTypeName: (ticketType as any)?.masterTicketTypeName ?? '',
      fullName: current.fullName.trim(),
      mobileNo: current.mobileNo,
      idProof: current.idProof,
      idNo: current.idNo.trim().toUpperCase(),
      gender: current.gender,
      nationality: current.nationality,
      addonItemIds: current.addonItemIds,
      addonItemsWithRemark: [],
    };

    let updatedForms: VisitorForm[];
    if (editIndex !== null) {
      updatedForms = [...addedForms];
      updatedForms[editIndex] = newForm;
      setEditIndex(null);
    } else {
      updatedForms = [...addedForms, newForm];
    }

    onUpdate({ visitorForms: updatedForms });

    // Reset form, keep ticket type for next entry
    setCurrent({
      ticketTypeId: current.ticketTypeId,
      fullName: '',
      mobileNo: '',
      idProof: '',
      idNo: '',
      gender: '',
      nationality: nationalityForTicket(ticketTypes, current.ticketTypeId),
      addonItemIds: [],
    });
  }

  function handleEdit(index: number) {
    const form = addedForms[index];
    setCurrent({
      ticketTypeId: form.ticketTypeId,
      fullName: form.fullName,
      mobileNo: form.mobileNo ?? '',
      idProof: form.idProof,
      idNo: form.idNo,
      gender: form.gender,
      nationality: form.nationality,
      addonItemIds: form.addonItemIds,
    });
    setEditIndex(index);
  }

  function handleDelete(index: number) {
    const updated = addedForms.filter((_, i) => i !== index);
    onUpdate({ visitorForms: updated });
    if (editIndex === index) {
      setEditIndex(null);
      setCurrent({
        ticketTypeId: ticketTypes[0]?.id ?? '',
        fullName: '',
        mobileNo: '',
        idProof: '',
        idNo: '',
        gender: '',
        nationality: deriveNationality(ticketTypes[0]?.masterTicketTypeName),
        addonItemIds: [],
      });
    }
  }

  const atCapacity = capacity > 0 && addedForms.length >= capacity;
  const canProceed = addedForms.length > 0 && editIndex === null;

  function handleProceed() {
    // Derive selectedTickets from visitorForms so ReviewPayStep can compute totals
    const countMap: Record<string, number> = {};
    addedForms.forEach((f) => {
      countMap[f.ticketTypeId] = (countMap[f.ticketTypeId] ?? 0) + 1;
    });
    const derived = Object.entries(countMap)
      .map(([id, quantity]) => {
        const tt = ticketTypes.find((t: any) => t.id === id);
        return tt ? { ticketType: tt as any, quantity } : null;
      })
      .filter(Boolean) as { ticketType: any; quantity: number }[];
    onUpdate({ selectedTickets: derived });
    onNext();
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-[#7A6A58]">
        Add member details one by one.
        {capacity > 0 && (
          <span className="ml-1 font-semibold text-[#E8631A]">
            ({addedForms.length}/{capacity} added)
          </span>
        )}
      </p>

      {/* Added members list */}
      {addedForms.length > 0 && (
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-[#2C2017] uppercase tracking-[0.3px]">Added Members</div>
          {addedForms.map((form, idx) => (
            <div key={idx} className={`flex items-center justify-between px-3 py-2.5 rounded-[10px] border ${editIndex === idx ? 'border-[#E8631A] bg-[#FFF5EE]' : 'border-[#E8DAC5] bg-white'}`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-6 h-6 rounded-full bg-[#E8631A] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-[#2C2017] truncate">{form.fullName}</div>
                  <div className="text-[10px] text-[#7A6A58]">{form.ticketTypeName}</div>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(idx)}
                  className="text-[10px] font-semibold text-[#E8631A] border border-[#E8631A] px-2 py-1 rounded-full"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(idx)}
                  className="text-[10px] font-semibold text-red-500 border border-red-300 px-2 py-1 rounded-full"
                >
                  Del
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form — hidden once at capacity and not editing */}
      {(!atCapacity || editIndex !== null) && (
        <div className="border border-[#E8DAC5] rounded-[14px] overflow-hidden">
          <div className="bg-[#F5E8CC] px-4 py-2.5">
            <span className="font-semibold text-sm text-[#2C2017]">
              {editIndex !== null ? `Edit Member ${editIndex + 1}` : 'Member Details'}
            </span>
          </div>

          <div className="p-4 space-y-3">
            {/* Tourist Type */}
            <div>
              <label className="block text-[10px] font-bold text-[#2C2017] mb-1 uppercase tracking-[0.3px]">
                Tourist Type <span className="text-red-500">*</span>
              </label>
              <select
                value={current.ticketTypeId}
                onChange={(e) => handleTicketTypeChange(e.target.value)}
                className="w-full px-3 py-2 border border-[#E8DAC5] rounded-[8px] text-sm focus:outline-none focus:border-[#E8631A] bg-white"
              >
                <option value="">Select Tourist Type</option>
                {ticketTypes.map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.masterTicketTypeName}
                    {t.amount ? ` (₹${t.amount})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-bold text-[#2C2017] mb-1 uppercase tracking-[0.3px]">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={current.fullName}
                onChange={(e) => setCurrent((p) => ({ ...p, fullName: e.target.value }))}
                placeholder="Enter full name"
                className="w-full px-3 py-2 border border-[#E8DAC5] rounded-[8px] text-sm focus:outline-none focus:border-[#E8631A]"
              />
            </div>

            {/* Mobile No — required for first member only */}
            <div>
              <label className="block text-[10px] font-bold text-[#2C2017] mb-1 uppercase tracking-[0.3px]">
                Mobile No {(addedForms.length === 0 && editIndex === null) && <span className="text-red-500">*</span>}
              </label>
              <input
                type="tel"
                inputMode="numeric"
                value={current.mobileNo}
                onChange={(e) => setCurrent((p) => ({ ...p, mobileNo: e.target.value.replace(/\D/g, '') }))}
                placeholder="10-digit mobile number"
                maxLength={10}
                className="w-full px-3 py-2 border border-[#E8DAC5] rounded-[8px] text-sm focus:outline-none focus:border-[#E8631A]"
              />
            </div>

            {/* ID Proof + ID Number */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-[#2C2017] mb-1 uppercase tracking-[0.3px]">
                  Identity Proof <span className="text-red-500">*</span>
                </label>
                <select
                  value={current.idProof}
                  onChange={(e) => setCurrent((p) => ({ ...p, idProof: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#E8DAC5] rounded-[8px] text-sm focus:outline-none focus:border-[#E8631A] bg-white"
                >
                  <option value="">Select</option>
                  {ID_PROOF_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#2C2017] mb-1 uppercase tracking-[0.3px]">
                  Identity No <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={current.idNo}
                  onChange={(e) => setCurrent((p) => ({ ...p, idNo: e.target.value.toUpperCase() }))}
                  placeholder="Enter ID number"
                  className="w-full px-3 py-2 border border-[#E8DAC5] rounded-[8px] text-sm focus:outline-none focus:border-[#E8631A]"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-[10px] font-bold text-[#2C2017] mb-1 uppercase tracking-[0.3px]">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                value={current.gender}
                onChange={(e) => setCurrent((p) => ({ ...p, gender: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E8DAC5] rounded-[8px] text-sm focus:outline-none focus:border-[#E8631A] bg-white"
              >
                <option value="">Select Gender</option>
                {GENDER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Addons */}
            {addons.length > 0 && (
              <div className="space-y-1.5">
                {addons.map((addon) => {
                  const qty = countAddon(current.addonItemIds, addon.id);
                  const selected = qty > 0;
                  const selectedChoice = selectedChoiceSelections.find((item) => item.addonItemId === addon.id);

                  // Single-pick add-ons (e.g. Shikar Hodi) — one per booking, rendered as a checkbox.
                  if (isSinglePickAddon(addon)) {
                    const usedByOthers = state.visitorForms.reduce(
                      (sum, savedForm, savedIdx) => savedIdx === editIndex ? sum : sum + countAddon(savedForm.addonItemIds, addon.id),
                      0,
                    );
                    const locked = usedByOthers > 0 && !selected;
                    return (
                      <div
                        key={addon.id}
                        className={`flex items-center justify-between p-2.5 rounded-[8px] border transition-all ${selected ? 'border-[#E8631A] bg-[#FFF5EE]' : locked ? 'border-[#E8DAC5] bg-[#F5F5F5] opacity-70' : 'border-[#E8DAC5]'}`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selected}
                            disabled={locked}
                            onChange={() => setAddonQty(addon.id, selected ? 0 : 1)}
                            className="accent-[#E8631A]"
                            aria-label={`${addon.name} — single-pick add-on`}
                          />
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-[#2C2017]">
                              {addon.name} {addon.totalAmount ? `(₹${addon.totalAmount})` : ''}
                            </span>
                            <span className="text-[10px] text-[#7A6A58]">One per booking</span>
                          </div>
                        </div>
                        {locked && (
                          <span className="text-[10px] text-[#7A6A58] italic">Already added</span>
                        )}
                      </div>
                    );
                  }

                  if (addon.choiceAddOnVehicle || addon.choiceAddOnGuide) {
                    const isTakenByAnotherSelection = globallySelectedChoiceAddonIds.has(addon.id) && editIndex === null;
                    if (isTakenByAnotherSelection) return null;

                    const options = addon.choiceAddOnVehicle
                      ? (choiceVehicles as any[]).map((item) => ({
                          id: item.id,
                          label: item.vehicleNumber ?? item.name ?? '',
                          rosterId: item.rosterId,
                        }))
                      : (choiceGuides as any[]).map((item) => ({
                          id: item.id,
                          label: item.name ?? '',
                          rosterId: item.rosterId,
                        }));

                    return (
                      <div key={addon.id} className="rounded-[8px] border border-[#E8DAC5] p-3 space-y-2">
                        <div className="text-xs font-medium text-[#2C2017]">
                          {addon.name} {addon.totalAmount ? `(₹${addon.totalAmount} per booking)` : ''}
                        </div>
                        <div className="text-[10px] text-[#7A6A58]">
                          This add-on applies once for the whole booking.
                        </div>
                        <select
                          value={selectedChoice?.id ?? ''}
                          onChange={(e) => {
                            const option = options.find((item) => item.id === e.target.value);
                            setChoiceAddonSelection(
                              addon,
                              option ? {
                                addonItemId: addon.id,
                                type: addon.choiceAddOnVehicle ? 'vehicle' : 'guide',
                                id: option.id,
                                label: option.label,
                                rosterId: option.rosterId,
                              } : null,
                            );
                          }}
                          className="w-full px-3 py-2 border border-[#E8DAC5] rounded-[8px] text-sm focus:outline-none focus:border-[#E8631A] bg-white"
                        >
                          <option value="">{addon.choiceAddOnVehicle ? 'Select Vehicle' : 'Select Guide'}</option>
                          {options.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={addon.id}
                      className={`flex items-center justify-between p-2.5 rounded-[8px] border transition-all ${selected ? 'border-[#E8631A] bg-[#FFF5EE]' : 'border-[#E8DAC5]'}`}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-[#2C2017]">{addon.name}</span>
                        {addon.totalAmount ? (
                          <span className="text-[10px] text-[#E8631A] font-bold">+₹{addon.totalAmount} each</span>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAddonQty(addon.id, qty - 1)}
                          disabled={qty <= 0}
                          aria-label={`Remove one ${addon.name}`}
                          className="w-7 h-7 rounded-full border border-[#E8DAC5] text-[#2C2017] font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FFF5EE]"
                        >−</button>
                        <span className="text-xs font-bold text-[#2C2017] min-w-[18px] text-center">{qty}</span>
                        <button
                          type="button"
                          onClick={() => setAddonQty(addon.id, qty + 1)}
                          aria-label={`Add one ${addon.name}`}
                          className="w-7 h-7 rounded-full border border-[#E8631A] bg-[#E8631A] text-white font-bold hover:bg-[#C04E0A]"
                        >+</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add / Update button */}
            <button
              onClick={handleAdd}
              disabled={atCapacity && editIndex === null}
              className="w-full py-2.5 bg-[#E8631A] text-white font-bold rounded-full hover:bg-[#C04E0A] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {editIndex !== null ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      )}

      {atCapacity && editIndex === null && (
        <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-2.5 rounded-[8px]">
          <span className="text-green-600 font-bold">✓</span>
          <span>All {capacity} members added. You can edit or proceed.</span>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 border-2 border-[#E8DAC5] text-[#2C2017] font-semibold rounded-full hover:bg-[#F5E8CC] transition-colors">
          ← Back
        </button>
        <button
          onClick={handleProceed}
          disabled={!canProceed}
          className="flex-1 py-3 bg-[#E8631A] text-white font-bold rounded-full hover:bg-[#C04E0A] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Review & Pay →
        </button>
      </div>
    </div>
  );
}

// ─── Entry point — picks the right sub-component based on booking category ───
export default function VisitorFormsStep(props: Props) {
  if (props.state.config.category === 'inventory') {
    return <InventoryVisitorForms {...props} />;
  }
  return <StandardVisitorForms {...props} />;
}
