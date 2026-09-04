'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CaseStudy } from '@/lib/projectsData';
import { OverviewTab, ArchFlow, DiffPanel, MetricsGrid } from '@/components/CaseStudyContent';

// ─── Tab Configuration ────────────────────────────────────────────────────────
type Tab = 'overview' | 'arch' | 'diff' | 'metrics';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'arch',     label: 'System Architecture' },
  { id: 'diff',     label: 'Engineering Deep Dive / Diffs' },
  { id: 'metrics',  label: 'Metrics & Outcomes' },
];

// ─── Drawer Component ─────────────────────────────────────────────────────────
interface Props {
  cs: CaseStudy | null;
  onClose: () => void;
}

export default function CaseStudyDrawer({ cs, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('overview');
  const closeRef = useRef<HTMLButtonElement>(null);

  // Reset tab when study changes
  useEffect(() => {
    if (cs) {
      setTab('overview');
      setTimeout(() => closeRef.current?.focus(), 80);
    }
  }, [cs?.id]);

  // Keyboard navigation: Escape key closes drawer
  useEffect(() => {
    if (!cs) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [cs, onClose]);

  return (
    <AnimatePresence>
      {cs && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            className="cs-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Side slide-over drawer */}
          <motion.aside
            className="cs-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={`${cs.title} detailed breakdown`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 36, mass: 0.85 }}
          >
            {/* Header */}
            <div className="cs-header">
              <div className="cs-header-meta">
                <span className="cs-tag">{cs.tag}</span>
                <h2 className="cs-title">{cs.title}</h2>
                <p className="cs-subtitle">{cs.subtitle}</p>
                <div className="cs-stack">
                  {cs.stack.map((s) => (
                    <span key={s} className="cs-stack-tag">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <button
                ref={closeRef}
                className="cs-close"
                onClick={onClose}
                aria-label="Close detail panel"
              >
                ✕
              </button>
            </div>

            {/* Tab Bar */}
            <div className="cs-tab-bar" role="tablist">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  className={`cs-tab ${tab === t.id ? 'cs-tab--active' : ''}`}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                  {tab === t.id && (
                    <motion.span
                      layoutId="cs-tab-indicator"
                      className="cs-tab-indicator"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content Body */}
            <div className="cs-body">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="cs-tab-content"
                >
                  {tab === 'overview' && <OverviewTab cs={cs} />}
                  {tab === 'arch'     && <ArchFlow cs={cs} />}
                  {tab === 'diff'     && <DiffPanel diff={cs.diff} />}
                  {tab === 'metrics'  && <MetricsGrid cs={cs} />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Action Footer */}
            {cs.links && cs.links.length > 0 && (
              <div className="cs-footer">
                {cs.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cs-footer-link"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
