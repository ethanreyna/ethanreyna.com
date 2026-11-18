import { useCallback, useEffect, useRef, useState } from "react";
import type { Shot } from "../data/content";
import { Icon } from "./ui";

const thumb = (src: string) => src.replace(/\.webp$/, ".thumb.webp");
const medium = (src: string) => src.replace(/\.webp$/, ".md.webp");

function BrowserFrame({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line-strong bg-raised shadow-2xl shadow-black/30">
      <div className="flex items-center gap-2 border-b border-line px-3.5 py-2.5" aria-hidden="true">
        <span className="size-2.5 shrink-0 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 shrink-0 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 shrink-0 rounded-full bg-[#28c840]" />
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

function Counter({ index, total, className }: { index: number; total: number; className: string }) {
  return (
    <span className={`mr-2 font-mono text-xs tabular-nums ${className}`}>
      {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
    </span>
  );
}

export function Gallery({ shots, label }: { shots: Shot[]; label: string }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const shot = shots[index];
  const many = shots.length > 1;

  const go = useCallback(
    (d: number) => setIndex((i) => (i + d + shots.length) % shots.length),
    [shots.length],
  );

  // Open/close the native dialog and stop the page scrolling behind it.
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open || !many) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, many, go]);

  // Warm the neighbours so arrowing through the lightbox doesn't stall.
  useEffect(() => {
    if (!open || !many) return;
    for (const d of [1, -1]) new Image().src = shots[(index + d + shots.length) % shots.length].src;
  }, [open, many, index, shots]);

  // Keep the active thumbnail visible without moving the page.
  useEffect(() => {
    const s = strip.current;
    const el = s?.children[index] as HTMLElement | undefined;
    if (!s || !el) return;
    const left = el.offsetLeft;
    const right = left + el.offsetWidth;
    if (left < s.scrollLeft || right > s.scrollLeft + s.clientWidth) {
      s.scrollTo({ left: left - (s.clientWidth - el.offsetWidth) / 2, behavior: "smooth" });
    }
  }, [index]);

  const closeOnBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setOpen(false);
  };

  return (
    <div>
      <BrowserFrame label={label}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative block w-full cursor-zoom-in bg-sunken focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-accent"
          aria-label={`Enlarge screenshot: ${shot.alt}`}
          aria-haspopup="dialog"
        >
          <div className="aspect-[15/8] overflow-hidden">
            <img
              src={shot.src}
              srcSet={`${medium(shot.src)} 1000w, ${shot.src} 2000w`}
              sizes="(min-width: 1152px) 640px, (min-width: 1024px) 56vw, 100vw"
              alt=""
              className={`size-full transition duration-500 group-hover:scale-[1.015] motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${
                shot.fit === "contain" ? "object-contain p-4" : "object-cover object-left-top"
              }`}
              loading="lazy"
              decoding="async"
            />
          </div>
          <span className="absolute right-3 bottom-3 grid size-8 place-items-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur transition group-hover:opacity-100 group-focus-visible:opacity-100">
            <Icon.Expand width={14} height={14} />
          </span>
        </button>
      </BrowserFrame>

      <p className="mt-3 min-h-10 text-sm text-pretty text-muted" aria-live="polite">
        {many && <Counter index={index} total={shots.length} className="text-faint" />}
        {shot.caption}
      </p>

      {many && (
        <div ref={strip} className="no-scrollbar relative -mx-1 mt-2 flex gap-2 overflow-x-auto p-1">
          {shots.map((s, i) => (
            <button
              type="button"
              key={s.src}
              onClick={() => setIndex(i)}
              aria-label={`Show screenshot ${i + 1} of ${shots.length}: ${s.alt}`}
              aria-current={i === index || undefined}
              className={`aspect-[15/8] w-20 shrink-0 overflow-hidden rounded-md border-2 bg-sunken transition focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent sm:w-24 ${
                i === index ? "border-accent" : "border-transparent opacity-50 hover:opacity-100"
              }`}
            >
              <img
                src={thumb(s.src)}
                alt=""
                className={`size-full ${s.fit === "contain" ? "object-contain" : "object-cover object-left-top"}`}
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      )}

      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        aria-label={`Screenshots: ${label}`}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden bg-transparent p-0 text-white"
      >
        {/* Only rendered while open, so closed lightboxes never download full-size images. */}
        {open && (
          <div
            className="flex h-full w-full flex-col items-center gap-4 p-4 sm:p-8"
            onClick={closeOnBackdrop}
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null || !many) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              touchX.current = null;
              if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            }}
          >
            <div className="flex min-h-0 w-full flex-1 items-center justify-center" onClick={closeOnBackdrop}>
              <img
                key={shot.src}
                src={shot.src}
                alt={shot.alt}
                className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
              />
            </div>
            <p className="max-w-2xl shrink-0 text-center text-sm text-pretty text-white/85">
              {many && <Counter index={index} total={shots.length} className="text-white/70" />}
              {shot.caption}
            </p>
            <div className="flex shrink-0 items-center gap-2">
              {many && (
                <button type="button" onClick={() => go(-1)} className="lightbox-btn" aria-label="Previous screenshot">
                  <Icon.ChevronLeft />
                </button>
              )}
              <button type="button" onClick={() => setOpen(false)} className="lightbox-btn" aria-label="Close">
                <Icon.X />
              </button>
              {many && (
                <button type="button" onClick={() => go(1)} className="lightbox-btn" aria-label="Next screenshot">
                  <Icon.ChevronRight />
                </button>
              )}
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
