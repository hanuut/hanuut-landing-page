import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectShop } from "../modules/Partners/state/reducers";
import { selectSelectedShopImage } from "../modules/Images/state/reducers";
import LanguagesDropDown from "./LanguagesDropDown";
import Logo from "./Logo";
import logoAr from "../assets/logo-ar.png";
import logoEn from "../assets/logo-en.png";
import { usePalette } from 'color-thief-react';
import btoa from 'btoa';

const bufferToUrl = (imageObject) => {
  if (!imageObject || !imageObject.buffer?.data) return null;
  const imageData = new Uint8Array(imageObject.buffer.data);
  const base64String = btoa(imageData.reduce((data, byte) => data + String.fromCharCode(byte), ''));
  const format = imageObject.originalname.split('.').pop().toLowerCase();
  const mimeType = format === 'jpg' ? 'jpeg' : format;
  return `data:image/${mimeType};base64,${base64String}`;
};

// --- (Styled Components are mostly the same, with minor tweaks) ---
const Section = styled.section`
  position: sticky; top: 0; width: 100vw; height: ${(props) => props.theme.navHeight};
  z-index: 1000; display: flex; justify-content: center; align-items: center;
  transition: background-color 0.4s ease;
  background-color: ${({ theme, $brandColor }) => $brandColor || theme.body};
  @media (max-width: 768px) { height: ${(props) => props.theme.navHeightMobile}; }
`;

const Navigation = styled.nav`
  width: 95%; height: 100%; display: flex; justify-content: space-between;
  align-items: center; margin: 0 auto;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const NavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const DesktopMenu = styled.ul`
  display: flex; align-items: center; list-style: none; gap: 2rem;
  @media (max-width: 768px) { display: none; }
`;

const MenuItem = styled.li`
  a { color: ${({ theme, $textColor }) => $textColor || theme.text}; text-decoration: none; }
  cursor: pointer; position: relative;
  &::after { content: " "; display: block; width: 0%; height: 2px; background-color: ${({ theme, $textColor }) => $textColor || theme.text}; transition: width 0.3s ease; }
  &:hover::after { width: 100%; }
`;

const HamburgerButton = styled.button`
  display: none; width: 40px; height: 40px; border: none; background: transparent;
  cursor: pointer; z-index: 1001;
  @media (max-width: 768px) { display: block; }
`;

const HamburgerIcon = styled.div`
  width: 28px; height: 2px; background-color: ${({ theme, $iconColor }) => $iconColor || theme.text};
  position: relative; transition: all 0.3s ease;
  ${(props) => props.$isOpen && css` background-color: transparent; `}
  &::before, &::after {
    content: ''; position: absolute; left: 0; width: 28px; height: 2px;
    background-color: ${({ theme, $iconColor }) => $iconColor || theme.text};
    transition: transform 0.3s ease;
  }
  &::before { top: -8px; ${(props) => props.$isOpen && css` top: 0; transform: rotate(45deg); `} }
  &::after { top: 8px; ${(props) => props.$isOpen && css` top: 0; transform: rotate(-45deg); `} }
`;

const SidePanel = styled.nav`
  position: fixed; top: 0;
  right: ${(props) => (props.$isArabic ? 'auto' : (props.$isOpen ? "0" : "-100%"))};
  left: ${(props) => (props.$isArabic ? (props.$isOpen ? "0" : "-100%") : 'auto')};
  width: 80%; max-width: 300px; height: 100%; background-color: ${(props) => props.theme.body};
  box-shadow: -5px 0 15px rgba(0,0,0,0.1); transition: all 0.4s ease; z-index: 1000;
  display: flex; flex-direction: column; padding: 6rem 2rem;
  align-items: ${(props) => (props.$isArabic ? "flex-end" : "flex-start")};
`;

const SidePanelMenu = styled.ul` list-style: none; display: flex; flex-direction: column; gap: 2.5rem; width: 100%; `;
const SidePanelItem = styled.li` font-size: ${(props) => props.theme.fontxl}; font-weight: 500; a { color: ${(props) => props.theme.text}; text-decoration: none; } `;

// --- STYLES FOR THE NEW LAYOUT ---
const ShopLogo = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 8px;
  object-fit: cover;
`;

const TitleContainer = styled.div`
  display: flex;
  /* --- THE FIX: Changed to column layout --- */
  flex-direction: column;
  /* --- THE FIX: Align based on text direction --- */
  align-items: flex-start;
  gap: 0.25rem;
`;

