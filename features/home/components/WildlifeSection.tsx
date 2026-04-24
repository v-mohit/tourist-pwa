import Link from "next/link";
import BookNowButton from "@/features/booking/components/BookNowButton";
import Image from "next/image";

export default function WildlifeSection({ data }: any) {
  const places = data?.category?.data?.attributes?.places?.data || [];
  const heroPlace = places[0]?.attributes;
  const heroSlug =
    heroPlace?.placeDetail?.data?.attributes?.slug ||
    heroPlace?.name?.toLowerCase?.().replace(/\s+/g, "-") ||
    "sariska";
  const heroLocationId = places[0]?.id;
  const heroPlaceId = heroPlace?.obmsId ?? heroLocationId;
  const heroName = heroPlace?.name || "Sariska Tiger Reserve";
  const heroCity = heroPlace?.city?.data?.attributes?.name || "Alwar";

  return (
    <section className="sec" id="wildlife" style={{ background: "#0B1A12" }}>
      {/* Header */}
      <div className="sec-hd">
        <div>
          <div className="sec-lbl" style={{ color: "#22C55E" }}>
            ✦ {data?.title || "Top Wildlife"}
          </div>
          <h2 className="sec-ttl sec-ttl-w">Into the Wildlife</h2>
        </div>
        <Link
          href={`/tourist-attraction?categoryId=${data?.category?.data?.id}`}
          className="see-all"
          style={{ color: "#22C55E", borderColor: "#22C55E" }}
        >
          See all →
        </Link>
      </div>

      {/* ✅ Hero */}
      <div
        className="wild-hero"
        style={{ display: "block", position: "relative" }}
      >
        <Link
          href={`/place-detail/${heroSlug}`}
          className="absolute inset-0 z-0"
          aria-label={`View details for ${heroName}`}
        />
        <div
          className="dimg"
          style={{
            backgroundImage: "url(./images/tiger.jpg)",
          }}
        />
        <div className="wild-hero-grad" />
        <div
          className="wild-hero-body"
          style={{ position: "relative", zIndex: 1 }}
        >
          <span className="sariska-tag tn">🐯 Project Tiger Reserve</span>
          <h2>{heroName}</h2>
          <div className="wild-facts">
            <div className="wf">
              <Image
                src="/icons/google-maps.png"
                width={12}
                height={12}
                alt="Location"
                className="loc-ico mr-1"
              />
              <b>Alwar</b>
            </div>
            <div className="wf">
              🌿 <b>800 km²</b>
            </div>
            <div className="wf">
              🐯 <b>30+ Tigers</b>
            </div>
            <div className="wf">
              📅 <b>Oct–Jun</b>
            </div>
          </div>
          <p className="wild-hero-desc">
            India&apos;s first reserve to successfully relocate tigers.
          </p>
          <div className="wild-hero-btns">
            {heroLocationId && heroPlace?.bookable !== false ? (
              <BookNowButton
                config={{
                  placeId: heroPlaceId,
                  placeName: heroName,
                  category: "inventory",
                  locationId: heroLocationId,
                }}
                label="Book Safari →"
                className="btn-p"
              />
            ) : (
              <button className="btn-p opacity-40 cursor-not-allowed" disabled>
                {heroPlace?.bookable === false ? "Booking Unavailable" : "Book Safari →"}
              </button>
            )}
            <Link
              href={`/place-detail/${heroSlug}`}
              className="btn-g"
              style={{ position: "relative", zIndex: 1 }}
            >
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
          const img = attr?.images?.data?.[0]?.attributes?.url
            ? `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${attr.images.data[0].attributes.url}`
            : null;

          // ✅ Name & Location
          const name = attr?.name || "Wildlife Park";
          const city = attr?.city?.data?.attributes?.name || "Unknown";

          const placeSlug =
            attr?.placeDetail?.data?.attributes?.slug ||
            (name.toLowerCase().includes("sariska")
              ? "sariska"
              : name.toLowerCase().replace(/\s+/g, "-"));
          const locationId = item?.id;
          const obmsPlaceId = attr?.obmsId ?? locationId;

          // ✅ Timing
          const timeBlock = attr?.placeDetail?.data?.attributes?.content?.find(
            (c: any) => c.__typename === "ComponentPlaceDetailPlaceTime",
          );

          const time = timeBlock?.card?.[0]?.content?.[0]?.value || "9AM–5PM";

          // ✅ Fee
          const ticketBlock =
            attr?.placeDetail?.data?.attributes?.content?.find(
              (c: any) => c.__typename === "ComponentPlaceDetailPlacetickets",
            );

          const fee =
            ticketBlock?.card?.[0]?.content?.find((c: any) =>
              c.name.includes("Indian"),
            )?.value || "50";

          return (
            <div
              key={item.id}
              className="relative rounded-2xl overflow-hidden cursor-pointer group"
            >
              {/* Full clickable layer */}
              <Link
                href={`/place-detail/${placeSlug}`}
                className="absolute inset-0 z-0"
              />

              {/* Background Image */}
              <div
                className="h-[260px] w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url('${img}')` }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Top Tag */}
              <div className="absolute top-3 right-3 z-10">
                <span className="bg-yellow-400 text-black text-[10px] px-2 py-1 rounded-full font-semibold">
                  🐾 Wildlife
                </span>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 w-full p-4 z-10 text-white">
                <h4 className="text-sm font-semibold">{name}</h4>

                <div className="text-xs opacity-90 mt-1 flex items-center gap-1">
                  <Image
                    src="/icons/google-maps.png"
                    width={12}
                    height={12}
                    alt="Location"
                  />
                  <span>
                    {city} · ⏰ {time} · ₹{fee}
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-3 flex items-center justify-between">
                  {/* LEFT → View Details */}
                  <Link
                    href={`/place-detail/${placeSlug}`}
                    className="border border-white text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm"
                  >
                    View Details
                  </Link>

                  {/* RIGHT → Book Safari */}
                  {locationId && attr?.bookable !== false ? (
                    <BookNowButton
                      config={{
                        placeId: obmsPlaceId,
                        placeName: name,
                        category: "inventory",
                        locationId,
                      }}
                      label="Book Safari →"
                      className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full"
                    />
                  ) : (
                    <button
                      className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full opacity-40 cursor-not-allowed"
                      disabled
                    >
                      {attr?.bookable === false ? "Booking Unavailable" : "Book Safari →"}
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
