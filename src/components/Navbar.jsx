import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  const closeMenu = () => setIsOpen(false);
  const goHome = () => {
    closeMenu();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };
  const contactPath = pathname === "/listings"
    ? "/listings#contact-form"
    : "/#contact-form";
  const goToContact = () => {
    closeMenu();

    if (pathname !== "/" && pathname !== "/listings") return;

    window.requestAnimationFrame(() => {
      document
        .getElementById("contact-form")
        ?.scrollIntoView({ block: "start" });
    });
  };

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo" onClick={goHome}>
          <span>The Property Cousins</span>
          <small>Real Estate Team</small>
        </Link>

        <button
          className="navbar__toggle"
          type="button"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={`navbar__links ${isOpen ? "navbar__links--open" : ""}`}>
          <NavLink to="/" onClick={goHome}>Home</NavLink>
          <NavLink to="/about" onClick={closeMenu}>About Us</NavLink>
          <NavLink to="/listings" onClick={closeMenu}>Listings</NavLink>
          <Link to={contactPath} onClick={goToContact}>Contact</Link>
        </nav>

        <Link to={contactPath} className="navbar__cta" onClick={goToContact}>
          Work With Us
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
