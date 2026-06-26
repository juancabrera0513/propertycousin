import { testimonials } from "../data/testimonials";

function Testimonials() {
  return (
    <section className="section testimonials" id="testimonials">
      <div className="container">
        <div className="section-heading section-heading--center">
          <h2>Trusted by buyers and sellers.</h2>
        </div>

        <div className="testimonial-grid">
          {testimonials.map((testimonial, index) => (
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
      </div>
    </section>
  );
}

export default Testimonials;
