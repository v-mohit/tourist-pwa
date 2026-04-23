"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  GetAllJkkDetails,
  JkkAdvanceAvailability,
} from "@/services/apiCalls/jkk.service";
import AvailabilityModal from "@/components/popups/JkkAvailabilityModal";
import JkkPricingModal from "../popups/JkkPricingModal";

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
// JKK API types (from GetAllJkkDetails response)
// ─────────────────────────────────────────────────────────────────────────────

interface JkkShift {
  id: string;
  name: string;
}

interface JkkSubCategory {
  id: string;
  name: string;
  jkkShiftList: JkkShift[];
}

interface JkkCategory {
  id: string;
  name: string;
  jkkSubCategoryList: JkkSubCategory[];
}

interface JkkDetails {
  id: string;
  jkkCategoryList: JkkCategory[];
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
    handler();
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
// Epoch helpers  — start-of-day and end-of-day for 1st and last of a month
// ─────────────────────────────────────────────────────────────────────────────

function getMonthEpochRange(date: Date): { start: number; end: number } {
  const year = date.getFullYear();
  const month = date.getMonth();

  const start = new Date(year, month, 1, 0, 0, 0, 0).getTime();
  const end = new Date(year, month + 1, 0, 23, 59, 59, 999).getTime();

  return { start, end };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const ALL_TAB = "all";

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
    touchAction: "manipulation",
  };

