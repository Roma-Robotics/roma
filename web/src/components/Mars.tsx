/* Ref mutation inside useFrame is the standard r3f animation pattern
   (same trade-off as Simulator.tsx). */
/* eslint-disable react-hooks/refs, react-hooks/immutability */
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { motion } from "framer-motion";
import * as THREE from "three";

const MARS_RADIUS = 1.55;
// Direction from the planet toward the sun, in world space (matches the
// directionalLight at [-7,0,-2.4] relative to the planet group at [1.8,0,0]).
const SUN_DIR = new THREE.Vector3(-8.8, 0, -2.4).normalize();

const CITY_VERT = /* glsl */ `
  attribute float aRand;
  uniform float uTime;
  uniform vec3 uSunDir;
  varying float vAlpha;

  void main() {
    vec3 worldNormal = normalize(mat3(modelMatrix) * normalize(position));
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vec3 viewDir = normalize(cameraPosition - worldPos.xyz);

    // Glow across the whole night side, ramping in right at the terminator
    float night = smoothstep(0.28, -0.05, dot(worldNormal, uSunDir));
    float facing = smoothstep(-0.05, 0.28, dot(worldNormal, viewDir));

    // Subtle per-light flicker so the grid feels alive, but stay bright
    float flicker = 0.85 + 0.15 * sin(uTime * (1.4 + aRand * 3.0) + aRand * 40.0);

    vAlpha = night * facing * flicker;

    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = (1.1 + aRand * 2.2) * (13.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const CITY_FRAG = /* glsl */ `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    // Tight bright core with a soft halo — like a sodium-vapor city light
    float core = smoothstep(0.5, 0.12, d);
    float halo = smoothstep(0.5, 0.0, d) * 0.5;
    float a = (core + halo) * vAlpha * 1.5;
    if (a < 0.01) discard;
    // Warm white-gold, like Earth-at-night city grids
    gl_FragColor = vec4(1.0, 0.88, 0.62, a);
  }
`;

function CityLights() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, rands } = useMemo(() => {
    // A handful of big metros + many smaller towns, like Earth at night
    const clusters = 22;
    const dense = 90; // bright packed core of each city
    const sprawl = 60; // dimmer outskirts
    const perCluster = dense + sprawl;
    const positions = new Float32Array(clusters * perCluster * 3);
    const rands = new Float32Array(clusters * perCluster);
    let i = 0;
    for (let c = 0; c < clusters; c++) {
      // Random cluster center on the sphere
      const cu = Math.random() * 2 - 1;
      const ct = Math.random() * Math.PI * 2;
      const cr = Math.sqrt(1 - cu * cu);
      const center = new THREE.Vector3(cr * Math.cos(ct), cu, cr * Math.sin(ct));
      // Vary city size so some are sprawling metros, some are small
      const scale = 0.12 + Math.random() * 0.28;

      for (let p = 0; p < perCluster; p++) {
        const isCore = p < dense;
        // Gaussian-ish falloff: dense core, sparse sprawl
        const spread = (isCore ? 0.4 : 1.0) * scale;
        const jitter = new THREE.Vector3(
          (Math.random() - 0.5),
          (Math.random() - 0.5),
          (Math.random() - 0.5),
        )
          .multiplyScalar(spread)
          // bias toward center for a bright nucleus
          .multiplyScalar(Math.random() * Math.random() + 0.15);
        const v = center
          .clone()
          .add(jitter)
          .normalize()
          .multiplyScalar(MARS_RADIUS * 1.002);
        positions[i * 3] = v.x;
        positions[i * 3 + 1] = v.y;
        positions[i * 3 + 2] = v.z;
        rands[i] = isCore ? 0.4 + Math.random() * 0.6 : Math.random() * 0.5;
        i++;
      }
    }
    return { positions, rands };
  }, []);

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aRand" args={[rands, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uSunDir: { value: SUN_DIR },
        }}
        vertexShader={CITY_VERT}
        fragmentShader={CITY_FRAG}
      />
    </points>
  );
}

function MarsGlobe() {
  const ref = useRef<THREE.Group>(null);
  const texture = useLoader(THREE.TextureLoader, "/textures/mars.jpg");

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.06;
  });

  return (
    <group ref={ref} rotation={[0.15, 0, 0.05]}>
      <mesh>
        <sphereGeometry args={[MARS_RADIUS, 128, 128]} />
        <meshStandardMaterial
          map={texture}
          bumpMap={texture}
          bumpScale={0.025}
          roughness={0.96}
          metalness={0}
          color="#d8ccc4"
        />
      </mesh>

      {/* Night-side city lights — buildings and people as it rotates */}
      <CityLights />
    </group>
  );
}

const STAR_VERT = /* glsl */ `
  attribute float phase;
  uniform float uTime;
  varying float vAlpha;
  void main() {
    // Each star flickers at its own speed and offset
    float tw = 0.5 + 0.5 * sin(uTime * (0.8 + fract(phase * 0.618) * 2.2) + phase * 17.0);
    vAlpha = 0.12 + 0.88 * tw * tw;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 1.5 + 2.5 * tw;
    gl_Position = projectionMatrix * mv;
  }
`;

const STAR_FRAG = /* glsl */ `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d) * vAlpha;
    gl_FragColor = vec4(0.953, 0.937, 0.902, a);
  }
