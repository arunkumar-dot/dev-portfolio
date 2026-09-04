'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CONTACT } from '@/lib/content';
import { PROJECTS_DATA, type CaseStudy } from '@/lib/projectsData';
import CaseStudyDrawer from '@/components/CaseStudyDrawer';

interface GitHubProfile {
  name: string;
  login: string;
  followers: number;
  public_repos: number;
  avatar_url: string;
  bio: string | null;
}

// Filter featured open-source repositories from github.com/arunkumar-dot
const GH_FEATURED_IDS = [
  'rag-document-assistant',
  'hn-scraper',
];

export default function Contact() {
  const [copied, setCopied]         = useState(false);
  const [gh, setGh]                 = useState<GitHubProfile | null>(null);
  const [ghLoading, setGhLoading]   = useState(true);
  const [ghError, setGhError]       = useState(false);
  const [activeCsId, setActiveCsId] = useState<string | null>(null);

  const activeCs = PROJECTS_DATA.find((cs) => cs.id === activeCsId) || null;
  const githubProjects = PROJECTS_DATA.filter((cs) => GH_FEATURED_IDS.includes(cs.id));

  // GitHub API fetch with graceful fallback
  useEffect(() => {
    const controller = new AbortController();
    fetch(`https://api.github.com/users/${CONTACT.github}`, {
      signal: controller.signal,
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then((r) => {
        if (!r.ok) throw new Error('rate-limited or not found');
        return r.json() as Promise<GitHubProfile>;
      })
      .then((data) => {
        setGh(data);
        setGhLoading(false);
      })
      .catch(() => {
        setGhError(true);
        setGhLoading(false);
      });
    return () => controller.abort();
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(CONTACT.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  return (
    <section id="contact" className="contact-section">
      <div className="section-header">
        <span className="section-eyebrow">Contact & Open Source</span>
        <h2 className="section-title">
          Let&apos;s <span className="text-cyan">Connect</span>
        </h2>
      </div>

      <div className="terminal-panel">
        {/* Terminal header bar */}
        <div className="terminal-topbar">
          <span className="terminal-dot terminal-dot--red" />
          <span className="terminal-dot terminal-dot--amber" />
          <span className="terminal-dot terminal-dot--green" />
          <span className="terminal-title">arun@portfolio ~ bash</span>
        </div>

        <div className="terminal-body">
          {/* Email command */}
          <div className="terminal-line">
            <span className="terminal-prompt">$ </span>
            <span className="text-cyan">contact</span>
            <span className="text-dim"> --email</span>
          </div>
          <div className="terminal-output">
            <span className="text-green">{CONTACT.email}</span>
            <button
              id="copy-email-btn"
              className={`copy-btn ${copied ? 'copy-btn--copied' : ''}`}
              onClick={handleCopy}
              aria-label="Copy email address"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={copied ? 'copied' : 'copy'}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>

          {/* GitHub profile command */}
          <div className="terminal-line mt-4">
            <span className="terminal-prompt">$ </span>
            <span className="text-cyan">contact</span>
            <span className="text-dim"> --github</span>
          </div>

          {ghLoading && (
            <div className="terminal-output text-dim">
              Fetching profile…
              <span className="blink-cursor" />
            </div>
          )}

          {!ghLoading && ghError && (
            <div className="terminal-output">
              <a
                href={`https://github.com/${CONTACT.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="terminal-link"
                id="github-fallback-link"
              >
                github.com/{CONTACT.github} ↗
              </a>
            </div>
          )}

          {!ghLoading && gh && (
            <motion.div
              className="gh-card"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={gh.avatar_url}
                alt={`${gh.login} avatar`}
                className="gh-avatar"
                width={48}
                height={48}
              />
              <div className="gh-info">
                <div className="gh-name">{gh.name ?? gh.login}</div>
                <div className="gh-login text-dim">@{gh.login}</div>
                {gh.bio && <div className="gh-bio text-dim">{gh.bio}</div>}
                <div className="gh-stats">
                  <span>{gh.followers} followers</span>
                  <span className="text-dim">·</span>
                  <span>{gh.public_repos} repos</span>
                </div>
              </div>
              <a
                href={`https://github.com/${gh.login}`}
                target="_blank"
                rel="noopener noreferrer"
                className="gh-visit-btn"
                id="github-profile-link"
              >
                View ↗
              </a>
            </motion.div>
          )}

          {/* GitHub Repositories command */}
          <div className="terminal-line mt-4">
            <span className="terminal-prompt">$ </span>
            <span className="text-cyan">gh</span>
            <span className="text-dim"> repo list --featured</span>
          </div>

          <div className="gh-repos-terminal-grid">
            {githubProjects.map((repo) => (
              <div
                key={repo.id}
                className="gh-repo-item"
                onClick={() => setActiveCsId(repo.id)}
              >
                <div className="gh-repo-header">
                  <span className="gh-repo-name">📦 {repo.title}</span>
                  <span className="gh-repo-tag">{repo.metrics[0]?.value}</span>
                </div>
                <p className="gh-repo-sub">{repo.subtitle}</p>
                <div className="gh-repo-footer">
                  <div className="gh-repo-stack">
                    {repo.stack.slice(0, 3).map((s) => (
                      <span key={s} className="gh-repo-chip">
                        {s}
                      </span>
                    ))}
                  </div>
                  <button
                    className="gh-read-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveCsId(repo.id);
                    }}
                  >
                    READ →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Resume download command */}
          <div className="terminal-line mt-4">
            <span className="terminal-prompt">$ </span>
            <span className="text-cyan">download</span>
            <span className="text-dim"> --resume</span>
          </div>
          <div className="terminal-output">
            <a
              href="/Arun_Kumar_Kulkarni_Resume.pdf"
              download
              className="terminal-resume-btn"
              id="contact-resume-download"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 1v9M7 10L3.5 6.5M7 10l3.5-3.5M1 13h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Download Arun_Kumar_Kulkarni_Resume.pdf ↓
            </a>
          </div>

          {/* LinkedIn command */}
          <div className="terminal-line mt-4">
            <span className="terminal-prompt">$ </span>
            <span className="text-cyan">contact</span>
            <span className="text-dim"> --linkedin</span>
          </div>
          <div className="terminal-output">
            <a
              href={`https://linkedin.com/in/${CONTACT.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="terminal-link"
              id="linkedin-link"
            >
              linkedin.com/in/{CONTACT.linkedin} ↗
            </a>
          </div>

          {/* Blinking cursor */}
          <div className="terminal-line mt-4">
            <span className="terminal-prompt">$ </span>
            <span className="blink-cursor" />
          </div>
        </div>
      </div>

      <CaseStudyDrawer cs={activeCs} onClose={() => setActiveCsId(null)} />
    </section>
  );
}
