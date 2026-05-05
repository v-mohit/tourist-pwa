"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchBar, { type SearchBarHandle } from "./SearchBar";

const PILLS = [
  "🐯 Tiger Reserve",
  "🏜 Jaisalmer",
  "🌊 Udaipur",
  "✨ Light and Sound",
];

export default function HeroSection({ data }: any) {
  const [activeIndex, setActiveIndex] = useState(0);
  const searchRef = useRef<SearchBarHandle>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const imgPrefix = process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL || "";
  const slides = data?.card || [];

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
  };

  useEffect(() => {
    if (slides.length > 0) startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length]);

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

  const getSplitTitle = (fullTitle: string) => {
    if (!fullTitle) return { t1: "", t2: "" };
    const words = fullTitle.split(" ");
    if (words.length === 1) return { t1: words[0], t2: "" };
    const mid = Math.ceil(words.length / 2);
    return {
      t1: words.slice(0, mid).join(" "),
      t2: words.slice(mid).join(" "),
    };
  };

  const activeSlide = slides[activeIndex];
  const { t1, t2 } = getSplitTitle(activeSlide?.slideTitle || "");

  return (
    <section className="hero" id="hero">
      {/* ✅ Background Slides */}
      <div className="hero-slides">
        {slides.map((slide: any, idx: number) => (
          <div
            key={idx}
            className={`hero-slide ${idx === activeIndex ? "active" : ""}`}
          >
            <Image
              src={`${imgPrefix}${slide?.image?.data?.attributes?.url}`}
              alt={slide?.slideTitle || "slide"}
              fill
              unoptimized
              priority={idx === 0}
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>

      {/* ✅ Content */}
      <div className="hero-body">
        <h1 className="hero-ttl">
          {t1}
          <br />
          <em>{t2}</em>
        </h1>

        <div className="hero-divider" />

        <p className="hero-sub">
          {activeSlide?.slideDescription}
        </p>

        {/* Search */}
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

        {/* Buttons */}
        <div className="hero-actions">
          <Link href="#destinations" className="hero-cta-primary">
            Explore Destinations →
          </Link>
          <Link href="#packages" className="hero-cta-secondary">
            🎫 View Packages
          </Link>
        </div>
      </div>

      {/* ✅ Bottom Dots */}
      <div className="hero-counter">
        <div className="hero-dots">
          {slides.map((_: any, idx: number) => (
            <div
              key={idx}
              className={`hero-dot ${idx === activeIndex ? "active" : ""}`}
              onClick={() => handleSlideChange(idx)}
            />
          ))}
        </div>

        <div className="hero-slide-num">
          {slides.length > 0
            ? `0${activeIndex + 1} / 0${slides.length}`
            : "00 / 00"}
        </div>
      </div>
    </section>
  );
}