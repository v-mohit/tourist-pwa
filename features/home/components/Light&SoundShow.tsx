"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BookNowButton from "@/features/booking/components/BookNowButton";

const LightSoundShow = ({ data }: any) => {
  const router = useRouter();
  const buildImageUrl = (rawUrl?: string) => {
    if (!rawUrl) return "";
    if (/^https?:\/\//i.test(rawUrl)) return rawUrl;
    const base = process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL || "";
    return `${base}${rawUrl}`;
  };

  // Extract places safely
  const places = data?.category?.data?.attributes?.places?.data || [];

  if (places.length === 0) return null;

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
        {places.slice(0, 2).map((item: any, index: number) => {
          const attributes = item?.attributes;
          const name = attributes?.name || "Unknown Place";
          
          const rawImage = attributes?.images?.data?.[0]?.attributes?.url || "";
          const image = buildImageUrl(rawImage);

          const pdAttr = attributes?.placeDetail?.data?.attributes;
          const placeDetails = pdAttr?.content || [];
          const slug = pdAttr?.slug || name.toLowerCase().replace(/\s+/g, "-");

          const ticketData = placeDetails.find(
            (x: any) => x.__typename === "ComponentPlaceDetailPlacetickets"
          );

          const info = ticketData?.information || [];

          const time = info?.[0]?.description || "7:00 PM";
          const language = info?.[1]?.description || "Hindi & English";
          const duration = info?.[2]?.description || "45 mins";
          const extra = info?.[3]?.description || "";
          const desc = info?.[4]?.description || attributes?.description || "";

          const tag = (attributes?.tag || "").toString().toUpperCase() || "POPULAR";
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
              {/* Clickable area linking to details */}
              <div 
                className="cursor-pointer"
                onClick={() => {
                  if (slug) {
                    router.push(`/place-detail/${slug}`);
                  }
                }}
              >
                <div
                  className="dimg"
                  style={{
                    backgroundImage: `url(${image})`,
                  }}
                ></div>

                <div className="ls-grad"></div>

                <div className="ls-top">
                  <span className={`tag ${isNew ? "tw" : "tg"}`}>
                    {isNew ? "🌟" : "⭐"} {tag}
                  </span>
                </div>

                <div className="ls-body">
                  <h3>{name}</h3>

                  <div className="ls-dets">
                    <div className="ls-det">⏰ {time}</div>
                    <div className="ls-det">🗣 {language}</div>
                    <div className="ls-det">⏱ {duration}</div>
                    {extraText ? <div className="ls-det">{extraWithIcon}</div> : null}
                  </div>

                  <p className="ls-desc">{desc}</p>
                </div>
              </div>

              <div className="px-4 pb-4">
                {attributes?.bookable !== false ? (
                  <BookNowButton
                    config={{
                      placeId: pdAttr?.obmsId ?? item?.id,
                      placeName: name,
                      category: "inventory",
                      locationId: item?.id,
                    }}
                    label="Book Seats →"
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
          );
        })}
      </div>
    </section>
  );
};

export default LightSoundShow;