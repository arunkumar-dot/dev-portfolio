'use client';

import { useRef, useMemo, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCursorWorld, useClickWorld } from '@/lib/useCursorWorld';
import { useSimulation } from '@/components/SimulationModeProvider';

// ─── Shared palette ───────────────────────────────────────────────────────────

const C_CYAN   = new THREE.Color('#22d3ee');
const C_VIOLET = new THREE.Color('#818cf8');
const C_AMBER  = new THREE.Color('#f59e0b');

// ─── Object configuration ─────────────────────────────────────────────────────

type ObjKind = 'shard' | 'chip' | 'node' | 'ring';

interface ObjCfg {
  id:        number;
  kind:      ObjKind;
  base:      [number, number, number];
  scale:     number;
  phase:     [number, number, number];  // per-axis drift phase
  rotSpeed:  [number, number, number];  // per-axis rotation speed
  tint:      THREE.Color;
  glass:     boolean;                   // true → MeshPhysicalMaterial transmission
}

function buildConfigs(count: number): ObjCfg[] {
  const r   = (a: number, b: number) => Math.random() * (b - a) + a;
  const pi2 = Math.PI * 2;
  const kinds: ObjKind[] = ['shard', 'chip', 'node', 'ring'];
  const tints = [C_CYAN, C_VIOLET];
  return Array.from({ length: count }, (_, i) => ({
    id:       i,
    kind:     kinds[Math.floor(Math.random() * 4)] as ObjKind,
    base:     [r(-9, 9), r(-5, 5), r(-4, 0.5)] as [number, number, number],
    scale:    r(0.06, 0.3),
    phase:    [r(0, pi2), r(0, pi2), r(0, pi2)] as [number, number, number],
    rotSpeed: [r(-0.5, 0.5), r(-0.5, 0.5), r(-0.3, 0.3)] as [number, number, number],
    tint:     tints[Math.floor(Math.random() * 2)].clone(),
    glass:    i < 14,  // first 14 get physical glass material
  }));
}

// ─── Pulse ring ───────────────────────────────────────────────────────────────

interface PulseData { pos: THREE.Vector3; t: number; alive: boolean }

