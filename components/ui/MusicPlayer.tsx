"use client";

// Música ambient con Web Audio API.
// Acorde Am7 en ondas seno suaves con breathing lento — sonido orgánico, no áspero.

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function MusicPlayer() {
  const [playing, setPlaying]    = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const ctxRef  = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
  }, []);

  function start() {
    const ctx    = new AudioContext();
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 3);
    master.connect(ctx.destination);

    // Am7: A C E G — suaves, musicales
    const freqs: [number, number][] = [
      [110,  0.35],  // A2
      [130.8,0.22],  // C3
      [164.8,0.18],  // E3
      [196,  0.14],  // G3
      [220,  0.20],  // A3
      [261.6,0.12],  // C4
      [329.6,0.08],  // E4
    ];

    freqs.forEach(([freq, vol], i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();

      // LFO de vibrato muy sutil
      const vib     = ctx.createOscillator();
      const vibGain = ctx.createGain();
      vib.frequency.value  = 0.2 + i * 0.07;
      vibGain.gain.value   = 0.8;
      vib.connect(vibGain);
      vibGain.connect(osc.frequency);
      vib.start();

      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.value = vol * 0.06;

      // "Breathing" — cada voz respira a ritmo diferente
      const breathe     = ctx.createOscillator();
      const breatheGain = ctx.createGain();
      breathe.frequency.value  = 0.05 + i * 0.015;
      breatheGain.gain.value   = gain.gain.value * 0.4;
      breathe.connect(breatheGain);
      breatheGain.connect(gain.gain);
      breathe.start();

      osc.connect(gain);
      gain.connect(master);
      osc.start();
    });

    ctxRef.current  = ctx;
    gainRef.current = master;
  }

  function stop() {
    if (gainRef.current && ctxRef.current) {
      const now = ctxRef.current.currentTime;
      gainRef.current.gain.linearRampToValueAtTime(0, now + 2);
      setTimeout(() => {
        try { ctxRef.current?.close(); } catch {}
        ctxRef.current = null;
        gainRef.current = null;
      }, 2200);
    }
  }

  const toggle = () => {
    if (playing) { stop(); setPlaying(false); }
    else         { start(); setPlaying(true); }
  };

  useEffect(() => () => { if (playing) stop(); }, []);

  if (!isDesktop) return null;

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggle}
      title={playing ? "Detener música ambient" : "Reproducir música ambient"}
      aria-label={playing ? "Detener música" : "Reproducir música"}
      className="hidden sm:flex"
      style={{
        position: "fixed", bottom: "4rem", left: "1.5rem", zIndex: 200,
        width: 36, height: 36, borderRadius: "50%",
        background: playing ? "rgba(245,111,13,0.15)" : "rgba(13,13,13,0.88)",
        border: `1px solid ${playing ? "rgba(245,111,13,0.55)" : "rgba(245,111,13,0.2)"}`,
        color: playing ? "#f56f0d" : "rgba(245,111,13,0.5)",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(10px)", transition: "all 0.3s ease",
      }}
    >
      {playing ? (
        <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              animate={{ height: ["5px", "11px", "5px"] }}
              transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.18, ease: "easeInOut" }}
              style={{ display: "block", width: 2.5, background: "#f56f0d", borderRadius: 2 }}
            />
          ))}
        </div>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
        </svg>
      )}
    </motion.button>
  );
}
