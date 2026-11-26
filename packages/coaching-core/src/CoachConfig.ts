import { createContext, useContext } from "react";

export interface NavLink {
  id: string;
  labelKey: string;
}

export interface Service {
  id: string;
  keyPrefix: string;
  hasChips: boolean;
}

export interface PriceRow {
  minutes: number;
  priceHuf: number;
}

export interface CoachImage {
  src: string;
  srcSet?: string;
  // Vertical object-position anchor (0 = top, 50 = center, 100 = bottom)
  // for a box that crops this image to a different aspect ratio via
  // object-fit: cover. Only meaningful there -- most images aren't
  // cropped at all. Defaults to center (50) when omitted.
  focalY?: number;
}

export interface CoachQualification {
  label: string;
  /** Short issuer/date line shown under the label, e.g. "Gordon Training International · 2024". */
  meta?: string;
}

/**
 * One portrait photo per About-section subheading tab (see About.tsx's
 * hardcoded tab list) -- each tab swaps in its own photo instead of the
 * section showing one static image throughout. A tab with no entry here
 * falls back to the placeholder, so a coach can fill these in gradually.
 */
export interface CoachAboutImages {
  intro?: CoachImage;
  path?: CoachImage;
  reflection?: CoachImage;
  qualifications?: CoachImage;
  memberships?: CoachImage;
}

export interface CoachMembership {
  name: string;
  url: string;
  logo: CoachImage;
  /** Neutral mounting background the logo needs to stay legible -- most
   * association logos are a single fixed color (often white-on-transparent),
   * so a theme-reactive chip would make them vanish in one mode. */
  logoBg: "light" | "dark";
}

export interface CoachContactInfo {
  address: string;
  street: string;
  mapsUrl: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  // Absent while the coach hasn't set up a WhatsApp number -- the Contact
  // section omits the row entirely rather than showing a dead link.
  whatsappUrl?: string;
}

/**
 * Everything a coach's own `apps/<coach>` app supplies to the shared
 * components in this package -- brand identity, images, nav structure, and
 * the structured (non-string) content each section needs. Short marketing
 * *strings* are deliberately NOT here: those stay in i18next (each app's own
 * locale JSON), consumed via `useTranslation()` directly inside the shared
 * components, with the i18n keys themselves as the stable contract. This
 * config exists for everything i18n doesn't fit -- images, structural data,
 * IDs -- see the architecture plan this was split out from for why.
 */
export interface CoachConfig {
  siteName: string;
  logo: string;
  heroImage: CoachImage;
  communityImage: CoachImage;
  // Per-tab photos for the About section -- see CoachAboutImages. Absent
  // entries (or an absent object entirely) render a placeholder instead.
  aboutImages?: CoachAboutImages;
  qualifications: CoachQualification[];
  memberships: CoachMembership[];
  navLinks: NavLink[];
  contactLink: NavLink;
  services: Service[];
  pricing: { freeCallMinutes: number; priceRows: PriceRow[] };
  communityCtaHref?: string;
  contact: CoachContactInfo;
}

export const CoachConfigContext = createContext<CoachConfig | null>(null);

export function useCoachConfig(): CoachConfig {
  const config = useContext(CoachConfigContext);
  if (!config) {
    throw new Error(
      "useCoachConfig() was called outside a <CoachConfigProvider> -- every app using @coaching/core must wrap its root in one.",
    );
  }
  return config;
}
