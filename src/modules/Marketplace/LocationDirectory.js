import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styled, { ThemeProvider } from "styled-components";
import axios from "axios";
import { FaMapMarkerAlt, FaStore, FaStar, FaPlusCircle } from "react-icons/fa";
import { motion } from "framer-motion";

import Seo from "../../components/Seo";
import Loader from "../../components/Loader";
import { partnerTheme, light } from "../../config/Themes";
import { getImageUrl } from "../../utils/imageUtils";

const PageWrapper = styled.main`
  min-height: 100vh;
  background-color: ${(props) => props.theme.body};
  padding: calc(${(props) => props.theme.navHeight} + 3rem) 1rem 4rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
  @media (max-width: 768px) { padding-top: 6rem; }
`;
const Container = styled.div` max-width: 1200px; width: 100%; `;
const Header = styled.header` text-align: center; margin-bottom: 4rem; `;
const Title = styled.h1`
  font-size: clamp(2rem, 5vw, 2.5rem);
  font-weight: 800;
  color: ${(props) => props.theme.text};
  margin-bottom: 1rem;
  font-family: "Tajawal", sans-serif;
  span { color: ${(props) => props.theme.primaryColor}; }
`;
const Description = styled.p`
  font-size: 1.1rem;
  color: #666;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
  font-family: "Cairo", sans-serif;
  display: flex; align-items: center; justify-content: center; gap: 8px;
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
  display: flex; flex-direction: column; height: 100%;
  transition: transform 0.2s ease;
  &:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08); }
`;
const ImageWrapper = styled.div`
  width: 100%; height: 180px; background-color: #f3f4f6; position: relative;
  img { width: 100%; height: 100%; object-fit: cover; }
`;
const RatingBadge = styled.div`
  position: absolute; top: 12px; ${(props) => (props.$isArabic ? "left: 12px;" : "right: 12px;")}
  background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(4px); padding: 4px 10px; border-radius: 50px;
  font-weight: 700; font-size: 0.85rem; color: #111; display: flex; align-items: center; gap: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); svg { color: #ffb547; }
`;
const CardContent = styled.div` padding: 1.5rem; display: flex; flex-direction: column; flex: 1; text-align: start; `;
const ShopName = styled.h3` font-size: 1.25rem; font-weight: 700; color: #111217; margin-bottom: 0.5rem; font-family: "Tajawal", sans-serif; `;
const ShopDesc = styled.p` font-size: 0.9rem; color: #6b7280; line-height: 1.5; margin-bottom: 1.5rem; font-family: "Cairo", sans-serif; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; `;
const CardFooter = styled.div` margin-top: auto; display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 1rem; `;
const LocationInfo = styled.div` display: flex; align-items: center; gap: 4px; svg { color: ${(props) => props.theme.primaryColor}; } `;
const AddShopCard = styled(Link)`
  background: rgba(57, 161, 112, 0.03);
  border: 2px dashed rgba(57, 161, 112, 0.4);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  /* THE FIX: Matches Grid height exactly */
  height: 100%; 
  box-sizing: border-box;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(57, 161, 112, 0.08);
    border-color: #39A170;
    transform: translateY(-5px);
  }

  svg {
    font-size: 3rem;
    color: #39A170;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111217;
    margin-bottom: 0.5rem;
    font-family: 'Tajawal', sans-serif;
  }

  p {
    font-size: 0.95rem;
    color: #6b7280;
    line-height: 1.5;
    font-family: 'Cairo', sans-serif;
  }
`;

