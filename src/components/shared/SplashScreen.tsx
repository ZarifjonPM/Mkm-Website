"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Phase = "show" | "zoom" | "fade" | "done";

export function SplashScreen() {
  const [phase, setPhase] = useState<Phase>("show");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("zoom"), 800);
    const t2 = setTimeout(() => setPhase("fade"), 1500);
    const t3 = setTimeout(() => setPhase("done"), 2100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-brand transition-opacity duration-600 ${
        phase === "fade" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className="flex flex-col items-center gap-4 transition-transform ease-in"
        style={{
          transform: phase === "zoom" ? "scale(8)" : "scale(1)",
          transitionDuration: phase === "zoom" ? "900ms" : "0ms",
        }}
      >
        <div className="w-[55vw] max-w-[280px]">
          <Image
            src="/images/logo-white.jpg"
            alt="MKM Metal"
            width={1200}
            height={480}
            priority
            className="h-auto w-full object-contain mix-blend-screen"
          />
        </div>
        <p className="text-white/70 tracking-[0.3em] text-xs uppercase font-light">
          Металлопрокат
        </p>
      </div>
    </div>
  );
}
