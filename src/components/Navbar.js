import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux"; 
import { FaShoppingCart } from "react-icons/fa"; 

// Redux
import { selectShop } from "../modules/Partners/state/reducers"; 
import { selectSelectedShopImage } from "../modules/Images/state/reducers";
import { selectCart, toggleCart } from "../modules/Cart/state/reducers"; 

import LanguagesDropDown from "./LanguagesDropDown";
import Logo from "./Logo";
import logoAr from "../assets/logo-ar.png";
import logoEn from "../assets/logo-en.png";
import btoa from 'btoa';

const bufferToUrl = (imageObject) => {
  if (!imageObject || !imageObject.buffer?.data) return null;
  const imageData = new Uint8Array(imageObject.buffer.data);
  const base64String = btoa(imageData.reduce((data, byte) => data + String.fromCharCode(byte), ''));
  const format = imageObject.originalname.split('.').pop().toLowerCase();
  const mimeType = format === 'jpg' ? 'jpeg' : format;
  return `data:image/${mimeType};base64,${base64String}`;
};

// --- STYLED COMPONENTS ---

const Section = styled.section`
  position: fixed; 
  top: 0; 
  left: 0;
  width: 100vw; 
  height: ${(props) => props.theme.navHeight};
  z-index: 1000; 
  display: flex; 
  justify-content: center; 
  align-items: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  background-color: ${({ $isScrolled }) => 
    $isScrolled ? "rgba(28, 28, 30, 0.85)" : "transparent"};
  
  backdrop-filter: ${({ $isScrolled }) => 
    $isScrolled ? "blur(20px) saturate(180%)" : "none"};
    
  -webkit-backdrop-filter: ${({ $isScrolled }) => 
    $isScrolled ? "blur(20px) saturate(180%)" : "none"};

  border-bottom: 1px solid ${({ $isScrolled }) => 
    $isScrolled ? "rgba(255, 255, 255, 0.1)" : "transparent"};

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
  height: 100%;
  position: relative;
`;

const DesktopMenu = styled.ul`
  display: flex; align-items: center; list-style: none; gap: 2rem;
  @media (max-width: 768px) { display: none; }
`;

const MenuItem = styled.li`
  a { 
    /* Force color with !important to override global defaults */
    color: ${({ $textColor }) => $textColor} !important; 
    text-decoration: none; 
    font-weight: 500;
    transition: color 0.3s ease;
  }
  cursor: pointer; position: relative;
  
  &::after { 
    content: " "; display: block; width: 0%; height: 2px; 
    background-color: ${({ $textColor }) => $textColor}; 
    transition: width 0.3s ease; 
  }
  &:hover::after { width: 100%; }
`;

const HamburgerButton = styled.button`
  display: none; width: 40px; height: 40px; border: none; background: transparent;
  cursor: pointer; z-index: 1001;
  @media (max-width: 768px) { display: block; }
`;

const HamburgerIcon = styled.div`
  width: 28px; height: 2px; background-color: ${({ $iconColor }) => $iconColor};
  position: relative; transition: all 0.3s ease;
  ${(props) => props.$isOpen && css` background-color: transparent; `}
  &::before, &::after {
    content: ''; position: absolute; left: 0; width: 28px; height: 2px;
    background-color: ${({ $iconColor }) => $iconColor};
    transition: transform 0.3s ease;
  }
  &::before { top: -8px; ${(props) => props.$isOpen && css` top: 0; transform: rotate(45deg); `} }
  &::after { top: 8px; ${(props) => props.$isOpen && css` top: 0; transform: rotate(-45deg); `} }
`;

// --- Shop Identity Components ---
const LogoSwapContainer = styled.div`
  position: relative;
  height: 40px;
  width: 200px;
  display: flex;
  align-items: center;
`;

const HanuutLogoWrapper = styled.div`
  position: absolute;
  top: 50%; left: 0; transform: translateY(-50%);
  transition: opacity 0.4s ease, transform 0.4s ease;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  pointer-events: ${(props) => (props.$visible ? "all" : "none")};
  ${props => !props.$visible && css` transform: translateY(-30%); `}
`;

const ShopIdentityWrapper = styled.div`
  position: absolute;
  top: 50%; left: 0; transform: translateY(-50%);
  display: flex; align-items: center; gap: 0.75rem;
  transition: opacity 0.4s ease, transform 0.4s ease;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  pointer-events: ${(props) => (props.$visible ? "all" : "none")};
  ${props => !props.$visible && css` transform: translateY(-20%); `}
`;

const NavShopLogo = styled.img`
  width: 32px; height: 32px; border-radius: 8px; object-fit: cover;
  border: 1px solid rgba(255,255,255,0.1);
`;

const NavShopName = styled.span`
  font-size: 1rem; font-weight: 700; color: #FFF; font-family: 'Tajawal', sans-serif;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px;
  @media (max-width: 600px) { display: none; }
`;

