import type { ReactElement } from "react";
import type { IconProps } from "./types";

export default function WhatsAppIcon({
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
      <path d="M7 20.3 4 21l.75-3.1a8.5 8.5 0 1 1 2.25 2.4Z" />
      <path d="M8.7 8.9c.2-.5.5-.5.7-.5h.4c.15 0 .3.05.4.3l.7 1.6c.1.2.05.4-.05.55l-.5.6c-.1.15-.1.3 0 .5.3.6.85 1.25 1.4 1.65.6.45 1.15.65 1.4.75.2.1.35.05.5-.05l.55-.55c.15-.15.35-.2.55-.1l1.5.75c.2.1.3.25.3.4 0 .2-.05.65-.3 1-.3.4-.95.7-1.5.7-.65 0-1.9-.25-3.2-1.35-1.5-1.25-2.35-2.7-2.5-2.95-.15-.25-.5-.95-.5-1.6 0-.6.2-1.05.3-1.2Z" />
    </svg>
  );
}
