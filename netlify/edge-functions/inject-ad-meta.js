export default async (request, context) => {
  const url = new URL(request.url);
  
  // 1. Check if this request is for an Ad Deep Link
  // Pattern: /deeplink/ad/:adId
  const pattern = new URLPattern({ pathname: "/deeplink/ad/:adId" });
  const match = pattern.exec(url);

  // If it's not an ad link, just return the page as usual (Client-side rendering)
  if (!match) {
    return context.next();
  }

  const adId = match.pathname.groups.adId;
  
  // YOUR API URL (Hardcode this or use Netlify Env Vars)
  // Based on your previous messages:
  const API_URL = "https://api.hanuut.com"; // REPLACE THIS WITH YOUR REAL PROD API URL

  try {
    // 2. Fetch the Ad Data from your API
    const apiResponse = await fetch(`${API_URL}/market/ads/${adId}`, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });

    if (!apiResponse.ok) {
      // If API fails (404), just return the standard page
      return context.next();
    }

    const adData = await apiResponse.json();

    // 3. Prepare the Metadata
    const title = adData.name || "Hanuut Marketplace";
    const description = adData.shortDescription || "Check out this deal on Hanuut!";
    
    // Construct Image URL (Handling the array of ObjectIds)
    let imageUrl = "https://hanuut.com/default-logo.png"; // Fallback image
    if (adData.images && adData.images.length > 0) {
      // Assuming your API serves images at /image/:id
      imageUrl = `${API_URL}/image/${adData.images[0]}`;
    }

    // 4. Get the original HTML from Netlify
    const originalResponse = await context.next();
    const originalHtml = await originalResponse.text();

    // 5. Replace the Placeholders
    const modifiedHtml = originalHtml
      .replaceAll("__META_TITLE__", title)
      .replaceAll("__META_DESCRIPTION__", description)
      .replaceAll("__META_IMAGE__", imageUrl)
      .replaceAll("__META_URL__", request.url);

    // 6. Return the modified HTML
    return new Response(modifiedHtml, {
      headers: originalResponse.headers,
      status: originalResponse.status,
    });

  } catch (error) {
    console.error("Edge Function Error:", error);
    return context.next();
  }
};

// Configure which paths trigger this function
export const config = {
  path: "/deeplink/ad/*",
  excludedPath: ["/static/*", "/*.css", "/*.js", "/*.ico", "/*.svg", "/*.json"]
};