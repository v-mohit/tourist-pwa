import Link from "next/link";
import { FetchDepartmentDataDocument } from "@/generated/graphql";
import { graphqlClient } from "@/services/client";

type DepartmentPlace = {
  id?: string;
  attributes?: {
    name?: string;
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

function buildAssetUrl(rawUrl?: string) {
  if (!rawUrl) return "";
  if (/^https?:\/\//i.test(rawUrl)) return rawUrl;
  const base = process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL || "";
  return `${base}${rawUrl}`;
}

export const revalidate = 60;

export default async function DepartmentsPage() {
  const departmentData = await graphqlClient.request(FetchDepartmentDataDocument, {});
  const departments = (departmentData?.departments?.data || []) as Department[];

  if (!departments.length) {
    return (
      <section className="sec">
        <div className="sec-hd">
          <div>
            <div className="sec-lbl">✦ All Departments</div>
            <h1 className="sec-ttl">Government Departments</h1>
          </div>
          <Link href="/" className="see-all">
            ← Back to Home
          </Link>
        </div>
        <p>No departments available.</p>
      </section>
    );
  }

  return (
    <section className="sec">
      <div className="sec-hd">
        <div>
          <div className="sec-lbl">✦ All Departments</div>
          <h1 className="sec-ttl">Departments & Onboarded Places</h1>
        </div>
        <Link href="/" className="see-all">
          ← Back to Home
        </Link>
      </div>

      <div className="partners-grid">
        {departments.map((dept: Department, idx: number) => {
          const attr = dept?.attributes || {};
          const name = attr?.Name || "Department";
          const places: DepartmentPlace[] = attr?.places?.data || [];
          const count = places.length;

          const iconRawUrl = attr?.icon?.data?.attributes?.url;
          const iconUrl = buildAssetUrl(iconRawUrl);
          const fallbackIcon = getDeptEmoji(name);

          const label =
            name.toLowerCase().includes("kala kendra") ||
            name.toLowerCase().includes("jkk")
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
                  {places.map((p: DepartmentPlace, pIdx: number) => {
                    const pAttr = p?.attributes || {};
                    const pName = pAttr?.name || "Place";
                    const pCity =
                      pAttr?.city?.data?.attributes?.name || "Rajasthan";
                    const slug =
                      pAttr?.placeDetail?.data?.attributes?.slug ||
                      p?.id ||
                      `${dept?.id}-${pIdx}`;

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

