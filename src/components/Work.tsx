import { caseStudies, type CaseStudy, type Feature } from "../data/content";
import { Gallery } from "./Gallery";
import { Icon, Reveal, Section, Tag } from "./ui";

function Points({ points, accent }: { points: string[]; accent: string }) {
  return (
    <ul className="space-y-2.5">
      {points.map((p) => (
        <li key={p} className="flex gap-3 text-sm">
          <span className="mt-2 size-1.5 shrink-0 rounded-full" style={{ background: accent }} />
          <span className="text-pretty">{p}</span>
        </li>
      ))}
    </ul>
  );
}

/** A feature with screenshots: copy on one side, gallery on the other. */
function FeatureBlock({ feature, study, flip }: { feature: Feature; study: CaseStudy; flip: boolean }) {
  return (
    <Reveal className="grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
      <div className={`lg:col-span-5 lg:pt-4 ${flip ? "lg:order-2" : ""}`}>
        <h4 className="text-xl font-semibold tracking-tight sm:text-2xl">{feature.title}</h4>
        <p className="mt-3 text-pretty text-muted">{feature.summary}</p>
        <div className="mt-5">
          <Points points={feature.points} accent={study.accent} />
        </div>
        <div className="mt-6 flex flex-wrap gap-1.5">
          {feature.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      </div>
      <div className={`min-w-0 lg:col-span-7 ${flip ? "lg:order-1" : ""}`}>
        <Gallery shots={feature.shots} label={`${study.company.toLowerCase()} · ${feature.title.toLowerCase()}`} />
      </div>
    </Reveal>
  );
}

/** A feature without screenshots yet: a compact card. */
function FeatureCard({ feature, study, index }: { feature: Feature; study: CaseStudy; index: number }) {
  return (
    <Reveal delay={(index % 2) * 80} className="h-full">
      <div className="flex h-full flex-col rounded-2xl border border-line bg-raised/50 p-6">
        <p className="font-mono text-xs" style={{ color: study.accent }}>
          {String(index + 1).padStart(2, "0")}
        </p>
        <h4 className="mt-2 text-lg font-semibold tracking-tight">{feature.title}</h4>
        <p className="mt-2 text-sm text-pretty text-muted">{feature.summary}</p>
        <div className="mt-5 flex-1">
          <Points points={feature.points} accent={study.accent} />
        </div>
        <div className="mt-6 flex flex-wrap gap-1.5">
          {feature.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function Study({ study }: { study: CaseStudy }) {
  const withShots = study.features.filter((f) => f.shots.length);
  const withoutShots = study.features.filter((f) => !f.shots.length);
  return (
    <article id={study.id} className="scroll-mt-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl border border-line bg-raised p-6 sm:p-8">
          <div
            className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full opacity-20 blur-3xl"
            style={{ background: study.accent }}
          />
          <div className="relative flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {study.company}
              <span className="text-muted"> / {study.product}</span>
            </h3>
            <p className="font-mono text-xs text-muted">
              {study.role} · {study.period}
            </p>
          </div>
          <p className="relative mt-4 max-w-3xl text-pretty text-muted">{study.blurb}</p>
          {withShots.length === 0 && (
            <p className="relative mt-5 inline-flex items-center gap-2 rounded-full border border-line-strong px-3 py-1 text-xs text-faint">
              <Icon.Image width={13} height={13} /> screenshots coming soon, probably
            </p>
          )}
        </div>
      </Reveal>

      {withShots.length > 0 && (
        <div className="mt-14 space-y-20 sm:mt-16 sm:space-y-24">
          {withShots.map((f, i) => (
            <FeatureBlock key={f.title} feature={f} study={study} flip={i % 2 === 1} />
          ))}
        </div>
      )}

      {withoutShots.length > 0 && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {withoutShots.map((f, i) => (
            <FeatureCard key={f.title} feature={f} study={study} index={i} />
          ))}
        </div>
      )}
    </article>
  );
}

export default function Work() {
  return (
    <Section
      id="work"
      eyebrow="work"
      title="stuff i built that real people use"
      intro="Most of this lives behind a login, so here's the screenshot tour. Other people's names are blurred bc privacy :P"
    >
      <div className="space-y-28 sm:space-y-36">
        {caseStudies.map((s) => (
          <Study key={s.id} study={s} />
        ))}
      </div>
    </Section>
  );
}
