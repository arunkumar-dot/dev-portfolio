import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PROJECTS_DATA } from '@/lib/projectsData';
import CaseStudyPageClient from './CaseStudyPageClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return PROJECTS_DATA.map((cs) => ({ id: cs.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const cs = PROJECTS_DATA.find((p) => p.id === id);
  if (!cs) return { title: 'Case Study Not Found' };

  return {
    title: `${cs.title} — Arun Kumar Kulkarni`,
    description: cs.subtitle,
    openGraph: {
      title: `${cs.title} — Arun Kumar Kulkarni`,
      description: cs.subtitle,
      type: 'article',
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { id } = await params;
  const cs = PROJECTS_DATA.find((p) => p.id === id);
  if (!cs) notFound();

  return <CaseStudyPageClient cs={cs} />;
}
