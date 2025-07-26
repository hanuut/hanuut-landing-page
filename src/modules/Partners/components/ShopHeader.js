// src/modules/Partners/components/ShopHeader.js

import React from "react";
import styled, { css } from "styled-components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ButtonWithIcon from "../../../components/ButtonWithIcon";
import Playstore from "../../../assets/playstore.webp";

// A base style for both headers to share
const HeaderBase = styled.header`
  width: 100%;
  background-color: #FFFFFF; // Background is now always white
  border-radius: ${(props) => props.theme.defaultRadius};
  margin-bottom: 2rem;
  padding: 1rem 2rem; // Adjusted padding
  box-sizing: border-box;
  
  // THE FIX: Key alignment changes
  display: flex;
  justify-content: space-between;
  align-items: center; // This aligns all children vertically to the center
  position: relative;
`;

const StandardHeaderWrapper = styled(HeaderBase)`
  border: 1px solid ${(props) => props.theme.surfaceBorder};
`;

const PremiumHeaderWrapper = styled(HeaderBase)`
  // THE FIX: Outline and shadow use the shop's custom color
  border: 3px solid ${(props) => props.$outlineColor};
  box-shadow: 0 0 25px ${(props) => `${props.$outlineColor}4D`}; // Adds a hex alpha for transparency
`;

const CenteredMenuTitle = styled.h1`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${(props) => props.theme.primary}; // Set to primary green as you requested
  padding: 0.5rem 2rem;
  border-radius: ${(props) => props.theme.defaultRadius};
  font-size: clamp(3rem, 10vw, 4.5rem);
  font-weight: 700;
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

const ShopName = styled.h2`
  font-size: ${(props) => props.theme.fontxxl};
  font-weight: 600;
  color: ${(props) => props.theme.text};
  
  ${(props) => props.$isPremium && css`
    color: ${props.theme.accent}; 
    text-shadow: 0px 0px 10px ${props.$shadowColor}99;
  `}
`;

const ShopDescription = styled.p`
  font-size: ${(props) => props.theme.fontlg};
  color: ${(props) => props.theme.secondaryText};
`;

const DownloadApp = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
`;

const DownloadTitle = styled.p`
  font-size: ${(props) => props.theme.fontsm};
  color: ${(props) => props.theme.secondaryText};
`;

const ShopHeader = ({ shop, imageData, isSubscribed }) => {
  const { t } = useTranslation();

  if (!shop) {
    return null;
  }
  
  const link = "https://play.google.com/store/apps/details?id=com.hanuut.shop";

  if (isSubscribed) {
    const { 
      mainColor = '#39A170', // Default to Hanuut Green
    } = shop.styles || {};

    return (
      <PremiumHeaderWrapper $outlineColor={mainColor}>
        <ShopInfo>
          {imageData && <Logo src={imageData} alt={`${shop.name} logo`} />}
          <ShopText>
            <ShopName $isPremium={true} $shadowColor={mainColor}>{shop.name}</ShopName>
            <ShopDescription>{shop.description}</ShopDescription>
          </ShopText>
        </ShopInfo>
        
        <CenteredMenuTitle>{t("menuTitle")}</CenteredMenuTitle>
        
        <DownloadApp>
          <DownloadTitle>{t("toOrder")}</DownloadTitle>
          <Link to={link}>
            <ButtonWithIcon
              image={Playstore}
              backgroundColor="#000000"
              text1={t("getItOn")}
              text2={t("googlePlay")}
            />
          </Link>
        </DownloadApp>
      </PremiumHeaderWrapper>
    );
  } else {
    return (
      <StandardHeaderWrapper>
        <ShopInfo>
          {imageData && <Logo src={imageData} alt={`${shop.name} logo`} />}
          <ShopText>
            <ShopName>{shop.name}</ShopName>
            <ShopDescription>{shop.description}</ShopDescription>
          </ShopText>
        </ShopInfo>

        <CenteredMenuTitle>{t("menuTitle")}</CenteredMenuTitle>

        <DownloadApp>
          <DownloadTitle>{t("toOrder")}</DownloadTitle>
          <Link to={link}>
            <ButtonWithIcon
              image={Playstore}
              backgroundColor="#000000"
              text1={t("getItOn")}
              text2={t("googlePlay")}
            />
          </Link>
        </DownloadApp>
      </StandardHeaderWrapper>
    );
  }
};

export default ShopHeader;