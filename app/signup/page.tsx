'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
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
  const router = useRouter()

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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Store user session
      localStorage.setItem(
        'user',
        JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        })
      )

      router.push('/')
    } catch (error) {
      setErrors({ submit: 'Signup failed. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-[#FDF8F1]">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-block w-14 h-14 rounded-[10px] bg-gradient-to-br from-[#E8631A] to-[#D4A017] flex items-center justify-center text-3xl mb-4 shadow-[0_4px_12px_rgba(232,99,26,0.3)]">
            🏯
          </div>
          <h1 className="font-['Playfair Display',serif] text-3xl md:text-4xl font-bold text-[#2C2017] mb-2">
            Create Account
          </h1>
          <p className="text-sm text-[#7A6A58]">
            Join to book tickets and explore Rajasthan
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-[22px] shadow-[0_4px_20px_rgba(24,18,14,0.10)] p-8 space-y-4">
          {/* Error Alert */}
          {errors.submit && (
            <div className="p-4 bg-[#FEE2E2] border border-[#FECACA] rounded-[12px] text-sm text-[#DC2626]">
              {errors.submit}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-xs font-bold text-[#2C2017] mb-1.5 uppercase tracking-[0.3px]">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full px-3.5 py-2.5 border rounded-[10px] font-inherit text-sm focus:outline-none transition-colors ${
                errors.fullName
                  ? 'border-[#DC2626] bg-[#FEF2F2] focus:border-[#DC2626]'
                  : 'border-[#E8DAC5] focus:border-[#E8631A]'
              }`}
            />
            {errors.fullName && (
              <p className="text-xs text-[#DC2626] mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-[#2C2017] mb-1.5 uppercase tracking-[0.3px]">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full px-3.5 py-2.5 border rounded-[10px] font-inherit text-sm focus:outline-none transition-colors ${
                errors.email
                  ? 'border-[#DC2626] bg-[#FEF2F2] focus:border-[#DC2626]'
                  : 'border-[#E8DAC5] focus:border-[#E8631A]'
              }`}
            />
            {errors.email && (
              <p className="text-xs text-[#DC2626] mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-xs font-bold text-[#2C2017] mb-1.5 uppercase tracking-[0.3px]">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              className={`w-full px-3.5 py-2.5 border rounded-[10px] font-inherit text-sm focus:outline-none transition-colors ${
                errors.phone
                  ? 'border-[#DC2626] bg-[#FEF2F2] focus:border-[#DC2626]'
                  : 'border-[#E8DAC5] focus:border-[#E8631A]'
              }`}
            />
            {errors.phone && (
              <p className="text-xs text-[#DC2626] mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-xs font-bold text-[#2C2017] mb-1.5 uppercase tracking-[0.3px]">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 8 characters"
              className={`w-full px-3.5 py-2.5 border rounded-[10px] font-inherit text-sm focus:outline-none transition-colors ${
                errors.password
                  ? 'border-[#DC2626] bg-[#FEF2F2] focus:border-[#DC2626]'
                  : 'border-[#E8DAC5] focus:border-[#E8631A]'
              }`}
            />
            {errors.password && (
              <p className="text-xs text-[#DC2626] mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-bold text-[#2C2017] mb-1.5 uppercase tracking-[0.3px]">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              className={`w-full px-3.5 py-2.5 border rounded-[10px] font-inherit text-sm focus:outline-none transition-colors ${
                errors.confirmPassword
                  ? 'border-[#DC2626] bg-[#FEF2F2] focus:border-[#DC2626]'
                  : 'border-[#E8DAC5] focus:border-[#E8631A]'
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-[#DC2626] mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="w-4 h-4 mt-1 rounded cursor-pointer accent-[#E8631A]"
            />
            <label htmlFor="agreeTerms" className="text-xs text-[#7A6A58] cursor-pointer">
              I agree to the{' '}
              <Link href="#" className="text-[#E8631A] font-semibold hover:opacity-70">
                Terms & Conditions
              </Link>{' '}
              and{' '}
              <Link href="#" className="text-[#E8631A] font-semibold hover:opacity-70">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.agreeTerms && (
            <p className="text-xs text-[#DC2626]">{errors.agreeTerms}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-5 bg-[#E8631A] text-white font-bold rounded-full transition-all duration-200 hover:bg-[#C04E0A] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(232,99,26,0.35)] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-[#7A6A58] mt-6">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-[#E8631A] hover:opacity-70 transition-opacity">
            Sign in here
          </Link>
        </p>

        {/* Back to Home */}
        <Link
          href="/"
          className="block text-center text-xs text-[#7A6A58] mt-4 hover:text-[#E8631A] transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
