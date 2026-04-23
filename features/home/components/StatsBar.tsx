"use client";
import React, { useEffect, useState } from "react";

type Stat = {
  icon: string;
  num: number;
  label: string;
  suffix?: string;
};

function useCountUp(end: number, duration: number = 1500): number {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    let startTime: number | null = null;

    const animate = (time: number) => {
      if (startTime === null) startTime = time;

      const progress = time - startTime;
      const value = Math.min(Math.floor((progress / duration) * end), end);

      setCount(value);

      if (progress < duration) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
}

// 📊 Single Stat Item
const StatItem: React.FC<Stat> = ({ icon, num, label, suffix = "" }) => {
  const count = useCountUp(num);

  return (
    <div className="si">
      {/* 🖼 icon (image or emoji) */}
      {(icon.startsWith("http") || icon.startsWith("/")) ? (
        <img
          src={icon}
          alt={label}
          className="si-ico"
          style={{ height: "20px", width: "20px", objectFit: 'contain' }}
        />
      ) : (
        <span className="si-ico">{icon}</span>
      )}

      <div>
        <div className="si-n">
          {count}
          {suffix}
        </div>
        <div className="si-l">{label}</div>
      </div>
    </div>
  );
};

// 🚀 Main Component
const StatsBar: React.FC<{ categoryCountsData: any }> = ({
  categoryCountsData,
}) => {
  const categories = categoryCountsData?.categories?.data || [];

  const stats: Stat[] = categories
    .map((cat: any) => {
      const attr = cat.attributes;

      const name = attr.Name;
      const count = attr.places?.data?.length || 0;

      // ✅ get icon from Strapi
      const iconUrl = attr.icon?.data?.attributes?.url;

      return {
        label: name,
        num: count,
        icon: iconUrl
          ? `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${iconUrl}`
          : "/icons/google-maps.png", // fallback icon
        suffix: "+",
      };
    })
    .filter((item: any) => item.num > 0 && item.label?.toLowerCase() !== "all");

  return (
    <div className="stats-bar">
      {stats.map((item) => (
        <StatItem key={item.label} {...item} />
      ))}
    </div>
  );
};

export default StatsBar;
