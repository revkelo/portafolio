"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { animate } from "animejs";
import { scrambleText } from "animejs/text";

interface SectionTitleProps {
  number: string;
  label: string;
  title: string;
  subtitle?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function SectionTitle({ number, label, title, subtitle }: SectionTitleProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const hasScrambled = useRef(false);
  const isInView = useInView(wrapperRef, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!isInView || hasScrambled.current || !titleRef.current) return;
    hasScrambled.current = true;

    // Small delay so Framer Motion slide-up starts before scramble kicks in
    const id = setTimeout(() => {
      animate(titleRef.current!, {
        innerHTML: scrambleText({
          chars: "uppercase",
          from: "left",
          cursor: "_",
          duration: 850,
          perturbation: 0.3,
        }) as unknown as string,
        ease: "linear",
      });
    }, 200);

    return () => clearTimeout(id);
  }, [isInView]);

  return (
    <motion.div
      ref={wrapperRef}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ staggerChildren: 0.12, delayChildren: 0.05 }}
      className="mb-12"
    >
      {/* Número / label */}
      <motion.p
        variants={{ hidden: { opacity: 0, x: -18 }, show: { opacity: 1, x: 0 } }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mb-4 font-display text-xs uppercase tracking-[0.4em] text-orange-primary"
      >
        {number} <span className="text-text-secondary/60">/</span> {label}
      </motion.p>

      {/* Barra + título con clip-path reveal + scramble */}
      <div className="flex items-center gap-4">
        <motion.span
          aria-hidden
          variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1 } }}
          transition={{ duration: 0.55, ease: EASE }}
          style={{ transformOrigin: "top", clipPath: "polygon(60% 0, 100% 0, 40% 100%, 0 100%)" }}
          className="h-10 w-3 shrink-0 bg-orange-primary sm:h-12"
        />

        <div style={{ overflow: "hidden" }}>
          <motion.h2
            ref={titleRef}
            variants={{ hidden: { y: "100%", opacity: 0 }, show: { y: "0%", opacity: 1 } }}
            transition={{ duration: 0.65, ease: EASE }}
            className="font-display text-4xl font-bold tracking-tight text-text-primary md:text-5xl lg:text-6xl"
          >
            {title}
          </motion.h2>
        </div>
      </div>

      {subtitle && (
        <motion.p
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mt-3 max-w-2xl pl-7 text-text-secondary"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
