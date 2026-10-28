import { useRef, useState, type ReactElement } from "react";
import { useTranslation } from "react-i18next";
import type { CoachQualification } from "../CoachConfig.ts";

interface QualificationGalleryProps {
  items: CoachQualification[];
}

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

  return (
    <>
      <div className="grid grid-cols-2 gap-4 xs:grid-cols-3 xl:grid-cols-4">
        {items.map((item, index) => (
          <button
            key={item.image.src}
            type="button"
            onClick={() => openAt(index)}
            className="rounded-[18px] border border-line bg-bg-card p-3 text-left transition-opacity duration-200 hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            <span className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-[10px]">
              <img
                src={item.image.src}
                srcSet={item.image.srcSet}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain"
              />
            </span>
            {item.label && (
              <span className="mt-2 block text-[13px] text-ink-soft">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setActiveIndex(null)}
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            dialogRef.current?.close();
          }
        }}
        className="max-w-[90vw] rounded-[18px] border border-line bg-bg-card p-4 backdrop:bg-black/60"
      >
        {active && (
          <div className="flex flex-col items-center gap-3">
            <img
              src={active.image.src}
              srcSet={active.image.srcSet}
              alt={active.alt}
              className="max-h-[85vh] max-w-full object-contain"
            />
            {active.label && (
              <p className="text-[14px] text-ink-soft">{active.label}</p>
            )}
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="rounded-full border border-line px-4 py-1.5 text-sm text-ink transition-opacity duration-200 hover:opacity-85"
            >
              {t("about.closeImage")}
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
