'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear())

  // useEffect(() => {
  //   setYear(new Date().getFullYear())
  // }, [])

  return (
    <footer className="bg-[#100D09]">
      {/* Main Footer Content */}
      <div className="px-6 md:px-8 py-12 md:py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-9">
        {/* Brand Section */}
        <div className="md:col-span-1">
          <h3 className="font-['Playfair Display',serif] text-lg font-bold text-white mb-2.5">
            Government of Rajasthan
          </h3>
          <p className="text-xs md:text-sm leading-relaxed text-[rgba(255,255,255,0.35)] mb-5">
            OBMS — your single official gateway to Rajasthan&apos;s top tourist destinations, wildlife parks, monuments, parks and cultural venues.
          </p>
          <div className="text-xs text-[rgba(255,255,255,0.48)] mb-2 flex items-center gap-1.75">
            📞 01412923486 · 01412921311
          </div>
          <div className="text-xs text-[rgba(255,255,255,0.48)] mb-4 flex items-center gap-1.75">
            ✉️ helpdesk[dot]tourist[at]rajasthan[dot]gov[dot]in
          </div>
          <div className="mt-4 flex gap-2 flex-wrap">
            <span className="px-3 py-1.25 bg-[rgba(212,160,23,0.15)] border border-[rgba(212,160,23,0.3)] rounded-full text-[10px] text-[#D4A017] font-semibold">
              🏆 SKOCH Award Winner 2024
            </span>
          </div>
        </div>

        {/* Destinations */}
        <div>
          <h5 className="text-[10px] tracking-[1.5px] uppercase font-bold text-[#D4A017] mb-4">
            Destinations
          </h5>
          <nav className="flex flex-col gap-2.25">
            <Link href="/citydetail/jaipur" className="text-xs text-[rgba(255,255,255,0.4)] transition-colors hover:text-[#E8631A]">
              Jaipur
            </Link>
            <Link href="/citydetail/udaipur" className="text-xs text-[rgba(255,255,255,0.4)] transition-colors hover:text-[#E8631A]">
              Udaipur
            </Link>
            <Link href="/citydetail/jodhpur" className="text-xs text-[rgba(255,255,255,0.4)] transition-colors hover:text-[#E8631A]">
              Jodhpur
            </Link>
            <Link href="/citydetail/jaisalmer" className="text-xs text-[rgba(255,255,255,0.4)] transition-colors hover:text-[#E8631A]">
              Jaisalmer
            </Link>
            <Link href="/citydetail/bikaner" className="text-xs text-[rgba(255,255,255,0.4)] transition-colors hover:text-[#E8631A]">
              Bikaner
            </Link>
            <Link href="/citydetail/alwar" className="text-xs text-[rgba(255,255,255,0.4)] transition-colors hover:text-[#E8631A]">
              Alwar
            </Link>
            <Link href="/citydetail/mount-abu" className="text-xs text-[rgba(255,255,255,0.4)] transition-colors hover:text-[#E8631A]">
              Mount Abu
            </Link>
            <Link href="/citydetail/ajmer" className="text-xs text-[rgba(255,255,255,0.4)] transition-colors hover:text-[#E8631A]">
              Ajmer
            </Link>
          </nav>
        </div>

        {/* Explore */}
        <div>
          <h5 className="text-[10px] tracking-[1.5px] uppercase font-bold text-[#D4A017] mb-4">
            Explore
          </h5>
          <nav className="flex flex-col gap-2.25">
            <Link href="#monuments" className="text-xs text-[rgba(255,255,255,0.4)] transition-colors hover:text-[#E8631A]">
              Monuments & Forts
            </Link>
            <Link href="#wildlife" className="text-xs text-[rgba(255,255,255,0.4)] transition-colors hover:text-[#E8631A]">
              Wildlife Safaris
            </Link>
            <Link href="#museums" className="text-xs text-[rgba(255,255,255,0.4)] transition-colors hover:text-[#E8631A]">
              Museums
            </Link>
            <Link href="#packages" className="text-xs text-[rgba(255,255,255,0.4)] transition-colors hover:text-[#E8631A]">
              Tour Packages
            </Link>
            <Link href="#ls" className="text-xs text-[rgba(255,255,255,0.4)] transition-colors hover:text-[#E8631A]">
              Light & Sound
            </Link>
            <Link href="#parks" className="text-xs text-[rgba(255,255,255,0.4)] transition-colors hover:text-[#E8631A]">
              City Parks
            </Link>
            <Link href="#asi" className="text-xs text-[rgba(255,255,255,0.4)] transition-colors hover:text-[#E8631A]">
              ASI Sites
            </Link>
            <Link href="#venues" className="text-xs text-[rgba(255,255,255,0.4)] transition-colors hover:text-[#E8631A]">
              JKK Events
            </Link>
            <Link href="#rtdc" className="text-xs text-[rgba(255,255,255,0.4)] transition-colors hover:text-[#E8631A]">
              RTDC Hotels
            </Link>
          </nav>
        </div>

        {/* Help & Info */}
        <div>
          <h5 className="text-[10px] tracking-[1.5px] uppercase font-bold text-[#D4A017] mb-4">
            Help & Info
          </h5>
          <nav className="flex flex-col gap-2.25">
            <Link href="#" className="text-xs text-[rgba(255,255,255,0.4)] transition-colors hover:text-[#E8631A]">
              HelpDesk
            </Link>
            <Link href="#" className="text-xs text-[rgba(255,255,255,0.4)] transition-colors hover:text-[#E8631A]">
              FAQ
            </Link>
            <Link href="/about" className="text-xs text-[rgba(255,255,255,0.4)] transition-colors hover:text-[#E8631A]">
              About OBMS
            </Link>
            <Link href="#" className="text-xs text-[rgba(255,255,255,0.4)] transition-colors hover:text-[#E8631A]">
              Tourist Statistics
            </Link>
            <Link href="#" className="text-xs text-[rgba(255,255,255,0.4)] transition-colors hover:text-[#E8631A]">
              SKOCH Award
            </Link>
            <Link href="#" className="text-xs text-[rgba(255,255,255,0.4)] transition-colors hover:text-[#E8631A]">
              Download App
            </Link>
            <Link href="#" className="text-xs text-[rgba(255,255,255,0.4)] transition-colors hover:text-[#E8631A]">
              Terms & Conditions
            </Link>
            <Link href="#" className="text-xs font-bold text-[#DC2626] transition-colors hover:text-[#E8631A]">
              🆘 SOS Emergency
            </Link>
          </nav>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-[rgba(255,255,255,0.06)] px-6 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-2.5 flex-wrap">
        <p className="text-[11px] text-[rgba(255,255,255,0.2)]">
          Copyright © <span id="foot-year">{year}</span> RISL, Rajasthan. All rights reserved.
        </p>
        <p className="text-[11px] text-[rgba(255,255,255,0.2)]">
          Powered by Rajasthan Tourism · RISL ·{' '}
          <span className="text-[#D4A017]">🏆 SKOCH 2024</span>
        </p>
      </div>
    </footer>
  )
}
