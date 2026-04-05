'use client'

import Link from 'next/link'
import Image from 'next/image'

interface Place {
  id: string
  attributes: {
    name: string
    images: {
      data: Array<{
        attributes: {
          url: string
        }
      }>
    }
    city: {
      data: {
        attributes: {
          name: string
        }
      }
    }
  }
}

interface TopMonumentsProps {
  monuments?: {
    category?: {
      data: {
        attributes: {
          places: {
            data: Place[]
          }
        }
      }
    }
  }
}

const TopMonuments = ({ monuments }: TopMonumentsProps) => {
  const places = monuments?.category?.data?.attributes?.places?.data || []

  if (places.length === 0) {
    return null
  }

  const displayPlaces = places.slice(0, 6)

  return (
    <section id="monuments" className="px-6 md:px-8 py-16 md:py-24 max-w-6xl mx-auto bg-[#F8F6F3]">
      <div className="mb-12">
        <h2 className="font-['Playfair Display',serif] text-3xl md:text-4xl lg:text-5xl font-bold text-[#2C2017] mb-4">
          Top Monuments
        </h2>
        <p className="text-base md:text-lg text-[#7A6A58] max-w-2xl leading-relaxed">
          Explore the historic and architectural wonders of Rajasthan
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayPlaces.map((place) => {
          const imageUrl = place.attributes.images?.data?.[0]?.attributes?.url
          const placeName = place.attributes.name
          const cityName = place.attributes.city?.data?.attributes?.name

          return (
            <Link
              key={place.id}
              href={`#`}
              className="group overflow-hidden rounded-[16px] shadow-[0_4px_20px_rgba(24,18,14,0.1)] hover:shadow-[0_12px_48px_rgba(24,18,14,0.16)] transition-all duration-300 bg-white"
            >
              <div className="relative h-64 bg-gradient-to-b from-gray-300 to-gray-200 overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={placeName}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image available
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-['Playfair Display',serif] text-lg font-bold text-[#2C2017] mb-1">
                  {placeName}
                </h3>
                <p className="text-sm text-[#7A6A58]">{cityName}</p>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="flex justify-center mt-12">
        <Link
          href="#"
          className="inline-flex items-center gap-2 px-8 py-3 md:py-4 bg-[#E8631A] text-white font-semibold rounded-full transition-all duration-200 hover:bg-[#C04E0A] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(232,99,26,0.35)]"
        >
          View All Monuments →
        </Link>
      </div>
    </section>
  )
}

export default TopMonuments
