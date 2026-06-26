import { Mail, MapPin, Phone } from "lucide-react";

function ContactSection() {
  return (
    <section className="section contact-section" id="contact">
      <div className="container contact-section__grid">
        <div className="contact-section__content" data-reveal="left">
          <h2>Ready to buy, sell, or talk strategy?</h2>

          <p>
            Reach out to The Property Cousins Real Estate Team and let us know
            how we can help with your next move.
          </p>

          <div className="contact-list">
            <div>
              <Phone size={20} />
              <a href="tel:+13143025767">(314) 302-5767</a>
            </div>

            <div>
              <Mail size={20} />
              <a href="mailto:propertycousinsstl@gmail.com">
                propertycousinsstl@gmail.com
              </a>
            </div>

            <div>
              <MapPin size={20} />
              <span>Jefferson County, Missouri</span>
            </div>
          </div>
        </div>

        <form className="contact-form" data-reveal="right">
          <label>
            Full Name
            <input type="text" placeholder="Your name" />
          </label>

          <label>
            Email
            <input type="email" placeholder="you@example.com" />
          </label>

          <label>
            Phone
            <input type="tel" placeholder="(314) 302-5767" />
          </label>

          <label>
            How can we help?
            <textarea placeholder="I am interested in buying, selling, or learning more..." />
          </label>

          <button type="submit" className="btn btn-primary">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}

export default ContactSection;
