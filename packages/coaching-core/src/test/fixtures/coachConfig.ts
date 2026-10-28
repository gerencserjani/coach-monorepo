import type { CoachConfig } from "../../CoachConfig.ts";

// A representative CoachConfig for tests that render components reading
// useCoachConfig() -- not any real coach's actual data, just enough shape
// for assertions that care about behavior, not brand specifics.
export const testCoachConfig: CoachConfig = {
  siteName: "Teszt Coach",
  logo: "/test-logo.webp",
  heroImage: { src: "/test-hero.webp" },
  communityImage: { src: "/test-community.webp" },
  qualifications: [
    {
      image: { src: "/test-qualification.webp" },
      alt: "Test qualification certificate",
      label: "Test Qualification",
      meta: "Test Issuer · 2024",
      pdfHref: "/test-qualification.pdf",
    },
    {
      alt: "Test qualification without an image yet",
      label: "Pending Qualification",
    },
  ],
  navLinks: [
    { id: "bemutatkozas", labelKey: "common.nav.introduction" },
    { id: "rolam", labelKey: "common.nav.about" },
    { id: "segitseg", labelKey: "common.nav.help" },
    { id: "kozosseg", labelKey: "common.nav.community" },
    { id: "arak", labelKey: "common.nav.prices" },
    { id: "idopontfoglalas", labelKey: "common.nav.booking" },
  ],
  contactLink: { id: "kapcsolat", labelKey: "common.nav.contact" },
  services: [
    {
      id: "partnership",
      keyPrefix: "services.items.partnership",
      hasChips: false,
    },
    {
      id: "communication",
      keyPrefix: "services.items.communication",
      hasChips: true,
    },
    { id: "parenting", keyPrefix: "services.items.parenting", hasChips: true },
  ],
  pricing: {
    freeCallMinutes: 30,
    priceRows: [
      { minutes: 60, priceHuf: 10000 },
      { minutes: 90, priceHuf: 15000 },
    ],
  },
  communityCtaHref: "https://example.com/community",
  contact: {
    address: "1111 Teszt, Teszt utca 1.",
    street: "Teszt utca 1.",
    mapsUrl: "https://maps.example.com",
    phoneDisplay: "+36 1 234 5678",
    phoneHref: "tel:+3612345678",
    email: "info@test.example",
  },
};
