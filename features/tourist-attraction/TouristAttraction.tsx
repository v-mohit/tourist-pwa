'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const categoryNameParam = searchParams.get('categoryName');

  const imgUrlBase = process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL || '';

  // Extract places from data
  const places: Place[] = data?.places?.data || [];

  // Extract category info if filtered
  const categoryNameFromApi = data?.category?.data?.attributes?.Name;
  const categoryNameFromPlaces = useMemo(() => {
    if (!categoryId) return undefined;
    for (const p of places) {
      const cats = p?.attributes?.categories?.data || [];
      const match = cats.find((c) => c?.id?.toString() === categoryId.toString());
      if (match?.attributes?.Name) return match.attributes.Name;
    }
    return undefined;
  }, [categoryId, places]);

  const categoryName = categoryNameFromApi || categoryNameFromPlaces;

  // Extract seeAllPlace header info for base design
  const seeAllHeader = data?.seeAllPlace?.data?.attributes?.content?.find(
    (c: any) => c.__typename === "ComponentPlacePlaceHeader"
  );

  const title = categoryName ? `${categoryName}` : (seeAllHeader?.title1 || "Explore Rajasthan");
  const subtitle = categoryName ? `Discover the best ${categoryName} in Rajasthan.` : (seeAllHeader?.title2 || "Discover monuments, wildlife, and cultural heritage.");

  const headerRawUrl = seeAllHeader?.image?.data?.attributes?.url || '';
  const headerBg = headerRawUrl
    ? (headerRawUrl.startsWith('http')
      ? headerRawUrl
      : `${imgUrlBase}${headerRawUrl}`)
    : 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200';

  // Filter places based on categoryId + search query
  const filteredPlaces = useMemo(() => {
    return places.filter(place => {
      if (categoryId) {
        const cats = place?.attributes?.categories?.data || [];
        const hasCategory = cats.some((c) => c?.id?.toString() === categoryId.toString());
        if (!hasCategory) return false;
      } else if (categoryNameParam) {
        const wanted = categoryNameParam.toLowerCase().trim();
        const cats = place?.attributes?.categories?.data || [];
        const hasCategoryName = cats.some(
          (c) => (c?.attributes?.Name || "").toLowerCase().trim() === wanted,
        );
        if (!hasCategoryName) return false;
      }
      const name = place.attributes.name.toLowerCase();
      const city = place.attributes.city?.data?.attributes?.name?.toLowerCase() || '';
      const query = searchTerm.toLowerCase();
      return name.includes(query) || city.includes(query);
    });
  }, [places, searchTerm, categoryId, categoryNameParam]);

  return (
    <div className="sa-panel" style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Header */}
      <Link href="/" className="see-all-back">
        ← Back to Home
      </Link>
      <div className="sa-header">
        <div className="sa-header-bg" style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('${headerBg}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '240px',
          padding: '40px max(22px, 5vw) 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}>

          <div className="sa-header-body">
            <p style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
              ✦ {categoryName || 'Explore'}
            </p>
            <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', color: '#fff' }}>{title}</h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginTop: '6px', maxWidth: '600px' }}>{subtitle}</p>
          </div>
          <div className="sa-header-count" style={{ position: 'absolute', bottom: '24px', right: 'max(22px, 5vw)' }}>
            {places.length} Items Found
          </div>
        </div>

        {/* Filter bar */}
        <div className="sa-filters">
          <div className="sa-search-wrap">
            <span className="sa-search-icon">🔍</span>
            <input
              className="sa-search"
              type="text"
              placeholder={`Search ${categoryName || 'places'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Results Bar */}
      <div className="sa-results-bar">
        <span className="sa-results-count">
          Showing {filteredPlaces.length} results
        </span>
        <div className="sa-view-toggle">
          <button
            className={`sa-vt-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >⊞</button>
          <button
            className={`sa-vt-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >☰</button>
        </div>
      </div>

      {/* Grid */}
      <div className={`sa-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map((place: Place, idx: number) => {
            const attr = place.attributes;
            const placeRawUrl = attr.images?.data?.[0]?.attributes?.url || '';
            const img = placeRawUrl
              ? (placeRawUrl.startsWith('http')
                ? placeRawUrl
                : `${imgUrlBase}${placeRawUrl}`)
              : 'https://images.unsplash.com/photo-1477587458883-47145ed31f5e?w=500';

            const cityName = attr.city?.data?.attributes?.name || "Rajasthan";
            const firstCat = attr.categories?.data?.[0]?.attributes?.Name || "Attraction";
            const slug = attr.placeDetail?.data?.attributes?.slug || place.id || `place-${idx}`;
            const reactKey = `${slug}-${place.id || idx}`;

            return (
              <Link
                key={reactKey}
                href={`/place-detail/${slug}`}
                className="sa-card"
                style={{ textDecoration: 'none' }}
              >
                <div className="sa-img">
                  <div className="sa-img-inner" style={{ backgroundImage: `url('${img}')` }}></div>
                  <div className="sa-card-top">
                    <span className="sa-tag">{firstCat}</span>
                    <span className="sa-rating-badge">⭐ {attr.popularity || '4.5'}</span>
                  </div>
                  <div className="sa-img-foot">
                    <div className="sa-name">{attr.name}</div>
                    <div className="sa-nickname">
                      <img src="/icons/google-maps.png" width={12} height={12} alt="Location" className="loc-ico mr-1" />
                      {cityName}
                    </div>
                  </div>
                </div>
                <div className="sa-body">
                  <div className="sa-highlights">
                    <span className="sa-hl">✦ Must Visit</span>
                    <span className="sa-hl">✦ {firstCat}</span>
                    <span className="sa-hl">✦ {cityName}</span>
                  </div>
                  <div className="sa-card-foot">
                    <span className="sa-season">📅 Open All Year</span>
                    <span className="sa-region-tag">{cityName}</span>
                  </div>
                  <button className="sa-btn">Book Tickets →</button>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="sa-empty">
            <div className="sa-empty-ico">🔍</div>
            <div className="sa-empty-msg">No results found</div>
            <div className="sa-empty-sub">Try searching for something else</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TouristAttraction;