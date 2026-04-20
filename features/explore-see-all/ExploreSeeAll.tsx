'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

const ExploreSeeAll = ({ cityData }: any) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const imgUrl = process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL || '';

  // Process cities from graphQL data
  const cities = useMemo(() => {
    if (!cityData?.cities?.data) return [];

    return cityData.cities.data.map((item: any, index: number) => {
      const attr = item.attributes;
      const rawUrl = attr.image?.data?.attributes?.url || '';
      const imageUrl = rawUrl
        ? (rawUrl.startsWith('http')
          ? rawUrl
          : `${imgUrl}${rawUrl}`)
        : 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=600&auto=format&fit=crop&q=80';

      // Dummy data for missing fields to match premium UI reqs
      const regions = ['Eastern', 'Western', 'Northern', 'Southern', 'Central'];
      const dummyRegion = regions[index % regions.length];
      const dummyRating = (4.5 + Math.random() * 0.5).toFixed(1);
      const dummyTag = index % 3 === 0 ? '🏆 UNESCO' : (index % 2 === 0 ? '⭐ Popular' : '💎 Hidden Gem');
      const dummyNickname = index % 2 === 0 ? 'Pink City' : 'City of Lakes';
      const dummyDesc = `Explore the historical beauty and cultural heritage of ${attr.name}. A must-visit destination in the heart of Rajasthan featuring stunning architecture and vibrant local traditions.`;
      const dummyHighlights = ['Forts', 'Palaces', 'Local Food'];
      const dummyIcon = index % 2 === 0 ? '🏯' : '🌊';

      return {
        id: item.id || index.toString(),
        name: attr.name,
        slug: attr.cityDetail?.data?.attributes?.slug,
        img: imageUrl,
        tag: dummyTag,
        rating: dummyRating,
        nickname: dummyNickname,
        desc: dummyDesc,
        region: dummyRegion,
        highlights: dummyHighlights,
        icon: dummyIcon,
        time: 'All Year'
      };
    });
  }, [cityData, imgUrl]);

  // Filter logic
  const filteredCities = useMemo(() => {
    return cities.filter((city: any) => {
      const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.nickname.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = selectedRegion === 'all' || city.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }, [cities, searchTerm, selectedRegion]);

  const regions = ['all', 'Eastern', 'Western', 'Northern', 'Southern', 'Central'];

  return (
    <div className="sa-panel" style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Header */}
      <Link href="/" className="see-all-back">
        ← Back to Home
      </Link>
      <div className="sa-header">
        <div className="sa-header-bg">
          <div className="sa-header-body">
            <h2>All <em>Cities</em></h2>
            <p>Explore every destination in Rajasthan</p>
          </div>
          <div className="sa-header-count">{cities.length} Cities</div>
        </div>

        {/* Filter bar */}
        <div className="sa-filters">
          <div className="sa-search-wrap">
            <span className="sa-search-icon">🔍</span>
            <input
              className="sa-search"
              type="text"
              placeholder="Search cities, nicknames..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="sa-region-filters">
            {regions.map((region) => (
              <button
                key={region}
                className={`sa-rfil ${selectedRegion === region ? 'active' : ''}`}
                onClick={() => setSelectedRegion(region)}
              >
                {region === 'all' ? 'All Regions' : region}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Bar */}
      <div className="sa-results-bar">
        <span className="sa-results-count">
          Showing {filteredCities.length} of {cities.length} cities
        </span>
        <div className="sa-view-toggle">
          <button
            className={`sa-vt-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid view"
          >
            ⊞
          </button>
          <button
            className={`sa-vt-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List view"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className={`sa-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
        {filteredCities.length > 0 ? (
          filteredCities.map((city: any) => (
            <Link
              key={city.id}
              href={`/citydetail/${city.slug}`}
              className="sa-card"
              style={{ textDecoration: 'none' }}
            >
              <div className="sa-img">
                <div className="sa-img-inner" style={{ backgroundImage: `url('${city.img}')` }}></div>
                <div className="sa-card-top">
                  <span className="sa-tag">{city.tag}</span>
                  <span className="sa-rating-badge">⭐ {city.rating}</span>
                </div>
                <div className="sa-img-foot">
                  <span className="sa-city-icon">{city.icon}</span>
                  <div className="sa-name">{city.name}</div>
                  <div className="sa-nickname">{city.nickname}</div>
                </div>
              </div>
              <div className="sa-body">
                <div className="sa-desc">{city.desc}</div>
                <div className="sa-highlights">
                  {city.highlights.map((h: string, i: number) => (
                    <span key={i} className="sa-hl">✦ {h}</span>
                  ))}
                </div>
                <div className="sa-card-foot">
                  <span className="sa-season">📅 {city.time}</span>
                  <span className="sa-region-tag">{city.region}</span>
                </div>
                <button className="sa-btn">Explore {city.name} →</button>
              </div>
            </Link>
          ))
        ) : (
          <div className="sa-empty">
            <div className="sa-empty-ico">🗺</div>
            <div className="sa-empty-msg">No cities found</div>
            <div className="sa-empty-sub">Try a different search or filter</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreSeeAll;