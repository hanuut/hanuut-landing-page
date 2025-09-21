import React from "react";
import styled, { css } from "styled-components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ButtonWithIcon from "../../../components/ButtonWithIcon";
import Playstore from "../../../assets/playstore.webp";

// --- Styled Components for the Redesigned Header ---

const HeaderWrapper = styled.header`
  width: 100%;
  border-radius: ${(props) => props.theme.defaultRadius};
  margin-bottom: 2rem;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;

  ${(props) =>
    props.$isPremium
      ? css`
          /* Premium Styles */
          padding: 3rem 2rem; /* Adjusted padding */
          &::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-image: url(${(props) => props.$bgImage});
            background-size: cover;
            background-position: center;
            filter: blur(20px) brightness(0.35); 
            transform: scale(1.2);
            z-index: 1;
          }
          @media (max-width: 768px) {
            padding: 2rem 1.5rem; /* Responsive padding */
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
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  /* --- THE FIX: Only standard version goes to column on mobile --- */
  ${(props) => !props.$isPremium && css`
    @media (max-width: 850px) {
      flex-direction: column;
      gap: 1.5rem;
    }
  `}
`;

const ShopInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const Logo = styled.img`
  width: 90px;
  height: 90px;
  border-radius: ${(props) => props.theme.defaultRadius};
  object-fit: cover;
`;

const ShopText = styled.div`
  display: flex;
  flex-direction: column;
`;

const ShopName = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.text};

  ${(props) =>
    props.$isPremium &&
    css`
      color: ${props.$accentColor || '#FFFFFF'};
      text-shadow: 0 0 15px ${(props) => props.$brandColor || props.theme.primaryColor};
      font-family: 'Cairo Variable', sans-serif;
    `}
  
  /* --- THE FIX: Smaller font size on mobile --- */
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const ShopDescription = styled.p`
  font-size: ${(props) => props.theme.fontlg};
  color: ${(props) => props.theme.secondaryText};
  
  ${(props) =>
    props.$isPremium &&
    css`
      color: rgba(255, 255, 255, 0.85);
      text-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
    `}

  /* --- THE FIX: Smaller font size on mobile --- */
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const DownloadApp = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  flex-shrink: 0;
`;

const DownloadTitle = styled.p`
  font-size: ${(props) => props.theme.fontsm};
  color: ${(props) => props.theme.secondaryText};
  
  ${(props) =>
    props.$isPremium &&
    css`
      color: rgba(255, 255, 255, 0.8);
    `}
`;

// --- THE FIX: Create a smaller version of the button for mobile premium ---
const ScaledButton = styled(ButtonWithIcon)`
  @media (max-width: 768px) {
    transform: scale(0.85);
    transform-origin: right;
  }
`;


const ShopHeader = ({ shop, imageData, isSubscribed, brandColors }) => {
  const { t } = useTranslation();

  if (!shop) {
    return null;
  }
  
  const link = "https://play.google.com/store/apps/details?id=com.hanuut.shop";
  
  return (
    <HeaderWrapper $isPremium={isSubscribed} $bgImage={imageData}>
      <ContentContainer $isPremium={isSubscribed}>
        <ShopInfo>
          {!isSubscribed && imageData && <Logo src={imageData} alt={`${shop.name} logo`} />}
          
          <ShopText>
            <ShopName $isPremium={isSubscribed} $brandColor={brandColors.main} $accentColor={brandColors?.accent}>
              {shop.name}
            </ShopName>
            <ShopDescription $isPremium={isSubscribed}>
              {shop.description}
            </ShopDescription>
          </ShopText>
        </ShopInfo>

        <DownloadApp>
          <DownloadTitle $isPremium={isSubscribed}>{t("toOrder")}</DownloadTitle>
          <Link to={link}>
            {/* --- THE FIX: Use the new ScaledButton for the premium version --- */}
            {isSubscribed ? (
                <ScaledButton
                    image={Playstore}
                    backgroundColor="#000000"
                    text1={t("getItOn")}
                    text2={t("googlePlay")}
                />
            ) : (
                <ButtonWithIcon
                    image={Playstore}
                    backgroundColor="#000000"
                    text1={t("getItOn")}
                    text2={t("googlePlay")}
                />
            )}
          </Link>
        </DownloadApp>
      </ContentContainer>
    </HeaderWrapper>
  );
};

export default ShopHeader;