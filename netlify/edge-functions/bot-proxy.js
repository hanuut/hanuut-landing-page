export default async (request, context) => {
  const userAgent = request.headers.get("user-agent") || "";
  const url = new URL(request.url);
  const path = url.pathname;
  
  const API_URL = "https://api.hanuut.com"; 
  let targetUrl = null;

  // Bot Detection
  const botPattern = /facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|discordbot|slackbot|googlebot/i;
  const isBot = botPattern.test(userAgent);
  const isDeepLink = path.startsWith("/deeplink/");

  // === 1. Short Shop Link (/@username) ===
  if (path.startsWith("/@") && isBot) {
    const username = path.substring(1); // removes "/" -> "@username"
    targetUrl = `${API_URL}/shop/share/${encodeURIComponent(username)}`;
  }

  // === 2. Long Shop Link (/shop/@username) ===
  // This catches the bot AFTER the redirect shown in your screenshot
  else if (path.startsWith("/shop/") && path.includes("@") && isBot) {
    const parts = path.split("/shop/"); 
    const username = parts[1].replace(/\/$/, ""); // Get "@username" and remove trailing slash
    targetUrl = `${API_URL}/shop/share/${encodeURIComponent(username)}`;
  }

  // === 3. Blog Posts ===
  else if (path.startsWith("/blog/") && isBot) {
    const slug = path.split("/blog/")[1];
    if (slug) targetUrl = `${API_URL}/feedback/share/${slug}`;
  }

  // === 4. Deep Links (Everyone) ===
  else if (isDeepLink) {
    if (path.includes("/dish/")) {
      const parts = path.split("/dish/");
      const dishId = parts[1];
      if (dishId) targetUrl = `${API_URL}/dish/share/${dishId}`;
    }
    else if (path.includes("/deeplink/ad/")) {
      const parts = path.split("/deeplink/ad/");
      const adId = parts[1];
      if (adId) targetUrl = `${API_URL}/market/share/${adId}`;
    }
    else if (path.startsWith("/deeplink/shop/") && path.split("/").length > 4) {
      const parts = path.split("/");
      const productId = parts[4]; 
      if (productId) targetUrl = `${API_URL}/global-product/share/${productId}`;
    }
    else if (path.startsWith("/deeplink/shop/")) {
      const parts = path.split("/deeplink/shop/");
      const username = parts[1]?.replace(/\/$/, "");
      if (username) targetUrl = `${API_URL}/shop/share/${encodeURIComponent(username)}`;
    }
    else if (path.includes("/deeplink/order/")) {
      const parts = path.split("/deeplink/order/");
      const orderId = parts[1];
      if (orderId) targetUrl = `${API_URL}/share/order/${orderId}`;
    }
  }

  // Execute Proxy
  if (targetUrl) {
    try {
      console.log(`[Edge] Proxying ${url.href} to ${targetUrl}`);
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
      console.error("[Edge] Proxy error:", error);
    }
  }

  return context.next();
};