import { skills } from "../data/content";
import { Reveal, Section } from "./ui";

export default function Skills() {
  return (
    <div className="border-t border-line">
      <Section id="skills" eyebrow="toolbox" title="stuff i know how to use">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {skills.map((g, i) => (
            <Reveal key={g.group} delay={i * 80} className="bg-bg p-6">
              <h3 className="font-mono text-xs tracking-widest text-faint uppercase">{g.group}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <li key={s} className="rounded-lg border border-line bg-raised px-3 py-1.5 text-sm">
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Section>
    </div>
  );
}
