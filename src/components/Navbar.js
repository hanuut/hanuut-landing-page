import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { FaShoppingCart, FaTruck } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import { selectShop } from "../modules/Partners/state/reducers";
import { selectSelectedShopImage } from "../modules/Images/state/reducers";
import { selectCart, toggleCart } from "../modules/Cart/state/reducers";

import LanguagesDropDown from "./LanguagesDropDown";
import Logo from "./Logo";
import logoAr from "../assets/logo-ar.png";
import logoEn from "../assets/logo-en.png";
import btoa from "btoa";

const bufferToUrl = (imageObject) => {
  if (!imageObject || !imageObject.buffer?.data) return null;
  const imageData = new Uint8Array(imageObject.buffer.data);
  const base64String = btoa(
    imageData.reduce((data, byte) => data + String.fromCharCode(byte), ""),
  );
  const format = imageObject.originalname.split(".").pop().toLowerCase();
  const mimeType = format === "jpg" ? "jpeg" : format;
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
  border-bottom: 1px solid
    ${({ $isScrolled }) =>
      $isScrolled ? "rgba(255, 255, 255, 0.1)" : "transparent"};

  /* FIX: Hide navbar when mobile menu is open */
  @media (max-width: 768px) {
    height: ${(props) => props.theme.navHeightMobile};
    ${({ $hiddenOnMobile }) =>
      $hiddenOnMobile &&
      css`
        pointer-events: none;
        opacity: 0;
      `}
  }
`;

const Navigation = styled.nav`
  width: 95%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const NavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  height: 100%;
  position: relative;

  /* Ensure items are vertically centered */
  & > * {
    display: flex;
    align-items: center;
  }
`;

const DesktopMenu = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  gap: 2rem;
  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuItem = styled.li`
  a {
    color: ${({ $textColor }) => $textColor} !important;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
  }
  cursor: pointer;
  position: relative;
  &::after {
    content: " ";
    display: block;
    width: 0%;
    height: 2px;
    background-color: ${({ $textColor }) => $textColor};
    transition: width 0.3s ease;
  }
  &:hover::after {
    width: 100%;
  }
`;

const HamburgerButton = styled(motion.button)`
  display: none;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  cursor: pointer;
  z-index: 1001;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const HamburgerIcon = styled(motion.div)`
  width: 28px;
  height: 2px;
  background-color: ${({ $iconColor }) => $iconColor};
  position: relative;

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 0;
    width: 28px;
    height: 2px;
    background-color: ${({ $iconColor }) => $iconColor};
  }
  &::before {
    top: -8px;
  }
  &::after {
    top: 8px;
  }
`;

// FIX: Better logo swap container with consistent positioning
const LogoSwapContainer = styled.div`
  position: relative;
  height: 48px;
  min-width: 200px;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    min-width: 150px;
  }
`;

const HanuutLogoWrapper = styled(motion.div)`
  position: absolute;
  top: 0%;
  ${(props) => (props.$isArabic ? "right: 0;" : "left: 0;")}
  transform: translateY(-50%);
  display: flex;
  align-items: center;
`;

const ShopIdentityWrapper = styled(motion.div)`
  position: absolute;
  top: 0%;
  ${(props) => (props.$isArabic ? "right: 0;" : "left: 0;")}
  transform: translateY(-50%);
  display: flex;
  flex-direction: ${(props) => (props.$isArabic ? "row-reverse" : "row")};
  align-items: center;
  gap: 0.85rem;
  max-width: 100%;
`;

const NavShopLogo = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  object-fit: cover;
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
`;

const NavShopName = styled.span`
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffffff;
  font-family: "Tajawal", sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  line-height: 1.2;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 1.05rem;
    max-width: 150px;
  }

  @media (max-width: 480px) {
    max-width: 120px;
  }
`;

const CartButton = styled.button`
  position: relative;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ $color }) => $color};
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  padding: 0.5rem;
  height: 48px;

  &:hover {
    transform: scale(1.1);
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: 2px;
  right: 0;
  background-color: #ef4444;
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  border: 2px solid #1c1c1e;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

// --- MOBILE MENU COMPONENTS ---

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
`;

const SidePanel = styled(motion.nav)`
  position: fixed;
  top: 0;
  right: ${(props) => (props.$isArabic ? "auto" : "0")};
  left: ${(props) => (props.$isArabic ? "0" : "auto")};
  width: 80%;
  max-width: 320px;
  height: 100%;

  background-color: rgba(28, 28, 30, 0.95);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-left: ${(props) =>
    props.$isArabic ? "none" : "1px solid rgba(255, 255, 255, 0.1)"};
  border-right: ${(props) =>
    props.$isArabic ? "1px solid rgba(255, 255, 255, 0.1)" : "none"};

  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.3);
  z-index: 999;
  display: flex;
  flex-direction: column;
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  height: ${(props) => props.theme.navHeightMobile};
  box-sizing: border-box;
  flex-shrink: 0;
  position: relative;
