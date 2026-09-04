'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { EDUCATION_DATA } from '@/lib/content';

export default function Education() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="education" ref={ref} className="education-section">
      <div className="section-header">
        <span className="section-eyebrow">Education &amp; Certifications</span>
        <h2 className="section-title">
          Credentials &amp; <span className="text-cyan">Recognition</span>
        </h2>
      </div>

      <div className="education-grid">
        {EDUCATION_DATA.map((entry, i) => (
          <motion.div
            key={entry.title}
            className={`education-card education-card--${entry.type}`}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.45, ease: 'easeOut' }}
          >
            <span className="education-icon">{entry.icon}</span>
            <div className="education-info">
              <h3 className="education-title">{entry.title}</h3>
              <div className="education-meta">
                <span className="education-institution">{entry.institution}</span>
                {entry.year && (
                  <>
                    <span className="education-sep">·</span>
                    <span className="education-year">{entry.year}</span>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
