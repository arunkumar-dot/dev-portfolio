'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { NOISE_GLSL } from '@/lib/shaders';
import { useSimulation } from '@/components/SimulationModeProvider';

const VERTEX_SHADER = /* glsl */ `
${NOISE_GLSL}

attribute float aSeed;
attribute vec3  aBaseVel;

uniform float uTime;
uniform float uIntensity;
uniform vec2  uMouse;
uniform float uSize;

varying float vAlpha;
varying float vIntensity;

void main() {
  vIntensity = uIntensity;

  // Scale noise frequency and speed with intensity
  float freq      = 0.35 + uIntensity * 0.65;
  float speed     = 0.18 + uIntensity * 0.55;
  float amplitude = 1.8  + uIntensity * 2.2;

  vec3 samplePos = position * freq + vec3(aSeed * 3.7, uTime * speed, aSeed * 1.3);
  vec3 curlVel   = curl(samplePos) * amplitude;

  vec3 pos = position + curlVel * 0.04 + aBaseVel * 0.01;

  // Mouse repulsion (NDC → world-ish)
  vec4 clipPos = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  vec2 ndc     = clipPos.xy / clipPos.w;
  vec2 delta   = ndc - uMouse;
  float dist   = length(delta);
  float force  = smoothstep(0.35, 0.0, dist) * 0.18;
  pos         += vec3(normalize(delta) * force, 0.0);

  vAlpha = 0.55 + 0.45 * sin(aSeed * 6.28 + uTime * 1.1);

  gl_Position  = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = uSize * (1.0 + uIntensity * 0.6);
}
`;

const FRAGMENT_SHADER = /* glsl */ `
varying float vAlpha;
varying float vIntensity;

void main() {
  // Soft circular sprite
  vec2 uv   = gl_PointCoord - 0.5;
  float d   = length(uv);
  float a   = smoothstep(0.5, 0.1, d) * vAlpha;

  // Cyan (#22d3ee) → amber (#f59e0b) driven by intensity
  vec3 cyan  = vec3(0.133, 0.827, 0.933);
  vec3 amber = vec3(0.961, 0.620, 0.043);
  vec3 col   = mix(cyan, amber, vIntensity);

  gl_FragColor = vec4(col, a);
}
`;

function buildGeometry(count: number): THREE.BufferGeometry {
  const positions = new Float32Array(count * 3);
  const seeds     = new Float32Array(count);
  const baseVels  = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 20;  // wider X
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;  // taller Y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6;   // depth
    seeds[i]             = Math.random();
    baseVels[i * 3]      = (Math.random() - 0.5) * 0.2;
    baseVels[i * 3 + 1]  = (Math.random() - 0.5) * 0.2;
    baseVels[i * 3 + 2]  = (Math.random() - 0.5) * 0.1;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('aSeed',    new THREE.BufferAttribute(seeds, 1));
  geo.setAttribute('aBaseVel', new THREE.BufferAttribute(baseVels, 3));
  return geo;
}

export default function ParticleField() {
  const { intensity } = useSimulation();
  const { size }      = useThree();
  const mouseRef      = useRef<[number, number]>([0, 0]);
  const matRef        = useRef<THREE.ShaderMaterial>(null!);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const isMobile  = size.width < 768;
  const count     = reducedMotion.current || isMobile ? 8000 : 25000;
  const geo       = useMemo(() => buildGeometry(count), [count]);

  const uniforms = useMemo(() => ({
    uTime:      { value: 0 },
    uIntensity: { value: 0 },
    uMouse:     { value: new THREE.Vector2(0, 0) },
    uSize:      { value: isMobile ? 2.5 : 3.5 },
  }), [isMobile]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = [
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      ];
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value      = clock.elapsedTime;
    matRef.current.uniforms.uIntensity.value = intensity;
    matRef.current.uniforms.uMouse.value.set(...mouseRef.current);
  });

  return (
    <points geometry={geo}>
      <shaderMaterial
        ref={matRef}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
