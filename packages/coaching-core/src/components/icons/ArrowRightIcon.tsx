import type { ReactElement } from "react";
import type { IconProps } from "./types";

export default function ArrowRightIcon({
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
      <path d="M4.5 12h15" />
      <path d="M13 6.5 19 12l-6 5.5" />
    </svg>
  );
}
