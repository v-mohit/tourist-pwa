'use client'

import Link from 'next/link'

const Home = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-[66px]">
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
        <div className="relative z-10 flex flex-col items-center px-6 md:px-8 w-full max-w-3xl text-center">
          {/* Badges */}
          <div className="flex items-center justify-center gap-3 md:gap-4 mb-5 md:mb-8 flex-wrap">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[rgba(212,160,23,0.18)] text-[#D4A017] rounded-full text-[10px] font-bold uppercase letter-spacing-[0.8px] border border-[rgba(212,160,23,0.38)]">
              ⭐ Incredible State of India
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[rgba(255,255,255,0.2)] text-white rounded-full text-[10px] font-bold uppercase border border-[rgba(255,255,255,0.3)]">
              🏆 SKOCH Award Winner
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[rgba(255,255,255,0.2)] text-white rounded-full text-[10px] font-bold uppercase border border-[rgba(255,255,255,0.3)]">
              Official Govt. Portal
            </span>
          </div>

          {/* Title */}
          <h1 className="font-['Playfair Display',serif] text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-5 leading-tight">
            Explore <em className="italic text-[#F0C842] font-italic">Rajasthan</em>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-[rgba(255,255,255,0.75)] mb-8 md:mb-10 max-w-[540px] leading-relaxed">
            From the rose-pink arches of Hawa Mahal to golden desert sands — discover the Land of Kings through Rajasthan's official tourism & booking portal.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8">
            <Link
              href="#destinations"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 md:py-4 bg-[#E8631A] text-white font-semibold rounded-full transition-all duration-200 hover:bg-[#C04E0A] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(232,99,26,0.35)]"
            >
              Explore Destinations →
            </Link>
            <Link
              href="#packages"
              className="inline-flex items-center justify-center gap-2 px-6 md:px-7 py-3 md:py-4 bg-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.85)] font-medium rounded-full border border-[rgba(255,255,255,0.3)] transition-all duration-200 hover:bg-[rgba(255,255,255,0.18)]"
            >
              View Packages
            </Link>
          </div>

          {/* Quick Links */}
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

      {/* Stats Bar */}
      <section className="bg-gradient-to-r from-[#E8631A] to-[#C04E0A] px-6 md:px-8 py-6 md:py-5 flex items-stretch overflow-x-auto scrollbar-hide gap-0">
        {[
          { icon: '🌆', num: '34+', label: 'Cities' },
          { icon: '🏯', num: '60+', label: 'Monuments' },
          { icon: '🐯', num: '20+', label: 'Wildlife Parks' },
          { icon: '🎫', num: '10', label: 'Darshan Packages' },
          { icon: '🏛', num: '30+', label: 'Museums' },
          { icon: '🌿', num: '5+', label: 'City Parks' },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 py-4.5 px-5 md:px-6 flex-shrink-0 border-r border-[rgba(255,255,255,0.18)] last:border-r-0"
          >
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <div className="font-['Playfair Display',serif] text-xl md:text-2xl font-bold text-white leading-tight">
                {stat.num}
              </div>
              <div className="text-[10px] text-[rgba(255,255,255,0.7)] letter-spacing-[0.5px]">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Welcome Message */}
      <section className="px-6 md:px-8 py-16 md:py-24 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-['Playfair Display',serif] text-3xl md:text-4xl lg:text-5xl font-bold text-[#2C2017] mb-4">
            Welcome to Rajasthan Tourism OBMS
          </h2>
          <p className="text-base md:text-lg text-[#7A6A58] max-w-2xl mx-auto leading-relaxed">
            Your official gateway to book tickets for forts, wildlife safaris, museums, light & sound shows, and more. Enjoy seamless online booking with instant confirmations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: '🎟',
              title: 'Instant Booking',
              desc: 'Book entry tickets for all attractions without waiting in queues.',
            },
            {
              icon: '🗺',
              title: 'Explore Everything',
              desc: 'Discover monuments, wildlife parks, museums, and cultural venues.',
            },
            {
              icon: '🆘',
              title: '24/7 Support',
              desc: 'Emergency assistance available anytime, anywhere in Rajasthan.',
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-8 bg-white rounded-[22px] shadow-[0_4px_20px_rgba(24,18,14,0.10)] hover:shadow-[0_12px_48px_rgba(24,18,14,0.16)] transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-['Playfair Display',serif] text-xl font-bold text-[#2C2017] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[#7A6A58] leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
