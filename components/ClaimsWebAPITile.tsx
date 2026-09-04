'use client';

import GlassTile from '@/components/GlassTile';
import { CONFIG_MERGE_LEVELS, JMETER_STATS } from '@/lib/content';

const PRECEDENCE_TAGS: Record<number, string> = {
  1: 'Highest Priority',
  2: 'Group Policy',
  3: 'Admin Level',
  4: 'Org Unit',
  5: 'Base Default',
};

export default function ClaimsWebAPITile({
  onOpenCaseStudy,
}: {
  onOpenCaseStudy?: (id: string) => void;
}) {
  return (
    <GlassTile
      className="tile-claims"
      onClick={() => onOpenCaseStudy?.('claims')}
    >
      <div className="tile-header">
        <span className="tile-tag">Health Benefits &amp; Claims Platform</span>
        <h3 className="tile-title">Claims Web API</h3>
        <p className="tile-subtitle">ASP.NET Core · C# · MediatR CQRS · SQL Server · Multi-Tenant</p>
      </div>

      {/* Five-level config hierarchy */}
      <div className="config-levels">
        <div className="config-levels-header">
          <span className="config-levels-label">5-Level Config Resolution</span>
          <span className="config-levels-sub">Per-Setting Merge</span>
        </div>

        <div className="config-levels-list">
          {CONFIG_MERGE_LEVELS.map((lv) => (
            <div
              key={lv.level}
              className="config-level-pill"
              style={{
                '--lvl-color': lv.color,
                '--lvl-pct': `${100 - (lv.level - 1) * 11}%`,
              } as React.CSSProperties}
            >
              <div className="config-level-bg" />
              <div className="config-level-content">
                <div className="config-level-left">
                  <span
                    className="config-level-badge"
                    style={{ color: lv.color, borderColor: `${lv.color}40` }}
                  >
                    L{lv.level}
                  </span>
                  <span className="config-level-title" style={{ color: lv.color }}>
                    {lv.name}
                  </span>
                </div>
                <span className="config-level-precedence">
                  {PRECEDENCE_TAGS[lv.level]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* JMeter badge — diagnosis-first headline */}
      <div className="jmeter-badge">
        <div className="jmeter-badge-header">
          <span className="jmeter-badge-title">Caught a p95 latency regression before QA</span>
          <span className="jmeter-users-tag">JMeter</span>
        </div>

        <div className="jmeter-stats">
          <div className="jmeter-stat">
            <span className="jmeter-stat-val text-cyan">{JMETER_STATS.users}</span>
            <span className="jmeter-stat-key">Concurrent Users</span>
          </div>
          <div className="jmeter-stat">
            <span className="jmeter-stat-val text-cyan">{JMETER_STATS.throughput}</span>
            <span className="jmeter-stat-key">Throughput</span>
          </div>
          <div className="jmeter-stat">
            <span className="jmeter-stat-val text-green">{JMETER_STATS.samples.toLocaleString()}</span>
            <span className="jmeter-stat-key">Samples · {JMETER_STATS.errors} Errors</span>
          </div>
          <div className="jmeter-stat">
            <span className="jmeter-stat-val text-amber">{JMETER_STATS.p95}</span>
            <span className="jmeter-stat-key">p95 (vs {JMETER_STATS.slaTarget} SLA)</span>
          </div>
        </div>
        <div className="jmeter-badge-meta">
          Root-caused to sequential per-plan iteration; documented a parallelisation path and a caller-side stopgap.
        </div>
      </div>

      {/* Read action */}
      <div className="tile-actions">
        <button
          className="read-btn"
          onClick={(e) => {
            e.stopPropagation();
            onOpenCaseStudy?.('claims');
          }}
        >
          Claims API &amp; Concurrency <span className="arrow">READ →</span>
        </button>
      </div>
    </GlassTile>
  );
}
