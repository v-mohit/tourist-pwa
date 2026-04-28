"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BookNowButton from '@/features/booking/components/BookNowButton';

export default function MuseumsSection({ data }: any) {
  const router = useRouter();
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
          const pdAttr = attr?.placeDetail?.data?.attributes;
          const content = pdAttr?.content || [];

          // ✅ Image
          const img =
            attr?.images?.data?.[0]?.attributes?.url
              ? `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${attr.images.data[0].attributes.url}`
              : null;

          // ✅ Name
          const name = attr?.name || "Museum";

          // ✅ Timing
          const timingComp = content.find((c: any) => c.__typename === 'ComponentPlaceDetailPlaceTime' || c.__typename === 'ComponentPlaceDetailPlaceothers');
          const timeCard = timingComp?.card?.find((c: any) => c.title?.toLowerCase().includes("timing"));
          const timings = timeCard?.content || [];
          const time = timings.map((t: any) => t.value).join(", ") || null;

          // ✅ Fee
          const ticketBlock = content.find(
            (c: any) => c.__typename === "ComponentPlaceDetailPlacetickets"
          );
          const feeValue =
            ticketBlock?.card?.[0]?.content?.[0]?.value || null;
          const fee = `₹${feeValue}`;

          // ✅ City
          const city = attr?.city?.data?.attributes?.name || "Rajasthan";

          const placeId = pdAttr?.slug ||
            (name.toLowerCase().includes('hawa mahal') ? 'hawa-mahal' :
              name.toLowerCase().includes('amber') ? 'amber' :
                name.toLowerCase().replace(/\s+/g, '-'));

          return (
            <div
              key={item.id}
              className="mus-card relative group flex flex-col"
            >
              {/* Clickable area linking to details */}
              <div
                className="cursor-pointer flex flex-col flex-1"
                onClick={() => {
                  if (placeId) {
                    router.push(`/place-detail/${placeId}`);
                  }
                }}
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
                    <span className="tag tg">
                      🏛 Museum
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="mus-body flex flex-col flex-1">
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

                  <div className="mus-foot mt-auto">
                    <span className="mus-time">⏰ {time}</span>
                    <span className="mus-fee">{fee}</span>
                  </div>
                </div>
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
                    label="Book Tickets →"
                    className="btn-sm btn-sm--full-mus inline-flex items-center justify-center w-full"
                  />
                ) : (
                  <button
                    className="btn-sm btn-sm--full-mus inline-flex items-center justify-center w-full opacity-40 cursor-not-allowed"
                    disabled
                  >
                    Booking Unavailable
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
