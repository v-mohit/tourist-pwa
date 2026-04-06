'use client'

import { useState } from 'react'
import { useAuth } from '@/features/auth/context/AuthContext'
import clsx from 'clsx'

export default function LoginModal() {
  const { login, closeModal, switchToSignup, activeModal } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isOpen = activeModal === 'login'

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await login(formData.email, formData.password)
    } catch (error) {
      setErrors({ submit: 'Login failed. Please try again.' })
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
          'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm mx-4 transition-all duration-300',
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        aria-hidden={!isOpen}
      >
        <div className="bg-white rounded-[22px] shadow-[0_12px_48px_rgba(24,18,14,0.16)] p-8 relative">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 w-8 h-8 bg-[#F5E8CC] rounded-full flex items-center justify-center text-[#7A6A58] hover:bg-[#E8DAC5] transition-colors"
            aria-label="Close login modal"
          >
            ✕
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 id="login-title" className="font-['Playfair Display',serif] text-2xl font-bold text-[#2C2017] mb-2">
              Welcome Back
            </h2>
            <p className="text-xs text-[#7A6A58]">
              Sign in to book tickets and explore Rajasthan
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Alert */}
            {errors.submit && (
              <div className="p-3 bg-[#FEE2E2] border border-[#FECACA] rounded-[12px] text-xs text-[#DC2626]">
                {errors.submit}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="login-email" className="block text-[10px] font-bold text-[#2C2017] mb-1.5 uppercase tracking-[0.3px]">
                Email Address
              </label>
              <input
                type="email"
                id="login-email"
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

            {/* Password Field */}
            <div>
              <label htmlFor="login-password" className="block text-[10px] font-bold text-[#2C2017] mb-1.5 uppercase tracking-[0.3px]">
                Password
              </label>
              <input
                type="password"
                id="login-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 mt-2 bg-[#E8631A] text-white font-bold rounded-full transition-all duration-200 hover:bg-[#C04E0A] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(232,99,26,0.35)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative py-3 my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E8DAC5]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-[#7A6A58]">or</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-2 mb-4">
            <button
              type="button"
              className="w-full py-2 border border-[#E8DAC5] text-[#2C2017] font-semibold text-sm rounded-full transition-colors hover:bg-[#F5E8CC]"
            >
              📧 Continue with Google
            </button>
            <button
              type="button"
              className="w-full py-2 border border-[#E8DAC5] text-[#2C2017] font-semibold text-sm rounded-full transition-colors hover:bg-[#F5E8CC]"
            >
              📱 Continue with Phone
            </button>
          </div>

          {/* Signup Link */}
          <p className="text-center text-xs text-[#7A6A58]">
            Don't have an account?{' '}
            <button
              onClick={switchToSignup}
              className="font-semibold text-[#E8631A] hover:opacity-70 transition-opacity bg-none border-none p-0 cursor-pointer"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </>
  )
}
