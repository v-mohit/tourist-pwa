'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface CityDetailsProps {
  cityDetailData: any;
}

const CityDetails = ({ cityDetailData }: CityDetailsProps) => {
  const cityDetail = cityDetailData?.cityDetails?.data?.[0]?.attributes;
  const city = cityDetail?.city?.data?.attributes;

  const [activeCategory, setActiveCategory] = useState('All');

  if (!city) {
    return (
      <div className="page-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">No City Data Found</h2>
          <Link href="/" className="btn-p mt-4">Back to Home</Link>
        </div>
      </div>
    );
  }

  const cityName = city.name || 'Rajasthan City';
  const nickname = city.nickname || 'Land of Kings';
  const description = city.description || 'Welcome to one of the most vibrant cities in Rajasthan.';
  const mainImage = city.image?.data?.attributes?.url 
    ? `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${city.image.data.attributes.url}`
    : 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&auto=format&fit=crop&q=85';

  const places = city.places?.data || [];
  
  // Categorize places for stats and filtering
  const museums = places.filter((p: any) => 
    p.attributes.categories?.data?.some((c: any) => c.attributes.Name.toLowerCase().includes('museum'))
  );
  const wildlife = places.filter((p: any) => 
    p.attributes.categories?.data?.some((c: any) => c.attributes.Name.toLowerCase().includes('wildlife'))
  );
  const monuments = places.filter((p: any) => 
    p.attributes.categories?.data?.some((c: any) => c.attributes.Name.toLowerCase().includes('monument'))
  );

  const categories = ['All', 'Museums', 'Wildlife', 'Monuments', 'Parks'];
  
  const filteredPlaces = activeCategory === 'All' 
    ? places 
    : places.filter((p: any) => 
        p.attributes.categories?.data?.some((c: any) => 
          c.attributes.Name.toLowerCase().includes(activeCategory.toLowerCase().replace('s', ''))
        )
      );

  const reach = city.howToReachHere || {};

  return (
    <div className="page-bg">
      {/* <span className="demo-label">OBMS · Explore City</span> */}

      <div className="city-card">
        {/* Hero Section */}
        <div className="cc-hero">
          <div 
            className="cc-hero-img" 
            style={{ backgroundImage: `url('${mainImage}')` }} 
          />
          <div className="cc-hero-grad"></div>
          <div className="cc-hero-top">
            <span className="tag tg">🏆 Featured City</span>
            <div className="cc-weather">☀️ 29°C <span>Partly Cloudy</span></div>
          </div>
          <div className="cc-hero-foot">
            <div className="cc-city-name">{cityName} — <em>{nickname}</em></div>
            <div className="cc-meta-row">
              <span className="cc-meta-pill">📍 Rajasthan</span>
              <span className="cc-meta-pill">⭐ 4.9 Rated</span>
              <span className="cc-meta-pill">🏛 {places.length} Bookable Places</span>
            </div>
          </div>
        </div>

        {/* City Info Body */}
        <div className="cc-body">
          <div className="cc-info-grid">
            <div>
              <p className="cc-desc">{description}</p>
              <div className="cc-how-row">
                {reach.planeRoute && (
                  <span className="cc-reach">
                    <span className="cc-reach-ico">✈️</span> {reach.planeRoute}
                  </span>
                )}
                {reach.trainRoute && (
                  <span className="cc-reach">
                    <span className="cc-reach-ico">🚂</span> Rail: {reach.trainRoute}
                  </span>
                )}
                {reach.carRoute && (
                  <span className="cc-reach">
                    <span className="cc-reach-ico">🚌</span> Road: {reach.carRoute}
                  </span>
                )}
                {!reach.planeRoute && !reach.trainRoute && !reach.carRoute && (
                  <span className="cc-reach">
                    <span className="cc-reach-ico">📍</span> Well connected to major cities
                  </span>
                )}
              </div>
            </div>
            <div className="cc-stats">
              <div className="cc-stat">
                <div className="cc-stat-num">{places.length}</div>
                <div className="cc-stat-lbl">Places</div>
              </div>
              <div className="cc-stat">
                <div className="cc-stat-num">{wildlife.length}</div>
                <div className="cc-stat-lbl">Wildlife</div>
              </div>
              <div className="cc-stat">
                <div className="cc-stat-num">{museums.length}</div>
                <div className="cc-stat-lbl">Museums</div>
              </div>
            </div>
          </div>
        </div>

        {/* Places Header + Filter */}
        <div className="cc-places-hd">
          <div>
            <div className="cc-places-title">📍 Places to Visit &amp; Book</div>
            <div className="cc-places-sub">Bookable attractions around {cityName}</div>
          </div>
        </div>

        {/* Category Chips */}
        <div className="cc-cats">
          {categories.map(cat => (
            <button 
              key={cat}
              className={`cc-cat ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'All' ? '' : cat === 'Museums' ? '🏛 ' : cat === 'Wildlife' ? '🌿 ' : cat === 'Monuments' ? '🏯 ' : '🌳 '}{cat}
            </button>
          ))}
        </div>

        {/* Places Grid */}
        <div className="cc-places">
          {filteredPlaces.map((place: any) => {
            const attr = place.attributes;
            const placeImg = attr.images?.data?.[0]?.attributes?.url
              ? `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${attr.images.data[0].attributes.url}`
              : 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&auto=format&fit=crop&q=80';
            
            const category = attr.categories?.data?.[0]?.attributes?.Name || 'Attraction';
            const slug = attr.placeDetail?.data?.attributes?.slug;

            return (
              <Link 
                key={place.id} 
                href={slug ? `/place-detail/${slug}` : '#'}
                className="cc-place-card block"
              >
                <div className="cc-pc-img">
                  <div 
                    className="cc-pc-img-bg" 
                    style={{ backgroundImage: `url('${placeImg}')` }} 
                  />
                  <div className="cc-pc-img-grad"></div>
                  <span className="cc-pc-cat-tag">{category}</span>
                </div>
                <div className="cc-pc-body">
                  {/* <div className="cc-pc-type">Government</div> */}
                  <div className="cc-pc-name">{attr.name}</div>
                  <div className="cc-pc-loc">📍 {cityName}</div>
                  {/* <span className="bookable-badge">✓ Bookable</span> */}
                  <div className="cc-pc-foot">
                    <span className="cc-pc-fee">starting from ₹50</span>
                    <span className="cc-pc-btn">
                      {slug ? 'Book →' : 'No Details'}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
          {filteredPlaces.length === 0 && (
            <div className="col-span-full py-10 text-center text-gray-500 italic">
              No {activeCategory.toLowerCase()} found in this city.
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="cc-foot">
          <div className="cc-foot-info">
            Showing <b>{filteredPlaces.length} of {places.length}</b> bookable places in {cityName}
          </div>
          <button className="cc-explore-btn">Explore All Places →</button>
        </div>
      </div>
    </div>
  );
};

export default CityDetails;