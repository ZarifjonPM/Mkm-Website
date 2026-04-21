"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Phase = "show" | "fade" | "done";

export function SplashScreen() {
  const [phase, setPhase] = useState<Phase>("show");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("fade"), 2000);
    const t2 = setTimeout(() => setPhase("done"), 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-brand transition-opacity duration-600 ${
        phase === "fade" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Heartbeat ripple rings */}
      <div className="absolute">
        <span
          className="absolute block rounded-full bg-white/10"
          style={{
            width: 320,
            height: 320,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            animation: "mkm-pulse 1.4s ease-out infinite",
          }}
        />
        <span
          className="absolute block rounded-full bg-white/10"
          style={{
            width: 320,
            height: 320,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            animation: "mkm-pulse 1.4s ease-out infinite 0.7s",
          }}
        />
      </div>

      {/* Logo */}
      <div className="relative z-10 w-[55vw] max-w-xs">
        <Image
          src="/images/logo-white.jpg"
          alt="MKM Metal"
          width={1200}
          height={480}
          priority
          className="h-auto w-full object-contain mix-blend-screen"
        />
      </div>

      <style>{`
        @keyframes mkm-pulse {
          0%   { transform: translate(-50%, -50%) scale(0.4); opacity: 0.7; }
          100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
