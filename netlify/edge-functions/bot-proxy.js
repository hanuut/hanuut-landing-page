export default async (request, context) => {
  // 1. Get the User-Agent (Who is visiting? Chrome or Facebook Bot?)
  const userAgent = request.headers.get("user-agent") || "";
  const url = new URL(request.url);

  // 2. Define the regex for Bots (Facebook, Twitter, WhatsApp, LinkedIn, Discord, etc.)
  const botPattern = /facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|discordbot|slackbot|googlebot/i;

  // 3. Check if it is a Bot AND if it is a Blog URL
  if (botPattern.test(userAgent) && url.pathname.startsWith("/blog/")) {
    
    // 4. Extract the slug from the URL (e.g., /blog/my-post -> my-post)
    const slug = url.pathname.split("/blog/")[1];
    
    // If no slug (just /blog), let React handle it
    if (!slug) return context.next();

    // 5. Define your API URL (The Backend Endpoint we created)
    // REPLACE THIS WITH YOUR REAL NESTJS API URL
    const API_URL = "https://api.hanuut.com"; 
    
    const targetUrl = `${API_URL}/feedback/share/${slug}`;

    try {
      console.log(`Bot detected! Proxying to: ${targetUrl}`);
      
      // 6. Fetch the HTML from your NestJS Backend
      const response = await fetch(targetUrl);
      
      // 7. If API returns 200, serve that HTML to the Bot
      if (response.ok) {
        return new Response(response.body, {
          headers: {
            "content-type": "text/html",
            // Important: Cache control to ensure Facebook doesn't cache broken previews
            "cache-control": "public, max-age=0, must-revalidate" 
          },
        });
      }
    } catch (error) {
      console.error("Error fetching preview from API:", error);
    }
  }

  // 8. If it's a Human (or the API failed), serve the normal React App
  return context.next();
};