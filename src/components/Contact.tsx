import { profile } from "../data/content";
import { ButtonLink, Icon, Reveal } from "./ui";

export default function Contact() {
  return (
    <>
    <section id="contact" className="relative isolate overflow-hidden border-t border-line">
      <div
        className="pointer-events-none absolute -bottom-48 left-1/2 -z-10 h-[420px] w-[760px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "var(--glow)" }}
      />
      <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6 sm:py-32">
        <Reveal>
          <p className="font-mono text-xs tracking-widest text-accent uppercase">Contact</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Want to talk?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-muted">
            I'm always happy to hear about frontend roles or interesting problems. Email is the best way to reach me.
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-8 inline-block font-mono text-lg text-fg underline decoration-line-strong underline-offset-8 transition hover:decoration-accent sm:text-2xl"
          >
            {profile.email}
          </a>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href={profile.linkedin} variant="ghost" external>
              <Icon.Linkedin width={16} height={16} /> LinkedIn
            </ButtonLink>
            <ButtonLink href={profile.github} variant="ghost" external>
              <Icon.Github width={16} height={16} /> GitHub
            </ButtonLink>
            <ButtonLink href={profile.resume} variant="ghost" external>
              <Icon.File width={16} height={16} /> Resume (PDF)
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-xs text-faint sm:px-6">
          <p>© {new Date().getFullYear()} {profile.name}</p>
          <p>Built with React, TypeScript, and Tailwind.</p>
        </div>
      </footer>
    </>
  );
}
