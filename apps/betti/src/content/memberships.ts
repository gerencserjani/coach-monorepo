import type { CoachMembership } from "@coaching/core";
import icfHungaryLogo from "../assets/memberships/icf-hungary-logo.png";
import icfGlobalLogo from "../assets/memberships/icf-global-logo-white.svg";
import szegediCoachLogo from "../assets/memberships/szegedi-coach-kozosseg-logo.webp";

export const memberships: CoachMembership[] = [
  {
    name: "International Coaching Federation",
    url: "https://coachingfederation.org/",
    logo: { src: icfGlobalLogo },
    logoBg: "dark",
  },
  {
    name: "ICF Magyar Tagozat",
    url: "https://coachingfederation.hu/tagjaink/367/",
    logo: { src: icfHungaryLogo },
    logoBg: "dark",
  },
  {
    name: "Szegedi Coach Közösség",
    url: "https://www.facebook.com/profile.php?id=61551994830843",
    logo: { src: szegediCoachLogo },
    logoBg: "light",
  },
];
