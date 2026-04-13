'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { PlaceBookingConfig, BookingState } from '../types/booking.types';
import { createInitialBookingState } from '../types/booking.types';

interface BookingContextValue {
  isOpen: boolean;
  bookingState: BookingState | null;
  openBookingModal: (config: PlaceBookingConfig) => void;
  closeBookingModal: () => void;
  updateBookingState: (patch: Partial<BookingState>) => void;
}

const BookingContext = createContext<BookingContextValue | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [bookingState, setBookingState] = useState<BookingState | null>(null);

  const openBookingModal = useCallback((config: PlaceBookingConfig) => {
    setBookingState(createInitialBookingState(config));
    setIsOpen(true);
  }, []);

  const closeBookingModal = useCallback(() => {
    setIsOpen(false);
    // keep state briefly for exit animation
    setTimeout(() => setBookingState(null), 300);
  }, []);

  const updateBookingState = useCallback((patch: Partial<BookingState>) => {
    setBookingState((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  return (
    <BookingContext.Provider value={{ isOpen, bookingState, openBookingModal, closeBookingModal, updateBookingState }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}