const CartButton = styled.button`
  position: relative;
  background: transparent; border: none; cursor: pointer;
  color: ${({ $color }) => $color};
  font-size: 1.4rem;
  display: flex; align-items: center; justify-content: center;
  transition: transform 0.2s ease;
  
  &:hover { transform: scale(1.1); }
`;

const CartBadge = styled.span`
  position: absolute; top: -5px; right: -8px;
  background-color: #EF4444; color: white;
  font-size: 0.7rem; font-weight: 700;
  width: 18px; height: 18px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid #1C1C1E;
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
const SidePanelItem = styled.li` font-size: 1.2rem; font-weight: 500; a { color: ${(props) => props.theme.text}; text-decoration: none; } `;


const Navbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const selectedShop = useSelector(selectShop); 
  const selectedShopImage = useSelector(selectSelectedShopImage);
  const { cart } = useSelector(selectCart);

  const path = location.pathname;
  const isShopMode = /^(@[^/]+|shop\/[^/]+)/.test(path.substring(1));

  // --- FIXED CART FILTERING LOGIC ---
  const cartQuantity = useMemo(() => {
    // 1. Must be in Shop Mode
    if (!isShopMode) return 0;

    // 2. Must have a selected shop loaded
    if (!selectedShop || !selectedShop._id) return 0;

    const currentShopId = String(selectedShop._id);

    const shopItems = cart.filter(item => {
        // Safe string comparison
        return item.shopId && String(item.shopId) === currentShopId;
    });

    return shopItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart, isShopMode, selectedShop]);

  const shopImageUrl = useMemo(() => bufferToUrl(selectedShopImage), [selectedShopImage]);
  const currentLogo = i18n.language === "ar" ? logoAr : logoEn;
  const isArabic = i18n.language === "ar";

  const getTextColor = () => {
    if (isScrolled) return "#FFFFFF";
    if (path.includes("/onboarding")) return "#111217";
    if (path.includes("/partners") || path.includes("/blog") || isShopMode) {
      return "#FFFFFF";
    }
    return "#111217";
  };
  
  const textColor = getTextColor();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    handleScroll(); 
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const handleCartClick = () => dispatch(toggleCart());

  const renderGlobalNav = () => (
    <>
      <NavGroup>
        <Link to="/"><Logo image={currentLogo} /></Link>
      </NavGroup>
      <NavGroup>
        <DesktopMenu>
          <MenuItem $textColor={textColor}>
            <Link to="/" style={{ color: textColor }}>{t("navHome")}</Link>
          </MenuItem>
          <MenuItem $textColor={textColor}>
            <Link to="/partners" style={{ color: textColor }}>{t("navPartners")}</Link>
          </MenuItem>
          <MenuItem $textColor={textColor}>
            <Link to="/blog" style={{ color: textColor }}>{t("navBlog")}</Link>
          </MenuItem>
          <li><LanguagesDropDown textColor={textColor} /></li>
        </DesktopMenu>
        <HamburgerButton onClick={toggleMobileMenu}>
          <HamburgerIcon $isOpen={isMobileMenuOpen} $iconColor={textColor} />
        </HamburgerButton>
      </NavGroup>
    </>
  );

  const renderShopNav = () => (
    <>
      <NavGroup>
        <LogoSwapContainer>
          <HanuutLogoWrapper $visible={!isScrolled}>
            <Link to="/"><Logo image={currentLogo} /></Link>
          </HanuutLogoWrapper>

          <ShopIdentityWrapper $visible={isScrolled}>
             {shopImageUrl && <NavShopLogo src={shopImageUrl} alt="Shop Logo" />}
             <NavShopName>{selectedShop?.name}</NavShopName>
          </ShopIdentityWrapper>
        </LogoSwapContainer>
      </NavGroup>

      <NavGroup>
        {/* Only show Cart if items exist for THIS shop */}
        {cartQuantity > 0 && (
            <CartButton onClick={handleCartClick} $color={textColor}>
            <FaShoppingCart />
            <CartBadge>{cartQuantity}</CartBadge>
            </CartButton>
        )}
        <LanguagesDropDown textColor={textColor} />
      </NavGroup>
    </>
  );

  return (
    <Section $isScrolled={isScrolled}>
      <Navigation $isArabic={isArabic}>
        {isShopMode ? renderShopNav() : renderGlobalNav()}
      </Navigation>

      {!isShopMode && (
        <SidePanel $isOpen={isMobileMenuOpen} $isArabic={isArabic}>
          <SidePanelMenu>
            <SidePanelItem><Link to="/" onClick={closeMobileMenu}>{t("navHome")}</Link></SidePanelItem>
            <SidePanelItem><Link to="/partners" onClick={closeMobileMenu}>{t("navPartners")}</Link></SidePanelItem>
            <SidePanelItem><Link to="/blog" onClick={closeMobileMenu}>{t("navBlog")}</Link></SidePanelItem>
            <SidePanelItem><LanguagesDropDown handleChooseLanguage={closeMobileMenu} /></SidePanelItem>
          </SidePanelMenu>
        </SidePanel>
      )}
    </Section>
  );
};

export default Navbar;