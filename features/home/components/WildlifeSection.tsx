import Link from "next/link";

export default function WildlifeSection({ data }: any) {
  const places = data?.category?.data?.attributes?.places?.data || [];

  return (
    <section className="sec" id="wildlife" style={{ background: '#0B1A12' }}>
      {/* Header */}
      <div className="sec-hd">
        <div>
          <div className="sec-lbl" style={{ color: '#22C55E' }}>
            ✦ {data?.title || "Top Wildlife"}
          </div>
          <h2 className="sec-ttl sec-ttl-w">Into the Wild</h2>
        </div>
        <Link href="/wildlife" className="see-all" style={{ color: '#22C55E', borderColor: '#22C55E' }}>
          See all →
        </Link>
      </div>

      {/* ✅ Hero (kept static) */}
      <Link href="/place-detail/sariska" className="wild-hero" style={{ display: 'block', cursor: 'pointer' }}>
        <div
          className="dimg"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=1400')",
          }}
        />
        <div className="wild-hero-grad" />
        <div className="wild-hero-body">
          <span className="tag tn">🐯 Project Tiger Reserve</span>
          <h2>Sariska Tiger Reserve</h2>
          <div className="wild-facts">
            <div className="wf">📍 <b>Alwar</b></div>
            <div className="wf">🌿 <b>800 km²</b></div>
            <div className="wf">🐯 <b>30+ Tigers</b></div>
            <div className="wf">📅 <b>Oct–Jun</b></div>
          </div>
          <p className="wild-hero-desc">
            India&apos;s first reserve to successfully relocate tigers.
          </p>
          <div className="wild-hero-btns">
            <button className="btn-p">Book Safari →</button>
            <button className="btn-g">View Details</button>
          </div>
        </div>
      </Link>

      {/* ✅ Dynamic Cards (limit 4) */}
      <div className="wild-grid">
        {places.slice(0, 4).map((item: any) => {
          const attr = item?.attributes;

          // ✅ Image
          const img =
            attr?.images?.data?.[0]?.attributes?.url
              ? `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${attr.images.data[0].attributes.url}`
              : null;

          // ✅ Name & Location
          const name = attr?.name || "Wildlife Park";
          const city = attr?.city?.data?.attributes?.name || "Unknown";
          
          const placeId = attr?.placeDetail?.data?.attributes?.slug || 
                          (name.toLowerCase().includes('sariska') ? 'sariska' :
                           name.toLowerCase().replace(/\s+/g, '-'));

          // ✅ Timing
          const timeBlock = attr?.placeDetail?.data?.attributes?.content?.find(
            (c: any) => c.__typename === "ComponentPlaceDetailPlaceTime"
          );

          const time =
            timeBlock?.card?.[0]?.content?.[0]?.value || "9AM–5PM";

          // ✅ Fee
          const ticketBlock = attr?.placeDetail?.data?.attributes?.content?.find(
            (c: any) => c.__typename === "ComponentPlaceDetailPlacetickets"
          );

          const fee =
            ticketBlock?.card?.[0]?.content?.find(
              (c: any) => c.name.includes("Adult")
            )?.value || "50";

          return (
            <Link 
              key={item.id} 
              href={`/place-detail/${placeId}`}
              className="wild-card" 
              style={{ display: 'block', cursor: 'pointer' }}
            >
              <div
                className="dimg"
                style={{ backgroundImage: `url('${img}')` }}
              />
              <div className="wild-grad" />

              {/* Tag (static fallback) */}
              <div className="wild-top">
                <span className="tag tn" style={{ fontSize: 9 }}>
                  🐾 Wildlife
                </span>
              </div>

              <div className="wild-foot">
                <h4>{name}</h4>

                {/* Meta (dynamic + fallback mix) */}
                <div className="wild-bar">
                  <span>
                    📍 {city} · ⏰ {time} · ₹{fee}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}