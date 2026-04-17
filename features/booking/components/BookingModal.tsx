'use client';

import { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '@/features/auth/context/AuthContext';
import { BOOKING_STEPS } from '../types/booking.types';
import StepHeader from './shared/StepHeader';
import DateShiftStep from './steps/DateShiftStep';
import TicketSelectionStep from './steps/TicketSelectionStep';
import VisitorFormsStep from './steps/VisitorFormsStep';
import ReviewPayStep from './steps/ReviewPayStep';
import InventoryStep from './steps/InventoryStep';
import JkkStep from './steps/JkkStep';
import IgprsStep from './steps/IgprsStep';

// ─── Step index mapping per booking category ──────────────────────────────────
// Returns a JSX component for the given step index and category
function getStepTitle(category: string, stepIndex: number): string {
  return BOOKING_STEPS[category as keyof typeof BOOKING_STEPS]?.[stepIndex] ?? '';
}

function BookingModalBody({
  bookingState,
  closeBookingModal,
  updateBookingState,
  userId,
}: {
  bookingState: NonNullable<ReturnType<typeof useBooking>['bookingState']>;
  closeBookingModal: () => void;
  updateBookingState: ReturnType<typeof useBooking>['updateBookingState'];
  userId: string;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const { config } = bookingState;
  const steps = BOOKING_STEPS[config.category] ?? [];

  function goNext() { setStepIndex((i) => Math.min(i + 1, steps.length - 1)); }
  function goBack() {
    if (stepIndex === 0) { closeBookingModal(); return; }
    setStepIndex((i) => i - 1);
  }

  function renderNonInventorySteps() {
    // non-inventory/package: DateShift → Tickets → Review
    switch (stepIndex) {
      case 0:
        return (
          <DateShiftStep
            state={bookingState}
            onUpdate={updateBookingState}
            onNext={goNext}
          />
        );
      case 1:
        return (
          <TicketSelectionStep
            state={bookingState}
            onUpdate={updateBookingState}
            onNext={goNext}
            onBack={goBack}
          />
        );
      case 2:
        return (
          <ReviewPayStep
            state={bookingState}
            onBack={goBack}
          />
        );
      default:
        return null;
    }
  }

  function renderAsiSteps() {
    switch (stepIndex) {
      case 0:
        return (
          <DateShiftStep
            state={bookingState}
            onUpdate={updateBookingState}
            onNext={goNext}
          />
        );
      case 1:
        return (
          <TicketSelectionStep
            state={bookingState}
            onUpdate={updateBookingState}
            onNext={goNext}
            onBack={goBack}
          />
        );
      case 2:
        return (
          <VisitorFormsStep
            state={bookingState}
            onUpdate={updateBookingState}
            onNext={goNext}
            onBack={goBack}
          />
        );
      case 3:
        return (
          <ReviewPayStep
            state={bookingState}
            onBack={goBack}
          />
        );
      default:
        return null;
    }
  }

  function renderInventorySteps() {
    // inventory: DateShift → InventoryZone → Visitors (with ticket type per person) → Review
    switch (stepIndex) {
      case 0:
        return (
          <DateShiftStep
            state={bookingState}
            onUpdate={updateBookingState}
            onNext={goNext}
          />
        );
      case 1:
        return (
          <InventoryStep
            state={bookingState}
            onUpdate={updateBookingState}
            onNext={goNext}
            onBack={goBack}
          />
        );
      case 2:
        return (
          <VisitorFormsStep
            state={bookingState}
            onUpdate={updateBookingState}
            onNext={goNext}
            onBack={goBack}
          />
        );
      case 3:
        return (
          <ReviewPayStep
            state={bookingState}
            onBack={goBack}
          />
        );
      default:
        return null;
    }
  }

  function renderContent() {
    switch (config.category) {
      case 'standard':
      case 'package':
        return renderNonInventorySteps();

      case 'asi':
        return renderAsiSteps();

      case 'inventory':
        return renderInventorySteps();

      case 'jkk':
        return (
          <JkkStep
            state={bookingState}
            onUpdate={updateBookingState}
            onBack={closeBookingModal}
            userId={userId}
          />
        );

      case 'igprs':
        return (
          <IgprsStep
            state={bookingState}
            onUpdate={updateBookingState}
            onBack={closeBookingModal}
            userId={userId}
          />
        );

      default:
        return <div className="text-center text-sm text-[#7A6A58] py-8">Booking type not supported.</div>;
    }
  }

  const showStepHeader = config.category !== 'jkk' && config.category !== 'igprs';
  const stepTitle = showStepHeader ? getStepTitle(config.category, stepIndex) : '';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[rgba(24,18,14,0.72)] backdrop-blur-[6px] z-[9990] transition-opacity duration-300"
        onClick={closeBookingModal}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9991] w-full max-w-md px-4"
        role="dialog"
        aria-modal="true"
        aria-label={`Book ${config.placeName}`}
      >
        <div className="bg-white rounded-[22px] shadow-[0_12px_48px_rgba(24,18,14,0.18)] relative max-h-[90vh] flex flex-col">
          {/* Fixed header */}
          <div className="px-6 pt-6 pb-0 flex-shrink-0">
            {/* Close */}
            <button
              onClick={closeBookingModal}
              className="absolute top-4 right-4 w-8 h-8 bg-[#F5E8CC] rounded-full flex items-center justify-center text-[#7A6A58] hover:bg-[#E8DAC5] transition-colors text-sm z-10"
              aria-label="Close booking"
            >
              ✕
            </button>

            {/* Place name banner */}
            <div className="text-center mb-4">
              <div className="text-[10px] font-semibold tracking-[1px] uppercase text-[#E8631A]">
                Book Tickets
              </div>
              <h2 className="font-['Playfair_Display',serif] text-base font-bold text-[#2C2017] mt-0.5">
                {config.placeName}
              </h2>
            </div>

            {/* Step header (not for jkk/igprs which handle it internally) */}
            {showStepHeader && steps.length > 1 && (
              <StepHeader
                steps={steps}
                currentStep={stepIndex}
                title={stepTitle}
                onBack={stepIndex > 0 ? goBack : undefined}
              />
            )}

            {/* JKK/IGPRS title */}
            {!showStepHeader && (
              <div className="text-center mb-2">
                <div className="text-xs font-semibold text-[#7A6A58]">
                  {config.category === 'jkk' ? 'JKK / Cultural Venues' : 'Guest House Booking'}
                </div>
              </div>
            )}
          </div>

          {/* Scrollable content */}
          <div className="px-6 pb-6 pt-4 overflow-y-auto flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
}

export default function BookingModal() {
  const { isOpen, bookingState, closeBookingModal, updateBookingState, openBookingModal } = useBooking();
  const { user, openLoginModal, setPostLoginAction } = useAuth();

  // If modal is open but user is not logged in — prompt login first
  useEffect(() => {
    if (!isOpen || !bookingState) return;
    if (!user) {
      const savedConfig = bookingState.config;
      setPostLoginAction(() => {
        // Reopen the booking modal with the same config after login
        setTimeout(() => openBookingModal(savedConfig), 200);
      });
      openLoginModal();
      closeBookingModal();
    }
  }, [bookingState, closeBookingModal, isOpen, openLoginModal, setPostLoginAction, user]);

  if (!isOpen || !bookingState) return null;
  if (!user) return null;

  const userId = (user as any)?.sub ?? (user as any)?.id ?? '';
  return <BookingModalBody bookingState={bookingState} closeBookingModal={closeBookingModal} updateBookingState={updateBookingState} userId={userId} />;
}
