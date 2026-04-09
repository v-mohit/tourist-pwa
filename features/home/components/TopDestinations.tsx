import Link from "next/link";

interface ImageAttributes {
  url: string;
}

interface ImageData {
  data: {
    attributes: ImageAttributes;
  };
}

interface CityAttributes {
  name: string;
  popularity: number;
  image: ImageData;
  cityDetail: {
    data: {
      attributes: {
        slug: string;
      };
    };
  };
}

interface City {
  attributes: CityAttributes;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
}

interface DestHeaderComponent {
  __typename: "ComponentDestinationDestHeader";
  id: string;
  title1: string;
  title2: string;
  title3: string;
  image: ImageData;
}

interface DestContentComponent {
  __typename: "ComponentDestinationDestContent";
  id: string;
}

type DestinationContent = DestHeaderComponent | DestContentComponent;

interface DestinationAttributes {
  content: DestinationContent[];
}

interface FetchDestinationResponse {
  cities: {
    meta: {
      pagination: Pagination;
    };
    data: City[];
  };
  destination: {
    data: {
      id: string;
      attributes: DestinationAttributes;
    };
  };
}

export default function TopDestinations({
  cities,
  destination,
}: FetchDestinationResponse) {
  const FEATURED_CITIES = [
    "Jaipur",
    "Udaipur",
    "Jodhpur",
    "Jaisalmer",
    "Alwar",
  ];

  const destinations = FEATURED_CITIES.map((cityName) =>
    cities?.data?.find(
      (c) => c.attributes.name.toLowerCase() === cityName.toLowerCase(),
    ),
  ).filter((c): c is City => Boolean(c));

  const headerBlock = destination?.data?.attributes?.content?.find(
    (c): c is DestHeaderComponent =>
      c.__typename === "ComponentDestinationDestHeader",
  );

  return (
    <section className="sec bg-[var(--cream)]" id="destinations">
      <div className="sec-hd">
        <div>
          <div className="sec-lbl">✦ Top Destinations</div>
          <h2 className="sec-ttl" style={{color:"black"}}>
            {headerBlock?.title1 ?? "Where do you want"}
            <br />
            {headerBlock?.title2 ?? "to explore?"}
          </h2>
        </div>
        <Link href="/exploreseeall" className="see-all">
          View all cities →
        </Link>
      </div>

      <div className="dest-grid">
        {destinations.map(({ attributes }) => {
          const { name, image, cityDetail } = attributes;
          const imageUrl = image?.data?.attributes?.url;
          const slug = cityDetail?.data?.attributes?.slug;
          const img = imageUrl?.startsWith("http")
            ? imageUrl
            : `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${imageUrl}`;

          return (
            <div key={name} className="dest-card">
              <div
                className="dimg"
                style={{ backgroundImage: `url('${img}')` }}
              />
              <div className="dest-grad" />
              <div className="dest-top">
                <span className="tag tg">⭐ Top Destination</span>
                <Link href={`/citydetail/${slug}`} className="dest-arr">
                  →
                </Link>
              </div>
              <div className="dest-foot">
                <h3>{name}</h3>
                <div className="dest-meta">
                  <span>📍 Rajasthan, India</span>
                  <span>🏛 Must Visit</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
