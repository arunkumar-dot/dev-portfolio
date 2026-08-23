'use client';

import GlassTile from '@/components/GlassTile';

const STACK = [
  { label: 'Next.js', color: '#fff' },
  { label: 'Convex', color: '#22d3ee' },
  { label: 'Clerk', color: '#818cf8' },
  { label: 'Cloudflare', color: '#f97316' },
  { label: 'Firebase', color: '#f59e0b' },
];

export default function HabitFlowTile({
  onOpenCaseStudy,
}: {
  onOpenCaseStudy?: (id: string) => void;
}) {
  return (
    <GlassTile
      className="tile-habitflow"
      onClick={() => onOpenCaseStudy?.('habitflow')}
    >
      <div className="tile-header">
        <span className="tile-tag">Side Project</span>
        <h3 className="tile-title">HabitFlow</h3>
        <p className="tile-subtitle">Full-stack SaaS habit tracker</p>
      </div>

      {/* Product badge */}
      <div className="hf-product-badge">
        <div className="hf-logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="19" stroke="#22d3ee" strokeWidth="1.5" />
            <path d="M12 20 C12 14 20 10 20 10 C20 10 28 14 28 20 C28 26 20 30 20 30 C20 30 12 26 12 20Z"
              fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinejoin="round" />
            <circle cx="20" cy="20" r="3" fill="#22d3ee" />
          </svg>
        </div>
        <div className="hf-badge-text">
          <div className="hf-badge-name">HabitFlow</div>
          <div className="hf-badge-tagline">Build habits that stick</div>
        </div>
        <span className="hf-live-dot" aria-label="Live product" />
      </div>

      {/* Stack chips */}
      <div className="hf-stack">
        {STACK.map((s) => (
          <span key={s.label} className="hf-chip" style={{ color: s.color, borderColor: `${s.color}40` }}>
            {s.label}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="hf-actions" onClick={(e) => e.stopPropagation()}>
        <button
          className="read-btn hf-read-btn"
          onClick={(e) => {
            e.stopPropagation();
            onOpenCaseStudy?.('habitflow');
          }}
        >
          HabitFlow SaaS <span className="arrow">READ →</span>
        </button>
        <div className="hf-external-links">
          <a
            href="https://tryhabitflow.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hf-launch-btn"
            id="habitflow-launch"
          >
            Launch App ↗
          </a>
          <a
            href="https://github.com/arunkumar-dot"
            target="_blank"
            rel="noopener noreferrer"
            className="hf-github-btn"
            id="habitflow-github"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </GlassTile>
  );
}
