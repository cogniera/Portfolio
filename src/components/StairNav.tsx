"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Blogs",      href: "https://justthoughts.hashnode.dev/" },
  { label: "Contact me", href: "#contact" },
];

const DEPTH = 8;

export default function StairNav() {
  return (
    <>
      {/* Responsive nav styles injected as a <style> tag */}
      <style>{`
        .stair-nav {
          position: fixed;
          top: clamp(1rem, 3vw, 2.5rem);
          right: clamp(0.75rem, 3vw, 2.5rem);
          z-index: 100;
          display: flex;
          gap: clamp(0.5rem, 1.5vw, 1rem);
          align-items: flex-end;
        }
        .cuboid-btn {
          width: clamp(4.5rem, 10vw, 7.5rem);
          height: calc(clamp(1.75rem, 4vw, 2.375rem) + ${DEPTH}px);
          position: relative;
          cursor: pointer;
          flex-shrink: 0;
        }
        .cuboid-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: ${DEPTH}px;
          background-color: #3D3790;
          border-radius: 0 0 8px 8px;
        }
        .cuboid-top {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: calc(100% - ${DEPTH}px);
          background-color: #7F77DD;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: transform 0.15s ease-out;
        }
        .cuboid-highlight {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 6px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.22) 0%, transparent 100%);
          border-radius: 8px 8px 0 0;
          pointer-events: none;
        }
        .cuboid-label {
          font-family: Inter, sans-serif;
          font-size: clamp(0.625rem, 1.2vw, 0.75rem);
          font-weight: 600;
          color: #FFFFFF;
          letter-spacing: 0.04em;
          user-select: none;
          white-space: nowrap;
          position: relative;
          z-index: 1;
        }
      `}</style>

      <nav aria-label="Main navigation" className="stair-nav">
        {NAV_ITEMS.map((item, i) => (
          <NavCuboid key={item.label} item={item} index={i} />
        ))}
      </nav>
    </>
  );
}

function NavCuboid({
  item,
  index,
}: {
  item: (typeof NAV_ITEMS)[number];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="cuboid-btn"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <a href={item.href} style={{ textDecoration: "none", display: "block", width: "100%", height: "100%" }}>
        <div className="cuboid-bottom" />
        <div
          className="cuboid-top"
          style={{ transform: `translateY(${hovered ? 0 : DEPTH}px)` }}
        >
          <div className="cuboid-highlight" />
          <span className="cuboid-label">{item.label}</span>

          {/* Shine sweep */}
          <motion.span
            initial={{ x: "-130%" }}
            animate={{ x: "230%" }}
            transition={{
              duration: 0.5,
              delay: 0.9 + index * 0.18,
              ease: [0.25, 0.46, 0.45, 0.94],
              repeat: Infinity,
              repeatDelay: 4,
            }}
            style={{
              position: "absolute",
              top: 0, left: 0,
              width: "45%",
              height: "100%",
              background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.32) 50%, transparent 80%)",
              pointerEvents: "none",
            }}
          />
        </div>
      </a>
    </motion.div>
  );
}
