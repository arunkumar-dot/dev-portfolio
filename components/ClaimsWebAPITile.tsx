'use client';

import GlassTile from '@/components/GlassTile';
import { CONFIG_MERGE_LEVELS, JMETER_STATS } from '@/lib/content';

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
        <span className="tile-tag">Health Benefits & Claims Platform</span>
        <h3 className="tile-title">Claims Web API</h3>
        <p className="tile-subtitle">ASP.NET Core · C# · MediatR CQRS · SQL Server · Multi-Tenant</p>
      </div>

      {/* Five-level config hierarchy */}
      <div className="config-levels">
        <div className="config-levels-label">5-Level Config Resolution (Per-Setting Merge)</div>
        {CONFIG_MERGE_LEVELS.map((lv) => (
          <div key={lv.level} className="config-level-row">
            <span className="config-level-num" style={{ color: lv.color }}>
              L{lv.level}
            </span>
            <div
              className="config-level-bar"
              style={{
                width: `${55 + lv.level * 9}%`,
                background: `linear-gradient(90deg, ${lv.color}33, ${lv.color}11)`,
                borderLeft: `2px solid ${lv.color}`,
              }}
            />
            <span className="config-level-name" style={{ color: lv.color }}>
              {lv.name}
            </span>
          </div>
        ))}
      </div>

      {/* JMeter badge */}
      <div className="jmeter-badge">
        <div className="jmeter-badge-title">JMeter Load Test @ 600 RPM (75 Users)</div>
        <div className="jmeter-stats">
          <div className="jmeter-stat">
            <span className="jmeter-stat-val text-cyan">{JMETER_STATS.samples.toLocaleString()}</span>
            <span className="jmeter-stat-key">Samples</span>
          </div>
          <div className="jmeter-stat">
            <span className="jmeter-stat-val text-green">{JMETER_STATS.errors}</span>
            <span className="jmeter-stat-key">Errors</span>
          </div>
          <div className="jmeter-stat">
            <span className="jmeter-stat-val text-amber">{JMETER_STATS.p95}</span>
            <span className="jmeter-stat-key">p95 (vs 2s SLA)</span>
          </div>
          <div className="jmeter-stat">
            <span className="jmeter-stat-val text-amber">{JMETER_STATS.p99}</span>
            <span className="jmeter-stat-key">p99</span>
          </div>
        </div>
        <div className="jmeter-badge-meta">
          4,061 samples evaluated · 0% error rate · root-caused p95 latency regression
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
          Claims API & Concurrency <span className="arrow">READ →</span>
        </button>
      </div>
    </GlassTile>
  );
}
