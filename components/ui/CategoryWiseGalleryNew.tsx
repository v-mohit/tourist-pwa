"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import ReactMarkdown from "react-markdown";
// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface StrapiImageData {
  attributes: {
    url: string;
    alternativeText?: string | null;
    formats?: {
      medium?: { url: string };
      small?: { url: string };
      thumbnail?: { url: string };
    };
  };
}

export interface CategoryItem {
  attributes: {
    Name: string;
    Description?: string | null;
    icon?: {
      data?: {
        attributes: { url: string };
      } | null;
    };
  };
}

export interface PriceEntry {
  title: string;
  price: string | null;
  note: string | null;
}

export interface PlaceItem {
  name: string;
  priceType: string | null;
  remark: string | null;
  description?: string | null;
  capacity?: string | null;
  images?: {
    data?: StrapiImageData[] | null;
  } | null;
  prices: PriceEntry[];
}

export interface PriceCategory {
  name: string;
  title: string;
  places: PlaceItem[];
}

export interface CMSCategory {
  name: string;
  title: string;
  description: string;
  places: {
    name: string;
    description: string;
    gallery: {
      image: {
        data: StrapiImageData[];
      };
    }[];
  }[];
}

export interface CategoryWiseGalleryNewProps {
  placeName: string;
  disclaimerOpen: boolean;
  bookNowClick: () => void;
  data: CMSCategory[];
  prices: PriceCategory[] | null;
  placeCategory: string;
  isbookingData: boolean;
  obmsId: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Responsive hook
// ─────────────────────────────────────────────────────────────────────────────

function useIsMobile(breakpoint = 640): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false,
  );

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    handler(); // run on mount
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);

  return isMobile;
}

// ─────────────────────────────────────────────────────────────────────────────
// Env
// ─────────────────────────────────────────────────────────────────────────────

const IMG_BASE = (process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL ?? "").replace(
  /\/$/,
  "",
);

function img(path: string | null | undefined): string | null {
  if (!path) return null;
  return path.startsWith("http") ? path : `${IMG_BASE}${path}`;
}

function placeImages(place: PlaceItem): string[] {
  return (place.images?.data ?? [])
    .map((d) => img(d.attributes.formats?.medium?.url ?? d.attributes.url))
    .filter((u): u is string => Boolean(u));
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const ALL_TAB = "all";

function formatPrice(price: string | null, note: string | null): string {
  if (price === null) return note ?? "—";
  const n = parseFloat(price);
  if (isNaN(n)) return price;
  return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// FilterTabs
// ─────────────────────────────────────────────────────────────────────────────

interface Tab {
  key: string;
  label: string;
}

const FilterTabs: React.FC<{
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
}> = ({ tabs, active, onChange }) => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      marginBottom: "24px",
    }}
  >
    {tabs.map((tab) => {
      const on = tab.key === active;
      return (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          style={{
            padding: "8px 18px",
            fontSize: "12px",
            fontWeight: 700,
            borderRadius: "99px",
            border: on ? "none" : "1.5px solid #C0B0A0",
            background: on ? "#E8631A" : "transparent",
            color: on ? "#fff" : "#2C2017",
            cursor: "pointer",
            letterSpacing: "0.4px",
            transition: "all 0.18s",
            // Ensure touch-friendly tap target
            minHeight: "36px",
          }}
        >
          {tab.label.toUpperCase()}
        </button>
      );
    })}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// ImageCarousel
// ─────────────────────────────────────────────────────────────────────────────

