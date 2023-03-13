import React from "react";
import { Link } from "react-router-dom";
import './Header.css'

function Header() {
  return (
    <header className="header">
      <h1>My Website</h1>
      <nav className="nav">
        <ul>
          <li><Link to="/"><p>Home</p></Link></li>
          <li> <Link to="about"><p>About</p></Link></li>
          <li><Link to="sitemap"><p>Sitemap</p></Link> </li>
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