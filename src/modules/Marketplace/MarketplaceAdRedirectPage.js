import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import styled, { ThemeProvider, keyframes } from "styled-components";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaUserCircle, FaGavel, FaTag, FaShareAlt } from "react-icons/fa";

// --- Imports ---
import { fetchAdById, selectMarketplace } from "./state/reducers";
import DeepLinkRedirect from "../../components/DeepLinkRedirect";
import Loader from "../../components/Loader";
import ButtonWithIcon from "../../components/ButtonWithIcon";
import Playstore from "../../assets/playstore.webp";
import { getImageUrl } from "../../utils/imageUtils";
import { getImage } from "../Images/services/imageServices";

// --- Theme for Marketplace (Green/Light) ---
const marketTheme = {
  primaryColor: "#39A170", // Hanuut Green
  secondaryColor: "#F07A48", // Orange Accent
  body: "#F8F9FA", // Clean White/Grey
  text: "#111217",
  surface: "#FFFFFF",
  border: "rgba(57, 161, 112, 0.15)",
  shadow: "0 20px 40px -10px rgba(57, 161, 112, 0.15)",
  navHeight: "5rem",
  defaultRadius: "20px",
};

// --- Styled Components ---

const PageWrapper = styled.main`
  width: 100%;
  min-height: 100vh;
  background-color: ${(props) => props.theme.body};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0;
    align-items: flex-start;
    background: white;
  }
`;

const AdContainer = styled(motion.div)`
  width: 100%;
  max-width: 1100px;
  background: ${(props) => props.theme.surface};
  border-radius: 32px;
  box-shadow: ${(props) => props.theme.shadow};
  overflow: hidden;
  display: flex;
  min-height: 600px;
  border: 1px solid rgba(0,0,0,0.05);

  @media (max-width: 900px) {
    flex-direction: column;
    border-radius: 0;
    box-shadow: none;
    border: none;
  }
`;

// Left Side: Image
const ImageSection = styled.div`
  flex: 1.2;
  position: relative;
  background-color: #f0f2f5;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  @media (max-width: 900px) {
    height: 40vh;
    flex: none;
  }
`;

const OverlayBadge = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 50px;
  font-weight: 700;
  color: ${(props) => props.theme.primaryColor};
  font-size: 0.9rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 2;
`;

// Right Side: Details
const DetailsSection = styled.div`
  flex: 1;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};

  @media (max-width: 900px) {
    padding: 1.5rem;
    justify-content: flex-start;
    background: white;
    border-radius: 30px 30px 0 0;
    margin-top: -40px; /* Overlap effect */
    position: relative;
    z-index: 5;
  }
`;

const CategoryPill = styled.span`
  font-size: 0.85rem;
  color: #71717a;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Title = styled.h1`
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 800;
  color: ${(props) => props.theme.text};
  margin: 0;
  line-height: 1.2;
  font-family: 'Tajawal', sans-serif;
`;

const PriceTag = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${(props) => props.theme.primaryColor};
  display: flex;
  align-items: center;
  gap: 10px;

  span.currency {
    font-size: 1rem;
    color: #71717a;
    font-weight: 500;
  }
`;

const SellerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  width: fit-content;
`;

const SellerAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  overflow: hidden;
  
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const LocationText = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #71717a;
  font-size: 0.95rem;
  margin-top: -0.5rem;
`;

const Description = styled.p`
  color: #52525b;
  line-height: 1.6;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const ButtonContainer = styled.div`
  margin-top: 1rem;
  width: 100%;
  
  button {
    width: 100%;
    justify-content: center;
    background-color: ${(props) => props.theme.text} !important; /* Black Button */
    height: 56px;
    
    &:hover {
      background-color: ${(props) => props.theme.primaryColor} !important; /* Green on Hover */
    }
  }
