'use client';
import { useEffect, useRef, useState } from "react";

const statCards = [
  { ico: "✈️", num: "5.1 Cr+", lbl: "Total Tourists",    sub: "Annual FY 2023–24" },
  { ico: "🌍", num: "17.5 L+", lbl: "Foreign Tourists",  sub: "International Arrivals" },
  { ico: "🇮🇳", num: "4.9 Cr+", lbl: "Domestic Tourists", sub: "Within India Visitors" },
  { ico: "💰", num: "₹78,000 Cr", lbl: "Tourism Revenue", sub: "Gross state contribution" },
];

const barData = [
  { label: "Jaipur",        w: 88, val: "1.8 Cr+" },
  { label: "Jodhpur",       w: 70, val: "1.2 Cr+" },
  { label: "Udaipur",       w: 65, val: "1.1 Cr+" },
  { label: "Jaisalmer",     w: 50, val: "75 L+" },
  { label: "Ajmer–Pushkar", w: 45, val: "60 L+" },
];

const awardChips = [
  "🥇 Gold Category",
  "💻 Digital Governance",
  "🏛 e-Tourism Excellence",
  "🇮🇳 National Recognition",
];

const awardStats = [
  { n: "1 Lakh+", l: "Tickets Booked Online" },
  { n: "100+",    l: "Sites on OBMS Platform" },
  { n: "Zero",    l: "Queue Booking System" },
];

function useInView(threshold = 0.3): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, inView];
}

const TouristStats = () => {
  const [statsRef, statsInView] = useInView(0.2);
  const [barRef, barInView]     = useInView(0.2);
  const [awardRef, awardInView] = useInView(0.2);

  return (
    <div className="ts-root">

      {/* ════ TOURIST STATS ════ */}
      <section className="ts-stats-section">
        {/* Header */}
        <div className="ts-sec-ctr">
          <div className="ts-sec-lbl">✦ Tourist Statistics</div>
          <h2 className="ts-sec-ttl">
            Rajasthan Tourism<br />by the Numbers
          </h2>
          <p className="ts-sec-sub">Annual tourist data &amp; trends — FY 2023–24</p>
        </div>

        {/* Stat Cards */}
        <div
          ref={statsRef}
          className={`ts-stats-grid ts-rv${statsInView ? " ts-in" : ""}`}
        >
          {statCards.map((s, i) => (
            <div className="ts-stat-card" key={i}>
              <span className="ts-stat-ico">{s.ico}</span>
              <div className="ts-stat-num">{s.num}</div>
              <div className="ts-stat-lbl">{s.lbl}</div>
              <div className="ts-stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Bar Chart */}
        <div
          ref={barRef}
          className={`ts-bar-chart ts-rv${barInView ? " ts-in" : ""}`}
        >
          <div className="ts-bar-title">Top Visited Destinations</div>
          <div className="ts-bar-sub">Share of total tourist footfall — FY 2023–24</div>
          {barData.map((row, i) => (
            <div className="ts-bar-row" key={i}>
              <span className="ts-bar-label">{row.label}</span>
              <div className="ts-bar-track">
                <div
                  className="ts-bar-fill"
                  style={{ width: barInView ? `${row.w}%` : "0%" }}
                />
              </div>
              <span className="ts-bar-val">{row.val}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ════ OBMS / SKOCH AWARD ════ */}
      <section className="ts-award-section">
        <div
          ref={awardRef}
          className={`ts-award-wrap ts-rv${awardInView ? " ts-in" : ""}`}
        >
          {/* Trophy */}
          <div className="ts-award-trophy">
            <div className="ts-trophy-circle">
              <span>🏆</span>
              <p>SKOCH AWARD</p>
            </div>
            <div className="ts-award-year">2024 — Digital Governance Excellence</div>
          </div>

          {/* Info */}
          <div className="ts-award-info">
            <h2>
              OBMS Wins Prestigious<br />
              <em>SKOCH Award 2024</em>
            </h2>
            <p>
              The Online Booking Management System (OBMS) of the Government of
              Rajasthan has been honoured with the SKOCH Award — India&apos;s highest
              independent civilian honour for outstanding digital governance and
              e-governance excellence in tourism management.
            </p>

            <div className="ts-award-chips">
              {awardChips.map((chip, i) => (
                <span className="ts-award-chip" key={i}>{chip}</span>
              ))}
            </div>

            <div className="ts-award-stats">
              {awardStats.map((stat, i) => (
                <div className="ts-award-stat" key={i}>
                  <div className="ts-award-stat-n">{stat.n}</div>
                  <div className="ts-award-stat-l">{stat.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TouristStats;