import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <h1>My Website</h1>
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="about">About</Link>
        {/* You can also use relative links */}
        {/* For example, if you are on /about page, this will link to /about/sitemap */}
        {/* If you are on / page, this will link to /sitemap */}
        {/* To avoid confusion, it is better to use absolute links */}
        <Link to="sitemap">Sitemap</Link> 
      </nav>
    </header>
  );
}

export default Header;