"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import BookNowButton from "@/features/booking/components/BookNowButton";
import CheckAvailabilityModal from "@/features/booking/components/CheckAvailabilityModal";
import { useObmsPlaceId } from "@/features/booking/hooks/useBookingApi";
import type { PlaceBookingConfig } from "@/features/booking/types/booking.types";
import CategoryWiseGalleryNew from "@/components/ui/CategoryWiseGalleryNew";
import ReactMarkdown from "react-markdown";

// ---------------- TAB CONFIG ----------------
const TAB_CONFIG: Record<
  string,
  { label: string; index: number; key: string }
> = {
  ComponentPlaceDetailPlaceoverview: {
    label: "Overview",
    index: 0,
    key: "overview",
  },
  ComponentPlaceDetailPlaceTime: {
    label: "Timings",
    index: 1,
    key: "timings",
  },
  ComponentPlaceDetailPlacetickets: {
    label: "Prices",
    index: 2,
    key: "prices",
  },
  ComponentPlaceDetailPlaceexhibit: {
    label: "Exhibits",
    index: 3,
    key: "exhibits",
  },
  ComponentPlaceDetailPlaceothers: {
    label: "Camera",
    index: 4,
    key: "camera",
  },
  ComponentPlaceDetailPlaceGallery: {
    label: "Gallery",
    index: 5,
    key: "gallery",
  },
  // ComponentPlaceDetailPlacestovisit: {
  //   label: "Nearby",
  //   index: 3,
  //   key: "nearby",
  // },
};

// ---------------- CATEGORY ----------------
function inferBookingCategory(
  placeName: string,
): PlaceBookingConfig["category"] {
  const name = placeName.toLowerCase();

  if (name.includes("jawahar") || name.includes("jkk")) return "jkk";
  if (name.includes("indira gandhi") || name.includes("igpr")) return "igprs";

  return "standard";
}

