'use client';

import GlassTile  from '@/components/GlassTile';
import DiffViewer from '@/components/DiffViewer';
import { SECURITY_DIFF } from '@/lib/content';

export default function EntSecurityTile({
  onOpenCaseStudy,
}: {
  onOpenCaseStudy?: (id: string) => void;
}) {
  return (
    <GlassTile
      className="tile-security"
      onClick={() => onOpenCaseStudy?.('xss')}
    >
      <div className="tile-header">
        <span className="tile-tag">Enterprise Security</span>
        <h3 className="tile-title">XSS Remediation Layer</h3>
        <p className="tile-subtitle">C# · ASP.NET Core · HTML Escaping · Feature Flags</p>
      </div>

      <div className="security-badges-wrap">
        <div className="security-badges">
          <span className="badge badge--green">OWASP A03 Patched</span>
          <span className="badge badge--cyan">Feature-Flagged Rollout</span>
          <span className="badge badge--purple">Response-Capture Filter</span>
        </div>

        <button
          className="read-btn"
          onClick={(e) => {
            e.stopPropagation();
            onOpenCaseStudy?.('xss');
          }}
        >
          XSS Remediation <span className="arrow">READ →</span>
        </button>
      </div>

      <DiffViewer before={SECURITY_DIFF.before} after={SECURITY_DIFF.after} />
    </GlassTile>
  );
}
