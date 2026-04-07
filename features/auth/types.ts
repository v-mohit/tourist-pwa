export type LoginStep = 1 | 2 | 3; // method selection → OTP → profile details
export type LoginWith = 'MOBILE' | 'EMAIL' | 'RAJSSO' | '';

export interface AuthUser {
  displayName?: string;
  fullName?: string;
  email?: string;
  mobile?: string;
  gender?: string;
  nationality?: string;
  userType?: string;
  expireType?: string;
  [key: string]: any;
}

export type AuthModalType = 'login' | null;
