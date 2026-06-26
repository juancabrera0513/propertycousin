import SoldPropertiesSection from "../components/SoldPropertiesSection";
import Seo from "../components/Seo";

function Listings() {
  return (
    <>
      <Seo
        title="Property Search"
        description="Search current MLS listings and recent real estate results across Jefferson County and the greater St. Louis area."
        path="/listings"
      />
      <SoldPropertiesSection />
    </>
  );
}

export default Listings;
