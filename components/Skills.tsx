'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { SKILLS } from '@/lib/content';

export default function Skills() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="skills" ref={ref} className="skills-section">
      <div className="section-header">
        <span className="section-eyebrow">Technical Skills</span>
        <h2 className="section-title">
          The <span className="text-cyan">Stack</span>
        </h2>
      </div>

      <div className="skills-grid">
        {Object.entries(SKILLS).map(([category, tags], ci) => (
          <motion.div
            key={category}
            className="skills-category"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: ci * 0.08, duration: 0.45 }}
          >
            <div className="skills-category-label">{category}</div>
            <div className="skills-tags">
              {tags.map((tag, ti) => (
                <motion.span
                  key={tag}
                  className="skill-tag"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: ci * 0.08 + ti * 0.04, duration: 0.3 }}
                  whileHover={{ scale: 1.08, color: '#22d3ee', borderColor: '#22d3ee' }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
