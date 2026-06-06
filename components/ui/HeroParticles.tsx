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

const COUNT = 55;
const CONNECT_DIST = 130;
const R = "245,111,13";
const LINE = "255,255,255";

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

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = Array.from({ length: COUNT }, () => {
      const bx = Math.random() * canvas.width;
      const by = Math.random() * canvas.height;
      return {
        x: bx,
        y: by,
        baseX: bx,
        baseY: by,
        radius: Math.random() * 2 + 0.5,
        opacity: 0,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.006,
        orbitRadius: Math.random() * 50 + 15,
      };
    });
    particlesRef.current = particles;

    // Anime.js: per-particle fade-in then breathing loop
    particles.forEach((p, i) => {
      const hi = Math.random() * 0.45 + 0.08;
      const lo = hi * 0.22;
      // Fade in with stagger, then breathe indefinitely
      animate(p as unknown as Record<string, unknown>, {
        opacity: [0, hi],
        duration: 900,
        delay: i * 18,
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

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        // Slow orbital motion
        p.angle += p.angleSpeed;
        const tx = p.baseX + Math.cos(p.angle) * p.orbitRadius;
        const ty = p.baseY + Math.sin(p.angle) * p.orbitRadius;
        p.x += (tx - p.x) * 0.018;
        p.y += (ty - p.y) * 0.018;

        // Soft mouse repulsion
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 90 && d > 0) {
          const force = (1 - d / 90) * 2.2;
          p.x += (dx / d) * force;
          p.y += (dy / d) * force;
        }

        // Glow dot
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
        g.addColorStop(0, `rgba(${R},${p.opacity})`);
        g.addColorStop(1, `rgba(${R},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }

      // Connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECT_DIST) {
            const alpha = (1 - d / CONNECT_DIST) * 0.18;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${LINE},${alpha})`;
            ctx.lineWidth = 1.1;
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
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
