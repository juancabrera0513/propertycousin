import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo" onClick={closeMenu}>
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
          <NavLink to="/" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/about" onClick={closeMenu}>About Us</NavLink>
          <NavLink to="/listing" onClick={closeMenu}>Listings</NavLink>
          <a href="/#testimonials" onClick={closeMenu}>Testimonials</a>
          <a href="/#contact" onClick={closeMenu}>Contact</a>
        </nav>

        <a href="/#contact" className="navbar__cta">
          Work With Us
        </a>
      </div>
    </header>
  );
}

export default Navbar;
