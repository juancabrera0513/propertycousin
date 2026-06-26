function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <h3>The Property Cousins</h3>
          <p>Real Estate Team</p>
          <p className="footer__contact">
            <a href="tel:+13143025767">(314) 302-5767</a>
            <span> / </span>
            <a href="mailto:propertycousinsstl@gmail.com">
              propertycousinsstl@gmail.com
            </a>
          </p>
        </div>

        <p>
          © {new Date().getFullYear()} The Property Cousins Real Estate Team.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
