'use client';

import moment from 'moment-timezone';

interface RecentTicket {
  bookingId: string;
  createdDate: string | number;
  purchasePlaceDto?: { name?: string };
  placeDetailDto?: { name?: string };
  placeName?: string;
  paymentStatus: string;
  asi?: boolean;
}

interface Props {
  open: boolean;
  data: RecentTicket[];
  onClose: () => void;
}

function isSuccess(status: string): boolean {
  return String(status || '').toLowerCase().includes('success');
}

function statusClass(status: string): string {
  if (isSuccess(status)) return 'text-green-700 bg-green-50 border-green-200';
  if (String(status || '').toLowerCase().includes('fail')) return 'text-red-700 bg-red-50 border-red-200';
  return 'text-amber-700 bg-amber-50 border-amber-200';
}

export default function LastTransactionPopup({ open, data, onClose }: Props) {
  if (!open || !Array.isArray(data) || data.length === 0) return null;

  const hasFailed = data.some((d) => !isSuccess(d.paymentStatus));

  function openTicket(t: RecentTicket) {
    const id = encodeURIComponent(t.bookingId);
    const status = encodeURIComponent(t.paymentStatus || '');
    window.open(
      `/my-booking-ticket?bookingId=${id}&paymentStatus=${status}`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-[rgba(24,18,14,0.72)] backdrop-blur-[6px] z-[9990]"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9991] w-full max-w-2xl px-4">
        <div className="bg-white rounded-[22px] shadow-[0_12px_48px_rgba(24,18,14,0.18)] relative max-h-[85vh] flex flex-col">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 w-8 h-8 bg-[#F5E8CC] rounded-full flex items-center justify-center text-[#7A6A58] hover:bg-[#E8DAC5] text-sm z-10"
          >
            ✕
          </button>

          <div className="px-6 pt-5 pb-3 border-b border-[#E8DAC5]">
            <div className="text-[10px] font-semibold tracking-[1px] uppercase text-[#E8631A]">
              Last 10 Minutes
            </div>
            <h2 className="font-['Playfair_Display',serif] text-base font-bold text-[#2C2017] mt-0.5">
              Last Transaction
            </h2>
          </div>

          <div className="px-6 py-4 overflow-y-auto flex-1">
            {/* Desktop / tablet table */}
            <div className="hidden sm:block">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F5E8CC]">
                    <th className="text-left px-3 py-2 font-semibold text-[#2C2017]">Booking Date</th>
                    <th className="text-left px-3 py-2 font-semibold text-[#2C2017]">Booking ID</th>
                    <th className="text-left px-3 py-2 font-semibold text-[#2C2017]">Place</th>
                    <th className="text-left px-3 py-2 font-semibold text-[#2C2017]">Payment</th>
                    <th className="text-right px-3 py-2 font-semibold text-[#2C2017]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((t, i) => {
                    const dateStr = t.createdDate
                      ? moment(Number(t.createdDate) || t.createdDate).format('DD-MM-YYYY')
                      : '—';
                    const placeName = t.purchasePlaceDto?.name || t.placeDetailDto?.name || t.placeName || '—';
                    const showReverify = !isSuccess(t.paymentStatus) && !t.asi;
                    return (
                      <tr key={`${t.bookingId}-${i}`} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FBF7EF]'}>
                        <td className="px-3 py-2 text-[#2C2017]">{dateStr}</td>
                        <td className="px-3 py-2 font-mono text-[11px] text-[#2C2017]">{t.bookingId}</td>
                        <td className="px-3 py-2 text-[#2C2017]">{placeName}</td>
                        <td className="px-3 py-2">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusClass(t.paymentStatus)}`}>
                            {t.paymentStatus || '—'}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right">
                          {showReverify ? (
                            <button
                              type="button"
                              onClick={() => openTicket(t)}
                              className="text-[10px] font-bold uppercase tracking-[0.4px] text-white bg-[#E8631A] hover:bg-[#C04E0A] px-3 py-1.5 rounded-full"
                            >
                              Reverify
                            </button>
                          ) : (
                            <span className="text-[10px] text-[#7A6A58]">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden space-y-2">
              {data.map((t, i) => {
                const dateStr = t.createdDate
                  ? moment(Number(t.createdDate) || t.createdDate).format('DD-MM-YYYY')
                  : '—';
                const placeName = t.purchasePlaceDto?.name || t.placeDetailDto?.name || t.placeName || '—';
                const showReverify = !isSuccess(t.paymentStatus) && !t.asi;
                return (
                  <div key={`${t.bookingId}-${i}`} className="border border-[#E8DAC5] rounded-[12px] p-3 bg-white">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#2C2017] truncate">{placeName}</div>
                        <div className="text-[10px] font-mono text-[#7A6A58] mt-0.5">{t.bookingId}</div>
                        <div className="text-[10px] text-[#7A6A58] mt-0.5">Booked: {dateStr}</div>
                      </div>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold border ${statusClass(t.paymentStatus)} flex-shrink-0`}>
                        {t.paymentStatus || '—'}
                      </span>
                    </div>
                    {showReverify && (
                      <button
                        type="button"
                        onClick={() => openTicket(t)}
                        className="mt-2.5 w-full text-[11px] font-bold uppercase tracking-[0.4px] text-white bg-[#E8631A] hover:bg-[#C04E0A] py-1.5 rounded-full"
                      >
                        Reverify
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {hasFailed && (
              <div className="mt-3 text-[11px] text-red-700 bg-red-50 border border-red-200 rounded-md p-2.5 leading-snug">
                <strong>Note:</strong> If the payment was deducted but shows <em>Failed</em> /{' '}
                <em>Pending</em>, click <strong>Reverify</strong> to validate the transaction.
              </div>
            )}
          </div>

          <div className="px-6 pb-5 pt-2 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold uppercase tracking-[0.4px] text-[#7A6A58] hover:text-[#2C2017] px-4 py-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
