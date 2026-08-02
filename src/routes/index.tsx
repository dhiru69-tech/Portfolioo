import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { ScrollVideoHero } from "@/components/ScrollVideoHero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { ToolsCredentials } from "@/components/ToolsCredentials";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { CustomCursor } from "@/components/CustomCursor";
import { CurveSection } from "@/components/CurveSection";

const title = "Dhiru — Cybersecurity Developer & Security Research";
const description =
  "Portfolio of Dhiru, a cybersecurity-focused developer working on offensive security, OSINT, CTFs, secure development and practical security tooling.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "https://dhirajiitp.vercel.app/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Dhiru",
          alternateName: "CYBER-D",
          url: "https://dhirajiitp.vercel.app/",
          jobTitle: "Cybersecurity Developer",
          description,
          knowsAbout: [
            "Cybersecurity",
            "Ethical Hacking",
            "CTF",
            "Web Development",
            "OSINT",
          ],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-abyss">
      <Navbar />
      <main>
        <ScrollVideoHero />

        <CurveSection background="#050505">
          <About />
        </CurveSection>

        <CurveSection background="#f5f5f3" className="theme-light">
          <Skills />
        </CurveSection>

        <CurveSection background="#050505">
          <ToolsCredentials />
        </CurveSection>

        <CurveSection background="#050505">
          <Projects />
        </CurveSection>

        <CurveSection background="#000000">
          <Experience />
        </CurveSection>


        <CurveSection background="#f5f5f3" className="theme-light">
          <Contact />
        </CurveSection>
      </main>

      <Footer />
      <BackToTop />
      <CustomCursor />
    </div>
  );
}
