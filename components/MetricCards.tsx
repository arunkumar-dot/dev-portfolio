'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
}: {
  target: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1400;
    const start = performance.now();

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target]);

  return (
    <span ref={ref} className="metric-card-value">
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

export default function MetricCards() {
  return (
    <div className="metrics-bento-row">
      {/* Metric 1: 4+ Years */}
      <motion.div
        className="metric-card-pill"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.45, ease: 'easeOut' }}
      >
        <AnimatedCounter target={4} suffix="+" />
        <span className="metric-card-label">Years Production Stack</span>
      </motion.div>

      {/* Metric 2: 0.00% Error SLA */}
      <motion.div
        className="metric-card-pill"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.45, ease: 'easeOut' }}
      >
        <span className="metric-card-value text-emerald-400">0.00%</span>
        <span className="metric-card-label">Error SLA (600 RPM)</span>
      </motion.div>

      {/* Metric 3: 11 Locales */}
      <motion.div
        className="metric-card-pill"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.45, ease: 'easeOut' }}
      >
        <AnimatedCounter target={11} />
        <span className="metric-card-label">Locales Shipped</span>
      </motion.div>
    </div>
  );
}
