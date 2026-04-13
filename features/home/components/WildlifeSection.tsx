import Link from "next/link";
import BookNowButton from "@/features/booking/components/BookNowButton";

export default function WildlifeSection({ data }: any) {
  const places = data?.category?.data?.attributes?.places?.data || [];
  const heroPlace = places[0]?.attributes;
  const heroSlug =
    heroPlace?.placeDetail?.data?.attributes?.slug ||
    heroPlace?.name?.toLowerCase?.().replace(/\s+/g, '-') ||
    'sariska';
  const heroLocationId = places[0]?.id;
  const heroPlaceId = heroPlace?.obmsId ?? heroLocationId;
  const heroName = heroPlace?.name || 'Sariska Tiger Reserve';
  const heroCity = heroPlace?.city?.data?.attributes?.name || 'Alwar';

  return (
    <section className="sec" id="wildlife" style={{ background: '#0B1A12' }}>
      {/* Header */}
      <div className="sec-hd">
        <div>
          <div className="sec-lbl" style={{ color: '#22C55E' }}>
            ✦ {data?.title || "Top Wildlife"}
          </div>
          <h2 className="sec-ttl sec-ttl-w">Into the Wildlife</h2>
        </div>
        <Link 
          href={`/tourist-attraction?categoryId=${data?.category?.data?.id}`} 
          className="see-all" 
          style={{ color: '#22C55E', borderColor: '#22C55E' }}
        >
          See all →
        </Link>
      </div>

      {/* ✅ Hero */}
      <div className="wild-hero" style={{ display: 'block', position: 'relative' }}>
        <Link
          href={`/place-detail/${heroSlug}`}
          className="absolute inset-0 z-0"
          aria-label={`View details for ${heroName}`}
        />
        <div
          className="dimg"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=1400')",
          }}
        />
        <div className="wild-hero-grad" />
        <div className="wild-hero-body" style={{ position: 'relative', zIndex: 1 }}>
          <span className="tag tn">🐯 Project Tiger Reserve</span>
          <h2>{heroName}</h2>
          <div className="wild-facts">
            <div className="wf">📍 <b>{heroCity}</b></div>
            <div className="wf">🌿 <b>800 km²</b></div>
            <div className="wf">🐯 <b>30+ Tigers</b></div>
            <div className="wf">📅 <b>Oct–Jun</b></div>
          </div>
          <p className="wild-hero-desc">
            India&apos;s first reserve to successfully relocate tigers.
          </p>
          <div className="wild-hero-btns">
            {heroLocationId ? (
              <BookNowButton
                config={{
                  placeId: heroPlaceId,
                  placeName: heroName,
                  category: 'inventory',
                  locationId: heroLocationId,
                }}
                label="Book Safari →"
                className="btn-p"
              />
            ) : (
              <button className="btn-p opacity-40 cursor-not-allowed" disabled>
                Book Safari →
              </button>
            )}
            <Link href={`/place-detail/${heroSlug}`} className="btn-g" style={{ position: 'relative', zIndex: 1 }}>
              View Details
            </Link>
          </div>
        </div>
      </div>

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
          
          const placeSlug = attr?.placeDetail?.data?.attributes?.slug || 
                          (name.toLowerCase().includes('sariska') ? 'sariska' :
                           name.toLowerCase().replace(/\s+/g, '-'));
          const locationId = item?.id;
          const obmsPlaceId = attr?.obmsId ?? locationId;

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
            <div
              key={item.id}
              className="wild-card"
              style={{ display: 'block', cursor: 'pointer', position: 'relative' }}
            >
              <Link
                href={`/place-detail/${placeSlug}`}
                className="absolute inset-0 z-0"
                aria-label={`View details for ${name}`}
              />
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

              <div className="wild-foot" style={{ position: 'relative', zIndex: 1 }}>
                <h4>{name}</h4>

                {/* Meta (dynamic + fallback mix) */}
                <div className="wild-bar">
                  <span>
                    📍 {city} · ⏰ {time} · ₹{fee}
                  </span>
                </div>

                <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {locationId ? (
                    <BookNowButton
                      config={{
                        placeId: obmsPlaceId,
                        placeName: name,
                        category: 'inventory',
                        locationId,
                      }}
                      label="Book Safari →"
                      className="btn-p"
                    />
                  ) : (
                    <button className="btn-p opacity-40 cursor-not-allowed" disabled>
                      Book Safari →
                    </button>
                  )}
                  <Link href={`/place-detail/${placeSlug}`} className="btn-g" style={{ position: 'relative', zIndex: 1 }}>
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
