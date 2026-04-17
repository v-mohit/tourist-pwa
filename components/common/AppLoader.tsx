'use client';

import { useState, useEffect } from 'react';
import './AppLoader.css';

const TAGLINES = [
  "The Land of Kings awaits you…",
  "Where every fort tells a story…",
  "Deserts, Dunes & Royal Sunsets…",
  "Tigers, Lakes & Living Heritage…",
  "Colours of Rajasthan unfolding…",
  "From Jaipur to Jaisalmer — discover more…"
];

const ORBIT_ICONS = [
  { label: 'Fort', path: 'M6 18L6 10L12 4L18 10L18 18Z M9 18L9 13L12 11L15 13L15 18' },
  { label: 'Palace', path: 'M3 20h18M5 20V8l7-5 7 5v12M9 20v-5h6v5' },
  { label: 'Tiger', path: 'M12 2C8 2 4 6 4 10c0 5 4 8 8 10 4-2 8-5 8-10 0-4-4-8-8-8z' },
  { label: 'Desert', path: 'M2 20Q6 12 12 14Q18 16 22 8 M12 14L10 20 M12 14L14 20' },
  { label: 'Temple', path: 'M12 2L8 8H4v2h16V8h-4L12 2z M6 10v10h12V10 M10 14h4v6h-4z' },
  { label: 'Lake', path: 'M2 12C5 8 9 6 12 8s7 0 10-4 M2 17C5 13 9 11 12 13s7 0 10-4' },
  { label: 'Festival', path: 'M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z' },
  { label: 'Camel', path: 'M6 20v-6c0-2 1-3 3-4V8c0-1 1-2 2-1l1 1c1-1 2-1 3 0v2c2 1 3 2 3 4v6' },
];

const PROGRESS_STEPS = [
  { at: 15, text: 'Loading forts & palaces…' },
  { at: 35, text: 'Fetching wildlife sanctuaries…' },
  { at: 55, text: 'Mapping desert experiences…' },
  { at: 72, text: 'Discovering temples & lakes…' },
  { at: 88, text: 'Preparing your journey…' },
  { at: 100, text: 'Welcome to Rajasthan!' },
];

