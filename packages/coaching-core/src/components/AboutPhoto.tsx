import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import ImagePlaceholder from "./ImagePlaceholder.tsx";
import type { CoachImage } from "../CoachConfig.ts";

interface AboutPhotoProps {
  image?: CoachImage;
  alt: string;
}

export default function AboutPhoto({
  image,
  alt,
}: AboutPhotoProps): ReactElement {
  const { t } = useTranslation();

  return (
    <div className="aspect-[4/5] overflow-hidden rounded-[18px] border border-line bg-bg-card">
      {image ? (
        <img
          src={image.src}
          srcSet={image.srcSet}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      ) : (
        <ImagePlaceholder
          caption={t("about.photoPlaceholder")}
          className="border-0"
        />
      )}
    </div>
  );
}