`;

export function Stars() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, phases } = useMemo(() => {
    const n = 400;
    const positions = new Float32Array(n * 3);
    const phases = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 44;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = -6 - Math.random() * 18;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, phases };
  }, []);

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-phase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={STAR_VERT}
        fragmentShader={STAR_FRAG}
      />
    </points>
  );
}

export function ShootingStar({ initialDelay }: { initialDelay: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  const state = useRef({
    t: -initialDelay,
    duration: 1,
    start: new THREE.Vector3(),
    travel: new THREE.Vector3(),
    angle: 0,
    initialized: false,
  });

  const respawn = (wait: number) => {
    const s = state.current;
    s.t = -wait;
    s.duration = 0.7 + Math.random() * 0.8;
    s.start.set(-16 + Math.random() * 26, 5 + Math.random() * 8, -14);
    s.angle = -(Math.PI / 6 + Math.random() * 0.5); // streak down-right
    s.travel
      .set(Math.cos(s.angle), Math.sin(s.angle), 0)
      .multiplyScalar(14 + Math.random() * 8);
  };

  useFrame((_, dt) => {
    const s = state.current;
    const group = groupRef.current;
    const mat = matRef.current;
    if (!group || !mat) return;

    if (!s.initialized) {
      s.initialized = true;
      respawn(initialDelay);
    }

    s.t += dt;
    if (s.t < 0) {
      mat.opacity = 0;
      return;
    }

    const p = s.t / s.duration;
    if (p >= 1) {
      respawn(3 + Math.random() * 7); // quiet gap between streaks
      mat.opacity = 0;
      return;
    }

    group.position
      .copy(s.start)
      .addScaledVector(s.travel, p);
    group.rotation.z = s.angle;
    mat.opacity = Math.sin(p * Math.PI) * 0.9;
  });

  return (
    <group ref={groupRef}>
      {/* Elongated streak with a brighter head */}
      <mesh position={[-0.9, 0, 0]}>
        <planeGeometry args={[1.8, 0.02]} />
        <meshBasicMaterial
          ref={matRef}
          color="#f3efe6"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// A 2D canvas overlay that emits shooting-star particles following the cursor.
export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    type P = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      hue: number;
    };
    const particles: P[] = [];

    let lastX = 0;
    let lastY = 0;
    let hasLast = false;

    const onMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (hasLast) {
        const dx = x - lastX;
        const dy = y - lastY;
        const speed = Math.hypot(dx, dy);
        // Spawn more particles the faster the cursor moves
        const count = Math.min(6, 1 + Math.floor(speed / 8));
        const dirx = speed > 0.01 ? dx / speed : 0;
        const diry = speed > 0.01 ? dy / speed : 0;

        for (let i = 0; i < count; i++) {
          const t = i / count;
          const spread = 0.5;
          particles.push({
            x: lastX + dx * t,
            y: lastY + dy * t,
            vx: dirx * (0.6 + Math.random() * 1.4) + (Math.random() - 0.5) * spread,
            vy: diry * (0.6 + Math.random() * 1.4) + (Math.random() - 0.5) * spread,
            life: 0,
            maxLife: 40 + Math.random() * 35,
            size: 0.8 + Math.random() * 1.6,
            hue: Math.random() < 0.25 ? 24 : 40, // mostly warm, some redder
          });
        }
      }
      lastX = x;
      lastY = y;
      hasLast = true;
    };
    parent.addEventListener("mousemove", onMove);

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += 1;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;

        const k = 1 - p.life / p.maxLife;
        const alpha = k * k;
        const px = p.x * dpr;
        const py = p.y * dpr;
        const r = p.size * dpr;

        // little streak tail opposite to velocity
        const tailX = px - p.vx * dpr * 3;
        const tailY = py - p.vy * dpr * 3;
        const grad = ctx.createLinearGradient(tailX, tailY, px, py);
        grad.addColorStop(0, `hsla(${p.hue}, 90%, 70%, 0)`);
        grad.addColorStop(1, `hsla(${p.hue}, 95%, 78%, ${alpha})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = r;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(px, py);
        ctx.stroke();

        // bright head
        ctx.fillStyle = `hsla(${p.hue}, 100%, 88%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, r * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      parent.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
    />
  );
}

export function Mars() {
  return (
    <section id="mars" className="relative overflow-hidden bg-black text-bone">
      <CursorTrail />
      {/* Rotating Mars canvas — fills the section, planet sits right of center */}
      <div className="absolute inset-0">
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 6], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 0.88;
          }}
        >
          <Suspense fallback={null}>
            <group position={[1.8, 0, 0]}>
              <MarsGlobe />
            </group>
          </Suspense>
          <Stars />
          <ShootingStar initialDelay={1.5} />
          <ShootingStar initialDelay={5} />
          <ShootingStar initialDelay={9} />
          {/* Neutral sunlight keeps Mars in its natural tan-brown tones */}
          <directionalLight
            position={[-7, 0, -2.4]}
            intensity={3.1}
            color="#f4f2ee"
          />
          <ambientLight intensity={0.018} />
        </Canvas>
      </div>

      {/* Fade the pure black into the ink shade of the next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-[#0a0a0a]" />

      {/* Copy overlay */}
      <div className="relative mx-auto flex min-h-[100vh] max-w-[1400px] items-center px-6 py-32 md:px-10 md:py-44">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-bone/45">
            <span className="rounded-full border border-bone/25 px-2 py-0.5">
              02
            </span>
            Beyond Earth
          </div>
          <h3 className="display mt-8 text-6xl leading-[0.95] md:text-8xl">
            Making
            <br />
            multiplanetary
            <br />
            life <em className="italic">livable.</em>
          </h3>
          <p className="mt-8 max-w-md text-base leading-relaxed text-bone/70 md:text-lg">
            Roma was founded under the belief that the same machines that
            build tomorrow&apos;s cities on Earth will pour the first
            foundations of cities outside of it — one autonomous system,
            from earth to the universe.
          </p>
          <a
            href="#mission"
            className="mt-10 inline-flex items-center gap-3 border border-bone/40 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-bone transition-colors hover:border-silver hover:text-silver"
          >
            Explore <span aria-hidden>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
