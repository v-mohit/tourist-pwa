"use client";

import React, { useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import CheckAvailabilityModal from "@/features/booking/components/CheckAvailabilityModal";
import { useObmsPlaceId } from "@/features/booking/hooks/useBookingApi";

dayjs.extend(isSameOrAfter);

const JkkSection = ({
  JkkplaceDetailsData,
  upcomingEventsData,
}: {
  JkkplaceDetailsData: any;
  upcomingEventsData: any;
}) => {
  const [availModalOpen, setAvailModalOpen] = useState(false);
  const [resolvedObmsId, setResolvedObmsId] = useState("");

  const obmsPlaceMutation = useObmsPlaceId();

  const place =
    JkkplaceDetailsData?.placeDetails?.data?.[0]?.attributes?.place?.data
      ?.attributes;
  const placeId = JkkplaceDetailsData?.placeDetails?.data?.[0]?.attributes?.place?.data?.id;

  const categories =
    JkkplaceDetailsData?.placeDetails?.data?.[0]?.attributes?.categories || [];

  const images = place?.images?.data || [];

  const allEvents = upcomingEventsData?.upcomingEvents?.data || [];

  // Filter events to show only today and future ones
  const today = dayjs().startOf("day");

  const events = allEvents.filter((event: any) => {
    const attr = event?.attributes;
    const dateToCompare = attr?.eventEndDate || attr?.eventStartDate;
    if (!dateToCompare) return false;
    return dayjs(dateToCompare).isSameOrAfter(today, "day");
  });

  const handleAvailibilityModal = () => {
    obmsPlaceMutation
      .mutateAsync(placeId)
      .then((place: any) => {
        if (place?.id) {
          setResolvedObmsId(place.id);
          setAvailModalOpen(true);
        }
      })
      .catch(() => {
        console.error("get location api error");
      });
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
              <div className="jkk-stat-n">15+</div>
              <div className="jkk-stat-l">Venues</div>
            </div>
            <div className="jkk-stat">
              <div className="jkk-stat-n">101</div>
              <div className="jkk-stat-l">Total Events</div>
            </div>
            {/* <div className="jkk-stat">
              <div className="jkk-stat-n">50K+</div>
              <div className="jkk-stat-l">Visitors</div>
            </div> */}
          </div>

          {/* CHIPS */}
          {/* <div className="jkk-chips">
            <span className="jkk-chip active">All</span>

            {categories.map((cat: any, i: number) => (
              <span key={i} className="jkk-chip">
                {cat?.name.toUpperCase()} ({cat?.places?.length || 0})
              </span>
            ))}
          </div> */}

          {/* BUTTONS */}
          <div className="jkk-btns">
            <Link href="/place-detail/JAWAHAR-KALA-KENDRA">
              <button className="btn-p">Explore Venues</button>
            </Link>

            <button className="btn-g" onClick={handleAvailibilityModal}>
              Check Availibility
            </button>
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
            const image = attr?.eventPhoto?.data?.attributes?.url || null;

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
                  <div className="event-date flex items-center gap-1.5">
                    {/* <span className="text-[14px]">🗓</span> */}
                    {(() => {
                      if (!attr.eventStartDate) return "12 AUG";
                      const s = dayjs(attr.eventStartDate);
                      const e = attr.eventEndDate
                        ? dayjs(attr.eventEndDate)
                        : null;

                      if (!e || s.isSame(e, "day")) {
                        return s.format("DD MMM").toUpperCase();
                      }

                      if (s.isSame(e, "month")) {
                        return `${s.format("DD")} — ${e.format("DD")} ${s.format("MMM").toUpperCase()}`;
                      }

                      return `${s.format("DD MMM")} — ${e.format("DD MMM")}`.toUpperCase();
                    })()}
                  </div>

                  <h4>{attr?.eventTitle || "Cultural Event"}</h4>

                  <p>
                    {attr?.organizedBy ||
                      "Experience a soulful cultural evening at JKK."}
                  </p>

                  <div className="event-meta">
                    <span>⏰ {attr?.eventTime || "6:00 PM"}</span>
                    <span>
                      <img
                        src="/icons/google-maps.png"
                        width={12}
                        height={12}
                        alt="Location"
                        className="loc-ico mr-1"
                      />
                      {attr?.sectionName || "Rangayan Hall"}
                    </span>
                  </div>

                  {attr?.isFeatured && <span className="tag">Featured</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {availModalOpen && (
        <CheckAvailabilityModal
          open={availModalOpen}
          onClose={() => setAvailModalOpen(false)}
          obmsPlaceId={resolvedObmsId}
          placeName={place?.name}
        />
      )}
    </section>
  );
};

export default JkkSection;
