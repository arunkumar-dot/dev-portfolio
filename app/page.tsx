import Navbar             from "@/components/Navbar";
import HeroSection        from "@/components/HeroSection";
import Experience         from "@/components/Experience";
import SpatialBentoGallery from "@/components/SpatialBentoGallery";
import Skills             from "@/components/Skills";
import Education          from "@/components/Education";
import Contact            from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <Experience />
      <SpatialBentoGallery />
      <Skills />
      <Education />
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
