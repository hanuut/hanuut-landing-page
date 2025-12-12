export default async (request, context) => {
  const userAgent = request.headers.get("user-agent") || "";
  const url = new URL(request.url);
  const path = url.pathname;
  
  // 1. Define API URL
  const API_URL = "https://api.hanuut.com"; 
  let targetUrl = null;

  // Bot Detection
  const botPattern = /facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|discordbot|slackbot|googlebot/i;
  // Proxy humans for deeplinks, but only bots for blog
  const isBot = botPattern.test(userAgent);
  const isDeepLink = path.startsWith("/deeplink/");

  if (isDeepLink || (path.startsWith("/blog/") && isBot)) {

    // --- A. SHOP DISH (New Rule - Specificity matters, check this before generic shop) ---
    // URL: /deeplink/shop/{username}/dish/{id}
    if (path.includes("/dish/")) {
      const parts = path.split("/dish/"); // ["/deeplink/shop/user", "12345"]
      const dishId = parts[1];
      if (dishId) targetUrl = `${API_URL}/dish/share/${dishId}`;
    }

    // --- B. MARKETPLACE AD ---
    else if (path.includes("/deeplink/ad/")) {
      const parts = path.split("/deeplink/ad/");
      const adId = parts[1];
      if (adId) targetUrl = `${API_URL}/market/share/${adId}`;
    }
    
    // --- C. SHOP PRODUCT (Global) ---
    // URL: /deeplink/shop/{username}/{productId} (No "dish" keyword)
    else if (path.startsWith("/deeplink/shop/") && path.split("/").length > 4) {
      const parts = path.split("/");
      const productId = parts[4]; 
      if (productId) targetUrl = `${API_URL}/global-product/share/${productId}`;
    }

    // --- D. SHOP PROFILE ---
    else if (path.startsWith("/deeplink/shop/")) {
      const parts = path.split("/deeplink/shop/");
      const username = parts[1]; 
      const cleanUsername = username ? username.replace(/\/$/, "") : null;
      if (cleanUsername) targetUrl = `${API_URL}/shop/share/${cleanUsername}`;
    }

    // --- E. BLOG ---
    else if (path.startsWith("/blog/")) {
      const slug = path.split("/blog/")[1];
      if (slug) targetUrl = `${API_URL}/feedback/share/${slug}`;
    }

    // --- F. ORDER ---
    else if (path.includes("/deeplink/order/")) {
      const parts = path.split("/deeplink/order/");
      const orderId = parts[1];
      if (orderId) targetUrl = `${API_URL}/share/order/${orderId}`;
    }

    // EXECUTE PROXY
    if (targetUrl) {
      try {
        console.log(`[Edge] Proxying to: ${targetUrl}`);
        const response = await fetch(targetUrl);
        if (response.ok) {
          return new Response(response.body, {
            headers: {
              "content-type": "text/html",
              "cache-control": "public, max-age=0, must-revalidate",
              "access-control-allow-origin": "*" 
            },
          });
        }
      } catch (error) {
        console.error("Proxy error:", error);
      }
    }
  }

  return context.next();
};