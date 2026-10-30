import { useEffect, useState, type ReactElement } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import Container from "./Container.tsx";
import ThemeToggle from "./ThemeToggle.tsx";
import HamburgerIcon from "./icons/HamburgerIcon";
import { useActiveSection } from "../hooks/useActiveSection";
import { useCoachConfig } from "../CoachConfig.ts";

const desktopLinkClasses =
  "relative pb-[3px] no-underline transition-colors duration-200 hover:text-accent after:absolute after:inset-x-0 after:-bottom-px after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300";

const mobileLinkClasses =
  "border-b border-line py-3.5 text-base text-ink no-underline last:border-b-0";

export default function Header(): ReactElement {
  const { t } = useTranslation();
  const { siteName, logo, navLinks, contactLink } = useCoachConfig();
  const allLinks = [...navLinks, contactLink];
  const sectionIds = allLinks.map((link) => link.id);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeId = useActiveSection(sectionIds);

  const closeMenu = () => setMenuOpen(false);

  // Body scroll lock + Escape-to-close while the mobile panel is open --
  // skipped on desktop widths (xl:hidden), where menuOpen can't be true
  // via the button, but a stray true value should never lock desktop
  // scrolling either way.
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/88 backdrop-blur-[10px]">
      <Container className="relative z-50 flex h-[76px] items-center justify-between">
        <a
          href={`#${navLinks[0]?.id}`}
          className="flex items-center no-underline"
        >
          <img
            src={logo}
            alt={siteName}
            width={160}
            height={160}
            className="h-[52px] w-auto transition-[filter] duration-200 dark:[filter:invert(1)_hue-rotate(180deg)_brightness(1.15)_contrast(0.92)]"
          />
        </a>

        <nav className="hidden items-center gap-9 text-[15px] text-ink-soft xl:flex">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={[
                desktopLinkClasses,
                activeId === link.id ? "text-accent after:scale-x-100" : "",
              ].join(" ")}
            >
              {t(link.labelKey)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3.5">
          <a
            href={`#${contactLink.id}`}
            className="hidden whitespace-nowrap rounded-full border border-ink px-5 py-2.5 text-sm no-underline transition-colors duration-200 hover:bg-ink hover:text-bg xl:inline-block"
          >
            {t(contactLink.labelKey)}
          </a>
          {/* LanguageSwitcher intentionally not rendered -- language
              switching stays fully functional (see LanguageSwitcher.tsx,
              i18n/index.ts), just not surfaced in the UI for now. */}
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={t(
              menuOpen ? "common.menuToggle.close" : "common.menuToggle.open",
            )}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-bg-card p-0 text-ink xl:hidden"
          >
            <HamburgerIcon open={menuOpen} size={18} />
          </button>
        </div>
      </Container>

      {/* Portaled to <body>: the header's own backdrop-blur makes it a
          containing block for `fixed` descendants (a CSS filter/
          backdrop-filter side effect), which would shrink these to the
          header's own box instead of the viewport if left nested inside
          it. */}
      {createPortal(
        <>
          {/* Backdrop: dims the page below the header and click-closes,
              instead of the panel pushing the page content down when it
              opens. */}
          <div
            onClick={closeMenu}
            aria-hidden="true"
            className={[
              "fixed inset-x-0 bottom-0 top-[76px] z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 xl:hidden",
              menuOpen ? "opacity-100" : "pointer-events-none opacity-0",
            ].join(" ")}
          />

          {/* Grid-rows accordion: animates to the content's natural height
              without measuring it in JS. The nav stays mounted at all
              times so the height transition (and the backdrop above) can
              run instead of an instant mount/unmount.

              A grid-template-rows 0fr/1fr transition would be the
              no-JS-measurement way to do this, but it only resolves to a
              real 0 when the grid container's own height is otherwise
              definite -- this one is `fixed` with no explicit height, so
              the browser falls back to sizing the "0fr" track by its
              content's min-content instead, leaving a ~30px sliver of
              the nav links visible even while "closed". max-height with
              a generous cap avoids that circular sizing problem; 80vh
              also keeps the panel from exceeding most of the viewport on
              short phones, with overflow-y-auto as a fallback if a
              future coach's longer nav ever needs to scroll within it. */}
          <div
            className={[
              "fixed inset-x-0 top-[76px] z-40 overflow-hidden bg-bg transition-[max-height] duration-300 ease-out xl:hidden",
              menuOpen ? "max-h-[80vh]" : "max-h-0",
            ].join(" ")}
          >
            <nav
              id="mobile-nav"
              className="flex max-h-[80vh] flex-col overflow-y-auto border-b border-line px-6 pt-2 pb-6"
            >
              {allLinks.map((link, index) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={closeMenu}
                  style={{
                    transitionDelay: menuOpen ? `${index * 40}ms` : "0ms",
                  }}
                  className={[
                    mobileLinkClasses,
                    "transition-[opacity,transform] duration-300 ease-out",
                    activeId === link.id ? "border-accent" : "",
                    menuOpen
                      ? "translate-y-0 opacity-100"
                      : "-translate-y-1.5 opacity-0",
                  ].join(" ")}
                >
                  {t(link.labelKey)}
                </a>
              ))}
            </nav>
          </div>
        </>,
        document.body,
      )}
    </header>
  );
}
