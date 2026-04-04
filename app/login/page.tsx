'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Store user session (in a real app, this would be handled by your auth provider)
      localStorage.setItem('user', JSON.stringify({ email: formData.email }))
      
      router.push('/')
    } catch (error) {
      setErrors({ submit: 'Login failed. Please try again.' })
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
            Welcome Back
          </h1>
          <p className="text-sm text-[#7A6A58]">
            Sign in to book tickets and explore Rajasthan
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-[22px] shadow-[0_4px_20px_rgba(24,18,14,0.10)] p-8 space-y-5">
          {/* Error Alert */}
          {errors.submit && (
            <div className="p-4 bg-[#FEE2E2] border border-[#FECACA] rounded-[12px] text-sm text-[#DC2626]">
              {errors.submit}
            </div>
          )}

          {/* Email Field */}
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

          {/* Password Field */}
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
              placeholder="Enter your password"
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

          {/* Forgot Password */}
          <div className="text-right">
            <Link href="#" className="text-xs font-semibold text-[#E8631A] hover:opacity-70 transition-opacity">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#E8631A] text-white font-bold rounded-full transition-all duration-200 hover:bg-[#C04E0A] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(232,99,26,0.35)] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E8DAC5]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-[#7A6A58]">or</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-2.5">
            <button
              type="button"
              className="w-full py-2.5 border border-[#E8DAC5] text-[#2C2017] font-semibold rounded-full transition-colors hover:bg-[#F5E8CC]"
            >
              📧 Continue with Google
            </button>
            <button
              type="button"
              className="w-full py-2.5 border border-[#E8DAC5] text-[#2C2017] font-semibold rounded-full transition-colors hover:bg-[#F5E8CC]"
            >
              📱 Continue with Phone
            </button>
          </div>
        </form>

        {/* Signup Link */}
        <p className="text-center text-sm text-[#7A6A58] mt-6">
          Don't have an account?{' '}
          <Link href="/signup" className="font-semibold text-[#E8631A] hover:opacity-70 transition-opacity">
            Sign up here
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
