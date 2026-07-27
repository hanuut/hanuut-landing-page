const buildJsonLdBlock = (schema) => {
  if (!schema) return "";
  const json = JSON.stringify(schema).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
};

export default async (request, context) => {
  const url = new URL(request.url);
  const path = url.pathname;

  let metaData = {
    title: "Hanuut | The Digital Ecosystem for E-commerce & Mobility",
    description:
      "Hanuut connects shops, customers, and drivers in Algeria. Shop local, manage your business, or drive with us.",
    image: `${url.origin}/logoPic.png`,
    url: url.href,
    jsonLdBlock: "",
  };

  if (path.startsWith("/tawsila") || path.startsWith("/abrid")) {
    metaData.title = "Abridh | Réseau Privé de Mobilité Communautaire";
    metaData.description =
      "Rejoignez la phase expérimentale d'Abridh. Un réseau privé à accès limité pour coordonner vos déplacements en Algérie.";
    metaData.image = `${url.origin}/static/abridh.png`;
  } else if (path.startsWith("/esuuq")) {
    metaData.title = "eSUUQ | Achat, Vente et Livraison en Algérie";
    metaData.description =
      "La marketplace n°1 en Algérie. Commandez vos repas, faites vos courses ou vendez vos objets d'occasion.";
    metaData.image = `${url.origin}/static/esuuq.png`;
  } else if (path.startsWith("/partners")) {
    metaData.title = "My Hanuut | Logiciel de Caisse & Boutique en Ligne";
    metaData.description =
      "Numérisez votre commerce gratuitement. Menu digital, gestion de stock par code-barres et site e-commerce.";
    metaData.image = `${url.origin}/static/my-hanuut.png`;
  } else if (path.startsWith("/explore")) {
    metaData.title = "Explore Local Shops | Hanuut";
    metaData.description =
      "Discover and order from the best shops and restaurants in your city.";
  }
  // --- NEW: AURAS LAB storefront ---
  else if (path === "/aurasLab" || path === "/aurasLab/") {
    metaData.title = "AURAS LAB | Custom Print-On-Demand Streetwear in Algeria";
    metaData.description =
      "Design your own hoodies, tees, totes and more. Upload your artwork, customize it live, and we print and ship anywhere in Algeria.";
    metaData.image = `${url.origin}/static/auras-lab.png`;
  }
  // --- NEW: AURAS LAB individual product pages ---
  else if (path.startsWith("/aurasLab/")) {
    const sku = path.split("/aurasLab/")[1]?.replace(/\/$/, "");
    if (sku) {
      try {
        const apiResponse = await fetch(
          `https://api.hanuut.com/global-product/slug/${encodeURIComponent(sku)}`,
        );
        if (apiResponse.ok) {
          const product = await apiResponse.json();
          const imgId =
            product?.availabilities?.[0]?.imageId || product?.images?.[0];
          const imageUrl = imgId
            ? `https://api.hanuut.com/image/raw/${imgId}`
            : metaData.image;
          const prices = (product?.availabilities || [])
            .flatMap((av) => (av.sizes || []).map((s) => s.sellingPrice))
            .filter((p) => typeof p === "number" && p > 0);

          if (product?.name) metaData.title = `${product.name} | AURAS LAB`;
          if (product?.shortDescription)
            metaData.description = product.shortDescription;
          metaData.image = imageUrl;
          metaData.jsonLdBlock = buildJsonLdBlock({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product?.name,
            brand: { "@type": "Brand", name: "AURAS LAB" },
            description: product?.shortDescription || product?.name,
            image: imageUrl,
            offers: prices.length
              ? {
                  "@type": "AggregateOffer",
                  priceCurrency: "DZD",
                  lowPrice: Math.min(...prices),
                  highPrice: Math.max(...prices),
                  offerCount: prices.length,
                  availability: "https://schema.org/InStock",
                }
              : undefined,
          });
        }
      } catch (error) {
        console.log(
          "Edge Function: Failed to fetch AURAS LAB product, falling back to default meta.",
        );
      }
    }
  }

  const adPattern = new URLPattern({ pathname: "/deeplink/ad/:adId" });
  const adMatch = adPattern.exec(url);

  if (adMatch) {
    const adId = adMatch.pathname.groups.adId;
    const API_URL = "https://api.hanuut.com";
    try {
      const apiResponse = await fetch(`${API_URL}/market/ads/${adId}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (apiResponse.ok) {
        const adData = await apiResponse.json();
        if (adData.name) metaData.title = `${adData.name} | Hanuut Market`;
        if (adData.shortDescription)
          metaData.description = adData.shortDescription;
        if (adData.images && adData.images.length > 0) {
          metaData.image = `${API_URL}/image/raw/${adData.images[0]}`;
        }
      }
    } catch (error) {
      console.log(
        "Edge Function: Failed to fetch ad data, falling back to default meta.",
      );
    }
  }

  const response = await context.next();
  const pageHtml = await response.text();

  const updatedHtml = pageHtml
    .replaceAll("__META_TITLE__", metaData.title)
    .replaceAll("__META_DESCRIPTION__", metaData.description)
    .replaceAll("__META_IMAGE__", metaData.image)
    .replaceAll("__META_URL__", metaData.url)
    .replaceAll("<!-- __META_JSONLD_BLOCK__ -->", metaData.jsonLdBlock);

  return new Response(updatedHtml, {
    headers: response.headers,
    status: response.status,
  });
};

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
    "/.well-known/*",
  ],
};
