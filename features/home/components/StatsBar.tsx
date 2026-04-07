"use client";
import React, { useEffect, useState } from "react";

type Stat = {
  icon: string;
  num: number;
  label: string;
  suffix?: string;
};

const STATS: Stat[] = [
  { icon: "🌆", num: 34, label: "Cities", suffix: "+" },
  { icon: "🏯", num: 60, label: "Monuments", suffix: "+" },
  { icon: "🐯", num: 20, label: "Wildlife Parks", suffix: "+" },
  { icon: "🎫", num: 10, label: "Darshan Packages" },
  { icon: "🏛", num: 30, label: "Museums", suffix: "+" },
  { icon: "🌿", num: 5, label: "City Parks", suffix: "+" },
];

// 🔢 CountUp Hook
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
      <span className="si-ico">{icon}</span>
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
const StatsBar: React.FC = () => {
  return (
    <div className="stats-bar">
      {STATS.map((item) => (
        <StatItem key={item.label} {...item} />
      ))}
    </div>
  );
};

export default StatsBar;