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
    <section className="sec asi-section" id="asi">
      <div className="sec-hd rv in">
        <div>
          <div className="sec-lbl">✦ {deptName}</div>
          <h2 className="sec-ttl">ASI Protected Sites in Rajasthan </h2>
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
          <div className="asi-logo">🏛</div>
          <h3>{deptName}</h3>
          <p>Preserving India&apos;s monumental heritage since 1861. {count > 0 ? count : 'Several'} premier Rajasthan sites onboarded on OBMS.</p>
          <div className="asi-count">{count}</div>
          <div className="asi-count-l">Sites Onboarded on OBMS</div>
          <Link href="/asi" className="btn-s asi-btn">
            Explore ASI Sites →
          </Link>
        </div>
        
        <div>
          <div className="asi-grid">
            {places?.slice(0, 8)?.map((place: any) => {
              const attr = place.attributes;
              const imageUrl = attr.images?.data?.[0]?.attributes?.url 
                ? `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL || ''}${attr.images.data[0].attributes.url}`
                :null;
              
              const cityName = attr.city?.data?.attributes?.name || 'Rajasthan';
              
              const pdAttr = attr.placeDetail?.data?.attributes;
              const content = pdAttr?.content || [];

              // --- PRICE LOGIC ---
              const ticketComp = content.find((c: any) => c.__typename === 'ComponentPlaceDetailPlacetickets');
              const generalCard = ticketComp?.card?.find((c: any) => c.title?.toLowerCase().includes("general")) || ticketComp?.card?.[0];
              const fees = generalCard?.content || [];
              
              const studentFee = fees.find((f: any) => f.name?.toLowerCase().includes("student"))?.value;
              const indianFee = fees.find((f: any) => f.name?.toLowerCase().includes("indian"))?.value;
              
              const entryFee = studentFee ? `₹${studentFee.trim()}` : indianFee ? `₹${indianFee.trim()}` : null;

              // --- TIMING LOGIC ---
              const timingComp = content.find((c: any) => c.__typename === 'ComponentPlaceDetailPlaceTime' || c.__typename === 'ComponentPlaceDetailPlaceothers');
              const timeCard = timingComp?.card?.find((c: any) => c.title?.toLowerCase().includes("timing"));
              const timings = timeCard?.content || [];
              const timing = timings.map((t: any) => t.value).join(", ") || null;

              const slug = pdAttr?.slug || attr.name?.toLowerCase().replace(/\s+/g, "-");

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
                      <span className="tag tg asi-tag">ASI</span>
                    </div>
                  </div>
                  <div className="asi-body">
                    <div className="asi-name text-ellipsis overflow-hidden whitespace-nowrap" title={attr.name}>{attr.name}</div>
                    <div className="asi-loc">
                      <img src="/icons/google-maps.png" width={12} height={12} alt="Location" className="loc-ico mr-1" />
                      {cityName}
                    </div>
                    <div className="asi-foot">
                      <span className="asi-time">⏰ {timing}</span>
                      <span className="asi-entry">{entryFee}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
            
            {/* View More Card */}
            {/* <Link 
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
            </Link> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AsiSection;

