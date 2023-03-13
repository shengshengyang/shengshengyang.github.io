import React from "react";

function SitemapPage() {
  return (
    // You can use any HTML structure here for your sitemap content
    // For example, you can use a list of links or a table of contents
    // Here we just use a simple paragraph for demonstration purposes
    // Note that you don't need to render the header and footer here because they are already rendered by the Layout component
    // The Layout component wraps around this component when you use nested routes in App.js
    // If you don't want the header and footer on this page, you can create another layout component without them or move this route outside of the nested routes in App.js 
    <div className="sitemap-page">
      <h2>Sitemap</h2>
      <p>This is where you show your sitemap content.</p>
    </div>
  );
}

export default SitemapPage;