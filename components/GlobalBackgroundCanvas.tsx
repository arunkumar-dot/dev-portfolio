'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useSimulation } from '@/components/SimulationModeProvider';
import { useTheme } from '@/context/ThemeContext';

// ─── Particle Shader GLSL ─────────────────────────────────────────────────────

const PARTICLE_VERT = /* glsl */ `
attribute vec3 aBasePos;
attribute float aSeed;
attribute float aColorMix;

uniform float uTime;
uniform float uIntensity;
uniform float uScrollProgress;
uniform vec2 uMouse;
uniform float uDpr;
uniform vec3 uFocalPoint;

varying float vAlpha;
varying float vColorMix;

void main() {
  vColorMix = aColorMix;
  vec3 p = aBasePos;
  
  float seed2 = aSeed * 6.28318;
  float timeSpeed = 0.35 + uIntensity * 0.9;
  
  // ── 0. Continuous Ambient Anti-Gravity Drift (Always Active) ─────────────
  // Smooth, multi-frequency continuous motion independent of cursor & scroll
  float tSlow = uTime * (0.40 + uIntensity * 0.45);
  
  float driftX = sin(tSlow * 0.75 + p.y * 0.32 + seed2) * 0.65 + 
                 cos(tSlow * 0.45 + p.z * 0.48) * 0.35;
  float driftY = cos(tSlow * 0.65 + p.x * 0.28 + seed2 * 1.35) * 0.75 + 
                 sin(tSlow * 0.38 + p.z * 0.36) * 0.35;
  float driftZ = sin(tSlow * 0.55 + p.x * 0.40 + p.y * 0.40) * 0.50;

  p.x += driftX;
  p.y += driftY;
  p.z += driftZ;

  // Subtle continuous orbital micro-rotation
  float orbAngle = uTime * (0.04 + uIntensity * 0.08);
  float cOrb = cos(orbAngle);
  float sOrb = sin(orbAngle);
  mat2 rotXZ = mat2(cOrb, -sOrb, sOrb, cOrb);
  p.xz = rotXZ * p.xz;

  // ── 1. Hero Wave Dynamics (progress 0.0 -> 0.3) ───────────────────────────
  float wave = sin(p.x * 0.32 + uTime * timeSpeed + seed2) * 
               cos(p.y * 0.28 + uTime * 0.7 * timeSpeed) * (0.40 + uIntensity * 0.60);
  p.z += wave;
  p.y += sin(uTime * 0.52 * timeSpeed + seed2) * 0.28;

  // ── 2. Work Section Rotation & Grid Expansion (0.2 -> 0.65) ───────────────
  float workFactor = smoothstep(0.12, 0.38, uScrollProgress) * (1.0 - smoothstep(0.58, 0.78, uScrollProgress));
  p.x *= (1.0 + workFactor * 0.28);
  p.z += sin(p.x * 0.7 + uTime * 0.8) * workFactor * 0.6;
  
  // ── 3. Case Studies Ambient Flow (0.45 -> 0.8) ─────────────────────────────
  float caseFactor = smoothstep(0.40, 0.60, uScrollProgress) * (1.0 - smoothstep(0.75, 0.92, uScrollProgress));
  p.x += sin(uTime * 0.35 + p.y * 0.25) * caseFactor * 0.35;

  // ── 4. Contact Section Focal Convergence (0.75 -> 1.0) ────────────────────
  float contactFactor = smoothstep(0.72, 0.98, uScrollProgress);
  vec3 toFocal = uFocalPoint - p;
  p += toFocal * contactFactor * 0.58 * (0.45 + 0.55 * sin(seed2 + uTime * 1.5));

  // ── 5. Stress Mode Telemetry Trails ───────────────────────────────────────
  if (uIntensity > 0.01) {
    float upwardFlow = mod(uTime * (1.4 + uIntensity * 2.2) + aSeed * 14.0, 18.0) - 9.0;
    p.y += uIntensity * upwardFlow * 0.26;
  }

  // ── 6. Global Interactive Cursor Repulsion Ripple ─────────────────────────
  vec2 diff = p.xy - uMouse;
  float dist = length(diff);
  float repRadius = 3.4 + uIntensity * 1.6;
  if (dist < repRadius && dist > 0.01) {
    float force = pow((repRadius - dist) / repRadius, 2.0);
    p.xy += (diff / dist) * force * (1.1 + uIntensity * 1.2);
    p.z += force * 0.55;
  }

  // ── Alpha Computation (pin-sharp opacity control with breathing) ──────────
  float baseAlpha = 0.24 + 0.44 * sin(seed2 + uTime * 0.75);
  vAlpha = baseAlpha * (0.58 + uIntensity * 0.42);

  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Ultra-fine pin-sharp point size (1.5 - 3.2px)
  float pSize = (1.7 + uIntensity * 1.3) * (200.0 / max(1.0, -mvPosition.z)) * min(uDpr, 1.75);
  gl_PointSize = clamp(pSize, 1.2, 3.5);
}
`;

