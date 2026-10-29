import { useState, type ReactElement, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import Section from "../components/Section.tsx";
import Container from "../components/Container.tsx";
import AboutPhoto from "../components/AboutPhoto.tsx";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import { useCoachConfig } from "../CoachConfig.ts";

interface Tab {
  label: string;
  content: ReactNode;
}

export default function About(): ReactElement {
  const { t } = useTranslation();
  const { qualifications, aboutImage } = useCoachConfig();
  const { ref, className } = useRevealOnScroll<HTMLDivElement>();
  const [active, setActive] = useState(0);

  const tabs: Tab[] = [
    {
      label: t("about.introHeading"),
      content: (
        <>
          <p>{t("about.introParagraph1")}</p>
          <p>{t("about.introParagraph2")}</p>
        </>
      ),
    },
    {
      label: t("about.pathHeading"),
      content: <p>{t("about.pathParagraph")}</p>,
    },
    {
      label: t("about.reflectionHeading"),
      content: (
        <>
          <p>{t("about.reflectionParagraph1")}</p>
          <p>{t("about.reflectionParagraph2")}</p>
        </>
      ),
    },
  ];

  if (qualifications.length > 0) {
    tabs.push({
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

  const activeTab = tabs[Math.min(active, tabs.length - 1)];

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
              <div className="brand-scrollbar mb-6 flex gap-6 overflow-x-auto overflow-y-hidden border-b border-line">
                {tabs.map((tab, index) => (
                  <button
                    key={tab.label}
                    type="button"
                    aria-current={index === active ? "true" : undefined}
                    onClick={() => setActive(index)}
                    className={[
                      "serif -mb-px shrink-0 whitespace-nowrap border-b-2 pb-3 text-[18px] transition-colors duration-200",
                      index === active
                        ? "border-accent font-medium text-ink"
                        : "border-transparent text-ink-soft hover:text-ink",
                    ].join(" ")}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="space-y-5 text-justify text-[17px] text-ink-soft">
                {activeTab.content}
              </div>
            </div>
            <AboutPhoto image={aboutImage} alt={t("about.photoAlt")} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
