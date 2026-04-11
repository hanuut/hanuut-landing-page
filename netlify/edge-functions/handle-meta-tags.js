// netlify/edge-functions/handle-meta-tags.js

export default async (request, context) => {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // --- 1. SETUP DEFAULTS (For the homepage and unknown routes) ---
  let metaData = {
    title: "Hanuut | The Digital Ecosystem for E-commerce & Mobility",
    description: "Hanuut connects shops, customers, and drivers in Algeria. Shop local, manage your business, or drive with us.",
    image: `${url.origin}/logoPic.png`, 
    url: url.href
  };

  // --- 2. STATIC ROUTES OVERRIDES (Abridh, eSUUQ, Partners) ---
  // This ensures WhatsApp/Facebook show the correct preview cards!
  
  if (path.startsWith("/tawsila") || path.startsWith("/abrid")) {
    metaData.title = "Abridh | Réseau Privé de Mobilité Communautaire";
    metaData.description = "Rejoignez la phase expérimentale d'Abridh. Un réseau privé à accès limité pour coordonner vos déplacements en Algérie.";
    metaData.image = `${url.origin}/static/abridh.png`; // Using your new static image!
  } 
  else if (path.startsWith("/esuuq")) {
    metaData.title = "eSUUQ | Achat, Vente et Livraison en Algérie";
    metaData.description = "La marketplace n°1 en Algérie. Commandez vos repas, faites vos courses ou vendez vos objets d'occasion.";
    metaData.image = `${url.origin}/static/esuuq.png`;
  }
  else if (path.startsWith("/partners")) {
    metaData.title = "My Hanuut | Logiciel de Caisse & Boutique en Ligne";
    metaData.description = "Numérisez votre commerce gratuitement. Menu digital, gestion de stock par code-barres et site e-commerce.";
    metaData.image = `${url.origin}/static/my-hanuut.png`;
  }
  else if (path.startsWith("/explore")) {
    // Basic fallback for the new Location Directory pages
    metaData.title = "Explore Local Shops | Hanuut";
    metaData.description = "Discover and order from the best shops and restaurants in your city.";
  }

  // --- 3. DYNAMIC ROUTES (Ads) ---
  const adPattern = new URLPattern({ pathname: "/deeplink/ad/:adId" });
  const adMatch = adPattern.exec(url);

  if (adMatch) {
    const adId = adMatch.pathname.groups.adId;
    const API_URL = "https://api.hanuut.com"; 

    try {
      const apiResponse = await fetch(`${API_URL}/market/ads/${adId}`, {
        headers: { "Content-Type": "application/json", "Accept": "application/json" }
      });

      if (apiResponse.ok) {
        const adData = await apiResponse.json();
        if (adData.name) metaData.title = `${adData.name} | Hanuut Market`;
        if (adData.shortDescription) metaData.description = adData.shortDescription;
        if (adData.images && adData.images.length > 0) {
           metaData.image = `${API_URL}/image/raw/${adData.images[0]}`; // Updated to use the raw endpoint
        }
      }
    } catch (error) {
      console.log("Edge Function: Failed to fetch ad data, falling back to default meta.");
    }
  }

  // --- 4. INJECT DATA INTO HTML ---
  const response = await context.next();
  const pageHtml = await response.text();

  // Replace placeholders in public/index.html
  const updatedHtml = pageHtml
    .replaceAll("__META_TITLE__", metaData.title)
    .replaceAll("__META_DESCRIPTION__", metaData.description)
    .replaceAll("__META_IMAGE__", metaData.image)
    .replaceAll("__META_URL__", metaData.url);

  return new Response(updatedHtml, {
    headers: response.headers,
    status: response.status
  });
};

export const config = {
  path: "/*",
  excludedPath: [
    "/*.css", "/*.js", "/*.ico", "/*.svg", "/*.png", "/*.webp", "/*.gif", 
    "/static/*", "/assets/*", "/.well-known/*"
  ]
};