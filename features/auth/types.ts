export interface AuthUser {
  email: string
  fullName?: string
  phone?: string
}

export type AuthModalType = 'login' | 'signup' | null
