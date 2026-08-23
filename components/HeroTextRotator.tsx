'use client';

import { useEffect, useRef, useState } from 'react';

const BASE = "a senior software engineer building ";
const PHRASES = [
  'production-grade backend APIs.',
  'multi-tenant cloud systems.',
  'resilient micro-frontends.',
  'full-stack SaaS products.',
];
const TYPE_SPEED   = 55;
const DELETE_SPEED = 28;
const PAUSE_AFTER  = 2200;

export default function HeroTextRotator() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting]   = useState(false);
  const [pausing, setPausing]     = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const target = PHRASES[phraseIdx];

    if (pausing) {
      timeoutRef.current = setTimeout(() => {
        setPausing(false);
        setDeleting(true);
      }, PAUSE_AFTER);
      return () => { clearTimeout(timeoutRef.current); };
    }

    if (deleting) {
      if (displayed.length === 0) {
        setDeleting(false);
        setPhraseIdx((i) => (i + 1) % PHRASES.length);
        return undefined;
      }
      timeoutRef.current = setTimeout(
        () => setDisplayed((d) => d.slice(0, -1)),
        DELETE_SPEED,
      );
      return () => { clearTimeout(timeoutRef.current); };
    }

    if (displayed.length < target.length) {
      timeoutRef.current = setTimeout(
        () => setDisplayed(target.slice(0, displayed.length + 1)),
        TYPE_SPEED,
      );
    } else {
      setPausing(true);
    }
    return () => { clearTimeout(timeoutRef.current); };
  }, [displayed, deleting, pausing, phraseIdx]);

  return (
    <p className="hero-rotator" aria-live="polite">
      <span className="hero-rotator-base">
        I&apos;m Arun Kumar Kulkarni, {BASE}
      </span>
      <span className="text-cyan">{displayed}</span>
      <span className="hero-caret" aria-hidden="true" />
    </p>
  );
}
