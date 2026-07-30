export const siteConfig = {
  name: "The Property Cousins Real Estate Team",
  shortName: "The Property Cousins",
  url: "https://www.thepropertycousins.org",
  description:
    "Local, relationship-first real estate guidance for buyers and sellers across Jefferson County and greater St. Louis.",
  email: "propertycousinsstl@gmail.com",
  brokerage: "EXIT Elite Realty",
  phoneDisplay: "(314) 302-5767",
  phoneHref: "tel:+13143025767",
  phoneInternational: "+1-314-302-5767",
  location: "630 Jeffco Blvd, Arnold, MO 63010",
  address: {
    streetAddress: "630 Jeffco Blvd",
    addressLocality: "Arnold",
    addressRegion: "MO",
    postalCode: "63010",
    addressCountry: "US",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=630%20Jeffco%20Blvd%2C%20Arnold%2C%20MO%2063010",
  siteCredit: {
    name: "Domi Websites",
    url: "https://domiwebsites.com",
  },
  areaServed: [
    "Jefferson County, Missouri",
    "Greater St. Louis, Missouri",
  ],
  plannedLocalPages: [
    { slug: "jefferson-county", name: "Jefferson County" },
    { slug: "arnold", name: "Arnold" },
    { slug: "festus", name: "Festus" },
    { slug: "imperial", name: "Imperial" },
    { slug: "fenton", name: "Fenton" },
    { slug: "high-ridge", name: "High Ridge" },
  ],
  socialImage: "/images/property-cousins-social-preview.webp",
  socialLinks: {
    instagram:
      "https://www.instagram.com/propertycousinsstl?igsh=MW45NHFvbmk2MG1iYw==",
    facebook:
      "https://www.facebook.com/people/The-Property-Cousins-Real-Estate-Team/61565912713909/",
  },
};

export function getAbsoluteSiteUrl(value = "/") {
  if (/^https?:\/\//i.test(value)) return value;
  return `${siteConfig.url}${value.startsWith("/") ? value : `/${value}`}`;
}
