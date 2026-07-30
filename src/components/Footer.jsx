import { siteConfig } from "../config/site";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <h3>{siteConfig.shortName}</h3>
          <p>Real Estate Team · {siteConfig.brokerage}</p>
          <p className="footer__address">
            <a href={siteConfig.mapsUrl} rel="noreferrer" target="_blank">
              {siteConfig.location}
            </a>
          </p>
          <p className="footer__contact">
            <a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a>
            <span> / </span>
            <a href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
          </p>
        </div>
      </div>

      <div className="container footer__legal">
        <p>
          Listing information is provided for consumers&apos; personal,
          non-commercial use and is deemed reliable but not guaranteed. All
          properties are subject to prior sale, change, or withdrawal.
          Information should be independently verified. Real estate listing
          data displayed on this website comes in part from the Internet Data
          Exchange program of the MARIS MLS.
        </p>
        <p>
          The Property Cousins Real Estate Team is affiliated with{" "}
          {siteConfig.brokerage}. Equal Housing Opportunity.
        </p>
      </div>

      <div className="container footer__bottom">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
        <a
          href={siteConfig.siteCredit.url}
          rel="noreferrer"
          target="_blank"
        >
          Website by {siteConfig.siteCredit.name}
        </a>
      </div>
    </footer>
  );
}

export default Footer;
