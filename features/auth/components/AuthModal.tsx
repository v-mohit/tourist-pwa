'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { setCookie } from 'cookies-next';
import clsx from 'clsx';
import { useAuth } from '@/features/auth/context/AuthContext';
import { LoginStep, LoginWith } from '@/features/auth/types';
import {
  AUTHENTICATION_TOKEN,
  LOGGEDIN_USER_DATA,
  SSO_CURRENT_ENV_URL,
  LOGIN_TYPES,
} from '@/utils/constants/common.constants';
import { apiendpoints } from '@/utils/constants/api-endpoints.constants';
import axiosInstance from '@/configs/axios.config';
import {
  showSuccessToastMessage,
  showErrorToastMessage,
} from '@/utils/toast.utils';
import { getIpAddress } from '@/utils/common.utils';

// ─── OTP Input Component ─────────────────────────────────────────────────────

function OtpBoxes({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}) {
  const r0 = useRef<HTMLInputElement>(null);
  const r1 = useRef<HTMLInputElement>(null);
  const r2 = useRef<HTMLInputElement>(null);
  const r3 = useRef<HTMLInputElement>(null);
  const r4 = useRef<HTMLInputElement>(null);
  const r5 = useRef<HTMLInputElement>(null);
  const refs = [r0, r1, r2, r3, r4, r5];

  const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const digit = e.target.value.replace(/\D/g, '').slice(-1);
    const chars = (value || '      ').split('').slice(0, 6);
    while (chars.length < 6) chars.push(' ');
    chars[i] = digit || ' ';
    onChange(chars.join('').replace(/ /g, '').padEnd(6, ' ').trim() === '' ? '' : chars.join('').trimEnd());
    if (digit && i < 5) refs[i + 1].current?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const chars = (value || '').padEnd(6, ' ').split('');
      if (!chars[i]?.trim() && i > 0) {
        refs[i - 1].current?.focus();
      }
    }
    if (e.key === 'Enter') onSubmit();
  };

  return (
    <div className="flex gap-2 justify-center my-4">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] && value[i] !== ' ' ? value[i] : ''}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-10 h-12 text-center text-xl font-bold border-2 border-[#E8DAC5] rounded-lg focus:outline-none focus:border-[#E8631A] bg-white"
        />
      ))}
    </div>
  );
}

// ─── Main AuthModal ───────────────────────────────────────────────────────────

