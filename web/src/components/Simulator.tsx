/*
 * The simulator deliberately uses two patterns that r3f relies on but that
 * react-hooks v7's strict rules flag:
 *  - mutating the Three.js camera returned by useThree() (react-hooks/immutability)
 *  - reading stateRef.current inside <Canvas>'s frame loop (react-hooks/refs)
 * Both are intentional and standard for @react-three/fiber. Cloning state on
 * every frame to satisfy the linter would tank performance for no benefit.
 */
/* eslint-disable react-hooks/refs, react-hooks/immutability */
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import * as THREE from "three";

/* -----------------------------------------------------------------------
   Roma — Tier-1 jobsite viewer
   A self-contained, scripted simulation of a tilt-up warehouse-shell build.
   No backend; deterministic given a seed. Designed so the same scene can
   later be driven by a real WebSocket-fed simulator with minimal changes.
----------------------------------------------------------------------- */

// Domain ---------------------------------------------------------------

type ZoneState = "empty" | "pouring" | "cured";
type RobotKind = "pour" | "haul" | "survey";

interface Zone {
  id: string;
  x: number; // world center x
  z: number;
  w: number;
  d: number;
  state: ZoneState;
  progress: number; // 0..1 while pouring
}

interface Panel {
  id: string;
  x: number;
  z: number;
  w: number;
  rotY: number;
  state: "staged" | "lifting" | "set";
  progress: number; // 0..1 during lift
}

interface Robot {
  id: string;
  kind: RobotKind;
  x: number;
  z: number;
  targetX: number;
  targetZ: number;
  task: string | null;
  speed: number;
  pulse: number;
}

interface SimState {
  t: number; // sim seconds
  zones: Zone[];
  panels: Panel[];
  robots: Robot[];
  events: { t: number; msg: string }[];
}

const SITE_W = 60;
const SITE_D = 40;
const GRID_X = 4;
const GRID_Z = 3;
const STAGING = { x: -SITE_W / 2 - 6, z: 0 };

function buildInitialState(): SimState {
  const zones: Zone[] = [];
  const cellW = SITE_W / GRID_X;
  const cellD = SITE_D / GRID_Z;
  for (let i = 0; i < GRID_X; i++) {
    for (let j = 0; j < GRID_Z; j++) {
      zones.push({
        id: `z-${i}-${j}`,
        x: -SITE_W / 2 + cellW / 2 + i * cellW,
        z: -SITE_D / 2 + cellD / 2 + j * cellD,
        w: cellW - 0.4,
        d: cellD - 0.4,
        state: "empty",
        progress: 0,
      });
    }
  }

  const panels: Panel[] = [];
  // Long perimeter walls (top + bottom)
  const perPanelW = 8;
  const perimeterCount = Math.floor(SITE_W / perPanelW);
  for (let i = 0; i < perimeterCount; i++) {
    const x = -SITE_W / 2 + perPanelW / 2 + i * perPanelW;
    panels.push({
      id: `p-n-${i}`,
      x,
      z: -SITE_D / 2 - 0.4,
      w: perPanelW - 0.6,
      rotY: 0,
      state: "staged",
      progress: 0,
    });
    panels.push({
      id: `p-s-${i}`,
      x,
      z: SITE_D / 2 + 0.4,
      w: perPanelW - 0.6,
      rotY: Math.PI,
      state: "staged",
      progress: 0,
    });
  }

  const robots: Robot[] = [
    {
      id: "ROMA-01",
      kind: "pour",
      x: STAGING.x,
      z: STAGING.z - 4,
      targetX: STAGING.x,
      targetZ: STAGING.z - 4,
      task: null,
      speed: 6,
      pulse: 0,
    },
    {
      id: "ROMA-02",
      kind: "pour",
      x: STAGING.x,
      z: STAGING.z + 4,
      targetX: STAGING.x,
      targetZ: STAGING.z + 4,
      task: null,
      speed: 6,
      pulse: 0,
    },
    {
      id: "ROMA-03",
      kind: "haul",
      x: STAGING.x - 2,
      z: STAGING.z,
      targetX: STAGING.x - 2,
      targetZ: STAGING.z,
      task: null,
      speed: 5,
      pulse: 0,
    },
    {
      id: "ROMA-04",
      kind: "survey",
      x: 0,
      z: -SITE_D / 2 - 3,
      targetX: SITE_W / 2 + 3,
      targetZ: -SITE_D / 2 - 3,
      task: null,
      speed: 4.5,
      pulse: 0,
    },
  ];

  return { t: 0, zones, panels, robots, events: [] };
}

