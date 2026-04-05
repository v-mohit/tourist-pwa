'use client'

import { useState } from 'react'

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery)
    }
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex items-center bg-[rgba(255,255,255,0.14)] backdrop-blur-[18px] border border-[rgba(255,255,255,0.3)] rounded-full px-6 py-2 md:py-2.5 gap-2">
        <input
          type="text"
          placeholder="🔍  Search forts, wildlife, packages, parks…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-white text-sm font-normal font-['Inter'] placeholder-[rgba(255,255,255,0.52)]"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-[#E8631A] text-white rounded-full text-sm font-bold flex-shrink-0 transition-all duration-200 hover:bg-[#C04E0A] box-shadow-[0_4px_14px_rgba(232,99,26,0.4)]"
        >
          Search
        </button>
      </div>
    </form>
  )
}

export default SearchBar
