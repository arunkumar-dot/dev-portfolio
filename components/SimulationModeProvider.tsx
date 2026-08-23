'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { useSpring } from 'framer-motion';

export type SimMode = 'normal' | 'stress';

interface SimulationContextValue {
  mode: SimMode;
  intensity: number;
  intensitySpring: ReturnType<typeof useSpring>;
  toggle: () => void;
}

const SimulationContext = createContext<SimulationContextValue | null>(null);

export function SimulationModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<SimMode>('normal');

  // Framer Motion spring — intensity 0 (normal) → 1 (stress)
  const intensitySpring = useSpring(0, { stiffness: 60, damping: 20 });
  const [intensity, setIntensity] = useState(0);

  // Keep a plain number in sync so shader uniforms can read it
  intensitySpring.on('change', (v) => setIntensity(v));

  const toggle = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'normal' ? 'stress' : 'normal';
      intensitySpring.set(next === 'stress' ? 1 : 0);
      return next;
    });
  }, [intensitySpring]);

  return (
    <SimulationContext.Provider value={{ mode, intensity, intensitySpring, toggle }}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation(): SimulationContextValue {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error('useSimulation must be used inside SimulationModeProvider');
  return ctx;
}
