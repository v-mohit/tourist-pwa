import Image from 'next/image';
import React from 'react'

const MobileSection = () => {
  const appleStoreLink = "https://apps.apple.com/in/app/obms/id6741659933";
  const playStoreLink = "https://play.google.com/store/search?q=obms&c=apps";

  return (
    <section className="bg-[#FDF8F1] py-16 px-6 lg:px-20 overflow-hidden" id="app">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* App Info Side */}
        <div className="space-y-6">
          <div className="text-[#E8631A] text-xs font-bold tracking-[2px] uppercase">
            ✦ Official Mobile App
          </div>
          <h2 className="text-4xl lg:text-5xl font-serif text-[#18120E] leading-tight">
            Rajasthan Tourism<br />
            <em className="italic">in Your Pocket</em>
          </h2>
          <p className="text-[#7A6A58] text-sm leading-relaxed max-w-md">
            Book tickets, plan itineraries, navigate to sites, and explore Rajasthan — all from the official OBMS mobile app. Available free on Android and iOS.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl shrink-0">
                🎟
              </div>
              <div>
                <h5 className="font-bold text-[#18120E] text-sm">Instant Ticket Booking</h5>
                <p className="text-[#7A6A58] text-xs leading-relaxed">Book entry tickets for forts, wildlife safaris and shows in seconds — no queues.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl shrink-0">
                🗺
              </div>
              <div>
                <h5 className="font-bold text-[#18120E] text-sm">Interactive Site Maps</h5>
                <p className="text-[#7A6A58] text-xs leading-relaxed">Navigate heritage sites with offline-capable maps and audio guides.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl shrink-0">
                🆘
              </div>
              <div>
                <h5 className="font-bold text-[#18120E] text-sm">SOS Emergency Button</h5>
                <p className="text-[#7A6A58] text-xs leading-relaxed">One-tap emergency assistance for tourists, available 24/7 across Rajasthan.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl shrink-0">
                📅
              </div>
              <div>
                <h5 className="font-bold text-[#18120E] text-sm">Event & Show Alerts</h5>
                <p className="text-[#7A6A58] text-xs leading-relaxed">Get notified about upcoming Light & Sound shows, JKK events and festivals.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-6">
            <a
              href={appleStoreLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#18120E] text-white px-6 py-3 rounded-xl hover:bg-black transition-colors"
            >
              <div className="text-2xl">🍎</div>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] uppercase font-medium text-gray-400">Download on the</span>
                <span className="text-sm font-bold">App Store</span>
              </div>
            </a>
            <a
              href={playStoreLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#18120E] text-white px-6 py-3 rounded-xl hover:bg-black transition-colors"
            >
              <div className="text-2xl">🤖</div>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] uppercase font-medium text-gray-400">Get it on</span>
                <span className="text-sm font-bold">Google Play</span>
              </div>
            </a>
          </div>
        </div>

        {/* Mockup Side */}
        <div className="relative flex justify-center items-center">
          <div className="absolute w-[400px] h-[400px] bg-[#E8631A] opacity-5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute w-[300px] h-[300px] bg-[#D4A017] opacity-5 rounded-full blur-3xl animate-pulse delay-700"></div>

          {/* Phone Frame */}
          <div className="relative w-[280px] h-[560px] bg-[#18120E] rounded-[3rem] p-3 shadow-2xl border-4 border-[#2C2017]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#18120E] rounded-b-2xl z-20"></div>

            <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative flex flex-col">
              {/* Status Bar */}
              <div className="px-6 py-4 flex justify-between items-center text-[10px] font-bold text-[#18120E]">
                <span>9:41</span>
                <div className="flex gap-1">
                  <span>📶</span>
                  <span>🔋</span>
                </div>
              </div>

              {/* App Content */}
              <div className="flex-1 overflow-y-auto [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="relative h-32 m-3 rounded-2xl overflow-hidden group">
                  <Image
                    src="/images/hawawebp.webp"
                    alt="Hawa Mahal"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-3 left-4 text-white font-bold text-sm">Hawa Mahal</div>
                </div>

                <div className="px-4 py-2">
                  <div className="text-[10px] font-bold text-[#18120E] mb-3">Quick Book</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white rounded-xl p-2 border border-[#E8DAC5] shadow-sm">
                      <div className="relative h-16 rounded-lg overflow-hidden mb-2">
                        <Image
                          src="/images/amberWebp.webp"
                          alt="Amber Fort"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20"></div>
                      </div>
                      <div className="text-[9px] font-bold text-center text-[#18120E]">Amber Fort</div>
                    </div>
                    <div className="bg-white rounded-xl p-2 border border-[#E8DAC5] shadow-sm">
                      <div className="relative h-16 rounded-lg overflow-hidden mb-2">
                        <Image
                          src="/images/tiger.webp"
                          alt="Safari"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20"></div>
                      </div>
                      <div className="text-[9px] font-bold text-center text-[#18120E]">Sariska Tiger Reserve</div>
                    </div>
                    <div className="bg-white rounded-xl p-2 border border-[#E8DAC5] shadow-sm">
                      <div className="relative h-16 rounded-lg overflow-hidden mb-2">
                        <Image
                          src="/images/JhoomarBaori.webp"
                          alt="Jhoomar Baori"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20"></div>
                      </div>
                      <div className="text-[9px] font-bold text-center text-[#18120E]">Jhoomar Baori</div>
                    </div>
                    <div className="bg-white rounded-xl p-2 border border-[#E8DAC5] shadow-sm">
                      <div className="relative h-16 rounded-lg overflow-hidden mb-2">
                        <Image
                          src="/images/lake-palace.webp"
                          alt="Udaipur"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20"></div>
                      </div>
                      <div className="text-[9px] font-bold text-center text-[#18120E]">Udaipur</div>
                    </div>
                  </div>
                </div>

                <div className="m-4 mt-2 bg-[#e8631a] text-white py-3 rounded-xl text-center text-xs font-bold shadow-lg shadow-red-200 cursor-pointer hover:bg-red-700 transition-colors">
                  Book Now
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MobileSection