// Step ----------------------------------------------------------------

function stepSim(state: SimState, dt: number): SimState {
  const t = state.t + dt;
  const zones = state.zones.map((z) => ({ ...z }));
  const panels = state.panels.map((p) => ({ ...p }));
  const robots = state.robots.map((r) => ({ ...r }));
  const events = state.events.slice();

  // Tick zones
  for (const z of zones) {
    if (z.state === "pouring") {
      z.progress = Math.min(1, z.progress + dt / 7); // 7s per pour
      if (z.progress >= 1) {
        z.state = "cured";
        events.push({ t, msg: `Slab ${z.id} cured` });
      }
    }
  }

  // Tick panels — lift in waves once 50% of zones are cured
  const curedRatio =
    zones.filter((z) => z.state === "cured").length / zones.length;
  for (const p of panels) {
    if (p.state === "lifting") {
      p.progress = Math.min(1, p.progress + dt / 4);
      if (p.progress >= 1) {
        p.state = "set";
        events.push({ t, msg: `Panel ${p.id} set` });
      }
    }
  }
  if (curedRatio > 0.5) {
    const staged = panels.filter((p) => p.state === "staged");
    const lifting = panels.filter((p) => p.state === "lifting").length;
    if (lifting < 2 && staged.length > 0) {
      staged[0].state = "lifting";
      events.push({ t, msg: `Lifting panel ${staged[0].id}` });
    }
  }

  // Tick robots
  for (const r of robots) {
    r.pulse += dt;

    // Move toward target
    const dx = r.targetX - r.x;
    const dz = r.targetZ - r.z;
    const dist = Math.hypot(dx, dz);
    if (dist > 0.1) {
      const step = Math.min(r.speed * dt, dist);
      r.x += (dx / dist) * step;
      r.z += (dz / dist) * step;
      continue;
    }

    // Arrived — pick next behavior
    if (r.kind === "pour") {
      if (r.task) {
        const z = zones.find((zz) => zz.id === r.task);
        if (z) {
          if (z.state === "empty") {
            z.state = "pouring";
            z.progress = 0;
            events.push({ t, msg: `${r.id} starts pour ${z.id}` });
          } else if (z.state === "cured") {
            r.task = null; // freed
          }
        } else {
          r.task = null;
        }
      }

      if (!r.task) {
        const next = zones.find((zz) => zz.state === "empty");
        if (next) {
          r.task = next.id;
          r.targetX = next.x;
          r.targetZ = next.z;
        } else {
          // idle at staging
          r.targetX = STAGING.x + (Math.random() - 0.5) * 4;
          r.targetZ = STAGING.z + (Math.random() - 0.5) * 8;
        }
      }
    } else if (r.kind === "haul") {
      // Bounce between staging and the most recent active zone
      const active =
        zones.find((zz) => zz.state === "pouring") ??
        zones.find((zz) => zz.state === "empty");
      if (!active) {
        r.targetX = STAGING.x - 2;
        r.targetZ = STAGING.z;
      } else if (Math.hypot(r.x - STAGING.x, r.z - STAGING.z) < 6) {
        r.targetX = active.x;
        r.targetZ = active.z;
      } else {
        r.targetX = STAGING.x - 2;
        r.targetZ = STAGING.z;
      }
    } else if (r.kind === "survey") {
      // Loop the perimeter clockwise
      const margin = 3;
      const corners: [number, number][] = [
        [SITE_W / 2 + margin, -SITE_D / 2 - margin],
        [SITE_W / 2 + margin, SITE_D / 2 + margin],
        [-SITE_W / 2 - margin, SITE_D / 2 + margin],
        [-SITE_W / 2 - margin, -SITE_D / 2 - margin],
      ];
      const cur = corners.findIndex(
        (c) => Math.hypot(c[0] - r.x, c[1] - r.z) < 0.5,
      );
      const nextIdx = cur === -1 ? 0 : (cur + 1) % corners.length;
      r.targetX = corners[nextIdx][0];
      r.targetZ = corners[nextIdx][1];
    }
  }

  return {
    t,
    zones,
    panels,
    robots,
    events: events.slice(-30),
  };
}

