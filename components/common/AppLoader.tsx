'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AppLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#E8DAC5]">
        <div className="relative flex items-center justify-center">
          {/* Spinner ring */}
          <svg
            className="animate-spin"
            width="96"
            height="96"
            viewBox="0 0 96 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="48"
              cy="48"
              r="42"
              stroke="#E8DAC5"
              strokeWidth="6"
            />
            <path
              d="M48 6 A42 42 0 0 1 90 48"
              stroke="#E8631A"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          {/* App icon in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/icons/icon-192x192.png"
              alt="App Icon"
              width={52}
              height={52}
              className="rounded-[14px]"
              priority
            />
          </div>
        </div>
        <p className="mt-5 text-[11px] font-semibold tracking-[2px] uppercase text-[#7A6A58]">
          Welcome to Rajasthan
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
