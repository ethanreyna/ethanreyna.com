import { useEffect, useRef, type ReactNode, type SVGProps } from "react";

/** Fades children in once they scroll into view. */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <Reveal>
        <p className="font-mono text-xs tracking-widest text-accent uppercase">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
        {intro && <p className="mt-4 max-w-2xl text-pretty text-muted">{intro}</p>}
      </Reveal>
      <div className="mt-12">{children}</div>
    </section>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-sunken px-2.5 py-0.5 font-mono text-[11px] text-muted">
      {children}
    </span>
  );
}

type IconProps = SVGProps<SVGSVGElement>;
const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const Icon = {
  ArrowUpRight: (p: IconProps) => (
    <svg {...base} {...p}><path d="M7 17 17 7M8 7h9v9" /></svg>
  ),
  ArrowRight: (p: IconProps) => (
    <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  ),
  Mail: (p: IconProps) => (
    <svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
  ),
  File: (p: IconProps) => (
    <svg {...base} {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></svg>
  ),
  Github: (p: IconProps) => (
    <svg {...base} {...p}><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" /></svg>
  ),
  Linkedin: (p: IconProps) => (
    <svg {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" /></svg>
  ),
  Sun: (p: IconProps) => (
    <svg {...base} {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
  ),
  Moon: (p: IconProps) => (
    <svg {...base} {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
  ),
  X: (p: IconProps) => (
    <svg {...base} {...p}><path d="M18 6 6 18M6 6l12 12" /></svg>
  ),
  ChevronLeft: (p: IconProps) => (
    <svg {...base} {...p}><path d="m15 18-6-6 6-6" /></svg>
  ),
  ChevronRight: (p: IconProps) => (
    <svg {...base} {...p}><path d="m9 18 6-6-6-6" /></svg>
  ),
  Expand: (p: IconProps) => (
    <svg {...base} {...p}><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
  ),
  Image: (p: IconProps) => (
    <svg {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-5-5L5 21" /></svg>
  ),
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  external,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
}) {
  const styles =
    variant === "primary"
      ? "border border-transparent bg-accent text-accent-fg hover:brightness-110"
      : "border border-line-strong text-fg hover:border-fg/40 hover:bg-raised";
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${styles}`}
    >
      {children}
      {external && <span className="sr-only">(opens in a new tab)</span>}
    </a>
  );
}
