'use client'

import { useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { useAuth } from '@/app/contexts/AuthContext'

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('')
  const { user, openLoginModal, logout } = useAuth()

  const navLinks = [
    { label: 'Explore', href: '#destinations' },
    { label: 'Packages', href: '#packages' },
    { label: 'Monuments', href: '#monuments' },
    { label: 'Wildlife', href: '#wildlife' },
    { label: 'RTDC Hotels', href: '#rtdc' },
    { label: 'JKK', href: '#venues' },
    { label: 'Parks', href: '#parks' },
    { label: 'App', href: '#app' },
    { label: 'Reviews', href: '#feedback' },
  ]

  const handleNavClick = (href: string) => {
    setActiveLink(href)
    setIsDrawerOpen(false)
  }

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-300 h-16 md:h-[66px] flex items-center justify-between px-6 md:px-8 bg-[rgba(253,248,241,0.96)] backdrop-blur-[24px] border-b border-[rgba(212,160,23,0.14)] shadow-[0_1px_6px_rgba(24,18,14,0.06)]">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 no-underline"
        >
          <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#E8631A] to-[#D4A017] flex items-center justify-center text-lg shadow-[0_4px_12px_rgba(232,99,26,0.3)] flex-shrink-0">
            🏯
          </div>
          <div>
            <strong className="font-['Playfair Display',serif] text-xs font-bold text-[#2C2017] block">
              Rajasthan Tourism
            </strong>
            <small className="text-[9px] font-semibold tracking-[0.8px] uppercase text-[#E8631A]">
              Online Booking Management System
            </small>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => handleNavClick(link.href)}
              className={clsx(
                'text-sm font-medium transition-colors duration-200',
                activeLink === link.href ? 'text-[#E8631A]' : 'text-[#7A6A58] hover:text-[#E8631A]'
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {user ? (
            <>
              <span className="hidden md:inline text-sm text-[#7A6A58] font-medium">
                {user.fullName || user.email}
              </span>
              <button
                onClick={logout}
                className="hidden md:block px-5 py-2 bg-[#7A6A58] text-white text-sm font-semibold rounded-full transition-all duration-200 hover:bg-[#5A4A38] hover:translate-y-[-1px]"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={openLoginModal}
              className="hidden md:block px-5 py-2 bg-[#E8631A] text-white text-sm font-semibold rounded-full transition-all duration-200 hover:bg-[#C04E0A] hover:translate-y-[-1px]"
            >
              Login
            </button>
          )}

          <button className="px-3.5 py-2 bg-[#DC2626] text-white text-xs font-bold rounded-full transition-all duration-200 hover:shadow-lg animate-pulse">
            🆘 SOS
          </button>

          {/* Hamburger Menu */}
          <button
            onClick={toggleDrawer}
            className="lg:hidden flex flex-col gap-1.5 bg-transparent p-1.5 rounded-lg"
            aria-expanded={isDrawerOpen}
            aria-controls="drawer"
            aria-label="Open navigation menu"
          >
            <span
              className={clsx(
                'block w-5.5 h-0.5 bg-[#2C2017] rounded transition-all duration-300',
                isDrawerOpen ? 'rotate-45 translate-y-[13px]' : ''
              )}
            />
            <span
              className={clsx(
                'block w-5.5 h-0.5 bg-[#2C2017] rounded transition-all duration-300',
                isDrawerOpen ? 'opacity-0' : ''
              )}
            />
            <span
              className={clsx(
                'block w-5.5 h-0.5 bg-[#2C2017] rounded transition-all duration-300',
                isDrawerOpen ? '-rotate-45 -translate-y-[13px]' : ''
              )}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        id="drawer"
        className={clsx(
          'lg:hidden fixed top-16 left-0 right-0 bg-white border-b border-[#E8DAC5] px-6 py-4 z-290 flex flex-col gap-0.5 shadow-[0_12px_48px_rgba(24,18,14,0.16)] transition-all duration-300 origin-top',
          isDrawerOpen ? 'opacity-100 visible scale-y-100' : 'opacity-0 invisible scale-y-95'
        )}
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => handleNavClick(link.href)}
            className="px-4 py-3 text-[#2C2017] rounded-[10px] transition-colors duration-150 hover:bg-[#F5E8CC] no-underline block"
          >
            {link.label}
          </a>
        ))}

        {/* Mobile Buttons */}
        <div className="flex gap-2 mt-3 pt-3.5 border-t border-[#E8DAC5]">
          {user ? (
            <>
              <span className="flex-1 px-4 py-2.75 text-white text-sm font-bold bg-[#7A6A58] rounded-full text-center">
                {user.fullName || user.email}
              </span>
              <button
                onClick={() => {
                  logout()
                  setIsDrawerOpen(false)
                }}
                className="flex-1 px-4 py-2.75 bg-[#7A6A58] text-white text-sm font-bold rounded-full transition-all duration-200 hover:bg-[#5A4A38]"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  openLoginModal()
                  setIsDrawerOpen(false)
                }}
                className="flex-1 px-4 py-2.75 bg-[#E8631A] text-white text-sm font-bold rounded-full transition-all duration-200 hover:bg-[#C04E0A]"
              >
                Login
              </button>
              <button className="flex-1 px-4 py-2.75 bg-[#DC2626] text-white text-xs font-bold rounded-full transition-all duration-200">
                🆘 SOS
              </button>
            </>
          )}
        </div>
      </div>

      {/* Spacer for fixed nav */}
      <div className="h-16 md:h-[66px]" />
    </>
  )
}