`;

const RipplingGlow = styled(motion.div)`
  position: absolute;
  top: 0%;
  left: 50%;
  width: 80px;
  height: 80px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.15) 0%,
    transparent 70%
  );
  border-radius: 50%;
  filter: blur(20px);
  transform: translate(-50%, -50%);
`;

const CloseIcon = styled(motion.div)`
  margin: -18px -22px;
  width: 36px;
  height: 36px;
  position: relative;
  cursor: pointer;
  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 80%;
    width: 28px;
    height: 2px;
    background-color: #fff;
  }
  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }
  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
`;

const SidePanelMenu = styled(motion.ul)`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  width: 100%;
  padding: 2rem;
`;

const SidePanelItem = styled(motion.li)`
  font-size: 1.2rem;
  font-weight: 600;
  a {
    color: #ffffff !important;
    text-decoration: none;
  }
`;

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

  const cartQuantity = useMemo(() => {
    if (!isShopMode) return 0;
    const currentShopId = (selectedShop?._id || selectedShop?.id)?.toString();
    if (!currentShopId) return 0;
    const shopItems = cart.filter(
      (item) =>
        (item.shopId || item.product?.shopId)?.toString() === currentShopId,
    );
    return shopItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart, isShopMode, selectedShop]);

  const shopImageUrl = useMemo(
    () => bufferToUrl(selectedShopImage),
    [selectedShopImage],
  );
  const currentLogo = i18n.language === "ar" ? logoAr : logoEn;
  const isArabic = i18n.language === "ar";

  const getTextColor = () => {
    if (isScrolled) return "#FFFFFF";
    if (path.includes("/onboarding")) return "#111217";
    // Partners (Dark Theme) gets white text
    if (path.includes("/partners")) return "#FFFFFF";
    // Shop Mode (Dark Headers) gets white text
    if (isShopMode) return "#FFFFFF";
    
    // Home (Hub) & E'SUUQ (Ivory Background) get Dark Text
    return "#111217";
  };
  const textColor = getTextColor();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // FIX: Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const handleCartClick = () => dispatch(toggleCart());

  const panelVariants = {
    hidden: {
      x: isArabic ? "-100%" : "100%",
      transition: {
        type: "tween",
        duration: 0.4,
        ease: [0.6, 0.05, -0.01, 0.9],
      },
    },
    visible: {
      x: "0%",
      transition: {
        type: "tween",
        duration: 0.5,
        ease: [0.6, 0.05, -0.01, 0.9],
      },
    },
  };

  const menuVariants = {
    hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: isArabic ? 40 : -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  const logoFadeVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -5,
      transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <>
      <Section $isScrolled={isScrolled} $hiddenOnMobile={isMobileMenuOpen}>
        <Navigation $isArabic={isArabic}>
          <NavGroup>
            {isShopMode ? (
              <LogoSwapContainer>
                <AnimatePresence mode="wait">
                  {!isScrolled ? (
                    <HanuutLogoWrapper
                      key="hanuut-logo"
                      $isArabic={isArabic}
                      variants={logoFadeVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <Link to="/">
                        <Logo image={currentLogo} />
                      </Link>
                    </HanuutLogoWrapper>
                  ) : (
                    <ShopIdentityWrapper
                      key="shop-identity"
                      $isArabic={isArabic}
                      variants={logoFadeVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {shopImageUrl && (
                        <NavShopLogo src={shopImageUrl} alt="Shop Logo" />
                      )}
                      {selectedShop?.name && (
                        <NavShopName>{selectedShop.name}</NavShopName>
                      )}
                    </ShopIdentityWrapper>
                  )}
                </AnimatePresence>
              </LogoSwapContainer>
            ) : (
              <motion.div layoutId="hanuut-logo-mobile">
                <Link to="/">
                  <Logo image={currentLogo} />
                </Link>
              </motion.div>
            )}
          </NavGroup>

          <NavGroup>
            {!isShopMode && (
              <DesktopMenu>
                {/* 1. Home / Ecosystem */}
                <MenuItem $textColor={textColor}>
                  <Link to="/" style={{ color: textColor }}>
                    {t("nav_ecosystem") || "Home"}
                  </Link>
                </MenuItem>
                
                {/* 2. E'SUUQ (Consumer) */}
                <MenuItem $textColor={textColor}>
                  <Link to="/esuuq" style={{ color: textColor }}>
                    {t("nav_esuuq") || "E'SUUQ"}
                  </Link>
                </MenuItem>

                {/* 3. My Hanuut (Business) */}
                <MenuItem $textColor={textColor}>
                  <Link to="/partners" style={{ color: textColor }}>
                    {t("navPartners")}
                  </Link>
                </MenuItem>

                {/* 4. Blog */}
                <MenuItem $textColor={textColor}>
                  <Link to="/blog" style={{ color: textColor }}>
                    {t("navBlog")}
                  </Link>
                </MenuItem>

                {/* 5. Track Order */}
                <MenuItem $textColor={textColor}>
                  <Link
                    to="/track"
                    style={{
                      color: textColor,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <FaTruck size={14} /> {t("navTrack")}
                  </Link>
                </MenuItem>
                <li>
                  <LanguagesDropDown textColor={textColor} />
                </li>
              </DesktopMenu>
            )}

            {isShopMode && cartQuantity > 0 && (
              <CartButton onClick={handleCartClick} $color={textColor}>
                <FaShoppingCart />
                <CartBadge>{cartQuantity}</CartBadge>
              </CartButton>
            )}

            {!isShopMode && (
              <HamburgerButton onClick={toggleMobileMenu}>
                <HamburgerIcon
                  $isOpen={isMobileMenuOpen}
                  $iconColor={textColor}
                />
              </HamburgerButton>
            )}

            {isShopMode && <LanguagesDropDown textColor={textColor} />}
          </NavGroup>
        </Navigation>
      </Section>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <Backdrop
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />
            <SidePanel
              $isOpen={isMobileMenuOpen}
              $isArabic={isArabic}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <PanelHeader>
                {isArabic ? (
                  <>
                    <HamburgerButton
                      style={{ zIndex: 1002 }}
                      onClick={toggleMobileMenu}
                    >
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 180 }}
                        transition={{ duration: 0.5 }}
                      >
                        <CloseIcon />
                      </motion.div>
                    </HamburgerButton>
                    <motion.div layoutId="hanuut-logo-mobile">
                      <Logo image={currentLogo} small />
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div layoutId="hanuut-logo-mobile">
                      <Logo image={currentLogo} small />
                    </motion.div>
                    <HamburgerButton
                      style={{ zIndex: 1002 }}
                      onClick={toggleMobileMenu}
                    >
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 180 }}
                        transition={{ duration: 0.5 }}
                      >
                        <CloseIcon />
                      </motion.div>
                    </HamburgerButton>
                  </>
                )}
                <RipplingGlow
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                />
              </PanelHeader>

              <SidePanelMenu
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <SidePanelItem variants={itemVariants}>
                  <Link to="/" onClick={closeMobileMenu}>
                    {t("nav_ecosystem") || "Home"}
                  </Link>
                </SidePanelItem>
                <SidePanelItem variants={itemVariants}>
                  <Link to="/esuuq" onClick={closeMobileMenu}>
                    {t("nav_esuuq") || "E'SUUQ"}
                  </Link>
                </SidePanelItem>
                <SidePanelItem variants={itemVariants}>
                  <Link to="/partners" onClick={closeMobileMenu}>
                    {t("navPartners")}
                  </Link>
                </SidePanelItem>
                <SidePanelItem variants={itemVariants}>
                  <Link to="/blog" onClick={closeMobileMenu}>
                    {t("navBlog")}
                  </Link>
                </SidePanelItem>
                <SidePanelItem variants={itemVariants}>
                  <Link to="/track" onClick={closeMobileMenu}>
                    {t("navTrack")}
                  </Link>
                </SidePanelItem>
                <SidePanelItem variants={itemVariants}>
                  <LanguagesDropDown handleChooseLanguage={closeMobileMenu} />
                </SidePanelItem>
              </SidePanelMenu>
            </SidePanel>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;