  return (
    <div
      style={{
        position: "relative",
        borderRadius: "12px",
        overflow: "hidden",
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
  minHeight: "40px",
  touchAction: "manipulation",
};

const ActionButtons: React.FC<{
  place: PlaceItem;
  isbookingData: boolean;
  obmsId: string | null;
  onBook: (name: string) => void;
  onAvailability: (name: string) => void;
  onPricing: (place: PlaceItem) => void;
  isAvailabilityLoading?: boolean;
}> = ({
  place,
  isbookingData,
  obmsId,
  onBook,
  onAvailability,
  onPricing,
  isAvailabilityLoading,
}) => {
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
        disabled={isAvailabilityLoading}
        style={{
          ...pill,
          width: isMobile ? "100%" : undefined,
          textAlign: "center",
          opacity: isAvailabilityLoading ? 0.65 : 1,
          cursor: isAvailabilityLoading ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
        }}
        onMouseEnter={isAvailabilityLoading ? undefined : over}
        onMouseLeave={isAvailabilityLoading ? undefined : out}
        onClick={() => !isAvailabilityLoading && onAvailability(place.name)}
      >
        {isAvailabilityLoading ? (
          <>
            <span
              style={{
                width: "12px",
                height: "12px",
                border: "2px solid rgba(255,255,255,0.4)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                display: "inline-block",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            Checking…
          </>
        ) : (
          "Availability"
        )}
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
// VenueCard
// ─────────────────────────────────────────────────────────────────────────────

const VenueCard: React.FC<{
  place: PlaceItem;
  index: number;
  isbookingData: boolean;
  obmsId: string | null;
  onBook: (name: string) => void;
  onAvailability: (name: string) => void;
  onPricing: (place: PlaceItem) => void;
  availabilityLoadingFor: string | null;
}> = ({
  place,
  index,
  isbookingData,
  obmsId,
  onBook,
  onAvailability,
  onPricing,
  availabilityLoadingFor,
}) => {
  const isMobile = useIsMobile();
  const isReverse = index % 2 !== 0;
  const images = placeImages(place);

  const isAvailabilityLoading =
    availabilityLoadingFor?.toLowerCase() === place.name.toLowerCase();

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
        isAvailabilityLoading={isAvailabilityLoading}
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
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {imageBlock}
          {infoBlock}
        </div>
      ) : (
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
  availabilityLoadingFor: string | null;
}> = ({
  category,
  categoryItem,
  isbookingData,
  obmsId,
  onBook,
  onAvailability,
  onPricing,
  availabilityLoadingFor,
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
          availabilityLoadingFor={availabilityLoadingFor}
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

  // ── Availability state ──────────────────────────────────────────────────────
  const [availabilityLoadingFor, setAvailabilityLoadingFor] = useState<
    string | null
  >(null);
  const [availabilityModal, setAvailabilityModal] = useState<{
    venueName: string;
    data: any;
    error: string | null;
    month: Date;
  } | null>(null);

  // ── API hooks ──────────────────────────────────────────────────────────────
  const { data: jkkDetails } = GetAllJkkDetails();
  const { mutateAsync: fetchAvailability } = JkkAdvanceAvailability();

  // ── Pre-build a lookup: subCategory name (uppercase) → { categoryId, subCategoryId }
  const jkkLookup = useMemo<
    Record<string, { categoryId: string; subCategoryId: string }>
  >(() => {
    const map: Record<string, { categoryId: string; subCategoryId: string }> =
      {};
    const details: JkkDetails | undefined = jkkDetails;
    if (!details?.jkkCategoryList) return map;

    for (const cat of details.jkkCategoryList) {
      for (const sub of cat.jkkSubCategoryList ?? []) {
        // Normalise to uppercase for case-insensitive matching
        map[sub.name.toUpperCase()] = {
          categoryId: cat.id,
          subCategoryId: sub.id,
        };
      }
    }
    return map;
  }, [jkkDetails]);

  // ── Category / tab helpers ─────────────────────────────────────────────────
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

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleBook = useCallback(
    (_name: string) => {
      bookNowClick();
    },
    [bookNowClick],
  );

  const handleAvailability = useCallback(
    async (venueName: string) => {
      // 1. Look up categoryId + subCategoryId from JKK details
      const ids = jkkLookup[venueName.toUpperCase()];

      if (!ids) {
        // Venue not found in JKK system — open modal with a friendly error
        setAvailabilityModal({
          venueName,
          data: null,
          error: "Availability information is not configured for this venue.",
          month: new Date(),
        });
        return;
      }

      // 2. Build payload for current month
      const now = new Date();
      const { start, end } = getMonthEpochRange(now);

      const payload = {
        bookingStartDate: start,
        bookingEndDate: end,
        categoryId: ids.categoryId,
        subCategoryId: ids.subCategoryId,
        auth: false,
        preDays: 0,
      };

      // 3. Show loading state on the specific card's button
      setAvailabilityLoadingFor(venueName);

      try {
        const result = await fetchAvailability(payload);

        // 4. Open modal with response data
        setAvailabilityModal({
          venueName,
          data: result,
          error: null,
          month: now,
        });
      } catch (err: any) {
        setAvailabilityModal({
          venueName,
          data: null,
          error:
            err?.message ?? "Failed to fetch availability. Please try again.",
          month: now,
        });
      } finally {
        setAvailabilityLoadingFor(null);
      }
    },
    [jkkLookup, fetchAvailability],
  );

  const handlePricing = useCallback(
    (place: PlaceItem) => setPricingPlace(place),
    [],
  );
  const handleCloseModal = useCallback(() => setPricingPlace(null), []);
  const handleCloseAvailability = useCallback(
    () => setAvailabilityModal(null),
    [],
  );

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
          availabilityLoadingFor={availabilityLoadingFor}
        />
      ))}

      {/* Pricing modal */}
      {pricingPlace && (
        <JkkPricingModal place={pricingPlace} onClose={handleCloseModal} />
      )}

      {/* Availability modal */}
      {availabilityModal && (
        <AvailabilityModal
          venueName={availabilityModal.venueName}
          availabilityData={availabilityModal.data}
          onClose={handleCloseAvailability}
          isLoading={false}
          error={availabilityModal.error}
          // currentMonth={availabilityModal.month}
        />
      )}
    </div>
  );
};

export default CategoryWiseGalleryNew;