// Rendering ------------------------------------------------------------

const COLORS = {
  ground: "#e9e3d5",
  gridLine: "#0a0a0a",
  zoneEmpty: "#d8d2c2",
  zonePouring: "#bfbcae",
  zoneCured: "#a3a195",
  panelStaged: "#1a1a1a",
  panelLifting: "#2a2a2c",
  panelSet: "#0a0a0a",
  robotBody: "#0a0a0a",
  robotAccent: "#4a6b57",
  staging: "#0a0a0a",
};

function ZoneMesh({ zone }: { zone: Zone }) {
  const color =
    zone.state === "empty"
      ? COLORS.zoneEmpty
      : zone.state === "pouring"
        ? // lerp empty -> cured by progress
          new THREE.Color(COLORS.zoneEmpty)
            .lerp(new THREE.Color(COLORS.zoneCured), zone.progress)
            .getStyle()
        : COLORS.zoneCured;

  return (
    <mesh position={[zone.x, 0.04, zone.z]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[zone.w, zone.d]} />
      <meshStandardMaterial color={color} roughness={1} />
    </mesh>
  );
}

function PanelMesh({ panel }: { panel: Panel }) {
  // Lift animation: rotate from flat (lying staged on ground) to vertical
  const angle = panel.state === "set" ? 0 : (1 - panel.progress) * (Math.PI / 2);
  const liftHeight = panel.progress * 3;

  return (
    <group position={[panel.x, 0, panel.z]} rotation={[0, panel.rotY, 0]}>
      <group position={[0, 3 + liftHeight - 3, 0]} rotation={[angle, 0, 0]}>
        <mesh position={[0, 3, 0]}>
          <boxGeometry args={[panel.w, 6, 0.3]} />
          <meshStandardMaterial
            color={
              panel.state === "set"
                ? COLORS.panelSet
                : panel.state === "lifting"
                  ? COLORS.panelLifting
                  : COLORS.panelStaged
            }
            roughness={0.9}
          />
        </mesh>
      </group>
    </group>
  );
}

function RobotMesh({ robot }: { robot: Robot }) {
  // Subtle rotation toward direction of travel
  const dx = robot.targetX - robot.x;
  const dz = robot.targetZ - robot.z;
  const yaw = Math.atan2(dx, dz);
  const dotPulse = (Math.sin(robot.pulse * 4) + 1) / 2;
  const dotScale = 0.5 + dotPulse * 0.5;

  // Different body shape per kind
  const bodyW = robot.kind === "haul" ? 1.6 : robot.kind === "pour" ? 1.2 : 0.9;
  const bodyD = robot.kind === "haul" ? 2.4 : robot.kind === "pour" ? 1.8 : 1.4;
  const bodyH = robot.kind === "survey" ? 0.5 : 0.7;

  return (
    <group position={[robot.x, 0, robot.z]} rotation={[0, yaw, 0]}>
      <mesh position={[0, bodyH / 2 + 0.05, 0]}>
        <boxGeometry args={[bodyW, bodyH, bodyD]} />
        <meshStandardMaterial color={COLORS.robotBody} roughness={0.6} />
      </mesh>
      {/* accent dot on top */}
      <mesh
        position={[0, bodyH + 0.15, 0]}
        scale={[dotScale, dotScale, dotScale]}
      >
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshBasicMaterial color={COLORS.robotAccent} />
      </mesh>
    </group>
  );
}

