"use client";

import React from "react";

const JkkSection = ({
  JkkplaceDetailsData,
  upcomingEventsData,
}: {
  JkkplaceDetailsData: any;
  upcomingEventsData: any;
}) => {
  const place =
    JkkplaceDetailsData?.placeDetails?.data?.[0]?.attributes?.place?.data
      ?.attributes;

  const categories =
    JkkplaceDetailsData?.placeDetails?.data?.[0]?.attributes?.categories || [];

  const images = place?.images?.data || [];

  const events = upcomingEventsData?.upcomingEvents?.data || [];

  const formatDate = (dateStr: string) => {
    if (!dateStr) return { day: "12", month: "AUG" };
    const d = new Date(dateStr);
    return {
      day: d.getDate(),
      month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    };
  };

  return (
    <section className="sec" id="venues">
      {/* HEADER */}
      <div className="sec-hd">
        <div>
          <div className="sec-lbl">✦ JKK Venues</div>
          <h2 className="sec-ttl sec-ttl-w">
            {place?.name || "JKK Venues & Events"}
          </h2>
        </div>
      </div>

      {/* TOP SECTION */}
      <div className="jkk-top">
        {/* LEFT SIDE */}
        <div>
          <p className="jkk-desc">
            {
              "Jawahar Kala Kendra (JKK) is Jaipur’s cultural hub hosting art exhibitions, theatre performances, music festivals, and workshops."
            }
          </p>

          {/* STATS (STATIC — NOT IN API) */}
          <div className="jkk-stats">
            <div className="jkk-stat">
              <div className="jkk-stat-n">8+</div>
              <div className="jkk-stat-l">Venues</div>
            </div>
            <div className="jkk-stat">
              <div className="jkk-stat-n">120+</div>
              <div className="jkk-stat-l">Events/year</div>
            </div>
            <div className="jkk-stat">
              <div className="jkk-stat-n">50K+</div>
              <div className="jkk-stat-l">Visitors</div>
            </div>
          </div>

          {/* CHIPS */}
          <div className="jkk-chips">
            <span className="jkk-chip active">All</span>

            {categories.map((cat: any, i: number) => (
              <span key={i} className="jkk-chip">
                {cat?.name.toUpperCase()} ({cat?.places?.length || 0})
              </span>
            ))}
          </div>

          {/* BUTTONS */}
          <div className="jkk-btns">
            <button className="btn-p">Explore Venues</button>

            <button className="btn-g">View Calendar</button>
          </div>
        </div>

        {/* RIGHT SIDE (GALLERY) */}
        <div className="jkk-gallery">
          {(images.length ? images : [1, 2, 3, 4])
            .slice(0, 4)
            .map((img: any, i: number) => (
              <div className="jkk-thumb" key={i}>
                <div
                  className="dimg"
                  style={{
                    backgroundImage: `url(${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${img?.attributes?.url})`,
                  }}
                ></div>
              </div>
            ))}
        </div>
      </div>

      {/* EVENTS SECTION */}
      <div className="events-section">
        <div className="sec-hd">
          <div>
            <div className="sec-lbl">✦ Upcoming JKK Events</div>
            <h3 className="sec-ttl sec-ttl-w">Celebrations & Culture</h3>
          </div>
        </div>

        <div className="events-grid">
          {(events.length ? events : [1, 2, 3]).map((event: any, i: number) => {
            const attr = event?.attributes || {};
            const { day, month } = formatDate(attr.eventStartDate);

            const image =
              attr?.eventPhoto?.data?.attributes?.url ||
              "https://images.unsplash.com/photo-1515169067865-5387ec356754";

            return (
              <div
                className="event-card"
                key={i}
                style={{
                  backgroundImage: `url(${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${image})`,
                }}
              >
                {/* OVERLAY */}
                <div className="event-overlay" />

                {/* CONTENT */}
                <div className="event-content">
                  <div className="event-date">
                    {day} {month}
                  </div>

                  <h4>{attr?.eventTitle || "Cultural Event"}</h4>

                  <p>
                    {attr?.organizedBy ||
                      "Experience a soulful cultural evening at JKK."}
                  </p>

                  <div className="event-meta">
                    <span>⏰ {attr?.eventTime || "6:00 PM"}</span>
                    <span>📍 {attr?.sectionName || "Rangayan Hall"}</span>
                  </div>

                  {attr?.isFeatured && <span className="tag">Featured</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JkkSection;