function PlaceDetailContent({
  placeData,
  contentData,
  placeEntityId,
  placeCategories,
}: {
  placeData: any;
  contentData: any;
  placeEntityId?: string;
  placeCategories: {
    name: string;
    title: string;
    description: string;
    places: {
      name: string;
      description: string;
      gallery: {
        image: {
          data: {
            attributes: { url: string };
          }[];
        };
      }[];
    }[];
  }[];
}) {
  console.log("placeCategories---", placeCategories);

  const router = useRouter();

  const [activeTab, setActiveTab] = useState<string | null>(null);

  const [availModalOpen, setAvailModalOpen] = useState(false);
  const [resolvedObmsId, setResolvedObmsId] = useState("");
  const [placeType, setPlaceType] = useState("");

  const obmsPlaceMutation = useObmsPlaceId();
  const resolvedRef = useRef(false);

  const pricesBlock = contentData?.find(
    (items: any) => items?.__typename === "ComponentPlaceDetailDynamicprice",
  );

  const prices = Array.isArray(pricesBlock?.cats) ? pricesBlock.cats : [];

  // ---------------- OBMS ----------------
  useEffect(() => {
    if (resolvedRef.current || !placeEntityId) return;

    resolvedRef.current = true;
    obmsPlaceMutation
      .mutateAsync(placeEntityId)
      .then((place: any) => {
        if (place?.id) setResolvedObmsId(place.id);
        if (place?.placeType) setPlaceType(place.placeType);
      })
      .catch(() => {
        resolvedRef.current = false;
      });
  }, [placeEntityId]);

  // ---------------- DATA ----------------
  const name = placeData?.name || "";
  const loc = placeData?.city?.data?.attributes?.name || "";

  const images =
    placeData?.images?.data?.map((img: any) =>
      img.attributes.url.startsWith("http")
        ? img.attributes.url
        : `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${img.attributes.url}`,
    ) || [];

  const mainImg = images[0] || "";

  const bookingCategory = inferBookingCategory(name);

  const obmsPlaceId =
    placeData?.obmsId ?? placeData?.ObmsId ?? placeData?.placeId ?? null;

  const locationId = placeEntityId ?? placeData?.id ?? null;

  const isJawahar = name?.toLowerCase().includes("jawahar");

  // ---------------- DYNAMIC TABS ----------------
  const tabs = (contentData || [])
    .map((item: any) => {
      const config = TAB_CONFIG[item.__typename];
      if (!config) return null;

      let label = config.label;

      // 🔥 override label
      if (config.key === "gallery" && isJawahar) {
        label = "Venue";
      }

      return {
        ...config,
        label,
        content: item,
      };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => a.index - b.index);

  const currentTabKey = activeTab ?? tabs[0]?.key;

  // From city relation
  const hasNearbySection = contentData?.some(
    (c: any) => c.__typename === "ComponentPlaceDetailPlacestovisit",
  );
  const nearPlace = placeData?.city?.data?.attributes?.places?.data || [];

  const nearbyPlaces = nearPlace
    .map((p: any) => {
      const img = p?.attributes?.images?.data?.[0]?.attributes?.url;
      const slug = p?.attributes?.placeDetail?.data?.attributes?.slug;

      return {
        name: p?.attributes?.name,
        id: p?.id,
        slug: slug,
        image: img
          ? img.startsWith("http")
            ? img
            : `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${img}`
          : "",
      };
    })
    .filter((p: any) => p.name && p.name !== name);

  // ---------------- UI ----------------
  return (
     <div className="pd-panel" style={{ position: 'relative', minHeight: '100vh' }}>
      <button 
        type="button"
        onClick={() => (window.history.length > 1 ? router.back() : router.push('/'))} 
        className="see-all-back"
        style={{ cursor: 'pointer', background: 'none', border: 'none', borderBottom: '1px solid currentColor', paddingLeft: '5px', paddingBottom: '2px' }}
      >
        ← Back
      </button>

      {/* Hero */}
      <div className="pd-hero-wrap">
        <div
          className="pd-hero-main"
          style={{ backgroundImage: `url('${mainImg}')` }}
        />
        <div className="pd-hero-gallery">
          {images.slice(1, 5).map((img: string, i: number) => (
            <div
              key={i}
              className="pd-gallery-img"
              style={{ backgroundImage: `url('${img}')` }}
            />
          ))}
        </div>
      </div>

      <div className="pd-content">
        <div className="pd-left">
          <span className="pd-tag">
            {placeData?.categories?.data?.[0]?.attributes?.Name || ""}
          </span>

          <h1 className="pd-title">{name}</h1>

          <div className="pd-loc">
            <img
              src="/icons/google-maps.png"
              width={16}
              height={16}
              alt="Location"
            />
            {loc}
          </div>

          {/* Tabs */}
          <div className="pd-tabs">
            {tabs.map((tab: any) => (
              <button
                key={tab.key}
                className={`pd-tab ${currentTabKey === tab.key ? "active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {tabs.map((tab: any) => {
            if (currentTabKey !== tab.key) return null;

            switch (tab.key) {
              case "overview":
                return (
                  <div key={tab.key} className="pd-desc">
                    <ReactMarkdown>
                      {tab.content?.overview?.description || ""}
                    </ReactMarkdown>
                  </div>
                );

              case "timings":
                return (
                  <div key={tab.key} className="pd-timing-table">
                    {tab.content?.card?.map((block: any, idx: number) => (
                      <React.Fragment key={idx}>
                        {block.content?.map((item: any, i: number) => (
                          <div key={i} className="pd-timing-row">
                            <span>{item.name}</span>
                            <span>{item.value}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                );

              case "prices":
                return (
                  <div key={tab.key} className="pd-price-table">
                    {tab.content?.card?.[0]?.content?.map(
                      (price: any, i: number) => (
                        <div key={i} className="pd-price-row">
                          <span>{price.name}</span>
                          <span className="pd-price-amt">₹{price.value}</span>
                        </div>
                      ),
                    )}
                  </div>
                );

              case "exhibits":
                return (
                  <div key={tab.key} className="pd-exhibit-list">
                    {tab.content?.card?.map((exhibit: any, i: number) => (
                      <div key={i} className="pd-exhibit-item">
                        <h4 className="pd-exhibit-title">{exhibit.name}</h4>
                        <p className="pd-exhibit-desc">{exhibit.value}</p>
                      </div>
                    ))}
                  </div>
                );

              case "camera":
                return (
                  <div key={tab.key} className="pd-camera-info">
                    {tab.content?.card?.map((item: any, i: number) => (
                      <div key={i} className="pd-camera-row">
                        <span>{item.name}</span>
                        <span>{item.value}</span>
                      </div>
                    ))}
                  </div>
                );

              case "gallery":
                if (isJawahar) {
                  return (
                    <div key={tab.key}>
                      <CategoryWiseGalleryNew
                        placeName={name}
                        bookNowClick={() => setAvailModalOpen(true)}
                        disclaimerOpen={false}
                        data={
                          Array.isArray(placeCategories) ? placeCategories : []
                        }
                        prices={prices}
                        placeCategory={bookingCategory}
                        isbookingData={!!locationId}
                        obmsId={obmsPlaceId as any}
                      />
                    </div>
                  );
                }

                // 🔥 DEFAULT GALLERY
                return (
                  <div key={tab.key} className="pd-gallery-grid">
                    {tab.content?.images?.data?.map((img: any, i: number) => {
                      const url = img.attributes.url.startsWith("http")
                        ? img.attributes.url
                        : `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${img.attributes.url}`;

                      return (
                        <div
                          key={i}
                          className="pd-gallery-img"
                          style={{ backgroundImage: `url('${url}')` }}
                        />
                      );
                    })}
                  </div>
                );

              default:
                return null;
            }
          })}
        </div>

        {/* RIGHT PANEL */}
        <div className="pd-right">
          <div className="pd-book-card">
            <div className="pd-book-title">Book Your Visit</div>
            <p style={{ fontSize: 11, color: "#7A6A58", marginBottom: 12 }}>
              Secure your tickets online. Skip the queue at the entrance.
            </p>
            {locationId ? (
              <div className="space-y-2">
                {(placeType === "INVENTORY" ||
                  bookingCategory === "jkk" ||
                  bookingCategory === "igprs") && (
                  <button
                    className="w-full py-3 border-2 border-[#E8631A] text-[#E8631A] font-bold rounded-full hover:bg-[#FFF5EE] transition-all duration-200 text-sm inline-flex items-center justify-center"
                    onClick={() => setAvailModalOpen(true)}
                  >
                    Check Availability
                  </button>
                )}

                <BookNowButton
                  className="w-full py-3 bg-[#E8631A] text-white font-bold rounded-full hover:bg-[#C04E0A] transition-all duration-200 text-sm inline-flex items-center justify-center"
                  config={{
                    placeId: obmsPlaceId ?? locationId,
                    placeName: name,
                    category: bookingCategory,
                    locationId,
                  }}
                />
              </div>
            ) : (
              <button disabled>Book Now</button>
            )}
          </div>
          {hasNearbySection && (
            <div className="pd-nearby-section">
              <h3 className="pd-nearby-title">Near By Places to Visit</h3>

              <div className="pd-nearby-grid">
                {nearbyPlaces.length > 0 ? (
                  nearbyPlaces.slice(0, 8).map((place: any, i: number) => (
                    <div
                      key={i}
                      className="pd-nearby-card"
                      onClick={() => {
                        if (place.slug) {
                          router.push(`/place-detail/${place.slug}`);
                        }
                      }}
                      style={{
                        backgroundImage: place.image
                          ? `url('${place.image}')`
                          : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        cursor: place.slug ? "pointer" : "default",
                      }}
                    >
                      <div className="pd-nearby-overlay">
                        <div className="pd-nearby-ico">
                          <img
                            src="/icons/google-maps.png"
                            width={16}
                            height={16}
                            alt="Location"
                            className="loc-ico"
                          />
                        </div>
                        <div className="pd-nearby-name">{place.name}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: 12, color: "#7A6A58" }}>
                    No nearby places available.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      <CheckAvailabilityModal
        open={availModalOpen}
        onClose={() => setAvailModalOpen(false)}
        obmsPlaceId={resolvedObmsId}
        placeName={name}
      />
    </div>
  );
}

export default function PlaceDetailPage({ data }: { data: any }) {
  const attributes = data?.placeDetails?.data?.[0]?.attributes;
  const placeFromApi = attributes?.place?.data?.attributes;
  const contentFromApi = attributes?.content;
  const placeEntityId = attributes?.place?.data?.id;
  const placeCategories = attributes?.categories || [];

  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <PlaceDetailContent
        placeData={placeFromApi}
        contentData={contentFromApi}
        placeEntityId={placeEntityId}
        placeCategories={placeCategories}
      />
    </Suspense>
  );
}
