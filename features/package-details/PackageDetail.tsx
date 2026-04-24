'use client';
 
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BookNowButton from '@/features/booking/components/BookNowButton';
 
const PackageDetail = ({ data }: any) => {
  const router = useRouter();
  const pkgData = data?.packageDetails?.data?.[0];
  const pkg = pkgData?.attributes;
  if (!pkg) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-4xl text-[var(--gold)]">⏳</div>
        <h2 className="text-2xl font-bold">Package Not Found</h2>
        <Link href="/" className="btn-p">Go Home</Link>
      </div>
    );
  }

  const images = pkg.images?.data || [];
  const mainImage = images[0]?.attributes?.url
    ? `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${images[0].attributes.url}`
    : null;

  const overviewText = pkg.overview || pkg.description || '';

  // Helper to extract price from text using regex
  const extractPrice = (label: string) => {
    // Matches "Label - 123", "Label: 123", "Label-123", etc.
    const regex = new RegExp(`${label}\\s*[:\\-]?\\s*(\\d+)`, 'i');
    const match = overviewText.match(regex);
    return match ? match[1] : null;
  };

  const prices = {
    indianCitizen: extractPrice('Indian Citizen') || extractPrice('Indian') || extractPrice('Adult') || pkg.price,
    indianStudent: extractPrice('Indian Student') || extractPrice('Student'),
    foreignerCitizen: extractPrice('Foreigner Citizen') || extractPrice('Foreigner') || extractPrice('International') || extractPrice('Non-Resident'),
    foreignerStudent: extractPrice('Foreigner Student') || extractPrice('International Student'),
  };

  const rawGroups = pkg.places;
  const groups = Array.isArray(rawGroups) ? rawGroups : (rawGroups ? [rawGroups] : []);

  // Calculate total places count
  const totalPlaces = groups.reduce((acc: number, group: any) => acc + (group.places?.data?.length || 0), 0);
  const totalDays = pkg.days || null;

  // Extract dynamic categories from the places within this specific package
  const allCategories = new Set<string>();
  groups.forEach((group: any) => {
    group.places?.data?.forEach((place: any) => {
      place.attributes?.categories?.data?.forEach((cat: any) => {
        if (cat.attributes?.Name) allCategories.add(cat.attributes.Name);
      });
    });
  });
  const dynamicCats = Array.from(allCategories);

  // Helper to parse description parts
  const parsed = React.useMemo(() => {
    if (!overviewText) return { paragraphs: [], prices: [] };
    let text = overviewText.trim();
    if (text.startsWith('\\')) text = text.substring(1).trim();

    // 1. Extract Price patterns (e.g. Indian Citizen-450)
    const priceLabels = ['Indian Citizen', 'Indian Student', 'Foreigner Citizen', 'Foreigner Student'];
    const extractedPrices: string[] = [];
    let workingText = text;

    priceLabels.forEach(label => {
      // Synced with extractPrice regex
      const regex = new RegExp(`${label}\\s*[:\\-]?\\s*\\d+`, 'gi');
      workingText = workingText.replace(regex, (match: any) => {
        extractedPrices.push(match.trim());
        return "";
      });
    });

    // Clean up trailing separators/commas and stray backslashes
    workingText = workingText.replace(/\\/g, ' ').replace(/\s+/g, ' ').trim();
    workingText = workingText.replace(/[,/\\]\s*$/, '').trim();

    // 2. Split into paragraphs
    let paragraphs = workingText.split(/\r?\n\r?\n|\r?\n/).map((p: any) => p.trim()).filter((p: string) => p && p !== '\\');

    if (paragraphs.length === 1 && workingText.includes('. ')) {
      const splits = workingText.split(/(?<=museums\.)|(?<=unseen\.)|(?<=booking\.)/i);
      if (splits.length > 1) {
        paragraphs = splits.map((s: any) => s.trim()).filter((s: string) => s && s !== '\\');
      } else {
        paragraphs = workingText.split(/(?<=\. )/).map((p: any) => p.trim()).filter((p: string) => p && p !== '\\');
      }
    }

    return { paragraphs, prices: extractedPrices };
  }, [overviewText]);

  // For packages, we take a reference city from the first place or default to Jaipur
  const refCity = groups[0]?.places?.data?.[0]?.attributes?.city?.data?.attributes?.name || 'Jaipur';
  const nearbyPlacesMock: Record<string, string[]> = {
    'Jaipur': ['Amber Fort', 'Nahargarh Fort', 'Nahargarh Biological Park', 'Jantar Mantar', 'Isarlat', 'Sisodia Rani Bagh', 'Vidhyadhar Garden'],
    'Udaipur': ['City Palace', 'Lake Pichola', 'Jag Mandir', 'Saheliyon Ki Bari'],
    'Jodhpur': ['Mehrangarh Fort', 'Jaswant Thada', 'Umaid Bhawan Palace'],
  };

  const distancesText = React.useMemo(() => {
    const nearby = nearbyPlacesMock[refCity] || nearbyPlacesMock['Jaipur'];
    const distanceList = nearby.map((n: string) => {
      const knownDist: Record<string, string> = {
        'Nahargarh Fort': '10.0 km',
        'Government Central Museum Albert Hall': '10.0 km',
        'Hawa Mahal': '8.5 km',
        'Jantar Mantar': '8.2 km',
        'Isarlat': '9.0 km',
        'Sisodia Rani Bagh': '12.6 km',
        'Vidhyadhar Garden': '12.0 km'
      };
      return `${n} - ${knownDist[n] || (Math.random() * 10 + 2).toFixed(1) + ' km'}`;
    });
    return {
      prefix: `The distances to nearby tourist places from ${pkg.name} are as follows:`,
      list: distanceList.join(', ')
    };
  }, [refCity, pkg.name]);
  return (
    <div className="pkg-v2-container">
      <button
        type="button"
        onClick={() => (window.history.length > 1 ? router.back() : router.push('/'))}
        className="see-all-back"
        style={{ cursor: 'pointer', background: 'none', border: 'none', borderBottom: '1px solid currentColor', paddingLeft: '5px', paddingBottom: '2px' }}
      >
        ← Back
      </button>
      {/* ── HERO SECTION ── */}
      <section className="pkg-v2-hero">
        <div
          className="pkg-v2-hero-bg"
          style={{ backgroundImage: `url('${mainImage}')` }}
        />
        <div className="pkg-v2-hero-overlay" />
        <div className="pkg-v2-hero-content">
          <div className="pkg-v2-hero-tag">Sightseeing Package</div>
          <h1>{pkg.name}</h1>
          <p className="pkg-v2-hero-desc">
            {parsed.paragraphs[0] || 'Journey through Rajasthan — iconic landmarks, palace corridors alive with history, and timeless heritage.'}
          </p>
          <div className="pkg-v2-hero-meta">
            <div className="pkg-v2-hero-meta-item"><div className="icon">🗺</div> {totalPlaces} Iconic Places</div>
            {totalDays && <div className="pkg-v2-hero-meta-item"><div className="icon">📅</div> Valid {totalDays} Days</div>}
            <div className="pkg-v2-hero-meta-item"><div className="icon">🎟</div> Single Composite Pass</div>
            <div className="pkg-v2-hero-meta-item"><div className="icon">📍</div> {refCity}, Rajasthan</div>
          </div>
        </div>
      </section>

      {/* ── OVERVIEW + PRICING ── */}
      <div className="pkg-v2-page-wrap">
        <div className="pkg-v2-overview-section">
          <div className="pkg-v2-overview-left">
            <div className="pkg-v2-section-eyebrow">Overview</div>
            <h2 className="pkg-v2-section-title">Experience the Heritage</h2>
            {parsed.paragraphs.map((p: any, i: number) => (
              <p key={i} className="pkg-v2-overview-body">
                {p}
              </p>
            ))}
            {totalDays && (
              <div className="pkg-v2-valid-note">
                ⏳ &nbsp; Valid for <strong>{totalDays} days</strong> from selected visit date at time of booking
              </div>
            )}
          </div>

          <div className="pkg-v2-pricing-card">
            <div className="pkg-v2-pricing-header">
              <div className="pkg-v2-ph-label">Ticket Pricing</div>
              <div className="pkg-v2-ph-title">{pkg.name} Pass</div>
              <div className="pkg-v2-ph-sub">Composite · All {totalPlaces || 'Multiple'} Attractions</div>
            </div>
            <div className="pkg-v2-pricing-rows">
              {prices.indianCitizen && (
                <div className="pkg-v2-pricing-row">
                  <div className="pkg-v2-pr-label"><span className="pkg-v2-pr-flag">🇮🇳</span> Indian Citizen</div>
                  <div className="pkg-v2-pr-price">₹{prices.indianCitizen} <span>/ person</span></div>
                </div>
              )}
              {prices.indianStudent && (
                <div className="pkg-v2-pricing-row">
                  <div className="pkg-v2-pr-label"><span className="pkg-v2-pr-flag">🎓</span> Indian Student</div>
                  <div className="pkg-v2-pr-price">₹{prices.indianStudent} <span>/ person</span></div>
                </div>
              )}
              {prices.foreignerCitizen && (
                <div className="pkg-v2-pricing-row">
                  <div className="pkg-v2-pr-label"><span className="pkg-v2-pr-flag">🌍</span> Foreigner Citizen</div>
                  <div className="pkg-v2-pr-price">₹{prices.foreignerCitizen} <span>/ person</span></div>
                </div>
              )}
              {prices.foreignerStudent && (
                <div className="pkg-v2-pricing-row">
                  <div className="pkg-v2-pr-label"><span className="pkg-v2-pr-flag">🎓</span> Foreigner Student</div>
                  <div className="pkg-v2-pr-price">₹{prices.foreignerStudent} <span>/ person</span></div>
                </div>
              )}
            </div>
            {totalDays && (
              <div className="pkg-v2-pricing-validity">
                <span>⏳</span> Valid for {totalDays} days from selected date
              </div>
            )}
            <div className="pkg-v2-pricing-cta">
              <BookNowButton
                config={{
                  placeId: pkg.obmsId || pkgData?.id,
                  placeName: pkg.name,
                  category: 'package',
                  locationId: pkgData?.id,
                }}
                disabled={pkg.bookable === false}
                label="Book This Package"
                className="w-full bg-[var(--terracotta)] text-white border-none p-[14px] font-[var(--font-raleway)] text-[12px] font-bold tracking-[2px] uppercase rounded-[3px] cursor-pointer transition-all duration-200 hover:bg-[var(--terracotta-light)] hover:-translate-y-[1px]"
              />
              <div className="pkg-v2-pcta-note">Secure booking · Instant confirmation</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div className="pkg-v2-ornament">✦ ✦ ✦</div>

      {/* ── ATTRACTIONS ── */}
      <div className="pkg-v2-page-wrap">
        <section className="pkg-v2-attractions">
          <div className="pkg-v2-section-header-row">
            <div>
              <div className="pkg-v2-section-eyebrow">Included Attractions</div>
              <h2 className="pkg-v2-section-title">Places to Explore</h2>
            </div>
            <div className="pkg-v2-section-count">{totalPlaces} Destinations</div>
          </div>

          <div className="pkg-v2-grid">
            {groups.flatMap((group: any) => group.places?.data || []).map((place: any, idx: number) => {
              const pAttr = place.attributes;
              const imgUrl = pAttr.images?.data?.[0]?.attributes?.url;
              const pImg = imgUrl ? `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${imgUrl}` : null;
              const placeName = pAttr.name;
              const targetSlug = pAttr.placeDetail?.data?.attributes?.slug;
              const category = pAttr.categories?.data?.[0]?.attributes?.Name || 'Monument';

              return (
                <Link
                  key={idx}
                  href={targetSlug ? `/place-detail/${targetSlug}` : '#'}
                  className="pkg-v2-place-card"
                >
                  <div className="pkg-v2-card-img">
                    {pImg && <img src={pImg} alt={placeName} />}
                    <div className="pkg-v2-card-overlay" />
                    <div className="pkg-v2-card-num">{idx + 1}</div>
                  </div>
                  <div className="pkg-v2-card-body">
                    <div className="pkg-v2-card-name">{placeName}</div>
                    <p className="pkg-v2-card-desc">
                      Explore this iconic landmark of {refCity}, rich in history and architectural beauty.
                    </p>
                    <span className="pkg-v2-card-tag">{category}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PackageDetail;