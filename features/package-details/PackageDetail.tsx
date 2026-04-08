'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const PackageDetail = ({ data }: any) => {
  const [activeTab, setActiveTab] = useState('overview');
  
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
  const heroImage = images[0]?.attributes?.url 
    ? `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${images[0].attributes.url}`
    : 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&auto=format&fit=crop&q=80';

  const placesToVisit = pkg.places || [];

  return (
    <div className="pd-panel">
      {/* Back Button / Navigation */}
      <Link href="/" className="pd-close no-underline flex items-center gap-2">
        <span>←</span> Back to Experiences
      </Link>

      {/* Hero Section */}
      <div className="pd-hero-wrap">
        <div 
          className="pd-hero-main" 
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="pd-hero-gallery">
          {[1, 2, 3, 4].map((i) => {
            const imgUrl = images[i]?.attributes?.url;
            return (
              <div 
                key={i} 
                className="pd-gallery-img" 
                style={{ 
                  backgroundImage: `url('${imgUrl ? process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL + imgUrl : 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=400&auto=format&fit=crop&q=60'}')` 
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="pd-content">
        <div className="pd-left">
          {/* Header Info */}
          <div className="pd-tag">EXPERIENCE PACKAGE</div>
          <h1 className="pd-title">{pkg.name}</h1>
          <div className="pd-loc">📍 Rajasthan Explorer • {pkg.days || '4 Days'} Duration</div>

          <div className="pd-meta-row">
            <div className="pd-meta-badge">⭐ 4.9 (120+ Reviews)</div>
            <div className="pd-meta-badge">🚌 Transport Included</div>
            <div className="pd-meta-badge">🏨 4-Star Stay</div>
            <div className="pd-meta-badge">🎟 Entry Tickets</div>
          </div>

          {/* Tabs */}
          <div className="pd-tabs">
            <button 
              className={`pd-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`pd-tab ${activeTab === 'itinerary' ? 'active' : ''}`}
              onClick={() => setActiveTab('itinerary')}
            >
              Itinerary
            </button>
            <button 
              className={`pd-tab ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </div>

          {/* Tab Content: Overview */}
          {activeTab === 'overview' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="pd-desc">
                {pkg.overview || pkg.description || "Embark on an unforgettable journey through Rajasthan's golden sands and royal heritage. This curated experience takes you through majestic forts, vibrant markets, and serene lakes, offering a perfect blend of history and culture."}
              </div>

              <h3 className="pd-section-title">Experience Highlights</h3>
              <div className="pd-facts">
                <div className="pd-fact-item">✨ Guided Tour of Jaisalmer Fort</div>
                <div className="pd-fact-item">🐫 Camel Safari at Sam Sand Dunes</div>
                <div className="pd-fact-item">🎵 Folk Cultural Evening</div>
                <div className="pd-fact-item">🍽 Traditional Rajasthani Thali</div>
              </div>

              <h3 className="pd-section-title">What's Included</h3>
              <div className="pd-section-body">
                 • Luxury accommodation at boutique hotels/camps<br/>
                 • Breakfast and dinner as per itinerary<br/>
                 • All transfers and sightseeing by private AC vehicle<br/>
                 • Monument entry fees and activity charges<br/>
                 • Professional English/Hindi speaking guide
              </div>
            </div>
          )}

          {/* Tab Content: Itinerary */}
          {activeTab === 'itinerary' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              {placesToVisit.length > 0 ? (
                placesToVisit.map((group: any, idx: number) => (
                  <div key={idx} className="mb-8">
                    <h3 className="pd-section-title flex items-center gap-3">
                       <span className="w-8 h-8 rounded-full bg-[var(--sf)] text-white flex items-center justify-center text-sm">{idx + 1}</span>
                       {group.title || `Day ${idx + 1}`}
                    </h3>
                    <div className="space-y-4 mt-4">
                      {group.places?.data?.map((place: any, pIdx: number) => {
                        const pAttr = place.attributes;
                        const pImg = pAttr.images?.data?.[0]?.attributes?.url
                          ? `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${pAttr.images.data[0].attributes.url}`
                          : 'https://images.unsplash.com/photo-1621259182978-f09e5e2ca1ff?w=400&auto=format&fit=crop&q=60';
                          
                        return (
                          <div key={pIdx} className="flex gap-4 p-3 bg-white rounded-xl border border-[var(--bdr)] hover:shadow-md transition-shadow">
                            <div 
                              className="w-24 h-24 rounded-lg bg-cover bg-center flex-shrink-0"
                              style={{ backgroundImage: `url('${pImg}')` }}
                            />
                            <div>
                               <h4 className="font-bold text-[var(--ch)]">{pAttr.name}</h4>
                               <p className="text-xs text-[var(--mu)] mt-1 line-clamp-2">{pAttr.description || "A beautiful place to explore the wonders of Rajasthan."}</p>
                               <div className="flex gap-2 mt-2">
                                  {pAttr.categories?.data?.map((cat: any, cIdx: number) => (
                                    <span key={cIdx} className="text-[10px] bg-[var(--sand)] px-2 py-0.5 rounded-full text-[var(--mu)] font-medium">
                                      {cat.attributes.Name}
                                    </span>
                                  ))}
                               </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="pd-section-body py-8 text-center border-2 border-dashed border-[var(--bdr)] rounded-2xl">
                   Detailed itinerary will be shared upon booking.
                </div>
              )}
            </div>
          )}

           {/* Tab Content: Reviews */}
           {activeTab === 'reviews' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
               <div className="bg-white p-6 rounded-2xl border border-[var(--bdr)] mb-6">
                  <div className="flex items-center justify-between mb-4">
                     <div>
                        <div className="text-3xl font-bold">4.9/5</div>
                        <div className="text-[var(--mu)] text-sm">Based on 124 traveler reviews</div>
                     </div>
                     <button className="btn-s">Write a Review</button>
                  </div>
                  <div className="space-y-4">
                     {[1, 2].map(r => (
                       <div key={r} className="p-4 bg-[var(--cream)] rounded-xl">
                          <div className="flex justify-between mb-2">
                             <div className="font-semibold text-sm">Rahul S.</div>
                             <div className="text-[var(--gold)] text-xs">⭐⭐⭐⭐⭐</div>
                          </div>
                          <p className="text-xs text-[var(--mu)] italic">"The most seamless travel experience I've had in Rajasthan. Every detail was meticulously planned!"</p>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Sticky Sidebar */}
        <div className="pd-right sticky top-[calc(var(--nav-h)+20px)]">
          <div className="pd-book-card">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-[var(--sf)]">₹{pkg.price || '12,999'}</span>
              <span className="text-[var(--mu)] text-sm">per person</span>
            </div>
            <p className="text-[10px] text-[var(--mu)] uppercase tracking-wider font-bold mb-4">Price varies by group size</p>
            
            <div className="pd-book-title">Reserve Your Spot</div>
            <input type="date" className="pd-book-input" />
            <select className="pd-book-input">
              <option>2 Travelers</option>
              <option>4 Travelers</option>
              <option>6+ Travelers</option>
            </select>
            
            <button className="pd-book-btn">Book Experience</button>
            <button className="pd-avail-btn">Chat with Expert</button>
            
            <p className="text-[10px] text-center text-[var(--mu)] mt-3">
              * 100% Refund if cancelled 48hrs prior
            </p>
          </div>

          <div className="pd-nearby-section">
            <h4 className="pd-nearby-title">Why choose this?</h4>
            <div className="space-y-3">
               <div className="flex gap-3 text-xs">
                  <span className="text-lg">✅</span>
                  <div>
                    <div className="font-bold">Instant Confirmation</div>
                    <div className="text-[var(--mu)]">Get your vouchers in minutes</div>
                  </div>
               </div>
               <div className="flex gap-3 text-xs">
                  <span className="text-lg">🛡️</span>
                  <div>
                    <div className="font-bold">Safe Travels</div>
                    <div className="text-[var(--mu)]">Verified operators & insured travel</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;