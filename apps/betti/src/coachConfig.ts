import type { CoachConfig } from "@coaching/core";
import { siteName } from "./content/site";
import { navLinks, contactLink } from "./content/navLinks";
import { services } from "./content/services";
import { freeCallMinutes, priceRows } from "./content/pricing";
import { communityCtaHref } from "./content/community";
import { qualifications } from "./content/qualifications";
import { memberships } from "./content/memberships";
import { contactInfo } from "./content/contact";
import brandLogo from "./assets/brand-logo.webp";
import heroArt from "./assets/hero-art.webp";
import heroArtSmall from "./assets/hero-art-560w.webp";
import communityArt from "./assets/community-art.webp";
import communityArtSmall from "./assets/community-art-520w.webp";
import aboutIntro from "./assets/about-intro.webp";
import aboutIntroSmall from "./assets/about-intro-480w.webp";
import aboutPath from "./assets/about-path.webp";
import aboutPathSmall from "./assets/about-path-480w.webp";
import aboutQualifications from "./assets/about-qualifications.webp";
import aboutQualificationsSmall from "./assets/about-qualifications-480w.webp";
import aboutMemberships from "./assets/about-memberships.webp";
import aboutMembershipsSmall from "./assets/about-memberships-480w.webp";

export const bettiConfig: CoachConfig = {
  siteName,
  logo: brandLogo,
  heroImage: {
    src: heroArt,
    srcSet: `${heroArtSmall} 560w, ${heroArt} 720w`,
  },
  communityImage: {
    src: communityArt,
    srcSet: `${communityArtSmall} 520w, ${communityArt} 700w`,
  },
  // "reflection" (Amit ma vallok) has no photo yet -- Betti's sending it
  // separately; the tab falls back to the placeholder until then.
  aboutImages: {
    intro: {
      src: aboutIntro,
      srcSet: `${aboutIntroSmall} 480w, ${aboutIntro} 720w`,
      focalY: 20,
    },
    path: {
      src: aboutPath,
      srcSet: `${aboutPathSmall} 480w, ${aboutPath} 720w`,
      focalY: 20,
    },
    qualifications: {
      src: aboutQualifications,
      srcSet: `${aboutQualificationsSmall} 480w, ${aboutQualifications} 720w`,
    },
    memberships: {
      src: aboutMemberships,
      srcSet: `${aboutMembershipsSmall} 480w, ${aboutMemberships} 720w`,
      focalY: 20,
    },
  },
  qualifications,
  memberships,
  navLinks,
  contactLink,
  services,
  pricing: { freeCallMinutes, priceRows },
  communityCtaHref,
  contact: contactInfo,
};
