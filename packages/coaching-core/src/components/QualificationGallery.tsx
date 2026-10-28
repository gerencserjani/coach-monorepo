import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
} from "react";
import { useTranslation } from "react-i18next";
import ImagePlaceholder from "./ImagePlaceholder.tsx";
import type { CoachQualification } from "../CoachConfig.ts";

interface QualificationGalleryProps {
  items: CoachQualification[];
}

const FADE = 36;

export default function QualificationGallery({
  items,
}: QualificationGalleryProps): ReactElement {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex !== null ? items[activeIndex] : undefined;

  const openAt = (index: number) => {
    setActiveIndex(index);
    dialogRef.current?.showModal();
  };

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    // Start centered on the middle card rather than scrolled all the way
    // left -- at any viewport width this means a neighbor peeks in on both
    // sides symmetrically, instead of only ever being cropped on the right.
    const middleCard = el.children[Math.floor(items.length / 2)];
    if (middleCard instanceof HTMLElement) {
      el.scrollLeft = Math.max(
        0,
        middleCard.offsetLeft - (el.clientWidth - middleCard.offsetWidth) / 2,
      );
    }

    const update = () => {
      setCanScrollPrev(el.scrollLeft > 4);
      setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items.length]);

  const scrollByPage = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const maskStops = [
    canScrollPrev ? "transparent" : "black",
    canScrollPrev ? `black ${FADE}px` : null,
    canScrollNext ? `black calc(100% - ${FADE}px)` : null,
    canScrollNext ? "transparent" : "black",
  ].filter(Boolean);
  const maskStyle: CSSProperties =
    canScrollPrev || canScrollNext
      ? {
          maskImage: `linear-gradient(to right, ${maskStops.join(", ")})`,
          WebkitMaskImage: `linear-gradient(to right, ${maskStops.join(", ")})`,
        }
      : {};

  return (
    <>
      <div className="relative">
        <div
          ref={scrollerRef}
          data-testid="qualification-scroller"
          style={maskStyle}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item, index) => (
            <button
              key={item.alt}
              type="button"
              onClick={() => openAt(index)}
              className="w-[150px] shrink-0 snap-center rounded-[18px] border border-line bg-bg-card p-3 text-left transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_10px_24px_var(--shadow)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent xs:w-[180px] sm:w-[200px]"
            >
              <span className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-[10px]">
                {item.image ? (
                  <img
                    src={item.image.src}
                    srcSet={item.image.srcSet}
                    alt={item.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <ImagePlaceholder
                    caption={t("about.qualificationPlaceholder")}
                  />
                )}
              </span>
              {item.label && (
                <span className="mt-2 block text-[13px] text-ink-soft">
                  {item.label}
                </span>
              )}
              {item.meta && (
                <span className="block text-[12px] text-accent-soft">
                  {item.meta}
                </span>
              )}
            </button>
          ))}
        </div>

        {canScrollPrev && (
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            aria-label={t("about.scrollPrev")}
            className="absolute left-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-bg-card/90 text-ink-soft shadow-[0_2px_10px_var(--shadow)] backdrop-blur transition-opacity duration-200 hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m15 6-6 6 6 6" />
            </svg>
          </button>
        )}
        {canScrollNext && (
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            aria-label={t("about.scrollNext")}
            className="absolute right-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-bg-card/90 text-ink-soft shadow-[0_2px_10px_var(--shadow)] backdrop-blur transition-opacity duration-200 hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m9 6 6 6-6 6" />
            </svg>
          </button>
        )}
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setActiveIndex(null)}
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            dialogRef.current?.close();
          }
        }}
        className="fixed inset-0 m-auto max-h-[90vh] max-w-[90vw] overflow-y-auto rounded-[18px] border border-line bg-bg-card p-4 opacity-100 scale-100 transition-[opacity,scale,overlay,display] duration-200 [transition-behavior:allow-discrete] starting:opacity-0 starting:scale-95 backdrop:bg-black/60 backdrop:transition-colors backdrop:duration-200 backdrop:[transition-behavior:allow-discrete] starting:backdrop:bg-black/0"
      >
        {active && (
          <div className="flex flex-col items-center gap-3">
            {active.image ? (
              <img
                src={active.image.src}
                srcSet={active.image.srcSet}
                alt={active.alt}
                className="max-h-[85vh] max-w-full object-contain"
              />
            ) : (
              <ImagePlaceholder
                caption={t("about.qualificationPlaceholder")}
                className="aspect-[3/4] w-[220px]"
              />
            )}
            {active.label && (
              <p className="text-[14px] text-ink-soft">{active.label}</p>
            )}
            {active.meta && (
              <p className="text-[13px] text-accent-soft">{active.meta}</p>
            )}
            <div className="flex gap-3">
              {active.pdfHref && (
                <a
                  href={active.pdfHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-line px-4 py-1.5 text-sm text-ink transition-opacity duration-200 hover:opacity-85"
                >
                  {t("about.openPdf")}
                </a>
              )}
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="rounded-full border border-line px-4 py-1.5 text-sm text-ink transition-opacity duration-200 hover:opacity-85"
              >
                {t("about.closeImage")}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
