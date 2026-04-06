'use client'

import { useState } from 'react'

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert('Please type something to search')
      return
    }
    // Search logic will be implemented later with data
    console.log('Searching for:', searchQuery)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="flex items-center w-full max-w-[540px] bg-[rgba(255,255,255,0.14)] backdrop-blur-[18px] border-[1.5px] border-[rgba(255,255,255,0.3)] rounded-full px-6 py-1.75 gap-2">
      <input
        type="text"
        placeholder="🔍  Search forts, wildlife, packages, parks…"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-[rgba(255,255,255,0.52)] text-sm font-family-['Inter']"
      />
      <button
        onClick={handleSearch}
        className="px-6 py-2.5 bg-[#E8631A] text-white rounded-full text-sm font-bold flex-shrink-0 transition-all duration-200 hover:bg-[#C04E0A] shadow-[0_4px_14px_rgba(232,99,26,0.4)]"
      >
        Search
      </button>
    </div>
  )
}

export default SearchBar
