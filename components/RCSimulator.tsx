"use client";

import { useState } from "react";

type Mode = "charging" | "discharging";

const W = 480;
const H = 260;
const PAD = { l: 40, r: 12, t: 18, b: 40 };
const XMAX = 5;

const SERIES = [
  { key: "q", label: "q / Qmax", color: "var(--c-electric)" },
  { key: "I", label: "I / Imax", color: "var(--c-circuits)" },
  { key: "U", label: "U / Umax", color: "var(--c-magnetic)" },
] as const;

function curves(mode: Mode, x: number) {
  const e = Math.exp(-x);
  return mode === "charging"
    ? { q: 1 - e, I: e, U: (1 - e) ** 2 }
    : { q: e, I: e, U: e * e };
}

function fmt(v: number, unit: string) {
  const abs = Math.abs(v);
  const prefixes: [number, string][] = [
    [1, ""],
    [1e-3, "m"],
    [1e-6, "μ"],
    [1e-9, "n"],
  ];
  for (const [f, p] of prefixes) if (abs >= f || f === 1e-9) return `${(v / f).toPrecision(3)} ${p}${unit}`;
  return `${v} ${unit}`;
}

function Slider(props: {
  label: string;
  unit: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="flex justify-between">
        <span className="font-medium">{props.label}</span>
        <span className="font-mono text-muted">
          {props.value} {props.unit}
        </span>
      </span>
      <input
        type="range"
        min={props.min}
        max={props.max}
        step={props.step ?? 1}
        value={props.value}
        onChange={(e) => props.onChange(Number(e.target.value))}
        className="accent-[var(--accent)]"
      />
    </label>
  );
}

export function RCSimulator({ title }: { title?: string }) {
  const [R, setR] = useState(10); // kΩ
  const [C, setC] = useState(10); // μF
  const [emf, setEmf] = useState(9);
  const [mode, setMode] = useState<Mode>("charging");
  const [x, setX] = useState(1); // t/τ

  const tau = R * 1e3 * C * 1e-6;
  const Qmax = C * 1e-6 * emf;
  const Imax = emf / (R * 1e3);
  const Umax = 0.5 * C * 1e-6 * emf * emf;
  const now = curves(mode, x);

  const sx = (v: number) => PAD.l + (v / XMAX) * (W - PAD.l - PAD.r);
  const sy = (v: number) => PAD.t + (1 - v) * (H - PAD.t - PAD.b);
  const path = (k: "q" | "I" | "U") =>
    Array.from({ length: 201 }, (_, i) => {
      const xv = (i / 200) * XMAX;
      return `${i ? "L" : "M"}${sx(xv).toFixed(1)},${sy(curves(mode, xv)[k]).toFixed(1)}`;
    }).join("");

  const markers = [
    { x: Math.LN2, label: "τ ln 2" },
    { x: 1, label: "" },
  ];

  return (
    <div className="not-prose my-8 rounded-2xl border border-line bg-card p-5 sm:p-6">
      <div className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent">Interactive</div>
      <h4 className="mb-4 font-display text-xl font-semibold">{title ?? "RC circuit"}</h4>

      <div className="grid gap-6 lg:grid-cols-[1fr_15rem]">
        <div>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`${mode} curves of charge, current and energy versus time`}>
            {[0, 0.25, 0.5, 0.75, 1].map((g) => (
              <g key={g}>
                <line x1={PAD.l} x2={W - PAD.r} y1={sy(g)} y2={sy(g)} stroke="var(--line)" strokeWidth={1} />
                <text x={PAD.l - 8} y={sy(g) + 4} textAnchor="end" fontSize={13} fill="var(--muted)">
                  {g}
                </text>
              </g>
            ))}
            {[0, 1, 2, 3, 4, 5].map((t) => (
              <text key={t} x={sx(t)} y={H - PAD.b + 18} textAnchor="middle" fontSize={13} fill="var(--muted)">
                {t === 0 ? "0" : `${t}τ`}
              </text>
            ))}
            {markers.map((m) => (
              <g key={m.x}>
                <line x1={sx(m.x)} x2={sx(m.x)} y1={PAD.t} y2={H - PAD.b} stroke="var(--muted)" strokeDasharray="3 4" strokeWidth={1} opacity={0.6} />
                {m.label && (
                  <text x={sx(m.x) - 4} y={PAD.t - 5} textAnchor="end" fontSize={12} fill="var(--muted)">
                    {m.label}
                  </text>
                )}
              </g>
            ))}
            {SERIES.map((s) => (
              <path key={s.key} d={path(s.key)} fill="none" stroke={s.color} strokeWidth={2.5} strokeLinecap="round" />
            ))}
            <line x1={sx(x)} x2={sx(x)} y1={PAD.t} y2={H - PAD.b} stroke="var(--fg)" strokeWidth={1.5} />
            {SERIES.map((s) => (
              <circle key={s.key} cx={sx(x)} cy={sy(now[s.key])} r={5} fill={s.color} stroke="var(--card)" strokeWidth={2} />
            ))}
            <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={13} fill="var(--muted)">
              time (t / τ)
            </text>
          </svg>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
            {SERIES.map((s) => (
              <span key={s.key} className="flex items-center gap-2">
                <span className="inline-block h-1 w-5 rounded" style={{ background: s.color }} />
                {s.label} = <b className="font-mono">{now[s.key].toFixed(3)}</b>
              </span>
            ))}
          </div>

          <div className="mt-4">
            <Slider label="Time cursor t" unit="τ" min={0} max={5} step={0.01} value={x} onChange={setX} />
          </div>
        </div>

        <div className="grid content-start gap-4">
          <div className="flex rounded-xl border border-line p-1 text-sm">
            {(["charging", "discharging"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`min-h-9 flex-1 rounded-lg capitalize transition-colors ${mode === m ? "bg-accent text-accent-fg" : "hover:bg-subtle"}`}
              >
                {m}
              </button>
            ))}
          </div>
          <Slider label="R" unit="kΩ" min={1} max={100} value={R} onChange={setR} />
          <Slider label="C" unit="μF" min={1} max={100} value={C} onChange={setC} />
          <Slider label="ε" unit="V" min={1} max={12} value={emf} onChange={setEmf} />

          <dl className="grid grid-cols-2 gap-x-3 gap-y-1 rounded-xl bg-subtle p-3 font-mono text-xs">
            <dt className="text-muted">τ = RC</dt>
            <dd>{fmt(tau, "s")}</dd>
            <dt className="text-muted">t</dt>
            <dd>{fmt(x * tau, "s")}</dd>
            <dt className="text-muted">q</dt>
            <dd>{fmt(now.q * Qmax, "C")}</dd>
            <dt className="text-muted">I</dt>
            <dd>{fmt(now.I * Imax, "A")}</dd>
            <dt className="text-muted">U</dt>
            <dd>{fmt(now.U * Umax, "J")}</dd>
          </dl>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted">
        Notice the red energy curve lags the yellow charge curve while charging: because U ∝ q², at
        t = τ ln 2 the charge is 50% full but the energy is only 25% full.
      </p>
    </div>
  );
}
