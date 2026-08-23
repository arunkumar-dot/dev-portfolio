'use client';

import { motion, AnimatePresence } from 'framer-motion';
import HeroTextRotator from '@/components/HeroTextRotator';
import MetricsStrip    from '@/components/MetricsStrip';
import { useSimulation } from '@/components/SimulationModeProvider';

export default function Hero() {
  const { mode } = useSimulation();

  return (
    <section id="hero" className="hero-section">
      {/* Radial gradient veil — keeps typography sharp over 3D objects */}
      <div className="hero-canvas-veil" aria-hidden="true" />

      {/* Stress-mode overlay — HTML for crispness */}
      <AnimatePresence>
        {mode === 'stress' && (
          <motion.div
            className="stress-overlay"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            [SIMULATING CONCURRENCY: 75 VIRTUAL USERS | 600 REQ/MIN | 0.00% ERRORS]
          </motion.div>
        )}
      </AnimatePresence>

      {/* Headline content */}
      <div className="hero-content">
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="hero-badge-dot" />
          AVAILABLE FOR OPPORTUNITIES
        </motion.div>

        <motion.h1
          className="hero-headline"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Arun Kumar
          <br />
          <span className="text-cyan">Kulkarni</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <HeroTextRotator />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <MetricsStrip />
        </motion.div>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.75 }}
        >
          <a href="#case-studies" className="btn btn--primary" id="hero-cta-work">
            View My Work
          </a>
          <a href="#contact" className="btn btn--ghost" id="hero-cta-contact">
            Get In Touch
          </a>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="scroll-cue"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="20" height="30" viewBox="0 0 20 30" fill="none">
          <rect x="1" y="1" width="18" height="28" rx="9" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
          <motion.rect
            x="8.5" y="6" width="3" height="7" rx="1.5"
            fill="currentColor"
            animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </motion.div>
    </section>
  );
}
