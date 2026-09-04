'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CaseStudy } from '@/lib/projectsData';

// ─── Tab Configuration ────────────────────────────────────────────────────────
type Tab = 'overview' | 'arch' | 'diff' | 'metrics';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'arch',     label: 'System Architecture' },
  { id: 'diff',     label: 'Engineering Deep Dive / Diffs' },
  { id: 'metrics',  label: 'Metrics & Outcomes' },
];

// ─── Architecture Flow Diagram ────────────────────────────────────────────────
export function ArchFlow({ cs }: { cs: CaseStudy }) {
  return (
    <div className="cs-arch-wrap">
      <div className="cs-section-header-wrap">
        <h3 className="cs-arch-title">{cs.arch.title}</h3>
        <span className="cs-pill-badge">Interactive Flow</span>
      </div>

      {/* Step Flow */}
      <div className="cs-flow">
        {cs.arch.steps.map((step, i) => (
          <div key={i} className="cs-flow-item">
            <div className={`cs-flow-node cs-flow-node--${step.variant ?? 'primary'}`}>
              <div className="cs-flow-node-index">0{i + 1}</div>
              <span className="cs-flow-node-label">{step.label}</span>
              {step.sub && <span className="cs-flow-node-sub">{step.sub}</span>}
            </div>
            {i < cs.arch.steps.length - 1 && (
              <div className="cs-flow-arrow" aria-hidden>
                <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                  <path d="M8 0V16M8 16L3 11M8 16L13 11" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Key Engineering Decisions */}
      <div className="cs-decisions">
        <h4 className="cs-decisions-heading">Key Engineering Decisions</h4>
        <div className="cs-decisions-list">
          {cs.arch.decisions.map((d, i) => (
            <div key={i} className="cs-decision">
              <span className="cs-decision-num">0{i + 1}</span>
              <div>
                <p className="cs-decision-heading">{d.heading}</p>
                <p className="cs-decision-detail">{d.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Code Diff Viewer ─────────────────────────────────────────────────────────
export function DiffPanel({ diff }: { diff: CaseStudy['diff'] }) {
  return (
    <div className="cs-diff-wrap">
      {diff.legend && <p className="cs-diff-legend">// {diff.legend}</p>}
      <div className="cs-diff-grid">
        <div className="cs-diff-col cs-diff-col--before">
          <div className="cs-diff-col-header">
            <span className="cs-diff-pill cs-diff-pill--before">LEGACY / BEFORE</span>
          </div>
          <div className="cs-diff-code">
            {diff.before.map((line, i) => (
              <div
                key={i}
                className={`cs-diff-line ${
                  line.startsWith('// ❌') || line.includes('throws') || line.includes('Danger') || line.includes('stale')
                    ? 'cs-diff-line--del'
                    : ''
                }`}
              >
                <span className="cs-diff-gutter">{i + 1}</span>
                <span>{line || '\u00A0'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="cs-diff-col cs-diff-col--after">
          <div className="cs-diff-col-header">
            <span className="cs-diff-pill cs-diff-pill--after">OPTIMIZED / AFTER</span>
          </div>
          <div className="cs-diff-code">
            {diff.after.map((line, i) => (
              <div
                key={i}
                className={`cs-diff-line ${
                  line.startsWith('// ✅') || line.includes('safe') || line.includes('Sub-100ms')
                    ? 'cs-diff-line--add'
                    : ''
                }`}
              >
                <span className="cs-diff-gutter">{i + 1}</span>
                <span>{line || '\u00A0'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Metrics & Outcomes ───────────────────────────────────────────────────────
export function MetricsGrid({ cs }: { cs: CaseStudy }) {
  return (
    <div className="cs-metrics-wrap">
      {cs.recognition && (
        <div className="cs-award-card">
          <div className="cs-award-icon">🏆</div>
          <div>
            <div className="cs-award-badge">Award Recognition</div>
            <div className="cs-award-title">{cs.recognition}</div>
            <p className="cs-award-desc">
              Recognized for independently resolving complex architectural defects and delivering offline reliability within two months.
            </p>
          </div>
        </div>
      )}

      <div className="cs-metrics-grid">
        {cs.metrics.map((m, i) => (
          <motion.div
            key={i}
            className="cs-metric-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.35, ease: 'easeOut' }}
            style={{ '--m-color': m.color } as React.CSSProperties}
          >
            <span className="cs-metric-value">{m.value}</span>
            <span className="cs-metric-label">{m.label}</span>
            {m.sub && <span className="cs-metric-sub">{m.sub}</span>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
export function OverviewTab({ cs }: { cs: CaseStudy }) {
  const sections: [string, string][] = [
    ['Context', cs.overview.context],
    ['Problem', cs.overview.problem],
    ['Solution', cs.overview.solution],
    ['Outcome', cs.overview.outcome],
  ];
  const accentColors = ['#00f5d4', '#f59e0b', '#818cf8', '#22c55e'] as const;

  return (
    <div className="cs-overview">
      {cs.role && (
        <div className="cs-role-badge">
          <span className="cs-role-label">Role:</span>
          <span className="cs-role-value">{cs.role}</span>
        </div>
      )}

      {sections.map(([heading, text], i) => (
        <div key={heading} className="cs-overview-row">
          <span className="cs-overview-heading" style={{ color: accentColors[i] }}>
            {heading}
          </span>
          <p className="cs-overview-text">{text}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Tabbed Case Study Content ────────────────────────────────────────────────
export default function CaseStudyContent({ cs }: { cs: CaseStudy }) {
  const [tab, setTab] = useState<Tab>('overview');

  return (
    <div className="cs-content-standalone">
      {/* Header */}
      <div className="cs-header cs-header--standalone">
        <div className="cs-header-meta">
          <span className="cs-tag">{cs.tag}</span>
          <h1 className="cs-title">{cs.title}</h1>
          <p className="cs-subtitle">{cs.subtitle}</p>
          <div className="cs-stack">
            {cs.stack.map((s) => (
              <span key={s} className="cs-stack-tag">
                {s}
              </span>
            ))}
          </div>
        </div>
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
                layoutId="cs-page-tab-indicator"
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
    </div>
  );
}
