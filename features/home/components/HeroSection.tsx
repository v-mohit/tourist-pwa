'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import SearchBar, { type SearchBarHandle } from './SearchBar'

const SLIDES = [
  {
    id: 1,
    title1: 'Pink City',
    title2: 'Hawa Mahal',
    sub: "Wander through the vibrant streets of Jaipur, where every wall tells a story of royal hospitality and timeless architectural brilliance.",
    img: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=1920&auto=format&fit=crop&q=90',
    thumbImg: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=600&auto=format&fit=crop&q=80',
    label: 'Hawa Mahal',
    tag: 'Jaipur · Pink City',
  },
  {
    id: 2,
    title1: 'Blue City',
    title2: 'Mehrangarh',
    sub: "Behold the mighty Sun Fortress guarding the indigo horizon of Jodhpur, an imposing testament to Marwar's valor and artistic heritage.",
    img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&auto=format&fit=crop&q=90',
    thumbImg: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop&q=80',
    label: 'Mehrangarh Fort',
    tag: 'Jodhpur · Blue City',
  },
  {
    id: 3,
    title1: 'Golden City',
    title2: 'Jaisalmer Fort',
    sub: "Experience the living fort rising from the Thar Desert like a giant sandcastle, shimmering with the warm glow of yellow sandstone.",
    img: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1920&auto=format&fit=crop&q=90',
    thumbImg: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&auto=format&fit=crop&q=80',
    label: 'Jaisalmer Fort',
    tag: 'Jaisalmer · Golden City',
  },
  {
    id: 4,
    title1: 'Udaipur',
    title2: 'City of Lakes',
    sub: "Lose yourself in the Venice of the East, where white marble palaces float on tranquil waters under the watchful Aravali hills.",
    img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1920&auto=format&fit=crop&q=90',
    thumbImg: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop&q=80',
    label: 'City of Lakes',
    tag: 'Udaipur · Lakeside',
  },
]

const BADGES = [
  { label: '🏆 SKOCH Award 2024', cls: 'hkb-gold' },
  { label: 'Official Govt. Portal', cls: 'hkb-white' },
  { label: '⭐ Incredible India', cls: 'hkb-white' },
]

const PILLS = [
  '🐯 Tiger Safari',
  '🏜 Jaisalmer',
  '🌊 Udaipur',
  '🏨 RTDC Hotels',
  '✨ Light & Sound',
]

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const searchRef = useRef<SearchBarHandle>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length)
    }, 5000)
  }

  useEffect(() => {
    startTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const handleSlideChange = (index: number) => {
    setActiveIndex(index)
    startTimer()
  }

  const handlePillClick = (pill: string) => {
    searchRef.current?.setValue(pill.replace(/^[\u{1F000}-\u{1FFFF}\u{2600}-\u{27FF}][\uFE0F]?\s*/u, '').trim())
  }

  return (
    <section className="hero" id="hero">
      {/* Fullscreen slideshow backgrounds */}
      <div className="hero-slides">
        {SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`hero-slide ${idx === activeIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url('${slide.img}')` }}
          />
        ))}
      </div>

      {/* Left content pane */}
      <div className="hero-pane">
        {/* <div className="hero-kicker">
          {BADGES.map((badge, idx) => (
            <span key={idx} className={`hero-kicker-badge ${badge.cls}`}>
              {badge.label}
            </span>
          ))}
        </div> */}

        <h1 className="hero-ttl">
          {SLIDES[activeIndex].title1}<br />
          <em>{SLIDES[activeIndex].title2}</em>
        </h1>

        <div className="hero-divider" />

        <p className="hero-sub">{SLIDES[activeIndex].sub}</p>

        <div className="hero-search-wrap">
          <div className="hero-search-lbl">Search destinations, monuments, safaris…</div>
          <SearchBar ref={searchRef} />
          <div className="hero-pills">
            {PILLS.map((pill) => (
              <span
                key={pill}
                className="hero-pill"
                onClick={() => handlePillClick(pill)}
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

        <div className="hero-actions">
          <Link href="#destinations" className="hero-cta-primary">
            Explore Destinations →
          </Link>
          <Link href="#packages" className="hero-cta-secondary">
            🎫 View Packages
          </Link>
        </div>
      </div>

      {/* Right thumbnail strip */}
      <div className="hero-strip">
        {SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`hero-thumb ${idx === activeIndex ? 'active' : ''}`}
            onClick={() => handleSlideChange(idx)}
          >
            <div
              className="hero-thumb-img"
              style={{ backgroundImage: `url('${slide.thumbImg}')` }}
            />
            <div className="hero-thumb-ov" />
            <div className="hero-thumb-label">
              <h5>{slide.label}</h5>
              <span>{slide.tag}</span>
            </div>
            <div className="hero-thumb-bar" />
          </div>
        ))}
      </div>

      {/* Bottom slide counter + dots */}
      <div className="hero-counter">
        <div className="hero-dots">
          {SLIDES.map((_, idx) => (
            <div
              key={idx}
              className={`hero-dot ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => handleSlideChange(idx)}
            />
          ))}
        </div>
        <div className="hero-slide-num">
          0{activeIndex + 1} / 0{SLIDES.length}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="scroll-hint">
        <span>Scroll</span>
        <div className="scroll-ring" />
      </div>
    </section>
  )
}