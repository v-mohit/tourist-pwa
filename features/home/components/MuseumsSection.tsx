import Link from 'next/link';

export default function MuseumsSection({ data }: any) {
  const places = data?.category?.data?.attributes?.places?.data || [];

  return (
    <section className="sec bg-[var(--sand)]" id="museums">
      {/* Header */}
      <div className="sec-hd">
        <div>
          <div className="sec-lbl">✦ {data?.title || "Top Museums"}</div>
          <h2 className="sec-ttl">Preserving History</h2>
        </div>
        <Link 
          href={`/tourist-attraction?categoryId=${data?.category?.data?.id}`} 
          className="see-all"
        >
          See all →
        </Link>
      </div>

      {/* Grid */}
      <div className="mus-grid">
        {places.slice(0, 3).map((item: any) => {
          const attr = item?.attributes;

          // ✅ Image
          const img =
            attr?.images?.data?.[0]?.attributes?.url
              ? `${process.env.NEXT_PUBLIC_BASE_URL}${attr.images.data[0].attributes.url}`
              : null;

          // ✅ Name
          const name = attr?.name || "Museum";

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

          const feeValue =
            ticketBlock?.card?.[0]?.content?.[0]?.value || "50";

          const fee = `₹${feeValue}`;

          // ✅ City (used in fallback desc)
          const city = attr?.city?.data?.attributes?.name || "Rajasthan";

          const placeId = attr?.placeDetail?.data?.attributes?.slug || 
                          (name.toLowerCase().includes('hawa mahal') ? 'hawa-mahal' :
                           name.toLowerCase().includes('amber') ? 'amber' :
                           name.toLowerCase().replace(/\s+/g, '-'));

          return (
            <Link 
              key={item.id} 
              href={`/place-detail/${placeId}`}
              className="mus-card"
              style={{ display: 'block', cursor: 'pointer' }}
            >
              {/* Image */}
              <div className="mus-img">
                <div
                  className="dimg"
                  style={{ backgroundImage: `url('${img}')` }}
                />
                <div className="mus-img-grad" />

                {/* Static tag + estd fallback */}
                <div className="mus-img-foot">
                  <span className="tag tg" style={{ fontSize: 9 }}>
                    🏛 Museum
                  </span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,.7)' }}>
                    Est. —
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="mus-body">
                <h4>{name}</h4>

                {/* Fallback description */}
                <p>
                  Explore historical artifacts and cultural exhibits from {city}.
                </p>

                {/* Static tags */}
                <div className="mus-tags">
                  <span className="mus-tag">🏺 History</span>
                  <span className="mus-tag">🎨 Art</span>
                  <span className="mus-tag">📜 Culture</span>
                </div>

                <div className="mus-foot">
                  <span className="mus-time">⏰ {time}</span>
                  <span className="mus-fee">{fee}</span>
                </div>

                <button className="btn-sm btn-sm--full-mus">
                  Book Tickets →
                </button>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}