'use client'

import { useRef } from 'react'
import SearchBar from './SearchBar'
import type { SearchBarHandle } from './SearchBar'

const BADGES = [
  { label: '⭐ Incredible State of India', cls: 'tg' },
  { label: '🏆 SKOCH Award Winner', cls: 'tw' },
  { label: 'Official Govt. Portal', cls: 'tw' },
]

const PILLS = [
  '🏯 Amber Fort',
  '🐯 Tiger Safari',
  '🏜 Desert Camp',
  '🌊 Lake Palace',
  '🌿 City Parks',
  '✨ Light & Sound',
]

export default function HeroSection() {
  const searchRef = useRef<SearchBarHandle>(null)

  function handlePillClick(pill: string) {
    searchRef.current?.setValue(pill.replace(/^.{2}/, '').trim())
  }

  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-ov" />

      <div className="hero-body">
        <div className="hero-eye">
          {BADGES.map(({ label, cls }) => (
            <span key={label} className={`tag ${cls}`}>{label}</span>
          ))}
        </div>

        <h1 className="hero-ttl">
          Explore<br />
          <em>Rajasthan</em>
        </h1>

        <p className="hero-sub">
          Discover forts, wildlife, museums & more across Rajasthan.
        </p>

        <SearchBar ref={searchRef} />

        <div className="hero-pills">
          {PILLS.map((pill) => (
            <button
              key={pill}
              className="hero-pill"
              onClick={() => handlePillClick(pill)}
            >
              {pill}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}