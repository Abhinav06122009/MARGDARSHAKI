import React, { useEffect, useMemo, useRef, useState } from "react";

type Mode = "focus" | "short" | "long";

type Settings = {
  focusMin: number;
  shortMin: number;
  longMin: number;
  longEvery: number; // long break after N focus sessions
};

const DEFAULTS: Settings = {
  focusMin: 25,
  shortMin: 5,
  longMin: 15,
  longEvery: 4,
};

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

export type TimerProps = {
  initial?: Partial<Settings>;
  size?: number; // px of the circular timer
};

function Stepper({
  label,
  value,
  unit = "min",
  onChange,
}: {
  label: string;
  value: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div style={styles.row}>
      <span style={styles.rowLabel}>{label}</span>
      <div style={styles.stepper}>
        <button onClick={() => onChange(value - 1)} style={styles.stepperBtn}>
          –
        </button>
        <span style={styles.stepperValue}>
          {value} <small style={{ opacity: 0.6 }}>{unit}</small>
        </span>
        <button onClick={() => onChange(value + 1)} style={styles.stepperBtn}>
          +
        </button>
      </div>
    </div>
  );
}

function Dot({ active }: { active: boolean }) {
  return (
    <span
      style={{
        height: 6,
        width: 18,
        borderRadius: 999,
        background: "#f3f3f3",
        opacity: active ? 1 : 0.25,
      }}
    />
  );
}

function useSessionSeconds(mode: Mode, s: Settings) {
  return useMemo(() => {
    if (mode === "focus") return s.focusMin * 60;
    if (mode === "short") return s.shortMin * 60;
    return s.longMin * 60;
  }, [mode, s.focusMin, s.shortMin, s.longMin]);
}

function useIntervalRunning(
  enabled: boolean,
  tick: () => void
) {
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    ref.current = window.setInterval(() => {
      tick();
    }, 1000);

    return () => {
      if (ref.current !== null) {
        window.clearInterval(ref.current);
        ref.current = null;
      }
    };
  }, [enabled, tick]);
}

function Ring({
  size,
  stroke,
  color,
  progress, // 0..1
}: {
  size: number;
  stroke: number;
  color: string;
  progress: number;
}) {
  const radius = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="#2b2b2b"
        strokeWidth={stroke}
        opacity={0.35}
      />
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dashoffset 0.35s linear" }}
      />
    </svg>
  );
}

function Title({ mode }: { mode: Mode }) {
  return (
    <span style={styles.title}>
      {mode === "focus" ? "Focus" : mode === "short" ? "Short Break" : "Long Break"}
    </span>
  );
}

function useColors(mode: Mode) {
  return mode === "focus" ? "#ff4d4f" : mode === "short" ? "#6CC644" : "#4C8CFF";
}

