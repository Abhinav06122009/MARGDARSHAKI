import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from 'react-router-dom';

// --- Types & Defaults ---
type Mode = "focus" | "short" | "long";

type Settings = {
  focusMin: number;
  shortMin: number;
  longMin: number;
  longEvery: number; 
};

const DEFAULTS: Settings = {
  focusMin: 25,
  shortMin: 5,
  longMin: 15,
  longEvery: 4,
};

// --- Helpers (Pure functions, no Hooks) ---
function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function formatClock(totalSec: number) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${pad2(m)}:${pad2(s)}`;
}

function clampInt(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function getModeColor(mode: Mode) {
  switch (mode) {
    case 'focus': return '#ff4d4f'; // Red
    case 'short': return '#6CC644'; // Green
    case 'long': return '#4C8CFF';  // Blue
  }
}

// --- Sub-components ---
function Stepper({ label, value, unit = "min", onChange }: { label: string; value: number; unit?: string; onChange: (v: number) => void }) {
  return (
    <div style={styles.row}>
      <span style={styles.rowLabel}>{label}</span>
      <div style={styles.stepper}>
        <button onClick={() => onChange(value - 1)} style={styles.stepperBtn}>–</button>
        <span style={styles.stepperValue}>{value} <small style={{ opacity: 0.6 }}>{unit}</small></span>
        <button onClick={() => onChange(value + 1)} style={styles.stepperBtn}>+</button>
      </div>
    </div>
  );
}

function Dot({ active }: { active: boolean }) {
  return (
    <span style={{ height: 6, width: 18, borderRadius: 999, background: "#f3f3f3", opacity: active ? 1 : 0.25 }} />
  );
}

function Ring({ size, stroke, color, progress }: { size: number; stroke: number; color: string; progress: number }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#2b2b2b" strokeWidth={stroke} opacity={0.35} />
      <circle
        cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: "stroke-dashoffset 0.35s linear" }}
      />
    </svg>
  );
}

// --- Main Component ---
export default function StudyTimer({ initial, size = 260 }: { initial?: Partial<Settings>; size?: number }) {
  const [settings, setSettings] = useState<Settings>({ ...DEFAULTS, ...initial });
  const [mode, setMode] = useState<Mode>("focus");
  const [running, setRunning] = useState(false);
  const [completedFocus, setCompletedFocus] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  // Calculate total seconds for current mode
  const totalSeconds = useMemo(() => {
    if (mode === "focus") return settings.focusMin * 60;
    if (mode === "short") return settings.shortMin * 60;
    return settings.longMin * 60;
  }, [mode, settings]);

  const [remaining, setRemaining] = useState(totalSeconds);
  const timerRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // 1. Audio Helper
  const playAlert = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // High pitch
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) { console.error("Audio error", e); }
  };

  // 2. Browser Notification Helper
  const sendNotification = (msg: string) => {
    if (Notification.permission === "granted") {
      new Notification("MARGDARSHAK Timer", { body: msg });
    }
  };

  // 3. Request Notification Permission on Mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // 4. Update Tab Title
  useEffect(() => {
    document.title = running 
      ? `(${formatClock(remaining)}) ${mode.toUpperCase()}` 
      : "Study Timer | MARGDARSHAK";
  }, [remaining, running, mode]);

  // 5. Reset timer when mode or settings change (if not running)
  useEffect(() => {
    if (!running) {
      setRemaining(totalSeconds);
    }
  }, [totalSeconds, running]);

  // 6. The Timer Logic (Fixed Hook Issue)
  useEffect(() => {
    if (running) {
      timerRef.current = window.setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            // TIMER FINISHED
            playAlert();
            
            let nextMode: Mode = "focus";
            if (mode === "focus") {
              const nextCount = completedFocus + 1;
              setCompletedFocus(nextCount);
              const isLongBreak = nextCount % settings.longEvery === 0;
              nextMode = isLongBreak ? "long" : "short";
              sendNotification(isLongBreak ? "Great work! Take a long break." : "Focus done. Take a short break.");
            } else {
              nextMode = "focus";
              sendNotification("Break over. Back to focus!");
            }
            
            setMode(nextMode);
            // We return 0 here, but the effect above (5) will catch the mode change 
            // and reset the 'remaining' time immediately because 'running' is true?
            // Actually, we should probably pause or let it auto-reset.
            // Let's Pause auto-reset behavior:
            setRunning(false); 
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, mode, settings, completedFocus]);

  // --- Render ---
  const progress = Math.max(0, Math.min(1, 1 - remaining / totalSeconds));
  const color = getModeColor(mode);

  return (
    <div style={styles.page}>
      {/* Navigation */}
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
            <button style={styles.secondaryBtn}>← Home</button>
        </Link>
      </div>

      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.title}>
            {mode === "focus" ? "Focus Session" : mode === "short" ? "Short Break" : "Long Break"}
          </span>
          <button style={styles.iconBtn} onClick={() => setShowSettings(!showSettings)}>⚙️</button>
        </div>

        {/* Timer Ring */}
        <div style={styles.ringWrap}>
          <Ring size={size} stroke={14} color={color} progress={isFinite(progress) ? progress : 0} />
          <div style={styles.center}>
            <div style={styles.time}>{formatClock(remaining)}</div>
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
              {Array.from({ length: settings.longEvery }).map((_, i) => (
                <Dot key={i} active={i < (completedFocus % settings.longEvery)} />
              ))}
            </div>
            <div style={{ fontSize: 12, opacity: 0.5, marginTop: 4 }}>
                {running ? 'Running' : 'Paused'}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={styles.controls}>
          <button style={{...styles.primaryBtn, backgroundColor: running ? '#d93025' : '#2a2a30'}} onClick={() => setRunning(!running)}>
            {running ? "Pause" : "Start"}
          </button>
          <button style={styles.secondaryBtn} onClick={() => { setRunning(false); setRemaining(totalSeconds); }}>
            Reset
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div style={styles.sheet} onClick={() => setShowSettings(false)}>
          <div style={styles.sheetInner} onClick={(e) => e.stopPropagation()}>
            <div style={styles.sheetHeader}>
              <span style={styles.sheetTitle}>Settings</span>
              <button style={styles.iconBtn} onClick={() => setShowSettings(false)}>✕</button>
            </div>
            <div style={styles.rows}>
              <Stepper label="Focus (min)" value={settings.focusMin} onChange={(v) => setSettings(s => ({...s, focusMin: clampInt(v, 1, 120)}))} />
              <Stepper label="Short Break (min)" value={settings.shortMin} onChange={(v) => setSettings(s => ({...s, shortMin: clampInt(v, 1, 30)}))} />
              <Stepper label="Long Break (min)" value={settings.longMin} onChange={(v) => setSettings(s => ({...s, longMin: clampInt(v, 1, 60)}))} />
              <Stepper label="Intervals" value={settings.longEvery} unit="sess." onChange={(v) => setSettings(s => ({...s, longEvery: clampInt(v, 1, 10)}))} />
            </div>
          </div>
        </div>
      )}

      {/* REQUIRED SEO CONTENT */}
      <div style={{ maxWidth: '800px', margin: '60px auto 20px', color: '#9ca3af', lineHeight: '1.6' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#fff' }}>Free Online Pomodoro Study Timer</h1>
        <p style={{ marginBottom: '1rem' }}>
          Maximize your academic productivity with our free online study timer, designed around the scientifically proven Pomodoro Technique. 
          Perfect for students preparing for exams, JEE, NEET, or university finals.
        </p>
        
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem', color: '#fff' }}>Features</h2>
        <ul style={{ paddingLeft: '20px', marginBottom: '1.5rem', listStyleType: 'disc' }}>
            <li><strong>Customizable Intervals:</strong> Adjust focus time, short breaks, and long breaks to fit your learning style.</li>
            <li><strong>Audio Notifications:</strong> Gentle alerts ensure you never miss a break or a start time.</li>
            <li><strong>Visual Progress:</strong> A clean ring interface helps you visualize remaining time without distraction.</li>
        </ul>
      </div>
    </div>
  );
}

// --- Styles ---
const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100dvh", display: "grid", placeItems: "center", background: "linear-gradient(135deg, #0d0d0f, #1a1a1f)", color: "#f3f3f3", fontFamily: "Inter, sans-serif", padding: 20, position: 'relative' },
  card: { width: 360, background: "#111115", padding: 20, borderRadius: 24, boxShadow: "0 10px 30px rgba(0,0,0,0.5)" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  title: { fontWeight: 600, fontSize: 18, color: '#fff' },
  iconBtn: { height: 36, width: 36, borderRadius: 12, border: "1px solid #2a2a30", background: "#19191f", color: "#cfcfd6", cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center' },
  ringWrap: { position: "relative", display: "grid", placeItems: "center", margin: "20px 0" },
  center: { position: "absolute", inset: 0, display: "flex", flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: "none" },
  time: { fontSize: 56, fontWeight: 700, fontVariantNumeric: "tabular-nums", letterSpacing: -1 },
  controls: { display: "flex", gap: 12, marginTop: 20 },
  primaryBtn: { flex: 1, height: 48, borderRadius: 16, border: "none", background: "#2a2a30", color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 16 },
  secondaryBtn: { width: 96, height: 48, borderRadius: 16, border: "1px solid #3a3a40", background: "transparent", color: "#cfcfd6", cursor: "pointer", fontWeight: 500 },
  sheet: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "grid", placeItems: "end center", padding: 20, zIndex: 100, backdropFilter: 'blur(2px)' },
  sheetInner: { width: 360, background: "#16161a", borderRadius: 24, padding: 20, border: '1px solid #333' },
  sheetHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  sheetTitle: { fontWeight: 600, fontSize: 18 },
  rows: { display: "grid", gap: 12 },
  row: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", background: "#1c1c21", borderRadius: 14 },
  rowLabel: { opacity: 0.8, fontSize: 14 },
  stepper: { display: "flex", alignItems: "center", gap: 10 },
  stepperBtn: { height: 32, width: 32, borderRadius: 10, border: "none", background: "#2a2a30", color: "#fff", cursor: "pointer", fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  stepperValue: { width: 60, textAlign: "center", fontWeight: 600 },
};
