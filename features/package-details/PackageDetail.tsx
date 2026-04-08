'use client';

import React from 'react';
import Link from 'next/link';

const PackageDetail = ({ data }: any) => {
  const pkg = data?.packageDetails?.data?.[0]?.attributes;
  if (!pkg) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-4xl text-[var(--gold)]">⏳</div>
        <h2 className="text-2xl font-bold">Package Not Found</h2>
        <Link href="/" className="btn-p">Go Home</Link>
      </div>
    );
  }

  const images = pkg.images?.data || [];
  const mainImage = images[0]?.attributes?.url
    ? `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${images[0].attributes.url}`
    : null;

  const overviewText = pkg.overview || pkg.description || '';

  // Helper to extract price from text using regex
  const extractPrice = (label: string) => {
    const regex = new RegExp(`${label}-(\\d+)`, 'i');
    const match = overviewText.match(regex);
    return match ? match[1] : null;
  };

  const prices = {
    indianCitizen: extractPrice('Indian Citizen'),
    indianStudent: extractPrice('Indian Student'),
    foreignerCitizen: extractPrice('Foreigner Citizen'),
    foreignerStudent: extractPrice('Foreigner Student'),
  };

  const rawGroups = pkg.places;
  const groups = Array.isArray(rawGroups) ? rawGroups : (rawGroups ? [rawGroups] : []);

  // Calculate total places count
  const totalPlaces = groups.reduce((acc: number, group: any) => acc + (group.places?.data?.length || 0), 0);
  const totalDays = pkg.days || null;

  // Extract dynamic categories from the places within this specific package
  const allCategories = new Set<string>();
  groups.forEach((group: any) => {
    group.places?.data?.forEach((place: any) => {
      place.attributes?.categories?.data?.forEach((cat: any) => {
        if (cat.attributes?.Name) allCategories.add(cat.attributes.Name);
      });
    });
  });
  const dynamicCats = Array.from(allCategories);

  return (
    <div className="pd-panel">
      {/* ── HERO SECTION ── */}
      {mainImage && (
        <div className="pd-hero-wrap">
          <div
            className="pd-hero-main"
            style={{ backgroundImage: `url('${mainImage}')`, width: '100%', height: '320px' }}
          />
          <div className="pd-hero-gallery">
            {images.slice(1, 5).map((img: any, i: number) => (
              <div
                key={i}
                className="pd-gallery-img"
                style={{
                  backgroundImage: `url('${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${img.attributes.url}')`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── CONTENT AREA ── */}
      <div className="pkg-detail">
        {/* ── BREADCRUMB ── */}
        <div className="breadcrumb mt-4">
          <Link href="/">Explore</Link>
          <span>›</span>
          <Link href="/tourist-attraction?tab=packages">Packages</Link>
          <span>›</span>
          <span>{pkg.name}</span>
        </div>

        {/* Overview Section */}
        <div className="pkg-overview">
          <h1 className="mt-8 uppercase text-[10px] tracking-[2px] text-[var(--mu)] font-bold mb-4">Overview</h1>
          <div
            className="pkg-desc"
            dangerouslySetInnerHTML={{ __html: overviewText }}
          />

          {/* Pricing Box - Displays only if prices are extracted */}
          {(prices.indianCitizen || prices.indianStudent || prices.foreignerCitizen || prices.foreignerStudent) && (
            <div className="pkg-pricing-box">
              <div className="pkg-pricing-title">PACKAGE PRICING</div>
              {prices.indianCitizen && <div className="pkg-pricing-row"><span>Indian Citizen</span><span>₹{prices.indianCitizen}</span></div>}
              {prices.indianStudent && <div className="pkg-pricing-row"><span>Indian Student</span><span>₹{prices.indianStudent}</span></div>}
              {prices.foreignerCitizen && <div className="pkg-pricing-row"><span>Foreigner Citizen</span><span>₹{prices.foreignerCitizen}</span></div>}
              {prices.foreignerStudent && <div className="pkg-pricing-row"><span>Foreigner Student</span><span>₹{prices.foreignerStudent}</span></div>}
            </div>
          )}
        </div>

        {/* Dynamic Places Sections */}
        {groups.map((group: any, gIdx: number) => {
          const groupPlaces = group.places?.data || [];
          if (groupPlaces.length === 0) return null;

          return (
            <div key={gIdx} className="pkg-places mt-10">
              <div className="pkg-places-header">
                <h2>{group.title || pkg.name}</h2>
                <div className="flex gap-2">
                  {gIdx === 0 && totalDays && <span className="pkg-places-count">📅 {totalDays} Days</span>}
                  <span className="pkg-places-count">{groupPlaces.length} Places</span>
                </div>
              </div>

              <div className="places-grid">
                {groupPlaces.map((place: any, pIdx: number) => {
                  const pAttr = place.attributes;
                  const imgUrl = pAttr.images?.data?.[0]?.attributes?.url;
                  const pImg = imgUrl ? `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${imgUrl}` : null;

                  const pCats = pAttr.categories?.data || [];
                  const placeName = pAttr.name;
                  const targetSlug = pAttr.placeDetail?.data?.attributes?.slug;

                  if (!placeName) return null;

                  return (
                    <Link
                      key={pIdx}
                      href={targetSlug ? `/place-detail/${targetSlug}` : '#'}
                      className={`place-card block no-underline decoration-transparent ${!targetSlug ? 'pointer-events-none' : ''}`}
                      style={{ cursor: targetSlug ? 'pointer' : 'default' }}
                    >
                      {pImg && (
                        <div className="place-img">
                          <img src={pImg} alt={placeName} />
                          {pCats[0] && (
                            <div style={{ position: 'absolute', top: 12, left: 12 }}>
                              <span className="tag tg text-[8px] px-2 py-0.5" style={{ fontSize: 8 }}>
                                🏆 {pCats[0].attributes?.Name}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="place-body">
                        <h3 className="place-name uppercase">{placeName}</h3>
                        <div className="place-loc">📍 {pAttr.city?.data?.attributes?.name || ''}</div>
                        <div className="mb-4">
                          {pCats.slice(0, 2).map((c: any, i: number) => (
                            <span key={i} className="text-[9px] text-[var(--mu)] bg-[var(--sand)] px-2 py-0.5 rounded-full mr-1">
                              {c.attributes?.Name}
                            </span>
                          ))}
                        </div>
                        {targetSlug && (
                          <button className="place-btn">
                            View More
                          </button>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Dynamic Categories Section */}
        {dynamicCats.length > 0 && (
          <div className="categories-section mt-12 pb-4">
            <h3 className="cat-title">Package Categories</h3>
            <div className="cat-links">
              {dynamicCats.map(cat => (
                <div key={cat} className="cat-link">{cat}</div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Footer / Social Tagline */}
        <div className="pkg-footer mt-16 text-center border-t-2 border-[var(--bdr)] pt-12">
          <p className="footer-tagline italic text-[var(--mu)]">
            Powered by Rajasthan Tourism & OBMS Portal
          </p>
          <div className="footer-bottom mt-8">
            <p className="text-[11px] text-[var(--mu)]">Copyright © 2025 Rajasthan Tourism. All rights reserved.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PackageDetail;