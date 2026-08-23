'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSimulation } from '@/components/SimulationModeProvider';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export default function Navbar() {
  const { mode, toggle } = useSimulation();
  const isStress = mode === 'stress';

  return (
    <header className="header-nav" role="banner">
      <div className="header-inner">
        {/* Left: Brand / Identity */}
        <a href="#hero" className="header-identity" aria-label="Arun Kumar Kulkarni Portfolio">
          <span className="header-name">AKK</span>
          <span className="header-sep">/</span>
          <span className="header-role-tag">Senior Software Engineer</span>
        </a>

        {/* Right: Unified Floating Glass Controls Dock */}
        <div className="header-dock-pill">
          {/* Theme Switcher Dropdown */}
          <ThemeSwitcher />

          <div className="dock-separator" aria-hidden="true" />

          {/* Normal / 600 RPM Stress Mode Toggle */}
          <button
            id="sim-mode-toggle"
            className={`mode-toggle ${isStress ? 'mode-toggle--stress' : ''}`}
            onClick={toggle}
            aria-pressed={isStress}
            aria-label="Toggle simulation mode"
          >
            <motion.span
              className="mode-indicator"
              layout
              animate={
                isStress
                  ? { left: '50%', right: '3px', borderRadius: '100px' }
                  : { left: '3px', right: '50%', borderRadius: '100px' }
              }
              initial={false}
              transition={{ type: 'spring', stiffness: 340, damping: 32 }}
            />

            <span className={`mode-label ${!isStress ? 'mode-label--active' : ''}`}>
              NORMAL
            </span>
            <span
              className={`mode-label mode-label--stress ${
                isStress ? 'mode-label--active' : ''
              }`}
            >
              600 RPM
            </span>
          </button>

          <div className="dock-separator" aria-hidden="true" />

          {/* Status Indicator */}
          <div className="header-status" title={isStress ? 'Simulating 600 RPM peak load' : 'System nominal'}>
            <AnimatePresence mode="wait">
              <motion.span
                key={mode}
                className={`status-dot ${
                  isStress ? 'status-dot--stress' : 'status-dot--normal'
                }`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            </AnimatePresence>
            <span className={`status-text ${isStress ? 'text-amber' : 'text-cyan'}`}>
              {isStress ? 'STRESS' : 'NOMINAL'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
