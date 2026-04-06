'use client'

import { useAuth } from '@/features/auth/context/AuthContext'

export function useAuthModal() {
  const {
    activeModal,
    openLoginModal,
    openSignupModal,
    closeModal,
    switchToLogin,
    switchToSignup,
  } = useAuth()

  return {
    activeModal,
    openLoginModal,
    openSignupModal,
    closeModal,
    switchToLogin,
    switchToSignup,
  }
}
