import { create } from 'zustand';

type BookingState = {
  step1: any;
  step2: any;

  setStep1: (data: any) => void;
  setStep2: (data: any) => void;

  reset: () => void;
};

export const useBookingStore = create<BookingState>((set) => ({
  step1: null,
  step2: null,

  setStep1: (data) => set({ step1: data }),
  setStep2: (data) => set({ step2: data }),

  reset: () => set({ step1: null, step2: null }),
}));