"use client";

import React, { useEffect, useMemo, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type SlotStatus = "Available" | "Pending" | "Not Available";

interface DayInfo {
  status: SlotStatus;
}

export interface AvailabilityModalProps {
  venueName: string;
  availabilityData: any; // raw API response
  onClose: () => void;
  isLoading?: boolean;
  error?: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const STATUS_CONFIG: Record<
  SlotStatus,
  { bg: string; dot: string; border: string; textColor: string }
> = {
  Available: {
    bg: "#E8F5E9",
    dot: "#34A853",
    border: "#C8E6C9",
    textColor: "#1B5E20",
  },
  Pending: {
    bg: "#FFF8E1",
    dot: "#FBBC04",
    border: "#FFE082",
    textColor: "#7A5C00",
  },
  "Not Available": {
    bg: "#FCE4EC",
    dot: "#EA4335",
    border: "#F8BBD9",
    textColor: "#7A0020",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

// Convert "DD-MM-YYYY" → "YYYY-MM-DD"
function normaliseDateKey(dateStr: string): string {
  const parts = dateStr.split("-");
  if (parts.length === 3 && parts[0].length === 2) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
}

function normaliseStatus(raw: string): SlotStatus {
  const s = raw?.toLowerCase?.() ?? "";
  if (s === "available") return "Available";
  if (s.includes("pending")) return "Pending";
  return "Not Available";
}

function buildDateMap(data: any): Record<string, DayInfo> {
  const map: Record<string, DayInfo> = {};
  if (!data) return map;

  const list: any[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.result)
      ? data.result
      : Array.isArray(data?.data)
        ? data.data
        : [];

  for (const item of list) {
    const rawDate: string | undefined =
      item.date ?? item.bookingDate ?? item.Date;
    const rawStatus: string | undefined =
      item.status ?? item.Status ?? item.availability;
    if (!rawDate || !rawStatus) continue;
    const key = normaliseDateKey(rawDate);
    map[key] = { status: normaliseStatus(rawStatus) };
  }
  return map;
}

// Collect all unique { year, month } present in the data, sorted chronologically
function getMonthsFromData(
  dateMap: Record<string, DayInfo>,
): { year: number; month: number }[] {
  const seen = new Set<string>();
  for (const key of Object.keys(dateMap)) {
    const [y, m] = key.split("-");
    seen.add(`${y}-${m}`);
  }
  if (seen.size === 0) {
    const now = new Date();
    return [{ year: now.getFullYear(), month: now.getMonth() }];
  }
  return Array.from(seen)
    .sort()
    .map((s) => {
      const [y, m] = s.split("-");
      return { year: parseInt(y), month: parseInt(m) - 1 };
    });
}

function countStatuses(
  dateMap: Record<string, DayInfo>,
  year: number,
  month: number,
) {
  const prefix = `${year}-${String(month + 1).padStart(2, "0")}-`;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let available = 0,
    pending = 0,
    notAvailable = 0;
  for (const [key, val] of Object.entries(dateMap)) {
    if (!key.startsWith(prefix)) continue;
    // Skip past dates — only count today and future
    const [y, m, d] = key.split("-").map(Number);
    const cellDate = new Date(y, m - 1, d);
    cellDate.setHours(0, 0, 0, 0);
    if (cellDate < today) continue;

    if (val.status === "Available") available++;
    else if (val.status === "Pending") pending++;
    else notAvailable++;
  }
  return { available, pending, notAvailable };
}

// ─────────────────────────────────────────────────────────────────────────────
// CalendarGrid
// ─────────────────────────────────────────────────────────────────────────────

const CalendarGrid: React.FC<{
  year: number;
  month: number;
  dateMap: Record<string, DayInfo>;
}> = ({ year, month, dateMap }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      {/* Day labels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "4px",
          marginBottom: "6px",
        }}
      >
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: "11px",
              fontWeight: 700,
              color: "#9E9E9E",
              padding: "4px 0",
              letterSpacing: "0.3px",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Cells */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "5px",
        }}
      >
        {cells.map((day, idx) => {
          if (day === null) return <div key={`e-${idx}`} />;

          const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const info = dateMap[key];
          const cellDate = new Date(year, month, day);
          cellDate.setHours(0, 0, 0, 0);
          const isPast = cellDate < today;
          const isToday = cellDate.getTime() === today.getTime();

          let bg = "#F5F5F5";
          let borderColor = "transparent";
          let textColor = "#BDBDBD";
          let dotColor: string | null = null;

          if (isPast) {
            bg = "#F5F5F5";
            textColor = "#BDBDBD";
          } else if (info) {
            const cfg = STATUS_CONFIG[info.status];
            bg = cfg.bg;
            borderColor = cfg.border;
            textColor = cfg.textColor;
            dotColor = cfg.dot;
          }

          if (isToday) borderColor = "#E8631A";

          return (
            <div
              key={key}
              style={{
                background: bg,
                borderRadius: "10px",
                padding: "8px 2px 6px",
                textAlign: "center",
                border: `1.5px solid ${borderColor}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                minHeight: "48px",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: isToday ? 800 : 600,
                  color: textColor,
                  lineHeight: 1,
                }}
              >
                {day}
              </span>
              {dotColor && (
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: dotColor,
                    display: "block",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// AvailabilityModal
// ─────────────────────────────────────────────────────────────────────────────

const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
  venueName,
  availabilityData,
  onClose,
  isLoading = false,
  error = null,
}) => {
  const dateMap = useMemo(
    () => buildDateMap(availabilityData),
    [availabilityData],
  );
  const months = useMemo(() => getMonthsFromData(dateMap), [dateMap]);

  const [monthIdx, setMonthIdx] = useState(0);
  const activeMonth = months[monthIdx] ?? {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  };
  const { year, month } = activeMonth;

  const counts = useMemo(
    () => countStatuses(dateMap, year, month),
    [dateMap, year, month],
  );
  const canPrev = monthIdx > 0;
  const canNext = monthIdx < months.length - 1;

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    /* ── Backdrop — centered ── */
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(24,18,14,0.55)",
        backdropFilter: "blur(4px)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      {/* ── Modal card — all corners rounded ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "560px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(24,18,14,0.25)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg,#E8631A,#FF69B4)",
            padding: "20px 20px 18px",
            borderRadius: "20px 20px 0 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <div>
            <p
              style={{
                fontSize: "10px",
                color: "rgba(255,255,255,0.8)",
                fontWeight: 700,
                letterSpacing: "0.9px",
                margin: "0 0 4px",
                textTransform: "uppercase",
              }}
            >
              Availability
            </p>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 800,
                color: "#fff",
                margin: 0,
                textTransform: "uppercase",
                fontFamily: "playfair-display, serif",
              }}
            >
              {venueName}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "rgba(255,255,255,0.22)",
              border: "none",
              color: "#fff",
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 20px 28px" }}>
          {/* ── Loading ── */}
          {isLoading && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "48px 0",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  border: "3px solid #FFD6E8",
                  borderTopColor: "#E8631A",
                  borderRadius: "50%",
                  animation: "av-spin 0.8s linear infinite",
                }}
              />
              <style>{`@keyframes av-spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ fontSize: "13px", color: "#7A6A58", margin: 0 }}>
                Checking availability…
              </p>
            </div>
          )}

          {/* ── Error ── */}
          {!isLoading && error && (
            <div
              style={{
                background: "#FCE4EC",
                border: "1px solid #F8BBD9",
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "13px", color: "#7A0020", margin: 0 }}>
                {error}
              </p>
            </div>
          )}

          {/* ── Calendar ── */}
          {!isLoading && !error && (
            <>
              {/* Month navigator */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                  background: "#FFF5F0",
                  borderRadius: "12px",
                  padding: "10px 14px",
                }}
              >
                <button
                  disabled={!canPrev}
                  onClick={() => setMonthIdx((i) => i - 1)}
                  style={{
                    background: canPrev ? "#E8631A" : "#E0D0C8",
                    border: "none",
                    color: "#fff",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    cursor: canPrev ? "pointer" : "not-allowed",
                    fontSize: "18px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "background 0.18s",
                  }}
                >
                  ‹
                </button>

                <div style={{ textAlign: "center" }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "15px",
                      fontWeight: 800,
                      color: "#18120E",
                      letterSpacing: "0.3px",
                    }}
                  >
                    {MONTH_NAMES[month]} {year}
                  </p>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: "11px",
                      color: "#9E9E9E",
                      fontWeight: 500,
                    }}
                  >
                    {monthIdx + 1} of {months.length}
                  </p>
                </div>

                <button
                  disabled={!canNext}
                  onClick={() => setMonthIdx((i) => i + 1)}
                  style={{
                    background: canNext ? "#E8631A" : "#E0D0C8",
                    border: "none",
                    color: "#fff",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    cursor: canNext ? "pointer" : "not-allowed",
                    fontSize: "18px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "background 0.18s",
                  }}
                >
                  ›
                </button>
              </div>

              {/* Summary pills */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                }}
              >
                {[
                  {
                    label: "Available",
                    count: counts.available,
                    cfg: STATUS_CONFIG["Available"],
                  },
                  {
                    label: "Pending",
                    count: counts.pending,
                    cfg: STATUS_CONFIG["Pending"],
                  },
                  {
                    label: "Booked",
                    count: counts.notAvailable,
                    cfg: STATUS_CONFIG["Not Available"],
                  },
                ].map((s) => (
                  <span
                    key={s.label}
                    style={{
                      background: s.cfg.bg,
                      color: s.cfg.textColor,
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "5px 12px",
                      borderRadius: "99px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: s.cfg.dot,
                        display: "inline-block",
                        flexShrink: 0,
                      }}
                    />
                    {s.label}: {s.count}
                  </span>
                ))}
              </div>

              {/* Calendar grid */}
              <CalendarGrid year={year} month={month} dateMap={dateMap} />

              {/* Legend */}
              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  marginTop: "16px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                {[
                  { label: "Available", dot: STATUS_CONFIG["Available"].dot },
                  {
                    label: "Payment Pending",
                    dot: STATUS_CONFIG["Pending"].dot,
                  },
                  {
                    label: "Not Available",
                    dot: STATUS_CONFIG["Not Available"].dot,
                  },
                  { label: "Past", dot: "#BDBDBD" },
                ].map((l) => (
                  <div
                    key={l.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: l.dot,
                        flexShrink: 0,
                        display: "inline-block",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#7A6A58",
                        fontWeight: 600,
                      }}
                    >
                      {l.label}
                    </span>
                  </div>
                ))}
                {/* Today indicator */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <span
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "4px",
                      border: "2px solid #E8631A",
                      background: "transparent",
                      flexShrink: 0,
                      display: "inline-block",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#7A6A58",
                      fontWeight: 600,
                    }}
                  >
                    Today
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              marginTop: "24px",
              width: "100%",
              padding: "13px",
              background: "linear-gradient(135deg,#E8631A,#FF69B4)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "13px",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityModal;
