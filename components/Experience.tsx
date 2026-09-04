'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { EXPERIENCE_DATA } from '@/lib/content';

export default function Experience() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="experience" ref={ref} className="experience-section">
      <div className="section-header">
        <span className="section-eyebrow">Professional Experience</span>
        <h2 className="section-title">
          Work <span className="text-cyan">History</span>
        </h2>
      </div>

      <div className="experience-timeline">
        {EXPERIENCE_DATA.map((entry, i) => (
          <motion.div
            key={entry.company}
            className="experience-card"
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.15, duration: 0.5, ease: 'easeOut' }}
          >
            {/* Timeline dot and line */}
            <div className="experience-timeline-indicator">
              <span className={`experience-dot ${i === 0 ? 'experience-dot--active' : ''}`} />
              {i < EXPERIENCE_DATA.length - 1 && <span className="experience-line" />}
            </div>

            {/* Card content */}
            <div className="experience-content">
              <div className="experience-meta">
                <span className="experience-dates">{entry.dates}</span>
                <span className="experience-location">📍 {entry.location}</span>
              </div>

              <h3 className="experience-title">{entry.title}</h3>
              <div className="experience-company">{entry.company}</div>
              <div className="experience-client">
                <span className="experience-client-label">Client:</span> {entry.client}
              </div>

              <ul className="experience-lines">
                {entry.lines.map((line, li) => (
                  <li key={li}>{line}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
