'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BookNowButton from "@/features/booking/components/BookNowButton";

const PackageSeeAll = ({ packageData }: any) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
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
        : null;

      const city = pkgAttr.cityDetail?.data?.attributes?.name || '';
      const price = pkgAttr.price || 150;
      const rating = pkgAttr.rating || '4.8';
      const slug = pkgAttr.package_detail?.data?.attributes?.slug;
      const days = pkgAttr.package_detail?.data?.attributes?.days || "Valid for 2 days";
      const isBookable = pkgAttr.package_detail?.data?.attributes?.bookable;
      const locationId = pkgAttr.package_detail?.data?.id;

      // Aligned with PackagesSection.tsx
      const infos = [
        `📅 ${days}`,
        "🕐 Full Day",
        "🚌 Transport not Incl.",
        "🎟 Entry Tickets",
      ];
      const dummyDesc = `Experience the best of Rajasthan with our curated ${pkgAttr.name}. This package includes visits to major landmarks, guided tours, and comfortable local transport arrangements.`;

      return {
        id: slug || index.toString(),
        name: pkgAttr.name,
        city: city,
        price: `₹${price}`,
        rating: `⭐ ${rating}`,
        img: imageUrl,
        tag: 'COMPOSITE',
        desc: dummyDesc,
        infos: infos,
        slug: slug,
        isBookable,
        locationId
      };
    }).filter(Boolean);
  }, [packageData, imgUrl]);



  // Filter logic
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg: any) => {
      const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.desc.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [packages, searchTerm]);

  return (
    <div className="sa-panel sa-panel--page" style={{ background: 'var(--ch)', color: '#fff' }}>
      {/* Header */}
      <button 
        type="button"
        onClick={() => (window.history.length > 1 ? router.back() : router.push('/'))} 
        className="see-all-back"
        style={{ cursor: 'pointer', background: 'none', border: 'none', borderBottom: '1px solid currentColor', paddingLeft: '5px', paddingBottom: '2px', color: '#fff' }}
      >
        ← Back
      </button>
      <div className="sa-header" style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(24, 18, 14, 0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="sa-header-bg" style={{ background: 'transparent' }}>
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
            <div
              key={pkg.id}
              className="pkg-card block no-underline"
              style={{ cursor: pkg.slug ? 'pointer' : 'default' }}
            >
              <div
                className="block no-underline"
                onClick={() => {
                  if (pkg.slug) {
                    router.push(`/package-detail?slug=${pkg.slug}`);
                  }
                }}
              >
                  {/* Image */}
                  <div className="pkg-img">
                    <div className="dimg" style={{ backgroundImage: `url('${pkg.img}')` }} />
                    <div className="pkg-grad" />
                    {/* <div className="pkg-rating">{pkg.rating}</div> */}
                    <div className="pkg-badge">
                      <div className="amt">{pkg.price}</div>
                      <div className="per">per person</div>
                    </div>
                    {/* Hover Tag */}
                    <div className="pkg-hover-tag">
                      <span className="tag tg" style={{ fontSize: 9 }}>{pkg.tag}</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="pkg-body text-[var(--cw)]">
                    <h3>{pkg.name}</h3>
                    <div className="pkg-info" style={{ marginTop: '12px' }}>
                      {pkg.infos.map((info: string) => (
                        <div key={info} className="pkg-ii">{info}</div>
                      ))}
                    </div>
                    <div className="pkg-foot" style={{ marginTop: '16px' }}>
                      {/* Tag removed from here, now in pkg-img on hover */}
                    </div>
                  </div>
              </div>

              <div className="px-4 pb-4 -mt-2">
                {pkg.locationId ? (
                  <BookNowButton
                    config={{
                      placeId: pkg.locationId,
                      placeName: pkg.name,
                      category: "package",
                      locationId: pkg.locationId,
                    }}
                    disabled={pkg.isBookable === false}
                    label="Book →"
                    className="btn-s"
                  />
                ) : (
                  <span className="btn-s opacity-40">Book →</span>
                )}
              </div>
            </div>
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
