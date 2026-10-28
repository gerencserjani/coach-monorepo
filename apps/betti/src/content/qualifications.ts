import type { CoachQualification } from "@coaching/core";
import karriercoachingImg from "../assets/qualifications/karriercoaching-kepzes.jpg";
import csaladEsParkapcsolatiImg from "../assets/qualifications/csalad-es-parkapcsolati-coach-kepzes.jpg";
import gordonTanusitvanyImg from "../assets/qualifications/gordon-tanusitvany.jpg";
import gordonOklevelImg from "../assets/qualifications/gordon-oklevel.jpg";

// `image` stays unset for a credential until the real scan exists -- the
// gallery renders a placeholder card from just the alt/label until then
// (currently just the SZTE diploma, not yet supplied).
export const qualifications: CoachQualification[] = [
  {
    alt: "Szociálpedagógus diploma, Szegedi Tudományegyetem",
    label: "Szociálpedagógus diploma (SZTE)",
  },
  {
    image: { src: karriercoachingImg },
    alt: "Karriercoaching képzés tanúsítványa",
    label: "Karriercoaching képzés",
    meta: "Coaching Centrum · 2024",
    pdfHref: "/qualifications/karriercoaching-kepzes.pdf",
  },
  {
    image: { src: csaladEsParkapcsolatiImg },
    alt: "Család és Párkapcsolati Coach képzés tanúsítványa",
    label: "Család és Párkapcsolati Coach képzés",
    meta: "Coaching & Love Academy · 2025",
    pdfHref: "/qualifications/csalad-es-parkapcsolati-coach-kepzes.pdf",
  },
  {
    image: { src: gordonTanusitvanyImg },
    alt: "Gordon kommunikációs tréning tanúsítványa",
    label: "Gordon kommunikációs tréning – Tanúsítvány",
    meta: "Gordon Kiadó Magyarország Kft. · 2024",
  },
  {
    image: { src: gordonOklevelImg },
    alt: "Gordon kommunikációs tréning oklevele",
    label: "Gordon kommunikációs tréning – Oklevél",
    meta: "Gordon Training International · 2024",
    pdfHref: "/qualifications/gordon-oklevel.pdf",
  },
];
