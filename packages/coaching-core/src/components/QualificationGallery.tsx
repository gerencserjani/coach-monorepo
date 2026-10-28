import { useEffect, useRef, useState, type ReactElement } from "react";
import { useTranslation } from "react-i18next";
import useEmblaCarousel from "embla-carousel-react";
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

  // Embla owns the actual drag/scroll mechanics (mouse, touch, and the
  // click-vs-drag disambiguation that's genuinely fiddly to get right by
  // hand -- a plain overflow-x-auto strip doesn't support mouse-drag at
  // all, so a click-and-drag attempt just registers as a click and opens
  // the wrong card). align: "center" + startIndex centers the middle
  // credential on first render.
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    startIndex: Math.floor(items.length / 2),
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;
    const update = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    update();
    emblaApi.on("select", update).on("reInit", update);
    return () => {
      emblaApi.off("select", update).off("reInit", update);
    };
  }, [emblaApi]);

  useEffect(() => {
    emblaApi?.reInit();
  }, [emblaApi, items.length]);

  const maskStops = [
    canScrollPrev ? "transparent" : "black",
    canScrollPrev ? `black ${FADE}px` : null,
    canScrollNext ? `black calc(100% - ${FADE}px)` : null,
    canScrollNext ? "transparent" : "black",
  ].filter(Boolean);
  const maskImage =
    canScrollPrev || canScrollNext
      ? `linear-gradient(to right, ${maskStops.join(", ")})`
      : undefined;

  return (
    <>
      <div className="relative">
        <div
          ref={emblaRef}
          style={{ maskImage, WebkitMaskImage: maskImage }}
          className="cursor-grab overflow-hidden active:cursor-grabbing"
        >
          <div className="flex gap-4 py-1">
            {items.map((item, index) => (
              <button
                key={item.alt}
                type="button"
                onClick={() => openAt(index)}
                className="w-[150px] shrink-0 rounded-[18px] border border-line bg-bg-card p-3 text-left transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_10px_24px_var(--shadow)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent xs:w-[180px] sm:w-[200px]"
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
        </div>

        {(canScrollPrev || canScrollNext) && (
          <>
            {/* Per the WAI-ARIA carousel pattern: prev/next stay mounted and
                in the tab order always, toggling aria-disabled at the ends,
                rather than being removed -- removing a focused/just-clicked
                button can drop focus in some browsers and exposes whatever
                sits underneath it to an accidental click right away. */}
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              aria-disabled={!canScrollPrev}
              aria-label={t("about.scrollPrev")}
              className="absolute left-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-bg-card/90 text-ink-soft shadow-[0_2px_10px_var(--shadow)] backdrop-blur transition-opacity duration-200 hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent aria-disabled:cursor-default aria-disabled:opacity-30 aria-disabled:hover:opacity-30"
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
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              aria-disabled={!canScrollNext}
              aria-label={t("about.scrollNext")}
              className="absolute right-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-bg-card/90 text-ink-soft shadow-[0_2px_10px_var(--shadow)] backdrop-blur transition-opacity duration-200 hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent aria-disabled:cursor-default aria-disabled:opacity-30 aria-disabled:hover:opacity-30"
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
          </>
        )}
      </div>

      <dialog
        ref={dialogRef}
        // Deliberately NOT clearing activeIndex here: the dialog keeps
        // animating closed (opacity/scale transition, ~200ms) for a moment
        // after close() is called, and React re-renders synchronously with
        // that call. Nulling activeIndex on close emptied {active && ...}
        // immediately, so what was actually fading out was an empty,
        // padding-only rounded box (nearly circular at that tiny size, and
        // bg-bg-card is close enough to the page bg to read as "the same
        // color") sitting center-screen for the rest of the transition --
        // not the certificate. Leaving the last item's content in place
        // until the next openAt() call means the real image fades out
        // instead.
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            dialogRef.current?.close();
          }
        }}
        className="fixed inset-0 m-auto max-h-[90vh] max-w-[90vw] overflow-hidden rounded-[18px] border border-line bg-bg-card p-4 opacity-100 scale-100 transition-[opacity,scale,overlay,display] duration-200 [transition-behavior:allow-discrete] starting:opacity-0 starting:scale-95 backdrop:bg-black/60 backdrop:transition-colors backdrop:duration-200 backdrop:[transition-behavior:allow-discrete] starting:backdrop:bg-black/0"
      >
        {active && (
          <div className="flex flex-col items-center gap-3">
            {/* The image's cap leaves room for the label/meta/button row
                below it (measured ~145px tall with every row present,
                even with a deliberately long, wrapped label -- 190px is a
                safe reserve on top of that) rather than capping the image
                at a flat vh value: that way the whole dialog, image plus
                chrome, never exceeds the dialog's own max-h-[90vh], at
                any viewport height, without ever needing to scroll inside
                it. (A flex-grow region here would need the dialog itself
                to have a real stretched height to grow into, which it
                deliberately doesn't -- it shrink-wraps small content like
                the placeholder -- so calc() is the robust, not-fighting-
                flexbox way to reserve that space.) */}
            {active.image ? (
              <img
                src={active.image.src}
                srcSet={active.image.srcSet}
                alt={active.alt}
                className="max-h-[calc(90vh-190px)] max-w-full object-contain"
              />
            ) : (
              <ImagePlaceholder
                caption={t("about.qualificationPlaceholder")}
                className="aspect-[3/4] w-[220px]"
              />
            )}
            {active.label && (
              <p className="shrink-0 text-[14px] text-ink-soft">
                {active.label}
              </p>
            )}
            {active.meta && (
              <p className="shrink-0 text-[13px] text-accent-soft">
                {active.meta}
              </p>
            )}
            <div className="flex shrink-0 gap-3">
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