const SmallHanuutLogo = styled.img`
  /* --- THE FIX: Smaller Hanuut Logo --- */
  height: 20px;
  width: auto;
`;

const MenuTitle = styled.h2`
  font-size: ${(props) => props.theme.fontlg};
  font-weight: 600;
  color: ${({ $textColor }) => $textColor || 'inherit'};
`;

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [brandColor, setBrandColor] = useState(null);
  const [textColor, setTextColor] = useState(null);

  const selectedShop = useSelector(selectShop);
  const selectedShopImage = useSelector(selectSelectedShopImage);

  const isMenuPage = /^\/(@[^/]+|shop\/[^/]+)$/.test(location.pathname);
  const isSubscribed = isMenuPage && selectedShop && selectedShop.subscriptionPlanId !== null;
  
  const shopImageUrl = useMemo(() => bufferToUrl(selectedShopImage), [selectedShopImage]);

  const { data: logoPalette } = usePalette(shopImageUrl, 2, 'hex', {
    crossOrigin: 'Anonymous',
    quality: 10,
  });

  useEffect(() => {
    if (isSubscribed) {
      const mainColor = selectedShop.styles?.mainColor || (logoPalette && logoPalette[0]);
      if (mainColor) {
        setBrandColor(mainColor);
        const isDark = (parseInt(mainColor.substr(1, 2), 16) * 0.299 + parseInt(mainColor.substr(3, 2), 16) * 0.587 + parseInt(mainColor.substr(5, 2), 16) * 0.114) < 186;
        setTextColor(isDark ? '#FFFFFF' : '#1E1E1E');
      }
    } else {
      setBrandColor(null);
      setTextColor(null);
    }
  }, [isSubscribed, selectedShop, logoPalette, shopImageUrl]);

  const currentLogo = i18n.language === "ar" ? logoAr : logoEn;
  const isArabic = i18n.language === "ar";

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <Section $brandColor={brandColor}>
      <Navigation $isArabic={isArabic}>
        {/* --- THE FIX: Re-ordered and re-structured JSX --- */}
        <NavGroup>
          {isSubscribed ? (
            <NavGroup>
              {shopImageUrl && <ShopLogo src={shopImageUrl} alt={selectedShop.name ? `${selectedShop.name} logo` : 'Shop logo'} />}
              <TitleContainer $isArabic={isArabic}>
                <SmallHanuutLogo src={currentLogo} alt="Hanuut Logo" />
                <MenuTitle $textColor={textColor}>{t("digital_menu_title")}</MenuTitle>
              </TitleContainer>
            </NavGroup>
          ) : (
            <Link to="/"><Logo image={currentLogo} /></Link>
          )}
        </NavGroup>

        <NavGroup>
          <DesktopMenu>
            <MenuItem $textColor={textColor}><Link to="/">{t("navHome")}</Link></MenuItem>
            <MenuItem $textColor={textColor}><Link to="/partners">{t("navPartners")}</Link></MenuItem>
             <MenuItem $textColor={textColor}><Link to="/blog">{t("navBlog")}</Link></MenuItem>
            {/* <MenuItem $textColor={textColor}><Link to="/tawsila">{t("navTawsila")}</Link></MenuItem> */}
            <li><LanguagesDropDown textColor={textColor} /></li>
          </DesktopMenu>

          <HamburgerButton onClick={toggleMobileMenu}>
            <HamburgerIcon $isOpen={isMobileMenuOpen} $iconColor={textColor} />
          </HamburgerButton>
        </NavGroup>
      </Navigation>
      
      <SidePanel $isOpen={isMobileMenuOpen} $isArabic={isArabic}>
        <SidePanelMenu>
          <SidePanelItem><Link to="/" onClick={closeMobileMenu}>{t("navHome")}</Link></SidePanelItem>
          <SidePanelItem><Link to="/partners" onClick={closeMobileMenu}>{t("navPartners")}</Link></SidePanelItem>
           <MenuItem $textColor={textColor}><Link to="/blog">{t("navBlog")}</Link></MenuItem>
          {/* <SidePanelItem><Link to="/tawsila" onClick={closeMobileMenu}>{t("navTawsila")}</Link></SidePanelItem> */}
          <SidePanelItem><LanguagesDropDown handleChooseLanguage={closeMobileMenu} /></SidePanelItem>
        </SidePanelMenu>
      </SidePanel>
    </Section>
  );
};

export default Navbar;