const PARTICLE_FRAG = /* glsl */ `
uniform float uIntensity;
uniform vec3 uColorPrimary;
uniform vec3 uColorSecondary;

varying float vAlpha;
varying float vColorMix;

void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  if (dist > 0.5) discard;

  // Pin-sharp anti-blob alpha falloff
  float alpha = smoothstep(0.5, 0.06, dist) * vAlpha;
  
  // Hard clamp to ensure background never overwhelms foreground typography
  alpha = clamp(alpha, 0.0, 0.44);

  // Dynamic Theme Colors
  vec3 amberGold  = vec3(0.961, 0.620, 0.043);
  vec3 baseColor  = mix(uColorSecondary, uColorPrimary, vColorMix);
  vec3 finalColor = mix(baseColor, amberGold, uIntensity);

  gl_FragColor = vec4(finalColor, alpha);
}
`;

// ─── Precision Particle Field Component ───────────────────────────────────────

function GlobalParticleField({
  scrollRef,
  mouseRef,
  intensRef,
  primaryColor,
  secondaryColor,
}: {
  scrollRef: React.RefObject<number>;
  mouseRef: React.RefObject<THREE.Vector2>;
  intensRef: React.RefObject<number>;
  primaryColor: string;
  secondaryColor: string;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  const COUNT = 8500;

  const [geometry, uniforms] = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(COUNT * 3);
    const basePos   = new Float32Array(COUNT * 3);
    const seeds     = new Float32Array(COUNT);
    const colorMix  = new Float32Array(COUNT);

    // Form an expansive structured volume with natural spatial dispersal
    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * 32;
      const y = (Math.random() - 0.5) * 22;
      const z = (Math.random() - 0.5) * 8 - 1.5;

      positions[i * 3 + 0] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      basePos[i * 3 + 0] = x;
      basePos[i * 3 + 1] = y;
      basePos[i * 3 + 2] = z;

      seeds[i] = Math.random();
      // Gradient distribution favoring primary color towards top/center
      colorMix[i] = Math.min(Math.max((x / 16) * 0.5 + 0.5 + (Math.random() - 0.5) * 0.3, 0.0), 1.0);
    }

    geo.setAttribute('position',  new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aBasePos',  new THREE.BufferAttribute(basePos, 3));
    geo.setAttribute('aSeed',     new THREE.BufferAttribute(seeds, 1));
    geo.setAttribute('aColorMix', new THREE.BufferAttribute(colorMix, 1));

    const u = {
      uTime:           { value: 0 },
      uIntensity:      { value: 0 },
      uScrollProgress: { value: 0 },
      uMouse:          { value: new THREE.Vector2(9999, 9999) },
      uDpr:            { value: typeof window !== 'undefined' ? window.devicePixelRatio : 1 },
      uFocalPoint:     { value: new THREE.Vector3(0.0, -3.8, -1.2) },
      uColorPrimary:   { value: new THREE.Color(primaryColor) },
      uColorSecondary: { value: new THREE.Color(secondaryColor) },
    };

    return [geo, u] as const;
  }, []);

  // Update theme colors when changed
  useEffect(() => {
    if (matRef.current) {
      matRef.current.uniforms.uColorPrimary.value.set(primaryColor);
      matRef.current.uniforms.uColorSecondary.value.set(secondaryColor);
    }
  }, [primaryColor, secondaryColor]);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    u.uTime.value           = clock.elapsedTime;
    u.uIntensity.value      = intensRef.current ?? 0;
    u.uScrollProgress.value = scrollRef.current ?? 0;
    if (mouseRef.current) {
      u.uMouse.value.copy(mouseRef.current);
    }
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={matRef}
        vertexShader={PARTICLE_VERT}
        fragmentShader={PARTICLE_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Floating Glass Shards & Micro-Nodes ───────────────────────────────────────

type ShardKind = 'shard' | 'chip' | 'node' | 'ring';

interface ShardCfg {
  id: number;
  kind: ShardKind;
  base: [number, number, number];
  scale: number;
  phase: [number, number, number];
  rotSpeed: [number, number, number];
  glass: boolean;
}

function buildShardConfigs(count: number): ShardCfg[] {
  const r = (a: number, b: number) => Math.random() * (b - a) + a;
  const kinds: ShardKind[] = ['shard', 'chip', 'node', 'ring'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    kind: kinds[i % kinds.length],
    base: [r(-13, 13), r(-8, 8), r(-4.5, 0.5)],
    scale: r(0.08, 0.26),
    phase: [r(0, 6.28), r(0, 6.28), r(0, 6.28)],
    rotSpeed: [r(-0.35, 0.35), r(-0.35, 0.35), r(-0.25, 0.25)],
    glass: i < 12,
  }));
}

