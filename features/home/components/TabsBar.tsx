'use client'

import { useState } from 'react'

const TABS = [
  { label: 'All',             tab: 'all' },
  { label: '🌆 Cities',       tab: 'cities' },
  { label: '🐯 Wildlife',     tab: 'wildlife' },
  { label: '🏯 Monuments',    tab: 'monuments' },
  { label: '🏛 Museums',      tab: 'museums' },
  { label: '✨ Light & Sound', tab: 'ls' },
  { label: '☕ Cafeteria',     tab: 'cafeteria' },
  { label: '🎭 JKK',          tab: 'venues' },
  { label: '🏨 RTDC Hotels',  tab: 'rtdc' },
  { label: '🏛 ASI Sites',    tab: 'asi' },
  { label: '🌿 Parks',        tab: 'parks' },
]

export default function TabsBar() {
  const [active, setActive] = useState('all')

  return (
    <div className="tabs-bar">
      <div className="tabs-sc">
        {TABS.map(({ label, tab }) => (
          <button
            key={tab}
            className={`chip ${active === tab ? 'active' : ''}`}
            onClick={() => setActive(tab)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
