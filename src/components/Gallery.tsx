import { useCallback, useEffect, useRef, useState } from "react";
import type { Shot } from "../data/content";
import { Icon } from "./ui";

function BrowserFrame({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line-strong bg-raised shadow-2xl shadow-black/30">
      <div className="flex items-center gap-2 border-b border-line px-3.5 py-2.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        {label && (
          <span className="ml-3 truncate rounded-md bg-sunken px-3 py-0.5 font-mono text-[11px] text-faint">
            {label}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

export function Gallery({ shots, label }: { shots: Shot[]; label: string }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const shot = shots[index];

  const go = useCallback(
    (d: number) => setIndex((i) => (i + d + shots.length) % shots.length),
    [shots.length],
  );

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  return (
    <div>
      <BrowserFrame label={label}>
        <button
          onClick={() => setOpen(true)}
          className="group relative block w-full cursor-zoom-in bg-sunken"
          aria-label={`Enlarge: ${shot.alt}`}
        >
          <div className="aspect-[15/8] overflow-hidden">
            <img
              src={shot.src}
              alt={shot.alt}
              className={`size-full transition duration-500 group-hover:scale-[1.015] ${
                shot.fit === "contain" ? "object-contain p-4" : "object-cover object-left-top"
              }`}
              loading="lazy"
              decoding="async"
            />
          </div>
          <span className="absolute right-3 bottom-3 grid size-8 place-items-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
            <Icon.Expand width={14} height={14} />
          </span>
        </button>
      </BrowserFrame>

      <p className="mt-3 min-h-10 text-sm text-pretty text-muted" aria-live="polite">
        <span className="mr-2 font-mono text-xs text-faint">
          {String(index + 1).padStart(2, "0")}/{String(shots.length).padStart(2, "0")}
        </span>
        {shot.caption}
      </p>

      {shots.length > 1 && (
        <div className="no-scrollbar -mx-1 mt-2 flex gap-2 overflow-x-auto px-1 pb-1">
          {shots.map((s, i) => (
            <button
              key={s.src}
              onClick={() => setIndex(i)}
              aria-label={`Show screenshot ${i + 1}: ${s.alt}`}
              aria-current={i === index}
              className={`aspect-[15/8] w-20 shrink-0 overflow-hidden rounded-md border-2 bg-sunken transition sm:w-24 ${
                i === index ? "border-accent" : "border-transparent opacity-50 hover:opacity-100"
              }`}
            >
              <img
                src={s.src.replace(/\.webp$/, ".thumb.webp")}
                alt=""
                className={`size-full ${s.fit === "contain" ? "object-contain" : "object-cover object-left-top"}`}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        className="m-auto max-h-none max-w-none bg-transparent p-0 text-white backdrop:bg-black/80"
      >
        <div className="flex h-dvh w-screen flex-col items-center justify-center gap-4 p-4 sm:p-10" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <img src={shot.src} alt={shot.alt} className="max-h-[80dvh] max-w-full rounded-lg object-contain shadow-2xl" />
          <p className="max-w-2xl text-center text-sm text-white/80">{shot.caption}</p>
          <div className="flex items-center gap-2">
            {shots.length > 1 && (
              <button onClick={() => go(-1)} className="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Previous screenshot">
                <Icon.ChevronLeft />
              </button>
            )}
            <button onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Close">
              <Icon.X />
            </button>
            {shots.length > 1 && (
              <button onClick={() => go(1)} className="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Next screenshot">
                <Icon.ChevronRight />
              </button>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
}
