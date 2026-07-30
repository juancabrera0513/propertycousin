import { useEffect } from "react";
import { getAbsoluteSiteUrl, siteConfig } from "../config/site";

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([name, value]) => {
    element.setAttribute(name, value);
  });
}

function upsertCanonical(url) {
  let canonical = document.head.querySelector('link[rel="canonical"]');

  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }

  canonical.setAttribute("href", url);
}

function getDefaultStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: siteConfig.name,
    url: siteConfig.url,
    image: getAbsoluteSiteUrl(siteConfig.socialImage),
    telephone: siteConfig.phoneInternational,
    email: siteConfig.email,
    areaServed: siteConfig.areaServed,
    sameAs: Object.values(siteConfig.socialLinks),
    memberOf: {
      "@type": "RealEstateAgent",
      name: siteConfig.brokerage,
    },
    knowsAbout: [
      "Residential real estate",
      "First-time home buying",
      "Home selling",
      "Jefferson County real estate",
      "Greater St. Louis real estate",
    ],
    address: {
      "@type": "PostalAddress",
      ...siteConfig.address,
    },
  };
}

function Seo({
  title,
  description,
  path = "/",
  image = siteConfig.socialImage,
  type = "website",
  noIndex = false,
  structuredData,
  fullTitle,
}) {
  useEffect(() => {
    const pageTitle =
      fullTitle || (title ? `${title} | ${siteConfig.name}` : siteConfig.name);
    const canonicalUrl = getAbsoluteSiteUrl(path);
    const imageUrl = getAbsoluteSiteUrl(image);

    document.title = pageTitle;
    document.documentElement.lang = "en";

    upsertMeta('meta[name="description"]', {
      name: "description",
      content: description,
    });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: noIndex ? "noindex, nofollow" : "index, follow",
    });
    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: pageTitle,
    });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    upsertMeta('meta[property="og:type"]', {
      property: "og:type",
      content: type,
    });
    upsertMeta('meta[property="og:url"]', {
      property: "og:url",
      content: canonicalUrl,
    });
    upsertMeta('meta[property="og:image"]', {
      property: "og:image",
      content: imageUrl,
    });
    upsertMeta('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: siteConfig.name,
    });
    upsertMeta('meta[property="og:locale"]', {
      property: "og:locale",
      content: "en_US",
    });
    upsertMeta('meta[property="og:image:alt"]', {
      property: "og:image:alt",
      content: `${siteConfig.shortName} real estate team`,
    });
    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: pageTitle,
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });
    upsertMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: imageUrl,
    });
    upsertMeta('meta[name="twitter:image:alt"]', {
      name: "twitter:image:alt",
      content: `${siteConfig.shortName} real estate team`,
    });
    upsertCanonical(canonicalUrl);

    let schema = document.head.querySelector("#site-structured-data");

    if (!schema) {
      schema = document.createElement("script");
      schema.id = "site-structured-data";
      schema.type = "application/ld+json";
      document.head.appendChild(schema);
    }

    schema.textContent = JSON.stringify(
      structuredData || getDefaultStructuredData()
    );
  }, [
    description,
    image,
    noIndex,
    path,
    structuredData,
    title,
    type,
    fullTitle,
  ]);

  return null;
}

export default Seo;
