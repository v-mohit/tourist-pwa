'use client';

import { useAuth } from "@/features/auth/context/AuthContext";
import { useState } from "react";
import BookingModal from "../modals/BookingModal";

export default function BookingButton({ place }: any) {
  const { isAuthenticated, openLoginModal, setPostLoginAction } = useAuth();

  const [openBooking, setOpenBooking] = useState(false);

  const openBookingFlow = () => {
    setOpenBooking(true);
  };

  const handleClick = () => {
    if (!isAuthenticated) {
      // 🔥 store action to run after login
      setPostLoginAction(() => openBookingFlow);

      openLoginModal();
      return;
    }

    openBookingFlow();
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="w-full bg-orange-500 text-white py-2 rounded-lg"
      >
        Book Entry →
      </button>

      {openBooking && (
        <BookingModal
          place={place}
          onClose={() => setOpenBooking(false)}
        />
      )}
    </>
  );
}