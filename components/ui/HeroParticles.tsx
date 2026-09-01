"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  opacity: number;
  angle: number;
  angleSpeed: number;
  orbitRadius: number;
}

const R = "245,111,13";
const LINE = "255,255,255";

function isMobileViewport() {
  return typeof window !== "undefined" && window.innerWidth < 768;
}

export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // DPR-aware resize: canvas renders at physical pixels, ctx draws in CSS pixels
    const applySize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    applySize();

    const mobile = isMobileViewport();
    const COUNT        = 60;
    const CONNECT_DIST = mobile ? 110 : 130;
    const LINE_WIDTH   = 1.6;
    const LINE_ALPHA   = 0.28;
    const DOT_SCALE    = 4;
    const RADIUS_MAX   = 2.8;

    const lw = () => canvas.offsetWidth;
    const lh = () => canvas.offsetHeight;

    const makeParticles = (): Particle[] =>
      Array.from({ length: COUNT }, () => {
        const bx = Math.random() * lw();
        const by = Math.random() * lh();
        return {
          x: bx, y: by, baseX: bx, baseY: by,
          radius: Math.random() * RADIUS_MAX + 0.8,
          opacity: 0,
          angle: Math.random() * Math.PI * 2,
          angleSpeed: (Math.random() - 0.5) * 0.006,
          orbitRadius: Math.random() * 50 + 15,
        };
      });

    let particles = makeParticles();
    particlesRef.current = particles;

    const startAnims = (ps: Particle[]) => {
      ps.forEach((p, i) => {
        const hi = Math.random() * 0.55 + 0.18;
        const lo = hi * 0.22;
        animate(p as unknown as Record<string, unknown>, {
          opacity: [0, hi],
          duration: 900,
          delay: i * 16,
          ease: "outSine",
          onComplete: () => {
            animate(p as unknown as Record<string, unknown>, {
              opacity: [hi, lo],
              duration: 2400 + Math.random() * 2600,
              direction: "alternate",
              loop: true,
              ease: "inOutSine",
            });
          },
        });
      });
    };
    startAnims(particles);

    const draw = () => {
      ctx.clearRect(0, 0, lw(), lh());

      for (const p of particles) {
        p.angle += p.angleSpeed;
        const tx = p.baseX + Math.cos(p.angle) * p.orbitRadius;
        const ty = p.baseY + Math.sin(p.angle) * p.orbitRadius;
        p.x += (tx - p.x) * 0.018;
        p.y += (ty - p.y) * 0.018;

        // Mouse repulsion (desktop only - mouse doesn't exist on touch)
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 90 && d > 0) {
          p.x += (dx / d) * (1 - d / 90) * 2.2;
          p.y += (dy / d) * (1 - d / 90) * 2.2;
        }

        // Glow dot
        const gr = p.radius * DOT_SCALE;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, gr);
        g.addColorStop(0, `rgba(${R},${p.opacity})`);
        g.addColorStop(1, `rgba(${R},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, gr, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }

      // Connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * LINE_ALPHA;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${LINE},${alpha})`;
            ctx.lineWidth = LINE_WIDTH;
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    const onResize = () => {
      applySize();
      // Re-scatter particles so they fill the new dimensions
      particles.forEach((p) => {
        p.baseX = Math.random() * lw();
        p.baseY = Math.random() * lh();
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1]"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
