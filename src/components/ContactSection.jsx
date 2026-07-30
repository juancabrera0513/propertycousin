import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "../config/site";

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

function ContactSection() {
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setStatus("error");
      setFeedback(
        `Email delivery is being configured. Please email ${siteConfig.email} directly.`
      );
      return;
    }

    setStatus("sending");
    setFeedback("");

    try {
      const response = await fetch(EMAILJS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            from_name: formData.get("from_name"),
            reply_to: formData.get("reply_to"),
            phone: formData.get("phone"),
            message: formData.get("message"),
          },
        }),
      });

      if (!response.ok) throw new Error("EmailJS request failed");

      form.reset();
      setStatus("success");
      setFeedback("Thank you! Chris and Travis will be in touch soon.");
    } catch {
      setStatus("error");
      setFeedback(
        `We could not send your message. Please email ${siteConfig.email} directly.`
      );
    }
  };

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
              <a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a>
            </div>

            <div>
              <Mail size={20} />
              <a href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
            </div>

            <div>
              <MapPin size={20} />
              <a
                href={siteConfig.mapsUrl}
                rel="noreferrer"
                target="_blank"
              >
                {siteConfig.location}
              </a>
            </div>
          </div>
        </div>

        <form
          className="contact-form"
          data-reveal="right"
          onSubmit={handleSubmit}
        >
          <label>
            Full Name
            <input
              type="text"
              name="from_name"
              autoComplete="name"
              placeholder="Your name"
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="reply_to"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Phone
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              placeholder={siteConfig.phoneDisplay}
            />
          </label>

          <label>
            How can we help?
            <textarea
              name="message"
              placeholder="I am interested in buying, selling, or learning more..."
              required
            />
          </label>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending..." : "Send Message"}
          </button>

          <p
            className={`contact-form__status contact-form__status--${status}`}
            aria-live="polite"
          >
            {feedback}
          </p>
        </form>
      </div>
    </section>
  );
}

export default ContactSection;
