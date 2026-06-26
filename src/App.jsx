import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SocialSticky from "./components/SocialSticky";
import Home from "./pages/Home";
import About from "./pages/About";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import NotFound from "./pages/NotFound";

function ScrollToTop() {
  const { hash, pathname } = useLocation();

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
  }, [hash, pathname]);

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
          <Route path="/listing" element={<Listings />} />
          <Route path="/listing/:mls/:listingID" element={<ListingDetail />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:mls/:listingID" element={<ListingDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