const DirectoryShopCard = ({ shop, isArabic, currentTheme, formattedWilaya }) => {
  const { t } = useTranslation();

  // The updated getImageUrl logic handles the string buffer inside shop.imageId automatically
  const logoUrl = useMemo(() => getImageUrl(shop.imageId), [shop.imageId]);
  
  const communeName = isArabic 
    ? (shop.address?.communeTranslated || shop.address?.commune) 
    : (shop.address?.commune || formattedWilaya);

  const cleanUsername = shop.username?.startsWith("@") ? shop.username : `@${shop.username}`;

  return (
    <Link to={`/${cleanUsername}`} style={{ textDecoration: "none" }}>
      <ShopCard initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <ImageWrapper>
          {logoUrl ? (
            <img src={logoUrl} alt={shop.name} loading="lazy" />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#eee" }}>
              <FaStore size={32} color="#ccc" />
            </div>
          )}
          {shop.rating > 0 && (
            <RatingBadge $isArabic={isArabic}><FaStar /> {shop.rating.toFixed(1)}</RatingBadge>
          )}
        </ImageWrapper>
        <CardContent>
          <ShopName>{shop.name}</ShopName>
          <ShopDesc>{shop.description || "Visit this shop on Hanuut."}</ShopDesc>
          <CardFooter>
            <LocationInfo theme={currentTheme}>
              <FaMapMarkerAlt />
              <span>{communeName}</span>
            </LocationInfo>
            <span style={{ fontWeight: 700, color: currentTheme.primaryColor }}>{t("view")}</span>
          </CardFooter>
        </CardContent>
      </ShopCard>
    </Link>
  );
};

const LocationDirectory = () => {
    const { domain, wilaya } = useParams();
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
  
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
  
    const categoryMap = {
      food: { en: "Restaurant", ar: "مطعم", pluralEn: "Restaurants", pluralAr: "مطاعم" },
      grocery: { en: "Supermarket", ar: "محل بقالة", pluralEn: "Supermarkets", pluralAr: "محلات بقالة" },
      global: { en: "Online Store", ar: "متجر إلكتروني", pluralEn: "Online Stores", pluralAr: "متاجر إلكترونية" },
    };
  
    const categoryName = categoryMap[domain] ? categoryMap[domain][i18n.language] : "Shop";
    const pluralCategory = categoryMap[domain] ? (isArabic ? categoryMap[domain].pluralAr : categoryMap[domain].pluralEn) : "Shops";
    const formattedWilaya = wilaya ? wilaya.charAt(0).toUpperCase() + wilaya.slice(1).replace(/-/g, ' ') : "";
  
    useEffect(() => {
      const fetchShops = async () => {
        setLoading(true);
        try {
          const res = await axios.get(`${process.env.REACT_APP_API_PROD_URL}/shop/directory/${domain}/${wilaya}`);
          setShops(res.data);
        } catch (err) { console.error(err); }
        setLoading(false);
      };
      if (domain && wilaya) fetchShops();
    }, [domain, wilaya]);
  
    const currentTheme = (domain === "food" || domain === "grocery") ? light : partnerTheme;
  
    const displayList = useMemo(() => {
      const list = [...shops];
      if (!loading) {
        const idx = Math.min(list.length, 2);
        list.splice(idx, 0, { isFakeAd: true, _id: 'fake-ad' });
      }
      return list;
    }, [shops, loading]);
  
    return (
      <ThemeProvider theme={currentTheme}>
        <PageWrapper $isArabic={isArabic}>
          <Seo title={`${pluralCategory} in ${formattedWilaya}`} description={t("explore_desc", { category: pluralCategory, location: formattedWilaya })} />
          <Container>
            <Header>
              <Title>
                {isArabic ? <>أفضل <span>{pluralCategory}</span> في {formattedWilaya}</> : <>Best <span>{pluralCategory}</span> in {formattedWilaya}</>}
              </Title>
              <Description>
                <FaMapMarkerAlt />
                {t("explore_desc", { category: pluralCategory, location: formattedWilaya })}
              </Description>
            </Header>
            {loading ? (
              <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Loader fullscreen={false} />
              </div>
            ) : (
              <Grid>
                {displayList.map((item) => (
                  item.isFakeAd ? (
                    <motion.div
                        key={item._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        style={{ height: '100%' }} // Ensures wrapper fills grid height
                      >
                        <AddShopCard to="/partners/onboarding">
                          <FaPlusCircle />
                          <h3>{t("directory_add_shop_title", { category: categoryName })}</h3>
                          <p>{t("directory_add_shop_desc")}</p>
                        </AddShopCard>
                      </motion.div>
                  ) : (
                    <DirectoryShopCard key={item._id} shop={item} isArabic={isArabic} currentTheme={currentTheme} formattedWilaya={formattedWilaya} />
                  )
                ))}
              </Grid>
            )}
          </Container>
        </PageWrapper>
      </ThemeProvider>
    );
  };
  
export default LocationDirectory;