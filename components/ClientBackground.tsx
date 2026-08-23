'use client';

import dynamic from 'next/dynamic';

const GlobalBackgroundCanvas = dynamic(
  () => import('@/components/GlobalBackgroundCanvas'),
  { ssr: false }
);

export default function ClientBackground() {
  return <GlobalBackgroundCanvas />;
}
