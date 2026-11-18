import { useEffect, useState } from "react";
import { profile } from "../data/content";
import { Icon } from "./ui";

const links = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

function useTheme() {
  const [light, setLight] = useState(() => document.documentElement.classList.contains("light"));
  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
    try {
      localStorage.setItem("theme", light ? "light" : "dark");
    } catch {
      /* storage unavailable */
    }
  }, [light]);
  return [light, () => setLight((v) => !v)] as const;
}

export default function Nav() {
  const [light, toggle] = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view.
  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector(l.href))
      .filter((el): el is Element => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled ? "border-b border-line bg-bg/80 backdrop-blur-lg" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5 font-medium" aria-label="Back to top">
          <span className="grid size-8 place-items-center rounded-lg bg-accent font-mono text-sm font-bold text-accent-fg">
            er
          </span>
          <span className="hidden sm:inline">{profile.name}</span>
        </a>
        <div className="flex items-center gap-1">
          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`rounded-full px-3 py-1.5 text-sm transition ${
                    active === l.href ? "bg-raised text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            onClick={toggle}
            className="grid size-9 place-items-center rounded-full text-muted transition hover:bg-raised hover:text-fg"
            aria-label={light ? "Switch to dark theme" : "Switch to light theme"}
          >
            {light ? <Icon.Moon /> : <Icon.Sun />}
          </button>
          <a
            href={profile.resume}
            target="_blank"
            rel="noreferrer"
            className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-1.5 text-sm transition hover:bg-raised"
          >
            Resume <Icon.ArrowUpRight width={14} height={14} />
          </a>
        </div>
      </nav>
    </header>
  );
}