function FloatingShard({
  cfg,
  mouseRef,
  intensRef,
  scrollRef,
  primaryColor,
  secondaryColor,
}: {
  cfg: ShardCfg;
  mouseRef: React.RefObject<THREE.Vector2>;
  intensRef: React.RefObject<number>;
  scrollRef: React.RefObject<number>;
  primaryColor: string;
  secondaryColor: string;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const vel = useRef(new THREE.Vector3());
  const offset = useRef(new THREE.Vector3());

  useFrame((_, dt) => {
    const g = groupRef.current;
    if (!g) return;

    const iv = intensRef.current ?? 0;
    const sp = scrollRef.current ?? 0;
    const t = performance.now() * 0.001;
    const speed = 0.40 + iv * 0.8;

    // Continuous multi-harmonic base drift
    const dx = Math.sin(t * speed + cfg.phase[0]) * (0.45 + iv * 0.5);
    const dy = Math.cos(t * speed * 0.85 + cfg.phase[1]) * (0.45 + iv * 0.5);
    const dz = Math.sin(t * speed * 0.65 + cfg.phase[2]) * 0.30;

    // Scroll vertical parallax shift
    const scrollShiftY = sp * 4.0;

    // World pos
    const currX = cfg.base[0] + dx + offset.current.x;
    const currY = cfg.base[1] + dy + offset.current.y - scrollShiftY;
    const currZ = cfg.base[2] + dz + offset.current.z;

    // Cursor repulsion
    if (mouseRef.current) {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const dist = Math.hypot(currX - mx, currY - my);
      const repRad = 3.2 + iv * 1.5;
      if (dist < repRad && dist > 0.02) {
        const force = Math.pow((repRad - dist) / repRad, 2) * (2.8 + iv * 3.5);
        vel.current.x += ((currX - mx) / dist) * force * dt * 4;
        vel.current.y += ((currY - my) / dist) * force * dt * 4;
      }
    }

    // Spring damping
    vel.current.multiplyScalar(0.9);
    offset.current.add(vel.current);
    if (offset.current.length() > 2.5) offset.current.setLength(2.5);

    g.position.set(currX, currY, currZ);

    // Continuous rotation
    const rMult = (1.2 + iv * 2.2) * dt;
    g.rotation.x += cfg.rotSpeed[0] * rMult;
    g.rotation.y += cfg.rotSpeed[1] * rMult;
    g.rotation.z += cfg.rotSpeed[2] * rMult;
  });

  return (
    <group ref={groupRef} scale={cfg.scale}>
      {cfg.kind === 'shard' && <icosahedronGeometry args={[1, 0]} />}
      {cfg.kind === 'chip'  && <boxGeometry args={[1.6, 0.1, 1.0]} />}
      {cfg.kind === 'node'  && <sphereGeometry args={[0.9, 16, 16]} />}
      {cfg.kind === 'ring'  && <torusGeometry args={[1, 0.12, 10, 36]} />}

      {cfg.glass ? (
        <meshPhysicalMaterial
          color={primaryColor}
          emissive={secondaryColor}
          emissiveIntensity={0.25}
          roughness={0.08}
          metalness={0.05}
          transmission={0.88}
          thickness={1.2}
          ior={1.5}
          transparent
          opacity={0.8}
        />
      ) : (
        <meshStandardMaterial
          color={secondaryColor}
          emissive={primaryColor}
          emissiveIntensity={0.3}
          roughness={0.25}
          metalness={0.15}
          transparent
          opacity={0.35}
          wireframe={cfg.kind === 'chip'}
        />
      )}
    </group>
  );
}

// ─── Dynamic Lighting ─────────────────────────────────────────────────────────

function SceneLights({
  intensRef,
  primaryColor,
  secondaryColor,
}: {
  intensRef: React.RefObject<number>;
  primaryColor: string;
  secondaryColor: string;
}) {
  const primaryLight = useRef<THREE.PointLight>(null!);
  const amberLight   = useRef<THREE.PointLight>(null!);

  useFrame(() => {
    const iv = intensRef.current ?? 0;
    if (primaryLight.current) primaryLight.current.intensity = 0.95 - iv * 0.45;
    if (amberLight.current)   amberLight.current.intensity   = iv * 1.6;
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight ref={primaryLight} position={[8, 5, 5]} color={primaryColor} intensity={0.95} />
      <pointLight position={[-8, -4, 4]} color={secondaryColor} intensity={0.65} />
      <pointLight position={[0, 6, 3]} color="#818cf8" intensity={0.45} />
      <pointLight ref={amberLight} position={[0, 0, 6]} color="#f59e0b" intensity={0} />
    </>
  );
}

// ─── Camera Controller for Scroll Parallax ───────────────────────────────────

function CameraController({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  const { camera } = useThree();

  useFrame(() => {
    const sp = scrollRef.current ?? 0;
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, -sp * 2.5, 0.05);
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, sp * 0.12, 0.05);
  });

  return null;
}

// ─── Background Scene Container ───────────────────────────────────────────────

function GlobalBackgroundScene() {
  const { intensitySpring } = useSimulation();
  const { theme } = useTheme();

  const intensRef = useRef(0);
  useEffect(() => {
    return intensitySpring.on('change', (v) => {
      intensRef.current = v;
    });
  }, [intensitySpring]);

  // Global scroll progress [0, 1]
  const scrollRef = useRef(0);
  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollRef.current = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cursor in 3D world coords
  const mouseRef = useRef(new THREE.Vector2(9999, 9999));
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.set(nx * 14, ny * 8);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Floating shard configurations
  const shards = useMemo(() => buildShardConfigs(36), []);

  return (
    <>
      <CameraController scrollRef={scrollRef} />
      <SceneLights
        intensRef={intensRef}
        primaryColor={theme.primary}
        secondaryColor={theme.secondary}
      />

      <GlobalParticleField
        scrollRef={scrollRef}
        mouseRef={mouseRef}
        intensRef={intensRef}
        primaryColor={theme.primary}
        secondaryColor={theme.secondary}
      />

      {shards.map((cfg) => (
        <FloatingShard
          key={cfg.id}
          cfg={cfg}
          mouseRef={mouseRef}
          intensRef={intensRef}
          scrollRef={scrollRef}
          primaryColor={theme.primary}
          secondaryColor={theme.secondary}
        />
      ))}

      <EffectComposer multisampling={0}>
        <Bloom
          luminanceThreshold={0.4}
          luminanceSmoothing={0.7}
          intensity={0.45}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

// ─── Global Background Canvas Export ──────────────────────────────────────────

export default function GlobalBackgroundCanvas() {
  return (
    <div className="global-canvas-container" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={[1, 1.75]}
        style={{ pointerEvents: 'none' }}
      >
        <GlobalBackgroundScene />
      </Canvas>
    </div>
  );
}
