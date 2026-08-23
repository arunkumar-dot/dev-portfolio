'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSimulation } from '@/components/SimulationModeProvider';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export default function Header() {
  const { mode, toggle } = useSimulation();
  const isStress = mode === 'stress';

  return (
    <header className="header-nav">
      <div className="header-inner">
        {/* Identity */}
        <div className="header-identity">
          <span className="header-name">AKK</span>
          <span className="header-sep">·</span>
          <span className="header-title">Senior Software Engineer</span>
        </div>

        {/* Header Right Controls */}
        <div className="header-controls">
          {/* Interactive Theme Switcher Dropdown */}
          <ThemeSwitcher />

          {/* Mode Toggle */}
          <button
            id="sim-mode-toggle"
            className={`mode-toggle ${isStress ? 'mode-toggle--stress' : ''}`}
            onClick={toggle}
            aria-pressed={isStress}
            aria-label="Toggle simulation mode"
          >
            {/* Sliding indicator behind the labels */}
            <motion.span
              className="mode-indicator"
              layout
              animate={
                isStress
                  ? { left: '50%', right: '3px', borderRadius: '100px' }
                  : { left: '3px', right: '50%', borderRadius: '100px' }
              }
              initial={false}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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

          {/* Status dot */}
          <div className="header-status">
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
