import { useRef, useCallback } from "react";
import { type WaveCurtainHandle } from "@/components/transitions/WaveCurtain";

/**
 * Provides a ref to register the WaveCurtain handle and a trigger function.
 * Usage:
 *   const { registerHandle, triggerTransition } = usePageTransition();
 *   <WaveCurtain registerHandle={registerHandle} onExitComplete={...} />
 *   triggerTransition(() => { / do route change or reveal / });
 */
export function usePageTransition() {
  const handleRef = useRef<WaveCurtainHandle | null>(null);

  const registerHandle = useCallback((handle: WaveCurtainHandle) => {
    handleRef.current = handle;
  }, []);

  const triggerTransition = useCallback((onRouteReady: () => void) => {
    if (handleRef.current) {
      handleRef.current.play(onRouteReady);
    } else {
      // Fallback: no curtain registered, call immediately
      onRouteReady();
    }
  }, []);

  return { registerHandle, triggerTransition };
}