function PulseRing({ pulseRef }: { pulseRef: React.RefObject<PulseData> }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const matRef  = useRef<THREE.MeshStandardMaterial>(null!);

  useFrame((_, dt) => {
    const p = pulseRef.current;
    if (!p || !p.alive) { if (meshRef.current) meshRef.current.visible = false; return; }
    p.t += dt * 1.6;
    const s = p.t * 3.2;
    meshRef.current.visible = true;
    meshRef.current.position.copy(p.pos);
    meshRef.current.scale.setScalar(s);
    matRef.current.opacity = Math.max(0, (1 - p.t) * 0.65);
    if (p.t > 1.2) p.alive = false;
  });

  return (
    <mesh ref={meshRef} visible={false}>
      <torusGeometry args={[1, 0.025, 8, 80]} />
      <meshStandardMaterial
        ref={matRef}
        color="#22d3ee"
        emissive="#22d3ee"
        emissiveIntensity={3}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// ─── Single floating object ───────────────────────────────────────────────────

interface FloatingObjProps {
  cfg:        ObjCfg;
  cursorRef:  React.RefObject<THREE.Vector3>;
  pulseRef:   React.RefObject<PulseData>;
  intensRef:  React.RefObject<number>;
}

function FloatingObj({ cfg, cursorRef, pulseRef, intensRef }: FloatingObjProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const matRef   = useRef<THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial>(null!);
  const vel      = useRef(new THREE.Vector3());
  const offset   = useRef(new THREE.Vector3());
  const tmpA     = useMemo(() => new THREE.Vector3(), []);
  const tmpB     = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    const g = groupRef.current;
    if (!g) return;

    const iv   = intensRef.current ?? 0;
    const t    = performance.now() * 0.001;
    const spd  = 0.22 + iv * 0.85;
    const amp  = 0.18 + iv * 0.65;

    // Gentle sine drift
    const dx = Math.sin(t * spd       + cfg.phase[0]) * amp * 0.6;
    const dy = Math.sin(t * spd * 0.7 + cfg.phase[1]) * amp;
    const dz = Math.cos(t * spd * 0.5 + cfg.phase[2]) * amp * 0.28;

    // World position of this object (base + drift, before repulsion)
    tmpA.set(
      cfg.base[0] + dx + offset.current.x,
      cfg.base[1] + dy + offset.current.y,
      cfg.base[2] + dz + offset.current.z,
    );

    // ── Cursor repulsion ──────────────────────────────────────────────────
    tmpB.copy(tmpA).sub(cursorRef.current);
    tmpB.z = 0;
    const dist   = tmpB.length();
    const radius = 2.6 + iv * 1.8;
    if (dist < radius && dist > 0.04) {
      const strength = Math.pow((radius - dist) / radius, 2) * (3.5 + iv * 4.0);
      vel.current.addScaledVector(tmpB.normalize(), strength * dt * 6);
    }

    // ── Gravitational pulse (click wave) ──────────────────────────────────
    const pulse = pulseRef.current;
    if (pulse?.alive && pulse.t < 0.25) {
      tmpB.copy(tmpA).sub(pulse.pos);
      const pd = tmpB.length();
      if (pd < 4.5 && pd > 0.05) {
        const ps = Math.pow((4.5 - pd) / 4.5, 2) * 7.0;
        vel.current.addScaledVector(tmpB.normalize(), ps);
      }
    }

    // ── Spring damping (return to orbit) ─────────────────────────────────
    vel.current.multiplyScalar(0.87 - iv * 0.03);
    offset.current.add(vel.current);
    const maxOff = 2.2 + iv;
    if (offset.current.length() > maxOff) offset.current.setLength(maxOff);

    // ── Set transform ─────────────────────────────────────────────────────
    g.position.set(
      cfg.base[0] + dx + offset.current.x,
      cfg.base[1] + dy + offset.current.y,
      cfg.base[2] + dz + offset.current.z,
    );
    const rm = (1 + iv * 2.8) * dt;
    g.rotation.x += cfg.rotSpeed[0] * rm;
    g.rotation.y += cfg.rotSpeed[1] * rm;
    g.rotation.z += cfg.rotSpeed[2] * rm;

    // ── Material reactivity ───────────────────────────────────────────────
    if (matRef.current) {
      const m = matRef.current;
      const targetEmissive = iv > 0.5 ? C_AMBER : cfg.tint;
      m.emissive.lerp(targetEmissive, dt * 2.5);
      m.emissiveIntensity = 0.18 + iv * 1.4;
    }
  });

  const emissive = C_VIOLET;

  return (
    <group ref={groupRef} scale={cfg.scale}>
      {/* Geometry */}
      {cfg.kind === 'shard' && <icosahedronGeometry args={[1, 0]} />}
      {cfg.kind === 'chip'  && <boxGeometry       args={[1.8, 0.1, 1.2]} />}
      {cfg.kind === 'node'  && <sphereGeometry    args={[1, 16, 16]} />}
      {cfg.kind === 'ring'  && <torusGeometry     args={[1, 0.16, 12, 48]} />}

      {/* Material */}
      {cfg.glass ? (
        <meshPhysicalMaterial
          ref={matRef as React.RefObject<THREE.MeshPhysicalMaterial>}
          color={cfg.tint}
          emissive={emissive}
          emissiveIntensity={0.18}
          roughness={0.08}
          metalness={0.05}
          transmission={0.88}
          thickness={1.4}
          ior={1.52}
          transparent
          side={THREE.DoubleSide}
        />
      ) : (
        <meshStandardMaterial
          ref={matRef as React.RefObject<THREE.MeshStandardMaterial>}
          color={cfg.tint}
          emissive={emissive}
          emissiveIntensity={0.18}
          roughness={0.25}
          metalness={0.12}
          transparent
          opacity={0.22 + Math.random() * 0.2}
          wireframe={cfg.kind === 'chip' && Math.random() > 0.5}
          side={THREE.DoubleSide}
        />
      )}
    </group>
  );
}

// ─── Ambient particle field ───────────────────────────────────────────────────

