'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NOISE_GLSL } from '@/lib/shaders';
import { useSimulation } from '@/components/SimulationModeProvider';

const VERTEX_SHADER = /* glsl */ `
${NOISE_GLSL}

uniform float uTime;
uniform float uIntensity;
uniform vec2  uMouse;

varying vec2  vUv;
varying float vDisplace;
varying float vIntensity;

void main() {
  vUv        = uv;
  vIntensity = uIntensity;

  float freq  = 0.4 + uIntensity * 0.8;
  float speed = 0.12 + uIntensity * 0.38;
  float amp   = 0.1  + uIntensity * 0.28;

  vec3 samplePos = vec3(position.xy * freq, uTime * speed);
  vec4 ns        = snoise_grad(samplePos);
  float disp     = ns.w * amp;

  // Mouse-centred expanding ripple
  vec2 toMouse  = position.xy - uMouse * 4.0;
  float mDist   = length(toMouse);
  float ripple  = sin(mDist * 2.5 - uTime * 4.0) * exp(-mDist * 0.6) * 0.18 * uIntensity;
  disp += ripple;

  vDisplace = disp;

  vec3 displaced = position + normal * disp;
  gl_Position    = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
`;

const FRAGMENT_SHADER = /* glsl */ `
varying vec2  vUv;
varying float vDisplace;
varying float vIntensity;

void main() {
  vec3 cyan  = vec3(0.133, 0.827, 0.933);
  vec3 amber = vec3(0.961, 0.620, 0.043);
  vec3 col   = mix(cyan, amber, vIntensity);

  float edge = 1.0 - abs(vUv.y - 0.5) * 2.0;
  float a    = smoothstep(0.0, 0.18, edge)
             * (0.08 + abs(vDisplace) * 0.35 + vIntensity * 0.08);

  gl_FragColor = vec4(col, clamp(a, 0.0, 0.45));
}
`;

export default function ThroughputRibbon() {
  const { intensity } = useSimulation();
  const matRef        = useRef<THREE.ShaderMaterial>(null!);
  const mouseRef      = useRef<[number, number]>([0, 0]);

  const uniforms = useMemo(() => ({
    uTime:      { value: 0 },
    uIntensity: { value: 0 },
    uMouse:     { value: new THREE.Vector2(0, 0) },
  }), []);

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
    <mesh rotation={[-Math.PI * 0.32, 0, 0]} position={[0, -2.8, -2]}>
      <planeGeometry args={[14, 1.2, 180, 32]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
