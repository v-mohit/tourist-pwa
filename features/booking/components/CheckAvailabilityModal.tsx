'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  usePlaceAvailabilityMonthWise,
  useJkkAvailabilityWithCategory,
  useJkkProgramDetails,
  useIgprsAvailabilityWithCategory,
} from '../hooks/useBookingApi';

/* ─── Types ─────────────────────────────────────────────────────────────────── */

interface Props {
  open: boolean;
  onClose: () => void;
  obmsPlaceId: string;
  placeName: string;
}

type AvailVariant = 'inventory' | 'jkk' | 'igprs';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const MONTH_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const STATUS_COLORS: Record<string, string> = {
  Available: 'bg-green-100 text-green-700 border-green-300',
  'Not Available': 'bg-red-50 text-red-400 border-red-200',
  'Payment Pending': 'bg-yellow-50 text-yellow-700 border-yellow-300',
};

/* ─── Helpers ───────────────────────────────────────────────────────────────── */

function detectVariant(name: string): AvailVariant {
  const n = name.toLowerCase();
  if (n.includes('jawahar') || n.includes('jkk')) return 'jkk';
  if (n.includes('indira gandhi') || n.includes('igpr')) return 'igprs';
  return 'inventory';
}

function parseDDMMYYYY(dateStr: string): Date | null {
  const [d, m, y] = dateStr.split('-').map(Number);
  if (!d || !m || !y) return null;
  return new Date(y, m - 1, d);
}