const ImageCarousel: React.FC<{ images: string[]; alt: string }> = ({
  images,
  alt,
}) => {
  const [cur, setCur] = useState(0);
  const total = images.length;
  const isMobile = useIsMobile();

  if (total === 0) {
    return (
      <div
        style={{
          borderRadius: "12px",
          background: "#F5DCE5",
          minHeight: isMobile ? "220px" : "260px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: "13px", color: "#B08090" }}>
          No image available
        </span>
      </div>
    );
  }

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCur((c) => (c - 1 + total) % total);
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCur((c) => (c + 1) % total);
  };

  const navBtn: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(255,255,255,0.88)",
    border: "none",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    cursor: "pointer",
    fontSize: "20px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    zIndex: 2,
    color: "#333",
    // Bigger tap target on mobile
    touchAction: "manipulation",
  };

  return (
    <div
      style={{
        position: "relative",
        borderRadius: "12px",
        overflow: "hidden",
        // Full width on mobile, natural height ratio
        width: "100%",
        aspectRatio: isMobile ? "4/3" : undefined,
        minHeight: isMobile ? undefined : "260px",
        background: "#F5DCE5",
      }}
    >
      <img
        src={images[cur]}
        alt={`${alt} ${cur + 1}`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />

      {/* Counter badge */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "#E8631A",
          color: "#fff",
          fontSize: "11px",
          fontWeight: 700,
          padding: "4px 10px",
          borderRadius: "99px",
          zIndex: 2,
        }}
      >
        {cur + 1} / {total}
      </div>

      {/* Arrows */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous"
            style={{ ...navBtn, left: "8px" }}
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Next"
            style={{ ...navBtn, right: "8px" }}
          >
            ›
          </button>
        </>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PricingModal
// ─────────────────────────────────────────────────────────────────────────────

const PricingModal: React.FC<{ place: PlaceItem; onClose: () => void }> = ({
  place,
  onClose,
}) => {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(24,18,14,0.55)",
        backdropFilter: "blur(4px)",
        zIndex: 2000,
        display: "flex",
        alignItems: "flex-end", // sheet from bottom on mobile
        justifyContent: "center",
        padding: "0",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "20px 20px 0 0",
          width: "100%",
          maxWidth: "540px",
          maxHeight: "88vh",
          overflowY: "auto",
          boxShadow: "0 -8px 40px rgba(24,18,14,0.18)",
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            paddingBottom: "4px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "4px",
              borderRadius: "99px",
              background: "#E0D0C8",
            }}
          />
        </div>

        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg,#E8631A,#FF69B4)",
            padding: "16px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <div>
            <p
              style={{
                fontSize: "10px",
                color: "rgba(255,255,255,0.8)",
                fontWeight: 700,
                letterSpacing: "0.9px",
                margin: "0 0 4px",
                textTransform: "uppercase",
              }}
            >
              Pricing Details
            </p>
            <h3
              style={{
                fontSize: "17px",
                fontWeight: 700,
                color: "#fff",
                margin: 0,
              }}
            >
              {place.name}
            </h3>
            {place.priceType && (
              <p
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.75)",
                  margin: "4px 0 0",
                }}
              >
                {place.priceType}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "#fff",
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "16px 20px 32px" }}>
          {place.prices.length === 0 ? (
            <p
              style={{
                fontSize: "13px",
                color: "#7A6A58",
                textAlign: "center",
                padding: "20px 0",
              }}
            >
              Contact us for pricing information.
            </p>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              {place.prices.map((entry, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "10px 14px",
                    background: i % 2 === 0 ? "#FFF0F7" : "#fff",
                    borderRadius: "10px",
                    border: "1px solid #FFD6E8",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#2C2017",
                      lineHeight: 1.55,
                      flex: 1,
                    }}
                  >
                    {entry.title}
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#E8631A",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {formatPrice(entry.price, entry.note)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {place.remark && (
            <div
              style={{
                marginTop: "16px",
                background: "#FFF9EC",
                border: "1px solid #F0C842",
                borderRadius: "10px",
                padding: "12px 14px",
              }}
            >
              <p
                style={{
                  fontSize: "10px",
                  color: "#7A6A58",
                  fontWeight: 700,
                  marginBottom: "6px",
                  letterSpacing: "0.6px",
                  textTransform: "uppercase",
                }}
              >
                Note
              </p>
              <p
                style={{
                  fontSize: "11px",
                  color: "#2C2017",
                  lineHeight: 1.75,
                  whiteSpace: "pre-line",
                  margin: 0,
                }}
              >
                {place.remark}
              </p>
            </div>
          )}

          <button
            onClick={onClose}
            style={{
              marginTop: "20px",
              width: "100%",
              padding: "13px",
              background: "linear-gradient(135deg,#E8631A,#FF69B4)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "13px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ActionButtons
// ─────────────────────────────────────────────────────────────────────────────

const pill: React.CSSProperties = {
  padding: "10px 22px",
  fontSize: "12px",
  fontWeight: 700,
  borderRadius: "99px",
  border: "none",
  cursor: "pointer",
  background: "#E8631A",
  color: "#fff",
  letterSpacing: "0.2px",
  transition: "opacity 0.18s, transform 0.18s",
  minHeight: "40px", // touch-friendly
  touchAction: "manipulation",
};

const ActionButtons: React.FC<{
  place: PlaceItem;
  isbookingData: boolean;
  obmsId: string | null;
  onBook: (name: string) => void;
  onAvailability: (name: string) => void;
  onPricing: (place: PlaceItem) => void;
}> = ({ place, isbookingData, obmsId, onBook, onAvailability, onPricing }) => {
  const isMobile = useIsMobile();

  const over = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.opacity = "0.82";
    e.currentTarget.style.transform = "translateY(-1px)";
  };
  const out = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.opacity = "1";
    e.currentTarget.style.transform = "translateY(0)";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        flexWrap: "wrap",
        gap: "10px",
        marginTop: "16px",
        // On mobile make buttons full width
        alignItems: isMobile ? "stretch" : "flex-start",
      }}
    >
      {isbookingData && (
        <button
          style={{
            ...pill,
            width: isMobile ? "100%" : undefined,
            textAlign: "center",
          }}
          onMouseEnter={over}
          onMouseLeave={out}
          onClick={() => onBook(place.name)}
        >
          {obmsId ? "Book Now" : "Enquire Now"}
        </button>
      )}
      <button
        style={{
          ...pill,
          width: isMobile ? "100%" : undefined,
          textAlign: "center",
        }}
        onMouseEnter={over}
        onMouseLeave={out}
        onClick={() => onAvailability(place.name)}
      >
        Availability
      </button>
      {place.prices.length > 0 && (
        <button
          style={{
            ...pill,
            width: isMobile ? "100%" : undefined,
            textAlign: "center",
          }}
          onMouseEnter={over}
          onMouseLeave={out}
          onClick={() => onPricing(place)}
        >
          Pricing
        </button>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// VenueCard — responsive layout
// ─────────────────────────────────────────────────────────────────────────────

const VenueCard: React.FC<{
  place: PlaceItem;
  index: number;
  isbookingData: boolean;
  obmsId: string | null;
  onBook: (name: string) => void;
  onAvailability: (name: string) => void;
  onPricing: (place: PlaceItem) => void;
}> = ({
  place,
  index,
  isbookingData,
  obmsId,
  onBook,
  onAvailability,
  onPricing,
}) => {
  const isMobile = useIsMobile();
  const isReverse = index % 2 !== 0;
  const images = placeImages(place);

  const infoBlock = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h3
        style={{
          fontSize: isMobile ? "14px" : "15px",
          fontWeight: 800,
          color: "#18120E",
          margin: "0 0 10px",
          letterSpacing: "0.3px",
          textTransform: "uppercase",
          fontFamily: "playfair-display, serif",
        }}
      >
        {place?.name}
      </h3>

      {place.description && (
        <p
          style={{
            fontSize: "13px",
            color: "#3A2E26",
            lineHeight: 1.75,
            margin: "0 0 8px",
          }}
        >
          <ReactMarkdown>{place?.description}</ReactMarkdown>
        </p>
      )}

      {place.capacity && (
        <p
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#18120E",
            margin: "0 0 4px",
          }}
        >
          Seating Capacity: {place?.capacity}
        </p>
      )}

      <ActionButtons
        place={place}
        isbookingData={isbookingData}
        obmsId={obmsId}
        onBook={onBook}
        onAvailability={onAvailability}
        onPricing={onPricing}
      />
    </div>
  );

  const imageBlock = <ImageCarousel images={images} alt={place?.name} />;

  return (
    <div
      style={{
        background: "#FFE8F0",
        borderRadius: "16px",
        padding: isMobile ? "16px" : "24px",
        marginBottom: "16px",
      }}
    >
      {isMobile ? (
        // Mobile: always stack — image on top, info below
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {imageBlock}
          {infoBlock}
        </div>
      ) : (
        // Desktop: alternating two-column layout
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            alignItems: "center",
          }}
        >
          {isReverse ? (
            <>
              {imageBlock}
              {infoBlock}
            </>
          ) : (
            <>
              {infoBlock}
              {imageBlock}
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CategorySection
// ─────────────────────────────────────────────────────────────────────────────

const CategorySection: React.FC<{
  category: PriceCategory;
  categoryItem: CMSCategory | undefined;
  isbookingData: boolean;
  obmsId: string | null;
  onBook: (name: string) => void;
  onAvailability: (name: string) => void;
  onPricing: (place: PlaceItem) => void;
}> = ({
  category,
  categoryItem,
  isbookingData,
  obmsId,
  onBook,
  onAvailability,
  onPricing,
}) => {
  const description = categoryItem?.description;

  return (
    <section style={{ marginBottom: "40px" }}>
      <div style={{ marginBottom: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: description ? "8px" : "0",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(16px, 2.5vw, 22px)",
              fontWeight: 700,
              color: "#18120E",
              margin: 0,
            }}
          >
            {category.title.toUpperCase()}
          </h2>
        </div>

        {description && (
          <p
            style={{
              fontSize: "13px",
              color: "#4A3F35",
              lineHeight: 1.8,
              margin: 0,
              maxWidth: "900px",
            }}
          >
            {description}
          </p>
        )}
      </div>

      {category.places.map((place, i) => (
        <VenueCard
          key={`${category.name}__${place.name}__${i}`}
          place={place}
          index={i}
          isbookingData={isbookingData}
          obmsId={obmsId}
          onBook={onBook}
          onAvailability={onAvailability}
          onPricing={onPricing}
        />
      ))}
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Root component
// ─────────────────────────────────────────────────────────────────────────────

const CategoryWiseGalleryNew: React.FC<CategoryWiseGalleryNewProps> = ({
  placeName,
  bookNowClick,
  data,
  prices,
  isbookingData,
  obmsId,
}) => {
  const [activeTab, setActiveTab] = useState<string>(ALL_TAB);
  const [pricingPlace, setPricingPlace] = useState<PlaceItem | null>(null);

  const categoryLookup = useMemo<Record<string, CMSCategory>>(
    () =>
      (data ?? []).reduce<Record<string, CMSCategory>>((acc, item) => {
        acc[item?.name?.toLowerCase()] = item;
        return acc;
      }, {}),
    [data],
  );

  const tabs = useMemo<Tab[]>(() => {
    if (!prices) return [];
    return [
      { key: ALL_TAB, label: "All" },
      ...prices.map((c) => ({ key: c.name, label: c.title })),
    ];
  }, [prices]);

  const visibleCategories = useMemo<PriceCategory[]>(() => {
    if (!prices) return [];
    if (activeTab === ALL_TAB) return prices;
    return prices.filter((c) => c.name === activeTab);
  }, [prices, activeTab]);

  const mergedCategories = useMemo<PriceCategory[]>(() => {
    return visibleCategories.map((pCat) => {
      const cms = categoryLookup[pCat.name.toLowerCase()];
      return {
        ...pCat,
        title: cms?.title || pCat.title,
        description: cms?.description || "",
        places: pCat.places.map((pl) => {
          const cmsPlace = cms?.places?.find(
            (c) => c.name.toLowerCase() === pl.name.toLowerCase(),
          );
          return {
            ...pl,
            description: cmsPlace?.description || pl.description,
            images: cmsPlace?.gallery?.[0]?.image || pl.images,
          };
        }),
      };
    });
  }, [visibleCategories, categoryLookup]);

  const handleBook = useCallback(
    (_name: string) => {
      bookNowClick();
    },
    [bookNowClick],
  );
  const handleAvailability = useCallback((_name: string) => {
    console.log("Availability:", _name);
  }, []);
  const handlePricing = useCallback(
    (place: PlaceItem) => setPricingPlace(place),
    [],
  );
  const handleCloseModal = useCallback(() => setPricingPlace(null), []);

  if (!prices || prices.length === 0) {
    return (
      <p
        style={{
          padding: "40px",
          textAlign: "center",
          color: "#7A6A58",
          fontSize: "14px",
        }}
      >
        No venue information available for <strong>{placeName}</strong>.
      </p>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <FilterTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {mergedCategories.map((category) => (
        <CategorySection
          key={category.name}
          category={category}
          categoryItem={categoryLookup[category.name.toLowerCase()]}
          isbookingData={isbookingData}
          obmsId={obmsId}
          onBook={handleBook}
          onAvailability={handleAvailability}
          onPricing={handlePricing}
        />
      ))}

      {pricingPlace && (
        <PricingModal place={pricingPlace} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default CategoryWiseGalleryNew;