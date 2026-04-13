'use client';

import { useBooking } from '../context/BookingContext';
import { useAuth } from '@/features/auth/context/AuthContext';
import { usePackageObmsPlaceId } from '../hooks/useBookingApi';
import type { PlaceBookingConfig } from '../types/booking.types';

interface BookNowButtonProps {
  config: PlaceBookingConfig;
  label?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'small';
}

/**
 * Drop-in "Book Now" button.
 *
 * Usage:
 *   <BookNowButton
 *     config={{ placeId: '123', placeName: 'Amber Fort', category: 'standard' }}
 *   />
 *
 * If the user is not logged in, the auth modal opens first.
 * After login, the booking flow opens automatically via postLoginAction.
 */
export default function BookNowButton({
  config,
  label = 'Book Now →',
  className,
  variant = 'primary',
}: BookNowButtonProps) {
  const { openBookingModal } = useBooking();
  const { user, openLoginModal, setPostLoginAction } = useAuth();
  const packagePlaceMutation = usePackageObmsPlaceId();

  async function openResolvedBooking(configToOpen: PlaceBookingConfig) {
    if (configToOpen.category === 'package' && configToOpen.locationId) {
      const packagePlace = await packagePlaceMutation.mutateAsync(configToOpen.locationId).catch(() => null);
      if (!packagePlace) return;

      openBookingModal({
        ...configToOpen,
        placeId: packagePlace?.id ?? configToOpen.placeId,
      });
      return;
    }

    openBookingModal(configToOpen);
  }

  function handleClick(e: React.MouseEvent) {
    // Prevent parent Link/anchor from navigating when this button is nested inside one
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setPostLoginAction(() => {
        void openResolvedBooking(config);
      });
      openLoginModal();
      return;
    }
    void openResolvedBooking(config);
  }

  const base =
    'font-bold transition-all duration-200 cursor-pointer inline-flex items-center justify-center gap-1';

  const variants = {
    primary:
      'px-5 py-2.5 bg-[#E8631A] text-white rounded-full hover:bg-[#C04E0A] hover:-translate-y-0.5 shadow-[0_2px_8px_rgba(232,99,26,0.3)] text-sm',
    secondary:
      'px-5 py-2.5 border-2 border-[#E8631A] text-[#E8631A] rounded-full hover:bg-[#FFF5EE] text-sm',
    small:
      'px-3 py-1.5 bg-[#E8631A] text-white rounded-full hover:bg-[#C04E0A] text-xs',
  };

  return (
    <button
      onClick={handleClick}
      onMouseDown={(e) => e.stopPropagation()}
      className={className ?? `${base} ${variants[variant]}`}
      aria-label={`Book tickets for ${config.placeName}`}
    >
      {label}
    </button>
  );
}
