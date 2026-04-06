"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { AuthUser, AuthModalType } from "@/features/auth/types";
import { loginApi, signupApi } from "@/features/auth/api/authApi";

type PostLoginAction = (() => void) | null;

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  activeModal: AuthModalType | null;
  openLoginModal: () => void;
  openSignupModal: () => void;
  closeModal: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    fullName: string,
    email: string,
    phone: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
  switchToSignup: () => void;
  switchToLogin: () => void;

  // ✅ fixed typing
  setPostLoginAction: (action: PostLoginAction) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [activeModal, setActiveModal] = useState<AuthModalType | null>(null);

  const [postLoginAction, setPostLoginAction] = useState<PostLoginAction>(null);
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null;

    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? (JSON.parse(storedUser) as AuthUser) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const openLoginModal = useCallback((): void => {
    setActiveModal("login");
  }, []);

  const openSignupModal = useCallback((): void => {
    setActiveModal("signup");
  }, []);

  const closeModal = useCallback((): void => {
    setActiveModal(null);
  }, []);

  const switchToLogin = useCallback((): void => {
    setActiveModal("login");
  }, []);

  const switchToSignup = useCallback((): void => {
    setActiveModal("signup");
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      const userData = await loginApi(email, password);

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      closeModal();

      if (postLoginAction) {
        postLoginAction();
        setPostLoginAction(null);
      }
    },
    [closeModal, postLoginAction],
  );

  const signup = useCallback(
    async (
      fullName: string,
      email: string,
      phone: string,
      password: string,
    ): Promise<void> => {
      const userData = await signupApi(fullName, email, phone, password);

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      closeModal();

      if (postLoginAction) {
        postLoginAction();
        setPostLoginAction(null);
      }
    },
    [closeModal, postLoginAction],
  );

  const logout = useCallback((): void => {
    setUser(null);
    localStorage.removeItem("user");
  }, []);

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
    setPostLoginAction,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
