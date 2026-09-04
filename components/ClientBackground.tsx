'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const GlobalBackgroundCanvas = dynamic(
  () => import('@/components/GlobalBackgroundCanvas'),
  { ssr: false }
);

export default function ClientBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // On mobile viewports, render a lightweight gradient fallback
  // instead of the heavy Three.js canvas to keep LCP under 2.5s
  if (isMobile) {
    return (
      <div
        className="global-canvas-container global-canvas-fallback"
        aria-hidden="true"
      />
    );
  }

  return <GlobalBackgroundCanvas />;
}