const PART_VERT = /* glsl */ `
attribute float aSeed;
uniform float uTime;
uniform float uIntensity;
varying float vAlpha;

void main() {
  float spd = 0.08 + uIntensity * 0.55;
  float s2  = aSeed * 6.2832;
  vec3 p    = position;
  p.x += sin(uTime * spd       + s2) * (0.04 + uIntensity * 0.1);
  p.y += cos(uTime * spd * 0.6 + s2) * (0.04 + uIntensity * 0.14);

  vAlpha = 0.25 + 0.5 * abs(sin(s2 + uTime * 0.5));

  // Stress: particles stream upward
  p.y += uIntensity * mod(uTime * 0.4 + aSeed * 7.3, 12.0) - 6.0;

  gl_Position  = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = (1.8 + uIntensity * 2.5) * (280.0 / max(1.0, -modelViewMatrix[3][2]));
}
`;

const PART_FRAG = /* glsl */ `
uniform float uIntensity;
varying float vAlpha;

void main() {
  vec2  uv  = gl_PointCoord - 0.5;
  float d   = length(uv);
  float a   = smoothstep(0.5, 0.05, d) * vAlpha * (0.45 + uIntensity * 0.55);
  vec3  cyan  = vec3(0.133, 0.827, 0.933);
  vec3  amber = vec3(0.961, 0.620, 0.043);
  gl_FragColor = vec4(mix(cyan, amber, uIntensity), a);
}
`;

function AmbientParticles({ intensRef }: { intensRef: React.RefObject<number> }) {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const COUNT  = 2800;

  const [geo, uniforms] = useMemo(() => {
    const g    = new THREE.BufferGeometry();
    const pos  = new Float32Array(COUNT * 3);
    const seed = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      pos[i*3]   = (Math.random() - 0.5) * 22;
      pos[i*3+1] = (Math.random() - 0.5) * 14;
      pos[i*3+2] = (Math.random() - 0.5) * 7;
      seed[i]    = Math.random();
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSeed',    new THREE.BufferAttribute(seed, 1));
    const u = { uTime: { value: 0 }, uIntensity: { value: 0 } };
    return [g, u] as const;
  }, []);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value      = clock.elapsedTime;
    matRef.current.uniforms.uIntensity.value = intensRef.current ?? 0;
  });

  return (
    <points geometry={geo}>
      <shaderMaterial
        ref={matRef}
        vertexShader={PART_VERT}
        fragmentShader={PART_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Rim light that shifts cyan → amber with intensity ────────────────────────

function DynamicLights({ intensRef }: { intensRef: React.RefObject<number> }) {
  const cyanLight  = useRef<THREE.PointLight>(null!);
  const amberLight = useRef<THREE.PointLight>(null!);

  useFrame(() => {
    const iv = intensRef.current ?? 0;
    if (cyanLight.current)  cyanLight.current.intensity  = 0.9  - iv * 0.4;
    if (amberLight.current) amberLight.current.intensity = iv * 1.2;
  });

  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight ref={cyanLight}  position={[ 6,  4, 4]} color="#22d3ee" intensity={0.9} />
      <pointLight position={[-6, -3, 3]} color="#818cf8" intensity={0.55} />
      <pointLight ref={amberLight} position={[ 0,  0, 5]} color="#f59e0b" intensity={0} />
    </>
  );
}

// ─── Main exported scene (no Canvas wrapper here — HeroCanvas owns that) ──────

export default function AntiGravityScene() {
  const { intensitySpring } = useSimulation();

  // Sync spring value to a plain ref every frame — zero re-renders
  const intensRef  = useRef(0);
  useEffect(() => intensitySpring.on('change', (v) => { intensRef.current = v; }), [intensitySpring]);

  // Cursor world position
  const cursorRef = useCursorWorld();

  // Pulse state
  const pulseRef = useRef<PulseData>({ pos: new THREE.Vector3(), t: 0, alive: false });

  // Click → trigger pulse at world-space click position
  const onClickWorld = useCallback((pos: THREE.Vector3) => {
    pulseRef.current = { pos: pos.clone(), t: 0, alive: true };
  }, []);
  useClickWorld(onClickWorld);

  // Build object configs once
  const configs = useMemo(() => buildConfigs(50), []);

  return (
    <>
      <DynamicLights intensRef={intensRef} />

      {configs.map((cfg) => (
        <FloatingObj
          key={cfg.id}
          cfg={cfg}
          cursorRef={cursorRef}
          pulseRef={pulseRef}
          intensRef={intensRef}
        />
      ))}

      <AmbientParticles intensRef={intensRef} />

      <PulseRing pulseRef={pulseRef} />
    </>
  );
}
