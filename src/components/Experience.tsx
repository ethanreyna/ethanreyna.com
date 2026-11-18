import { education, experience } from "../data/content";
import { Reveal, Section } from "./ui";

export default function Experience() {
  return (
    <div className="border-y border-line bg-sunken/50">
      <Section id="experience" eyebrow="Experience" title="Where I've worked">
        <ol className="relative space-y-12 border-l border-line pl-6 sm:pl-10">
          {experience.map((job, i) => (
            <li key={job.company} className="relative">
              <Reveal delay={i * 60}>
                <span
                  className={`absolute -left-[29px] sm:-left-[45px] mt-2 size-2.5 rounded-full ring-4 ring-bg ${
                    i === 0 ? "bg-accent" : "bg-line-strong"
                  }`}
                />
                <div className="grid gap-4 sm:grid-cols-12">
                  <div className="sm:col-span-4">
                    <h3 className="text-lg font-semibold">{job.company}</h3>
                    <p className="text-sm text-muted">{job.role}</p>
                    <p className="mt-1 font-mono text-xs text-faint">{job.period}</p>
                  </div>
                  <ul className="space-y-2 text-sm text-muted sm:col-span-8">
                    {job.points.map((p) => (
                      <li key={p} className="flex gap-3">
                        <span className="mt-[9px] h-px w-3 shrink-0 bg-line-strong" />
                        <span className="text-pretty">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </li>
          ))}
          <li className="relative">
            <Reveal>
              <span className="absolute -left-[29px] sm:-left-[45px] mt-2 size-2.5 rounded-full bg-line-strong ring-4 ring-bg" />
              <div className="grid gap-4 sm:grid-cols-12">
                <div className="sm:col-span-4">
                  <h3 className="text-lg font-semibold">{education.school}</h3>
                  <p className="text-sm text-muted">{education.degree}</p>
                  <p className="mt-1 font-mono text-xs text-faint">{education.year}</p>
                </div>
              </div>
            </Reveal>
          </li>
        </ol>
      </Section>
    </div>
  );
}
