function Hero() {
  return (
    <section className="hero">
      <div className="container hero__grid">
        <div className="hero__content">
          <h1>Real Estate Guidance That Helps You Feel Confident.</h1>

          <p className="hero__text">
            The Property Cousins are here to make the process feel clear,
            organized, and a lot less overwhelming — helping you understand each
            step, feel taken care of, and move forward with confidence.
          </p>

          <div className="hero__actions">
            <a href="#contact" className="btn btn-primary">
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
