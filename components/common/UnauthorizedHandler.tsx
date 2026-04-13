'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useBooking } from '@/features/booking/context/BookingContext';

/**
 * Watches the Zustand `isUnauthorized` flag set by the axios 401 interceptor.
 * When triggered, closes any open modal (booking, etc.) and shows the login modal.
 * Must be rendered inside both AuthProvider and BookingProvider.
 */
export default function UnauthorizedHandler() {
  const isUnauthorized = useAuthStore((s) => s.isUnauthorized);
  const setIsUnauthorized = useAuthStore((s) => s.setIsUnauthorized);
  const { openLoginModal } = useAuth();
  const { closeBookingModal } = useBooking();

  useEffect(() => {
    if (!isUnauthorized) return;

    closeBookingModal();
    openLoginModal();
    setIsUnauthorized(false);
  }, [isUnauthorized, closeBookingModal, openLoginModal, setIsUnauthorized]);

  return null;
}
