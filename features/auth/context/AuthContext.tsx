'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import { AuthUser, AuthModalType, LoginStep, LoginWith } from '@/features/auth/types';
import { LOGGEDIN_USER_DATA } from '@/utils/constants/common.constants';
import { handleLogout } from '@/utils/common.utils';

type PostLoginAction = (() => void) | null;

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  activeModal: AuthModalType;
  loginStep: LoginStep;
  loginWith: LoginWith;
  openLoginModal: () => void;
  closeModal: () => void;
  setLoginStep: (step: LoginStep) => void;
  setLoginWith: (type: LoginWith) => void;
  setUser: (user: AuthUser) => void;
  logout: () => void;
  setPostLoginAction: (action: PostLoginAction) => void;
  postLoginAction: PostLoginAction;
  clearPostLoginAction: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function readUserFromCookie(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = getCookie(LOGGEDIN_USER_DATA) as string | undefined;
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(readUserFromCookie);
  const [activeModal, setActiveModal] = useState<AuthModalType>(null);
  const [loginStep, setLoginStep] = useState<LoginStep>(1);
  const [loginWith, setLoginWith] = useState<LoginWith>('');
  const [postLoginAction, setPostLoginActionState] = useState<PostLoginAction>(null);

  useEffect(() => {
    const handleLoginSuccess = () => {
      const u = readUserFromCookie();
      setUserState(u);

      if (postLoginAction) {
        setTimeout(() => {
          postLoginAction();
          setPostLoginActionState(null);
        }, 100);
      }

      setTimeout(() => {
        setActiveModal(null);
        setLoginStep(1);
        setLoginWith('');
      }, 300);
    };

    window.addEventListener('app:loginSuccess', handleLoginSuccess);
    return () => window.removeEventListener('app:loginSuccess', handleLoginSuccess);
  }, [postLoginAction]);

  const openLoginModal = useCallback(() => {
    setLoginStep(1);
    setLoginWith('');
    setActiveModal('login');
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setLoginStep(1);
    setLoginWith('');
  }, []);

  const setUser = useCallback((u: AuthUser) => {
    setUserState(u);
  }, []);

  const logout = useCallback(() => {
    setUserState(null);
    handleLogout();
  }, []);

  const setPostLoginAction = useCallback((action: PostLoginAction) => {
    setPostLoginActionState(() => action);
  }, []);

  const clearPostLoginAction = useCallback(() => {
    setPostLoginActionState(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    activeModal,
    loginStep,
    loginWith,
    openLoginModal,
    closeModal,
    setLoginStep,
    setLoginWith,
    setUser,
    logout,
    setPostLoginAction,
    postLoginAction,
    clearPostLoginAction,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
