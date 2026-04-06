'use client';

import { useAuth } from "@/features/auth/context/AuthContext";
import CtaSection from "./components/CtaSection";

export default function HomeClient() {
  const { isAuthenticated, openLoginModal } = useAuth();

  const handleBookClick = () => {
    if (!isAuthenticated) {
      openLoginModal();
    } else {
      alert("Proceed to booking!");
    }
  };

  return <CtaSection onBook={handleBookClick} />;
}