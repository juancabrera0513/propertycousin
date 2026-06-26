import { useEffect } from "react";

const SITE_NAME = "The Property Cousins Real Estate Team";
const SITE_URL = "https://www.thepropertycousins.org";
const DEFAULT_IMAGE = "/images/property-cousins-team.webp";

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

function getAbsoluteUrl(value) {
  if (!value) return SITE_URL;
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

function getDefaultStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: SITE_NAME,
    url: SITE_URL,
    image: getAbsoluteUrl(DEFAULT_IMAGE),
    telephone: "+1-314-302-5767",
    email: "propertycousinsstl@gmail.com",
    areaServed: [
      "Jefferson County, Missouri",
      "Greater St. Louis, Missouri",
    ],
    address: {
      "@type": "PostalAddress",
      addressRegion: "MO",
      addressCountry: "US",
    },
  };
}

function Seo({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  type = "website",
  noIndex = false,
  structuredData,
}) {
  useEffect(() => {
    const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const canonicalUrl = getAbsoluteUrl(path);
    const imageUrl = getAbsoluteUrl(image);

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
      content: SITE_NAME,
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
  ]);

  return null;
}

export default Seo;
