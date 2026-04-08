"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Phase = "show" | "zoom" | "fade" | "done";

export function SplashScreen() {
  const [phase, setPhase] = useState<Phase>("show");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("zoom"), 800);   // logo visible → start zoom in
    const t2 = setTimeout(() => setPhase("fade"), 1400);  // start fade while zooming
    const t3 = setTimeout(() => setPhase("done"), 1900);  // unmount
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-brand transition-opacity duration-500 ${
        phase === "fade" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className="w-[70vw] transition-transform ease-in"
        style={{
          transform: phase === "zoom" ? "scale(10)" : "scale(1)",
          transitionDuration: phase === "zoom" ? "900ms" : "0ms",
        }}
      >
        <Image
          src="/images/logo-white.jpg"
          alt="MKM Metal"
          width={1200}
          height={480}
          priority
          className="h-auto w-full object-contain mix-blend-screen"
        />
      </div>
    </div>
  );
}
