export default async (request, context) => {
  const userAgent = request.headers.get("user-agent") || "";
  const url = new URL(request.url);
  const botPattern = /facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|discordbot|slackbot|googlebot/i;

  if (botPattern.test(userAgent)) {
    const API_URL = "https://api.hanuut.com"; 
    let targetUrl = null;

    // RULE 1: Blog Posts
    if (url.pathname.startsWith("/blog/")) {
      const slug = url.pathname.split("/blog/")[1];
      if (slug) targetUrl = `${API_URL}/feedback/share/${slug}`;
    }

    // RULE 2: Marketplace Ads (NEW)
    // Matches /deeplink/ad/12345
    else if (url.pathname.includes("/deeplink/ad/")) {
      const parts = url.pathname.split("/deeplink/ad/");
      const adId = parts[1];
      if (adId) targetUrl = `${API_URL}/market/share/${adId}`;
    }

    // If we found a match, fetch from API
    if (targetUrl) {
      try {
        console.log(`Bot detected! Proxying to: ${targetUrl}`);
        const response = await fetch(targetUrl);
        if (response.ok) {
          return new Response(response.body, {
            headers: {
              "content-type": "text/html",
              "cache-control": "public, max-age=0, must-revalidate" 
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