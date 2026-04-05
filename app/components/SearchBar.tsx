'use client'

import { useState } from 'react'

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search results or filter
      console.log('Searching for:', searchQuery)
    }
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search destinations, monuments, wildlife parks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-3 md:py-4 rounded-full bg-white text-[#2C2017] placeholder-[#7A6A58] outline-none shadow-[0_8px_32px_rgba(0,0,0,0.15)] focus:shadow-[0_12px_48px_rgba(232,99,26,0.2)]"
          />
          <svg
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A6A58]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <button
          type="submit"
          className="px-6 md:px-8 py-3 md:py-4 bg-[#E8631A] text-white font-semibold rounded-full transition-all duration-200 hover:bg-[#C04E0A] hover:shadow-[0_4px_16px_rgba(232,99,26,0.35)] flex-shrink-0"
        >
          Search
        </button>
      </div>
    </form>
  )
}

export default SearchBar
