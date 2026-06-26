import { Link } from "react-router-dom";
import teamPhoto from "../assets/images/property-cousins-team.webp";

function AboutPreview() {
  return (
    <section className="section about-preview">
      <div className="container about-preview__grid">
        <div className="about-preview__image" data-reveal="left">
          <div className="about-preview__photo-frame">
            <img
              src={teamPhoto}
              alt="The Property Cousins Real Estate Team"
              className="about-preview__photo"
            />
          </div>
        </div>

        <div className="about-preview__content" data-reveal="right">
          <h2>Real estate service built on trust, family, and results.</h2>

          <p>
            We are The Property Cousins, a relationship-first real estate team
            serving Jefferson County and the greater St. Louis area.
          </p>

          <p>
            Founded by first cousins Chris and Travis, we built this team on one
            simple belief: buying or selling a home shouldn’t feel overwhelming,
            it should feel clear, supported, and exciting.
          </p>

          <p>
            That’s why every client works directly with both of us. Two agents,
            two perspectives, and a level of communication and care that most
            people don’t expect in a real estate transaction.
          </p>

          <p>
            We specialize in helping first-time buyers, growing families, and
            determined sellers feel confident every step of the way, breaking
            things down, answering the questions most people are afraid to ask,
            and making the process actually make sense to our clients.
          </p>

          <p>
            Because at the end of the day, this isn’t just about real estate,
            it’s about helping you make one of the biggest decisions of your
            life, with a team you can truly trust.
          </p>

          <Link to="/about" className="btn btn-primary">
            Learn More About Us
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AboutPreview;
