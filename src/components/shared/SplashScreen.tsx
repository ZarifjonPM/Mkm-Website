"use client";

import { useEffect, useState } from "react";

type Phase = "enter" | "visible" | "exit" | "done";

export function SplashScreen() {
  const [phase, setPhase] = useState<Phase>("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("visible"), 80);
    const t2 = setTimeout(() => setPhase("exit"), 2400);
    const t3 = setTimeout(() => setPhase("done"), 3050);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <>
      <style>{`
        @keyframes splash-scanline {
          0%   { transform: scaleX(0) translateY(-50%); opacity: 1; }
          65%  { transform: scaleX(1) translateY(-50%); opacity: 1; }
          100% { transform: scaleX(1) translateY(-50%); opacity: 0; }
        }
        @keyframes splash-rise {
          0%   { opacity: 0; transform: translateY(28px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes splash-expand {
          0%   { opacity: 0; letter-spacing: -0.05em; }
          100% { opacity: 1; letter-spacing: 0.45em; }
        }
        @keyframes splash-shimmer {
          0%   { transform: translateX(-200%); }
          100% { transform: translateX(400%); }
        }
        @keyframes splash-fade-in {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes splash-corner-draw {
          0%   { width: 0; height: 0; opacity: 0; }
          40%  { width: 28px; height: 0; opacity: 1; }
          80%  { width: 28px; height: 28px; opacity: 1; }
          100% { width: 28px; height: 28px; opacity: 1; }
        }
        @keyframes splash-heartbeat {
          0%   { transform: scale(1); }
          7%   { transform: scale(1.04); }
          14%  { transform: scale(0.98); }
          22%  { transform: scale(1.07); }
          34%  { transform: scale(1); }
          100% { transform: scale(1); }
        }
        @keyframes splash-glow-breathe {
          0%, 100% { transform: scale(1);   opacity: 0.7; }
          22%      { transform: scale(1.5); opacity: 1;   }
          34%      { transform: scale(1.2); opacity: 0.8; }
        }
        @keyframes splash-line-sweep {
          0%   { transform: translateX(-300%); opacity: 0; }
          10%  { opacity: 1; }
          100% { transform: translateX(500%);  opacity: 0; }
        }
        @keyframes splash-corner-pulse {
          0%, 100% { opacity: 1;   }
          22%      { opacity: 0.3; }
          34%      { opacity: 1;   }
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#00001E",
          overflow: "hidden",
          opacity: phase === "exit" ? 0 : 1,
          transition: phase === "exit" ? "opacity 0.65s cubic-bezier(0.4,0,1,1)" : "none",
        }}
      >
        {/* Radial glow — breathes with heartbeat */}
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse at center, rgba(37,99,235,0.22) 0%, transparent 70%)",
            animation: "splash-fade-in 0.5s ease 0.3s both, splash-glow-breathe 1.5s ease 1.1s infinite",
          }}
        />

        {/* Horizontal scan line */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: "1px",
            background: "linear-gradient(90deg, transparent 0%, #2563EB 30%, #93c5fd 50%, #2563EB 70%, transparent 100%)",
            transformOrigin: "left center",
            animation: "splash-scanline 0.75s cubic-bezier(0.4,0,0.2,1) 0.1s both",
          }}
        />

        {/* Main content */}
        <div style={{ textAlign: "center", position: "relative", userSelect: "none" }}>
          <div
            style={{
              animation: "splash-heartbeat 1.5s cubic-bezier(0.4,0,0.6,1) 1.1s infinite",
              display: "inline-block",
            }}
          >
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                lineHeight: 1,
                animation: "splash-rise 0.55s cubic-bezier(0.16,1,0.3,1) 0.45s both",
              }}
            >
              <span
                style={{
                  display: "block",
                  fontSize: "clamp(80px, 16vw, 150px)",
                  fontWeight: 900,
                  color: "#ffffff",
                  letterSpacing: "0.06em",
                  fontFamily: "Inter, system-ui, sans-serif",
                }}
              >
                MKM
              </span>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.45) 50%, transparent 65%)",
                  animation: "splash-shimmer 0.9s ease 0.8s both",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>

          {/* Blue accent divider */}
          <div
            style={{
              position: "relative",
              height: "2px",
              background: "linear-gradient(90deg, transparent, #2563EB 20%, #60a5fa 50%, #2563EB 80%, transparent)",
              margin: "10px 0 14px",
              overflow: "hidden",
              animation: "splash-fade-in 0.4s ease 0.75s both",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.8) 50%, transparent 70%)",
                animation: "splash-line-sweep 1.5s ease-in-out 1.1s infinite",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* METAL */}
          <div
            style={{
              fontSize: "clamp(13px, 2.5vw, 20px)",
              fontWeight: 300,
              color: "rgba(255,255,255,0.65)",
              letterSpacing: "0.45em",
              textTransform: "uppercase",
              fontFamily: "Inter, system-ui, sans-serif",
              paddingLeft: "0.45em",
              animation: "splash-expand 0.6s cubic-bezier(0.16,1,0.3,1) 0.75s both",
            }}
          >
            METAL
          </div>
        </div>

        {/* Corner TL */}
        <div style={{ position: "absolute", top: 28, left: 28, width: 28, height: 28, borderTop: "1.5px solid #2563EB", borderLeft: "1.5px solid #2563EB", animation: "splash-corner-draw 0.6s ease 0.5s both, splash-corner-pulse 1.5s ease 1.1s infinite" }} />
        {/* Corner BR */}
        <div style={{ position: "absolute", bottom: 28, right: 28, width: 28, height: 28, borderBottom: "1.5px solid #2563EB", borderRight: "1.5px solid #2563EB", animation: "splash-corner-draw 0.6s ease 0.5s both, splash-corner-pulse 1.5s ease 1.35s infinite" }} />
        {/* Corner TR small */}
        <div style={{ position: "absolute", top: 28, right: 28, width: 14, height: 14, borderTop: "1px solid rgba(37,99,235,0.5)", borderRight: "1px solid rgba(37,99,235,0.5)", animation: "splash-fade-in 0.4s ease 0.9s both, splash-corner-pulse 1.5s ease 1.25s infinite" }} />
        {/* Corner BL small */}
        <div style={{ position: "absolute", bottom: 28, left: 28, width: 14, height: 14, borderBottom: "1px solid rgba(37,99,235,0.5)", borderLeft: "1px solid rgba(37,99,235,0.5)", animation: "splash-fade-in 0.4s ease 0.9s both, splash-corner-pulse 1.5s ease 1.45s infinite" }} />
      </div>
    </>
  );
}
