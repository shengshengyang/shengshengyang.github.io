import React from "react";
import { Link } from "react-router-dom";
import './Header.css'

function Header() {
  return (
    <header className="header">
      <h2>Dean's Blog</h2>
      <nav className="nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li> <Link to="about">About</Link></li>
          <li><Link to="sitemap">Sitemap</Link> </li>
        </ul>
        
       
        {/* You can also use relative links */}
        {/* For example, if you are on /about page, this will link to /about/sitemap */}
        {/* If you are on / page, this will link to /sitemap */}
        {/* To avoid confusion, it is better to use absolute links */}
        
      </nav>
    </header>
  );
}

export default Header;