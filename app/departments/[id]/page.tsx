import Link from "next/link";
import { FetchDepartmentDataDocument } from "@/generated/graphql";
import { graphqlClient } from "@/services/client";

type DepartmentPlace = {
  id?: string | null;
  attributes?: {
    name?: string;
    city?: { data?: { attributes?: { name?: string } } };
    placeDetail?: { data?: { attributes?: { slug?: string } } };
  };
};

type Department = {
  id?: string | null;
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

export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const departmentData = await graphqlClient.request(FetchDepartmentDataDocument, {});
  const departments = departmentData?.departments?.data || [];

  const department = departments.find((d) => d.id === id);

  if (!department) {
    return (
      <section className="sec">
        <div className="sec-hd">
          <div>
            <div className="sec-lbl">✦ Department Places</div>
            <h1 className="sec-ttl">Department Not Found</h1>
          </div>
          <Link href="/departments" className="see-all">
            ← Back to Departments
          </Link>
        </div>
        <p>No department found for the selected id.</p>
      </section>
    );
  }

  const attr = department.attributes || {};
  const name = attr.Name || "Department";
  const places  = attr.places?.data || [];

  const iconRawUrl = attr.icon?.data?.attributes?.url;
  const iconUrl = buildAssetUrl(iconRawUrl);
  const fallbackIcon = getDeptEmoji(name);

  return (
    <section className="sec">
      <div className="sec-hd">
        <div>
          <div className="sec-lbl">✦ Department Places</div>
          <h1 className="sec-ttl">Places under {name}</h1>
        </div>
        <Link href="/departments" className="see-all">
          ← Back to Departments
        </Link>
      </div>

      {places.length === 0 ? (
        <p>No places available for this department.</p>
      ) : (
        <div className="partners-grid">
          {places.map((p: any, idx: number) => {
            const pAttr = p?.attributes || {};
            const pName = pAttr?.name || "Place";
            const pCity = pAttr?.city?.data?.attributes?.name || "Rajasthan";
            const slug =
              pAttr?.placeDetail?.data?.attributes?.slug ||
              p?.id ||
              `${department.id}-${idx}`;

            return (
              <Link
                key={p?.id || `${slug}-${idx}`}
                href={`/place-detail/${slug}`}
                className="partner-card"
              >
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
                <h4>{pName}</h4>
                <div className="partner-lbl">📍 {pCity}</div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
