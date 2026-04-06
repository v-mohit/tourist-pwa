'use client'

const TopMonuments = () => {
  const monuments = [
    {
      id: 1,
      name: 'Amber Fort',
      location: 'Jaipur',
      image: 'https://images.unsplash.com/photo-1477587458883-47145ed31f5e?w=500&auto=format&fit=crop&q=80',
      tag: '🏆 UNESCO',
      chips: ['🏯 Fort', '16th Century'],
      hours: '⏰ 8AM–5:30PM',
      fee: '₹200',
    },
    {
      id: 2,
      name: 'Hawa Mahal',
      location: 'Jaipur',
      image: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=500&auto=format&fit=crop&q=80',
      tag: '🌸 Iconic',
      chips: ['953 Windows', 'Pink City'],
      hours: '⏰ 9AM–5PM',
      fee: '₹50',
    },
    {
      id: 3,
      name: 'Mehrangarh Fort',
      location: 'Jodhpur',
      image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&auto=format&fit=crop&q=80',
      tag: '🔵 Blue City',
      chips: ['15th Century', 'Museum'],
      hours: '⏰ 9AM–5PM',
      fee: '₹100',
    },
    {
      id: 4,
      name: 'Jaisalmer Fort',
      location: 'Jaisalmer',
      image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=500&auto=format&fit=crop&q=80',
      tag: '🏜 Desert Fort',
      chips: ['Living Fort', '12th Century'],
      hours: '⏰ 9AM–6PM',
      fee: '₹70',
    },
    {
      id: 5,
      name: 'City Palace, Udaipur',
      location: 'Udaipur',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&auto=format&fit=crop&q=80',
      tag: '🌊 Lakeside',
      chips: ['Palace', 'Museum'],
      hours: '⏰ 9:30AM–5:30PM',
      fee: '₹300',
    },
    {
      id: 6,
      name: 'Jantar Mantar',
      location: 'Jaipur',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&auto=format&fit=crop&q=80',
      tag: '🏆 UNESCO',
      chips: ['🔭 Observatory', '18th Century'],
      hours: '⏰ 9AM–4:30PM',
      fee: '₹40',
    },
    {
      id: 7,
      name: 'Nahargarh Fort',
      location: 'Jaipur',
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=500&auto=format&fit=crop&q=80',
      tag: '🌅 Sunset Point',
      chips: ['City View', 'Wax Museum'],
      hours: '⏰ 10AM–5:30PM',
      fee: '₹50',
    },
    {
      id: 8,
      name: 'Taragarh Fort, Bundi',
      location: 'Bundi',
      image: 'https://images.unsplash.com/photo-1589456506629-b2ea1a8576c7?w=500&auto=format&fit=crop&q=80',
      tag: '💎 Hidden Gem',
      chips: ['14th Century', 'Step Wells'],
      hours: '⏰ 8AM–5PM',
      fee: '₹30',
    },
  ]

  return (
    <section className="px-6 md:px-8 py-16 md:py-24 bg-[#FDF8F1]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-end justify-between gap-4 mb-12 flex-wrap">
          <div>
            <div className="text-[10px] font-bold letter-spacing-[2px] uppercase text-[#E8631A] mb-2">
              ✦ Top Monuments
            </div>
            <h2 className="font-['Playfair Display',serif] text-3xl md:text-4xl lg:text-5xl font-bold text-[#2C2017] leading-tight">
              Royal Heritage & Architecture
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {monuments.map((monument) => (
            <div
              key={monument.id}
              className="bg-white rounded-[14px] overflow-hidden shadow-[0_1px_6px_rgba(24,18,14,0.06)] hover:shadow-[0_12px_48px_rgba(24,18,14,0.16)] hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-[155px] overflow-hidden bg-[#F5E8CC]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 hover:scale-110 group-hover:scale-110"
                  style={{ backgroundImage: `url('${monument.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(24,18,14,0.5)] via-transparent to-transparent" />
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[8px] font-bold uppercase bg-[rgba(212,160,23,0.18)] text-[#D4A017] border border-[rgba(212,160,23,0.38)]">
                    {monument.tag}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-3.5">
                <div className="font-['Playfair Display',serif] text-sm font-bold text-[#2C2017] mb-1">
                  {monument.name}
                </div>
                <div className="text-[11px] text-[#7A6A58] mb-2">
                  📍 {monument.location}
                </div>
                <div className="flex gap-1.5 flex-wrap mb-2.25">
                  {monument.chips.map((chip, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-semibold px-2 py-0.75 rounded-full bg-[#F5E8CC] text-[#7A6A58]"
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-[#E8DAC5]">
                  <span className="text-[10px] text-[#7A6A58]">{monument.hours}</span>
                  <span className="text-[10px] font-bold text-[#E8631A]">{monument.fee}</span>
                </div>

                {/* Book Button */}
                <button className="w-full mt-2.5 px-4 py-2 bg-[#E8631A] text-white rounded-full text-[11px] font-bold hover:bg-[#C04E0A] transition-all inline-flex items-center justify-center gap-1">
                  Book Entry →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TopMonuments
