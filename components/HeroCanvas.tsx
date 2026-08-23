'use client';

import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import AntiGravityScene from '@/components/AntiGravityCanvas';
import { useSimulation } from '@/components/SimulationModeProvider';

function BloomLayer() {
  const { intensity } = useSimulation();
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.15}
        luminanceSmoothing={0.6}
        intensity={0.5 + intensity * 1.8}
        mipmapBlur
      />
    </EffectComposer>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 72 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: 3, /* THREE.ACESFilmicToneMapping */
        toneMappingExposure: 1.1,
      }}
      style={{ background: 'transparent' }}
    >
      <AntiGravityScene />
      <BloomLayer />
    </Canvas>
  );
}
