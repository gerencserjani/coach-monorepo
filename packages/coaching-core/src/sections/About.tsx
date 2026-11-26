import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import Section from "../components/Section.tsx";
import Container from "../components/Container.tsx";
import AboutPhoto from "../components/AboutPhoto.tsx";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import { useCoachConfig, type CoachAboutImages } from "../CoachConfig.ts";

interface Tab {
  key: keyof CoachAboutImages;
  label: string;
  content: ReactNode;
}

export default function About(): ReactElement {
  const { t } = useTranslation();
  const { qualifications, memberships, aboutImages } = useCoachConfig();
  const { ref, className } = useRevealOnScroll<HTMLDivElement>();
  const [active, setActive] = useState(0);
  const tabRowRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
  } | null>(null);

  const tabs: Tab[] = [
    {
      key: "intro",
      label: t("about.introHeading"),
      content: <p>{t("about.introParagraph1")}</p>,
    },
    {
      key: "path",
      label: t("about.pathHeading"),
      content: <p>{t("about.pathParagraph")}</p>,
    },
    {
      key: "reflection",
      label: t("about.reflectionHeading"),
      content: (
        <>
          <p>{t("about.reflectionParagraph1")}</p>
          <p>{t("about.reflectionParagraph2")}</p>
          <p>{t("about.reflectionParagraph3")}</p>
        </>
      ),
    },
  ];

  if (qualifications.length > 0) {
    tabs.push({
      key: "qualifications",
      label: t("about.qualificationsHeading"),
      content: (
        <ul className="space-y-4">
          {qualifications.map((qualification) => (
            <li key={qualification.label}>
              <p className="text-ink">{qualification.label}</p>
              {qualification.meta && (
                <p className="text-[15px] text-ink-soft/70">
                  {qualification.meta}
                </p>
              )}
            </li>
          ))}
        </ul>
      ),
    });
  }

  if (memberships.length > 0) {
    tabs.push({
      key: "memberships",
      label: t("about.membershipsHeading"),
      content: (
        <div className="flex flex-wrap gap-4">
          {memberships.map((membership) => (
            <a
              key={membership.name}
              href={membership.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-[152px] flex-col items-center gap-3 rounded-[18px] border border-line bg-bg-card p-5 text-center no-underline transition-colors duration-200 hover:border-accent"
            >
              <span
                className={[
                  "flex h-16 w-16 shrink-0 items-center justify-center rounded-full p-2.5",
                  membership.logoBg === "dark" ? "bg-[#14110d]" : "bg-white",
                ].join(" ")}
              >
                <img
                  src={membership.logo.src}
                  alt=""
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="serif text-[13.5px] leading-snug text-ink group-hover:text-accent">
                {membership.name}
              </span>
            </a>
          ))}
        </div>
      ),
    });
  }

  const activeIndex = Math.min(active, tabs.length - 1);
  const activeTab = tabs[activeIndex];

  // Measures the active tab button so the sliding underline below it can be
  // positioned with plain left/width (no per-button border -- a single
  // shared indicator looks like one element moving, rather than two borders
  // crossfading). Re-measures on resize too: the row can reflow (font load,
  // viewport width, locale changing label lengths).
  useLayoutEffect(() => {
    const measure = () => {
      const node = tabRefs.current[activeIndex];
      const row = tabRowRef.current;
      if (!node || !row) return;
      // offsetLeft/offsetWidth are rounded to whole pixels, but the row's
      // own clientWidth can land on a sub-pixel value -- left + width can
      // then land 1px past it, which is enough for overflow-x: auto to
      // decide there's horizontal overflow and show a scrollbar that
      // shouldn't be there. Clamping the right edge to the row's own
      // measured width keeps the indicator from ever being the cause.
      const left = node.offsetLeft;
      const width = Math.max(
        0,
        Math.min(node.offsetWidth, row.clientWidth - left),
      );
      setIndicator({ left, width });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeIndex, tabs.length]);

  return (
    <Section id="rolam" className="py-14 xs:py-20 xl:py-[92px] 2xl:py-[120px]">
      <Container>
        <div ref={ref} className={className}>
          <p className="serif mb-[18px] text-[15px] text-accent italic">
            {t("about.kicker")}
          </p>
          <h2 className="mb-10 max-w-[680px] text-[clamp(28px,3.6vw,40px)] leading-[1.2]">
            {t("about.heading")}
          </h2>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div className="flex flex-col">
              <div
                ref={tabRowRef}
                className="brand-scrollbar relative mb-6 flex gap-6 overflow-x-auto overflow-y-hidden border-b border-line"
              >
                {tabs.map((tab, index) => (
                  <button
                    key={tab.label}
                    ref={(node) => {
                      tabRefs.current[index] = node;
                    }}
                    type="button"
                    aria-current={index === active ? "true" : undefined}
                    onClick={() => setActive(index)}
                    className={[
                      "serif shrink-0 whitespace-nowrap pb-3 text-[18px] transition-colors duration-200",
                      index === active
                        ? "font-medium text-ink"
                        : "text-ink-soft hover:text-ink",
                    ].join(" ")}
                  >
                    {tab.label}
                  </button>
                ))}
                {/* One shared indicator sliding between tab positions reads
                    as a single element moving, instead of two borders
                    crossfading -- lives inside the scrollable row itself
                    (not a sibling of it) so it scrolls along with the
                    buttons on narrow viewports where the row overflows. */}
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 h-0.5 bg-accent transition-[left,width] duration-300 ease-out motion-reduce:transition-none"
                  style={{
                    left: indicator?.left ?? 0,
                    width: indicator?.width ?? 0,
                    opacity: indicator ? 1 : 0,
                  }}
                />
              </div>
              <div
                key={activeTab.key}
                className="about-tab-fade space-y-5 text-justify text-[17px] text-ink-soft"
              >
                {activeTab.content}
              </div>
            </div>
            <AboutPhoto
              key={activeTab.key}
              // Below `lg` the grid collapses to one column, so the photo
              // would otherwise stretch to the full content width -- on a
              // tablet-width single column (e.g. ~820px) that's a huge,
              // disproportionate portrait. Capped and centered until the
              // two-column layout kicks in and sizes it by its own 0.9fr
              // track instead.
              className="about-photo-fade mx-auto max-w-[420px] lg:mx-0 lg:max-w-none"
              image={aboutImages?.[activeTab.key]}
              alt={t("about.photoAlt")}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
