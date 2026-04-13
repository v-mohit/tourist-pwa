import Link from 'next/link';

export default function PackagesSection({ data }: any) {
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

          // Fields not provided in common are made static as per instructions
          const infos = ['🏯 10 Places', '🕐 Full Day', '🚌 Transport not Incl.', '🎟 Entry Tickets'];
          const badge = { label: 'COMPOSITE', cls: 'tg' };
          console.log("place id---", placeId);
          
          return (
            <Link 
              key={slug || index} 
              href={slug ? `/package-detail?slug=${slug}` : '#'}
              className="pkg-card block no-underline decoration-transparent"
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
                  <span className="btn-s">Book →</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  )
}

