"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger, createTimeline } from "animejs";
import { scrambleText } from "animejs/text";

const COLS = 10;
const ROWS = 8;
const TOTAL = COLS * ROWS;

export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const barFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !gridRef.current ||
      !contentRef.current ||
      !nameRef.current ||
      !subRef.current ||
      !barFillRef.current ||
      !containerRef.current
    )
      return;

    const cells = Array.from(gridRef.current.children);
    const tl = createTimeline({ autoplay: true });

    // 1 — Grid floods in from center outward
    tl.add(
      cells,
      {
        scale: [0, 1],
        opacity: [0, 1],
        delay: stagger(18, { from: "center", grid: [COLS, ROWS] }),
        duration: 450,
        ease: "outBack(1.8)",
      },
      0,
    );

    // 2 — Content block slides up and fades in
    tl.add(
      contentRef.current,
      { opacity: [0, 1], y: [22, 0], duration: 300, ease: "outExpo" },
      380,
    );

    // 3 — "KG" scramble reveal from center
    tl.add(
      nameRef.current,
      {
        innerHTML: scrambleText({
          chars: "uppercase",
          from: "center",
          cursor: "_",
          duration: 750,
        }) as unknown as string,
        ease: "linear",
      },
      500,
    );

    // 4 — Subtitle scramble from random
    tl.add(
      subRef.current,
      {
        innerHTML: scrambleText({
          chars: "symbols",
          from: "random",
          duration: 550,
          override: "",
        }) as unknown as string,
        ease: "linear",
      },
      600,
    );

    // 5 — Progress bar elastic fill
    tl.add(
      barFillRef.current,
      { width: ["0%", "100%"], duration: 750, ease: "outExpo" },
      850,
    );

    // 6 — Grid pixelated dissolve (random order, each cell shrinks)
    tl.add(
      cells,
      {
        scale: [1, 0],
        opacity: [1, 0],
        rotate: [0, 90],
        delay: stagger(10, { from: "random" }),
        duration: 320,
        ease: "inExpo",
      },
      1750,
    );

    // 7 — Full container fades out
    tl.add(
      containerRef.current,
      {
        opacity: [1, 0],
        duration: 300,
        ease: "inSine",
        onComplete: () => setVisible(false),
      },
      1900,
    );

    return () => {
      tl.pause();
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#0d0d0d" }}
    >
      {/* Animated pixel grid */}
      <div
        ref={gridRef}
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
      >
        {Array.from({ length: TOTAL }).map((_, i) => (
          <div
            key={i}
            style={{
              border: "1px solid rgba(245,111,13,0.07)",
              background:
                i % 7 === 0
                  ? "rgba(245,111,13,0.07)"
                  : i % 4 === 0
                    ? "rgba(245,111,13,0.035)"
                    : "rgba(245,111,13,0.012)",
              transform: "scale(0)",
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* Logo + subtitle */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center"
        style={{ opacity: 0 }}
      >
        <div
          ref={nameRef}
          className="font-display font-black"
          style={{
            fontSize: "clamp(5.5rem, 18vw, 9.5rem)",
            letterSpacing: "-0.055em",
            lineHeight: 1,
            color: "#f56f0d",
          }}
        >
          KG
        </div>
        <div
          ref={subRef}
          className="font-display text-xs uppercase"
          style={{ letterSpacing: "0.55em", color: "rgba(245,111,13,0.4)", marginTop: "0.4rem" }}
        >
          PORTAFOLIO
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="relative z-10 mt-11 h-px w-36 overflow-hidden"
        style={{ background: "rgba(245,111,13,0.1)" }}
      >
        <div
          ref={barFillRef}
          style={{ height: "100%", background: "#f56f0d", width: "0%" }}
        />
      </div>
    </div>
  );
}
