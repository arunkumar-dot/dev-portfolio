'use client';

import GlassTile from '@/components/GlassTile';

export default function FedExLogisticsTile({
  onOpenCaseStudy,
}: {
  onOpenCaseStudy?: (id: string) => void;
}) {
  return (
    <GlassTile
      className="tile-fedex"
      onClick={() => onOpenCaseStudy?.('fedex-logistics')}
    >
      <div className="tile-header">
        <div className="tile-tag-row">
          <span className="tile-tag">Wipro / FedEx Australia</span>
          <span className="badge badge--amber">Panache Award 2022 🏆</span>
        </div>
        <h3 className="tile-title">Courier & Logistics Platform</h3>
        <p className="tile-subtitle">
          C# · .NET · Xamarin / MAUI · Offline-First SQLite · HTTPS REST APIs
        </p>
      </div>

      {/* Offline sync & SQLite telemetry widget */}
      <div className="fedex-sync-card">
        <div className="fedex-sync-header">
          <span className="fedex-sync-dot" />
          <span className="fedex-sync-title">Local-First Offline Resilience</span>
          <span className="fedex-sync-tag">WAL Mode</span>
        </div>

        <div className="fedex-metrics-row">
          <div className="fedex-metric-box">
            <span className="fedex-metric-num text-cyan">0ms</span>
            <span className="fedex-metric-lbl">Scan UI Delay</span>
          </div>
          <div className="fedex-metric-box">
            <span className="fedex-metric-num text-green">100%</span>
            <span className="fedex-metric-lbl">Offline Retention</span>
          </div>
          <div className="fedex-metric-box">
            <span className="fedex-metric-num text-amber">-65%</span>
            <span className="fedex-metric-lbl">Query Latency</span>
          </div>
        </div>

        <div className="fedex-pipeline-bar">
          <span className="fedex-pipe-step">Barcode Scan</span>
          <span className="fedex-pipe-arrow">→</span>
          <span className="fedex-pipe-step active">SQLite WAL</span>
          <span className="fedex-pipe-arrow">→</span>
          <span className="fedex-pipe-step">HTTPS Sync</span>
        </div>
      </div>

      {/* Action Trigger */}
      <div className="tile-actions">
        <button
          className="read-btn"
          onClick={(e) => {
            e.stopPropagation();
            onOpenCaseStudy?.('fedex-logistics');
          }}
        >
          FedEx Logistics Platform <span className="arrow">READ →</span>
        </button>
      </div>
    </GlassTile>
  );
}
