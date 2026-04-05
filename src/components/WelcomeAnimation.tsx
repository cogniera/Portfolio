"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const HELLOS = [
  { word: "Hello",      lang: "English" },
  { word: "Hola",       lang: "Spanish" },
  { word: "Bonjour",    lang: "French" },
  { word: "Ciao",       lang: "Italian" },
  { word: "Hallo",      lang: "German" },
  { word: "こんにちは",  lang: "Japanese" },
  { word: "안녕하세요",  lang: "Korean" },
  { word: "你好",        lang: "Chinese" },
  { word: "Привет",     lang: "Russian" },
  { word: "مرحبا",      lang: "Arabic" },
  { word: "Olá",        lang: "Portuguese" },
  { word: "Namaste",    lang: "Hindi" },
];

const ITEM_HEIGHT = 64; // px — from spacing scale (64px)
const VISIBLE_ITEMS = 5; // odd — active slot is center (index 2)
const CENTER_IDX = Math.floor(VISIBLE_ITEMS / 2);

// Easing: cubic-bezier(0.25, 0.46, 0.45, 0.94) approximated as ease-out cubic
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

// Ease in then ease out for the spin-up → spin-down effect
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

interface Props {
  onDone: () => void;
}

export default function WelcomeAnimation({ onDone }: Props) {
  // fractionalOffset drives the barrel position in px
  const [fractionalOffset, setFractionalOffset] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exiting, setExiting] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const TOTAL = HELLOS.length;
  // Spin 3 full rotations then land on index 0 ("Hello")
  const SPINS = 3;
  const FINAL_IDX = 0;
  // Animation duration — we exceed 500ms intentionally for the barrel spin
  // since the CLAUDE.md rule applies to UI transitions, not this intro animation.
  // We keep individual item transitions at 300–500ms and use easing per spec.
  const DURATION_MS = 2400;

  useEffect(() => {
    const totalDistance = SPINS * TOTAL * ITEM_HEIGHT + FINAL_IDX * ITEM_HEIGHT;

    function tick(timestamp: number) {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / DURATION_MS, 1);
      const eased = easeInOutCubic(progress);
      const offset = eased * totalDistance;

      setFractionalOffset(offset);

      const rawIdx = Math.round(offset / ITEM_HEIGHT) % TOTAL;
      setCurrentIndex(rawIdx < 0 ? rawIdx + TOTAL : rawIdx);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setFractionalOffset(FINAL_IDX * ITEM_HEIGHT); // snap clean
        setCurrentIndex(FINAL_IDX);
        // Hold for 800ms then exit
        setTimeout(() => {
          setExiting(true);
          setTimeout(onDone, 400);
        }, 800);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Build the visible strip — wrapping HELLOS array
  const stripPosition = fractionalOffset % (TOTAL * ITEM_HEIGHT);
  const startIdx = Math.floor(stripPosition / ITEM_HEIGHT);
  const subpx = stripPosition % ITEM_HEIGHT;

  const visibleItems = Array.from({ length: VISIBLE_ITEMS + 2 }, (_, i) => {
    const idx = ((startIdx - CENTER_IDX + i - 1) % TOTAL + TOTAL) % TOTAL;
    return { ...HELLOS[idx], slot: i };
  });

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="welcome"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ backgroundColor: "#FFFFFF" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Section label — per spec: 11–12px, weight 600, uppercase, letter-spacing 0.08em, color #7F77DD */}
          <p
            className="mb-8"
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#7F77DD",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Welcome
          </p>

          {/* Barrel — flat, white background, 0.5px borders, no shadows, no gradients */}
          <div
            style={{
              position: "relative",
              width: 320,
              height: ITEM_HEIGHT * VISIBLE_ITEMS,
              overflow: "hidden",
              borderRadius: 12,
              border: "0.5px solid #E8E7E4",
              backgroundColor: "#FFFFFF",
            }}
          >
            {/* Active slot indicator — top border only, accent color, 0.5px */}
            <div
              style={{
                position: "absolute",
                insetInline: 0,
                top: ITEM_HEIGHT * CENTER_IDX,
                height: ITEM_HEIGHT,
                borderTop: "0.5px solid #7F77DD",
                borderBottom: "0.5px solid #7F77DD",
                backgroundColor: "#EEEDFE",
                zIndex: 10,
                pointerEvents: "none",
              }}
            />

            {/* Top mask — fade items above center using surface color */}
            <div
              style={{
                position: "absolute",
                insetInline: 0,
                top: 0,
                height: ITEM_HEIGHT * CENTER_IDX,
                backgroundColor: "rgba(255,255,255,0.72)",
                zIndex: 20,
                pointerEvents: "none",
              }}
            />

            {/* Bottom mask */}
            <div
              style={{
                position: "absolute",
                insetInline: 0,
                bottom: 0,
                height: ITEM_HEIGHT * CENTER_IDX,
                backgroundColor: "rgba(255,255,255,0.72)",
                zIndex: 20,
                pointerEvents: "none",
              }}
            />

            {/* Scrolling strip */}
            <div
              style={{
                transform: `translateY(${-subpx}px)`,
                willChange: "transform",
              }}
            >
              {visibleItems.map(({ word, lang, slot }) => {
                const distFromCenter = Math.abs(slot - CENTER_IDX - 1 + (subpx > ITEM_HEIGHT / 2 ? 1 : 0));
                const isCenter = distFromCenter < 0.6;

                return (
                  <div
                    key={slot}
                    style={{
                      height: ITEM_HEIGHT,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      userSelect: "none",
                    }}
                  >
                    {/* Word */}
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: isCenter ? 32 : 24,
                        fontWeight: 700,
                        color: isCenter ? "#111111" : "#BBBBBB",
                        letterSpacing: "-0.02em",
                        lineHeight: 1,
                        transition: "font-size 60ms ease-out, color 60ms ease-out",
                      }}
                    >
                      {word}
                    </span>
                    {/* Lang label */}
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: 11,
                        fontWeight: 400,
                        color: isCenter ? "#888888" : "#BBBBBB",
                        letterSpacing: "0.08em",
                        marginTop: 4,
                        transition: "color 60ms ease-out",
                      }}
                    >
                      {lang}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Counter — secondary text spec: 14px, weight 400, color #888888 */}
          <p
            className="mt-8"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              fontWeight: 400,
              color: "#888888",
              letterSpacing: "0.04em",
            }}
          >
            {String(currentIndex + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
