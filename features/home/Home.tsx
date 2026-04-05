'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/app/contexts/AuthContext'
import SearchBar from '@/app/components/SearchBar'
import PopularPackages from '@/app/components/PopularPackages'

interface HomeProps {
  homeData?: any
}

const Home = ({ homeData }: HomeProps) => {
  const { isAuthenticated, openLoginModal } = useAuth()

  // Extract data from homeData
  const destinations = homeData?.home?.data?.attributes?.home?.find?.((item: any) => item.__typename === 'ComponentHomePlaces')
  const monuments = homeData?.home?.data?.attributes?.home?.find?.((item: any) => item.__typename === 'ComponentHomeMonuments')
  const wildlife = homeData?.home?.data?.attributes?.home?.find?.((item: any) => item.__typename === 'ComponentHomeWildLife')

  const handleBookClick = () => {
    if (!isAuthenticated) {
      openLoginModal()
    }
  }

  return (
    <div className="w-full">
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

      {/* ════ STATS BAR ════ */}
      <div className="stats-bar">
        <div className="si"><span className="si-ico">🌆</span><div><div className="si-n">34+</div><div className="si-l">Cities</div></div></div>
        <div className="si"><span className="si-ico">🏯</span><div><div className="si-n">60+</div><div className="si-l">Monuments</div></div></div>
        <div className="si"><span className="si-ico">🐯</span><div><div className="si-n">20+</div><div className="si-l">Wildlife Parks</div></div></div>
        <div className="si"><span className="si-ico">🎫</span><div><div className="si-n">10</div><div className="si-l">Darshan Packages</div></div></div>
        <div className="si"><span className="si-ico">🏛</span><div><div className="si-n">30+</div><div className="si-l">Museums</div></div></div>
        <div className="si"><span className="si-ico">🌿</span><div><div className="si-n">5+</div><div className="si-l">City Parks</div></div></div>
      </div>

      {/* ════ DESTINATIONS ════ */}
      <section id="destinations" className="sec bg-[var(--cream)]">
        <div className="sec-hd rv">
          <div>
            <div className="sec-lbl">✦ Top Destinations</div>
            <h2 className="sec-ttl">Where do you want<br />to explore?</h2>
          </div>
          <a href="#" className="see-all">View all cities →</a>
        </div>
        <div className="dest-grid rv">
          <div className="dest-card">
            <div className="dimg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=900&auto=format&fit=crop&q=85')" }}></div>
            <div className="dest-grad"></div>
            <div className="dest-top"><span className="tag tg">⭐ Most Popular</span><div className="dest-arr">→</div></div>
            <div className="dest-foot"><h3>Jaipur</h3><div className="dest-meta"><span>📍 The Pink City</span><span>🏯 12 Monuments</span></div></div>
          </div>
          <div className="dest-card">
            <div className="dimg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1599661046289-e31897846e41?w=700&auto=format&fit=crop&q=85')" }}></div>
            <div className="dest-grad"></div>
            <div className="dest-top"><span className="tag tw">🌊 Lakes</span><div className="dest-arr">→</div></div>
            <div className="dest-foot"><h3>Udaipur</h3><div className="dest-meta"><span>📍 City of Lakes</span><span>🏛 9 Attractions</span></div></div>
          </div>
          <div className="dest-card">
            <div className="dimg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=700&auto=format&fit=crop&q=85')" }}></div>
            <div className="dest-grad"></div>
            <div className="dest-top"><span className="tag tw">🏯 Fort City</span><div className="dest-arr">→</div></div>
            <div className="dest-foot"><h3>Jodhpur</h3><div className="dest-meta"><span>📍 The Blue City</span><span>🏯 8 Attractions</span></div></div>
          </div>
          <div className="dest-card">
            <div className="dimg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=700&auto=format&fit=crop&q=85')" }}></div>
            <div className="dest-grad"></div>
            <div className="dest-top"><span className="tag tg">🏜 Desert</span><div className="dest-arr">→</div></div>
            <div className="dest-foot"><h3>Jaisalmer</h3><div className="dest-meta"><span>📍 Golden City</span><span>🏰 6 Attractions</span></div></div>
          </div>
          <div className="dest-card">
            <div className="dimg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=700&auto=format&fit=crop&q=85')" }}></div>
            <div className="dest-grad"></div>
            <div className="dest-top"><span className="tag tn">🐯 Wildlife</span><div className="dest-arr">→</div></div>
            <div className="dest-foot"><h3>Alwar</h3><div className="dest-meta"><span>📍 Sariska Tiger Reserve</span><span>🌿 Wildlife Zone</span></div></div>
          </div>
        </div>
      </section>

      {/* ════ POPULAR PACKAGES ════ */}
      <PopularPackages />

      {/* ════ MONUMENTS ════ */}
      <section id="monuments" className="sec bg-[var(--cream)]">
        <div className="sec-hd rv">
          <div>
            <div className="sec-lbl">✦ Top Monuments</div>
            <h2 className="sec-ttl">Royal Heritage & Architecture</h2>
          </div>
          <a href="#" className="see-all">See all →</a>
        </div>
        <div className="mon-grid rv">
          {[
            { id: 1, name: 'Amber Fort', city: 'Jaipur', image: 'https://images.unsplash.com/photo-1477587458883-47145ed31f5e?w=500&auto=format&fit=crop&q=80', tag: '🏆 UNESCO', chips: ['🏯 Fort', '16th Century'], time: '⏰ 8AM–5:30PM', fee: '₹200' },
            { id: 2, name: 'Hawa Mahal', city: 'Jaipur', image: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=500&auto=format&fit=crop&q=80', tag: '🌸 Iconic', chips: ['953 Windows', 'Pink City'], time: '⏰ 9AM–5PM', fee: '₹50' },
            { id: 3, name: 'Mehrangarh Fort', city: 'Jodhpur', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&auto=format&fit=crop&q=80', tag: '🔵 Blue City', chips: ['15th Century', 'Museum'], time: '⏰ 9AM–5PM', fee: '₹100' },
            { id: 4, name: 'Jaisalmer Fort', city: 'Jaisalmer', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=500&auto=format&fit=crop&q=80', tag: '🏜 Desert Fort', chips: ['Living Fort', '12th Century'], time: '⏰ 9AM–6PM', fee: '₹70' },
            { id: 5, name: 'City Palace, Udaipur', city: 'Udaipur', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&auto=format&fit=crop&q=80', tag: '🌊 Lakeside', chips: ['Palace', 'Museum'], time: '⏰ 9:30AM–5:30PM', fee: '₹300' },
            { id: 6, name: 'Jantar Mantar', city: 'Jaipur', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&auto=format&fit=crop&q=80', tag: '🏆 UNESCO', chips: ['🔭 Observatory', '18th Century'], time: '⏰ 9AM–4:30PM', fee: '₹40' },
            { id: 7, name: 'Nahargarh Fort', city: 'Jaipur', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=500&auto=format&fit=crop&q=80', tag: '🌅 Sunset Point', chips: ['City View', 'Wax Museum'], time: '⏰ 10AM–5:30PM', fee: '₹50' },
            { id: 8, name: 'Taragarh Fort, Bundi', city: 'Bundi', image: 'https://images.unsplash.com/photo-1589456506629-b2ea1a8576c7?w=500&auto=format&fit=crop&q=80', tag: '💎 Hidden Gem', chips: ['14th Century', 'Step Wells'], time: '⏰ 8AM–5PM', fee: '₹30' },
          ].map((monument) => (
            <div key={monument.id} className="mon-card">
              <div className="mon-img">
                <div className="dimg" style={{ backgroundImage: `url('${monument.image}')` }}></div>
                <div className="mon-img-grad"></div>
                <div className="mon-img-tag"><span className="tag tg" style={{ fontSize: '8px' }}>{monument.tag}</span></div>
              </div>
              <div className="mon-body">
                <div className="mon-name">{monument.name}</div>
                <div className="mon-loc">📍 {monument.city}</div>
                <div className="mon-chips">
                  {monument.chips.map((chip, idx) => (
                    <span key={idx} className="mon-chip">{chip}</span>
                  ))}
                </div>
                <div className="mon-foot">
                  <span className="mon-time">{monument.time}</span>
                  <span className="mon-fee">{monument.fee}</span>
                </div>
                <button className="btn-sm" style={{ width: '100%', marginTop: '10px', justifyContent: 'center' }}>Book Entry →</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════ WILDLIFE ════ */}
      <section id="wildlife" style={{ background: '#0B1A12' }} className="sec">
        <div className="sec-hd rv">
          <div>
            <div className="sec-lbl" style={{ color: '#22C55E' }}>✦ Top Wildlife</div>
            <h2 className="sec-ttl sec-ttl-w">Into the Wild</h2>
          </div>
          <a href="#" className="see-all" style={{ color: '#22C55E', borderColor: '#22C55E' }}>See all →</a>
        </div>
        <div className="wild-hero rv" style={{ borderRadius: 'var(--rl)', overflow: 'hidden', position: 'relative', height: '370px', marginBottom: '16px', cursor: 'pointer', background: '#1a2e20' }}>
          <div className="dimg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=1400&auto=format&fit=crop&q=85')" }}></div>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(11,26,18,.93) 0%, rgba(11,26,18,.3) 55%, transparent 100%)' }}></div>
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '36px 40px', maxWidth: '440px' }}>
            <span className="tag tn">🐯 Project Tiger Reserve</span>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(22px,2.8vw,34px)', color: '#fff', margin: '10px 0 8px', lineHeight: 1.2 }}>Sariska Tiger Reserve</h2>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'rgba(255,255,255,.65)', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '8px', padding: '5px 10px' }}><b>📍 Alwar</b></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'rgba(255,255,255,.65)', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '8px', padding: '5px 10px' }}><b>🌿 800 km²</b></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'rgba(255,255,255,.65)', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '8px', padding: '5px 10px' }}><b>🐯 30+ Tigers</b></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'rgba(255,255,255,.65)', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '8px', padding: '5px 10px' }}><b>📅 Oct–Jun</b></div>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.6)', lineHeight: 1.7, marginBottom: '20px' }}>India's first reserve to successfully relocate tigers. Home to leopards, hyenas and 200+ bird species.</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button className="btn-p">Book Safari →</button>
              <button className="btn-g">View Details</button>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px' }} className="rv">
          {[
            { name: 'Jhalana Leopard Park', image: 'https://images.unsplash.com/photo-1608023136037-626dad6df358?w=500&auto=format&fit=crop&q=80', tag: '🐆 Leopard', info: '📍 Jaipur · 30+ Leopards' },
            { name: 'Keoladeo National Park', image: 'https://images.unsplash.com/photo-1614267861476-3bde44e0bc6c?w=500&auto=format&fit=crop&q=80', tag: '🦅 UNESCO', info: '📍 Bharatpur · 380+ Bird Species' },
            { name: 'Nahargarh Biological Park', image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=500&auto=format&fit=crop&q=80', tag: '🐘 Bio Park', info: '📍 Jaipur · Big Cats Zone' },
            { name: 'Ramgarh Vishdhari Reserve', image: 'https://images.unsplash.com/photo-1612428085659-de9c5c765fe6?w=500&auto=format&fit=crop&q=80', tag: '🐅 Tiger Reserve', info: '📍 Bundi · Newest Reserve' },
          ].map((wild, idx) => (
            <div key={idx} style={{ borderRadius: 'var(--r)', overflow: 'hidden', position: 'relative', height: '210px', cursor: 'pointer', background: '#1a2e20' }}>
              <div className="dimg" style={{ backgroundImage: `url('${wild.image}')` }}></div>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,26,18,.9) 0%, rgba(11,26,18,.08) 55%, transparent 100%)' }}></div>
              <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                <span className="tag tn" style={{ fontSize: '9px' }}>{wild.tag}</span>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '13px 14px' }}>
                <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: '14px', color: '#fff', marginBottom: '2px' }}>{wild.name}</h4>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,.58)' }}>{wild.info}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════ WELCOME MESSAGE ════ */}
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
