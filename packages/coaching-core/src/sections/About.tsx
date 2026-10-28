import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import Section from "../components/Section.tsx";
import Container from "../components/Container.tsx";
import AboutPhoto from "../components/AboutPhoto.tsx";
import AccordionItem from "../components/AccordionItem.tsx";
import QualificationGallery from "../components/QualificationGallery.tsx";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import { useCoachConfig } from "../CoachConfig.ts";

export default function About(): ReactElement {
  const { t } = useTranslation();
  const { qualifications, aboutImage } = useCoachConfig();
  const { ref, className } = useRevealOnScroll<HTMLDivElement>();

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

          <AccordionItem title={t("about.introHeading")} defaultOpen>
            <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
              <div className="space-y-5 text-[17px] text-ink-soft">
                <p>{t("about.introParagraph1")}</p>
                <p>{t("about.introParagraph2")}</p>
              </div>
              <AboutPhoto
                image={aboutImage}
                alt={t("about.photoAlt")}
                className="lg:aspect-auto lg:h-full"
              />
            </div>
          </AccordionItem>

          <blockquote className="serif my-6 max-w-[620px] border-l-4 border-accent-soft pl-6 text-[clamp(19px,2.4vw,24px)] leading-[1.5] text-ink italic">
            {t("about.pullQuote")}
          </blockquote>

          <AccordionItem title={t("about.pathHeading")}>
            <p className="max-w-[680px] text-[17px] text-ink-soft">
              {t("about.pathParagraph")}
            </p>
          </AccordionItem>

          <AccordionItem title={t("about.reflectionHeading")}>
            <div className="max-w-[680px] space-y-5 text-[17px] text-ink-soft">
              <p>{t("about.reflectionParagraph1")}</p>
              <p>{t("about.reflectionParagraph2")}</p>
            </div>
          </AccordionItem>
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
