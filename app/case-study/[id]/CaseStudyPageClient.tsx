'use client';

import Link from 'next/link';
import type { CaseStudy } from '@/lib/projectsData';
import CaseStudyContent from '@/components/CaseStudyContent';
import Navbar from '@/components/Navbar';

export default function CaseStudyPageClient({ cs }: { cs: CaseStudy }) {
  return (
    <main className="case-study-page">
      <Navbar />
      <div className="case-study-page-container">
        <Link href="/#case-studies" className="case-study-back-link">
          ← Back to Portfolio
        </Link>
        <CaseStudyContent cs={cs} />
      </div>
    </main>
  );
}
