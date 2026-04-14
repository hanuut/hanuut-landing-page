import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styled, { ThemeProvider } from "styled-components";
import axios from "axios";
import { FaMapMarkerAlt, FaStore, FaStar } from "react-icons/fa";

import { motion, AnimatePresence } from "framer-motion";
// --- Components & Config ---
import Seo from "../../components/Seo";
import Loader from "../../components/Loader";
import { partnerTheme, light } from "../../config/Themes";
import { getImageUrl } from "../../utils/imageUtils"; // Using our fast image hook

// --- Styled Components ---
const PageWrapper = styled.main`
  min-height: 100vh;
  background-color: ${(props) => props.theme.body};
  padding: calc(${(props) => props.theme.navHeight} + 3rem) 1rem 4rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  @media (max-width: 768px) {
    padding-top: 6rem;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  width: 100%;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled.h1`
  font-size: clamp(2rem, 5vw, 2.5rem);
  font-weight: 800;
  color: ${(props) => props.theme.text};
  margin-bottom: 1rem;
  font-family: "Tajawal", sans-serif;

  span {
    color: ${(props) => props.theme.primaryColor};
  }
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  font-family: "Cairo", sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
`;

const ShopCard = styled(motion.div)`
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: 100%;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 180px;
  background-color: #f3f4f6;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RatingBadge = styled.div`
  position: absolute;
  top: 12px;
  ${(props) => (props.$isArabic ? "left: 12px;" : "right: 12px;")}
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  padding: 4px 10px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.85rem;
  color: #111;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  svg {
    color: #ffb547;
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};
`;

const ShopName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111217;
  margin-bottom: 0.5rem;
  font-family: "Tajawal", sans-serif;
`;

const ShopDesc = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  font-family: "Cairo", sans-serif;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardFooter = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #9ca3af;
  border-top: 1px solid #f3f4f6;
  padding-top: 1rem;
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    color: ${(props) => props.theme.primaryColor};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 20px;
  width: 100%;

  svg {
    font-size: 3rem;
    color: #ccc;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.5rem;
    color: #111;
    margin-bottom: 0.5rem;
  }
`;

// --- MAIN COMPONENT ---
const LocationDirectory = () => {
  const { domain, wilaya } = useParams();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. DYNAMIC TRANSLATION OF CATEGORIES (To fix the English words in Arabic sentences)
  const categoryMap = {
    food: { en: "Restaurants", fr: "Restaurants", ar: "مطاعم" },
    grocery: { en: "Supermarkets", fr: "Supermarchés", ar: "محلات البقالة" },
    global: {
      en: "Online Stores",
      fr: "Boutiques en Ligne",
      ar: "المتاجر الإلكترونية",
    },
  };

  const categoryName = categoryMap[domain]
    ? categoryMap[domain][i18n.language]
    : t("shops", "Shops");
  const formattedWilaya = wilaya
    ? wilaya.charAt(0).toUpperCase() + wilaya.slice(1).replace(/-/g, " ")
    : "";

  const seoTitle = t("seo.explore_title", {
    category: categoryName,
    location: formattedWilaya,
    defaultValue: `${categoryName} in ${formattedWilaya} | Hanuut`,
  });

  const seoDesc = t("seo.explore_desc", {
    category: categoryName,
    location: formattedWilaya,
    defaultValue: `Discover and order from the best ${categoryName.toLowerCase()} in ${formattedWilaya}.`,
  });

  useEffect(() => {
    const fetchLocalShops = async () => {
      setLoading(true);
      try {
        const prodUrl = process.env.REACT_APP_API_PROD_URL;
        // Fetching from the new optimized multilingual API endpoint we requested
        const response = await axios.get(
          `${prodUrl}/shop/directory/${domain}/${wilaya}`,
        );
        setShops(response.data);
      } catch (err) {
        console.error("Failed to fetch directory:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (domain && wilaya) {
      fetchLocalShops();
    }
  }, [domain, wilaya]);

  const currentTheme =
    domain === "food" || domain === "grocery" ? light : partnerTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <PageWrapper $isArabic={isArabic}>
        <Seo
          title={seoTitle}
          description={seoDesc}
          url={`https://hanuut.com/explore/${domain}/${wilaya}`}
        />

        <Container>
          <Header>
            <Title>
              {isArabic ? (
                <>
                  أفضل <span>{categoryName}</span> في {formattedWilaya}
                </>
              ) : (
                <>
                  Best <span>{categoryName}</span> in {formattedWilaya}
                </>
              )}
            </Title>
            <Description>
              <FaMapMarkerAlt />
              {seoDesc}
            </Description>
          </Header>

          {loading ? (
            <div
              style={{
                height: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Loader fullscreen={false} />
            </div>
          ) : error || shops.length === 0 ? (
            <EmptyState>
              <FaStore />
              <h3>{t("no_shops_found", "No shops found.")}</h3>
              <p>
                {t("no_shops_in_area", {
                  location: formattedWilaya,
                  defaultValue: `We couldn't find any ${categoryName.toLowerCase()} in ${formattedWilaya} yet.`,
                })}
              </p>
            </EmptyState>
          ) : (
            <Grid>
              {shops.map((shop) => {
                const cleanUsername = shop.username?.startsWith('@') ? shop.username : `@${shop.username}`;
                
                // --- THE FIX: Robust Image URL Resolution ---
                // We construct the absolute URL to the RAW endpoint.
                // This guarantees the browser caches the image and doesn't loop.
                const prodUrl = process.env.REACT_APP_API_PROD_URL || "https://api.hanuut.com";
                let logoUrl = "https://hanuut.com/static/default-shop.png"; // Fallback
                
                if (shop.imageId) {
                   // If it's already a full HTTP URL, use it directly
                   if (typeof shop.imageId === 'string' && shop.imageId.startsWith('http')) {
                     logoUrl = shop.imageId;
                   } 
                   // If it's a MongoDB ID, point it to the raw endpoint
                   else if (typeof shop.imageId === 'string') {
                     logoUrl = `${prodUrl}/image/raw/${shop.imageId}`;
                   }
                }
                
                return (
                  <Link to={`/${cleanUsername}`} key={shop._id} style={{ textDecoration: 'none' }}>
                    <ShopCard
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <ImageWrapper>
                        <img 
                          src={logoUrl} 
                          alt={shop.name} 
                          loading="lazy" // <-- IMPORTANT: Defers loading off-screen images to save bandwidth
                          onError={(e) => {
                            // Prevent infinite loops if the fallback itself fails
                            if (e.target.src !== "https://hanuut.com/static/default-shop.png") {
                               e.target.src = "https://hanuut.com/static/default-shop.png";
                            }
                          }}
                        />
                        {shop.rating > 0 && (
                          <RatingBadge $isArabic={isArabic}>
                            <FaStar /> {shop.rating.toFixed(1)}
                          </RatingBadge>
                        )}
                      </ImageWrapper>

                      <CardContent $isArabic={isArabic}>
                        <ShopName>{shop.name}</ShopName>
                        <ShopDesc>
                          {shop.description || "Visit this shop on Hanuut."}
                        </ShopDesc>

                        <CardFooter>
                          <LocationInfo theme={currentTheme}>
                            <FaMapMarkerAlt />
                            <span>
                              {shop.addressId?.commune || formattedWilaya}
                            </span>
                          </LocationInfo>
                          <span>{t("view", "View")}</span>
                        </CardFooter>
                      </CardContent>
                    </ShopCard>
                  </Link>
                );
              })}
            </Grid>
          )}
        </Container>
      </PageWrapper>
    </ThemeProvider>
  );
};

export default LocationDirectory;
