'use client'

const PackagesSection = () => {
  const packages = [
    {
      id: 1,
      name: 'Jaipur Darshan',
      image: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=600&auto=format&fit=crop&q=80',
      rating: '4.8',
      price: '₹180',
      priceDesc: 'per person',
      info: [
        { emoji: '🏯', text: '10 Monuments' },
        { emoji: '🕐', text: 'Full Day' },
        { emoji: '🚌', text: 'Transport Incl.' },
        { emoji: '🎟', text: 'Entry Tickets' },
      ],
      badge: 'COMPOSITE',
    },
    {
      id: 2,
      name: 'Jodhpur Darshan',
      image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop&q=80',
      rating: '4.7',
      price: '₹150',
      priceDesc: 'per person',
      info: [
        { emoji: '🏯', text: 'Mehrangarh Fort' },
        { emoji: '🕐', text: 'Full Day' },
        { emoji: '🚌', text: 'Transport Incl.' },
        { emoji: '🎟', text: 'Entry Tickets' },
      ],
      badge: 'COMPOSITE',
    },
    {
      id: 3,
      name: 'Jaisalmer Darshan',
      image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&auto=format&fit=crop&q=80',
      rating: '4.9',
      price: '₹120',
      priceDesc: 'per person',
      info: [
        { emoji: '🏰', text: 'Fort & Havelis' },
        { emoji: '🕐', text: 'Full Day' },
        { emoji: '🚌', text: 'Transport Incl.' },
        { emoji: '🎟', text: 'Entry Tickets' },
      ],
      badge: 'COMPOSITE',
    },
    {
      id: 4,
      name: 'Udaipur Darshan',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop&q=80',
      rating: '4.8',
      price: '₹200',
      priceDesc: 'per person',
      info: [
        { emoji: '🌊', text: 'City of Lakes' },
        { emoji: '🕐', text: 'Full Day' },
        { emoji: '⛵', text: 'Boat Ride Incl.' },
        { emoji: '🎟', text: 'Entry Tickets' },
      ],
      badge: 'COMPOSITE',
    },
    {
      id: 5,
      name: 'Bundi Darshan',
      image: 'https://images.unsplash.com/photo-1589456506629-b2ea1a8576c7?w=600&auto=format&fit=crop&q=80',
      rating: '4.6',
      price: '₹50',
      priceDesc: 'per person',
      info: [
        { emoji: '🏛', text: '4 Heritage Sites' },
        { emoji: '🕐', text: 'Half Day' },
        { emoji: '🚶', text: 'Walking Tour' },
        { emoji: '🎟', text: 'Entry Tickets' },
      ],
      badge: 'COMPOSITE',
    },
    {
      id: 6,
      name: 'Bharatpur Darshan',
      image: 'https://images.unsplash.com/photo-1614267861476-3bde44e0bc6c?w=600&auto=format&fit=crop&q=80',
      rating: '4.7',
      price: '₹30',
      priceDesc: 'per person',
      info: [
        { emoji: '🦅', text: 'Keoladeo Park' },
        { emoji: '🕐', text: 'Half Day' },
        { emoji: '🚲', text: 'Cycle Rickshaw' },
        { emoji: '🎟', text: 'Entry Tickets' },
      ],
      badge: 'UNESCO SITE',
    },
  ]

  return (
    <section className="px-6 md:px-8 py-16 md:py-24 bg-[#18120E]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-end justify-between gap-4 mb-12 flex-wrap">
          <div>
            <div className="text-[10px] font-bold letter-spacing-[2px] uppercase text-[#D4A017] mb-2">
              ✦ Popular Packages
            </div>
            <h2 className="font-['Playfair Display',serif] text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Curated Darshan<br />Experiences
            </h2>
          </div>
          <a
            href="#"
            className="text-sm font-semibold text-[#D4A017] border-b border-current hover:opacity-70 transition-opacity inline-flex items-center gap-1"
          >
            See all →
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="rounded-[22px] overflow-hidden bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.09)] hover:border-[rgba(212,160,23,0.4)] hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-[195px] overflow-hidden bg-[#2a1e14]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-110"
                  style={{ backgroundImage: `url('${pkg.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(24,18,14,0.65)] via-transparent to-transparent" />

                {/* Rating */}
                <div className="absolute top-3 right-3 bg-[rgba(24,18,14,0.7)] backdrop-blur rounded-full px-2.5 py-1 text-white text-[11px] font-bold">
                  ⭐ {pkg.rating}
                </div>

                {/* Price Badge */}
                <div className="absolute bottom-3 left-3 bg-[rgba(24,18,14,0.82)] backdrop-blur border border-[rgba(212,160,23,0.3)] rounded-[10px] px-3.25 py-1.75">
                  <div className="font-['Playfair Display',serif] text-xl font-bold text-[#D4A017] leading-none">
                    {pkg.price}
                  </div>
                  <div className="text-[9px] text-[rgba(255,255,255,0.5)] mt-0.25">
                    {pkg.priceDesc}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-['Playfair Display',serif] text-base text-white mb-2.5">
                  {pkg.name}
                </h3>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-1.5 mb-3.5">
                  {pkg.info.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 text-[11px] text-[rgba(255,255,255,0.5)] bg-[rgba(255,255,255,0.05)] rounded-lg px-2 py-1.5"
                    >
                      {item.emoji} <span className="font-medium text-[rgba(255,255,255,0.75)]">{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold text-[#D4A017] bg-[rgba(212,160,23,0.18)] border border-[rgba(212,160,23,0.38)]">
                    {pkg.badge}
                  </span>
                  <button className="inline-flex items-center gap-1 px-4 py-2 bg-[#E8631A] text-white rounded-full text-[11px] font-bold hover:bg-[#C04E0A] transition-all">
                    Book →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PackagesSection
