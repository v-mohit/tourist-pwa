import React from "react";
import Link from "next/link";

type DepartmentPlace = {
  id?: string;
  attributes?: {
    name?: string;
    images?: { data?: Array<{ attributes?: { url?: string } }> };
    city?: { data?: { attributes?: { name?: string } } };
    placeDetail?: { data?: { attributes?: { slug?: string } } };
  };
};

type Department = {
  id?: string;
  attributes?: {
    Name?: string;
    icon?: { data?: { attributes?: { url?: string } } };
    places?: { data?: DepartmentPlace[] };
  };
};

function getDeptEmoji(name?: string) {
  const n = (name || "").toLowerCase();
  if (n.includes("archaeological")) return "🏛";
  if (n.includes("development")) return "🏗";
  if (n.includes("kala") || n.includes("jkk")) return "🎨";
  if (n.includes("forest")) return "🌿";
  return "🏢";
}

export default function Departments({ data }: { data?: any }) {
  const buildAssetUrl = (rawUrl?: string) => {
    if (!rawUrl) return "";
    if (/^https?:\/\//i.test(rawUrl)) return rawUrl;
    const base = process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL || "";
    return `${base}${rawUrl}`;
  };

  const departments: Department[] = data?.departments?.data || [];

  if (!departments.length) return null;

  return (
    <section className="sec" id="partners" style={{ background: "var(--sand)" }}>
      <div className="sec-ctr rv in">
        <div className="sec-lbl">✦ Onboarded Partners</div>
        <h2 className="sec-ttl">Trusted Government Partners</h2>
      </div>

      <div className="partners-grid rv in">
        {departments.map((dept: Department, idx: number) => {
          const attr = dept?.attributes || {};
          const name = attr?.Name || "Department";
          const places: DepartmentPlace[] = attr?.places?.data || [];
          const count = places.length;

          const iconRawUrl = attr?.icon?.data?.attributes?.url;
          const iconUrl = buildAssetUrl(iconRawUrl);
          const fallbackIcon = getDeptEmoji(name);

          const label = name.toLowerCase().includes("kala kendra") || name.toLowerCase().includes("jkk")
            ? "Venue Onboarded"
            : "Tourist Sites Onboarded";

          return (
            <div className="partner-card" key={dept?.id || `${name}-${idx}`}>
              <div className="partner-icon">
                {iconUrl ? (
                  <img
                    src={iconUrl}
                    alt={name}
                    className="partner-icon-img"
                    loading="lazy"
                  />
                ) : (
                  fallbackIcon
                )}
              </div>

              <h4>{name}</h4>
              <div className="partner-num">{count}</div>
              <div className="partner-lbl">{label}</div>

              {places.length ? (
                <div className="partner-places">
                  {places.slice(0, 4).map((p: DepartmentPlace, pIdx: number) => {
                    const pAttr = p?.attributes || {};
                    const pName = pAttr?.name || "Place";
                    const pCity = pAttr?.city?.data?.attributes?.name || "Rajasthan";
                    const slug = pAttr?.placeDetail?.data?.attributes?.slug || p?.id || `${dept?.id}-${pIdx}`;

                    return (
                      <Link
                        key={p?.id || `${slug}-${pIdx}`}
                        href={`/place-detail/${slug}`}
                        className="partner-place"
                      >
                        <span className="partner-place-name">{pName}</span>
                        <span className="partner-place-city">📍 {pCity}</span>
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
