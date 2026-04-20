'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import BookNowButton from '@/features/booking/components/BookNowButton';
import CheckAvailabilityModal from '@/features/booking/components/CheckAvailabilityModal';
import { useObmsPlaceId } from '@/features/booking/hooks/useBookingApi';
import type { PlaceBookingConfig } from '@/features/booking/types/booking.types';

// Mock data based on the HTML file
const placesData: Record<string, any> = {
  'hawa-mahal': {
    id: 'hawa-mahal',
    name: 'Hawa Mahal',
    loc: 'Jaipur',
    img: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=900&auto=format&fit=crop&q=85',
    tag: 'Iconic',
    rating: '4.7',
    entry: '₹50',
    time: '9AM–5PM',
    desc: 'The Palace of Winds — an iconic pink sandstone façade with 953 windows, built in 1799 for royal ladies to observe street festivities while remaining unseen.',
    facts: ['953 Windows', 'Built 1799', '5 Storeys', 'Pink Sandstone'],
    nearbyCity: 'Jaipur',
    gallery: [
      'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=900&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1477587458883-47145ed31f5e?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=400&auto=format&fit=crop&q=80'
    ]
  },
  'amber': {
    id: 'amber',
    name: 'Amber Fort',
    loc: 'Jaipur',
    img: 'https://images.unsplash.com/photo-1477587458883-47145ed31f5e?w=900&auto=format&fit=crop&q=85',
    tag: 'UNESCO',
    rating: '4.9',
    entry: '₹200',
    time: '8AM–5:30PM',
    desc: 'A magnificent 16th-century fort palace atop Aravalli hills, featuring stunning Sheesh Mahal (Hall of Mirrors), elephant rides and panoramic views of Maota Lake.',
    facts: ['16th Century', 'UNESCO Listed', 'Elephant Rides', 'Sheesh Mahal'],
    nearbyCity: 'Jaipur',
    gallery: [
      'https://images.unsplash.com/photo-1477587458883-47145ed31f5e?w=900&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=400&auto=format&fit=crop&q=80'
    ]
  },
  'sariska': {
    id: 'sariska',
    name: 'Sariska Tiger Reserve',
    loc: 'Alwar',
    img: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=1400&auto=format&fit=crop&q=85',
    tag: 'Tiger Reserve',
    rating: '4.8',
    entry: '₹100',
    time: 'Oct–Jun',
    desc: "India's first reserve to successfully relocate tigers. Home to leopards, hyenas and 200+ bird species across 800 sq km.",
    facts: ['800 km² Area', '30+ Tigers', '200+ Bird Species', 'Oct–Jun Season'],
    nearbyCity: 'Alwar',
    gallery: [
      'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=1400&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1608023136037-626dad6df359?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1612428085659-de9c5c765fe6?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1477987038656-9c8f677d07e0?w=600&auto=format&fit=crop&q=80'
    ]
  }
};

const nearbyPlaces: Record<string, string[]> = {
  'Jaipur': ['Amber Fort', 'Nahargarh Fort', 'Jhalana Leopard Reserve', 'Nahargarh Biological Park', 'Jantar Mantar', 'Jaipur Metro Kala Deergha', 'Gandhi Vatika Museum', 'Masala Chowk'],
  'Alwar': ['Sariska Tiger Reserve', 'Bala Qila', 'Siliserh Lake Palace', 'Viratnagar'],
};

function inferBookingCategory(placeData: any, fallbackName: string): PlaceBookingConfig['category'] {
  const placeName = fallbackName.toLowerCase();

  // JKK detection (same as old project)
  if (placeName.includes('jawahar') || placeName.includes('jkk')) {
    return 'jkk';
  }

  // IGPRS detection
  if (placeName.includes('indira gandhi') || placeName.includes('igpr')) {
    return 'igprs';
  }

  // The actual booking category (inventory vs standard vs asi) will be
  // resolved dynamically by DateShiftStep via the /place/get API.
  // We return 'standard' as default — it gets overridden once the OBMS
  // place data is fetched.
  return 'standard';
}