export default function AppLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [dismissing, setDismissing] = useState(false);
  
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('Loading experiences…');
  
  const [tagIdx, setTagIdx] = useState(0);
  const [tagStyle, setTagStyle] = useState({ opacity: 1, transform: 'none', transition: 'all .4s ease' });
  const [stars, setStars] = useState<{ id: number; size: number; top: number; left: number; delay: number; duration: number; opacity: number }[]>([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        size: Math.random() * 2.5 + 1,
        top: Math.random() * 95,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 1.5 + Math.random() * 2.5,
        opacity: 0.4 + Math.random() * 0.6
      }))
    );
  }, []);

  // Calculate orbit icon positions
  const orbitIconElements = ORBIT_ICONS.map((ico, i) => {
    const angle = (i / ORBIT_ICONS.length) * 360;
    const rad = angle * Math.PI / 180;
    const R = 82;
    const cx = 100 + R * Math.cos(rad) - 18;
    const cy = 100 + R * Math.sin(rad) - 18;
    return { ...ico, cx, cy };
  });

  useEffect(() => {
    if (!loading) return;

    // Progress updater
    const pctInterval = setInterval(() => {
      setProgress(prev => {
        const next = Math.min(100, prev + (Math.random() * 3.5 + 1));
        const step = PROGRESS_STEPS.find(s => next >= s.at && prev < s.at);
        if (step) {
          setProgressText(step.text);
        }
        if (next >= 100) clearInterval(pctInterval);
        return next;
      });
    }, 60);

    // Tagline updater
    const tagInterval = setInterval(() => {
      setTagStyle({ opacity: 0, transform: 'translateY(-8px)', transition: 'all .4s cubic-bezier(.4,0,.2,1)' });
      
      setTimeout(() => {
        setTagIdx(prev => (prev + 1) % TAGLINES.length);
        setTagStyle({ opacity: 0, transform: 'translateY(8px)', transition: 'none' });
        
        setTimeout(() => {
          setTagStyle({ opacity: 1, transform: 'translateY(0)', transition: 'all .4s ease' });
        }, 30);
      }, 220);
    }, 2200);

    // Auto-dismiss logic after 4.5 seconds
    const hideTimeout = setTimeout(() => {
      setDismissing(true);
      setTimeout(() => {
        setLoading(false);
      }, 700);
    }, 4500);

    return () => {
      clearInterval(pctInterval);
      clearInterval(tagInterval);
      clearTimeout(hideTimeout);
    };
  }, [loading]);

  if (!loading && !dismissing) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      
      {(loading || dismissing) && (
        <div className={`loader-screen ${dismissing ? 'hidden' : ''}`}>
          {/* Stars */}
          <div className="loader-stars">
            {stars.map((s) => (
              <div 
                key={s.id} 
                className="loader-star" 
                style={{
                  width: s.size, 
                  height: s.size, 
                  top: `${s.top}%`, 
                  left: `${s.left}%`,
                  animationDelay: `${s.delay}s`,
                  animationDuration: `${s.duration}s`,
                  opacity: s.opacity
                }}
              />
            ))}
          </div>

          {/* Moon */}
          <div className="loader-moon"></div>

          {/* Brand */}
          <div className="loader-brand">
            <div className="brand-portal">Official Tourism Portal · OBMS</div>
            <div className="brand-title">Explore <em>Rajasthan</em></div>
            <div className="brand-sub">Padharo Mhare Des</div>
          </div>

          {/* Orbit Ring with Tourism Icons */}
          <div className="orbit-wrap">
            <div className="orbit-ring"></div>
            <div className="orbit-ring-2"></div>
            
            <div className="orbit-spinner">
              {orbitIconElements.map((ico, i) => (
                <div key={i} className="orbit-icon" style={{ left: ico.cx, top: ico.cy }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={ico.path} />
                  </svg>
                </div>
              ))}
            </div>

            <div className="chakra-wrap">
              <div className="chakra-outer">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="chakra-spoke" style={{ transform: `rotate(${i * 30}deg)` }} />
                ))}
              </div>
              <div className="chakra-inner"></div>
              <div className="chakra-center"></div>
            </div>
          </div>

          {/* Progress */}
          <div className="progress-wrap">
            <div className="progress-label">
              <span className="progress-text">{progressText}</span>
              <span className="progress-pct">{Math.round(progress)}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          {/* Tagline */}
          <div className="tagline-wrap">
            <span className="tagline" style={tagStyle as React.CSSProperties}>{TAGLINES[tagIdx]}</span>
          </div>

          {/* Palace Skyline SVG */}
          <div className="palace-wrap">
            <svg viewBox="0 0 900 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="120" width="60" height="80" fill="#18120E" opacity=".85"/>
              <rect x="30" y="100" width="40" height="25" fill="#18120E" opacity=".85"/>
              <polygon points="50,78 30,100 70,100" fill="#18120E" opacity=".85"/>
              <circle cx="50" cy="75" r="5" fill="#D4A017" opacity=".9"/>
              <rect x="10" y="130" width="18" height="70" fill="#18120E" opacity=".8"/>
              <rect x="7" y="125" width="24" height="8" fill="#18120E" opacity=".8"/>
              <polygon points="19,110 7,126 31,126" fill="#18120E" opacity=".8"/>
              <circle cx="19" cy="108" r="3.5" fill="#D4A017" opacity=".9"/>
              <rect x="68" y="135" width="16" height="65" fill="#18120E" opacity=".8"/>
              <polygon points="76,120 68,136 84,136" fill="#18120E" opacity=".8"/>
              <circle cx="76" cy="118" r="3" fill="#D4A017" opacity=".9"/>
              <rect x="300" y="60" width="300" height="140" fill="#18120E" opacity=".9"/>
              <path d="M320 200 L320 130 Q340 110 360 130 L360 200" fill="#2C2017" opacity=".9"/>
              <path d="M370 200 L370 130 Q390 110 410 130 L410 200" fill="#2C2017" opacity=".9"/>
              <path d="M420 200 L420 130 Q440 110 460 130 L460 200" fill="#2C2017" opacity=".9"/>
              <path d="M470 200 L470 130 Q490 110 510 130 L510 200" fill="#2C2017" opacity=".9"/>
              <path d="M520 200 L520 130 Q540 110 560 130 L560 200" fill="#2C2017" opacity=".9"/>
              <rect x="310" y="50" width="280" height="15" fill="#18120E" opacity=".85"/>
              <rect x="325" y="30" width="36" height="24" rx="3" fill="#18120E" opacity=".85"/>
              <path d="M333 30 Q343 20 353 30" fill="#18120E" opacity=".85"/>
              <rect x="375" y="30" width="36" height="24" rx="3" fill="#18120E" opacity=".85"/>
              <path d="M383 30 Q393 20 403 30" fill="#18120E" opacity=".85"/>
              <rect x="425" y="30" width="36" height="24" rx="3" fill="#18120E" opacity=".85"/>
              <path d="M433 30 Q443 20 453 30" fill="#18120E" opacity=".85"/>
              <rect x="475" y="30" width="36" height="24" rx="3" fill="#18120E" opacity=".85"/>
              <path d="M483 30 Q493 20 503 30" fill="#18120E" opacity=".85"/>
              <rect x="525" y="30" width="36" height="24" rx="3" fill="#18120E" opacity=".85"/>
              <path d="M533 30 Q543 20 553 30" fill="#18120E" opacity=".85"/>
              <rect x="415" y="0" width="70" height="35" fill="#18120E" opacity=".9"/>
              <path d="M415 18 Q450 -10 485 18" fill="#18120E" opacity=".95"/>
              <rect x="440" y="-5" width="20" height="10" fill="#18120E" opacity=".95"/>
              <circle cx="450" cy="-8" r="5" fill="#D4A017" opacity="1"/>
              <rect x="310" y="20" width="14" height="32" fill="#18120E" opacity=".85"/>
              <path d="M310 20 Q317 8 324 20" fill="#18120E" opacity=".85"/>
              <circle cx="317" cy="7" r="3" fill="#D4A017" opacity=".9"/>
              <rect x="576" y="20" width="14" height="32" fill="#18120E" opacity=".85"/>
              <path d="M576 20 Q583 8 590 20" fill="#18120E" opacity=".85"/>
              <circle cx="583" cy="7" r="3" fill="#D4A017" opacity=".9"/>
              <line x1="450" y1="-8" x2="450" y2="-22" stroke="#D4A017" strokeWidth="1.5"/>
              <polygon points="450,-22 462,-17 450,-12" fill="#E8631A"/>
              <rect x="620" y="80" width="140" height="120" fill="#18120E" opacity=".85"/>
              <rect x="630" y="60" width="120" height="25" fill="#18120E" opacity=".85"/>
              <path d="M635 200 L635 140 Q650 122 665 140 L665 200" fill="#2C2017" opacity=".85"/>
              <path d="M672 200 L672 140 Q687 122 702 140 L702 200" fill="#2C2017" opacity=".85"/>
              <path d="M709 200 L709 140 Q724 122 739 140 L739 200" fill="#2C2017" opacity=".85"/>
              <rect x="660" y="35" width="60" height="28" fill="#18120E" opacity=".88"/>
              <path d="M660 48 Q690 20 720 48" fill="#18120E" opacity=".9"/>
              <circle cx="690" cy="20" r="5" fill="#D4A017" opacity=".9"/>
              <rect x="635" y="42" width="28" height="20" rx="2" fill="#18120E" opacity=".85"/>
              <path d="M641 42 Q649 34 657 42" fill="#18120E" opacity=".85"/>
              <rect x="715" y="42" width="28" height="20" rx="2" fill="#18120E" opacity=".85"/>
              <path d="M721 42 Q729 34 737 42" fill="#18120E" opacity=".85"/>
              <rect x="770" y="100" width="50" height="100" fill="#18120E" opacity=".8"/>
              <rect x="760" y="90" width="70" height="14" fill="#18120E" opacity=".8"/>
              <polygon points="795,68 760,90 830,90" fill="#18120E" opacity=".8"/>
              <circle cx="795" cy="65" r="5" fill="#D4A017" opacity=".9"/>
              <rect x="820" y="120" width="18" height="80" fill="#18120E" opacity=".75"/>
              <polygon points="829,106 820,121 838,121" fill="#18120E" opacity=".75"/>
              <circle cx="829" cy="103" r="3.5" fill="#D4A017" opacity=".9"/>
              <rect x="848" y="130" width="50" height="70" fill="#18120E" opacity=".7"/>
              <polygon points="873,115 848,132 898,132" fill="#18120E" opacity=".7"/>
              <circle cx="873" cy="112" r="4" fill="#D4A017" opacity=".9"/>
              <rect x="90" y="95" width="200" height="105" fill="#18120E" opacity=".85"/>
              <rect x="100" y="75" width="180" height="24" fill="#18120E" opacity=".85"/>
              <path d="M105 200 L105 145 Q120 127 135 145 L135 200" fill="#2C2017" opacity=".85"/>
              <path d="M142 200 L142 145 Q157 127 172 145 L172 200" fill="#2C2017" opacity=".85"/>
              <path d="M179 200 L179 145 Q194 127 209 145 L209 200" fill="#2C2017" opacity=".85"/>
              <path d="M216 200 L216 145 Q231 127 246 145 L246 200" fill="#2C2017" opacity=".85"/>
              <path d="M253 200 L253 145 Q268 127 283 145 L283 200" fill="#2C2017" opacity=".85"/>
              <rect x="165" y="45" width="50" height="33" fill="#18120E" opacity=".88"/>
              <path d="M165 58 Q190 30 215 58" fill="#18120E" opacity=".9"/>
              <circle cx="190" cy="30" r="5" fill="#D4A017" opacity=".9"/>
              <rect x="100" y="55" width="12" height="22" fill="#18120E" opacity=".82"/>
              <path d="M100 55 Q106 43 112 55" fill="#18120E" opacity=".82"/>
              <circle cx="106" cy="41" r="3" fill="#D4A017" opacity=".9"/>
              <rect x="268" y="55" width="12" height="22" fill="#18120E" opacity=".82"/>
              <path d="M268 55 Q274 43 280 55" fill="#18120E" opacity=".82"/>
              <circle cx="274" cy="41" r="3" fill="#D4A017" opacity=".9"/>
            </svg>
          </div>

          {/* Dunes SVG */}
          <div className="dunes">
            <svg viewBox="0 0 1440 130" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width: '100%', height: '100%'}}>
              <path d="M0 80 Q180 20 360 65 Q540 110 720 45 Q900 -5 1080 55 Q1260 105 1440 50 L1440 130 L0 130 Z" fill="#F5E8CC" opacity=".9"/>
              <path d="M0 95 Q160 50 320 80 Q480 110 640 60 Q800 18 960 70 Q1120 110 1280 65 Q1360 45 1440 70 L1440 130 L0 130 Z" fill="#E8DAC5" opacity=".8"/>
              <path d="M0 110 Q200 80 400 100 Q600 120 800 90 Q1000 60 1200 95 Q1320 112 1440 85 L1440 130 L0 130 Z" fill="#FDF8F1"/>
            </svg>
          </div>

          {/* Camel Caravan */}
          <div className="caravan" id="caravan">
            <svg width="220" height="60" viewBox="0 0 220 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g transform="translate(130,0)">
                <ellipse cx="35" cy="38" rx="22" ry="13" fill="#18120E" opacity=".8"/>
                <ellipse cx="30" cy="24" rx="10" ry="8" fill="#18120E" opacity=".8"/>
                <path d="M44 32 Q52 20 50 14" stroke="#18120E" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".8"/>
                <ellipse cx="49" cy="11" rx="7" ry="5" fill="#18120E" opacity=".8"/>
                <path d="M46 7 L44 3 L50 6" fill="#18120E" opacity=".8"/>
                <line x1="20" y1="48" x2="18" y2="60" stroke="#18120E" strokeWidth="3" strokeLinecap="round" opacity=".8"/>
                <line x1="28" y1="50" x2="26" y2="60" stroke="#18120E" strokeWidth="3" strokeLinecap="round" opacity=".8"/>
                <line x1="40" y1="50" x2="42" y2="60" stroke="#18120E" strokeWidth="3" strokeLinecap="round" opacity=".8"/>
                <line x1="50" y1="48" x2="52" y2="60" stroke="#18120E" strokeWidth="3" strokeLinecap="round" opacity=".8"/>
                <path d="M12 38 Q6 34 8 28" stroke="#18120E" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".8"/>
                <ellipse cx="33" cy="17" rx="5" ry="5" fill="#18120E" opacity=".85"/>
                <path d="M28 22 L33 17 L38 22" stroke="#18120E" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".85"/>
                <path d="M29 15 Q33 9 37 15 Q35 11 33 11 Q31 11 29 15Z" fill="#E8631A" opacity=".9"/>
                <path d="M22 34 Q33 28 44 34" stroke="#D4A017" strokeWidth="1.5" fill="none" opacity=".7"/>
              </g>
              <g transform="translate(60,4)">
                <ellipse cx="35" cy="38" rx="20" ry="12" fill="#18120E" opacity=".7"/>
                <ellipse cx="30" cy="26" rx="9" ry="7" fill="#18120E" opacity=".7"/>
                <path d="M44 32 Q51 21 49 15" stroke="#18120E" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity=".7"/>
                <ellipse cx="48" cy="12" rx="6" ry="4.5" fill="#18120E" opacity=".7"/>
                <line x1="20" y1="48" x2="18" y2="60" stroke="#18120E" strokeWidth="2.5" strokeLinecap="round" opacity=".7"/>
                <line x1="28" y1="49" x2="26" y2="60" stroke="#18120E" strokeWidth="2.5" strokeLinecap="round" opacity=".7"/>
                <line x1="39" y1="49" x2="41" y2="60" stroke="#18120E" strokeWidth="2.5" strokeLinecap="round" opacity=".7"/>
                <line x1="48" y1="47" x2="50" y2="60" stroke="#18120E" strokeWidth="2.5" strokeLinecap="round" opacity=".7"/>
                <path d="M12 38 Q7 34 9 29" stroke="#18120E" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".7"/>
              </g>
              <g transform="translate(0,8)">
                <ellipse cx="32" cy="37" rx="18" ry="11" fill="#18120E" opacity=".55"/>
                <ellipse cx="28" cy="26" rx="8" ry="6.5" fill="#18120E" opacity=".55"/>
                <path d="M40 31 Q47 21 45 15" stroke="#18120E" strokeWidth="4" strokeLinecap="round" fill="none" opacity=".55"/>
                <ellipse cx="44" cy="12" rx="5.5" ry="4" fill="#18120E" opacity=".55"/>
                <line x1="18" y1="46" x2="16" y2="58" stroke="#18120E" strokeWidth="2.5" strokeLinecap="round" opacity=".55"/>
                <line x1="26" y1="47" x2="24" y2="58" stroke="#18120E" strokeWidth="2.5" strokeLinecap="round" opacity=".55"/>
                <line x1="36" y1="47" x2="38" y2="58" stroke="#18120E" strokeWidth="2.5" strokeLinecap="round" opacity=".55"/>
                <line x1="44" y1="46" x2="46" y2="58" stroke="#18120E" strokeWidth="2.5" strokeLinecap="round" opacity=".55"/>
              </g>
            </svg>
          </div>

          {/* Tourism Category Pills */}
          <div className="cats-row">
            <span className="cat-pill"><span className="cat-dot"></span>Forts</span>
            <span className="cat-pill"><span className="cat-dot"></span>Palaces</span>
            <span className="cat-pill"><span className="cat-dot"></span>Wildlife</span>
            <span className="cat-pill"><span className="cat-dot"></span>Deserts</span>
            <span className="cat-pill"><span className="cat-dot"></span>Temples</span>
            <span className="cat-pill"><span className="cat-dot"></span>Lakes</span>
            <span className="cat-pill"><span className="cat-dot"></span>Festivals</span>
            <span className="cat-pill"><span className="cat-dot"></span>Heritage</span>
          </div>
        </div>
      )}
    </>
  );
}
