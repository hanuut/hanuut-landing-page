// src/modules/Partners/components/ShopHeader.js

import React from "react";
import styled, { css } from "styled-components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ButtonWithIcon from "../../../components/ButtonWithIcon";
import Playstore from "../../../assets/playstore.webp";

// A base style that will now use flex-direction: column on mobile
const HeaderBase = styled.header`
  width: 100%;
  background-color: #FFFFFF;
  border-radius: ${(props) => props.theme.defaultRadius};
  margin-bottom: 2rem;
  padding: 1rem 2rem;
  box-sizing: border-box;
  position: relative; // Still needed for the desktop centered title

  /* On desktop, it's a flex row */
  display: flex;
  justify-content: space-between;
  align-items: center;

  /* THE FIX: On mobile, it becomes a flex column */
  @media (max-width: 850px) {
    flex-direction: column;
    padding: 1.5rem 1rem;
  }
`;

const StandardHeaderWrapper = styled(HeaderBase)`
  border: 1px solid ${(props) => props.theme.surfaceBorder};
`;

const PremiumHeaderWrapper = styled(HeaderBase)`
  border: 3px solid ${(props) => props.$outlineColor};
  box-shadow: 0 0 25px ${(props) => `${props.$outlineColor}4D`};
`;

const CenteredMenuTitle = styled.h1`
  /* --- DESKTOP STYLES (centered overlay) --- */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: transparent;
  box-shadow: none;
  text-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
  color: ${(props) => props.theme.primary};
  padding: 0.5rem 2rem;
  font-size: clamp(3rem, 10vw, 4.5rem);
  font-weight: 700;

  /* --- THE FIX: MOBILE STYLES (static block below) --- */
  @media (max-width: 850px) {
    position: static; /* Returns the title to the normal layout flow */
    transform: none; /* Resets the centering transform */
    width: 100%; /* Ensures it can be centered */
    text-align: center; /* Horizontally centers the text */
    margin-top: 1.5rem; /* Adds space between the top row and the title */
    padding: 0;
    font-size: clamp(2.5rem, 10vw, 3rem); /* Slightly smaller on mobile */
  }
`;

// This component now wraps the top row to control its layout independently
const HeaderTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
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
  
  const HeaderContent = (
    <>
      <HeaderTopRow>
        <ShopInfo>
          {imageData && <Logo src={imageData} alt={`${shop.name} logo`} />}
          <ShopText>
            <ShopName 
              $isPremium={isSubscribed} 
              $shadowColor={shop.styles?.mainColor}
            >
              {shop.name}
            </ShopName>
            <ShopDescription>{shop.description}</ShopDescription>
          </ShopText>
        </ShopInfo>
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
      </HeaderTopRow>
      <CenteredMenuTitle>{t("menuTitle")}</CenteredMenuTitle>
    </>
  );

  if (isSubscribed) {
    const { 
      mainColor = '#39A170',
    } = shop.styles || {};
    return (
      <PremiumHeaderWrapper $outlineColor={mainColor}>
        {HeaderContent}
      </PremiumHeaderWrapper>
    );
  } else {
    return (
      <StandardHeaderWrapper>
        {HeaderContent}
      </StandardHeaderWrapper>
    );
  }
};

export default ShopHeader;