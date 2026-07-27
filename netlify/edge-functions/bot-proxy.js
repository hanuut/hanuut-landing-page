export default async (request, context) => {
  const userAgent = request.headers.get("user-agent") || "";
  const url = new URL(request.url);
  const path = url.pathname;

  // 1. Bot Detection (Expanded to include major Search & AI crawler engines)
  const botPattern = /facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|discordbot|slackbot|googlebot|bingbot|applebot|duckduckbot|yandex|petalbot|gptbot|oai-searchbot|perplexitybot|claudebot|ccbot|amazonbot/i;
  const isBot = botPattern.test(userAgent);
  
  if (!isBot) {
    return context.next();
  }

  const API_URL = "https://api.hanuut.com"; 
  let targetUrl = null;

  if (path.startsWith("/@")) {
    const parts = path.split("/"); 
    const username = parts[1].substring(1); 
    targetUrl = `${API_URL}/shop/share/${encodeURIComponent(username)}`;
  }
  else if (path.startsWith("/shop/") && path.includes("@")) {
    const parts = path.split("/shop/"); 
    const username = parts[1].replace(/\/$/, "");
    targetUrl = `${API_URL}/shop/share/${encodeURIComponent(username)}`;
  }
  // === 🔴 NEW: AURAS LAB Storefront + SKU routing ===
  else if (path === "/aurasLab" || path === "/aurasLab/") {
    targetUrl = `${API_URL}/shop/share/aurasLab`;
  }
  else if (path.startsWith("/aurasLab/")) {
    const sku = path.split("/aurasLab/")[1]?.replace(/\/$/, "");
    if (sku) targetUrl = `${API_URL}/global-product/share-by-sku/${encodeURIComponent(sku)}`;
  }
  else if (path.startsWith("/blog/")) {
    const slug = path.split("/blog/")[1];
    if (slug) targetUrl = `${API_URL}/feedback/share/${slug}`;
  }
  else if (path.startsWith("/deeplink/")) {
    if (path.includes("/dish/")) {
      const dishId = path.split("/dish/")[1];
      if (dishId) targetUrl = `${API_URL}/dish/share/${dishId}`;
    }
    else if (path.includes("/deeplink/ad/")) {
      const adId = path.split("/deeplink/ad/")[1];
      if (adId) targetUrl = `${API_URL}/market/share/${adId}`;
    }
    else if (path.startsWith("/deeplink/shop/") && path.split("/").length > 4) {
      const productId = path.split("/")[4]; 
      if (productId) targetUrl = `${API_URL}/global-product/share/${productId}`;
    }
    else if (path.startsWith("/deeplink/shop/")) {
      const username = path.split("/deeplink/shop/")[1]?.replace(/\/$/, "");
      if (username) targetUrl = `${API_URL}/shop/share/${encodeURIComponent(username)}`;
    }
    else if (path.includes("/deeplink/order/")) {
      const orderId = path.split("/deeplink/order/")[1];
      if (orderId) targetUrl = `${API_URL}/share/order/${orderId}`;
    }
  }

  if (targetUrl) {
    try {
      console.log(`[Edge] Proxying Bot ${url.href} to ${targetUrl}`);
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