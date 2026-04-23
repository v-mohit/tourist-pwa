'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BookNowButton from '../booking/components/BookNowButton';

interface CityDetailsProps {
  cityDetailData: any;
}

const CityDetails = ({ cityDetailData }: CityDetailsProps) => {
  const router = useRouter();
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

  // Dynamically derive categories from places
  const categories = React.useMemo(() => {
    const catSet = new Set<string>();
    places.forEach((p: any) => {
      p.attributes.categories?.data?.forEach((c: any) => {
        if (c.attributes.Name) catSet.add(c.attributes.Name);
      });
    });
    return ['All', ...Array.from(catSet)].sort((a, b) => {
      if (a === 'All') return -1;
      if (b === 'All') return 1;
      return a.localeCompare(b);
    });
  }, [places]);

  const getCatIcon = (cat: string) => {
    const lower = cat.toLowerCase();
    if (lower === 'all') return '';
    if (lower.includes('museum')) return '🏛 ';
    if (lower.includes('wildlife')) return '🌿 ';
    if (lower.includes('monument')) return '🏯 ';
    if (lower.includes('park')) return '🌳 ';
    if (lower.includes('cafeteria')) return '☕ ';
    if (lower.includes('hotel') || lower.includes('rtdc')) return '🏨 ';
    if (lower.includes('fort')) return '🏰 ';
    return '✦ ';
  };

  // Categorize places for stats
  const museums = places.filter((p: any) =>
    p.attributes.categories?.data?.some((c: any) => c.attributes.Name.toLowerCase().includes('museum'))
  );
  const wildlife = places.filter((p: any) =>
    p.attributes.categories?.data?.some((c: any) => c.attributes.Name.toLowerCase().includes('wildlife'))
  );

  const filteredPlaces = activeCategory === 'All'
    ? places
    : places.filter((p: any) =>
      p.attributes.categories?.data?.some((c: any) =>
        c.attributes.Name === activeCategory
      )
    );

  const reach = city.howToReachHere || {};

  return (
    <div className="page-bg">
      {/* <span className="demo-label">OBMS · Explore City</span> */}
      <button
        type="button"
        onClick={() => (window.history.length > 1 ? router.back() : router.push('/'))}
        className="see-all-back"
        style={{ cursor: 'pointer', background: 'none', border: 'none', borderBottom: '1px solid currentColor', paddingLeft: '5px', paddingBottom: '2px' }}
      >
        ← Back
      </button>
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
              <span className="cc-meta-pill">
                <img src="/icons/google-maps.png" width={12} height={12} alt="Location" className="loc-ico mr-1" />
                Rajasthan
              </span>
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
                    <span className="cc-reach-ico">
                      <img src="/icons/google-maps.png" width={14} height={14} alt="Location" className="loc-ico" />
                    </span>{' '}
                    Well connected to major cities
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
            <div className="cc-places-title">
              <img src="/icons/google-maps.png" width={16} height={16} alt="Location" className="loc-ico mr-1" />
              Places to Visit &amp; Book
            </div>
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
              {getCatIcon(cat)}{cat}
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
            const content = attr.placeDetail?.data?.attributes?.content || [];
            const ticketsBlock = content.find((c: any) => c.__typename === 'ComponentPlaceDetailPlacetickets');

            let generalStudent = '';
            let generalIndian = '';

            if (ticketsBlock) {
              // Try to find the primary ticket card (General, Entry Fee, Gypsy, etc.)
              const ticketCard = ticketsBlock.card?.find((card: any) => {
                const title = card.title?.toLowerCase() || '';
                return title.includes('general') || title.includes('entry') || title.includes('gypsy') || title.includes('amount');
              }) || ticketsBlock.card?.[0]; // Fallback to first card if no keyword matches

              if (ticketCard) {
                // Find Student price
                generalStudent = ticketCard.content?.find((c: any) =>
                  c.name.toLowerCase().includes('student')
                )?.value || '';

                // Find Indian/Adult price as fallback
                generalIndian = ticketCard.content?.find((c: any) => {
                  const n = c.name.toLowerCase();
                  return n.includes('indian') || n.includes('adult');
                })?.value || '';
              }
            }
            const displayPrice = (generalStudent || generalIndian)?.trim();
            const formattedPrice = displayPrice ? displayPrice.replace(/[^\d]/g, '') : '';
            return (
              <div
                key={place.id}
                className="cc-place-card block relative"
              >
                {/* Main clickable area linking to details */}
                <Link
                  href={slug ? `/place-detail/${slug}` : '#'}
                  className="absolute inset-0 z-0"
                  aria-label={`View details for ${attr.name}`}
                />

                <div className="cc-pc-img">
                  <div
                    className="cc-pc-img-bg"
                    style={{ backgroundImage: `url('${placeImg}')` }}
                  />
                  <div className="cc-pc-img-grad"></div>
                  <span className="cc-pc-cat-tag">{category}</span>
                </div>
                <div className="cc-pc-body relative z-10 pointer-events-none">
                  {/* <div className="cc-pc-type">Government</div> */}
                  <div className="cc-pc-name">{attr.name}</div>
                  <div className="cc-pc-loc">
                    <img src="/icons/google-maps.png" width={12} height={12} alt="Location" className="loc-ico mr-1" />
                    {cityName}
                  </div>
                  {/* <span className="bookable-badge">✓ Bookable</span> */}
                  <div className="cc-pc-foot pointer-events-auto">
                    <span className="cc-pc-fee">
                      {formattedPrice ? `Starting from ₹${formattedPrice}` : 'Click on book now'}
                    </span>
                    {slug ? (
                      <BookNowButton
                        config={{
                          placeId: attr.obmsId ?? place.id,
                          placeName: attr.name,
                          category: 'inventory',
                          locationId: place.id,
                        }}
                        label="Book →"
                        className="cc-pc-btn"
                      />
                    ) : (
                      <span className="cc-pc-btn opacity-50 cursor-not-allowed">
                        No Details
                      </span>
                    )}
                  </div>
                </div>
              </div>
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