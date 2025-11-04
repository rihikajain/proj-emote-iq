"use client";

import "./AnimatedBackground.css"; // we'll define keyframes here

export default function AnimatedBackground() {
  const blobs = [
    { size: 980, left: "12%", top: "-5%", color: "var(--color-primary)", delay: "1s", dur: "16s" },
    { size: 880, left: "60%", top: "55%", color: "var(--color-primary)", delay: "1s", dur: "16s" },
    { size: 900, left: "-10%", top: "-10%", color: "var(--color-secondary-1)", delay: "0s", dur: "12s" },
    { size: 600, left: "80%", top: "-10%", color: "var(--color-secondary-1)", delay: "0s", dur: "12s" },
    { size: 680, left: "0%", top: "65%", color: "var(--color-secondary-2)", delay: "1s", dur: "12s" },
    { size: 880, left: "50%", top: "-21%", color: "var(--color-secondary-2)", delay: "2s", dur: "14s" },
    { size: 680, left: "30%", top: "55%", color: "var(--color-secondary-3)", delay: "4s", dur: "18s" },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {blobs.map((b, i) => (
        <div
          key={i}
          className="bg-blob absolute rounded-full opacity-40 blur-3xl animate-blob"
          style={{
            width: b.size,
            height: b.size,
            left: b.left,
            top: b.top,
            background: `radial-gradient(circle at 30% 30%, ${b.color}, transparent 60%)`,
            animationDuration: b.dur,
            animationDelay: b.delay,
          }}
        />
      ))}
    </div>
  );
}
