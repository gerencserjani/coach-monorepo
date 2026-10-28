import type { NavLink } from "@coaching/core";

export const navLinks: NavLink[] = [
  { id: "bemutatkozas", labelKey: "common.nav.introduction" },
  { id: "rolam", labelKey: "common.nav.about" },
  { id: "segitseg", labelKey: "common.nav.help" },
  { id: "kozosseg", labelKey: "common.nav.community" },
  { id: "arak", labelKey: "common.nav.prices" },
  { id: "idopontfoglalas", labelKey: "common.nav.booking" },
];

export const contactLink: NavLink = {
  id: "kapcsolat",
  labelKey: "common.nav.contact",
};
