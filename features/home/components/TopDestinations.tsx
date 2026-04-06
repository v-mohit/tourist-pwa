'use client'

const TopDestinations = () => {
  const destinations = [
    {
      id: 1,
      name: 'Jaipur',
      image: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=900&auto=format&fit=crop&q=85',
      tag: '⭐ Most Popular',
      tagBg: 'bg-[rgba(212,160,23,0.18)] border border-[rgba(212,160,23,0.38)]',
      tagColor: 'text-[#D4A017]',
      meta: ['📍 The Pink City', '🏯 12 Monuments'],
    },
    {
      id: 2,
      name: 'Udaipur',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=700&auto=format&fit=crop&q=85',
      tag: '🌊 Lakes',
      tagBg: 'bg-[rgba(255,255,255,0.2)] border border-[rgba(255,255,255,0.3)]',
      tagColor: 'text-white',
      meta: ['📍 City of Lakes', '🏛 9 Attractions'],
    },
    {
      id: 3,
      name: 'Jodhpur',
      image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=700&auto=format&fit=crop&q=85',
      tag: '🏯 Fort City',
      tagBg: 'bg-[rgba(255,255,255,0.2)] border border-[rgba(255,255,255,0.3)]',
      tagColor: 'text-white',
      meta: ['📍 The Blue City', '🏯 8 Attractions'],
    },
    {
      id: 4,
      name: 'Jaisalmer',
      image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=700&auto=format&fit=crop&q=85',
      tag: '🏜 Desert',
      tagBg: 'bg-[rgba(212,160,23,0.18)] border border-[rgba(212,160,23,0.38)]',
      tagColor: 'text-[#D4A017]',
      meta: ['📍 Golden City', '🏰 6 Attractions'],
    },
    {
      id: 5,
      name: 'Alwar',
      image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=700&auto=format&fit=crop&q=85',
      tag: '🐯 Wildlife',
      tagBg: 'bg-[rgba(34,197,94,0.15)] border border-[rgba(34,197,94,0.38)]',
      tagColor: 'text-[#22C55E]',
      meta: ['📍 Sariska Tiger Reserve', '🌿 Wildlife Zone'],
    },
  ]

  return (
    <section className="px-6 md:px-8 py-16 md:py-24 bg-[#FDF8F1]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-end justify-between gap-4 mb-12 flex-wrap">
          <div>
            <div className="text-[10px] font-bold letter-spacing-[2px] uppercase text-[#E8631A] mb-2">
              ✦ Top Destinations
            </div>
            <h2 className="font-['Playfair Display',serif] text-3xl md:text-4xl lg:text-5xl font-bold text-[#2C2017] leading-tight">
              Where do you want<br />to explore?
            </h2>
          </div>
          <a
            href="#"
            className="text-sm font-semibold text-[#E8631A] border-b border-current hover:opacity-70 transition-opacity inline-flex items-center gap-1"
          >
            View all cities →
          </a>
        </div>

        {/* Grid Layout - 3 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[230px] lg:auto-rows-auto lg:grid-rows-2">
          {/* First card - spans 2 rows on desktop */}
          <div className="lg:row-span-2 relative rounded-[22px] overflow-hidden cursor-pointer group bg-[#F5E8CC] h-[230px] lg:h-auto">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: `url('${destinations[0].image}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(24,18,14,0.82)] via-[rgba(24,18,14,0.08)] to-transparent" />
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
              <span className={`inline-flex items-center gap-1 px-2.75 py-1 rounded-full text-[10px] font-bold uppercase ${destinations[0].tagBg} ${destinations[0].tagColor}`}>
                {destinations[0].tag}
              </span>
              <div className="w-8 h-8 bg-[rgba(255,255,255,0.15)] backdrop-blur border border-[rgba(255,255,255,0.28)] rounded-full flex items-center justify-center text-white text-sm group-hover:bg-[#E8631A] group-hover:border-[#E8631A] transition-all">
                →
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-['Playfair Display',serif] text-2xl text-white leading-tight mb-1">
                {destinations[0].name}
              </h3>
              <div className="flex gap-2.5 flex-wrap">
                {destinations[0].meta.map((m, i) => (
                  <span key={i} className="text-[10px] text-[rgba(255,255,255,0.68)]">
                    {m}
                    {i < destinations[0].meta.length - 1 && <span className="ml-2.5 pl-2.5 border-l border-[rgba(255,255,255,0.22)]" />}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Remaining cards */}
          {destinations.slice(1).map((dest) => (
            <div
              key={dest.id}
              className="relative rounded-[22px] overflow-hidden cursor-pointer group bg-[#F5E8CC] h-[230px]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url('${dest.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(24,18,14,0.82)] via-[rgba(24,18,14,0.08)] to-transparent" />
              <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                <span className={`inline-flex items-center gap-1 px-2.75 py-1 rounded-full text-[10px] font-bold uppercase ${dest.tagBg} ${dest.tagColor}`}>
                  {dest.tag}
                </span>
                <div className="w-8 h-8 bg-[rgba(255,255,255,0.15)] backdrop-blur border border-[rgba(255,255,255,0.28)] rounded-full flex items-center justify-center text-white text-sm group-hover:bg-[#E8631A] group-hover:border-[#E8631A] transition-all">
                  →
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-['Playfair Display',serif] text-xl text-white leading-tight mb-1">
                  {dest.name}
                </h3>
                <div className="flex gap-2.5 flex-wrap">
                  {dest.meta.map((m, i) => (
                    <span key={i} className="text-[10px] text-[rgba(255,255,255,0.68)]">
                      {m}
                      {i < dest.meta.length - 1 && <span className="ml-2.5 pl-2.5 border-l border-[rgba(255,255,255,0.22)]" />}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TopDestinations
