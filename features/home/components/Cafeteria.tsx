"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BookNowButton from "@/features/booking/components/BookNowButton";

const Cafeteria = ({ data }: { data?: any }) => {
  const router = useRouter();
  const buildImageUrl = (rawUrl?: string) => {
    if (!rawUrl) return "";
    if (/^https?:\/\//i.test(rawUrl)) return rawUrl;
    const base = process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL || "";
    return `${base}${rawUrl}`;
  };

  const places = data?.category?.data?.attributes?.places?.data || [];

  if (places.length === 0) return null;

  return (
    <section className="sec" id="cafeteria">
      <div className="sec-hd rv in">
        <div>
          <div className="sec-lbl">✦ {data?.title || "Cafeteria & Dining"}</div>
          <h2 className="sec-ttl">Dine with a Stunning View</h2>
        </div>
        <Link
          href={`/tourist-attraction?categoryId=${data?.category?.data?.id || ""}&categoryName=${encodeURIComponent(
            data?.category?.data?.attributes?.Name || "Cafeteria",
          )}`}
          className="see-all"
        >
          See all →
        </Link>
      </div>

      <div className="cafe-grid rv in">
        {places.map((item: any, index: number) => {
          const attributes = item?.attributes || item;

          const name = attributes?.name || "Cafeteria";
          const rawImage = attributes?.images?.data?.[0]?.attributes?.url || "";
          const image = buildImageUrl(rawImage);

          const cityName = attributes?.city?.data?.attributes?.name || "Rajasthan";

          const placeDetails = attributes?.placeDetail?.data?.attributes?.content || [];
          
          // --- PRICE LOGIC ---
          const ticketComponent = placeDetails.find(
            (x: any) => x.__typename === "ComponentPlaceDetailPlacetickets",
          );
          const entryFeeCard = ticketComponent?.card?.find((c: any) => c.title?.toLowerCase().includes("fee") || c.title?.toLowerCase().includes("charge") || c.title?.toLowerCase().includes("price"));
          const fees = entryFeeCard?.content || [];
          
          const studentFee = fees.find((f: any) => f.name?.toLowerCase().includes("student"))?.value;
          const indianFee = fees.find((f: any) => f.name?.toLowerCase().includes("indian"))?.value;
          
          const price = studentFee ? `₹${studentFee.trim()}` : indianFee ? `₹${indianFee.trim()}` : null;

          // --- TIMING LOGIC ---
          const timingComp = placeDetails.find(
            (x: any) => x.__typename === "ComponentPlaceDetailPlaceTime" || x.__typename === "ComponentPlaceDetailPlaceothers"
          );
          const timingCard = timingComp?.card?.find((c: any) => c.title?.toLowerCase().includes("timing"));
          const timings = timingCard?.content || [];
          const time = timings.map((t: any) => t.value).join(", ") || null;

          const desc = ticketComponent?.information?.[0]?.description || attributes?.description || "Experience local flavors and stunning views.";
          const location = cityName;

          const tagText = attributes?.tag || "Dining";
          const tagClass =
            typeof tagText === "string" && tagText.includes("Street")
              ? "tg"
              : typeof tagText === "string" && tagText.includes("Lakeside")
                ? "tb"
                : "tw";

          const slug =
            attributes?.placeDetail?.data?.attributes?.slug ||
            attributes?.slug ||
            item?.id ||
            `cafeteria-${index}`;

          return (
            <div
              key={item?.id || slug || index}
              className="cafe-card relative group"
              style={{ display: "block" }}
            >
              {/* Clickable area linking to details */}
              <div 
                className="cursor-pointer"
                onClick={() => {
                  if (slug) {
                    router.push(`/place-detail/${slug}`);
                  }
                }}
              >
                <div className="cafe-img">
                  <div
                    className="dimg"
                    style={{ backgroundImage: `url('${image}')` }}
                  />
                  <div className="cafe-img-grad" />
                  <div className="cafe-img-foot">
                    <span className={`tag ${tagClass}`} style={{ fontSize: 9 }}>
                      {tagText}
                    </span>
                  </div>
                </div>

                <div className="cafe-body">
                  <h4>{name}</h4>
                  <p>{desc}</p>

                  <div className="cafe-row">
                    <span className="cafe-ri">
                      <img src="/icons/google-maps.png" width={12} height={12} alt="Location" className="loc-ico mr-1" />
                      {location}
                    </span>
                    <span className="cafe-ri">⭐ 4.5</span>
                  </div>
                </div>
              </div>

                <div className="cafe-foot">
                  <div> 
                    {price && (
                      <div className="cafe-price">
                        Starting from {price}
                      </div>
                    )}
                    {time && (
                      <div
                        style={{
                          fontSize: 10,
                          color: "var(--mu)",
                          marginTop: 2,
                        }}
                      >
                        ⏰ {time}
                      </div>
                    )}
                  </div>
                  <div className="pointer-events-auto px-4 pb-4">
                    {attributes?.bookable !== false ? (
                      <BookNowButton
                        config={{
                          placeId: attributes?.placeDetail?.data?.attributes?.obmsId ?? item?.id,
                          placeName: name,
                          category: "inventory",
                          locationId: item?.id,
                        }}
                        label="Reserve →"
                        className="btn-s w-full justify-center"
                      />
                    ) : (
                      <button
                        className="btn-s w-full justify-center opacity-40 cursor-not-allowed"
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
};

export default Cafeteria;