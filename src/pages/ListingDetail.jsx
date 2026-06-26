import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Home, MapPin, Ruler } from "lucide-react";
import {
  fetchListingById,
  getListingPhotoUrls,
} from "../services/xannelloListings";
import Seo from "../components/Seo";

function formatValue(value, fallback = "-") {
  if (value === null || value === undefined || value === "") return fallback;
  return value;
}

function formatBoolean(value) {
  if (value === null || value === undefined || value === "") return "-";
  return Number(value) === 1 || value === true ? "Yes" : "No";
}

function parseDetails(value) {
  if (!value || typeof value !== "string") return [];

  try {
    const parsed = JSON.parse(value);
    return Object.entries(parsed).filter(([, detail]) => Boolean(detail));
  } catch {
    return [];
  }
}

function DetailSection({ title, items }) {
  return (
    <section className="listing-detail__panel listing-detail__data-section">
      <h2>{title}</h2>
      <dl className="listing-detail__data-list">
        {items.map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>{formatValue(item.value)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function ListingDetail() {
  const { mls, listingID } = useParams();
  const [property, setProperty] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    fetchListingById({ MLS: mls, listingID })
      .then((listing) => {
        if (!isMounted) return;
        setProperty(listing);
        setError(listing ? "" : "Listing not found.");
      })
      .catch(() => {
        if (!isMounted) return;
        setError("This listing is temporarily unavailable.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [listingID, mls]);

  const listing = property?.sourceListing;
  const photos = useMemo(
    () => (listing ? getListingPhotoUrls(listing) : []),
    [listing]
  );
  const listingStructuredData = useMemo(() => {
    if (!listing || !property) return null;

    return {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      name: `${property.address}, ${property.city}`,
      description:
        listing.publicRemarks ||
        `${property.beds} bedroom property listed by The Property Cousins.`,
      url: `https://www.thepropertycousins.org/listings/${property.MLS}/${property.listingID}`,
      image: photos,
      datePosted: listing.listDate || listing.statusDate,
      offers: {
        "@type": "Offer",
        price: property.priceValue || undefined,
        priceCurrency: "USD",
        availability:
          listing.status?.toLowerCase() === "closed"
            ? "https://schema.org/SoldOut"
            : "https://schema.org/InStock",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: property.address,
        addressLocality: listing.city,
        addressRegion: listing.state,
        postalCode: listing.postalCode || listing.zip,
        addressCountry: "US",
      },
      numberOfBedrooms: listing.bedroomsTotal,
      numberOfBathroomsTotal: listing.bathroomsTotal,
      floorSize: listing.interiorSF
        ? {
            "@type": "QuantitativeValue",
            value: listing.interiorSF,
            unitCode: "FTK",
          }
        : undefined,
    };
  }, [listing, photos, property]);
  const exteriorDetails = parseDetails(listing?.exteriorDetails);
  const interiorDetails = parseDetails(listing?.interiorDetails);
  const propertyFeatureSections = listing
    ? [
        {
          title: "Property Features",
          items: [
            { label: "Property Type", value: listing.propertyType },
            { label: "Bathrooms", value: listing.bathroomsTotal },
            { label: "Year Built", value: listing.yearBuilt },
            { label: "Bedrooms", value: listing.bedroomsTotal },
            {
              label: "Square Feet",
              value: listing.interiorSF
                ? Number(listing.interiorSF).toLocaleString("en-US")
                : "-",
            },
          ],
        },
        {
          title: "Heating and Cooling",
          items: [
            { label: "Heating", value: formatBoolean(listing.heatingYN) },
            { label: "Cooling", value: formatBoolean(listing.coolingYN) },
            { label: "Fireplace", value: formatBoolean(listing.fireplaceYN) },
            { label: "Heating Details", value: listing.heatingDetails },
            { label: "Cooling Details", value: listing.coolingDetails },
            { label: "Fireplaces Total", value: listing.fireplacesTotal },
          ],
        },
        {
          title: "Taxes & Assessments",
          items: [
            {
              label: "Tax Amount",
              value: listing.taxAnnual
                ? `$${Number(listing.taxAnnual).toLocaleString("en-US")}`
                : "-",
            },
            { label: "Tax City", value: listing.taxCity },
            { label: "Tax Year", value: listing.taxYear },
            {
              label: "HOA",
              value: listing.HOAFee
                ? `$${Number(listing.HOAFee).toLocaleString("en-US")} ${formatValue(
                    listing.HOAFrequency,
                    ""
                  )}`
                : "-",
            },
          ],
        },
        {
          title: "Garage and Parking",
          items: [
            { label: "Garage", value: formatBoolean(listing.garageYN) },
            { label: "Parking Spaces", value: listing.carSpaces },
            { label: "Parking Details", value: listing.parkingDetails },
            { label: "Garage Details", value: listing.garageDescription },
            {
              label: "Attached Garage",
              value: formatBoolean(listing.attachedGarageYN),
            },
          ],
        },
        {
          title: "Schools",
          items: [
            { label: "Grade School", value: listing.gradeSchool },
            { label: "Middle School", value: listing.middleSchool },
            { label: "High School", value: listing.highSchool },
            {
              label: "Grade School District",
              value: listing.gradeSchoolDistrict,
            },
            {
              label: "Middle School District",
              value: listing.middleSchoolDistrict,
            },
            { label: "High School District", value: listing.highSchoolDistrict },
          ],
        },
        {
          title: "Amenities",
          items: [
            { label: "Pool", value: formatBoolean(listing.poolYN) },
            { label: "Waterfront", value: formatBoolean(listing.waterfrontYN) },
            { label: "Outbuildings", value: listing.outbuildings },
            { label: "Pool Details", value: listing.poolDetails },
            { label: "Water Body Name", value: listing.waterBodyName },
            { label: "Area Amenities", value: listing.areaAmenities },
            { label: "Common Amenities", value: listing.commonAmenities },
          ],
        },
      ]
    : [];

  if (isLoading) {
    return (
      <>
        <Seo
          title="Listing Details"
          description="View property details from The Property Cousins Real Estate Team."
          path={`/listings/${mls}/${listingID}`}
        />
        <section className="section listing-detail">
          <div className="container">
            <p className="listing-detail__status">Loading listing details...</p>
          </div>
        </section>
      </>
    );
  }

  if (error || !property || !listing) {
    return (
      <>
        <Seo
          title="Listing Unavailable"
          description="This property listing is currently unavailable."
          path={`/listings/${mls}/${listingID}`}
          noIndex
        />
        <section className="section listing-detail">
          <div className="container listing-empty">
            <h3>{error || "Listing not found."}</h3>
            <Link className="btn btn-primary" to="/listings">
              Back to Listings
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Seo
        title={`${property.address}, ${property.city}`}
        description={
          listing.publicRemarks ||
          `${property.beds} beds, ${property.baths} baths and ${property.sqft} square feet. View this ${property.propertyType.toLowerCase()} listing with The Property Cousins.`
        }
        path={`/listings/${property.MLS}/${property.listingID}`}
        image={photos[0]}
        type="product"
        structuredData={listingStructuredData}
      />
      <section className="section listing-detail">
        <div className="container">
        <div className="listing-detail__nav">
          <Link className="listing-detail__back" to="/listings">
            <ArrowLeft size={18} aria-hidden="true" />
            Back to Search
          </Link>
        </div>

        <div className="listing-detail__hero">
          <div className="listing-detail__summary">
            <h1>{property.price}</h1>
            <p className="listing-detail__meta">
              {property.MLS} #{property.listingID}
            </p>
            <p className="listing-detail__address">{property.address}</p>
            <p className="listing-detail__city">
              <MapPin size={18} aria-hidden="true" />
              {property.city} {listing.postalCode}
            </p>

            <div className="listing-detail__facts">
              <span>{property.beds} Beds</span>
              <span>{property.baths} Baths</span>
              <span>{property.sqft} Sq Ft</span>
              <span>{property.propertyType}</span>
            </div>
          </div>

          <div className="listing-detail__media">
            <img
              src={photos[selectedPhoto]}
              alt={`${property.address}, ${property.city}`}
              onError={(event) => {
                event.currentTarget.src = "/images/demo-sold-1.jpg";
              }}
            />
            <span>{property.status}</span>
          </div>
        </div>

        {photos.length > 1 ? (
          <div className="listing-detail__photos" aria-label="Listing photos">
            {photos.map((photo, index) => (
              <button
                type="button"
                className={selectedPhoto === index ? "active" : ""}
                onClick={() => setSelectedPhoto(index)}
                key={photo}
              >
                <img
                  src={photo}
                  alt={`${property.address} photo ${index + 1}`}
                  onError={(event) => {
                    event.currentTarget.closest("button").style.display = "none";
                  }}
                />
              </button>
            ))}
          </div>
        ) : null}

        <aside className="listing-detail__panel listing-detail__snapshot">
          <h2>MLS Snapshot</h2>
          <dl className="listing-detail__list">
            <div>
              <dt>
                <CalendarDays size={16} aria-hidden="true" />
                Listed
              </dt>
              <dd>{property.date}</dd>
            </div>
            <div>
              <dt>
                <Home size={16} aria-hidden="true" />
                Year Built
              </dt>
              <dd>{formatValue(listing.yearBuilt)}</dd>
            </div>
            <div>
              <dt>
                <Ruler size={16} aria-hidden="true" />
                Lot Size
              </dt>
              <dd>
                {listing.lotSizeSF
                  ? `${Number(listing.lotSizeSF).toLocaleString("en-US")} Sq Ft`
                  : "-"}
              </dd>
            </div>
            <div>
              <dt>County</dt>
              <dd>{formatValue(listing.county)}</dd>
            </div>
            <div>
              <dt>Subdivision</dt>
              <dd>{formatValue(listing.subdivision)}</dd>
            </div>
            <div>
              <dt>HOA</dt>
              <dd>
                {listing.HOAFee
                  ? `$${Number(listing.HOAFee).toLocaleString("en-US")} ${formatValue(
                      listing.HOAFrequency,
                      ""
                    )}`
                  : "-"}
              </dd>
            </div>
            <div>
              <dt>Taxes</dt>
              <dd>
                {listing.taxAnnual
                  ? `$${Number(listing.taxAnnual).toLocaleString("en-US")} (${formatValue(
                      listing.taxYear,
                      "N/A"
                    )})`
                  : "-"}
              </dd>
            </div>
            <div>
              <dt>Schools</dt>
              <dd>
                {[listing.elementarySchool, listing.middleSchool, listing.highSchool]
                  .filter(Boolean)
                  .join(" / ") || "-"}
              </dd>
            </div>
          </dl>
        </aside>

        <article className="listing-detail__panel listing-detail__remarks">
          <h2>Property Details</h2>
          <p>{formatValue(listing.publicRemarks, "No remarks available.")}</p>
        </article>

        <section className="listing-detail__cta">
          <div>
            <h2>Schedule a private showing for this property.</h2>
            <p>
              Send the address or MLS number to The Property Cousins and get
              help comparing details, availability, and next steps.
            </p>
          </div>

          <div className="listing-detail__cta-actions">
            <a className="btn btn-primary" href="tel:+13143025767">
              Call (314) 302-5767
            </a>
            <a
              className="btn btn-secondary"
              href={`mailto:propertycousinsstl@gmail.com?subject=${encodeURIComponent(
                `Showing request for ${property.address}`
              )}&body=${encodeURIComponent(
                `Hi, I would like more information about ${property.address}, ${property.city}. MLS #${property.listingID}.`
              )}`}
            >
              Request Info
            </a>
          </div>
        </section>

        <div className="listing-detail__sections">
          {propertyFeatureSections.map((section) => (
            <DetailSection
              title={section.title}
              items={section.items}
              key={section.title}
            />
          ))}
        </div>

        {[...interiorDetails, ...exteriorDetails].length > 0 ? (
          <div className="listing-detail__panel listing-detail__features">
            <h2>Features</h2>
            <div>
              {[...interiorDetails, ...exteriorDetails].map(([label, value]) => (
                <span key={`${label}-${value}`}>
                  {label}: {value}
                </span>
              ))}
            </div>
          </div>
        ) : null}
        </div>
      </section>
    </>
  );
}

export default ListingDetail;
