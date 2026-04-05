"use client";

import { useEffect, useRef, useState } from "react";

const NUM_LINES = 13;           // dividing lines → NUM_LINES + 1 bands
const NUM_BANDS = NUM_LINES + 1;
const WAVE_AMP = 18;
const WAVE_CYCLES = 1.5;
const STEPS = 48;

const ENTRY_DURATION = 350;
const HOLD_MS = 80;
const EXIT_DURATION = 300;
const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

function randomBandColors(): ("white" | "purple")[] {
  return Array.from({ length: NUM_BANDS }, () =>
    Math.random() < 0.5 ? "white" : "purple"
  );
}

// Smooth sine curve through points (Catmull-Rom → cubic bezier)
function sinePoints(baseY: number, phase: number, vpW: number, freq: number) {
  const stepW = vpW / STEPS;
  return Array.from({ length: STEPS + 1 }, (_, i) => ({
    x: i * stepW,
    y: baseY + Math.sin(freq * i * stepW + phase) * WAVE_AMP,
  }));
}

function pointsToPath(pts: { x: number; y: number }[]): string {
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

// Closed band path: top curve L→R, then bottom curve R→L
function buildBandClipPath(
  topPts: { x: number; y: number }[],
  botPts: { x: number; y: number }[],
  vpW: number,
  vpH: number
): string {
  const top = pointsToPath(topPts);
  // Bottom reversed for closing the shape
  const botReversed = [...botPts].reverse();
  const bot = pointsToPath(botReversed);
  // Close: go right edge down, then bottom curve back, then left edge up
  const lastTop = topPts[topPts.length - 1];
  const firstBotRev = botReversed[0];
  return `${top} L ${lastTop.x} ${firstBotRev.y} ${bot.replace(/^M [^ ]+ [^ ]+ /, `L `)} Z`;
}

// Stroke path for dividing lines
function buildStrokePath(pts: { x: number; y: number }[]): string {
  return pointsToPath(pts);
}

export type WaveCurtainHandle = {
  play: (onComplete: () => void) => void;
};

interface Props {
  onExitComplete: () => void;
  registerHandle: (handle: WaveCurtainHandle) => void;
}

interface BandData {
  clipId: string;
  clipPath: string;
  strokePath: string | null; // null for first and last bands (no top/bottom stroke)
  color: "white" | "purple";
}

function computeBands(vpW: number, vpH: number, colors: ("white" | "purple")[]): BandData[] {
  const freq = (WAVE_CYCLES * 2 * Math.PI) / vpW;
  const spacing = vpH / (NUM_LINES + 1);

  // Precompute all line point arrays (indices 0..NUM_LINES-1)
  // Plus virtual top (above screen) and bottom (below screen)
  const linePoints = Array.from({ length: NUM_LINES }, (_, i) => {
    const baseY = spacing * (i + 1);
    const phase = (i * Math.PI) / 3;
    return sinePoints(baseY, phase, vpW, freq);
  });

  const bands: BandData[] = [];

  for (let i = 0; i < NUM_BANDS; i++) {
    // Top boundary of band i
    const topPts: { x: number; y: number }[] =
      i === 0
        ? Array.from({ length: STEPS + 1 }, (_, s) => ({ x: (s * vpW) / STEPS, y: -WAVE_AMP * 2 }))
        : linePoints[i - 1];

    // Bottom boundary of band i
    const botPts: { x: number; y: number }[] =
      i === NUM_BANDS - 1
        ? Array.from({ length: STEPS + 1 }, (_, s) => ({ x: (s * vpW) / STEPS, y: vpH + WAVE_AMP * 2 }))
        : linePoints[i];

    const clipPath = buildBandClipPath(topPts, botPts, vpW, vpH);
    // The dividing stroke between band i and band i+1 = linePoints[i]
    const strokePath = i < NUM_BANDS - 1 ? buildStrokePath(linePoints[i]) : null;

    bands.push({
      clipId: `wave-clip-${i}`,
      clipPath,
      strokePath,
      color: colors[i],
    });
  }

  return bands;
}

export default function WaveCurtain({ onExitComplete, registerHandle }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [bands, setBands] = useState<BandData[]>([]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const vpW = window.innerWidth;
    const vpH = window.innerHeight;
    setBands(computeBands(vpW, vpH, randomBandColors()));
  }, [mounted]);

  useEffect(() => {
    const handle: WaveCurtainHandle = {
      play(onRouteReady) {
        const container = containerRef.current;
        if (!container) return;

        const vpW = window.innerWidth;
        const vpH = window.innerHeight;

        // Recompute with fresh random colors each play
        setBands(computeBands(vpW, vpH, randomBandColors()));

        container.style.transition = "none";
        container.style.transform = "translateY(100vh)";
        container.style.display = "block";
        void container.offsetHeight;

        container.style.transition = `transform ${ENTRY_DURATION}ms ${EASE}`;
        container.style.transform = "translateY(0)";

        setTimeout(() => {
          onRouteReady();
          setTimeout(() => {
            container.style.transition = `transform ${EXIT_DURATION}ms ${EASE}`;
            container.style.transform = "translateY(-100vh)";

            setTimeout(() => {
              container.style.display = "none";
              container.style.transition = "none";
              container.style.transform = "translateY(100vh)";
              onExitComplete();
            }, EXIT_DURATION);
          }, HOLD_MS);
        }, ENTRY_DURATION);
      },
    };

    registerHandle(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted || bands.length === 0) return null;

  const vpW = window.innerWidth;
  const vpH = window.innerHeight;

  return (
    <div
      ref={containerRef}
      style={{
        display: "none",
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        transform: "translateY(100vh)",
      }}
    >
      {/* SVG clipPath definitions */}
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          {bands.map((band) => (
            <clipPath key={band.clipId} id={band.clipId} clipPathUnits="userSpaceOnUse">
              <path d={band.clipPath} />
            </clipPath>
          ))}
        </defs>
      </svg>

      {/* Glass band divs — each clipped to its wave shape */}
      {bands.map((band, i) => {
        const isWhite = band.color === "white";

        return (
          <div
            key={band.clipId}
            style={{
              position: "absolute",
              inset: 0,
              // Clip to wave shape
              clipPath: `url(#${band.clipId})`,
              // Frosted glass
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              // Tinted fill: white bands are near-transparent white, purple bands carry accent tint
              backgroundColor: isWhite
                ? "rgba(255, 255, 255, 0.55)"
                : "rgba(127, 119, 221, 0.18)",
              // Top edge shimmer for glass depth (white bands) or purple shimmer
              boxShadow: isWhite
                ? "inset 0 1px 0 rgba(255,255,255,0.6)"
                : "inset 0 1px 0 rgba(175,169,236,0.4)",
            }}
          />
        );
      })}

      {/* Stroke lines on top — drawn as one SVG over everything */}
      <svg
        width={vpW}
        height={vpH}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {bands.map((band) =>
          band.strokePath ? (
            <path
              key={`stroke-${band.clipId}`}
              d={band.strokePath}
              fill="none"
              stroke="rgba(232,231,228,0.7)"
              strokeWidth={1}
            />
          ) : null
        )}
      </svg>
    </div>
  );
}
