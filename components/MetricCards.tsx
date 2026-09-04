'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  formatted,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  formatted?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  // Initialise with the target value so SSR HTML shows the real number
  const [count, setCount] = useState(target);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!isInView || hasAnimated) return;
    setHasAnimated(true);

    // Briefly reset to 0 then animate up (only runs client-side)
    setCount(0);
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
  }, [isInView, target, hasAnimated]);

  const display = formatted
    ? (count === target ? formatted : count.toLocaleString())
    : count.toLocaleString();

  return (
    <span ref={ref} className="metric-card-value">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export default function MetricCards() {
  return (
    <div className="metrics-bento-row">
      {/* Metric 1: 4 Years Experience */}
      <motion.div
        className="metric-card-pill"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.45, ease: 'easeOut' }}
      >
        <AnimatedCounter target={4} />
        <span className="metric-card-label">Years Production Stack</span>
      </motion.div>

      {/* Metric 2: 4,061 requests, zero failures */}
      <motion.div
        className="metric-card-pill"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.45, ease: 'easeOut' }}
      >
        <AnimatedCounter target={4061} formatted="4,061" />
        <span className="metric-card-label">Requests, Zero Failures @ 600 RPM</span>
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
