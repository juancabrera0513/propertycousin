import Hero from "../components/Hero";
import AboutPreview from "../components/AboutPreview";
import StatsSection from "../components/StatsSection";
import Testimonials from "../components/Testimonials";
import ContactSection from "../components/ContactSection";
import SoldPropertiesSection from "../components/SoldPropertiesSection";
import Seo from "../components/Seo";

function Home() {
  return (
    <>
      <Seo
        description="The Property Cousins help buyers and sellers across Jefferson County and greater St. Louis move with expert strategy and personal service."
        path="/"
      />
      <Hero />
      <AboutPreview />
      <StatsSection />
      <SoldPropertiesSection variant="compact" />
      <Testimonials />
      <ContactSection />
    </>
  );
}

export default Home;
