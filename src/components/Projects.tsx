import { projects } from "../data/content";
import { Icon, Reveal, Section, Tag } from "./ui";

export default function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Side projects"
      title="Things I build on my own time"
      intro="Full-stack apps I designed, built, and run on Cloudflare Workers and D1. Each one exists because I, or a group I'm in, needed it."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((p, i) => {
          const href = p.url ?? p.repo;
          const Card = href ? "a" : "div";
          return (
            <Reveal key={p.name} delay={(i % 2) * 80} className="h-full">
              <Card
                {...(href ? { href, target: "_blank", rel: "noreferrer" } : {})}
                className={`group flex h-full flex-col rounded-2xl border border-line bg-raised p-6 transition ${
                  href ? "hover:-translate-y-0.5 hover:border-line-strong" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    <p className="text-sm text-muted">{p.tagline}</p>
                  </div>
                  {href ? (
                    <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-muted transition group-hover:border-accent group-hover:bg-accent group-hover:text-accent-fg">
                      <Icon.ArrowUpRight width={15} height={15} />
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-faint uppercase">
                      Private
                    </span>
                  )}
                </div>
                <p className="mt-4 flex-1 text-sm text-pretty text-muted">{p.description}</p>
                {p.url && (
                  <p className="mt-4 font-mono text-xs text-accent">{p.url.replace(/^https?:\/\//, "")}</p>
                )}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </div>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
