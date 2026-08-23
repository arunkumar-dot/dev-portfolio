'use client';

import { useEffect, useRef, useState } from 'react';

const PHRASES = [
  'production-grade backend APIs.',
  'multi-tenant cloud systems.',
  'resilient micro-frontends.',
  'high-throughput distributed architectures.',
  'full-stack SaaS products.',
];
const TYPE_SPEED = 50;
const DELETE_SPEED = 25;
const PAUSE_AFTER = 2200;

export default function HeroTextRotator() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [pausing, setPausing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const target = PHRASES[phraseIdx];

    if (pausing) {
      timeoutRef.current = setTimeout(() => {
        setPausing(false);
        setDeleting(true);
      }, PAUSE_AFTER);
      return () => {
        clearTimeout(timeoutRef.current);
      };
    }

    if (deleting) {
      if (displayed.length === 0) {
        setDeleting(false);
        setPhraseIdx((i) => (i + 1) % PHRASES.length);
        return undefined;
      }
      timeoutRef.current = setTimeout(
        () => setDisplayed((d) => d.slice(0, -1)),
        DELETE_SPEED
      );
      return () => {
        clearTimeout(timeoutRef.current);
      };
    }

    if (displayed.length < target.length) {
      timeoutRef.current = setTimeout(
        () => setDisplayed(target.slice(0, displayed.length + 1)),
        TYPE_SPEED
      );
    } else {
      setPausing(true);
    }
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [displayed, deleting, pausing, phraseIdx]);

  return (
    <div className="hero-rotator-container">
      <p className="hero-rotator" aria-live="polite">
        <span className="hero-rotator-lead">Specializing in</span>{' '}
        <span className="hero-rotator-active">{displayed}</span>
        <span className="hero-caret" aria-hidden="true" />
      </p>
    </div>
  );
}
