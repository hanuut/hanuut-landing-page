import React from "react";
import styled, { css } from "styled-components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ButtonWithIcon from "../../../components/ButtonWithIcon";
import Playstore from "../../../assets/playstore.webp";

// --- Styled Components ---

const HeaderWrapper = styled.header`
  width: 100%;
  border-radius: ${(props) => props.theme.defaultRadius};
  margin-bottom: 2rem;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;

  /* Premium (Subscribed) Styles */
  ${(props) =>
    props.$isPremium
      ? css`
          padding: 3rem 2rem;
          background-color: #18181B; /* Fallback */
          border: 1px solid rgba(255, 255, 255, 0.1);
          
          /* Background Image Blur Effect */
          &::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-image: url(${(props) => props.$bgImage});
            background-size: cover;
            background-position: center;
            filter: blur(25px) brightness(0.4); 
            transform: scale(1.2); /* Zoom in to hide blur edges */
            z-index: 1;
            opacity: 0.8;
          }
          
          /* Gradient Overlay */
          &::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, rgba(24,24,27,0.4), rgba(24,24,27,0.9));
            z-index: 1;
          }

          @media (max-width: 768px) {
            padding: 2rem 1.5rem;
          }
        `
      : css`
          /* Standard Styles */
          padding: 1.5rem 2rem;
          background-color: #ffffff;
          border: 1px solid ${(props) => props.theme.surfaceBorder};
          @media (max-width: 850px) {
            padding: 1.5rem 1rem;
          }
        `}
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 2; /* Sit above the background */
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  /* Stack on mobile only for Standard, Premium keeps row if possible or specific layout */
  ${(props) => !props.$isPremium && css`
    @media (max-width: 850px) {
      flex-direction: column;
      gap: 1.5rem;
    }
  `}

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
`;

const ShopInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Logo = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 20px; /* Softer corners */
  object-fit: cover;
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.1);
`;

const ShopText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ShopName = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${(props) => props.theme.text};
  margin: 0;
  line-height: 1.1;

  ${(props) =>
    props.$isPremium &&
    css`
      color: #FFFFFF;
      font-family: 'Tajawal', sans-serif;
      text-shadow: 0 2px 10px rgba(0,0,0,0.5);
    `}

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const ShopDescription = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.secondaryText};
  max-width: 600px;
  
  ${(props) =>
    props.$isPremium &&
    css`
      color: #a1a1aa; /* Zinc 400 */
      line-height: 1.5;
    `}

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const DownloadApp = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    align-items: flex-start;
    width: 100%;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255,255,255,0.1);
  }
`;

const DownloadTitle = styled.p`
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  color: ${(props) => props.theme.secondaryText};
  
  ${(props) =>
    props.$isPremium &&
    css`
      color: #71717a;
    `}
`;

// Helper to scale button on mobile
const ScaledButtonWrapper = styled.div`
  @media (max-width: 768px) {
    width: 100%;
    button {
        width: 100%;
        justify-content: center;
    }
  }
`;

const ShopHeader = ({ shop, imageData, isSubscribed, brandColors }) => {
  const { t } = useTranslation();

  if (!shop) return null;
  
  const link = "https://play.google.com/store/apps/details?id=com.hanuut.shop";
  
  return (
    <HeaderWrapper $isPremium={isSubscribed} $bgImage={imageData}>
      <ContentContainer $isPremium={isSubscribed}>
        <ShopInfo>
          {/* Always show Logo for Premium (using the passed imageData as logo if available, or a placeholder) */}
          {imageData && <Logo src={imageData} alt={`${shop.name} logo`} />}
          
          <ShopText>
            <ShopName $isPremium={isSubscribed} $brandColor={brandColors?.main}>
              {shop.name}
            </ShopName>
            <ShopDescription $isPremium={isSubscribed}>
              {shop.description}
            </ShopDescription>
          </ShopText>
        </ShopInfo>

        <DownloadApp>
          <DownloadTitle $isPremium={isSubscribed}>{t("toOrder")}</DownloadTitle>
          <Link to={link} style={{ width: '100%' }}>
            <ScaledButtonWrapper>
                <ButtonWithIcon
                    image={Playstore}
                    backgroundColor={isSubscribed ? "#000000" : "#000000"}
                    text1={t("getItOn")}
                    text2={t("googlePlay")}
                />
            </ScaledButtonWrapper>
          </Link>
        </DownloadApp>
      </ContentContainer>
    </HeaderWrapper>
  );
};

export default ShopHeader;