'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

const PackageSeeAll = ({ packageData }: any) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const imgUrl = process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL || '';

  // Process packages from graphQL data
  const packages = useMemo(() => {
    const rawList = packageData?.data?.topPackage?.data?.attributes?.package || 
                    packageData?.topPackage?.data?.attributes?.package || 
                    [];

    return rawList.map((item: any, index: number) => {
      const pkgAttr = item?.package?.data?.attributes;
      if (!pkgAttr) return null;

      const rawImgUrl = pkgAttr.image?.data?.attributes?.url || '';
      const imageUrl = rawImgUrl
        ? (rawImgUrl.startsWith('http')
          ? rawImgUrl
          : `${imgUrl}${rawImgUrl}`)
        : 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=600&auto=format&fit=crop&q=80';

      const city = pkgAttr.cityDetail?.data?.attributes?.name || 'Multiple Cities';
      const price = pkgAttr.price || 150;
      const rating = pkgAttr.rating || '4.8';
      const slug = pkgAttr.package_detail?.data?.attributes?.slug;
      const days = pkgAttr.days;

      // Dummy data for missing fields to match premium UI reqs
      const dummyInfos = [
        '🏯 10 Places', 
        days ? `🕐 ${days} ${days > 1 ? 'Days' : 'Day'}` : '🕐 Full Day', 
        '🚌 Transport Incl.', 
        '🎟 Entry Tickets'
      ];
      const dummyTag = index % 3 === 0 ? 'COMPOSITE' : (index % 2 === 0 ? 'PREMIUM' : 'HERITAGE');
      const dummyDesc = `Experience the best of Rajasthan with our curated ${pkgAttr.name}. This package includes visits to major landmarks, guided tours, and comfortable local transport arrangements.`;
      
      return {
        id: slug || index.toString(),
        name: pkgAttr.name,
        city: city,
        price: `₹${price}`,
        rating: `⭐ ${rating}`,
        img: imageUrl,
        tag: dummyTag,
        desc: dummyDesc,
        infos: dummyInfos,
        slug: slug
      };
    }).filter(Boolean);
  }, [packageData, imgUrl]);

  // Unique cities for filter
  const cities = useMemo(() => {
    const citySet = new Set<string>();
    packages.forEach((pkg: any) => citySet.add(pkg.city));
    return ['all', ...Array.from(citySet)];
  }, [packages]);

  // Filter logic
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg: any) => {
      const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.desc.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = selectedCity === 'all' || pkg.city === selectedCity;
      return matchesSearch && matchesCity;
    });
  }, [packages, searchTerm, selectedCity]);

  return (
    <div className="sa-panel sa-panel--page" style={{ background: 'var(--ch)', color: '#fff' }}>
      {/* Header */}
      <div className="sa-header" style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(24, 18, 14, 0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="sa-header-bg" style={{ background: 'transparent' }}>
          <Link href="/" className="sa-close">
            ✕
          </Link>
          <div className="sa-header-body">
            <h2>Darshan <em>Packages</em></h2>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>Explore curated Rajasthan travel experiences</p>
          </div>
          <div className="sa-header-count" style={{ background: 'rgba(212,160,23,.1)', borderColor: 'rgba(212,160,23,.3)' }}>
            {packages.length} Packages
          </div>
        </div>

        {/* Filter bar */}
        <div className="sa-filters" style={{ background: 'transparent', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: 'none' }}>
          <div className="sa-search-wrap">
            <span className="sa-search-icon" style={{ color: 'rgba(255,255,255,0.5)' }}>🔍</span>
            <input
              className="sa-search"
              type="text"
              placeholder="Search packages..."
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="sa-region-filters">
            {cities.map((city) => (
              <button
                key={city}
                className={`sa-rfil ${selectedCity === city ? 'active' : ''}`}
                style={selectedCity !== city ? { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' } : {}}
                onClick={() => setSelectedCity(city)}
              >
                {city === 'all' ? 'All Cities' : city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Bar */}
      <div className="sa-results-bar" style={{ marginTop: '20px' }}>
        <span className="sa-results-count" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Showing {filteredPackages.length} of {packages.length} curated packages
        </span>
        <div className="sa-view-toggle">
          <button
            className={`sa-vt-btn ${viewMode === 'grid' ? 'active' : ''}`}
            style={viewMode !== 'grid' ? { border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' } : {}}
            onClick={() => setViewMode('grid')}
          >
            ⊞
          </button>
          <button
            className={`sa-vt-btn ${viewMode === 'list' ? 'active' : ''}`}
            style={viewMode !== 'list' ? { border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' } : {}}
            onClick={() => setViewMode('list')}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className={`sa-grid ${viewMode === 'list' ? 'list-view' : ''}`} style={{ paddingBottom: '100px' }}>
        {filteredPackages.length > 0 ? (
          filteredPackages.map((pkg: any) => (
            <Link
              key={pkg.id}
              href={pkg.slug ? `/package-detail?slug=${pkg.slug}` : '#'}
              className="pkg-card block no-underline"
            >
              {/* Image */}
              <div className="pkg-img">
                <div className="dimg" style={{ backgroundImage: `url('${pkg.img}')` }} />
                <div className="pkg-grad" />
                <div className="pkg-rating">{pkg.rating}</div>
                <div className="pkg-badge">
                  <div className="amt">{pkg.price}</div>
                  <div className="per">per person</div>
                </div>
              </div>

              {/* Body */}
              <div className="pkg-body">
                <h3>{pkg.name}</h3>
                <div className="pkg-info" style={{ marginTop: '12px' }}>
                  <div className="pkg-ii">
                    <img src="/icons/google-maps.png" width={12} height={12} alt="Location" className="loc-ico mr-1" />
                    {pkg.city}
                  </div>
                  {pkg.infos.slice(1).map((info: string) => (
                    <div key={info} className="pkg-ii">{info}</div>
                  ))}
                </div>
                <div className="pkg-foot" style={{ marginTop: '16px' }}>
                  <span className="tag tg" style={{ fontSize: 9 }}>{pkg.tag}</span>
                  <span className="btn-s">Book →</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="sa-no-results">
            <div className="sa-no-results-icon">🎫</div>
            <div style={{ color: '#fff', fontSize: '18px', fontWeight: 600 }}>No packages found</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>Try adjusting your search or city filters</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageSeeAll;