export default function AuthModal() {
  const { activeModal, closeModal, loginStep, loginWith, setLoginStep, setLoginWith, setUser } = useAuth();

  const isOpen = activeModal === 'login';

  // Step 2 state
  const [inputValue, setInputValue] = useState(''); // mobile number or email
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(120);
  const [timerRunning, setTimerRunning] = useState(false);

  // Step 3 state
  const [storedOtp, setStoredOtp] = useState('');
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    gender: '',
    nationality: '',
    country: '',
    dob: '',
  });

  // Reset step state when modal opens
  useEffect(() => {
    if (!isOpen) {
      setInputValue('');
      setOtpSent(false);
      setOtp('');
      setTimer(120);
      setTimerRunning(false);
      setStoredOtp('');
      setProfileForm({ fullName: '', email: '', gender: '', nationality: '', country: '', dob: '' });
    }
  }, [isOpen]);

  // OTP countdown timer
  useEffect(() => {
    if (!timerRunning) return;
    if (timer === 0) { setTimerRunning(false); return; }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timerRunning, timer]);

  const formatTimer = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const isEmail = loginWith === LOGIN_TYPES.EMAIL;

  // ── Store token in cookies and update user state ──────────────────────────
  const handleAuthSuccess = async (token: string) => {
    const userData = jwtDecode(token) as any;
    const cookieOpts = {
      path: '/',
      sameSite: 'lax' as const,
      ...(userData?.expireType
        ? { maxAge: Math.floor(Number(userData.expireType) / 1000) }
        : {}),
    };
    await setCookie(AUTHENTICATION_TOKEN, token, cookieOpts);
    await setCookie(LOGGEDIN_USER_DATA, JSON.stringify(userData), cookieOpts);
    setUser(userData);
    window.dispatchEvent(new Event('app:loginSuccess'));
  };

  // ── Send OTP mutation ─────────────────────────────────────────────────────
  const { mutate: sendOTP, isPending: isSendingOTP } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      if (isEmail) {
        formData.append('email', inputValue);
      } else {
        formData.append('mobileNo', inputValue);
      }
      const { data } = await axiosInstance.post(
        `${apiendpoints.guestLogin}?isEmailVerify=${isEmail}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return data;
    },
    onSuccess: (data) => {
      showSuccessToastMessage(data.message || 'OTP sent successfully');
      setOtpSent(true);
      setTimer(120);
      setTimerRunning(true);
    },
    onError: (error: any) => {
      showErrorToastMessage(error.response?.data?.message || 'Failed to send OTP');
    },
  });

  // ── Verify OTP mutation ───────────────────────────────────────────────────
  const { mutate: verifyOTP, isPending: isVerifying } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('otp', otp.trim());
      if (isEmail) {
        formData.append('email', inputValue);
      } else {
        formData.append('mobileNo', inputValue);
      }
      const { data } = await axiosInstance.post(
        `${apiendpoints.guestVerifyOtp}?isEmailVerify=${isEmail}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return data;
    },
    onSuccess: async (data) => {
      showSuccessToastMessage(data.message || 'OTP verified');
      const token = data.result?.token as string | undefined;
      if (!token) {
        // New user — go to profile step
        setStoredOtp(otp.trim());
        if (isEmail) {
          setProfileForm((f) => ({ ...f, email: inputValue }));
        }
        setLoginStep(3);
        return;
      }
      await handleAuthSuccess(token);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Invalid OTP';
      if (msg.toLowerCase().includes('invalid sso')) {
        showErrorToastMessage('Suspicious activity detected. Your account is blocked. Please contact support.');
      } else {
        showErrorToastMessage(msg);
      }
    },
  });

  // ── Sign up mutation ──────────────────────────────────────────────────────
  const { mutate: signUp, isPending: isSigningUp } = useMutation({
    mutationFn: async () => {
      const country = profileForm.nationality === 'indian' ? 'India' : profileForm.country;
      const ipAddress =
        localStorage.getItem('ipaddress') ||
        (await getIpAddress()) ||
        (process.env.NEXT_PUBLIC_STATIC_IP as string) ||
        '';
      const { data } = await axiosInstance.post(apiendpoints.guestSignUp, {
        displayName: profileForm.fullName,
        dob: profileForm.dob,
        email: profileForm.email,
        gender: profileForm.gender,
        nationality: profileForm.nationality,
        country,
        mobile: isEmail ? undefined : inputValue,
        otp: storedOtp,
        verifyEmail: isEmail,
        ipAddress,
      });
      return data;
    },
    onSuccess: async (data) => {
      showSuccessToastMessage(data.message || 'Profile saved');
      const token = data.result?.token as string | undefined;
      if (token) await handleAuthSuccess(token);
    },
    onError: (error: any) => {
      showErrorToastMessage(error.response?.data?.message || 'Signup failed');
    },
  });

  const handleResendOtp = () => {
    setOtp('');
    sendOTP();
  };

  const isProfileValid =
    profileForm.fullName.trim() &&
    profileForm.email.trim() &&
    profileForm.gender &&
    profileForm.nationality &&
    profileForm.dob &&
    (profileForm.nationality !== 'foreigner' || profileForm.country);

  const routeToSSO = () => {
    const currentPath = window.location.pathname + window.location.search;
    localStorage.setItem('lastVisitedRoute', currentPath);
    window.location.href = `${SSO_CURRENT_ENV_URL}/signin?ru=obmsadmin`;
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────

  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          'fixed inset-0 bg-[rgba(24,18,14,0.72)] backdrop-blur-[6px] z-[9990] transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={loginStep === 3 ? undefined : closeModal}
        aria-hidden={!isOpen}
      />

      {/* Modal container */}
      <div
        className={clsx(
          'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9991] w-full max-w-sm px-4 transition-all duration-300',
          loginStep === 3 && 'max-w-md',
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        )}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
      >
        <div className="bg-white rounded-[22px] shadow-[0_12px_48px_rgba(24,18,14,0.16)] p-8 relative max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          {loginStep !== 3 && (
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-8 h-8 bg-[#F5E8CC] rounded-full flex items-center justify-center text-[#7A6A58] hover:bg-[#E8DAC5] transition-colors text-sm"
              aria-label="Close"
            >
              ✕
            </button>
          )}

          {/* ── STEP 1: Method Selection ───────────────────────────────── */}
          {loginStep === 1 && (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-[14px] bg-gradient-to-br from-[#E8631A] to-[#D4A017] flex items-center justify-center text-2xl mx-auto mb-4 shadow-[0_4px_12px_rgba(232,99,26,0.3)]">
                  🏯
                </div>
                <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#2C2017] mb-1">
                  Sign In
                </h2>
                <p className="text-xs text-[#7A6A58]">
                  Book tickets and explore Rajasthan
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => { setLoginWith('MOBILE'); setLoginStep(2); }}
                  className="w-full py-3 px-4 bg-[#E8631A] text-white font-semibold rounded-full transition-all duration-200 hover:bg-[#C04E0A] hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  📱 Mobile Number
                </button>
                <button
                  onClick={() => { setLoginWith('EMAIL'); setLoginStep(2); }}
                  className="w-full py-3 px-4 border-2 border-[#E8DAC5] text-[#2C2017] font-semibold rounded-full transition-all duration-200 hover:bg-[#F5E8CC] flex items-center justify-center gap-2"
                >
                  ✉️ Email ID
                </button>
                <button
                  onClick={routeToSSO}
                  className="w-full py-3 px-4 border-2 border-[#E8DAC5] text-[#2C2017] font-semibold rounded-full transition-all duration-200 hover:bg-[#F5E8CC] flex items-center justify-center gap-2"
                >
                  🔐 Raj SSO ID
                </button>
              </div>
            </>
          )}

          {/* ── STEP 2: OTP Verification ───────────────────────────────── */}
          {loginStep === 2 && (
            <>
              <button
                onClick={() => { setLoginStep(1); setInputValue(''); setOtpSent(false); setOtp(''); }}
                className="flex items-center gap-1 text-sm text-[#7A6A58] hover:text-[#E8631A] mb-4 transition-colors"
              >
                ← Back
              </button>

              <div className="text-center mb-6">
                <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-[#2C2017] mb-1">
                  Welcome Guest
                </h2>
                <p className="text-xs text-[#7A6A58]">
                  Enter your {isEmail ? 'email address' : 'mobile number'} to receive an OTP
                </p>
              </div>

              {/* Input: mobile or email */}
              <div className="mb-4">
                <label className="block text-[10px] font-bold text-[#2C2017] mb-1.5 uppercase tracking-[0.3px]">
                  {isEmail ? 'Email Address' : 'Mobile Number'}
                </label>
                {isEmail ? (
                  <input
                    type="email"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !isSendingOTP && !otpSent && sendOTP()}
                    placeholder="you@example.com"
                    disabled={otpSent}
                    className="w-full px-3.5 py-2.5 border border-[#E8DAC5] rounded-[10px] text-sm focus:outline-none focus:border-[#E8631A] disabled:bg-[#F5F5F5] disabled:text-[#999]"
                  />
                ) : (
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 border border-[#E8DAC5] rounded-[10px] text-sm text-[#7A6A58] bg-[#F9F6F2] select-none">
                      +91
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={10}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value.replace(/\D/g, ''))}
                      onKeyDown={(e) => e.key === 'Enter' && !isSendingOTP && !otpSent && sendOTP()}
                      placeholder="10-digit number"
                      disabled={otpSent}
                      className="flex-1 px-3.5 py-2.5 border border-[#E8DAC5] rounded-[10px] text-sm focus:outline-none focus:border-[#E8631A] disabled:bg-[#F5F5F5] disabled:text-[#999]"
                      autoFocus
                    />
                  </div>
                )}
              </div>

              {/* OTP input (shown after OTP is sent) */}
              {otpSent && (
                <div className="mb-4">
                  <label className="block text-[10px] font-bold text-[#2C2017] mb-1 uppercase tracking-[0.3px]">
                    Enter OTP
                  </label>
                  <OtpBoxes value={otp} onChange={setOtp} onSubmit={() => otp.trim().length === 6 && !isVerifying && verifyOTP()} />

                  {/* Timer / Resend */}
                  <div className="text-right text-xs mt-1">
                    {timer > 0 ? (
                      <span className="text-[#7A6A58]">Resend in {formatTimer(timer)}</span>
                    ) : (
                      <button
                        onClick={handleResendOtp}
                        className="text-[#E8631A] font-semibold hover:opacity-70"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* CTA button */}
              {!otpSent ? (
                <button
                  onClick={() => sendOTP()}
                  disabled={isSendingOTP || (isEmail ? !inputValue.includes('@') : inputValue.length !== 10)}
                  className="w-full py-3 bg-[#E8631A] text-white font-bold rounded-full transition-all duration-200 hover:bg-[#C04E0A] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSendingOTP ? 'Sending OTP...' : 'Get OTP'}
                </button>
              ) : (
                <button
                  onClick={() => verifyOTP()}
                  disabled={isVerifying || otp.trim().length !== 6}
                  className="w-full py-3 bg-[#E8631A] text-white font-bold rounded-full transition-all duration-200 hover:bg-[#C04E0A] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isVerifying ? 'Verifying...' : 'Submit OTP'}
                </button>
              )}
            </>
          )}

          {/* ── STEP 3: Profile Details ────────────────────────────────── */}
          {loginStep === 3 && (
            <>
              <div className="text-center mb-6">
                <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-[#2C2017] mb-1">
                  Complete Your Profile
                </h2>
                <p className="text-xs text-[#7A6A58]">
                  Please fill in your details to continue
                </p>
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-[10px] font-bold text-[#2C2017] mb-1.5 uppercase tracking-[0.3px]">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm((f) => ({ ...f, fullName: e.target.value }))}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 border border-[#E8DAC5] rounded-[10px] text-sm focus:outline-none focus:border-[#E8631A]"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-bold text-[#2C2017] mb-1.5 uppercase tracking-[0.3px]">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 border border-[#E8DAC5] rounded-[10px] text-sm focus:outline-none focus:border-[#E8631A]"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-[10px] font-bold text-[#2C2017] mb-1.5 uppercase tracking-[0.3px]">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={profileForm.gender}
                    onChange={(e) => setProfileForm((f) => ({ ...f, gender: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border border-[#E8DAC5] rounded-[10px] text-sm focus:outline-none focus:border-[#E8631A] bg-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-[10px] font-bold text-[#2C2017] mb-1.5 uppercase tracking-[0.3px]">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={profileForm.dob}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setProfileForm((f) => ({ ...f, dob: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border border-[#E8DAC5] rounded-[10px] text-sm focus:outline-none focus:border-[#E8631A] bg-white"
                  />
                </div>

                {/* Nationality */}
                <div>
                  <label className="block text-[10px] font-bold text-[#2C2017] mb-1.5 uppercase tracking-[0.3px]">
                    Nationality <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={profileForm.nationality}
                    onChange={(e) => setProfileForm((f) => ({ ...f, nationality: e.target.value, country: '' }))}
                    className="w-full px-3.5 py-2.5 border border-[#E8DAC5] rounded-[10px] text-sm focus:outline-none focus:border-[#E8631A] bg-white"
                  >
                    <option value="">Select Nationality</option>
                    <option value="indian">Indian</option>
                    <option value="foreigner">Foreigner</option>
                  </select>
                </div>

                {/* Country (only for foreigners) */}
                {profileForm.nationality === 'foreigner' && (
                  <div>
                    <label className="block text-[10px] font-bold text-[#2C2017] mb-1.5 uppercase tracking-[0.3px]">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={profileForm.country}
                      onChange={(e) => setProfileForm((f) => ({ ...f, country: e.target.value }))}
                      placeholder="Enter your country"
                      className="w-full px-3.5 py-2.5 border border-[#E8DAC5] rounded-[10px] text-sm focus:outline-none focus:border-[#E8631A]"
                    />
                  </div>
                )}

                <button
                  onClick={() => signUp()}
                  disabled={!isProfileValid || isSigningUp}
                  className="w-full py-3 mt-2 bg-[#E8631A] text-white font-bold rounded-full transition-all duration-200 hover:bg-[#C04E0A] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSigningUp ? 'Saving...' : 'Continue'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
