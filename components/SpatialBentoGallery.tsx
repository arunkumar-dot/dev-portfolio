'use client';

import { useRef, useState } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import ClaimsWebAPITile   from '@/components/ClaimsWebAPITile';
import FedExLogisticsTile from '@/components/FedExLogisticsTile';
import ConsumerMFETile    from '@/components/ConsumerMFETile';
import EntSecurityTile    from '@/components/EntSecurityTile';
import HabitFlowTile      from '@/components/HabitFlowTile';
import GlassTile          from '@/components/GlassTile';
import CaseStudyDrawer    from '@/components/CaseStudyDrawer';
import { PROJECTS_DATA, type CaseStudy } from '@/lib/projectsData';

const TILE_VARIANTS: Variants = {
  hidden:  { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const GH_PROJECT_IDS = [
  'rag-document-assistant',
  'hn-scraper',
];

export default function SpatialBentoGallery() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [activeCsId, setActiveCsId] = useState<string | null>(null);

  const activeCs = PROJECTS_DATA.find((cs) => cs.id === activeCsId) || null;
  const githubProjects = PROJECTS_DATA.filter((cs) => GH_PROJECT_IDS.includes(cs.id));

  const handleOpenCaseStudy = (id: string) => {
    setActiveCsId(id);
  };

  const tiles = [
    { key: 'claims',    comp: <ClaimsWebAPITile onOpenCaseStudy={handleOpenCaseStudy} />, cellClass: 'bento-cell--a' },
    { key: 'fedex',     comp: <FedExLogisticsTile onOpenCaseStudy={handleOpenCaseStudy} />, cellClass: 'bento-cell--b' },
    { key: 'mfe',       comp: <ConsumerMFETile onOpenCaseStudy={handleOpenCaseStudy} />, cellClass: 'bento-cell--c' },
    { key: 'security',  comp: <EntSecurityTile onOpenCaseStudy={handleOpenCaseStudy} />, cellClass: 'bento-cell--d' },
    { key: 'habitflow', comp: <HabitFlowTile onOpenCaseStudy={handleOpenCaseStudy} />, cellClass: 'bento-cell--e' },
  ];

  return (
    <section id="case-studies" ref={ref} className="bento-section">
      {/* ─── Enterprise & Flagship SaaS Header ──────────────────────────── */}
      <div className="section-header">
        <span className="section-eyebrow">Production Portfolio</span>
        <h2 className="section-title">
          Featured Work & <span className="text-cyan">Experience</span>
        </h2>
        <p className="section-subtitle">
          Real-world distributed systems, offline-first mobile logistics, high-throughput microservices, and full-stack SaaS.
        </p>
      </div>

      {/* ─── Main Bento Grid (Enterprise + HabitFlow) ───────────────────── */}
      <div className="bento-grid">
        {tiles.map((item, i) => (
          <motion.div
            key={item.key}
            variants={TILE_VARIANTS}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            transition={{ delay: i * 0.08 }}
            className={`bento-cell ${item.cellClass}`}
          >
            {item.comp}
          </motion.div>
        ))}
      </div>

      {/* ─── GitHub Open Source Projects (Under HabitFlow) ──────────────── */}
      <div className="projects-showcase-wrap">
        <div className="projects-showcase-header">
          <div className="projects-showcase-eyebrow">
            <span className="terminal-dot terminal-dot--green" />
            <span>Open Source Engineering · github.com/arunkumar-dot</span>
          </div>
          <h3 className="projects-showcase-title">
            Featured <span className="text-cyan">Projects</span>
          </h3>
          <p className="projects-showcase-sub">
            Open-source local document Q&A and distributed queue-based scrapers.
          </p>
        </div>

        <div className="projects-grid">
          {githubProjects.map((proj, i) => (
            <motion.div
              key={proj.id}
              variants={TILE_VARIANTS}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              transition={{ delay: 0.2 + i * 0.08 }}
            >
              <GlassTile
                className="project-card"
                onClick={() => handleOpenCaseStudy(proj.id)}
              >
                <div className="tile-header">
                  <div className="tile-tag-row">
                    <span className="tile-tag">
                      {proj.id === 'rag-document-assistant' && '🤖 AI & Vector Search'}
                      {proj.id === 'hn-scraper' && '⚡ Distributed Queues'}
                    </span>
                    <span className="project-metric-pill" style={{ color: proj.metrics[0]?.color }}>
                      {proj.metrics[0]?.value}
                    </span>
                  </div>
                  <h4 className="project-card-title">{proj.title}</h4>
                  <p className="project-card-sub">{proj.subtitle}</p>
                </div>

                <div className="project-card-stack">
                  {proj.stack.map((s) => (
                    <span key={s} className="project-stack-tag">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="project-card-footer">
                  <button
                    className="read-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenCaseStudy(proj.id);
                    }}
                  >
                    Deep Dive <span className="arrow">READ →</span>
                  </button>

                  {proj.links?.[0] && (
                    <a
                      href={proj.links[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-gh-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      GitHub ↗
                    </a>
                  )}
                </div>
              </GlassTile>
            </motion.div>
          ))}
        </div>
      </div>

      <CaseStudyDrawer cs={activeCs} onClose={() => setActiveCsId(null)} />
    </section>
  );
}
