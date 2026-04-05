"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const GREETINGS = [
  { word: "Hello",     lang: "English"  },
  { word: "Hola",      lang: "Spanish"  },
  { word: "Bonjour",   lang: "French"   },
  { word: "こんにちは", lang: "Japanese" },
  { word: "مرحبا",     lang: "Arabic"   },
];

const SLOT_W = 52;
const SLOT_H = 72;

// Spinning wheel deceleration: ease-out-quad curve
// 50% faster than previous version (was MIN=120, MAX=2100)
// New: MIN=60, MAX=1050
const N = GREETINGS.length;
const MIN_MS = 40;
const MAX_MS = 550;

function buildIntervals(): number[] {
  return Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    const eased = 1 - (1 - t) * (1 - t); // ease-out quad
    return Math.round(MIN_MS + eased * (MAX_MS - MIN_MS));
  });
}

const INTERVALS = buildIntervals();

interface Props {
  onDone: () => void;
}

export default function TumblerGreeting({ onDone }: Props) {
  const [index, setIndex] = useState(0);
  const [wordKey, setWordKey] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    let cancelled = false;

    function scheduleNext() {
      if (cancelled) return;
      const delay = INTERVALS[currentIndex];

      setTimeout(() => {
        if (cancelled) return;
        currentIndex += 1;

        if (currentIndex < N) {
          setIndex(currentIndex);
          setWordKey((k) => k + 1);
          scheduleNext();
        } else {
          // All greetings shown — begin exit fade then hand off
          setExiting(true);
          setTimeout(() => {
            if (!cancelled) onDone();
          }, 200);
        }
      }, delay);
    }

    scheduleNext();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { word } = GREETINGS[index];
  const chars = Array.from(word);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="tumbler-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            backgroundColor: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              padding: 32,
              backgroundColor: "#FFFFFF",
              border: "0.5px solid #E8E7E4",
              borderRadius: 20,
            }}
          >
            {/* Tumbler row — keyed on wordKey so entire row remounts on word change */}
            <AnimatePresence mode="wait">
              <motion.div
                key={wordKey}
                style={{ display: "flex", gap: 6 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.08 }}
              >
                {chars.map((char, i) => (
                  <div
                    key={i}
                    style={{
                      position: "relative",
                      width: SLOT_W,
                      height: SLOT_H,
                      overflow: "hidden",
                      backgroundColor: "#F5F4F2",
                      border: "0.5px solid #E8E7E4",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* Character — enters from below */}
                    <motion.div
                      initial={{ y: SLOT_H }}
                      animate={{ y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 22,
                        delay: i * 0.06,
                      }}
                      style={{
                        fontFamily: "'Courier New', monospace",
                        fontSize: 38,
                        fontWeight: 700,
                        color: "#111111",
                        lineHeight: 1,
                        userSelect: "none",
                      }}
                    >
                      {char}
                    </motion.div>

                    {/* Top fade overlay */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        top: 0,
                        height: "35%",
                        background:
                          "linear-gradient(to bottom, rgba(245,244,242,0.95) 0%, transparent 100%)",
                        pointerEvents: "none",
                        zIndex: 1,
                      }}
                    />

                    {/* Bottom fade overlay */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        bottom: 0,
                        top: "auto",
                        height: "35%",
                        background:
                          "linear-gradient(to top, rgba(245,244,242,0.95) 0%, transparent 100%)",
                        pointerEvents: "none",
                        zIndex: 1,
                      }}
                    />

                    {/* Center line — top */}
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: "calc(50% - 10px)",
                        height: "0.5px",
                        backgroundColor: "rgba(127,119,221,0.4)",
                        zIndex: 2,
                        pointerEvents: "none",
                      }}
                    />

                    {/* Center line — bottom */}
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: "calc(50% + 10px)",
                        height: "0.5px",
                        backgroundColor: "rgba(127,119,221,0.4)",
                        zIndex: 2,
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