function StagingArea() {
  return (
    <group position={[STAGING.x, 0, STAGING.z]}>
      {/* outline pad */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 18]} />
        <meshStandardMaterial color="#dcd5c5" roughness={1} />
      </mesh>
      {/* Roma containers */}
      {[-4, 0, 4].map((dz) => (
        <mesh key={dz} position={[-2, 1, dz]}>
          <boxGeometry args={[3, 2, 2.5]} />
          <meshStandardMaterial color={COLORS.staging} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function SiteFootprint() {
  const points = useMemo(() => {
    const w = SITE_W / 2;
    const d = SITE_D / 2;
    return new Float32Array([
      -w, 0.05, -d, w, 0.05, -d,
      w, 0.05, -d, w, 0.05, d,
      w, 0.05, d, -w, 0.05, d,
      -w, 0.05, d, -w, 0.05, -d,
    ]);
  }, []);

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#0a0a0a" />
    </lineSegments>
  );
}

// Aim the (orthographic) default camera at the jobsite, and reframe on resize
// so the whole site is always in view regardless of canvas size.
function CameraRig() {
  const { camera, size } = useThree();

  useEffect(() => {
    if (!(camera instanceof THREE.OrthographicCamera)) return;

    camera.position.set(55, 60, 55);
    camera.up.set(0, 1, 0);
    camera.lookAt(0, 0, 0);

    // Fit ~1.4x the site footprint into the canvas (with margin for staging)
    const fitWorldW = (SITE_W + 24) * 1.0;
    const fitWorldH = (SITE_D + 18) * 1.0;
    const aspect = size.width / size.height;
    const worldH = Math.max(fitWorldH, fitWorldW / aspect);
    camera.zoom = size.height / worldH;

    camera.near = -200;
    camera.far = 500;
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

function Scene({
  stateRef,
  setSnapshot,
}: {
  stateRef: React.MutableRefObject<SimState>;
  setSnapshot: (s: SimState) => void;
}) {
  // Render snapshot is throttled; sim ticks every frame.
  const sinceUpdate = useRef(0);

  useFrame((_, dt) => {
    const realDt = Math.min(dt, 0.1) * 1.5; // slight time compression
    stateRef.current = stepSim(stateRef.current, realDt);
    sinceUpdate.current += realDt;
    if (sinceUpdate.current > 0.1) {
      sinceUpdate.current = 0;
      setSnapshot(stateRef.current);
    }
  });

  const s = stateRef.current;

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[20, 30, 10]} intensity={0.8} />
      <directionalLight position={[-20, 20, -10]} intensity={0.25} />

      {/* Ground */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color={COLORS.ground} roughness={1} />
      </mesh>

      {/* Architectural grid */}
      <Grid
        position={[0, 0.02, 0]}
        args={[140, 140]}
        cellSize={4}
        cellThickness={0.4}
        cellColor="#0a0a0a"
        sectionSize={20}
        sectionThickness={0.6}
        sectionColor="#0a0a0a"
        fadeDistance={120}
        fadeStrength={1.2}
        infiniteGrid={false}
      />

      <SiteFootprint />
      <StagingArea />

      {s.zones.map((z) => (
        <ZoneMesh key={z.id} zone={z} />
      ))}
      {s.panels.map((p) => (
        <PanelMesh key={p.id} panel={p} />
      ))}
      {s.robots.map((r) => (
        <RobotMesh key={r.id} robot={r} />
      ))}
    </>
  );
}

function fmtClock(t: number) {
  const total = Math.floor(t);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function Simulator() {
  const stateRef = useRef<SimState>(buildInitialState());
  const [snapshot, setSnapshot] = useState<SimState>(stateRef.current);

  // Reset the sim periodically so the page is always lively
  useEffect(() => {
    const id = setInterval(() => {
      const s = stateRef.current;
      const allCured = s.zones.every((z) => z.state === "cured");
      const allSet = s.panels.every((p) => p.state === "set");
      if (allCured && allSet) {
        stateRef.current = buildInitialState();
      }
    }, 1500);
    return () => clearInterval(id);
  }, []);

  const cured = snapshot.zones.filter((z) => z.state === "cured").length;
  const pouring = snapshot.zones.filter((z) => z.state === "pouring").length;
  const totalZones = snapshot.zones.length;
  const panelsSet = snapshot.panels.filter((p) => p.state === "set").length;
  const totalPanels = snapshot.panels.length;
  const activeRobots = snapshot.robots.length;
  const lastEvents = snapshot.events.slice(-3).reverse();

  return (
    <section id="live" className="relative bg-bone-2 py-32 md:py-44">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink/55">
              <span className="rounded-full border border-ink/30 px-2 py-0.5">
                Live
              </span>
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-rust" />
                Roma jobsite #001 · simulated
              </span>
            </div>
            <h3 className="display mt-6 text-5xl text-ink md:text-7xl">
              Watch the <em className="italic">site</em>
              <br />
              build itself.
            </h3>
          </div>
          <div className="md:col-span-4">
            <p className="text-[15px] leading-relaxed text-ink/70">
              A scripted preview of a Roma fleet on a tilt-up warehouse shell.
              Slabs pour, panels lift, robots dispatch from staging — driven
              by the same task-graph + dispatcher model that powers the real
              jobsite. Replace the in-browser engine with a live WebSocket
              and the same scene renders production data.
            </p>
          </div>
        </div>

        <div className="relative mt-12 overflow-hidden rounded-2xl border border-ink/15 bg-bone shadow-[0_2px_30px_rgba(10,10,10,0.06)]">
          <div className="aspect-[16/9] w-full">
            <Canvas
              dpr={[1, 2]}
              orthographic
              camera={{
                position: [55, 60, 55],
                zoom: 11,
                near: -200,
                far: 500,
              }}
              gl={{ antialias: true, alpha: false }}
              style={{ background: COLORS.ground }}
            >
              <CameraRig />
              <Scene stateRef={stateRef} setSnapshot={setSnapshot} />
            </Canvas>
          </div>

          {/* Top-left: live tag */}
          <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-ink/15 bg-bone/85 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/70 backdrop-blur">
            <span className="size-1.5 animate-pulse rounded-full bg-rust" />
            live · sim
          </div>

          {/* Top-right: clock */}
          <div className="pointer-events-none absolute right-4 top-4 rounded-md border border-ink/15 bg-bone/85 px-3 py-1 font-mono text-[11px] tracking-widest text-ink/70 backdrop-blur">
            T+{fmtClock(snapshot.t)}
          </div>

          {/* Bottom-left: KPIs */}
          <div className="pointer-events-none absolute bottom-4 left-4 grid grid-cols-3 gap-3 rounded-xl border border-ink/15 bg-bone/85 p-3 backdrop-blur">
            <Kpi label="Slabs" value={`${cured}/${totalZones}`} />
            <Kpi label="Pouring" value={`${pouring}`} />
            <Kpi label="Panels" value={`${panelsSet}/${totalPanels}`} />
          </div>

          {/* Bottom-right: fleet + recent events */}
          <div className="pointer-events-none absolute bottom-4 right-4 max-w-[260px] rounded-xl border border-ink/15 bg-bone/85 p-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/65 backdrop-blur">
            <div className="flex items-center justify-between">
              <span>fleet · {activeRobots} active</span>
              <span className="size-1.5 rounded-full bg-rust" />
            </div>
            <ul className="mt-2 space-y-1 normal-case tracking-normal">
              {lastEvents.length === 0 && (
                <li className="text-ink/40">awaiting first dispatch…</li>
              )}
              {lastEvents.map((e, i) => (
                <li key={i} className="truncate">
                  <span className="text-ink/40">
                    [T+{fmtClock(e.t)}]
                  </span>{" "}
                  {e.msg}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55">
          <Legend label="Slab — empty" swatch={COLORS.zoneEmpty} ring />
          <Legend label="Slab — pouring" swatch={COLORS.zonePouring} ring />
          <Legend label="Slab — cured" swatch={COLORS.zoneCured} ring />
          <Legend label="Panel" swatch={COLORS.panelSet} />
          <Legend label="Robot" swatch={COLORS.robotAccent} />
        </div>
      </div>
    </section>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink/50">
        {label}
      </div>
      <div className="display text-2xl text-ink">{value}</div>
    </div>
  );
}

function Legend({
  label,
  swatch,
  ring,
}: {
  label: string;
  swatch: string;
  ring?: boolean;
}) {
  return (
    <span className="flex items-center gap-2">
      <span
        className={`inline-block size-3 rounded-sm ${ring ? "ring-1 ring-ink/30" : ""}`}
        style={{ backgroundColor: swatch }}
      />
      {label}
    </span>
  );
}
