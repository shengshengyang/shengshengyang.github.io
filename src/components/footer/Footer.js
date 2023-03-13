import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; My Website 2022</p>
      {/* You can also use absolute links here */}
      {/* For example, this will always link to /sitemap regardless of the current page */}
      {/* To avoid confusion, it is better to use absolute links */}
      <Link to="/sitemap">Sitemap</Link> 
    </footer>
  );
}

export default Footer;