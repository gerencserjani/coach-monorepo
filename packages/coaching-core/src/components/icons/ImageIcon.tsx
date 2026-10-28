import type { ReactElement } from "react";
import type { IconProps } from "./types";

export default function ImageIcon({
  size = 20,
  ...props
}: IconProps): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <circle cx="8.5" cy="10" r="1.6" />
      <path d="m4 17.5 5.2-5.2a1.8 1.8 0 0 1 2.5 0l1.8 1.8" />
      <path d="m12.5 16 2.8-2.8a1.8 1.8 0 0 1 2.5 0L20.5 16" />
    </svg>
  );
}
