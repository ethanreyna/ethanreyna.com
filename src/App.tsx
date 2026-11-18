import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Work from "./components/Work";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Contact, { Footer } from "./components/Contact";
import { useEffect } from "react";

export default function App() {
  // The page renders client-side, so the browser can't jump to a #section on load by itself.
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-fg"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Work />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
