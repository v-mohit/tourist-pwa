'use client'

import SearchBar from '../SearchBar'

const HeroSection = () => {
  return (
    <>
      {/* ════ HERO ════ */}
      <section className="relative h-[100svh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden text-center pt-16 md:pt-[66px]">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1477587458883-47145ed31f5e?w=1920&auto=format&fit=crop&q=85)',
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(24,18,14,0.45)] via-[rgba(24,18,14,0.68)] to-[rgba(24,18,14,0.9)]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center px-6 md:px-8 w-full max-w-3xl">
          {/* Badges */}
          <div className="flex items-center justify-center gap-3 md:gap-4 mb-5 md:mb-8 flex-wrap">
            <span className="tag tg">⭐ Incredible State of India</span>
            <span className="tag tw">🏆 SKOCH Award Winner</span>
            <span className="tag tw">Official Govt. Portal</span>
          </div>

          {/* Title */}
          <h1 className="font-['Playfair Display',serif] text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-5 leading-tight">
            Explore <em className="italic text-[#F0C842] font-italic">Rajasthan</em>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-[rgba(255,255,255,0.75)] mb-8 md:mb-10 max-w-[540px] leading-relaxed">
            From the rose-pink arches of Hawa Mahal to golden desert sands — discover the Land of Kings through Rajasthan's official tourism & booking portal.
          </p>

          {/* Search Bar */}
          <div className="w-full mb-8 md:mb-10 flex justify-center max-w-2xl">
            <SearchBar />
          </div>

          {/* Hero Pills */}
          <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
            <button className="px-3.5 py-1.5 rounded-full text-[11px] font-medium bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.22)] text-[rgba(255,255,255,0.78)] hover:bg-[rgba(255,255,255,0.22)] hover:text-white transition-all">
              🏯 Amber Fort
            </button>
            <button className="px-3.5 py-1.5 rounded-full text-[11px] font-medium bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.22)] text-[rgba(255,255,255,0.78)] hover:bg-[rgba(255,255,255,0.22)] hover:text-white transition-all">
              🐯 Tiger Safari
            </button>
            <button className="px-3.5 py-1.5 rounded-full text-[11px] font-medium bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.22)] text-[rgba(255,255,255,0.78)] hover:bg-[rgba(255,255,255,0.22)] hover:text-white transition-all">
              🏜 Desert Camp
            </button>
            <button className="px-3.5 py-1.5 rounded-full text-[11px] font-medium bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.22)] text-[rgba(255,255,255,0.78)] hover:bg-[rgba(255,255,255,0.22)] hover:text-white transition-all">
              🌊 Lake Palace
            </button>
            <button className="px-3.5 py-1.5 rounded-full text-[11px] font-medium bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.22)] text-[rgba(255,255,255,0.78)] hover:bg-[rgba(255,255,255,0.22)] hover:text-white transition-all">
              🌿 City Parks
            </button>
            <button className="px-3.5 py-1.5 rounded-full text-[11px] font-medium bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.22)] text-[rgba(255,255,255,0.78)] hover:bg-[rgba(255,255,255,0.22)] hover:text-white transition-all">
              ✨ Light & Sound
            </button>
          </div>
        </div>

        {/* Scroll Hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5">
          <span className="text-[9px] tracking-[2px] uppercase text-[rgba(255,255,255,0.38)]">
            Scroll
          </span>
          <div className="w-6.5 h-[42px] border border-[rgba(255,255,255,0.28)] rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-white rounded animate-[sdot_1.8s_infinite]" />
          </div>
        </div>
      </section>
    </>
  )
}

export default HeroSection
