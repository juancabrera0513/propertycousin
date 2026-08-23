import desktopHero from "../assets/images/award-property-cousins-brand-2025-2026.jpg";
import mobileHero from "../assets/images/award-best-real-estate-team-2025-2026.jpg";

function Hero() {
  return (
    <section className="hero">
      <picture className="hero__visual">
        <source media="(max-width: 768px)" srcSet={mobileHero} />
        <img
          className="hero__image"
          src={desktopHero}
          alt="The Property Cousins, voted Best Real Estate Team in Jefferson County for 2025 and 2026"
        />
      </picture>

      <div className="container hero__grid">
        <div className="hero__content">
          <h1>Real Estate Guidance You Can Feel Confident About.</h1>

          <p className="hero__text">
            Clear guidance, personal support, and two agents helping you move
            forward with confidence.
          </p>

          <div className="hero__actions">
            <a href="#contact-form" className="btn btn-primary">
              Schedule a Consultation
            </a>

            <a href="#listings" className="btn btn-secondary">
              Search Listings
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
