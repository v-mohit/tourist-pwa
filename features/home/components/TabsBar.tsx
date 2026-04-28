'use client'

import Link from 'next/link'
import { useState } from 'react'

const TABS = [
  { label: 'All', tab: 'all', href: '#destinations' },
  { label: '🌆 Cities', tab: 'cities', href: '#destinations' },
  { label: '🐯 Wildlife', tab: 'wildlife', href: '#wildlife' },
  { label: '🏯 Monuments', tab: 'monuments', href: '#monuments' },
  { label: '🏛 Museums', tab: 'museums', href: '#museums' },
  { label: '✨ Light & Sound', tab: 'ls', href: '#ls' },
  { label: '☕ Cafeteria', tab: 'cafeteria', href: '#cafeteria' },
  { label: '🎭 JKK', tab: 'venues', href: '#venues' },
  { label: '🏨 RTDC Hotels', tab: 'rtdc', href: '#rtdc' },
  { label: '🏛 ASI Sites', tab: 'asi', href: '#asi' },
  { label: '🌿 Parks', tab: 'parks', href: '#parks' },
]

export default function TabsBar() {
  const [active, setActive] = useState('all')

  return (
    <div className="tabs-bar">
      <div className="tabs-sc">
        {TABS.map(({ label, tab, href }) => (
          <Link
            key={tab}
            href={href}
            className={`chip ${active === tab ? 'active' : ''}`}
            onClick={() => setActive(tab)}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  )
}
