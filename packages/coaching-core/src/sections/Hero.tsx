import type { ReactElement } from "react";
import { Trans, useTranslation } from "react-i18next";
import Section from "../components/Section.tsx";
import Container from "../components/Container.tsx";
import ArrowRightIcon from "../components/icons/ArrowRightIcon";
import { useCoachConfig } from "../CoachConfig.ts";

const topics = ["partnership", "communication", "parenting", "career"] as const;

export default function Hero(): ReactElement {
  const { t } = useTranslation();
  const { heroImage } = useCoachConfig();

  return (
    <Section
      id="bemutatkozas"
      className="pt-12 pb-14 xs:pt-16 xs:pb-20 xl:pt-[76px] xl:pb-24 2xl:pt-24 2xl:pb-[120px]"
    >
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.8fr]">
          <div>
            <h1 className="mb-5 text-[clamp(38px,5.4vw,60px)] leading-[1.06]">
              <Trans i18nKey="hero.headline" components={{ br: <br /> }} />
            </h1>
            <p className="mb-[34px] max-w-[40ch] text-[19px] text-ink-soft">
              {t("hero.role")}
            </p>
            <div className="mt-2 flex flex-wrap gap-x-2 gap-y-2.5">
              {topics.map((topic) => (
                <a
                  key={topic}
                  href={`#${topic}`}
                  className="group flex items-center gap-1 rounded-full border border-line bg-bg-card px-3 py-2 text-sm text-ink-soft no-underline transition-colors duration-200 hover:border-accent hover:text-accent"
                >
                  {t(`hero.topics.${topic}`)}
                  <ArrowRightIcon
                    size={12}
                    className="shrink-0 opacity-60 transition-opacity duration-200 group-hover:opacity-100"
                  />
                </a>
              ))}
            </div>
          </div>

          <img
            src={heroImage.src}
            srcSet={heroImage.srcSet}
            sizes="(min-width: 860px) 500px, 280px"
            alt=""
            aria-hidden="true"
            width={720}
            height={720}
            fetchPriority="high"
            decoding="async"
            className="order-first mx-auto w-full max-w-[280px] transition-[filter] duration-200 lg:order-none lg:max-w-none dark:[filter:invert(1)_hue-rotate(180deg)_brightness(1.15)_contrast(0.92)]"
          />
        </div>
      </Container>
    </Section>
  );
}
