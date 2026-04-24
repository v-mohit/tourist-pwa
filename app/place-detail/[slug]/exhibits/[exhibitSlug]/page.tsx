import { FetchExhibitDetailDocument } from "@/generated/graphql";
import { graphqlClient } from "@/services/client";
import Image from "next/image";
import type { ComponentPlaceDetailPlaceexhibit } from "@/generated/graphql";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type PageProps = {
  params: {
    slug: string;
    exhibitSlug: string;
  };
};

interface ExhibitContentItem {
  title?: string | null;
  description?: string | null;
  image?: {
    data?: {
      id?: string | null;
      attributes?: {
        url: string;
        alternativeText?: string | null;
      } | null;
    } | null;
  } | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const IMG_BASE = (process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL ?? "").replace(/\/$/, "");

function resolveUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return path.startsWith("http") ? path : `${IMG_BASE}${path}`;
}

// Pretty-print slug → "Jawahar Kala Kendra"
function formatSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default async function Page({ params }: PageProps) {
    const { slug, exhibitSlug } = await params;

  const slugParam        = decodeURIComponent(slug);
  const exhibitSlugParam = decodeURIComponent(exhibitSlug);

  const data = await graphqlClient.request(FetchExhibitDetailDocument, {
    slug: slugParam,
    exhibitSlug: exhibitSlugParam,
  });

  const contentArray = data?.placeDetails?.data?.[0]?.attributes?.content;

  const exhibitComponent = contentArray?.find(
    (item): item is ComponentPlaceDetailPlaceexhibit =>
      item?.__typename === "ComponentPlaceDetailPlaceexhibit"
  );

  const exhibitData = exhibitComponent?.exhibit?.[0];
  const content     = (exhibitData?.content ?? []) as ExhibitContentItem[];

  // ── Guard: nothing found ──────────────────────────────────────────────────
  if (!exhibitData) {
    return (
      <div style={{ padding: "60px 24px", textAlign: "center", fontFamily: "'Inter', sans-serif" }}>
        <p style={{ fontSize: "14px", color: "#7A6A58" }}>Exhibit not found.</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#FAFAFA", minHeight: "100vh" }}>

      {/* ── Hero banner ── */}
      <div
        style={{
          background: "linear-gradient(135deg,#E8631A,#FF69B4)",
          padding: "40px 24px 36px",
        }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>

          {/* Breadcrumb */}
          <p
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.75)",
              fontWeight: 700,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              margin: "0 0 10px",
            }}
          >
            {formatSlug(slugParam)}
            <span style={{ margin: "0 6px", opacity: 0.6 }}>›</span>
            Exhibits
          </p>

          {/* Exhibit name */}
          <h1
            style={{
              fontSize: "clamp(22px, 4vw, 32px)",
              fontWeight: 800,
              color: "#fff",
              margin: 0,
              lineHeight: 1.25,
              fontFamily: "playfair-display, serif",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {exhibitData.name}
          </h1>

          {/* Item count pill */}
          {content.length > 0 && (
            <span
              style={{
                display: "inline-block",
                marginTop: "14px",
                background: "rgba(255,255,255,0.2)",
                color: "#fff",
                fontSize: "11px",
                fontWeight: 700,
                padding: "5px 14px",
                borderRadius: "99px",
                letterSpacing: "0.3px",
              }}
            >
              {content.length} {content.length === 1 ? "item" : "items"}
            </span>
          )}
        </div>
      </div>

      {/* ── Content list ── */}
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "32px 24px 64px" }}>

        {content.length === 0 ? (
          <div
            style={{
              background: "#FFF0F7",
              border: "1px solid #FFD6E8",
              borderRadius: "16px",
              padding: "40px",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "14px", color: "#7A6A58", margin: 0 }}>
              No content available for this exhibit yet.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {content.map((item, index) => {
              const imageUrl = resolveUrl(item.image?.data?.attributes?.url);
              const altText  = item.image?.data?.attributes?.alternativeText || item.title || "exhibit image";
              const isEven   = index % 2 === 0;

              return (
                <div
                  key={index}
                  style={{
                    background: "#FFE8F0",
                    borderRadius: "16px",
                    overflow: "hidden",
                  }}
                >
                  {/* Desktop: side-by-side alternating layout */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: imageUrl ? "1fr 1fr" : "1fr",
                      gap: "0",
                    }}
                    className="exhibit-card-grid"
                  >
                    {/* Text block */}
                    <div
                      style={{
                        padding: "28px 28px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        order: isEven ? 1 : 2,
                      }}
                    >
                      {/* Index badge */}
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "28px",
                          height: "28px",
                          background: "linear-gradient(135deg,#E8631A,#FF69B4)",
                          color: "#fff",
                          fontSize: "11px",
                          fontWeight: 800,
                          borderRadius: "50%",
                          marginBottom: "12px",
                          flexShrink: 0,
                        }}
                      >
                        {index + 1}
                      </span>

                      {item.title && (
                        <h2
                          style={{
                            fontSize: "clamp(15px, 2.2vw, 18px)",
                            fontWeight: 800,
                            color: "#18120E",
                            margin: "0 0 12px",
                            lineHeight: 1.3,
                            textTransform: "uppercase",
                            letterSpacing: "0.3px",
                            fontFamily: "playfair-display, serif",
                          }}
                        >
                          {item.title}
                        </h2>
                      )}

                      {item.description && (
                        <p
                          style={{
                            fontSize: "13px",
                            color: "#3A2E26",
                            lineHeight: 1.8,
                            margin: 0,
                          }}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Image block */}
                    {imageUrl && (
                      <div
                        style={{
                          position: "relative",
                          minHeight: "260px",
                          order: isEven ? 2 : 1,
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          src={imageUrl}
                          alt={altText}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Responsive grid override — collapse to single column on mobile */}
      <style>{`
        @media (max-width: 640px) {
          .exhibit-card-grid {
            grid-template-columns: 1fr !important;
          }
          .exhibit-card-grid > * {
            order: unset !important;
          }
        }
      `}</style>
    </div>
  );
}