import Link from "next/link";
import BookNowButton from '@/features/booking/components/BookNowButton';

export default function TopMonuments({ data }: any) {
  const places = data?.category?.data?.attributes?.places?.data || [];

  return (
    <section className="sec bg-[var(--cream)]" id="monuments">
      {/* Header */}
      <div className="sec-hd">
        <div>
          <div className="sec-lbl">✦ {data?.title || "Top Monuments"}</div>
          <h2 className="sec-ttl">Royal Heritage & Architecture</h2>
        </div>
        <Link
          href={`/tourist-attraction?categoryId=${data?.category?.data?.id}`}
          className="see-all"
        >
          See all →
        </Link>
      </div>

      {/* Grid */}
      <div className="mon-grid">
        {places.slice(0, 8).map((item: any) => {
          const attr = item?.attributes;

          const img = attr?.images?.data?.[0]?.attributes?.url
            ? `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${attr.images.data[0].attributes.url}`
            : null;

          // ✅ Name & Location
          const name = attr?.name || "Unknown Monument";
          const loc = attr?.city?.data?.attributes?.name || "Unknown Location";

          // ✅ Dynamic Slug from API with smart fallback for mock data
          const placeId =
            attr?.placeDetail?.data?.attributes?.slug ||
            (name.toLowerCase().includes("hawa mahal")
              ? "hawa-mahal"
              : name.toLowerCase().includes("amber")
                ? "amber"
                : name.toLowerCase().replace(/\s+/g, "-"));

          // ✅ Timing
          const timeBlock = attr?.placeDetail?.data?.attributes?.content?.find(
            (c: any) => c.__typename === "ComponentPlaceDetailPlaceTime",
          );
          const time = timeBlock?.card?.[0]?.content?.[0]?.value || "9AM–5PM";

          // ✅ Fee (Indian Adult fallback)
          const ticketBlock =
            attr?.placeDetail?.data?.attributes?.content?.find(
              (c: any) => c.__typename === "ComponentPlaceDetailPlacetickets",
            );

          const fee = ticketBlock?.card?.[0]?.content?.find(
            (c: any) => c.name === "Indian Adult",
          )?.value
            ? `₹${
                ticketBlock.card[0].content.find(
                  (c: any) => c.name === "Indian Adult",
                ).value
              }`
            : "₹100";

          return (
            <div
              key={item.id}
              className="mon-card relative group"
              style={{ display: "block" }}
            >
              {/* Main clickable area linking to details */}
              <Link
                href={`/place-detail/${placeId}`}
                className="absolute inset-0 z-0"
                aria-label={`View details for ${name}`}
              />

              {/* Image */}
              <div className="mon-img">
                <div
                  className="dimg"
                  style={{ backgroundImage: `url('${img}')` }}
                />
                <div className="mon-img-grad" />
                <div className="mon-img-tag">
                  <span className="tag tg" style={{ fontSize: 8 }}>
                    🏆 Heritage
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="mon-body relative z-10 pointer-events-none">
                <div className="mon-name">{name}</div>
                <div className="mon-loc">
                  <img src="/icons/google-maps.png" width={12} height={12} alt="Location" className="loc-ico mr-1" />
                  {loc}
                </div>

                {/* Static chips (since API doesn't provide) */}
                <div className="mon-chips">
                  <span className="mon-chip">🏯 Monument</span>
                  <span className="mon-chip">Historic</span>
                </div>

                <div className="mon-foot">
                  <span className="mon-time">⏰ {time}</span>
                  <span className="mon-fee">{fee}</span>
                </div>

                <div className="pointer-events-auto">
                  {attr?.bookable !== false ? (
                    <BookNowButton
                      config={{
                        placeId: attr?.placeDetail?.data?.attributes?.obmsId ?? item.id,
                        placeName: name,
                        category: 'standard',
                        locationId: item.id,
                      }}
                      label="Book Entry →"
                      className="btn-sm btn-sm--full inline-flex items-center justify-center"
                    />
                  ) : (
                    <button
                      className="btn-sm btn-sm--full inline-flex items-center justify-center opacity-40 cursor-not-allowed"
                      disabled
                    >
                      Booking Unavailable
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
