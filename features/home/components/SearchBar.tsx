'use client'

import {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react'

const SEARCH_MAP: Record<string, string> = {
  'amber fort':     'monuments',
  'hawa mahal':     'monuments',
  'mehrangarh':     'monuments',
  'jaisalmer fort': 'monuments',
  'jantar mantar':  'monuments',
  'tiger':          'wildlife',
  'safari':         'wildlife',
  'sariska':        'wildlife',
  'leopard':        'wildlife',
  'wildlife':       'wildlife',
  'museum':         'museums',
  'albert hall':    'museums',
  'park':           'parks',
  'garden':         'parks',
  'light':          'ls',
  'sound':          'ls',
  'show':           'ls',
  'chittorgarh':    'ls',
  'kumbhalgarh':    'ls',
  'package':        'packages',
  'darshan':        'packages',
  'hotel':          'rtdc',
  'rtdc':           'rtdc',
  'stay':           'rtdc',
  'palace':         'rtdc',
  'jkk':            'venues',
  'event':          'venues',
  'festival':       'venues',
  'cafeteria':      'cafeteria',
  'dining':         'cafeteria',
  'food':           'cafeteria',
  'masala chowk':   'cafeteria',
  'asi':            'asi',
  'archaeological': 'asi',
  'jaipur':         'destinations',
  'udaipur':        'destinations',
  'jodhpur':        'destinations',
  'jaisalmer':      'destinations',
  'alwar':          'destinations',
}

export interface SearchBarHandle {
  setValue: (value: string) => void
}

const SearchBar = forwardRef<SearchBarHandle>((_, ref) => {
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState({ icon: '', msg: '', visible: false })
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  useImperativeHandle(ref, () => ({
    setValue(value: string) {
      setQuery(value)
      setTimeout(() => inputRef.current?.focus(), 0)
    },
  }))

  function showToast(icon: string, msg: string) {
    setToast({ icon, msg, visible: true })
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(
      () => setToast((p) => ({ ...p, visible: false })),
      3200,
    )
  }

  function doSearch() {
    const q = query.toLowerCase().trim()
    if (!q) { showToast('⌨️', 'Please type something to search'); return }

    let targetId: string | null = null
    for (const [kw, id] of Object.entries(SEARCH_MAP)) {
      if (q.includes(kw)) { targetId = id; break }
    }

    if (targetId) {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
      showToast('🔍', `Showing results for "${query.trim()}"`)
    } else {
      document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' })
      showToast('🤔', 'No exact match — showing all destinations')
    }
  }

  return (
    <>
      <div className="hero-search">
        <input
          ref={inputRef}
          type="text"
          placeholder="🔍  Search forts, wildlife, packages, parks…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && doSearch()}
        />
        <button className="hero-sbtn" onClick={doSearch}>Search</button>
      </div>

      {/* Toast — .toast and .toast.show are in globals.css */}
      <div className={`toast${toast.visible ? ' show' : ''}`}>
        <span className="ti">{toast.icon}</span>
        {toast.msg}
      </div>
    </>
  )
})

SearchBar.displayName = 'SearchBar'
export default SearchBar
