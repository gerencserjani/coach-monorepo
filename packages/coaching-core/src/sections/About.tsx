import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import Section from "../components/Section.tsx";
import Container from "../components/Container.tsx";
import QualificationGallery from "../components/QualificationGallery.tsx";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import { useCoachConfig } from "../CoachConfig.ts";

export default function About(): ReactElement {
  const { t } = useTranslation();
  const { qualifications } = useCoachConfig();
  const { ref, className } = useRevealOnScroll<HTMLDivElement>();

  const paragraphs = [
    t("about.paragraph1"),
    t("about.paragraph2"),
    t("about.paragraph3"),
    t("about.paragraph4"),
    t("about.paragraph5"),
  ];

  return (
    <Section id="rolam" className="py-14 xs:py-20 xl:py-[92px] 2xl:py-[120px]">
      <Container>
        <div ref={ref} className={["max-w-[680px]", className].join(" ")}>
          <p className="serif mb-[18px] text-[15px] text-accent italic">
            {t("about.kicker")}
          </p>
          <h2 className="mb-6 text-[clamp(28px,3.6vw,40px)] leading-[1.2]">
            {t("about.heading")}
          </h2>
          <div className="space-y-5 text-[17px] text-ink-soft">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        {qualifications.length > 0 && (
          <div className="mt-12 xs:mt-16">
            <h3 className="serif mb-6 text-[22px]">
              {t("about.qualificationsHeading")}
            </h3>
            <QualificationGallery items={qualifications} />
          </div>
        )}
      </Container>
    </Section>
  );
}
