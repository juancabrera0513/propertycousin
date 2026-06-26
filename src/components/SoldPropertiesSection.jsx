import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Search, SlidersHorizontal } from "lucide-react";
import { demoSoldProperties } from "../data/demoSoldProperties";
import {
  fetchPropertyCousinsListings,
  normalizeFallbackProperty,
} from "../services/xannelloListings";

const priceRanges = [
  { label: "Any Price", min: 0, max: Infinity },
  { label: "Under $250K", min: 0, max: 250000 },
  { label: "$250K - $500K", min: 250000, max: 500000 },
  { label: "$500K - $1M", min: 500000, max: 1000000 },
  { label: "$1M+", min: 1000000, max: Infinity },
];

function getNumber(value) {
  return Number(String(value).replace(/[^0-9]/g, ""));
}

function SoldPropertiesSection({ variant = "full" }) {
  const isCompact = variant === "compact";
  const [liveProperties, setLiveProperties] = useState([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  const [listingsError, setListingsError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedBeds, setSelectedBeds] = useState("Any Beds");
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(isCompact ? 4 : 20);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetchPropertyCousinsListings()
      .then((properties) => {
        if (!isMounted) return;
        setLiveProperties(properties);
        setListingsError("");
      })
      .catch(() => {
        if (!isMounted) return;
        setListingsError("Live MLS data is temporarily unavailable.");
      })
      .finally(() => {
        if (isMounted) setIsLoadingListings(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const properties = useMemo(() => {
    if (liveProperties.length > 0) return liveProperties;
    return demoSoldProperties.map(normalizeFallbackProperty);
  }, [liveProperties]);

  const cities = useMemo(
    () => [
      "All Cities",
      ...new Set(properties.map((property) => property.city).filter(Boolean)),
    ],
    [properties]
  );

  const statuses = useMemo(
    () => [
      "All Statuses",
      ...new Set(properties.map((property) => property.status).filter(Boolean)),
    ],
    [properties]
  );

  const filteredProperties = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return properties
      .filter((property) => {
        const propertyPrice = property.priceValue || getNumber(property.price);
        const propertyBeds = getNumber(property.beds);
        const matchesSearch =
          !normalizedSearch ||
          property.searchText.includes(normalizedSearch);
        const matchesCity =
          selectedCity === "All Cities" || property.city === selectedCity;
        const matchesStatus =
          selectedStatus === "All Statuses" ||
          property.status === selectedStatus;
        const matchesBeds =
          selectedBeds === "Any Beds" || propertyBeds >= Number(selectedBeds);
        const matchesPrice =
          propertyPrice >= selectedPriceRange.min &&
          propertyPrice <= selectedPriceRange.max;

        return (
          matchesSearch &&
          matchesCity &&
          matchesStatus &&
          matchesBeds &&
          matchesPrice
        );
      })
      .sort((a, b) => {
        const priceA = a.priceValue || getNumber(a.price);
        const priceB = b.priceValue || getNumber(b.price);

        if (sortBy === "price-low") return priceA - priceB;
        if (sortBy === "price-high") return priceB - priceA;
        if (sortBy === "beds") return getNumber(b.beds) - getNumber(a.beds);

        return (b.sortDate || 0) - (a.sortDate || 0);
      });
  }, [
    properties,
    searchTerm,
    selectedCity,
    selectedStatus,
    selectedBeds,
    selectedPriceRange,
    sortBy,
  ]);

  const pageCount = Math.max(1, Math.ceil(filteredProperties.length / pageSize));
  const activePage = Math.min(currentPage, pageCount);
  const pageStart = (activePage - 1) * pageSize;
  const pageEnd = Math.min(pageStart + pageSize, filteredProperties.length);
  const paginatedProperties = filteredProperties.slice(pageStart, pageEnd);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCity("All Cities");
    setSelectedStatus("All Statuses");
    setSelectedBeds("Any Beds");
    setSelectedPriceRange(priceRanges[0]);
    setSortBy("newest");
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    const nextPage = Math.min(Math.max(page, 1), pageCount);
    setCurrentPage(nextPage);
  };

  return (
    <section
      className={`section sold-section ${
        isCompact ? "sold-section--compact" : ""
      }`}
      id="listings"
    >
      <div className="container">
        <div className="section-heading section-heading--center sold-section__heading">
          <h2>
            {isCompact
              ? "Find your next move faster."
              : "Search current listings and recent local results."}
          </h2>
          <p>
            {isCompact
              ? "Search live MLS results, preview the newest matches, and open the full search when you are ready to compare more homes."
              : "Browse all available MLS search results from the Property Cousins feed, then narrow the market by city, budget, bedrooms, and status."}
          </p>
        </div>

        <div className="listing-search">
          <div className="listing-search__main">
            <Search size={20} aria-hidden="true" />
            <label className="listing-search__field">
              <span>Search by address, city, or status</span>
              <input
                type="search"
                value={searchTerm}
                placeholder="Try Arnold, St Louis, Active, or MLS number"
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(1);
                }}
              />
            </label>
          </div>

          <div className="listing-search__toolbar">
            <button
              type="button"
              className="listing-search__filter-toggle"
              onClick={() => setFiltersOpen((current) => !current)}
            >
              <SlidersHorizontal size={16} aria-hidden="true" />
              {filtersOpen ? "Hide Filters" : "Filters"}
            </button>
            {isCompact ? (
              <Link className="listing-search__view-all" to="/listings">
                View Full Search
              </Link>
            ) : null}
          </div>

          <div
            className={`listing-search__filters ${
              !filtersOpen ? "listing-search__filters--collapsed" : ""
            }`}
            aria-label="Listing filters"
          >
            <label>
              <span>City</span>
              <select
                value={selectedCity}
                onChange={(event) => {
                  setSelectedCity(event.target.value);
                  setCurrentPage(1);
                }}
              >
                {cities.map((city) => (
                  <option value={city} key={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Status</span>
              <select
                value={selectedStatus}
                onChange={(event) => {
                  setSelectedStatus(event.target.value);
                  setCurrentPage(1);
                }}
              >
                {statuses.map((status) => (
                  <option value={status} key={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Price</span>
              <select
                value={selectedPriceRange.label}
                onChange={(event) => {
                  setSelectedPriceRange(
                    priceRanges.find(
                      (range) => range.label === event.target.value
                    )
                  );
                  setCurrentPage(1);
                }}
              >
                {priceRanges.map((range) => (
                  <option value={range.label} key={range.label}>
                    {range.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Beds</span>
              <select
                value={selectedBeds}
                onChange={(event) => {
                  setSelectedBeds(event.target.value);
                  setCurrentPage(1);
                }}
              >
                <option>Any Beds</option>
                <option value="2">2+ Beds</option>
                <option value="3">3+ Beds</option>
                <option value="4">4+ Beds</option>
              </select>
            </label>

            <label>
              <span>Sort</span>
              <select
                value={sortBy}
                onChange={(event) => {
                  setSortBy(event.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price Low to High</option>
                <option value="price-high">Price High to Low</option>
                <option value="beds">Most Bedrooms</option>
              </select>
            </label>
          </div>

          <div className="listing-search__summary">
            <span>
              <SlidersHorizontal size={16} aria-hidden="true" />
              {isLoadingListings
                ? "Loading live MLS listings..."
                : `${filteredProperties.length} matching homes`}
            </span>
            <div className="listing-search__actions">
              {!isCompact ? (
                <label>
                  <span>Per page</span>
                  <select
                    value={pageSize}
                    onChange={(event) => {
                      setPageSize(Number(event.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                </label>
              ) : null}
              <button type="button" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          </div>

          {listingsError ? (
            <p className="listing-search__note">
              {listingsError} Showing local sample properties until the feed is
              available again.
            </p>
          ) : (
            <p className="listing-search__note">
              Live data is sourced from the same Xannello/MARIS IDX search used
              by the Property Cousins search page.
            </p>
          )}
        </div>

        {filteredProperties.length > 0 ? (
          <>
            {!isCompact ? (
              <div className="listing-pagination listing-pagination--top">
              <span>
                Showing {pageStart + 1}-{pageEnd} of {filteredProperties.length}
              </span>
              <div>
                <button
                  type="button"
                  onClick={() => goToPage(activePage - 1)}
                  disabled={activePage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {activePage} of {pageCount}
                </span>
                <button
                  type="button"
                  onClick={() => goToPage(activePage + 1)}
                  disabled={activePage === pageCount}
                >
                  Next
                </button>
              </div>
              </div>
            ) : null}

            <div className="sold-grid">
              {paginatedProperties.map((property) => (
                <Link
                  className="sold-card"
                  key={property.id}
                  to={property.detailPath || "/listings"}
                >
                  <div className="sold-card__image-wrap">
                    <img
                      src={property.image}
                      alt={`${property.address}, ${property.city}`}
                      className="sold-card__image"
                      onError={(event) => {
                        event.currentTarget.src = "/images/demo-sold-1.jpg";
                      }}
                    />

                    <span className="sold-card__badge">{property.status}</span>
                  </div>

                  <div className="sold-card__content">
                    <div className="sold-card__top">
                      <h3>{property.price}</h3>
                      <span>{property.date}</span>
                    </div>

                    <p className="sold-card__address">{property.address}</p>
                    <p className="sold-card__city">
                      <MapPin size={15} aria-hidden="true" />
                      {property.city}
                    </p>

                    <div className="sold-card__details">
                      <span>{property.beds} Beds</span>
                      <span>{property.baths} Baths</span>
                      <span>{property.sqft} Sq Ft</span>
                      <span>{property.propertyType}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {isCompact ? (
              <div className="listing-compact-cta">
                <span>{filteredProperties.length} live matches available</span>
                <Link className="btn btn-primary" to="/listings">
                  Open Full Search
                </Link>
              </div>
            ) : (
              <div className="listing-pagination">
              <span>
                Showing {pageStart + 1}-{pageEnd} of {filteredProperties.length}
              </span>
              <div>
                <button
                  type="button"
                  onClick={() => goToPage(activePage - 1)}
                  disabled={activePage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {activePage} of {pageCount}
                </span>
                <button
                  type="button"
                  onClick={() => goToPage(activePage + 1)}
                  disabled={activePage === pageCount}
                >
                  Next
                </button>
              </div>
              </div>
            )}
          </>
        ) : (
          <div className="listing-empty">
            <h3>No matching homes found.</h3>
            <p>Adjust your filters or clear the search to view all listings.</p>
            <button type="button" className="btn btn-primary" onClick={clearFilters}>
              Reset Search
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default SoldPropertiesSection;
