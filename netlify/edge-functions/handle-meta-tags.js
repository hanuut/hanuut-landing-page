// netlify/edge-functions/handle-meta-tags.js

export default async (request, context) => {
  const url = new URL(request.url);
  
  // --- 1. SETUP DEFAULTS ---
  // This ensures the Homepage and other routes show real data, not placeholders.
  let metaData = {
    title: "Hanuut | Your Local Shop, Online",
    description: "Shop from verified local businesses you already trust. Local shopping, made simple.",
    image: `${url.origin}/logoPic.png`, 
    url: url.href
  };

  // --- 2. CHECK FOR DEEP LINK (Ads) ---
  // Pattern: /deeplink/ad/:adId
  const adPattern = new URLPattern({ pathname: "/deeplink/ad/:adId" });
  const adMatch = adPattern.exec(url);

  // --- 3. IF AD LINK, FETCH DATA ---
  if (adMatch) {
    const adId = adMatch.pathname.groups.adId;
    
    // Hardcode your API URL here to ensure it works in the Edge environment
    const API_URL = "https://api.hanuut.com"; 

    try {
      // Fetch the Ad details
      const apiResponse = await fetch(`${API_URL}/market/ads/${adId}`, {
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });

      if (apiResponse.ok) {
        const adData = await apiResponse.json();
        
        // Overwrite defaults with specific Ad data
        if (adData.name) metaData.title = `${adData.name} | Hanuut Market`;
        if (adData.shortDescription) metaData.description = adData.shortDescription;
        
        // Construct Image URL
        if (adData.images && adData.images.length > 0) {
           metaData.image = `${API_URL}/image/${adData.images[0]}`;
        }
      }
    } catch (error) {
      console.log("Edge Function: Failed to fetch ad data, falling back to default meta.");
    }
  }

  // --- 4. INJECT DATA INTO HTML ---
  // Get the original index.html (which contains the __META__ placeholders)
  const response = await context.next();
  const pageHtml = await response.text();

  // Replace placeholders
  const updatedHtml = pageHtml
    .replaceAll("__META_TITLE__", metaData.title)
    .replaceAll("__META_DESCRIPTION__", metaData.description)
    .replaceAll("__META_IMAGE__", metaData.image)
    .replaceAll("__META_URL__", metaData.url);

  // Return the modified HTML to the browser/bot
  return new Response(updatedHtml, {
    headers: response.headers,
    status: response.status
  });
};

// --- 5. CONFIGURATION ---
// Run this function on ALL routes (*) except static files (images, css, js)
export const config = {
  path: "/*",
  excludedPath: [
    "/*.css", 
    "/*.js", 
    "/*.ico", 
    "/*.svg", 
    "/*.png", 
    "/*.webp", 
    "/*.gif", 
    "/static/*", 
    "/assets/*",
    "/.well-known/*"
  ]
};