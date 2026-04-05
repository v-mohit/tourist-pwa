'use client'

import HeroSection from '@/app/components/sections/HeroSection'
import StatsBar from '@/app/components/sections/StatsBar'
import TopDestinations from '@/app/components/sections/TopDestinations'
import PopularPackages from '@/app/components/PopularPackages'
import TopMonuments from '@/app/components/sections/TopMonuments'
import TopWildlife from '@/app/components/sections/TopWildlife'
import WelcomeSection from '@/app/components/sections/WelcomeSection'

interface HomeProps {
  homeData?: any
}

const Home = ({ homeData }: HomeProps) => {
  return (
    <div className="w-full">
      {/* Hero Section with Search Bar */}
      <HeroSection />

      {/* Stats Bar */}
      <StatsBar />

      {/* Destinations Section */}
      <TopDestinations />

      {/* Popular Packages Section */}
      <PopularPackages />

      {/* Monuments Section */}
      <TopMonuments />

      {/* Wildlife Section */}
      <TopWildlife />

      {/* Welcome Section */}
      <WelcomeSection />
    </div>
  )
}

export default Home
