'use client'

const MuseumsSection = () => {
  const museums = [
    {
      id: 1,
      name: 'Govt. Central Museum (Albert Hall)',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop&q=80',
      year: 'Est. 1876',
      tag: '🏆 Heritage',
      description: 'Rajasthani art, textiles, jewellery and a rare Egyptian mummy.',
      tags: ['🎨 Art', '🏺 Archaeology', '📜 Manuscripts'],
      hours: '⏰ 9AM–5PM',
      fee: '₹40/adult',
    },
    {
      id: 2,
      name: 'Government Museum, Udaipur',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop&q=80',
      year: 'Est. 1890',
      tag: '🌊 Lakeside',
      description: 'Sculptures, miniature paintings and artifacts from the Mewar region.',
      tags: ['🖼 Paintings', '🗿 Sculptures', '👑 Royal Artifacts'],
      hours: '⏰ 9:30AM–5:30PM',
      fee: '₹100/adult',
    },
    {
      id: 3,
      name: 'Ganga Govt. Museum, Bikaner',
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&auto=format&fit=crop&q=80',
      year: 'Est. 1937',
      tag: '🏛 State Museum',
      description: 'Terracotta art, stone sculptures, Rajput & Mughal weaponry and rare coins.',
      tags: ['⚔ Weaponry', '🏺 Terracotta', '🪙 Coins'],
      hours: '⏰ 10AM–5PM',
      fee: '₹20/adult',
    },
  ]

  return (
    <section className="px-6 md:px-8 py-16 md:py-24 bg-[#FDF8F1]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-end justify-between gap-4 mb-12 flex-wrap">
          <div>
            <div className="text-[10px] font-bold letter-spacing-[2px] uppercase text-[#E8631A] mb-2">
              ✦ Top Museums
            </div>
            <h2 className="font-['Playfair Display',serif] text-3xl md:text-4xl lg:text-5xl font-bold text-[#2C2017] leading-tight">
              Preserving History
            </h2>
          </div>
          <a
            href="#"
            className="text-sm font-semibold text-[#E8631A] border-b border-current hover:opacity-70 transition-opacity inline-flex items-center gap-1"
          >
            See all →
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {museums.map((museum) => (
            <div
              key={museum.id}
              className="bg-white rounded-[22px] overflow-hidden shadow-[0_1px_6px_rgba(24,18,14,0.06)] hover:shadow-[0_4px_20px_rgba(24,18,14,0.10)] hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-[195px] overflow-hidden bg-[#F5E8CC]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 hover:scale-107"
                  style={{ backgroundImage: `url('${museum.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(24,18,14,0.55)] via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-3.5 py-3 flex justify-between items-end">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold text-[#D4A017] bg-[rgba(212,160,23,0.18)] border border-[rgba(212,160,23,0.38)]">
                    {museum.tag}
                  </span>
                  <span className="text-[11px] text-[rgba(255,255,255,0.7)]">{museum.year}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4.5">
                <h4 className="font-['Playfair Display',serif] text-base font-bold text-[#2C2017] mb-1.5">
                  {museum.name}
                </h4>
                <p className="text-sm text-[#7A6A58] leading-relaxed mb-3">
                  {museum.description}
                </p>

                {/* Tags */}
                <div className="flex gap-1.5 flex-wrap mb-3.25">
                  {museum.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2.5 py-1 rounded-full bg-[#F5E8CC] text-[#7A6A58] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-[#E8DAC5]">
                  <span className="text-[11px] text-[#7A6A58]">{museum.hours}</span>
                  <span className="text-[11px] font-bold text-[#E8631A]">{museum.fee}</span>
                </div>

                {/* Book Button */}
                <button className="w-full mt-3 px-4 py-2 bg-[#E8631A] text-white rounded-full text-[11px] font-bold hover:bg-[#C04E0A] transition-all inline-flex items-center justify-center gap-1">
                  Book Tickets →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MuseumsSection
