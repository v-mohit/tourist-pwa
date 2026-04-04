'use client'

import { useState } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import clsx from 'clsx'

export default function SignupModal() {
  const { signup, closeModal, switchToLogin, activeModal } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isOpen = activeModal === 'signup'

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        'Password must contain uppercase, lowercase, and numbers'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await signup(
        formData.fullName,
        formData.email,
        formData.phone,
        formData.password
      )
    } catch (error) {
      setErrors({ submit: 'Signup failed. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          'fixed inset-0 bg-[rgba(24,18,14,0.72)] backdrop-blur-[6px] z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeModal}
        aria-hidden={!isOpen}
      />

      {/* Modal */}
      <div
        className={clsx(
          'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm mx-4 max-h-[90vh] overflow-y-auto transition-all duration-300',
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-title"
        aria-hidden={!isOpen}
      >
        <div className="bg-white rounded-[22px] shadow-[0_12px_48px_rgba(24,18,14,0.16)] p-8 relative">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 w-8 h-8 bg-[#F5E8CC] rounded-full flex items-center justify-center text-[#7A6A58] hover:bg-[#E8DAC5] transition-colors"
            aria-label="Close signup modal"
          >
            ✕
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 id="signup-title" className="font-['Playfair Display',serif] text-2xl font-bold text-[#2C2017] mb-2">
              Create Account
            </h2>
            <p className="text-xs text-[#7A6A58]">
              Join to book tickets and explore Rajasthan
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Error Alert */}
            {errors.submit && (
              <div className="p-3 bg-[#FEE2E2] border border-[#FECACA] rounded-[12px] text-xs text-[#DC2626]">
                {errors.submit}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label htmlFor="signup-fullName" className="block text-[10px] font-bold text-[#2C2017] mb-1.5 uppercase tracking-[0.3px]">
                Full Name
              </label>
              <input
                type="text"
                id="signup-fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className={clsx(
                  'w-full px-3.5 py-2.5 border rounded-[10px] text-sm focus:outline-none transition-colors',
                  errors.fullName
                    ? 'border-[#DC2626] bg-[#FEF2F2] focus:border-[#DC2626]'
                    : 'border-[#E8DAC5] focus:border-[#E8631A]'
                )}
              />
              {errors.fullName && (
                <p className="text-xs text-[#DC2626] mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="signup-email" className="block text-[10px] font-bold text-[#2C2017] mb-1.5 uppercase tracking-[0.3px]">
                Email Address
              </label>
              <input
                type="email"
                id="signup-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={clsx(
                  'w-full px-3.5 py-2.5 border rounded-[10px] text-sm focus:outline-none transition-colors',
                  errors.email
                    ? 'border-[#DC2626] bg-[#FEF2F2] focus:border-[#DC2626]'
                    : 'border-[#E8DAC5] focus:border-[#E8631A]'
                )}
              />
              {errors.email && (
                <p className="text-xs text-[#DC2626] mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="signup-phone" className="block text-[10px] font-bold text-[#2C2017] mb-1.5 uppercase tracking-[0.3px]">
                Phone Number
              </label>
              <input
                type="tel"
                id="signup-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                className={clsx(
                  'w-full px-3.5 py-2.5 border rounded-[10px] text-sm focus:outline-none transition-colors',
                  errors.phone
                    ? 'border-[#DC2626] bg-[#FEF2F2] focus:border-[#DC2626]'
                    : 'border-[#E8DAC5] focus:border-[#E8631A]'
                )}
              />
              {errors.phone && (
                <p className="text-xs text-[#DC2626] mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="signup-password" className="block text-[10px] font-bold text-[#2C2017] mb-1.5 uppercase tracking-[0.3px]">
                Password
              </label>
              <input
                type="password"
                id="signup-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 8 characters"
                className={clsx(
                  'w-full px-3.5 py-2.5 border rounded-[10px] text-sm focus:outline-none transition-colors',
                  errors.password
                    ? 'border-[#DC2626] bg-[#FEF2F2] focus:border-[#DC2626]'
                    : 'border-[#E8DAC5] focus:border-[#E8631A]'
                )}
              />
              {errors.password && (
                <p className="text-xs text-[#DC2626] mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="signup-confirmPassword" className="block text-[10px] font-bold text-[#2C2017] mb-1.5 uppercase tracking-[0.3px]">
                Confirm Password
              </label>
              <input
                type="password"
                id="signup-confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className={clsx(
                  'w-full px-3.5 py-2.5 border rounded-[10px] text-sm focus:outline-none transition-colors',
                  errors.confirmPassword
                    ? 'border-[#DC2626] bg-[#FEF2F2] focus:border-[#DC2626]'
                    : 'border-[#E8DAC5] focus:border-[#E8631A]'
                )}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-[#DC2626] mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-3 py-2">
              <input
                type="checkbox"
                id="signup-agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="w-4 h-4 mt-0.5 rounded cursor-pointer accent-[#E8631A]"
              />
              <label htmlFor="signup-agreeTerms" className="text-xs text-[#7A6A58] cursor-pointer leading-snug">
                I agree to the{' '}
                <button
                  type="button"
                  className="text-[#E8631A] font-semibold hover:opacity-70"
                >
                  Terms & Conditions
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  className="text-[#E8631A] font-semibold hover:opacity-70"
                >
                  Privacy Policy
                </button>
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="text-xs text-[#DC2626]">{errors.agreeTerms}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 mt-2 bg-[#E8631A] text-white font-bold rounded-full transition-all duration-200 hover:bg-[#C04E0A] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(232,99,26,0.35)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-xs text-[#7A6A58] mt-4">
            Already have an account?{' '}
            <button
              onClick={switchToLogin}
              className="font-semibold text-[#E8631A] hover:opacity-70 transition-opacity bg-none border-none p-0 cursor-pointer"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </>
  )
}
