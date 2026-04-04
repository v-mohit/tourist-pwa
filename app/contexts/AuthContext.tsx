'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

export interface AuthUser {
  email: string
  fullName?: string
  phone?: string
}

export type AuthModalType = 'login' | 'signup' | null

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  activeModal: AuthModalType
  openLoginModal: () => void
  openSignupModal: () => void
  closeModal: () => void
  login: (email: string, password: string) => Promise<void>
  signup: (fullName: string, email: string, phone: string, password: string) => Promise<void>
  logout: () => void
  switchToSignup: () => void
  switchToLogin: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [activeModal, setActiveModal] = useState<AuthModalType>(null)

  const openLoginModal = useCallback(() => {
    setActiveModal('login')
  }, [])

  const openSignupModal = useCallback(() => {
    setActiveModal('signup')
  }, [])

  const closeModal = useCallback(() => {
    setActiveModal(null)
  }, [])

  const switchToLogin = useCallback(() => {
    setActiveModal('login')
  }, [])

  const switchToSignup = useCallback(() => {
    setActiveModal('signup')
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, this would validate with your backend
    const userData: AuthUser = { email }
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    closeModal()
  }, [closeModal])

  const signup = useCallback(
    async (fullName: string, email: string, phone: string, password: string) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, this would validate with your backend
      const userData: AuthUser = { email, fullName, phone }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      closeModal()
    },
    [closeModal]
  )

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('user')
  }, [])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    activeModal,
    openLoginModal,
    openSignupModal,
    closeModal,
    login,
    signup,
    logout,
    switchToLogin,
    switchToSignup,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
