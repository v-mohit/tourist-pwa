'use client'

const WildlifeSection = () => {
  const heroData = {
    name: 'Sariska Tiger Reserve',
    location: 'Alwar',
    area: '800 km²',
    tigers: '30+ Tigers',
    season: 'Oct–Jun',
    description: "India's first reserve to successfully relocate tigers. Home to leopards, hyenas and 200+ bird species.",
    image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=1400&auto=format&fit=crop&q=85',
  }

  const wildlifeCards = [
    {
      id: 1,
      name: 'Jhalana Leopard Park',
      location: 'Jaipur',
      details: '30+ Leopards',
      image: 'https://images.unsplash.com/photo-1608023136037-626dad6df359?w=500&auto=format&fit=crop&q=80',
      tag: '🐆 Leopard',
    },
    {
      id: 2,
      name: 'Keoladeo National Park',
      location: 'Bharatpur',
      details: '380+ Bird Species',
      image: 'https://images.unsplash.com/photo-1614267861476-3bde44e0bc6c?w=500&auto=format&fit=crop&q=80',
      tag: '🦅 UNESCO',
    },
    {
      id: 3,
      name: 'Nahargarh Biological Park',
      location: 'Jaipur',
      details: 'Big Cats Zone',
      image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=500&auto=format&fit=crop&q=80',
      tag: '🐘 Bio Park',
    },
    {
      id: 4,
      name: 'Ramgarh Vishdhari Reserve',
      location: 'Bundi',
      details: 'Newest Reserve',
      image: 'https://images.unsplash.com/photo-1612428085659-de9c5c765fe6?w=500&auto=format&fit=crop&q=80',
      tag: '🐅 Tiger Reserve',
    },
  ]

  return (
    <section className="px-6 md:px-8 py-16 md:py-24 bg-[#0B1A12]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-end justify-between gap-4 mb-10 flex-wrap">
          <div>
            <div className="text-[10px] font-bold letter-spacing-[2px] uppercase text-[#22C55E] mb-2">
              ✦ Top Wildlife
            </div>
            <h2 className="font-['Playfair Display',serif] text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Into the Wild
            </h2>
          </div>
          <a
            href="#"
            className="text-sm font-semibold text-[#22C55E] border-b border-current hover:opacity-70 transition-opacity inline-flex items-center gap-1"
          >
            See all →
          </a>
        </div>

        {/* Hero Card */}
        <div className="rounded-[22px] overflow-hidden relative h-[370px] mb-4 cursor-pointer group bg-[#1a2e20] mb-10">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url('${heroData.image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(11,26,18,0.93)] via-[rgba(11,26,18,0.3)] to-transparent" />
          <div className="absolute top-0 bottom-0 left-0 flex flex-col justify-center p-9 md:p-10 max-w-[440px]">
            <span className="inline-flex items-center gap-1 px-2.75 py-1 rounded-lg text-[10px] font-bold text-[#22C55E] bg-[rgba(34,197,94,0.15)] border border-[rgba(34,197,94,0.38)] mb-3 w-fit">
              🐯 Project Tiger Reserve
            </span>
            <h2 className="font-['Playfair Display',serif] text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
              {heroData.name}
            </h2>
            <div className="flex gap-2.5 mb-5 flex-wrap">
              <div className="text-[11px] text-[rgba(255,255,255,0.65)] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)] rounded-lg px-2.5 py-1.25">
                📍 <span className="font-bold">{heroData.location}</span>
              </div>
              <div className="text-[11px] text-[rgba(255,255,255,0.65)] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)] rounded-lg px-2.5 py-1.25">
                🌿 <span className="font-bold">{heroData.area}</span>
              </div>
              <div className="text-[11px] text-[rgba(255,255,255,0.65)] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)] rounded-lg px-2.5 py-1.25">
                🐯 <span className="font-bold">{heroData.tigers}</span>
              </div>
              <div className="text-[11px] text-[rgba(255,255,255,0.65)] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)] rounded-lg px-2.5 py-1.25">
                📅 <span className="font-bold">{heroData.season}</span>
              </div>
            </div>
            <p className="text-sm text-[rgba(255,255,255,0.6)] leading-relaxed mb-5">
              {heroData.description}
            </p>
            <div className="flex gap-2.5 flex-wrap">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8631A] text-white font-semibold rounded-full hover:bg-[#C04E0A] transition-all">
                Book Safari →
              </button>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.85)] font-medium border border-[rgba(255,255,255,0.3)] rounded-full hover:bg-[rgba(255,255,255,0.18)] transition-all">
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* Wildlife Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {wildlifeCards.map((card) => (
            <div
              key={card.id}
              className="rounded-[14px] overflow-hidden relative h-[210px] cursor-pointer group bg-[#1a2e20]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundImage: `url('${card.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(11,26,18,0.9)] via-[rgba(11,26,18,0.08)] to-transparent" />
              <div className="absolute top-2.5 right-2.5">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-bold text-[#22C55E] bg-[rgba(34,197,94,0.15)] border border-[rgba(34,197,94,0.38)]">
                  {card.tag}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3.5">
                <h4 className="font-['Playfair Display',serif] text-sm font-bold text-white mb-1">
                  {card.name}
                </h4>
                <div className="flex gap-1 flex-wrap">
                  <span className="text-[10px] text-[rgba(255,255,255,0.58)]">
                    📍 {card.location} · {card.details}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WildlifeSection
