import { useEffect, useState } from "react";
import { testimonials } from "../data/testimonials";

const MOBILE_REVIEW_COUNT = 3;

function Testimonials() {
  const [isMobile, setIsMobile] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");

    const handleChange = () => {
      setIsMobile(mediaQuery.matches);
      if (!mediaQuery.matches) setShowAllReviews(false);
    };

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const visibleTestimonials =
    isMobile && !showAllReviews
      ? testimonials.slice(0, MOBILE_REVIEW_COUNT)
      : testimonials;

  const shouldShowToggle = isMobile && testimonials.length > MOBILE_REVIEW_COUNT;

  return (
    <section className="section testimonials" id="testimonials">
      <div className="container">
        <div className="section-heading section-heading--center">
          <h2>Trusted by buyers and sellers.</h2>
        </div>

        <div className="testimonial-grid">
          {visibleTestimonials.map((testimonial, index) => (
            <article
              className="testimonial-card"
              data-reveal="up"
              style={{ "--reveal-delay": `${index * 140}ms` }}
              key={testimonial.name + testimonial.text}
            >
              <p>“{testimonial.text}”</p>
              <h4>{testimonial.name}</h4>
            </article>
          ))}
        </div>

        {shouldShowToggle ? (
          <div className="testimonial-actions">
            <button
              type="button"
              className="btn btn-secondary"
              aria-expanded={showAllReviews}
              onClick={() => setShowAllReviews((current) => !current)}
            >
              {showAllReviews ? "Show Less" : "View More Reviews"}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default Testimonials;