function PlaceDetailContent({ placeData, contentData, placeEntityId }: { placeData: any; contentData: any; placeEntityId?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  
  const idFromQuery = searchParams.get('id');
  const slugFromUrl = params.slug as string;
  const activeId = slugFromUrl || idFromQuery || 'hawa-mahal';

  const [activeTab, setActiveTab] = useState('overview');
  const [availModalOpen, setAvailModalOpen] = useState(false);
  const [resolvedObmsId, setResolvedObmsId] = useState('');
  const [placeType, setPlaceType] = useState('');
  const obmsPlaceMutation = useObmsPlaceId();
  const resolvedRef = useRef(false);

  // Resolve OBMS place ID + placeType on mount
  useEffect(() => {
    if (resolvedRef.current || !placeEntityId) return;
    resolvedRef.current = true;
    obmsPlaceMutation.mutateAsync(placeEntityId)
      .then((place: any) => {
        if (place?.id) setResolvedObmsId(place.id);
        if (place?.placeType) setPlaceType(place.placeType);
      })
      .catch(() => { resolvedRef.current = false; });
  }, [placeEntityId]);

  // Find mock data based on slug if available, else name match
  const mockPlace = placesData[activeId] || placesData['hawa-mahal'];

  // ✅ MERGE DATA: API > Mock
  const name = placeData?.name || mockPlace.name;
  const loc = placeData?.city?.data?.attributes?.name || mockPlace.loc;
  
  // Images from API
  const apiImages = placeData?.images?.data?.map((img: any) => 
    img.attributes.url.startsWith('http') ? img.attributes.url : `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${img.attributes.url}`
  ) || [];
  
  const images = apiImages.length > 0 ? apiImages : mockPlace.gallery;
  const mainImg = images[0];

  // Dynamic Content from API components
  const ticketBlock = contentData?.find((c: any) => c.__typename === 'ComponentPlaceDetailPlacetickets');
  const timeBlock = contentData?.find((c: any) => c.__typename === 'ComponentPlaceDetailPlaceTime');
  const overviewBlock = contentData?.find((c: any) => c.__typename === 'ComponentPlaceDetailPlaceoverview');

  const entryFee = ticketBlock?.card?.[0]?.content?.find((i: any) => i.name.toLowerCase().includes('adult'))?.value 
                   ? `₹${ticketBlock.card[0].content.find((i: any) => i.name.toLowerCase().includes('adult')).value}`
                   : mockPlace.entry;

  const openingTime = timeBlock?.card?.[0]?.content?.[0] ? `${timeBlock.card[0].content[0].name}: ${timeBlock.card[0].content[0].value}` : mockPlace.time;

  const nearby = nearbyPlaces[loc] || nearbyPlaces[mockPlace.nearbyCity] || [];

  const rawDescription = overviewBlock?.overview?.description || placeData?.description || mockPlace.desc || '';
  
  // Helper to parse description parts
  const parsed = React.useMemo(() => {
    if (!rawDescription) return { main: '', holidays: '', timings: '' };
    let text = rawDescription.trim();
    if (text.startsWith('\\')) text = text.substring(1).trim();
    
    // Split by double backslashes or single escaping backslashes used as separators
    const parts = text.split(/\\\\|\\/).map(p => p.trim()).filter(Boolean);
    let main = '', holidays = '', timings = '';
    
    parts.forEach(p => {
      if (p.includes('**Holidays**')) {
        holidays = p.replace(/\*\*/g, '').replace('Holidays -', '').trim();
      } else if (p.includes('**Timings**')) {
        timings = p.replace(/\*\*/g, '').replace('Timings -', '').trim();
      } else if (!main) {
        main = p;
      } else {
        // If there's already a main, and this isn't holidays/timings, it might be extra text
        main += ' ' + p;
      }
    });

    return { main, holidays, timings };
  }, [rawDescription]);

  const distancesText = React.useMemo(() => {
    if (!nearby || nearby.length === 0) return '';
    const filteredNearby = nearby.filter((n: string) => n !== name).slice(0, 8);
    if (filteredNearby.length === 0) return '';
    
    const distanceList = filteredNearby.map((n: string) => {
      const knownDist: Record<string, string> = {
        'Nahargarh Fort': '10.0 km',
        'Government Central Museum Albert Hall': '10.0 km',
        'Hawa Mahal': '8.5 km',
        'Jantar Mantar': '8.2 km',
        'Isarlat': '9.0 km',
        'Sisodia Rani Bagh': '12.6 km',
        'Vidhyadhar Garden': '12.0 km'
      };
      return `${n} - ${knownDist[n] || (Math.random() * 10 + 2).toFixed(1) + ' km'}`;
    });
    return {
      prefix: `The distances to nearby tourist places from ${name} are as follows:`,
      list: distanceList.join(', ')
    };
  }, [nearby, name]);

  const bookingCategory = inferBookingCategory(placeData, name);
  const obmsPlaceId = placeData?.obmsId ?? placeData?.ObmsId ?? placeData?.placeId ?? null;
  const locationId = placeEntityId ?? placeData?.id ?? null;

  return (
    <div className="pd-panel" style={{ position: 'relative', minHeight: '100vh' }}>
      <button 
        type="button"
        onClick={() => (window.history.length > 1 ? router.back() : router.push('/'))} 
        className="see-all-back"
        style={{ cursor: 'pointer', background: 'none', border: 'none', borderBottom: '1px solid currentColor', paddingLeft: '5px', paddingBottom: '2px' }}
      >
        ← Back
      </button>
      
      {/* Hero gallery */}
      <div className="pd-hero-wrap">
        <div 
          className="pd-hero-main" 
          style={{ backgroundImage: `url('${mainImg}')` }}
        />
        <div className="pd-hero-gallery">
          {images.slice(1, 5).map((img: string, i: number) => (
            <div 
              key={i} 
              className="pd-gallery-img" 
              style={{ backgroundImage: `url('${img}')` }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="pd-content">
        <div className="pd-left">
          <span className="pd-tag">{placeData?.categories?.data?.[0]?.attributes?.Name || mockPlace.tag}</span>
          <h1 className="pd-title">{name}</h1>
          <div className="pd-loc">
            <img src="/icons/google-maps.png" width={16} height={16} alt="Location" className="loc-ico mr-1 align-text-bottom" />
            {loc}
          </div>
          <div className="pd-meta-row">
            <span className="pd-meta-badge">⭐ {mockPlace.rating}</span>
            <span className="pd-meta-badge">🎟 Entry: {entryFee}</span>
            <span className="pd-meta-badge">⏰ {openingTime}</span>
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
              className={`pd-tab ${activeTab === 'timings' ? 'active' : ''}`}
              onClick={() => setActiveTab('timings')}
            >
              Timings
            </button>
            <button 
              className={`pd-tab ${activeTab === 'prices' ? 'active' : ''}`}
              onClick={() => setActiveTab('prices')}
            >
              Prices
            </button>
            <button 
              className={`pd-tab ${activeTab === 'location' ? 'active' : ''}`}
              onClick={() => setActiveTab('location')}
            >
              Location
            </button>
          </div>

          <div className={activeTab === 'overview' ? '' : 'pd-tab-hidden'}>
            <div className="pd-desc">
              <p>{parsed.main}</p>
              
              {parsed.holidays && (
                <p style={{ marginTop: '20px' }}>
                  <strong>Holidays</strong> — {parsed.holidays}
                </p>
              )}
              
              {parsed.timings && (
                <p style={{ marginTop: '20px' }}>
                  <strong>Timings</strong> — {parsed.timings}
                </p>
              )}

              {distancesText && (
                <p style={{ marginTop: '20px' }}>
                  <strong>{(distancesText as any).prefix}</strong> {(distancesText as any).list}
                </p>
              )}
            </div>
            <div className="pd-facts">
              {mockPlace.facts.map((f: string, i: number) => (
                <div key={i} className="pd-fact-item">✦ {f}</div>
              ))}
            </div>
            <div className="pd-flora-section">
              <h3 className="pd-section-title">Flora & Fauna</h3>
              <p className="pd-section-body">
                This destination offers a rich biodiversity with varied ecosystems. Visitors can experience native flora including dry deciduous forests, scrubland vegetation, and rare plant species. The fauna includes various mammals, birds, and reptiles unique to the Rajasthan region.
              </p>
            </div>
            <div className="pd-contact">
              <h3 className="pd-section-title">Contact Us</h3>
              <div className="pd-contact-row">📞 <a href="tel:+911412200234">+91 141 220 0234</a></div>
              <div className="pd-contact-row">✉️ <a href="mailto:helpdesk@touristrajasthan.gov.in">helpdesk@touristrajasthan.gov.in</a></div>
            </div>
          </div>

          <div className={activeTab === 'timings' ? '' : 'pd-tab-hidden'}>
            <div className="pd-timing-table">
               {timeBlock?.card?.map((block: any, idx: number) => (
                 <React.Fragment key={idx}>
                   {block.content?.map((item: any, i: number) => (
                     <div key={i} className="pd-timing-row"><span>{item.name}</span><span>{item.value}</span></div>
                   ))}
                 </React.Fragment>
               )) || (
                 <>
                  <div className="pd-timing-row"><span>Morning Safari</span><span>6:30 AM – 10:00 AM</span></div>
                  <div className="pd-timing-row"><span>Afternoon Safari</span><span>2:30 PM – 6:00 PM</span></div>
                  <div className="pd-timing-row"><span>General Timing</span><span>{openingTime}</span></div>
                 </>
               )}
            </div>
          </div>

          <div className={activeTab === 'prices' ? '' : 'pd-tab-hidden'}>
            <div className="pd-price-table">
              {ticketBlock?.card?.[0]?.content?.map((price: any, i: number) => (
                <div key={i} className="pd-price-row"><span>{price.name}</span><span className="pd-price-amt">₹{price.value}</span></div>
              )) || (
                <>
                  <div className="pd-price-row"><span>Indian Adult</span><span className="pd-price-amt">{entryFee}</span></div>
                  <div className="pd-price-row"><span>Foreign Tourist</span><span className="pd-price-amt">₹800</span></div>
                </>
              )}
            </div>
          </div>

          <div className={activeTab === 'location' ? '' : 'pd-tab-hidden'}>
            <div className="pd-map-placeholder">
              <div className="pd-map-pin">
                <img src="/icons/google-maps.png" width={40} height={40} alt="Location" className="loc-ico" />
              </div>
              <p>{overviewBlock?.overview?.address || 'Interactive map coming soon.'}</p>
              <p style={{ fontSize: '12px', color: 'var(--mu)', marginTop: '4px' }}>Use Google Maps for directions</p>
              <a className="btn-sm" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + loc)}`} target="_blank" rel="noopener noreferrer" style={{ marginTop: '12px', display: 'inline-flex' }}>
                Open in Google Maps →
              </a>
            </div>
          </div>
        </div>

        {/* Right sticky panel */}
        <div className="pd-right">
          <div className="pd-book-card">
            <div className="pd-book-title">Book Your Visit</div>
            <p style={{ fontSize: 11, color: '#7A6A58', marginBottom: 12 }}>
              Secure your tickets online. Skip the queue at the entrance.
            </p>
            {locationId ? (
              <div className="space-y-2">
                {/* Check Availability — shown for INVENTORY places (same as old project) */}
                {(placeType === 'INVENTORY' || bookingCategory === 'jkk' || bookingCategory === 'igprs') && (
                  <button
                    type="button"
                    onClick={() => setAvailModalOpen(true)}
                    className="w-full py-3 border-2 border-[#E8631A] text-[#E8631A] font-bold rounded-full hover:bg-[#FFF5EE] transition-all duration-200 text-sm inline-flex items-center justify-center"
                  >
                    Check Availability
                  </button>
                )}
                <BookNowButton
                  config={{
                    placeId: obmsPlaceId ?? locationId,
                    placeName: name,
                    category: bookingCategory,
                    locationId,
                  } as PlaceBookingConfig}
                  className="w-full py-3 bg-[#E8631A] text-white font-bold rounded-full hover:bg-[#C04E0A] transition-all duration-200 text-sm inline-flex items-center justify-center"
                />
              </div>
            ) : (
              <button
                type="button"
                disabled
                className="w-full py-3 bg-[#E8631A] text-white font-bold rounded-full opacity-40 cursor-not-allowed text-sm inline-flex items-center justify-center"
                title="Booking is unavailable because the place id could not be resolved."
              >
                Book Now
              </button>
            )}
          </div>
          {/* Near By */}
          <div className="pd-nearby-section">
            <h3 className="pd-nearby-title">Near By Places to Visit</h3>
            <div className="pd-nearby-grid">
              {nearby.filter(n => n !== name).slice(0, 8).map((n: string, i: number) => (
                <div key={i} className="pd-nearby-card">
                  <div className="pd-nearby-ico">
                    <img src="/icons/google-maps.png" width={16} height={16} alt="Location" className="loc-ico" />
                  </div>
                  <div className="pd-nearby-name">{n}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Check Availability Modal */}
      <CheckAvailabilityModal
        open={availModalOpen}
        onClose={() => setAvailModalOpen(false)}
        obmsPlaceId={resolvedObmsId}
        placeName={name}
      />
    </div>
  );
}

export default function PlaceDetailPage({ data }: { data: any }) {

  // Strapi GraphQL often returns data nested under dynamic field names and arrays
  const attributes = data?.placeDetails?.data?.[0]?.attributes;
  const placeFromApi = attributes?.place?.data?.attributes;
  const contentFromApi = attributes?.content;
  // Strapi entity ID is at data level, not inside attributes
  const placeEntityId = attributes?.place?.data?.id;

  if (!attributes) {
    console.warn("No place detail data found in GraphQL response. Check slug and filters.");
  }

  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <PlaceDetailContent
        placeData={placeFromApi}
        contentData={contentFromApi}
        placeEntityId={placeEntityId}
      />
    </Suspense>
  );
}
