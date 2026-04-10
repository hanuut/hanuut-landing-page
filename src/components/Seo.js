import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

/**
 * Universal SEO & Structured Data Component
 */
const Seo = ({ title, description, url, image, shop, product, customSchema }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  let structuredData = null;

  if (shop) {
    const domainKeyword = shop.domainId?.keyword || 'global';
    const isFood = domainKeyword === 'food';
    const isGlobal = domainKeyword === 'global';
    
    // --- UPDATED LOGIC TO HANDLE FULL ADDRESS OBJECT ---
    const commune = shop.addressId?.commune || "";
    const wilaya = shop.addressId?.wilaya || "Algeria";
    const streetAddress = shop.addressId?.neighborhood || commune;
    const postalCode = shop.addressId?.postCode || "05000"; // Fallback to Batna's postal code
    
    let schemaType = "LocalBusiness";
    if (isFood) schemaType = "Restaurant";
    if (isGlobal) schemaType = "Store"; 

    structuredData = {
      "@context": "https://schema.org",
      "@type": schemaType,
      "name": shop.name,
      "image": image,
      "@id": url,
      "url": url,
      // --- UPDATED TELEPHONE LOGIC ---
      "telephone": shop.ownerId?.phoneNumber || "",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": streetAddress, // <-- NEW
        "addressLocality": commune,
        "postalCode": postalCode,     // <-- NEW
        "addressRegion": wilaya,
        "addressCountry": "DZ"
      },
      "geo": (!isGlobal && shop.addressId?.latitude) ? {
        "@type": "GeoCoordinates",
        "latitude": shop.addressId.latitude,
        "longitude": shop.addressId.longitude
      } : undefined,
      "servesCuisine": isFood ? "Algerian, Fast Food, Local" : undefined,
      "aggregateRating": shop.numReviews > 0 ? {
        "@type": "AggregateRating",
        "ratingValue": shop.rating > 0 ? shop.rating : 4.5,
        "reviewCount": shop.numReviews
      } : undefined,
      "areaServed": isGlobal ? {
        "@type": "Country",
        "name": "Algeria"
      } : {
        "@type": "City",
        "name": commune
      }
    };
  }

  // ... (Product Schema remains the same as previously defined)
  if (product) {
    structuredData = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name || product.nameFr,
      "image": image,
      "description": product.description || product.shortDescription,
      "brand": {
        "@type": "Brand",
        "name": product.brand || shop?.name || "Hanuut"
      },
      "offers": {
        "@type": "Offer",
        "url": url,
        "priceCurrency": "DZD",
        "price": product.sellingPrice || 0,
        "availability": "https://schema.org/InStock",
        // NEW: Shipping details can be added here later if needed
      }
    };
  }

  return (
    <Helmet htmlAttributes={{ lang: currentLang }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      {url && <link rel="canonical" href={url} />}

      <meta property="og:type" content={shop ? "profile" : "website"} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Inject Structured Data */}
      {(structuredData || customSchema) && (
        <script 
          type="application/ld+json" 
          dangerouslySetInnerHTML={{ __html: JSON.stringify(customSchema || structuredData) }} 
        />
      )}
    </Helmet>
  );
};

export default Seo;