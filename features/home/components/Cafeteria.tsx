import React from "react";
import Link from "next/link";

const fallbackData = [
  {
    id: 1,
    name: "RTDC Durg Cafeteria Padao",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80",
    tag: "🏯 Fort View",
    desc: "Scenic hilltop dining at Nahargarh with panoramic Jaipur city views.",
    location: "Nahargarh Fort",
    rating: "4.2",
    price: "₹200–400",
    per: "/ meal",
    time: "9AM–10PM",
  },
  {
    id: 2,
    name: "Masala Chowk (JDA)",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80",
    tag: "🍛 Street Food",
    desc: "Vibrant open-air food court with Rajasthani street food and live cooking.",
    location: "Jaipur",
    rating: "4.5",
    price: "₹100–250",
    per: "/ meal",
    time: "11AM–11PM",
  },
  {
    id: 3,
    name: "RTDC Lake Palace, Siliserh",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop&q=80",
    tag: "🌊 Lakeside",
    desc: "Fine lakeside dining at Alwar's serene 19th-century palace setting.",
    location: "Alwar",
    rating: "4.3",
    price: "₹400–800",
    per: "/ meal",
    time: "8AM–9PM",
  },
];

const Cafeteria = ({ data }: { data?: any }) => {
  const buildImageUrl = (rawUrl?: string) => {
    if (!rawUrl) return "";
    if (/^https?:\/\//i.test(rawUrl)) return rawUrl;
    const base = process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL || "";
    return `${base}${rawUrl}`;
  };

  const places =
    data?.category?.data?.attributes?.places?.data?.length > 0
      ? data.category.data.attributes.places.data
      : fallbackData;

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
          const fallback = fallbackData[index % fallbackData.length];

          const name = attributes?.name || fallback.name;
          const rawImage =
            attributes?.images?.data?.[0]?.attributes?.url ||
            attributes?.image ||
            fallback.image;
          const image = buildImageUrl(rawImage);

          const cityName =
            attributes?.city?.data?.attributes?.name || attributes?.location || "";

          const placeDetails =
            attributes?.placeDetail?.data?.attributes?.content || [];
          const ticketData = placeDetails.find(
            (x: any) => x.__typename === "ComponentPlaceDetailPlacetickets",
          );
          const info = ticketData?.information || [];

          const desc = info?.[0]?.description || attributes?.desc || fallback.desc;
          const location = cityName || fallback.location;

          const price = info?.[1]?.description || fallback.price;
          const time = info?.[2]?.description || fallback.time;

          const tagText = attributes?.tag || fallback.tag;
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
            <Link
              key={item?.id || slug || index}
              href={`/place-detail/${slug}`}
              className="cafe-card"
              style={{ display: "block", textDecoration: "none" }}
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
                  <span className="cafe-ri">📍 {location}</span>
                  <span className="cafe-ri">⭐ {fallback.rating}</span>
                </div>

                <div className="cafe-foot">
                  <div>
                    <div className="cafe-price">
                      {price} <span>{fallback.per}</span>
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--mu)",
                        marginTop: 2,
                      }}
                    >
                      ⏰ {time}
                    </div>
                  </div>
                  <button className="btn-s" type="button">
                    Reserve →
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Cafeteria;