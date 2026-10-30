import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useCoachConfig } from "../CoachConfig.ts";
import WhatsAppIcon from "./icons/WhatsAppIcon";

// Deliberately uses WhatsApp's own brand green, not the site's accent color
// -- a floating contact button relies on instant, cross-site recognizability
// more than palette consistency.
export default function WhatsAppFab(): ReactElement | null {
  const { t } = useTranslation();
  const { contact } = useCoachConfig();

  if (!contact.whatsappUrl) return null;

  return (
    <a
      href={contact.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("contact.whatsappFab")}
      className="fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white no-underline shadow-[0_8px_24px_rgba(0,0,0,0.28)] transition-transform duration-200 hover:scale-105 xs:right-6 xs:bottom-6"
    >
      <WhatsAppIcon size={28} />
    </a>
  );
}
