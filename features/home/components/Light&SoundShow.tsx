import React from "react";
import Link from "next/link";
import BookNowButton from "@/features/booking/components/BookNowButton";

const fallbackData = [
  {
    id: 1,
    name: "Chittorgarh Fort",
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=900&auto=format&fit=crop&q=85",
    time: "7PM & 8PM",
    language: "Hindi & English",
    duration: "45 mins",
    extra: "Cap: 500",
    desc: "Relive the heroic saga of Rani Padmini and the glory of the Mewar dynasty.",
    tag: "POPULAR",
  },
  {
    id: 2,
    name: "Kumbhalgarh Fort",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed31f5e?w=900&auto=format&fit=crop&q=85",
    time: "7:30PM",
    language: "Hindi & English",
    duration: "55 mins",
    extra: "World's 2nd Longest Wall",
    desc: "The legend of Maharana Kumbha against the Great Wall of India backdrop.",
    tag: "NEW",
  },
];

const LightSoundShow = ({ data }: any) => {
  const buildImageUrl = (rawUrl?: string) => {
    if (!rawUrl) return "";
    if (/^https?:\/\//i.test(rawUrl)) return rawUrl;
    const base = process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL || "";
    return `${base}${rawUrl}`;
  };

  // Extract places safely
  const places =
    data?.category?.data?.attributes?.places?.data?.length > 0
      ? data.category.data.attributes.places.data
      : fallbackData;

  return (
    <section className="sec" id="ls" style={{ background: "var(--ch)" }}>
      <div className="sec-hd rv in">
        <div>
          <div className="sec-lbl" style={{ color: "var(--gold)" }}>
            ✦ Light & Sound Shows
          </div>
          <h2 className="sec-ttl sec-ttl-w">
            History Comes Alive at Night
          </h2>
        </div>
        <Link href={`/tourist-attraction?categoryId=${data?.category?.data?.id}`}
          className="see-all sag">
          See all →
        </Link>
      </div>

      <div className="ls-grid rv in">
        {places?.splice(0,2)?.map((item: any, index: number) => {
          // Handle API + fallback structure
          const attributes = item?.attributes || item;

          const name = attributes?.name || "Unknown Place";
          const rawImage =
            attributes?.images?.data?.[0]?.attributes?.url ||
            attributes?.image ||
            fallbackData[index % fallbackData.length].image;
          const image = buildImageUrl(rawImage);

          const pdAttr = attributes?.placeDetail?.data?.attributes;
          const placeDetails = pdAttr?.content || [];

          const slug = pdAttr?.slug || name.toLowerCase().replace(/\s+/g, "-");

          // Try extracting dynamic info (optional)
          const ticketData = placeDetails.find(
            (x: any) =>
              x.__typename ===
              "ComponentPlaceDetailPlacetickets"
          );

          const info = ticketData?.information || [];

          const time =
            info?.[0]?.description || fallbackData[index % fallbackData.length].time;
          const language =
            info?.[1]?.description ||
            fallbackData[index % fallbackData.length].language;
          const duration =
            info?.[2]?.description ||
            fallbackData[index % fallbackData.length].duration;

          const extra =
            info?.[3]?.description ||
            fallbackData[index % fallbackData.length].extra;

          const desc =
            info?.[4]?.description ||
            fallbackData[index % fallbackData.length].desc;

          const tag =
            (attributes?.tag || fallbackData[index % fallbackData.length].tag || "")
              .toString()
              .toUpperCase() || (index % 2 === 0 ? "POPULAR" : "NEW");
          const isNew = tag.includes("NEW");

          const extraText = (extra || "").toString().trim();
          const hasLeadingEmoji = /^[\p{Extended_Pictographic}]/u.test(extraText);
          const extraWithIcon = hasLeadingEmoji
            ? extraText
            : extraText.toLowerCase().includes("cap") ||
              extraText.toLowerCase().includes("capacity")
              ? `👥 ${extraText}`
              : `🏯 ${extraText}`;

          return (
            <div className="ls-card relative group" key={item?.id || index}>
              {/* Main clickable area linking to details */}
              <Link
                href={`/place-detail/${slug}`}
                className="absolute inset-0 z-0"
                aria-label={`View details for ${name}`}
              />

              <div
                className="dimg"
                style={{
                  backgroundImage: `url(${image})`,
                }}
              ></div>

              <div className="ls-grad"></div>

              <div className="ls-top relative z-10 pointer-events-none">
                {/* <span className="tag to">✨ Light & Sound</span> */}
                <span className={`tag ${isNew ? "tw" : "tg"}`}>
                  {isNew ? "🌟" : "⭐"} {tag}
                </span>
              </div>

              <div className="ls-body relative z-10 pointer-events-none">
                <h3>{name}</h3>

                <div className="ls-dets">
                  <div className="ls-det">⏰ {time}</div>
                  <div className="ls-det">🗣 {language}</div>
                  <div className="ls-det">⏱ {duration}</div>
                  {extraText ? <div className="ls-det">{extraWithIcon}</div> : null}
                </div>

                <p className="ls-desc">{desc}</p>

                {attributes?.bookable !== false ? (
                  <BookNowButton
                    config={{
                      placeId: pdAttr?.obmsId ?? item?.id,
                      placeName: name,
                      category: "inventory",
                      locationId: item?.id,
                    }}
                    label="Book Seats →"
                    className="btn-s pointer-events-auto"
                  />
                ) : (
                  <button
                    className="btn-s pointer-events-auto opacity-40 cursor-not-allowed"
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
};

export default LightSoundShow;