import Link from 'next/dist/client/link';
import React from 'react';

const AsiSection = ({ data }: any) => {

  // Based on the provided JSON structure, data might be the department object directly
  // or wrapped in a departments structure. Let's handle both.
  const isDirectDept = data?.Name && data?.places;
  const asiDeptAttr = isDirectDept ? data : data?.departments?.data?.find((d: any) => 
    d.attributes.Name.toLowerCase().includes('archaeological survey') || 
    d.attributes.Name.toLowerCase().includes('asi')
  )?.attributes;

  const places = asiDeptAttr?.places?.data || [];
  const deptName = asiDeptAttr?.Name || "Archaeological Survey of India";
  const count = places.length;

  if (!asiDeptAttr) {
    return (
      <section className="sec" id="asi">
        <div className="sec-hd">
          <div>
            <div className="sec-lbl">✦ Archaeological Survey of India</div>
            <h2 className="sec-ttl">ASI Protected Sites</h2>
          </div>
        </div>
        <div className="p-8 text-center bg-white rounded-xl border border-dashed border-[var(--bdr)]">
          <p className="text-[var(--mu)]">No department data available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="sec" id="asi" style={{ background: 'var(--cream)' }}>
      <div className="sec-hd rv in">
        <div>
          <div className="sec-lbl">✦ {deptName}</div>
          <h2 className="sec-ttl">ASI Protected Sites<br />in Rajasthan</h2>
        </div>
        <Link 
          href="/asi" 
          className="see-all"
        >
          See all →
        </Link>
      </div>
      
      <div className="asi-intro rv in">
        <div className="asi-badge-block">
          <div className="logo" style={{ fontSize: '52px', marginBottom: '12px' }}>🏛</div>
          <h3>{deptName}</h3>
          <p>Preserving India's monumental heritage since 1861. {count > 0 ? count : 'Several'} premier Rajasthan sites onboarded on OBMS.</p>
          <div className="asi-count">{count}</div>
          <div className="asi-count-l">Sites Onboarded on OBMS</div>
          <Link href="/asi" className="btn-s" style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }}>
            Explore ASI Sites →
          </Link>
        </div>
        
        <div>
          <div className="asi-grid">
            {places.map((place: any) => {
              const attr = place.attributes;
              const imageUrl = attr.images?.data?.[0]?.attributes?.url 
                ? `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL || ''}${attr.images.data[0].attributes.url}`
                : 'https://images.unsplash.com/photo-1477587458883-47145ed31f5e?w=400&auto=format&fit=crop&q=80';
              
              const cityName = attr.city?.data?.attributes?.name || 'Rajasthan';
              
              // Try to find timing and entry fee from placeDetail tickets
              let timing = "8:00 AM – 6:00 PM";
              let entryFee = "₹50";

              const pdAttr = attr.placeDetail?.data?.attributes;
              const slug = pdAttr?.slug || attr.name?.toLowerCase().replace(/\s+/g, "-");

              const ticketsContent = pdAttr?.content?.find(
                (c: any) => c.__typename === 'ComponentPlaceDetailPlacetickets'
              );

              if (ticketsContent?.card) {
                // Try to find "General Ticket" or Indian price
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
                <Link 
                  key={place.id} 
                  href={`/place-detail/${slug}`}
                  className="asi-card"
                  style={{ display: 'block' }}
                >
                  <div className="asi-img">
                    <div 
                      className="dimg" 
                      style={{ backgroundImage: `url(${imageUrl})` }}
                    ></div>
                    <div className="asi-img-grad"></div>
                    <div className="asi-tag-wrap">
                      <span className="tag tg" style={{ fontSize: '8px' }}>ASI</span>
                    </div>
                  </div>
                  <div className="asi-body">
                    <div className="asi-name text-ellipsis overflow-hidden whitespace-nowrap" title={attr.name}>{attr.name}</div>
                    <div className="asi-loc">📍 {cityName}</div>
                    <div className="asi-foot">
                      <span className="asi-time">⏰ {timing}</span>
                      <span className="asi-entry">{entryFee}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
            
            {/* View More Card */}
            <Link 
              href="/asi"
              className="asi-card" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                flexDirection: 'column', 
                gap: '8px', 
                border: '2px dashed var(--bdr)', 
                borderRadius: 'var(--r)', 
                minHeight: '160px', 
                cursor: 'pointer',
                transition: 'all .3s',
                background: 'transparent'
              }}
            >
              <div style={{ fontSize: '28px', color: 'var(--sf)' }}>+</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--mu)' }}>View All ASI Sites</div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AsiSection;

