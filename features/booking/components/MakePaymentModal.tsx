'use client';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  isLoading?: boolean;
}

export default function MakePaymentModal({ open, onClose, onConfirm, loading = false, isLoading = false }: Props) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-[rgba(24,18,14,0.72)] backdrop-blur-[6px] z-[9990]"
        onClick={loading ? undefined : onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9991] w-full max-w-md px-4">
        <div className="bg-white rounded-[22px] shadow-[0_12px_48px_rgba(24,18,14,0.18)] relative">
          {!loading ? (
            <>
              <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-[#E8DAC5]">
                <h2 className="text-base font-bold text-[#2C2017]">Make Payment</h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="w-8 h-8 bg-[#F5E8CC] rounded-full flex items-center justify-center text-[#7A6A58] hover:bg-[#E8DAC5] text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="px-6 py-5 space-y-2">
                <p className="text-sm text-[#2C2017]">Are you sure you want to proceed?</p>
                <p className="text-xs text-[#7A6A58]">
                  (Note: Complete Payment in 5 Minutes to avoid booking failure.)
                </p>
              </div>

              <div className="flex justify-center gap-3 px-6 pb-5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-8 py-2.5 bg-[#707070] text-white font-bold rounded-lg hover:bg-[#5d5d5d] disabled:opacity-60 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="px-8 py-2.5 bg-[#E8631A] text-white font-bold rounded-lg hover:bg-[#C04E0A] disabled:opacity-60 transition-all inline-flex items-center gap-2"
                >
                  Confirm
                  {isLoading && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-10">
              <div className="w-10 h-10 border-4 border-[#E8631A] border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-center text-sm font-medium text-[#7A6A58]">
                Please wait while we are redirecting you to the payment page...
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
