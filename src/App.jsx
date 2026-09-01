import { lazy, Suspense, useEffect } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SocialSticky from "./components/SocialSticky";
import Home from "./pages/Home";
import About from "./pages/About";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import NotFound from "./pages/NotFound";

const AdminStats = lazy(() => import("./pages/AdminStats"));
const AdminForgotPassword = lazy(() => import("./pages/AdminForgotPassword"));
const AdminResetPassword = lazy(() => import("./pages/AdminResetPassword"));

function ScrollToTop() {
  const { hash, key, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      window.setTimeout(() => {
        document
          .getElementById(hash.replace("#", ""))
          ?.scrollIntoView({ block: "start" });
      }, 0);

      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [hash, key, pathname]);

  return null;
}

function ScrollReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");

    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.18,
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}

function App() {
  return (
    <div className="site">
      <ScrollToTop />
      <ScrollReveal />
      <Navbar />
      <SocialSticky />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/listing" element={<Navigate to="/listings" replace />} />
          <Route
            path="/listing/:mls/:listingID"
            element={<LegacyListingRedirect />}
          />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:mls/:listingID" element={<ListingDetail />} />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<AdminRouteLoading />}>
                <AdminStats />
              </Suspense>
            }
          />
          <Route
            path="/admin/forgot-password"
            element={
              <Suspense fallback={<AdminRouteLoading />}>
                <AdminForgotPassword />
              </Suspense>
            }
          />
          <Route
            path="/admin/reset-password"
            element={
              <Suspense fallback={<AdminRouteLoading />}>
                <AdminResetPassword />
              </Suspense>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function AdminRouteLoading() {
  return (
    <section className="section admin-page">
      <div className="container admin-page__container">
        <p className="admin-loading" role="status">
          Loading secure area&hellip;
        </p>
      </div>
    </section>
  );
}

function LegacyListingRedirect() {
  const { pathname } = useLocation();
  return <Navigate to={pathname.replace(/^\/listing\//, "/listings/")} replace />;
}

export default App;
