'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, type ThemeId } from '@/context/ThemeContext';

export default function ThemeSwitcher() {
  const { theme, themeId, setTheme, themesList } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className="theme-switcher-container" ref={menuRef}>
      {/* Dropdown Trigger Button */}
      <button
        id="theme-switcher-btn"
        className={`theme-switcher-btn ${isOpen ? 'theme-switcher-btn--open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`Current theme: ${theme.name}. Click to change theme`}
      >
        <span
          className="theme-dot-indicator"
          style={{
            backgroundColor: theme.dotColor,
            boxShadow: `0 0 10px ${theme.dotColor}`,
          }}
        />
        <span className="theme-current-name">{theme.name.split(' ')[0]}</span>
        <motion.span
          className="theme-chevron"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 4.5L6 8L9.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
      </button>

      {/* Floating Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="theme-dropdown-menu"
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            role="menu"
            aria-orientation="vertical"
          >
            <div className="theme-menu-header">
              <span className="theme-menu-title">Theme Presets</span>
              <span className="theme-menu-count">{themesList.length} Themes</span>
            </div>

            <div className="theme-options-list">
              {themesList.map((t) => {
                const isActive = t.id === themeId;
                return (
                  <button
                    key={t.id}
                    role="menuitem"
                    className={`theme-option ${isActive ? 'theme-option--active' : ''}`}
                    onClick={() => {
                      setTheme(t.id as ThemeId);
                      setIsOpen(false);
                    }}
                    style={
                      isActive
                        ? ({
                            '--active-color': t.primary,
                            '--active-border': t.border,
                          } as React.CSSProperties)
                        : undefined
                    }
                  >
                    {/* Theme color swatch */}
                    <div
                      className="theme-swatch"
                      style={{
                        backgroundColor: t.bg,
                        borderColor: t.border,
                      }}
                    >
                      <span
                        className="theme-swatch-dot"
                        style={{
                          backgroundColor: t.primary,
                          boxShadow: `0 0 8px ${t.primary}`,
                        }}
                      />
                    </div>

                    {/* Theme Name */}
                    <div className="theme-option-info">
                      <span className="theme-option-name">{t.name}</span>
                      <span className="theme-option-hex" style={{ color: t.primary }}>
                        {t.primary}
                      </span>
                    </div>

                    {/* Active checkmark */}
                    {isActive && (
                      <motion.span
                        layoutId="theme-check"
                        className="theme-check-icon"
                        style={{ color: t.primary }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
