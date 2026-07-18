/* Ref mutation inside useFrame is the standard r3f animation pattern
   (same trade-off as Simulator.tsx). */
/* eslint-disable react-hooks/refs, react-hooks/immutability */
import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Stars, ShootingStar } from "./Mars";

const EARTH_RADIUS = 1.55;
// Direction from the planet toward the sun, in world space (matches the
// planet group offset at [1.8,0,0] with the sun off to the left).
const SUN_DIR = new THREE.Vector3(-8.8, 0, -2.4).normalize();

const EARTH_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vViewDir;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const EARTH_FRAG = /* glsl */ `
  uniform sampler2D uDay;
  uniform sampler2D uNight;
  uniform vec3 uSunDir;
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vViewDir;

  void main() {
    vec3 n = normalize(vWorldNormal);
    float intensity = dot(n, uSunDir);
    // Tight terminator like the Mars globe — a crisp straight shadow edge
    float dayAmount = smoothstep(-0.02, 0.22, intensity);

    vec3 day = texture2D(uDay, vUv).rgb;
    day = pow(day, vec3(0.9)) * 1.35;
    vec3 night = texture2D(uNight, vUv).rgb;
    // Night side: keep ONLY the city lights — mask out the dim blue
    // oceans/landmass so the shadowed hemisphere disappears into space
    float lum = dot(night, vec3(0.299, 0.587, 0.114));
    night *= smoothstep(0.09, 0.28, lum) * 2.4;

    // Lambert shading so the globe falls into shadow toward the terminator,
    // matching the Mars section's lit-sphere look
    float shade = 0.04 + 0.96 * max(intensity, 0.0);
    vec3 color = mix(night, day * shade, dayAmount);

    // Blue atmospheric rim on the lit limb only — none in shadow
    float fres = pow(1.0 - max(dot(n, vViewDir), 0.0), 3.0);
    color += vec3(0.35, 0.55, 1.0) * fres * 0.7 * dayAmount;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function EarthGlobe() {
  const ref = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const [day, night, clouds] = useLoader(THREE.TextureLoader, [
    "/textures/earth_day8k.jpg",
    "/textures/earth_night8k.jpg",
    "/textures/earth_clouds8k.jpg",
  ]);

  useEffect(() => {
    for (const t of [day, night, clouds]) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 16;
      t.needsUpdate = true;
    }
  }, [day, night, clouds]);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.045;
    if (cloudRef.current) cloudRef.current.rotation.y += dt * 0.06;
  });

  return (
    <group ref={ref} rotation={[0.25, 0, 0.05]}>
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS, 128, 128]} />
        <shaderMaterial
          vertexShader={EARTH_VERT}
          fragmentShader={EARTH_FRAG}
          uniforms={{
            uDay: { value: day },
            uNight: { value: night },
            uSunDir: { value: SUN_DIR },
          }}
        />
      </mesh>

      {/* Drifting cloud layer, lit only on the day side */}
      <mesh ref={cloudRef} scale={1.012}>
        <sphereGeometry args={[EARTH_RADIUS, 96, 96]} />
        <meshStandardMaterial
          alphaMap={clouds}
          map={clouds}
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// On phones the canvas is narrow, so pull the globe toward center-left
// to keep it prominently in frame; on desktop it sits off to the right.
function EarthRig() {
  const width = useThree((s) => s.size.width);
  const isPhone = width < 768;

  return (
    <group
      position={isPhone ? [0.75, -0.5, 0] : [2.45, -0.35, 0]}
      scale={isPhone ? 0.85 : 1}
    >
      <EarthGlobe />
    </group>
  );
}

export function EarthScene() {
  return (
    <div className="absolute inset-x-0 top-0 h-screen">
      {/* Long lens (narrow fov, pulled back) keeps the off-center globe
          perfectly round instead of perspective-stretched at the frame edge */}
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 11.2], fov: 25 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        <Suspense fallback={null}>
          <EarthRig />
        </Suspense>
        <Stars />
        <ShootingStar initialDelay={2} />
        <ShootingStar initialDelay={6} />
        <ShootingStar initialDelay={11} />
        {/* Keep the cloud layer lit from the same side as the shader's sun */}
        <directionalLight position={[-7, 0, -2.4]} intensity={2.4} color="#eef2ff" />
        <ambientLight intensity={0.018} />
      </Canvas>
    </div>
  );
}
