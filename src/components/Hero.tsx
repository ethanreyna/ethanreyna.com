import { profile, stats } from "../data/content";
import { ButtonLink, Icon, Reveal } from "./ui";

export default function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0 -z-10" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "var(--glow)" }}
      />
      <div className="mx-auto max-w-6xl px-4 pt-36 pb-8 sm:px-6 sm:pt-44 sm:pb-10">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-raised/60 px-3 py-1 text-xs text-muted">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            {profile.currently}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-6 max-w-4xl text-5xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-7xl">
            {profile.greeting}
            <span className="block text-muted">{profile.headline}</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6 max-w-2xl text-lg text-pretty text-muted">{profile.intro}</p>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="#work">
              See my work <Icon.ArrowRight width={16} height={16} />
            </ButtonLink>
            <ButtonLink href={`mailto:${profile.email}`} variant="ghost">
              <Icon.Mail width={16} height={16} /> Email me
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <dl className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col bg-bg p-5 sm:p-6">
                <dt className="mt-1.5 text-sm text-pretty text-muted">{s.label}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight sm:text-4xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
