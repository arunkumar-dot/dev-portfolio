'use client';

import { useState } from 'react';
import GlassTile from '@/components/GlassTile';
import { LOCALE_LABELS } from '@/lib/content';

const LOCALES = Object.keys(LOCALE_LABELS);
const PAYMENT_TYPES = ['Direct Deposit', 'Check by Mail'] as const;
type PaymentType = (typeof PAYMENT_TYPES)[number];

export default function ConsumerMFETile({
  onOpenCaseStudy,
}: {
  onOpenCaseStudy?: (id: string) => void;
}) {
  const [locale, setLocale]   = useState<string>('en-US');
  const [payment, setPayment] = useState<PaymentType>('Direct Deposit');

  const labels = LOCALE_LABELS[locale];

  return (
    <GlassTile
      className="tile-mfe"
      onClick={() => onOpenCaseStudy?.('mfe')}
    >
      <div className="tile-header">
        <span className="tile-tag">Consumer Claims</span>
        <h3 className="tile-title">Micro-Frontend</h3>
        <p className="tile-subtitle">React 19 · Module Federation · i18n</p>
      </div>

      {/* Payment type toggle */}
      <div className="mfe-payment-toggle" onClick={(e) => e.stopPropagation()}>
        {PAYMENT_TYPES.map((pt) => (
          <button
            key={pt}
            id={`payment-${pt.toLowerCase().replace(' ', '-')}`}
            className={`mfe-payment-btn ${payment === pt ? 'mfe-payment-btn--active' : ''}`}
            onClick={() => setPayment(pt)}
          >
            {pt}
          </button>
        ))}
      </div>

      {/* Simulated claim form */}
      <div className="mfe-form" onClick={(e) => e.stopPropagation()}>
        <div className="mfe-form-row">
          <label className="mfe-label">{labels.amount}</label>
          <div className="mfe-input-mock">$1,250.00</div>
        </div>
        <div className="mfe-form-row">
          <label className="mfe-label">{labels.status}</label>
          <span className="mfe-status-badge">
            {payment === 'Direct Deposit' ? '✓ ACH Validated' : '⏳ Mailing Queue'}
          </span>
        </div>
        <button className="mfe-submit-btn" id="mfe-submit">
          {labels.submit}
        </button>
      </div>

      {/* Locale switcher & READ action */}
      <div className="mfe-footer-actions">
        <div className="mfe-locale-wrap" onClick={(e) => e.stopPropagation()}>
          <span className="mfe-locale-label">Locales:</span>
          <select
            id="locale-switcher"
            className="mfe-locale-select"
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
          >
            {LOCALES.map((lc) => (
              <option key={lc} value={lc}>{lc}</option>
            ))}
          </select>
        </div>

        <button
          className="read-btn"
          onClick={(e) => {
            e.stopPropagation();
            onOpenCaseStudy?.('mfe');
          }}
        >
          Transfer-Method MFE <span className="arrow">READ →</span>
        </button>
      </div>
    </GlassTile>
  );
}
