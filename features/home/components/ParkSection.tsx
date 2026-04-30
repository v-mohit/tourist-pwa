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
    const content = pdAttr?.content || [];

    // --- TIMING LOGIC ---
    const timingComp = content.find((c: any) => c.__typename === 'ComponentPlaceDetailPlaceTime');
    const timeCard = timingComp?.card?.find((c: any) => c.title?.toLowerCase().includes("timing"));
    const timings = timeCard?.content || [];
    const timeStr = timings.map((t: any) => t.value).join(", ") || null;
"ComponentPlaceDetailPlaceTime"
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
        timeStr,
        "Free Entry",
      ],
    };
  });

  return (
    <section className="sec" id="parks" style={{ background: "#0B1A12" }}>
      <div className="sec-hd">
        <div>
          <div className="sec-lbl" style={{ color: "var(--grn)" }}>
            ✦ {title}
          </div>
          <h2 className="sec-ttl" style={{ color: "#fff" }}>
            Green Escapes & Nature Retreats
          </h2>
        </div>

        <Link
          href={`/tourist-attraction?categoryId=${data?.data?.category?.data?.id}`}
          className="see-all"
          style={{ color: "var(--grn)", borderColor: "var(--grn)" }}
        >
          See all →
        </Link>
      </div>

      <div className="park-grid">
        {parks.map((park: any, i: number) => (
          <Link key={i} href={`/place-detail/${park.slug}`} className="park-card group">
            <div
              className="dimg"
              style={{ backgroundImage: `url(${park.image})` }}
            ></div>

            <div className="park-overlay" />

            <div className="park-top">
              <span className="park-tag">{park.tag}</span>
              <span className="park-badge">{park.badge}</span>
            </div>

            <div className="park-content">
              <h3>{park.title}</h3>
              <p>{park.desc}</p>

              <div className="park-meta">
                {park.meta.map((m: string, idx: number) => (
                  <span key={idx} className="park-det">• {m}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ParkSection;
