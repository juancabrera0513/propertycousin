import SoldPropertiesSection from "../components/SoldPropertiesSection";
import Seo from "../components/Seo";

function Listings() {
  return (
    <>
      <Seo
        fullTitle="Homes for Sale in Jefferson County | The Property Cousins"
        description="Search homes for sale across Jefferson County and Greater St. Louis with local guidance from The Property Cousins Real Estate Team."
        path="/listings"
      />
      <SoldPropertiesSection />
    </>
  );
}

export default Listings;
