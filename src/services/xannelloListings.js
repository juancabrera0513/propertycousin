const DASHBOARD_IMAGE_BASE = "https://dashboardimages.com/MLS";
const XANNELLO_PROXY_URL =
  import.meta.env.VITE_XANNELLO_PROXY_URL || "/api/xannello";

const PROPERTY_COUSINS_SEARCH_PARAMS = {
  entity: "agent",
  usersID: "6440",
};

const ALLOWED_SEARCH_STATUSES = [
  "active",
  "contingent",
  "pending",
  "closed",
  "rented",
];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

async function requestListings(endpoint, parameter) {
  const response = await fetch(XANNELLO_PROXY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      endpoint,
      parameter,
    }),
  });

  if (!response.ok) {
    throw new Error(`Xannello request failed with ${response.status}`);
  }

  const data = await response.json();
  if (Array.isArray(data)) return data;
  return Array.isArray(data.resultset) ? data.resultset : [];
}

export function getListingImageUrl(listing) {
  if (!listing?.listingID || !listing?.MLS) return "/images/demo-sold-1.jpg";

  const paddedListingId = String(listing.listingID).padStart(10, "0");
  const listingPath = paddedListingId.match(/.{1,2}/g)?.join("/");

  return `${DASHBOARD_IMAGE_BASE}/${listing.MLS}/${listingPath}/0.jpg`;
}

export function getListingPhotoUrls(listing) {
  const photoCount = Number(listing?.photosCount || 0);
  if (!photoCount) return [getListingImageUrl(listing)];

  const paddedListingId = String(listing.listingID).padStart(10, "0");
  const listingPath = paddedListingId.match(/.{1,2}/g)?.join("/");

  return Array.from(
    { length: photoCount },
    (_, index) => `${DASHBOARD_IMAGE_BASE}/${listing.MLS}/${listingPath}/${index}.jpg`
  );
}

function getListingPriceValue(listing) {
  return Number(
    listing.closePrice ||
      listing.listPrice ||
      listing.rentPrice ||
      listing.rentedPrice ||
      0
  );
}

function getListingDateValue(listing) {
  const rawDate =
    listing.listDate ||
    listing.statusDate ||
    listing.closeDate ||
    listing.purchaseContractDate ||
    "";
  const timestamp = rawDate ? Date.parse(rawDate) : 0;

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function formatListingDate(listing) {
  const dateValue = getListingDateValue(listing);
  if (!dateValue) return listing.status || "MLS Listing";

  const prefix = listing.status?.toLowerCase() === "closed" ? "Sold" : "Listed";
  return `${prefix} ${dateFormatter.format(new Date(dateValue))}`;
}

function formatNumber(value) {
  const number = Number(value);
  return number ? number.toLocaleString("en-US") : "-";
}

function buildSearchText(listing) {
  return [
    listing.streetAddress,
    listing.city,
    listing.state,
    listing.zip,
    listing.status,
    listing.propertyType,
    listing.listingID,
    listing.MLS,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function normalizeListing(listing, options = {}) {
  const priceValue = getListingPriceValue(listing);
  const cityState = [listing.city, listing.state].filter(Boolean).join(", ");

  return {
    id: `${listing.MLS}-${listing.listingID}`,
    MLS: listing.MLS,
    listingID: listing.listingID,
    featured: Boolean(options.featured),
    status: listing.status || "MLS Listing",
    price: priceValue ? currencyFormatter.format(priceValue) : "Price on request",
    priceValue,
    sortDate: getListingDateValue(listing),
    date: formatListingDate(listing),
    beds: formatNumber(listing.bedroomsTotal),
    baths: formatNumber(listing.bathroomsTotal),
    sqft: formatNumber(listing.interiorSF),
    address: listing.streetAddress || "Address available by request",
    city: cityState || "Missouri",
    image: getListingImageUrl(listing),
    detailPath: `/listings/${listing.MLS}/${listing.listingID}`,
    propertyType: listing.propertyType || "Residential",
    searchText: buildSearchText(listing),
    sourceListing: listing,
  };
}

export function normalizeFallbackProperty(property) {
  return {
    ...property,
    id: `demo-${property.id}`,
    priceValue: Number(String(property.price).replace(/[^0-9]/g, "")),
    sortDate: 0,
    propertyType: "Residential",
    searchText: `${property.address} ${property.city} ${property.status}`.toLowerCase(),
    featured: false,
  };
}

function dedupeListings(listings) {
  const listingMap = new Map();

  listings.forEach((listing) => {
    const key = `${listing.MLS}-${listing.listingID}`;
    const existing = listingMap.get(key);

    if (!existing || listing.featured) {
      listingMap.set(key, listing);
    }
  });

  return [...listingMap.values()];
}

export async function fetchPropertyCousinsListings() {
  const searchListings = await requestListings(
    "basicSearch",
    PROPERTY_COUSINS_SEARCH_PARAMS
  );

  return dedupeListings(
    searchListings
      .filter((listing) =>
        ALLOWED_SEARCH_STATUSES.includes(listing.status?.toLowerCase() ?? "")
      )
      .map((listing) => normalizeListing(listing))
  );
}

export async function fetchListingById({ listingID, MLS }) {
  const listings = await requestListings("getListingByListingID", {
    listingID,
    usersID: PROPERTY_COUSINS_SEARCH_PARAMS.usersID,
    MLS,
  });

  return listings[0] ? normalizeListing(listings[0]) : null;
}