`;

const MarketplaceAdRedirectPage = ({ appConfig }) => {
  const { adId } = useParams();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const { selectedAd, loading } = useSelector(selectMarketplace);
  
  // --- Image Logic ---
  const [imageBuffer, setImageBuffer] = useState(null);
  
  // 1. Fetch Ad Data
  useEffect(() => {
    if (adId) {
      dispatch(fetchAdById(adId));
    }
  }, [dispatch, adId]);

  // 2. Fetch Main Image Buffer
  useEffect(() => {
    let isMounted = true;
    if (selectedAd?.images && selectedAd.images.length > 0) {
      getImage(selectedAd.images[0])
        .then(res => {
           if(isMounted && res.data) setImageBuffer(res.data);
        })
        .catch(err => console.error(err));
    }
    return () => { isMounted = false; };
  }, [selectedAd]);

  const imageUrl = useMemo(() => getImageUrl(imageBuffer), [imageBuffer]);

  // 3. Redirect Logic (Triggered by Button)
  const [triggerRedirect, setTriggerRedirect] = useState(false);

  const handleDownloadApp = () => {
      setTriggerRedirect(true);
  };

  if (loading || !selectedAd) {
    return <PageWrapper><Loader message={t("loading.message")} fullscreen={false} /></PageWrapper>;
  }

  // Helpers
  const price = selectedAd.sellingPrice || 0;
  const isAuction = selectedAd.isAuction || false; // Assume boolean from API
  const sellerName = selectedAd.user?.fullName || "Hanuut User";
  
  // Deep Link Props
  const deepLinkProps = {
    appScheme: appConfig?.appScheme || "hanuut://",
    storeUrl: appConfig?.storeUrl || "https://play.google.com/store/apps/details?id=com.hanuut.shop",
    appName: "Hanuut",
    logoSrc: appConfig?.logoSrc,
    finalPath: `ad/${adId}`, 
    showUI: true
  };

  const shareableImageUrl = useMemo(() => {
    if (selectedAd?.images && selectedAd.images.length > 0) {
      const imgId = selectedAd.images[0];
      // Use the new RAW endpoint
      return `${prodUrl}/image/raw/${imgId}`;
    }
    return "https://hanuut.com/static/placeholder.png"; // Fallback
  }, [selectedAd]);

  return (
    <ThemeProvider theme={marketTheme}>
      <PageWrapper>
        <Helmet>
          <title>{selectedAd ? selectedAd.name : "Hanuut"} | Market</title>
          <meta name="description" content={selectedAd?.shortDescription} />
          
          
          <meta property="og:image" content={shareableImageUrl} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:type" content="product" />
          
          
          <meta property="og:url" content={window.location.href} />
        </Helmet>

        {triggerRedirect && <DeepLinkRedirect {...deepLinkProps} />}

        <AdContainer
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
        >
          {/* Left: Image */}
          <ImageSection>
             <OverlayBadge>
               {isAuction ? <FaGavel /> : <FaTag />}
               {isAuction ? "Auction" : "For Sale"}
             </OverlayBadge>
             {imageUrl ? (
               <img src={imageUrl} alt={selectedAd.name} />
             ) : (
               <div style={{ width: '100%', height: '100%', background: '#e5e7eb' }} />
             )}
          </ImageSection>

          {/* Right: Content */}
          <DetailsSection isArabic={isArabic}>
             
             <div>
               <CategoryPill>{selectedAd.category?.name || "General"}</CategoryPill>
               <Title>{selectedAd.name}</Title>
             </div>

             <PriceTag>
               {price.toLocaleString()} <span className="currency">{t("dzd")}</span>
             </PriceTag>

             <LocationText>
               <FaMapMarkerAlt color="#39A170" />
               {selectedAd.wilaya ? `${selectedAd.commune}, ${selectedAd.wilaya}` : "Algeria"}
             </LocationText>

             <SellerRow>
               <SellerAvatar>
                  <FaUserCircle size={24} />
               </SellerAvatar>
               <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{sellerName}</span>
             </SellerRow>

             <Description>
               {selectedAd.description || selectedAd.shortDescription}
             </Description>

             <ButtonContainer>
               <ButtonWithIcon
                  image={Playstore}
                  backgroundColor="#111217"
                  text1={t("getItOn")}
                  text2={t("googlePlay")}
                  className="homeDownloadButton"
                  onClick={handleDownloadApp}
               />
               <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#71717a', textAlign: 'center' }}>
                  Download the app to chat with seller or place a bid.
               </p>
             </ButtonContainer>

          </DetailsSection>
        </AdContainer>

      </PageWrapper>
    </ThemeProvider>
  );
};

export default MarketplaceAdRedirectPage;