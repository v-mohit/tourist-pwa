"use client";

import React from "react";

const ParkSection = () => {
  const parks = [
    {
      title: "Sawan Bhado Park",
      desc: "Twin artificial lakes surrounded by lush greenery — a beloved picnic spot in the heart of Jaipur.",
      tag: "Water Park",
      badge: "FREE",
      image:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      meta: ["Jaipur", "6AM-8PM", "Free Entry"],
    },
    {
      title: "Kishan Bagh Park",
      desc: "Sprawling green urban park with walking tracks, playgrounds and seasonal flower displays.",
      tag: "Garden Park",
      badge: "FREE",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      meta: ["Jaipur", "6AM-9PM", "Free Entry"],
    },
    {
      title: "Central Park, Jaipur",
      desc: "Jaipur’s largest park with India’s tallest flagmast and jogging tracks.",
      tag: "Heritage Garden",
      badge: "POPULAR",
      image:
        "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d",
      meta: ["C-Scheme, Jaipur", "5AM-10PM", "206 ft Flagmast"],
    },
  ];

  return (
    <section className="park-sec">
      {/* HEADER */}
      <div className="park-head">
        <div>
          <div className="park-label">✦ CITY PARKS & GARDENS</div>
          <h2 className="park-title">
            Green Escapes <br /> & Nature Retreats
          </h2>
        </div>

        <a href="#" className="park-link">
          See all →
        </a>
      </div>

      {/* CARDS */}
      <div className="park-grid">
        {parks.map((park, i) => (
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
                {park.meta.map((m, idx) => (
                  <span key={idx}>• {m}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ParkSection;