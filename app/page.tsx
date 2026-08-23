import Navbar             from "@/components/Navbar";
import HeroSection        from "@/components/HeroSection";
import SpatialBentoGallery from "@/components/SpatialBentoGallery";
import Skills             from "@/components/Skills";
import Contact            from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
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
