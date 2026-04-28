"use client";
import Link from "next/link";
import React from "react";

const ParkSection = (data: any) => {
  const section = data?.data;
  const title = section?.title || "CITY PARKS & GARDENS";
  const places = section?.category?.data?.attributes?.places?.data || [];

  if (places.length === 0) return null;

  const parks = places.map((item: any) => {
    const attr = item?.attributes;
    const pdAttr = attr?.placeDetail?.data?.attributes;

    return {
      slug: pdAttr?.slug || attr?.name?.toLowerCase().replace(/\s+/g, "-"),
      title: attr?.name || "Unnamed Park",
      desc: pdAttr?.content?.[0]?.children?.[0]?.text || attr?.description || "A peaceful green escape perfect for relaxation.",
      tag: "Park",
      badge: "POPULAR",
      image: attr?.images?.data?.[0]?.attributes?.url
        ? `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${attr.images.data[0].attributes.url}`
        : null,
      meta: [
        attr?.city?.data?.attributes?.name || "Rajasthan",
        "6AM-9PM",
        "Free Entry",
      ],
    };
  });

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
