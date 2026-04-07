'use client';

import { useAuth } from '@/features/auth/context/AuthContext';

export function useAuthModal() {
  const { activeModal, openLoginModal, closeModal } = useAuth();
  return { activeModal, openLoginModal, closeModal };
}
