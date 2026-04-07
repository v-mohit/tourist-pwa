'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface Place {
  id: string;
  attributes: {
    name: string;
    popularity: number;
    city?: {
      data?: {
        attributes?: {
          name: string;
        };
      };
    };
    categories?: {
      data: Array<{
        id: string;
        attributes: {
          Name: string;
        };
      }>;
    };
    images?: {
      data: Array<{
        attributes: {
          url: string;
        };
      }>;
    };
    placeDetail?: {
      data?: {
        attributes?: {
          slug: string;
          content?: Array<any>;
        };
      };
    };
  };
}

interface TouristAttractionProps {
  data: any;
}

const TouristAttraction: React.FC<TouristAttractionProps> = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Extract places from data
  const places: Place[] = data?.places?.data || [];
  
  // Extract seeAllPlace header info
  const seeAllHeader = data?.seeAllPlace?.data?.attributes?.content?.find(
    (c: any) => c.__typename === "ComponentPlacePlaceHeader"
  );
  
  const title = seeAllHeader?.title1 || "Explore Rajasthan";
  const subtitle = seeAllHeader?.title2 || "Discover the best monuments, wildlife, and cultural sites.";
  const headerBg = seeAllHeader?.image?.data?.attributes?.url 
    ? `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${seeAllHeader.image.data.attributes.url}`
    : 'var(--sf)';

  // Filter places based on search query
  const filteredPlaces = useMemo(() => {
    return places.filter(place => {
      const name = place.attributes.name.toLowerCase();
      const city = place.attributes.city?.data?.attributes?.name?.toLowerCase() || '';
      const query = searchQuery.toLowerCase();
      return name.includes(query) || city.includes(query);
    });
  }, [places, searchQuery]);

  return (
    <div className="sa-panel" style={{ minHeight: '100vh', position: 'relative', transform: 'none' }}>
      {/* ── HEADER ── */}
      <div 
        className="sa-header" 
        style={{ 
          background: headerBg.startsWith('var') ? headerBg : `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('${headerBg}') center/cover`,
          height: '240px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '20px max(22px, 5vw)',
          position: 'relative'
        }}
      >
        <Link href="/" className="sa-close" style={{ position: 'absolute', top: '20px', left: 'max(22px, 5vw)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
          ✕
        </Link>
        <div className="sa-header-body" style={{ marginTop: 'auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', marginBottom: '8px' }}>{title}</h2>
          <p style={{ fontSize: '14px', opacity: 0.9, maxWidth: '600px' }}>{subtitle}</p>
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div className="sa-filters">
        <div className="sa-search-wrap">
          <input 
            className="sa-search" 
            type="text" 
            placeholder="🔍 Search places…" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ── GRID ── */}
      <div className="sa-grid">
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map((place) => {
            const attr = place.attributes;
            const imgUrl = attr.images?.data?.[0]?.attributes?.url
              ? `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${attr.images.data[0].attributes.url}`
              : 'https://images.unsplash.com/photo-1477587458883-47145ed31f5e?w=500';
            
            const cityName = attr.city?.data?.attributes?.name || "Rajasthan";
            const categoryName = attr.categories?.data?.[0]?.attributes?.Name || "Attraction";
            const slug = attr.placeDetail?.data?.attributes?.slug || place.id;
            
            // Extract timing and fee from content if available
            const content = attr.placeDetail?.data?.attributes?.content || [];
            
            const timeBlock = content.find(
              (c: any) => c.__typename === "ComponentPlaceDetailPlaceTime"
            );
            const time = timeBlock?.card?.[0]?.content?.[0]?.value || "9:00 AM - 5:00 PM";

            const ticketBlock = content.find(
              (c: any) => c.__typename === "ComponentPlaceDetailPlacetickets"
            );
            const fee = ticketBlock?.card?.[0]?.content?.find(
              (c: any) => c.name === "Indian Adult"
            )?.value || "100";

            return (
              <Link key={place.id} href={`/place-detail/${slug}`} className="sa-card" style={{ textDecoration: 'none' }}>
                <div className="sa-img" style={{ backgroundImage: `url('${imgUrl}')` }}>
                  <div className="sa-img-grad"></div>
                  <div className="sa-tag">{categoryName}</div>
                </div>
                <div className="sa-body">
                  <div className="sa-cat">{categoryName}</div>
                  <h3 className="sa-name">{attr.name}</h3>
                  <div className="sa-loc">📍 {cityName}</div>
                  <div className="sa-row">
                    <span className="sa-rating">⭐ {attr.popularity || '4.5'}</span>
                    <span className="sa-entry">₹{fee}</span>
                    <span className="sa-time">⏰ {time}</span>
                  </div>
                  <button className="sa-btn">View Details →</button>
                </div>
              </Link>
            );
          })
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: 'var(--mu)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3>No matches found</h3>
            <p>Try searching for a different name or city.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TouristAttraction;