import type { ReactElement } from "react";

interface HamburgerIconProps {
  open: boolean;
  size?: number;
}

// Not one of the hand-drawn stroke icons in this folder -- this one morphs
// between hamburger and X based on `open`, so each bar is its own line with
// its own transform rather than a single static path.
export default function HamburgerIcon({
  open,
  size = 20,
}: HamburgerIconProps): ReactElement {
  const lineClasses =
    "[transform-box:fill-box] origin-center transition-transform duration-300 ease-out";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <line
        x1="3"
        y1="6"
        x2="21"
        y2="6"
        className={[
          lineClasses,
          open ? "translate-y-[6px] rotate-45" : "",
        ].join(" ")}
      />
      <line
        x1="3"
        y1="12"
        x2="21"
        y2="12"
        className={[
          "transition-opacity duration-200 ease-out",
          open ? "opacity-0" : "opacity-100",
        ].join(" ")}
      />
      <line
        x1="3"
        y1="18"
        x2="21"
        y2="18"
        className={[
          lineClasses,
          open ? "-translate-y-[6px] -rotate-45" : "",
        ].join(" ")}
      />
    </svg>
  );
}
