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
          C# · .NET · Xamarin / MAUI · MVVM · SQLite · REST APIs
        </p>
      </div>

      {/* Offline persistence & API contract widget */}
      <div className="fedex-sync-card">
        <div className="fedex-sync-header">
          <span className="fedex-sync-dot" />
          <span className="fedex-sync-title">Mobile Engineering & API Specs</span>
          <span className="fedex-sync-tag">REST Specs</span>
        </div>

        <div className="fedex-metrics-row">
          <div className="fedex-metric-box">
            <span className="fedex-metric-num text-cyan">2 Teams</span>
            <span className="fedex-metric-lbl">Android & iOS Specs</span>
          </div>
          <div className="fedex-metric-box">
            <span className="fedex-metric-num text-green">MVVM</span>
            <span className="fedex-metric-lbl">SQLite Persistence</span>
          </div>
          <div className="fedex-metric-box">
            <span className="fedex-metric-num text-amber">Award</span>
            <span className="fedex-metric-lbl">Panache 2022</span>
          </div>
        </div>

        <div className="fedex-pipeline-bar">
          <span className="fedex-pipe-step">Standardized API Spec</span>
          <span className="fedex-pipe-arrow">→</span>
          <span className="fedex-pipe-step active">SQLite Local Cache</span>
          <span className="fedex-pipe-arrow">→</span>
          <span className="fedex-pipe-step">Mobile Dispatch</span>
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
