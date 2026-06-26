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
          <NavLink to="/listings" onClick={closeMenu}>Listings</NavLink>
          <Link to="/#testimonials" onClick={closeMenu}>Testimonials</Link>
          <Link to="/#contact" onClick={closeMenu}>Contact</Link>
        </nav>

        <Link to="/#contact" className="navbar__cta">
          Work With Us
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
