import { useEffect, useState } from "react";
import { profile } from "../data/content";
import { Icon } from "./ui";

const links = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

const THEME_COLOR = { light: "#f7f7f9", dark: "#09090b" };

function storedTheme() {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
}

/**
 * The initial class is set by /theme.js before first paint. The site follows the OS
 * setting until the visitor picks a theme; only an explicit toggle is saved.
 */
function useTheme() {
  const [light, setLight] = useState(() => document.documentElement.classList.contains("light"));

  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", light ? THEME_COLOR.light : THEME_COLOR.dark);
  }, [light]);

  useEffect(() => {
    const mq = matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      if (!storedTheme()) setLight(mq.matches);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next = !light;
    try {
      localStorage.setItem("theme", next ? "light" : "dark");
    } catch {
      /* storage unavailable: the choice just won't persist */
    }
    setLight(next);
  };

  return [light, toggle] as const;
}

/** Tracks scroll state: whether the page has moved, and which nav section is in view. */
function useScrollSpy() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 8);
      const doc = document.documentElement;
      const atBottom = window.innerHeight + window.scrollY >= doc.scrollHeight - 4;
      let current = "";
      if (atBottom && window.scrollY > 0) {
        current = links[links.length - 1].href;
      } else {
        for (const l of links) {
          const el = document.querySelector(l.href);
          if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) current = l.href;
        }
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return { scrolled, active };
}

export default function Nav() {
  const [light, toggle] = useTheme();
  const { scrolled, active } = useScrollSpy();

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300 ${
        scrolled ? "border-line bg-bg/80 backdrop-blur-lg" : "border-transparent"
      }`}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5 rounded-lg font-medium">
          <span
            aria-hidden="true"
            className="grid size-8 place-items-center rounded-lg bg-accent font-mono text-sm font-bold text-accent-fg"
          >
            er
          </span>
          <span className="sr-only sm:not-sr-only">{profile.name}</span>
        </a>
        <div className="flex items-center gap-1">
          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-current={active === l.href ? "location" : undefined}
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
            type="button"
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
            <span className="sr-only">(PDF, opens in a new tab)</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
