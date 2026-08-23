'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { METRICS } from '@/lib/content';

function Counter({ target, suffix, prefix }: { target: number; suffix: string; prefix: string }) {
  const ref      = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [count, setCount] = useState(0);
  const rafRef   = useRef<number>(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1600; // ms
    const start    = performance.now();

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isInView, target]);

  return (
    <span ref={ref} className="metric-value">
      {prefix}{count}{suffix}
    </span>
  );
}

export default function MetricsStrip() {
  return (
    <div className="metrics-strip">
      {METRICS.map((m) => (
        <motion.div
          key={m.label}
          className="metric-item"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Counter target={m.value} suffix={m.suffix} prefix={m.prefix} />
          <span className="metric-label">{m.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
