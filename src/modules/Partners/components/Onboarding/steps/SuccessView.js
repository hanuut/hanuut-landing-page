import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaCheckCircle, FaUtensils, FaShoppingBasket, FaGlobe, FaWindows } from "react-icons/fa";
import Playstore from "../../../../../assets/playstore.webp";

// --- Styled Components ---

const SuccessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 0;
`;

const IconCircle = styled(motion.div)`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #39A170, #2D855A);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 15px 30px rgba(57, 161, 112, 0.3);
`;

const SuccessTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 800;
  color: #111;
  margin-bottom: 0.5rem;
`;

const SuccessSubtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  max-width: 500px;
  line-height: 1.6;
  margin-bottom: 2.5rem;
`;

const FeaturesPreview = styled.div`
  width: 100%;
  background: #FAFAFA;
  border: 1px solid #E5E5E5;
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2.5rem;
  text-align: left;
`;

const FeaturesTitle = styled.h4`
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.95rem;
  color: #555;
  font-weight: 500;
  
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
  
  svg {
    color: #39A170;
    font-size: 1.2rem;
    flex-shrink: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 350px;
`;

const StoreButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 14px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.2s ease;
  
  &.primary {
    background: #000;
    color: #fff;
    border: 1px solid #000;
    &:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
  }
  
  &.secondary {
    background: #F0F0F0;
    color: #333;
    border: 1px solid #E5E5E5;
    &:hover { background: #E5E5E5; }
  }

  img, svg {
    height: 1.5rem;
  }
`;

// --- Feature Data ---
const domainFeatures = {
  food: [
    { icon: <FaUtensils />, key: "feature_food_1" },
    { icon: <FaUtensils />, key: "feature_food_2" },
  ],
  grocery: [
    { icon: <FaShoppingBasket />, key: "feature_grocery_1" },
    { icon: <FaShoppingBasket />, key: "feature_grocery_2" },
  ],
  global: [
    { icon: <FaGlobe />, key: "feature_global_1" },
    { icon: <FaGlobe />, key: "feature_global_2" },
  ],
};

const SuccessView = ({ data }) => {
  const { t } = useTranslation();
  const features = domainFeatures[data.domainKeyword] || domainFeatures.global;
  
  // App Download Links
  const googlePlayLink = process.env.REACT_APP_MY_HANUUT_DOWNLOAD_LINK_GOOGLE_PLAY;
  const windowsLink = process.env.REACT_APP_WINDOWS_MY_HANUUT_DOWNLOAD_LINK;

  return (
    <SuccessWrapper>
      <IconCircle
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
      >
        <FaCheckCircle />
      </IconCircle>

      <SuccessTitle>{t("wiz_success_title", "Shop Created Successfully!")}</SuccessTitle>
      <SuccessSubtitle>{t("success_cta_subtitle", "Your shop is live. Download the My Hanuut app to add your products and start selling.")}</SuccessSubtitle>
      
      <FeaturesPreview>
        <FeaturesTitle>{t("success_features_title", "You've unlocked:")}</FeaturesTitle>
        {features.map(feature => (
          <FeatureItem key={feature.key}>
            {feature.icon}
            <span>{t(feature.key, "Premium Feature")}</span>
          </FeatureItem>
        ))}
      </FeaturesPreview>

      <ButtonGroup>
        <StoreButton href={googlePlayLink} target="_blank" className="primary">
          <img src={Playstore} alt="Google Play" />
          <span>{t("download_android", "Continue on Android")}</span>
        </StoreButton>
        <StoreButton href={windowsLink} target="_blank" className="secondary">
          <FaWindows />
          <span>{t("download_windows", "Manage on Desktop")}</span>
        </StoreButton>
      </ButtonGroup>
    </SuccessWrapper>
  );
};

export default SuccessView;