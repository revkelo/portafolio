"use client";

// Música ambient generada con Web Audio API — sin archivos externos.
// Drone armónico en La (A2/A3) con LFO sutil para movimiento orgánico.

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const ctxRef   = useRef<AudioContext | null>(null);
  const gainRef  = useRef<GainNode | null>(null);

  function start() {
    const ctx = new AudioContext();
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 2.5);
    master.connect(ctx.destination);

    // Capas de osciladores armónicos
    const layers: [number, OscillatorType, number][] = [
      [55,  "sawtooth", 0.35],
      [110, "sine",     0.28],
      [165, "sine",     0.18],
      [220, "sine",     0.12],
      [330, "sine",     0.07],
      [440, "sine",     0.04],
    ];

    layers.forEach(([freq, type, vol]) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = vol;
      osc.connect(gain);
      gain.connect(master);
      osc.start();
    });

    // LFO suave para movimiento
    const lfo     = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.12;
    lfoGain.gain.value  = 3;
    lfo.connect(lfoGain);
    lfo.start();

    ctxRef.current  = ctx;
    gainRef.current = master;
  }

  function stop() {
    if (gainRef.current && ctxRef.current) {
      const now = ctxRef.current.currentTime;
      gainRef.current.gain.linearRampToValueAtTime(0, now + 1.8);
      setTimeout(() => {
        try { ctxRef.current?.close(); } catch {}
        ctxRef.current = null;
        gainRef.current = null;
      }, 2000);
    }
  }

  const toggle = () => {
    if (playing) { stop(); setPlaying(false); }
    else         { start(); setPlaying(true); }
  };

  useEffect(() => () => { if (playing) stop(); }, []);

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggle}
      title={playing ? "Detener música ambient" : "Reproducir música ambient"}
      aria-label={playing ? "Detener música" : "Reproducir música"}
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
        // Barra de pausa animada
        <motion.div style={{ display: "flex", gap: 2, alignItems: "center" }}>
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              animate={{ height: ["6px", "12px", "6px"] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15, ease: "easeInOut" }}
              style={{ display: "block", width: 2, background: "#f56f0d", borderRadius: 1 }}
            />
          ))}
        </motion.div>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      )}
    </motion.button>
  );
}
