"use client";
import Link from "next/link";
import React from "react";

const ParkSection = (data: any) => {
  const section = data?.data;

  const title = section?.title || "CITY PARKS & GARDENS";

  const places = section?.category?.data?.attributes?.places?.data || [];

  // fallback static data (used if API empty)
  const fallbackParks = [
    {
      title: "Sawan Bhado Park",
      desc: "Beautiful lakes and greenery.",
      tag: "Water Park",
      badge: "FREE",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      meta: ["Jaipur", "6AM-8PM", "Free Entry"],
    },
  ];

  const parks =
    places.length > 0
      ? places.map((item: any) => {
          const attr = item?.attributes;

          return {
            slug: attr?.placeDetail?.data?.attributes?.slug,
            title: attr?.name || "Unnamed Park",

            desc:
              attr?.placeDetail?.data?.attributes?.content?.[0]?.children?.[0]
                ?.text || "A peaceful green escape perfect for relaxation.",

            tag: "Park",

            badge: "POPULAR",

            image: attr?.images?.data?.[0]?.attributes?.url
              ? `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${attr.images.data[0].attributes.url}`
              : null,

            meta: [
              attr?.city?.data?.attributes?.name || "Unknown City",
              "6AM-9PM",
              "Free Entry",
            ],
          };
        })
      : fallbackParks;


  return (
    <section className="park-sec" id="parks">
      {/* HEADER */}
      <div className="park-head">
        <div>
          <div className="park-label">✦ {title}</div>
          <h2 className="park-title">
            Green Escapes <br /> & Nature Retreats
          </h2>
        </div>

        <Link
          href={`/tourist-attraction?categoryId=${data?.data?.category?.data?.id}`}
          className="park-link"
        >
          See all →
        </Link>
      </div>

      {/* CARDS */}
      <div className="park-grid">
        {parks.map((park: any, i: number) => (
          <Link key={i} href={`/place-detail/${park.slug}`}>
            <div
              key={i}
              className="park-card"
              style={{ backgroundImage: `url(${park.image})` }}
            >
              {/* TOP TAGS */}
              <div className="park-top">
                <span className="park-tag">{park.tag}</span>
                <span className="park-badge">{park.badge}</span>
              </div>

              {/* OVERLAY */}
              <div className="park-overlay" />

              {/* CONTENT */}
              <div className="park-content">
                <h3>{park.title}</h3>
                <p>{park.desc}</p>

                <div className="park-meta">
                  {park.meta.map((m: string, idx: number) => (
                    <span key={idx}>• {m}</span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ParkSection;
