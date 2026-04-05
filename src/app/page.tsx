"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import TumblerGreeting from "@/components/TumblerGreeting";
import WaveCurtain from "@/components/transitions/WaveCurtain";
import StairNav from "@/components/StairNav";
import Sections from "@/components/Sections";
import { usePageTransition } from "@/hooks/usePageTransition";

const LotusBackground = dynamic(() => import("@/components/LotusBackground"), {
  ssr: false,
});

type Phase = "greeting" | "transitioning" | "done";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("greeting");
  const { registerHandle, triggerTransition } = usePageTransition();

  function handleGreetingDone() {
    setPhase("transitioning");
    triggerTransition(() => {});
  }

  function handleCurtainExitComplete() {
    setPhase("done");
  }

  return (
    <>
      {phase === "greeting" && (
        <TumblerGreeting onDone={handleGreetingDone} />
      )}

      <WaveCurtain
        registerHandle={registerHandle}
        onExitComplete={handleCurtainExitComplete}
      />

      {phase === "done" && <LotusBackground />}

      <AnimatePresence>
        {phase === "done" && <StairNav />}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "done" && (
          <motion.main
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: "relative",
              zIndex: 1,
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontFamily: "Inter, sans-serif",
              /* Responsive top padding — pushes text into view without hardcoding px */
              paddingTop: "clamp(96px, 25vh, 220px)",
              paddingLeft: "clamp(16px, 5vw, 48px)",
              paddingRight: "clamp(16px, 5vw, 48px)",
              paddingBottom: 64,
              gap: 12,
            }}
          >
            <h1
              style={{
                /* fluid type: 36px on smallest phone → 72px on desktop */
                fontSize: "clamp(36px, 7vw, 72px)",
                fontWeight: 700,
                color: "#111111",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                textAlign: "center",
                maxWidth: "90vw",
              }}
            >
              Paarth Sharma
            </h1>
            <p
              style={{
                fontSize: "clamp(14px, 2.5vw, 18px)",
                fontWeight: 400,
                color: "#111111",
                lineHeight: 1.7,
                textAlign: "center",
              }}
            >
              Full Stack / ML Developer
            </p>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              style={{
                marginTop: "clamp(48px, 8vh, 96px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#111111", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Scroll
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: 1, height: 32, backgroundColor: "#111111" }}
              />
            </motion.div>

            {/* Content sections */}
            <Sections />
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
