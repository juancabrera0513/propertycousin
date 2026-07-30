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
        fullTitle="The Property Cousins | Jefferson County Real Estate"
        description="Work with The Property Cousins, an award-winning dual-agent real estate team helping buyers and sellers across Jefferson County and Greater St. Louis."
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
