import { Link } from "react-router-dom";
import Seo from "../components/Seo";

function NotFound() {
  return (
    <>
      <Seo
        title="Page Not Found"
        description="The page you requested could not be found."
        path="/404"
        noIndex
      />

      <section className="section not-found">
        <div className="container not-found__content">
          <h1>This property is no longer on the map.</h1>
          <p>
            The page may have moved or the address may be incorrect. Return
            home or continue browsing available listings.
          </p>

          <div className="not-found__actions">
            <Link className="btn btn-primary" to="/">
              Return Home
            </Link>
            <Link className="btn btn-secondary" to="/listings">
              Browse Listings
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default NotFound;
