import "./About.css";

import teamPhoto from "../assets/images/property-cousins-team.webp";
import chrisPhoto from "../assets/images/chris-abling.webp";
import travisPhoto from "../assets/images/travis-greer.webp";
import Seo from "../components/Seo";

function About() {
  return (
    <div className="about-page">
      <Seo
        title="About Us"
        description="Meet Chris Abling and Travis Greer, the cousins behind a relationship-first real estate team serving Jefferson County and greater St. Louis."
        path="/about"
      />
      <section className="about-hero section">
        <div className="container about-hero__grid">
          <div className="about-hero__content" data-reveal="left">
            <h1 className="about-page__title">
              The Property Cousins Real Estate Team
            </h1>

            <div className="about-page__copy">
              <p>
                The Property Cousins Real Estate Team was built on something
                deeper than real estate — it was built on family.
              </p>

              <p>
                Chris and Travis aren’t just business partners — they’re first
                cousins and lifelong best friends who have been building things
                together since they were kids. From selling homemade snacks
                door-to-door to launching an entertainment business 9 months
                before a global pandemic...entrepreneurship has always been part
                of who they are at their core.
              </p>

              <p>
                Real estate came into the picture in 2023, when both were ready
                for something more — something meaningful, something they could
                build together long-term. What started as a simple career change
                quickly turned into a life-long vision.
              </p>

              <p>
                On October 1, 2024, The Property Cousins were officially born.
              </p>
            </div>
          </div>

          <div className="about-hero__media" data-reveal="right">
            <div className="about-page__photo about-page__photo--large">
              <img
                src={teamPhoto}
                alt="Chris Abling and Travis Greer of The Property Cousins Real Estate Team"
                className="about-page__img"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="about-story section">
        <div className="container">
          <div className="about-story__card" data-reveal="up">
            <div className="about-page__copy about-story__copy">
              <p>
                But from day one, the goal was never to be just another real
                estate team.
              </p>

              <p>
                Chris and Trav built this business by valuing relationships over
                transactions — choosing to slow things down, focus on their
                people, and create an experience that feels personal,
                transparent, and genuinely supportive from start to finish.
              </p>

              <p>
                One of the biggest things that sets us apart is our dual-agent
                model. Every client works with both of us — not passed off, not
                filtered through the systems of a traditional "team". That means
                better communication, more availability, and two people fully
                invested in your success every step of the way.
              </p>

              <p>We also believe education changes everything.</p>

              <p>
                That’s why we host free monthly homebuyer workshops and create
                content designed to make homeownership feel possible —
                especially for those who might feel overwhelmed or unsure where
                to start. Our goal is simple: to turn confusion into clarity and
                give people the confidence to move forward when the time is
                right.
              </p>

              <p>
                In our first year, we helped 16 families close on homes and
                surpassed $4 million in sales — far beyond what we originally
                set out to do. Along the way, we were honored to be named Best
                Real Estate Team in Jefferson County and recognized with
                multiple local awards, but what matters most to us is the trust
                our clients continue to place in us.
              </p>

              <p>
                Everything we do is guided by our core values: Education That
                Empowers, Accessible Homeownership, Story Driven, Community
                Leadership, and Gratitude. We would absolutely be thrilled to
                share more about what these values mean to us specifically, and
                how they show up repeatedly in our daily lives.
              </p>

              <p>This isn’t just a transaction to us.</p>

              <p>
                It’s your life, your future, and your next chapter — and we’re
                here to walk through it with you, every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-team section">
        <div className="container">
          <div className="about-team__header">
            <h2>Meet Chris and Travis</h2>
          </div>

          <div className="about-team__grid">
            <article className="about-team__card">
              <div className="about-team__image-wrap" data-reveal="left">
                <div className="about-page__photo">
                  <img
                    src={chrisPhoto}
                    alt="Chris Abling"
                    className="about-page__img"
                  />
                </div>
              </div>

              <div className="about-team__content" data-reveal="right">
                <h2>Chris Abling</h2>

                <div className="about-page__copy">
                  <p>
                    Chris is someone who has always valued relationships with
                    others — and that shows up in everything he does. He brings
                    a calm, steady presence to both life and real estate, often
                    being the one who keeps things organized, on track, and
                    running smoothly behind the scenes.
                  </p>

                  <p>
                    Outside of real estate, Chris enjoys living a simple life.
                    Time with family and close friends is what matters most to
                    him - whether that’s relaxing, catching up, or just being
                    with the people he cares about most. If he is looking to
                    unwind, you can find Chris with a fishing pole in his hand,
                    or researching his next hobby. He is a self-proclaimed
                    "serial hobbyist," and LOVES to try new things. He’s not one
                    for chaos — he values consistency, good conversations, and
                    meaningful connections.
                  </p>

                  <p>
                    That same mindset carries into how he works with clients.
                    Chris takes pride in being someone people can rely on —
                    making sure no detail gets missed, keeping things
                    level-headed when situations get stressful, and helping
                    clients feel genuinely taken care of from start to finish.
                  </p>
                </div>
              </div>
            </article>

            <article className="about-team__card about-team__card--reverse">
              <div className="about-team__image-wrap" data-reveal="right">
                <div className="about-page__photo">
                  <img
                    src={travisPhoto}
                    alt="Travis Greer"
                    className="about-page__img"
                  />
                </div>
              </div>

              <div className="about-team__content" data-reveal="left">
                <h2>Travis Greer</h2>

                <div className="about-page__copy">
                  <p>
                    Travis brings the energy, creativity, and forward-thinking
                    mindset behind The Property Cousins. With a strong
                    background in marketing and entrepreneurship, he’s always
                    looking for ways to improve the experience, simplify the
                    process, and help clients feel more confident every step of
                    the way.
                  </p>

                  <p>
                    Outside of real estate, Travis is all about new experiences.
                    He enjoys traveling, being outdoors, staying active, and
                    finding ways to break up his routine. He very much values
                    time with his friends, family, and pets. He’s also big on
                    personal growth — constantly pushing himself, trying new
                    things, and taking on challenges that help him grow both
                    personally and professionally.
                  </p>

                  <p>
                    That mindset directly translates into how he approaches real
                    estate. Travis focuses heavily on communication, education,
                    and making sure clients truly understand what’s happening
                    throughout the process. He has a strong passion for helping
                    first-time buyers, especially those who feel overwhelmed at
                    the start, and turning that uncertainty into confidence.
                  </p>

                  <p>
                    He also leads much of the team’s marketing, content, and
                    community presence — helping people feel connected and
                    informed long before they ever make a move.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
