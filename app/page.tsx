import Header             from "@/components/Header";
import Hero               from "@/components/Hero";
import SpatialBentoGallery from "@/components/SpatialBentoGallery";
import Skills             from "@/components/Skills";
import Contact            from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <SpatialBentoGallery />
      <Skills />
      <Contact />
      <footer className="site-footer">
        <span className="text-dim">
          © {new Date().getFullYear()} Arun Kumar Kulkarni
        </span>
        <span className="text-dim">·</span>
        <span className="text-dim">Built with Next.js 16 · Three.js · Framer Motion</span>
      </footer>
    </main>
  );
}
