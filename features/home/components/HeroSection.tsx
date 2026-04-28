"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchBar, { type SearchBarHandle } from "./SearchBar";

const SLIDES = [
  {
    id: 1,
    title1: "Pink City",
    title2: "Hawa Mahal",
    sub: "Wander through the vibrant streets of Jaipur, where every wall tells a story of royal hospitality and timeless architectural brilliance.",
    img: "/images/hawawebp.jpg",
    thumbImg: "/images/hawawebp.jpg",
    label: "Hawa Mahal",
    tag: "Jaipur · Pink City",
  },
  {
    id: 2,
    title1: "Alwar",
    title2: "Sariska Reserve",
    sub: "Venture into the wild heart of the Aravallis, a sanctuary of untamed beauty where the stripes of the majestic tiger rule the rugged landscape.",
    img: "/images/tiger.webp",
    thumbImg: "/images/tiger.webp",
    label: "Sariska Tiger Reserve",
    tag: "Alwar · Project Tiger",
  },
  {
    id: 3,
    title1: "Churu",
    title2: "Tal Chhapar",
    sub: "Witness the sanctuary of the elegant Blackbuck, a unique grassland ecosystem where nature thrives in its purest, most serene form.",
    img: "/images/TalchaparWebp.jpg",
    thumbImg: "/images/TalchaparWebp.jpg",
    label: "Tal Chhapar Sanctuary",
    tag: "Churu · Grassland",
  },
  {
    id: 4,
    title1: "Jaipur",
    title2: "Amber Fort",
    sub: "Experience the royal majesty of Amber Fort, a breathtaking masterpiece of Rajput architecture perched atop the rugged Aravalli hills.",
    img: "/images/amberWebp.jpg",
    thumbImg: "/images/amberWebp.jpg",
    label: "Amber Fort",
    tag: "Jaipur · Hill Fort",
  },
];

const PILLS = [
  "🐯 Tiger Reserve",
  "🏜 Jaisalmer",
  "🌊 Udaipur",
  "✨ Light and Sound",
];

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const searchRef = useRef<SearchBarHandle>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSlideChange = (index: number) => {
    setActiveIndex(index);
    startTimer();
  };

  const handlePillClick = (pill: string) => {
    searchRef.current?.setValue(
      pill
        .replace(/^[\u{1F000}-\u{1FFFF}\u{2600}-\u{27FF}][\uFE0F]?\s*/u, "")
        .trim(),
    );
  };

  return (
    <section className="hero" id="hero">
      {/* Fullscreen slideshow backgrounds with Next.js Image */}
      <div className="hero-slides">
        {SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`hero-slide ${idx === activeIndex ? "active" : ""}`}
            // style={{ position: "relative", zIndex: idx === activeIndex ? 2 : 1 }}
          >
            <Image
              src={slide.img}
              alt={slide.label}
              fill
              style={{ objectFit: "cover" }}
              quality={90}
              priority={idx === activeIndex}
              loading={idx === activeIndex ? "eager" : "lazy"}
              sizes="100vw"
              placeholder="empty"
            />
          </div>
        ))}
      </div>

      {/* Left content pane */}
      <div className="hero-pane">
        {/* <div className="hero-kicker">
          {BADGES.map((badge, idx) => (
            <span key={idx} className={`hero-kicker-badge ${badge.cls}`}>
              {badge.label}
            </span>
          ))}
        </div> */}

        <h1 className="hero-ttl">
          {SLIDES[activeIndex].title1}
          <br />
          <em>{SLIDES[activeIndex].title2}</em>
        </h1>

        <div className="hero-divider" />

        <p className="hero-sub">{SLIDES[activeIndex].sub}</p>

        <div className="hero-search-wrap">
          <div className="hero-search-lbl">
            Search destinations, monuments, safaris…
          </div>
          <SearchBar ref={searchRef} />
          <div className="hero-pills">
            {PILLS.map((pill) => (
              <span
                key={pill}
                className="hero-pill"
                onClick={() => handlePillClick(pill)}
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

        <div className="hero-actions">
          <Link href="#destinations" className="hero-cta-primary">
            Explore Destinations →
          </Link>
          <Link href="#packages" className="hero-cta-secondary">
            🎫 View Packages
          </Link>
        </div>
      </div>

      {/* Right thumbnail strip */}
      <div className="hero-strip">
        {SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`hero-thumb ${idx === activeIndex ? "active" : ""}`}
            onClick={() => handleSlideChange(idx)}
          >
            <div
              className="hero-thumb-img"
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              <Image
                src={slide.thumbImg}
                alt={slide.label}
                fill
                style={{ objectFit: "cover" }}
                quality={90}
                loading="eager"
                sizes="(max-width: 768px) 60px, 100px"
                placeholder="empty"
              />
            </div>
            <div className="hero-thumb-ov" />
            <div className="hero-thumb-label">
              <h5>{slide.label}</h5>
              <span>{slide.tag}</span>
            </div>
            <div className="hero-thumb-bar" />
          </div>
        ))}
      </div>

      {/* Bottom slide counter + dots */}
      <div className="hero-counter">
        <div className="hero-dots">
          {SLIDES.map((_, idx) => (
            <div
              key={idx}
              className={`hero-dot ${idx === activeIndex ? "active" : ""}`}
              onClick={() => handleSlideChange(idx)}
            />
          ))}
        </div>
        <div className="hero-slide-num">
          0{activeIndex + 1} / 0{SLIDES.length}
        </div>
      </div>

      {/* Scroll hint */}
      {/* <div className="scroll-hint">
        <span>Scroll</span>
        <div className="scroll-ring" />
      </div> */}
    </section>
  );
}
