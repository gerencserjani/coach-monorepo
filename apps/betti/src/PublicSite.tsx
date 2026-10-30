import { useTranslation } from "react-i18next";
import {
  Header,
  Hero,
  QuoteBlock,
  About,
  Services,
  Community,
  Pricing,
  Booking,
  Contact,
  Footer,
  WhatsAppFab,
} from "@coaching/core";

export default function PublicSite() {
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <QuoteBlock
          quote={t("quoteBlock.quote")}
          leadIn={t("quoteBlock.leadIn")}
        />
        <About />
        <Services />
        <Community />
        <Pricing />
        <Booking />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
