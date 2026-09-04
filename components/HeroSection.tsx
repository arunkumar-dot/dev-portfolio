'use client';

import { motion, AnimatePresence } from 'framer-motion';
import HeroTextRotator from '@/components/HeroTextRotator';
import MetricCards from '@/components/MetricCards';
import { useSimulation } from '@/components/SimulationModeProvider';

export default function HeroSection() {
  const { mode } = useSimulation();

  return (
    <section id="hero" className="hero-section" aria-label="Introduction">
      {/* Subtle radial canvas veil to preserve razor-sharp typographic contrast */}
      <div className="hero-canvas-veil" aria-hidden="true" />

      {/* Real-time stress mode concurrency banner */}
      <AnimatePresence>
        {mode === 'stress' && (
          <motion.div
            className="stress-overlay"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            [SIMULATING CONCURRENCY: 75 VIRTUAL USERS | 600 REQ/MIN | 0.00% ERRORS]
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main 50/50 Balanced Hero Viewport Grid */}
      <div className="hero-grid-container">
        {/* Left Column: High-Craft Editorial Content */}
        <div className="hero-left-col">
          {/* Status Badge */}
          <motion.div
            className="hero-status-pill"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className="hero-status-dot" />
            <span className="hero-status-text">AVAILABLE FOR OPPORTUNITIES</span>
          </motion.div>

          {/* Availability Line */}
          <motion.p
            className="hero-availability"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
          >
            📍 Bengaluru, India · 60-day notice · open to hybrid, on-site and remote
          </motion.p>

          {/* Heading with tight tracking and theme gradient surname */}
          <motion.h1
            className="hero-headline"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }}
          >
            Arun Kumar{' '}
            <span className="hero-surname-gradient">Kulkarni</span>
          </motion.h1>

          {/* Typewriter Subheadline with fixed-height bounding container */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <HeroTextRotator />
          </motion.div>

          {/* Encapsulated Telemetry Metrics Ribbon */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <MetricCards />
          </motion.div>

          {/* Call-to-Action Action Buttons */}
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <a
              href="#case-studies"
              className="hero-btn hero-btn--primary"
              id="hero-cta-work"
            >
              <span>View Work</span>
              <span className="hero-btn-arrow" aria-hidden="true">
                ↓
              </span>
            </a>

            <a
              href="#contact"
              className="hero-btn hero-btn--ghost"
              id="hero-cta-contact"
            >
              <span>Get In Touch</span>
            </a>
          </motion.div>
        </div>

        {/* Right Column: Spatial 3D Focal Zone */}
        <div className="hero-right-col" aria-hidden="true">
          {/* Spatial anchor area ensuring balanced visual weight with 3D canvas */}
          <div className="hero-spatial-anchor" />
        </div>
      </div>

      {/* Subtle bottom scroll cue */}
      <motion.a
        href="#case-studies"
        className="hero-scroll-cue"
        aria-label="Scroll to projects"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="18" height="26" viewBox="0 0 18 26" fill="none">
          <rect
            x="1"
            y="1"
            width="16"
            height="24"
            rx="8"
            stroke="currentColor"
            strokeWidth="1.2"
            opacity="0.35"
          />
          <motion.rect
            x="7.5"
            y="5"
            width="3"
            height="6"
            rx="1.5"
            fill="currentColor"
            animate={{ y: [0, 6, 0], opacity: [0.9, 0.2, 0.9] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </motion.a>
    </section>
  );
}
