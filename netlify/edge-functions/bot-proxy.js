export default async (request, context) => {
  const userAgent = request.headers.get("user-agent") || "";
  const url = new URL(request.url);
  
  // Detect Bots (Facebook, Twitter, WhatsApp, etc)
  const botPattern = /facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|discordbot|slackbot|googlebot/i;

  // Only run this if it's a BOT visiting a /blog/ page
  if (botPattern.test(userAgent) && url.pathname.startsWith("/blog/")) {
    
    const slug = url.pathname.split("/blog/")[1];
    if (!slug) return context.next();

    // 1. POINT TO YOUR LIVE API
    const API_URL = "https://api.hanuut.com"; 
    
    // 2. CONSTRUCT THE BACKEND URL (Must match your Controller!)
    const targetUrl = `${API_URL}/feedback/share/${slug}`;

    try {
      console.log(`Bot detected! Proxying to: ${targetUrl}`);
      
      const response = await fetch(targetUrl);
      
      if (response.ok) {
        // Serve the HTML directly to the bot
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

  // Humans go to React
  return context.next();
};