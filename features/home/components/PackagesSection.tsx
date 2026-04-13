'use client';

import BookNowButton from '@/features/booking/components/BookNowButton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PackagesSection({ data }: any) {
  const router = useRouter();
  const packageList = data?.data?.topPackage?.data?.attributes?.package || 
                     data?.topPackage?.data?.attributes?.package || 
                     [];

                     console.log("package list---", packageList);
                     
  const updatedPackageList = packageList.slice(0,6)

  return (
    <section className="sec bg-[var(--ch)]" id="packages">
      {/* Header */}
      <div className="sec-hd">
        <div>
          <div className="sec-lbl text-[var(--gold)]">✦ Popular Packages</div>
          <h2 className="sec-ttl sec-ttl-w">
            Curated Darshan<br />Experiences
          </h2>
        </div>
        <Link href="/packageseeall" className="see-all sag">See all →</Link>
      </div>

      {/* Grid */}
      <div className="pkg-grid">
        {updatedPackageList.map((item: any, index: number) => {
          const pkgAttr = item?.package?.data?.attributes;
          if (!pkgAttr) return null;

          const name = pkgAttr.name || 'Rajasthan Package';
          const price = pkgAttr.price ? `₹${pkgAttr.price}` : '₹100';
          const rating = pkgAttr.rating ? `⭐ ${pkgAttr.rating}` : '⭐ 4.8';
          
          const img = pkgAttr.image?.data?.attributes?.url
            ? `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${pkgAttr.image.data.attributes.url}`
            : 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=600&auto=format&fit=crop&q=80';
          const placeId = pkgAttr.package_detail?.data?.id || '';
          const slug = pkgAttr.package_detail?.data?.attributes?.slug;
          const locationId = pkgAttr.package_detail?.data?.id;

          // Fields not provided in common are made static as per instructions
          const infos = ['🏯 10 Places', '🕐 Full Day', '🚌 Transport not Incl.', '🎟 Entry Tickets'];
          const badge = { label: 'COMPOSITE', cls: 'tg' };
          console.log("place id---", placeId);
          
          return (
            <div
              key={slug || index}
              className="pkg-card block no-underline decoration-transparent"
              style={{ cursor: slug ? 'pointer' : 'default' }}
              
            >
              <div className="block no-underline decoration-transparent"
              onClick={() => {
                if (slug) {
                  router.push(`/package-detail?slug=${slug}`);
                }
              }}
              >
                {/* Image */}
                <div className="pkg-img">
                  <div className="dimg" style={{ backgroundImage: `url('${img}')` }} />
                  <div className="pkg-grad" />
                  <div className="pkg-rating">{rating}</div>
                  <div className="pkg-badge">
                    <div className="amt">{price}</div>
                    <div className="per">per person</div>
                  </div>
                </div>

                {/* Body */}
                <div className="pkg-body text-[var(--cw)]">
                  <h3>{name}</h3>
                  <div className="pkg-info">
                    {infos.map((info) => (
                      <div key={info} className="pkg-ii">{info}</div>
                    ))}
                  </div>
                  <div className="pkg-foot">
                    <span className={`tag ${badge.cls}`} style={{ fontSize: 9 }}>{badge.label}</span>
                  </div>
                </div>
                
              </div>

              <div className="px-4 pb-4 -mt-2">
                {locationId ? (
                  <BookNowButton
                    config={{
                      placeId: locationId,
                      placeName: name,
                      category: 'package',
                      locationId,
                    }}
                    label="Book →"
                    className="btn-s"
                  />
                ) : (
                  <span className="btn-s opacity-40">Book →</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  )
}
