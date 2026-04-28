"use client";
import React, { useState } from 'react';
import Link from 'next/link';

const AsiSeeAll = ({ data }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const places = data?.places?.data || [];
  const deptName = data?.Name || "Archaeological Survey of India";

  const filteredPlaces = places.filter((place: any) => 
    place.attributes.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    place.attributes.city?.data?.attributes?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="sa-page">
      {/* Header */}
      <div className="sa-header">
        <Link href="/" className="sa-back">
          ←
        </Link>
        <div className="sa-header-body">
          <h2>{deptName}</h2>
          <p>{places.length} Protected Sites Onboarded · Rajasthan Tourism</p>
        </div>
      </div>

      {/* Filters */}
      <div className="sa-filters">
        <div className="sa-search-wrap">
          <input 
            className="sa-search" 
            type="text" 
            placeholder="Search monuments or cities..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="sa-grid">
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map((place: any) => {
            const attr = place.attributes;
            const imageUrl = attr.images?.data?.[0]?.attributes?.url 
              ? `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL || ''}${attr.images.data[0].attributes.url}`
              : null;
            
            const cityName = attr.city?.data?.attributes?.name || 'Rajasthan';
            
            // Logic for entry fee and timing (similar to AsiSection but more detailed if possible)
            let timing = "8:00 AM – 6:00 PM";
            let entryFee = "₹50";

            const pdAttr = attr.placeDetail?.data?.attributes;
            const slug = pdAttr?.slug || attr.name?.toLowerCase().replace(/\s+/g, "-");

            const ticketsContent = pdAttr?.content?.find(
              (c: any) => c.__typename === 'ComponentPlaceDetailPlacetickets'
            );

            if (ticketsContent?.card) {
                const feeCard = ticketsContent.card.find((c: any) => 
                  c.title?.toLowerCase().includes('general') || c.title?.toLowerCase().includes('ticket')
                ) || ticketsContent.card[0];

                if (feeCard?.content) {
                  const indianFee = feeCard.content.find((f: any) => 
                    f.name.toLowerCase().includes('indian')
                  );
                  if (indianFee) {
                    entryFee = `₹${indianFee.value}`;
                  } else if (feeCard.content[0]) {
                    entryFee = `₹${feeCard.content[0].value}`;
                  }
                }
            }

            return (
              <Link key={place.id} href={`/place-detail/${slug}`} className="sa-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="sa-img">
                  <div 
                    className="dimg" 
                    style={{ backgroundImage: `url(${imageUrl})` }}
                  ></div>
                  <div className="sa-img-grad"></div>
                  <span className="sa-tag">ASI Site</span>
                  <div className="sa-rating-badge">⭐ 4.8</div>
                </div>
                <div className="sa-body">
                  <div className="sa-cat">Historic Monument</div>
                  <h4 className="sa-name text-ellipsis overflow-hidden">{attr.name}</h4>
                  <div className="sa-loc">
                    <img src="/icons/google-maps.png" width={12} height={12} alt="Location" className="loc-ico mr-1" />
                    {cityName}
                  </div>
                  <div className="sa-desc">
                    Explore one of Rajasthan's nationally protected heritage sites. Managed by the Archaeological Survey of India.
                  </div>
                  <div className="sa-row">
                    <div className="sa-price">{entryFee} <small>/ Indian</small></div>
                    <div className="sa-time">⏰ {timing}</div>
                  </div>
                  <button className="sa-btn">
                     Book Visit →
                  </button>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center">
             <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
             <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--ch)' }}>No sites found</h3>
             <p style={{ color: 'var(--mu)' }}>Try searching with a different term or city.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AsiSeeAll;
