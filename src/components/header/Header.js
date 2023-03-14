import {React, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import './Header.css'

function Header() {
    const [scrollPosition, setScrollPosition] = useState(0);
    useEffect(() => {
        const handleScroll = () => {
            const position = window.scrollY;
            setScrollPosition(position);
        };

        window.addEventListener("scroll", handleScroll, {passive: true});

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    const hideHeader = scrollPosition > 80; // set the threshold as needed
    return (
        <header className={`header ${hideHeader ? 'hide' : ''}`}>
            <h2>Dean's Blog</h2>
            <nav className="nav">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="about">About</Link></li>
                    <li><Link to="sitemap">Sitemap</Link></li>
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
