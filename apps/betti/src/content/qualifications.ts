import type { CoachQualification } from "@coaching/core";

// Each entry's `image` is unset until Betti's matching scanned certificate
// is prepped (resized, .webp, dropped into src/assets/qualifications/) and
// wired in here -- until then the gallery renders a placeholder card using
// just the alt/label below.
export const qualifications: CoachQualification[] = [
  {
    alt: "Szociálpedagógus diploma, Szegedi Tudományegyetem",
    label: "Szociálpedagógus diploma (SZTE)",
  },
  {
    alt: "Karriercoaching képzés tanúsítványa",
    label: "Karriercoaching képzés",
  },
  {
    alt: "Család és Párkapcsolati Coach képzés tanúsítványa",
    label: "Család és Párkapcsolati Coach képzés",
  },
  {
    alt: "Gordon kommunikációs tréning tanúsítványa",
    label: "Gordon kommunikációs tréning",
  },
];
