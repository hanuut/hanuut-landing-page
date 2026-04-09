import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled, { ThemeProvider } from 'styled-components';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { FaMapMarkerAlt, FaStore } from 'react-icons/fa';

// --- Components & Config ---
import Seo from '../../components/Seo';
import Loader from '../../components/Loader';
import { ShopCart } from '../Partners/components/ShopCart';
import { partnerTheme, light } from '../../config/Themes';

// --- Styled Components ---
const PageWrapper = styled.main`
  min-height: 100vh;
  background-color: ${(props) => props.theme.body};
  padding: calc(${(props) => props.theme.navHeight} + 2rem) 1rem 4rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const Container = styled.div`
  max-width: 1200px;
  width: 100%;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: ${(props) => props.theme.text};
  margin-bottom: 1rem;
  font-family: 'Tajawal', sans-serif;
  
  span {
    color: ${(props) => props.theme.primaryColor};
  }
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: ${(props) => props.theme.secondaryText || "#666"};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const ShopLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem;
  background: rgba(0,0,0,0.02);
  border-radius: 16px;
  
  svg {
    font-size: 3rem;
    color: #CCC;
    margin-bottom: 1rem;
  }
  
  h3 {
    font-size: 1.5rem;
    color: ${(props) => props.theme.text};
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #666;
  }
`;

const LocationDirectory = () => {
  const { domain, wilaya } = useParams();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Humanize URL parameters
  const formattedWilaya = wilaya ? wilaya.charAt(0).toUpperCase() + wilaya.slice(1).replace(/-/g, ' ') : '';
  
  // Translate the domain category
  let categoryName = t("shops", "Shops");
  if (domain === 'food') categoryName = t("restaurants", "Restaurants");
  if (domain === 'grocery') categoryName = t("supermarkets", "Supermarkets");
  if (domain === 'global') categoryName = t("online_stores", "Online Stores");

  // Dynamic SEO Strings
  const seoTitle = t("seo.explore_title", { 
    category: categoryName, 
    location: formattedWilaya,
    defaultValue: `${categoryName} in ${formattedWilaya} | Hanuut`
  });
  
  const seoDesc = t("seo.explore_desc", { 
    category: categoryName, 
    location: formattedWilaya,
    defaultValue: `Discover and order from the best ${categoryName.toLowerCase()} in ${formattedWilaya}. Fast delivery via Hanuut.`
  });

  const pageUrl = `https://hanuut.com/explore/${domain}/${wilaya}`;

  // Fetch Shops Logic
  useEffect(() => {
    const fetchLocalShops = async () => {
      setLoading(true);
      try {
        const prodUrl = process.env.REACT_APP_API_PROD_URL;
        // NOTE: This assumes your backend has an endpoint like this. 
        // See the prompt below for instructions to the backend dev.
        const response = await axios.get(`${prodUrl}/shop/directory/${domain}/${wilaya}`);
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

  // Determine theme (Use partnerTheme for a dark, premium look, or light for consumer)
  const currentTheme = domain === 'food' || domain === 'grocery' ? light : partnerTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <PageWrapper $isArabic={isArabic}>
        
        {/* INJECT DYNAMIC SEO */}
        <Seo 
          title={seoTitle} 
          description={seoDesc} 
          url={pageUrl} 
        />
        
        <Container>
          <Header>
            <Title>
              {categoryName} <span>{isArabic ? `في ${formattedWilaya}` : `in ${formattedWilaya}`}</span>
            </Title>
            <Description>
              <FaMapMarkerAlt style={{ color: currentTheme.primaryColor, marginRight: '8px' }} />
              {seoDesc}
            </Description>
          </Header>

          {loading ? (
            <Loader fullscreen={false} />
          ) : error ? (
            <EmptyState>
              <FaStore />
              <h3>{t("error_loading_directory", "Could not load shops.")}</h3>
              <p>{t("please_try_again", "Please try again later.")}</p>
            </EmptyState>
          ) : shops.length === 0 ? (
            <EmptyState>
              <FaStore />
              <h3>{t("no_shops_found", "No shops found.")}</h3>
              <p>{t("no_shops_in_area", { location: formattedWilaya, defaultValue: `We couldn't find any ${categoryName.toLowerCase()} in ${formattedWilaya} yet.` })}</p>
            </EmptyState>
          ) : (
            <Grid>
              {shops.map((shop) => {
                const cleanUsername = shop.username?.startsWith('@') ? shop.username : `@${shop.username}`;
                return (
                  <ShopLink to={`/${cleanUsername}`} key={shop._id}>
                    <ShopCart 
                      shop={shop} 
                      imageData={shop.imageId} 
                      className="headingShopCart" 
                      style={{ background: currentTheme.surface, border: `1px solid ${currentTheme.surfaceBorder}`, padding: '1rem', borderRadius: '16px' }}
                    />
                  </ShopLink>
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