function getMonthDays(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/* ─── Calendar Grid ─────────────────────────────────────────────────────────── */

function CalendarGrid({
  year, month, availMap, onDateClick,
}: {
  year: number; month: number;
  availMap: Record<string, string>; // "DD-MM-YYYY" -> status
  onDateClick?: (dateStr: string, status: string | undefined, event: React.MouseEvent) => void;
}) {
  const days = getMonthDays(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <div className="grid grid-cols-7 gap-px text-center text-[9px] font-semibold text-[#7A6A58] mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;
          const dd = String(day).padStart(2, '0');
          const mm = String(month + 1).padStart(2, '0');
          const key = `${dd}-${mm}-${year}`;
          const status = availMap[key];
          const cellDate = new Date(year, month, day);
          const isPast = cellDate < today;

          const colorCls = isPast
            ? 'bg-gray-50 text-gray-300'
            : status
              ? STATUS_COLORS[status] || 'bg-gray-50 text-gray-400'
              : 'bg-gray-50 text-gray-400';

          // Tooltip for non-available / payment pending dates
          const tooltip = isPast ? 'Past date' : status && status !== 'Available' ? status : undefined;

          return (
            <button
              key={key}
              disabled={isPast}
              title={tooltip}
              onClick={(e) => {
                if (!isPast && status) onDateClick?.(key, status, e);
              }}
              className={`w-full aspect-square rounded-lg border text-[10px] font-medium flex items-center justify-center transition-all ${colorCls} ${!isPast && status ? 'cursor-pointer hover:ring-1 hover:ring-[#E8631A]' : 'cursor-default'}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Month Nav ─────────────────────────────────────────────────────────────── */

function MonthNav({ monthOffset, onChange }: { monthOffset: number; onChange: (n: number) => void }) {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() + monthOffset);
  return (
    <div className="flex items-center justify-between mb-3">
      <button onClick={() => onChange(monthOffset - 1)} disabled={monthOffset <= 0}
        className="px-3 py-1 rounded-lg border border-[#E8DAC5] text-sm disabled:opacity-30 hover:bg-[#FFF5EE]">←</button>
      <span className="text-sm font-semibold text-[#2C2017]">
        {MONTH_FULL[target.getMonth()]} {target.getFullYear()}
      </span>
      <button onClick={() => onChange(monthOffset + 1)} disabled={monthOffset >= 11}
        className="px-3 py-1 rounded-lg border border-[#E8DAC5] text-sm disabled:opacity-30 hover:bg-[#FFF5EE]">→</button>
    </div>
  );
}

/* ─── Legend ─────────────────────────────────────────────────────────────────── */

function Legend() {
  return (
    <div className="flex gap-3 flex-wrap text-[9px] mb-3">
      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-green-200 border border-green-400" /> Available</span>
      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-yellow-200 border border-yellow-400" /> Payment Pending</span>
      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-100 border border-red-300" /> Not Available</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   INVENTORY VARIANT
   ═══════════════════════════════════════════════════════════════════════════════ */

function InventoryAvailability({ obmsPlaceId }: { obmsPlaceId: string }) {
  const now = new Date();
  const [selMonth, setSelMonth] = useState(now.getMonth());
  const [selYear, setSelYear] = useState(now.getFullYear());
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [callApi, setCallApi] = useState(false);

  const { data, isLoading } = usePlaceAvailabilityMonthWise(
    obmsPlaceId, MONTHS[selMonth], String(selYear), callApi,
  );

  const dateDtoList: any[] = data?.dateDtoList ?? [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const availableDates = dateDtoList.filter((d: any) => {
    const parsed = parseDDMMYYYY(d.date);
    return parsed && parsed >= today && d.remark !== 'Not Available';
  });

  const activeData = activeDate ? dateDtoList.find((d: any) => d.date === activeDate) : null;

  return (
    <div className="space-y-4">
      {/* Month/Year selector */}
      <div className="flex gap-2">
        <select value={selMonth} onChange={(e) => { setSelMonth(Number(e.target.value)); setCallApi(false); setActiveDate(null); }}
          className="flex-1 px-3 py-2 border border-[#E8DAC5] rounded-lg text-sm">
          {MONTH_FULL.map((m, i) => <option key={m} value={i}>{m}</option>)}
        </select>
        <select value={selYear} onChange={(e) => { setSelYear(Number(e.target.value)); setCallApi(false); setActiveDate(null); }}
          className="w-24 px-3 py-2 border border-[#E8DAC5] rounded-lg text-sm">
          {[now.getFullYear(), now.getFullYear() + 1].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <button onClick={() => setCallApi(true)} disabled={isLoading}
        className="w-full py-2.5 bg-[#E8631A] text-white font-bold rounded-full text-sm disabled:opacity-40">
        {isLoading ? 'Loading...' : 'Check Availability'}
      </button>

      {callApi && !isLoading && availableDates.length === 0 && (
        <p className="text-xs text-[#7A6A58] text-center py-4">No availability found for this month.</p>
      )}

      {/* Available date pills */}
      {availableDates.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {availableDates.map((d: any) => {
            const parsed = parseDDMMYYYY(d.date);
            const isActive = activeDate === d.date;
            return (
              <button key={d.date} onClick={() => setActiveDate(d.date)}
                className={`px-3 py-2 rounded-xl border text-xs font-medium flex flex-col items-center transition-all min-w-[60px] ${isActive ? 'border-[#E8631A] bg-[#FFF5EE] text-[#E8631A]' : 'border-[#E8DAC5] text-[#2C2017] hover:border-[#E8631A]'}`}>
                <span className="font-bold">{parsed?.getDate()}</span>
                <span className="text-[9px] opacity-70">{parsed ? MONTHS[parsed.getMonth()] : ''}</span>
                <span className="text-[9px] text-green-600 mt-0.5">{d.seats} seats</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Zone / Shift / Vehicle breakdown */}
      {activeData && (
        <div className="space-y-3 border-t border-[#E8DAC5] pt-3">
          <p className="text-xs font-semibold text-[#2C2017]">
            Availability for {activeData.date}
          </p>
          {(activeData.zoneAvalDtoList ?? []).map((zone: any) => (
            <div key={zone.name} className="bg-[#FDF8F1] rounded-lg p-3 space-y-2">
              <div className="text-xs font-bold text-[#2C2017]">{zone.name}</div>
              {(zone.shiftAvalDtoList ?? []).map((shift: any) => (
                <div key={shift.id} className="ml-2 space-y-1">
                  <div className="text-[10px] font-semibold text-[#7A6A58]">{shift.name}</div>
                  <div className="flex flex-wrap gap-1.5 ml-2">
                    {(shift.vehicleAvalDtoList ?? []).map((v: any) => (
                      <span key={v.id}
                        className={`px-2 py-0.5 rounded text-[9px] font-medium border ${v.qty > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-400 border-red-200'}`}>
                        {v.name}: {v.qty}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   JKK VARIANT
   ═══════════════════════════════════════════════════════════════════════════════ */

function JkkAvailability() {
  const { mutate, data, isPending } = useJkkAvailabilityWithCategory();
  const programMutation = useJkkProgramDetails();
  const [monthOffset, setMonthOffset] = useState(0);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ dateStr: string; pos: { x: number; y: number }; content: string | null; loading: boolean } | null>(null);
  const programCacheRef = useRef<Record<string, any>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { mutate(); }, []);

  const categories: any[] = data ?? [];

  const now = new Date();
  const targetMonth = new Date(now.getFullYear(), now.getMonth() + monthOffset);
  const year = targetMonth.getFullYear();
  const month = targetMonth.getMonth();

  async function handleDateClick(dateStr: string, subId: number, event: React.MouseEvent) {
    // Position tooltip near the clicked cell
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    const x = rect.left - (containerRect?.left ?? 0);
    const y = rect.bottom - (containerRect?.top ?? 0) + 4;

    setTooltip({ dateStr, pos: { x, y }, content: null, loading: true });

    const cacheKey = `${dateStr}-${subId}`;
    if (programCacheRef.current[cacheKey]) {
      const cached = programCacheRef.current[cacheKey];
      setTooltip((t) => t ? { ...t, content: formatProgramData(cached, dateStr), loading: false } : null);
      return;
    }
    const parsed = parseDDMMYYYY(dateStr);
    if (!parsed) return;
    const startOfDay = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()).getTime();
    const endOfDay = startOfDay + 86400000 - 1;
    try {
      const result = await programMutation.mutateAsync({ startDate: startOfDay, endDate: endOfDay, subCategoryId: subId });
      programCacheRef.current[cacheKey] = result;
      setTooltip((t) => t ? { ...t, content: formatProgramData(result, dateStr), loading: false } : null);
    } catch {
      setTooltip((t) => t ? { ...t, content: `No details for ${dateStr}`, loading: false } : null);
    }
  }

  function formatProgramData(data: any, dateStr: string): string {
    if (!data || !Array.isArray(data) || data.length === 0) return `No program on ${dateStr}`;
    return data.map((p: any) => {
      const desc = p.jkkProgramDetailsDto?.description || '';
      return `${p.startDate} → ${p.endDate}${desc ? ': ' + desc : ''}`;
    }).join('\n');
  }

  if (isPending) return <div className="text-xs text-center text-[#7A6A58] py-8">Loading availability...</div>;

  return (
    <div className="space-y-3 relative" ref={containerRef}>
      <MonthNav monthOffset={monthOffset} onChange={setMonthOffset} />
      <Legend />

      {categories.map((cat: any) => (
        <div key={cat.name} className="space-y-2">
          <div className="text-xs font-bold text-[#2C2017] bg-[#F5E8CC] px-3 py-1.5 rounded-lg">{cat.name}</div>
          {(cat.subCategoryList ?? []).map((sub: any) => {
            const isOpen = openSub === `${cat.name}-${sub.name}`;
            const availMap: Record<string, string> = {};
            (sub.availabilityList ?? []).forEach((a: any) => { availMap[a.date] = a.status; });

            return (
              <div key={sub.id} className="border border-[#E8DAC5] rounded-lg overflow-hidden">
                <button onClick={() => { setOpenSub(isOpen ? null : `${cat.name}-${sub.name}`); setTooltip(null); }}
                  className="w-full px-3 py-2 flex items-center justify-between text-xs font-medium text-[#2C2017] hover:bg-[#FDF8F1] transition-colors">
                  <span>{sub.name}</span>
                  <span className="text-[#7A6A58]">{isOpen ? '▲' : '▼'}</span>
                </button>
                {isOpen && (
                  <div className="px-3 pb-3">
                    <CalendarGrid
                      year={year} month={month} availMap={availMap}
                      onDateClick={(d, _status, event) => handleDateClick(d, sub.id, event)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {/* Floating tooltip for program details */}
      {tooltip && (
        <div
          className="absolute bg-[#2C2017] text-white text-[10px] px-3 py-2 rounded-lg shadow-lg max-w-[220px] z-10"
          style={{ left: Math.min(tooltip.pos.x, 200), top: tooltip.pos.y }}
        >
          <button onClick={() => setTooltip(null)} className="absolute -top-1 -right-1 w-4 h-4 bg-[#7A6A58] rounded-full text-white text-[8px] flex items-center justify-center">✕</button>
          {tooltip.loading ? (
            <span>Loading...</span>
          ) : (
            <span className="whitespace-pre-line">{tooltip.content}</span>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   IGPRS VARIANT
   ═══════════════════════════════════════════════════════════════════════════════ */

function IgprsAvailability() {
  const { mutate, data, isPending } = useIgprsAvailabilityWithCategory();
  const [monthOffset, setMonthOffset] = useState(0);
  const [openCat, setOpenCat] = useState<string | null>(null);

  useEffect(() => { mutate(); }, []);

  const categories: any[] = data ?? [];

  const now = new Date();
  const targetMonth = new Date(now.getFullYear(), now.getMonth() + monthOffset);
  const year = targetMonth.getFullYear();
  const month = targetMonth.getMonth();

  if (isPending) return <div className="text-xs text-center text-[#7A6A58] py-8">Loading availability...</div>;

  return (
    <div className="space-y-3">
      <MonthNav monthOffset={monthOffset} onChange={setMonthOffset} />
      <Legend />

      {categories.map((cat: any) => {
        const isOpen = openCat === cat.name;
        const availMap: Record<string, string> = {};
        (cat.availabilityList ?? []).forEach((a: any) => { availMap[a.date] = a.status; });

        return (
          <div key={cat.name} className="border border-[#E8DAC5] rounded-lg overflow-hidden">
            <button onClick={() => setOpenCat(isOpen ? null : cat.name)}
              className="w-full px-3 py-2 flex items-center justify-between text-xs font-medium text-[#2C2017] hover:bg-[#FDF8F1] transition-colors">
              <span>{cat.name}</span>
              <span className="text-[#7A6A58]">{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
              <div className="px-3 pb-3">
                <CalendarGrid year={year} month={month} availMap={availMap} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN MODAL
   ═══════════════════════════════════════════════════════════════════════════════ */

export default function CheckAvailabilityModal({ open, onClose, obmsPlaceId, placeName }: Props) {
  if (!open) return null;

  const variant = detectVariant(placeName);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[rgba(24,18,14,0.72)] backdrop-blur-[6px] z-[9990] transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9991] w-full max-w-md px-4">
        <div className="bg-white rounded-[22px] shadow-[0_12px_48px_rgba(24,18,14,0.18)] relative max-h-[85vh] flex flex-col">
          {/* Header */}
          <div className="px-6 pt-5 pb-3 flex-shrink-0 border-b border-[#E8DAC5]">
            <button onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-[#F5E8CC] rounded-full flex items-center justify-center text-[#7A6A58] hover:bg-[#E8DAC5] text-sm z-10">
              ✕
            </button>
            <div className="text-center">
              <div className="text-[10px] font-semibold tracking-[1px] uppercase text-[#E8631A]">Check Availability</div>
              <h2 className="font-['Playfair_Display',serif] text-base font-bold text-[#2C2017] mt-0.5">{placeName}</h2>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 overflow-y-auto flex-1">
            {variant === 'inventory' && <InventoryAvailability obmsPlaceId={obmsPlaceId} />}
            {variant === 'jkk' && <JkkAvailability />}
            {variant === 'igprs' && <IgprsAvailability />}
          </div>
        </div>
      </div>
    </>
  );
}
