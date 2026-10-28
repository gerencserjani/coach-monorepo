import type { ReactElement } from "react";
import ImageIcon from "./icons/ImageIcon.tsx";

interface ImagePlaceholderProps {
  caption?: string;
  className?: string;
}

export default function ImagePlaceholder({
  caption,
  className,
}: ImagePlaceholderProps): ReactElement {
  return (
    <div
      className={[
        "flex h-full w-full flex-col items-center justify-center gap-2 rounded-[10px] border border-dashed border-line bg-bg-panel p-3 text-center text-ink-soft",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <ImageIcon size={28} className="text-accent-soft" />
      {caption && <span className="text-[12px] italic">{caption}</span>}
    </div>
  );
}