function TimerInner({ initial, size = 260 }: TimerProps) {
  const [settings, setSettings] = useState<Settings>({ ...DEFAULTS, ...initial });
  const [mode, setMode] = useState<Mode>("focus");
  const [running, setRunning] = useState(false);
  const [completedFocus, setCompletedFocus] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const total = useSessionSeconds(mode, settings);
  const [remaining, setRemaining] = useState(total);

  // keep remaining in sync when lengths change and not running
  useEffect(() => {
    if (!running) setRemaining(total);
  }, [total, running]);

  // tick effect
  useIntervalRunning(running, () => {
    setRemaining((prev) => {
      if (prev <= 1) {
        // end of session -> switch mode
        if (mode === "focus") {
          const nextCount = completedFocus + 1;
          setCompletedFocus(nextCount);
          const goLong = nextCount % settings.longEvery === 0;
          setMode(goLong ? "long" : "short");
        } else {
          setMode("focus");
        }
        return 0;
      }
      return prev - 1;
    });
  });

  // when mode flips (or just ended), preload the next duration
  useEffect(() => {
    setRemaining(useSessionSeconds(mode, settings));
  }, [mode, settings]);

  const progress = 1 - remaining / total;
  const color = useColors(mode);

  const onReset = () => {
    setRunning(false);
    setRemaining(total);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <Title mode={mode} />
          <button style={styles.iconBtn} onClick={() => setShowSettings((v) => !v)}>
            ⚙️
          </button>
        </div>

        <div style={styles.ringWrap}>
          <Ring size={size} stroke={14} color={color} progress={isFinite(progress) ? progress : 0} />
          <div style={styles.center}>
            <div style={styles.time}>{formatClock(remaining)}</div>
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
              {Array.from({ length: settings.longEvery }).map((_, i) => (
                <Dot key={i} active={i < (completedFocus % settings.longEvery)} />
              ))}
            </div>
          </div>
        </div>

        <div style={styles.controls}>
          <button style={styles.primaryBtn} onClick={() => setRunning((v) => !v)}>
            {running ? "Pause" : "Start"}
          </button>
          <button style={styles.secondaryBtn} onClick={onReset}>
            Reset
          </button>
        </div>
      </div>

      {showSettings && (
        <div style={styles.sheet} onClick={() => setShowSettings(false)}>
          <div style={styles.sheetInner} onClick={(e) => e.stopPropagation()}>
            <div style={styles.sheetHeader}>
              <span style={styles.sheetTitle}>Settings</span>
              <button style={styles.iconBtn} onClick={() => setShowSettings(false)}>
                ✕
              </button>
            </div>

            <div style={styles.rows}>
              <Stepper
                label="Focus Session"
                value={settings.focusMin}
                onChange={(v) =>
                  setSettings((s) => ({ ...s, focusMin: clampInt(v, 1, 180) }))
                }
              />
              <Stepper
                label="Short break"
                value={settings.shortMin}
                onChange={(v) =>
                  setSettings((s) => ({ ...s, shortMin: clampInt(v, 1, 60) }))
                }
              />
              <Stepper
                label="Long break"
                value={settings.longMin}
                onChange={(v) =>
                  setSettings((s) => ({ ...s, longMin: clampInt(v, 1, 120) }))
                }
              />
              <Stepper
                label="Long break after"
                value={settings.longEvery}
                unit="Sess."
                onChange={(v) =>
                  setSettings((s) => ({ ...s, longEvery: clampInt(v, 1, 12) }))
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100dvh",
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg, #0d0d0f, #1a1a1f)",
    color: "#f3f3f3",
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI",
    padding: 20,
  },
  card: {
    width: 360,
    background: "#111115",
    padding: 20,
    borderRadius: 24,
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: { fontWeight: 600, opacity: 0.9 },
  iconBtn: {
    height: 36,
    width: 36,
    borderRadius: 12,
    border: "1px solid #2a2a30",
    background: "#19191f",
    color: "#cfcfd6",
    cursor: "pointer",
  },
  ringWrap: {
    position: "relative",
    display: "grid",
    placeItems: "center",
    margin: "12px 0 8px",
  },
  center: {
    position: "absolute",
    inset: 0,
    display: "grid",
    placeItems: "center",
    pointerEvents: "none",
  },
  time: {
    fontSize: 52,
    letterSpacing: 1,
    fontVariantNumeric: "tabular-nums",
    marginBottom: 8,
  },
  controls: {
    display: "flex",
    gap: 12,
    marginTop: 8,
  },
  primaryBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    border: "none",
    background: "#2a2a30",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
  secondaryBtn: {
    width: 96,
    height: 44,
    borderRadius: 14,
    border: "1px solid #2a2a30",
    background: "transparent",
    color: "#cfcfd6",
    cursor: "pointer",
  },

  sheet: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "grid",
    placeItems: "end center",
    padding: 20,
    zIndex: 20,
  },
  sheetInner: {
    width: 360,
    background: "#111115",
    borderRadius: 24,
    padding: 16,
  },
  sheetHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sheetTitle: { fontWeight: 600 },
  rows: { display: "grid", gap: 8 },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 8px",
    background: "#15151b",
    borderRadius: 14,
  },
  rowLabel: { opacity: 0.85 },
  stepper: { display: "flex", alignItems: "center", gap: 8 },
  stepperBtn: {
    height: 36,
    width: 36,
    borderRadius: 12,
    border: "1px solid #2a2a30",
    background: "#19191f",
    color: "#fff",
    cursor: "pointer",
    fontSize: 18,
    lineHeight: "18px",
  },
  stepperValue: { width: 90, textAlign: "center", fontWeight: 600 },
};

function Timer(props: TimerProps) {
  return <TimerInner {...props} />;
}

export default Timer;
