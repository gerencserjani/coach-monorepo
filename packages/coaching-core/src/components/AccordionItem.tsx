import { useId, useState, type ReactElement, type ReactNode } from "react";
import ChevronDownIcon from "./icons/ChevronDownIcon.tsx";

interface AccordionItemProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export default function AccordionItem({
  title,
  defaultOpen = false,
  children,
}: AccordionItemProps): ReactElement {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className="border-t border-line pt-5 pb-5">
      <h3 className="serif text-[20px]">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          {title}
          <ChevronDownIcon
            size={18}
            className={[
              "shrink-0 text-ink-soft transition-transform duration-200",
              open ? "rotate-180" : "",
            ].join(" ")}
          />
        </button>
      </h3>
      <div
        id={panelId}
        className={[
          "grid transition-[grid-template-rows] duration-300 ease-in-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        ].join(" ")}
      >
        <div className="overflow-hidden">
          <div className="pt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
