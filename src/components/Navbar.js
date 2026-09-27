// src/components/Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaRoute,
  FaBriefcase,
  FaStore,
  FaShoppingBag,
  FaQuestionCircle,
  FaTruck,
} from "react-icons/fa";

import LanguagesDropDown from "./LanguagesDropDown";
import Logo from "./Logo";
import logoAr from "../assets/logo_ar.webp";
import logoEn from "../assets/logo_en.webp";
import abridhLogoAr from "../assets/abridh_logo.webp";
import abridhLogoEn from "../assets/abridh_logo.webp";

// --- TOP NAVBAR CONTAINER (FROSTED GLASS) ---
const Section = styled.section`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: ${(props) => props.theme.navHeight || "80px"};
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* Blurry & Translucent Background */
  ${(props) =>
    props.$isScrolled
      ? props.$isDark
        ? css`
            background-color: rgba(11, 15, 25, 0.75);
            backdrop-filter: blur(20px) saturate(160%);
            -webkit-backdrop-filter: blur(20px) saturate(160%);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
          `
        : css`
            background-color: rgba(255, 255, 255, 0.82);
            backdrop-filter: blur(20px) saturate(160%);
            -webkit-backdrop-filter: blur(20px) saturate(160%);
            border-bottom: 1px solid rgba(15, 23, 42, 0.08);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          `
      : css`
          background-color: transparent;
          border-bottom: 1px solid transparent;
        `}
`;

const Navigation = styled.nav`
  width: 90%;
  max-width: 1200px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const BrandGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const AbridBrandLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: ${(props) => (props.$isDark ? "#ffffff" : "#0f172a")};
  font-family: var(--font-title, "Tajawal"), sans-serif;
  font-size: 1.4rem;
  font-weight: 900;
  letter-spacing: -0.5px;
  transition: color 0.2s;

  img {
    height: 32px;
    width: auto;
  }
`;

// --- DIRECT NAV LINKS (OUT OF THE MENU) ---
const DirectNavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;

  @media (max-width: 640px) {
    gap: 0.35rem;
  }
`;

const TopNavLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  text-decoration: none;
  font-family: inherit;
  font-size: 0.92rem;
  font-weight: 700;
  padding: 0.55rem 1rem;
  border-radius: 9999px;
  transition: all 0.25s ease;
  white-space: nowrap;

  ${(props) =>
    props.$isActive
      ? props.$isAbridLink
        ? css`
            background: #00875f;
            color: #ffffff !important;
            box-shadow: 0 4px 14px rgba(0, 135, 95, 0.3);
          `
        : css`
            background: #2563eb;
            color: #ffffff !important;
            box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
          `
      : props.$isDark
        ? css`
            color: rgba(255, 255, 255, 0.85);
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.1);

            &:hover {
              background: rgba(255, 255, 255, 0.14);
              color: #ffffff;
              transform: translateY(-1px);
            }
          `
        : css`
            color: #1e293b;
            background: rgba(15, 23, 42, 0.04);
            border: 1px solid rgba(15, 23, 42, 0.08);

            &:hover {
              background: rgba(15, 23, 42, 0.09);
              color: #0f172a;
              transform: translateY(-1px);
            }
          `}

  svg {
    font-size: 0.85rem;
  }

  @media (max-width: 768px) {
    padding: 0.45rem 0.75rem;
    font-size: 0.82rem;

    span.label-text {
      display: ${(props) => (props.$hideOnMobileText ? "none" : "inline")};
    }
  }
`;

const CaptainPillBtn = styled.button`
  background: #2563eb;
  color: #ffffff;
  padding: 0.55rem 1.25rem;
  border-radius: 9999px;
  border: none;
  font-weight: 800;
  font-size: 0.9rem;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
  white-space: nowrap;

  &:hover {
    background: #1d4ed8;
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(37, 99, 235, 0.4);
  }

  @media (max-width: 768px) {
    display: none; /* Captain button is already top CTA on the /abridh page */
  }
`;

const ActionsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
`;

const EcosystemMenuBtn = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.1rem;

  ${(props) =>
    props.$isDark
      ? css`
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.15);
          &:hover {
            background: rgba(255, 255, 255, 0.18);
          }
        `
      : css`
          background: rgba(15, 23, 42, 0.05);
          color: #0f172a;
          border: 1px solid rgba(15, 23, 42, 0.1);
          &:hover {
            background: rgba(15, 23, 42, 0.12);
          }
        `}
`;

// --- BLURRY TRANSLUCENT SLIDE-OVER DRAWER ---
const MenuBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(8, 12, 22, 0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 1100;
`;

const DrawerPanel = styled(motion.div)`
  position: fixed;
  top: 0;
  bottom: 0;
  ${(props) => (props.$isArabic ? "left: 0;" : "right: 0;")}
  width: 85%;
  max-width: 360px;
  height: 100vh;
  z-index: 1200;
  box-shadow: ${(props) =>
    props.$isArabic
      ? "20px 0 50px rgba(0, 0, 0, 0.4)"
      : "-20px 0 50px rgba(0, 0, 0, 0.4)"};
  display: flex;
  flex-direction: column;
  padding: 2rem 1.75rem;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  /* Blurry Translucent Body */
  ${(props) =>
    props.$isDark
      ? css`
          background: rgba(15, 23, 42, 0.88);
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          border-${props.$isArabic ? "right" : "left"}: 1px solid rgba(255, 255, 255, 0.1);
          color: #ffffff;
        `
      : css`
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          border-${props.$isArabic ? "right" : "left"}: 1px solid rgba(15, 23, 42, 0.08);
          color: #0f172a;
        `}
`;

const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid
    ${(props) =>
      props.$isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.08)"};
  padding-bottom: 1.25rem;
  margin-bottom: 1.5rem;

  h3 {
    font-size: 1.15rem;
    font-weight: 800;
    margin: 0;
    color: ${(props) => (props.$isDark ? "#ffffff" : "#0f172a")};
  }
`;

const DrawerClose = styled.button`
  background: ${(props) =>
    props.$isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.06)"};
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${(props) => (props.$isDark ? "#cbd5e1" : "#64748b")};
  transition: all 0.2s;

  &:hover {
    color: ${(props) => (props.$isDark ? "#ffffff" : "#0f172a")};
    transform: scale(1.05);
  }
`;

const DrawerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  flex: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const DrawerItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.95rem;
  transition: all 0.2s ease;

  ${(props) =>
    props.$isDark
      ? css`
          color: #cbd5e1;
          &:hover {
            background: rgba(255, 255, 255, 0.08);
            color: #ffffff;
            transform: ${props.$isArabic
              ? "translateX(-4px)"
              : "translateX(4px)"};
          }
        `
      : css`
          color: #334155;
          &:hover {
            background: rgba(15, 23, 42, 0.05);
            color: #00875f;
            transform: ${props.$isArabic
              ? "translateX(-4px)"
              : "translateX(4px)"};
          }
        `}

  .icon-wrap {
    color: ${(props) => (props.$isDark ? "#38bdf8" : "#00875f")};
    font-size: 1.1rem;
    display: flex;
    align-items: center;
  }
`;

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const path = location.pathname;
  const isArabic = i18n.language === "ar";

  const isAbridMode = path.startsWith("/abrid");
  const isCareersMode = path.startsWith("/careers");

  // Shop / Studio Mode Hide Guard
  const isShopMode =
    /^(@[^/]+|shop\/[^/]+)/.test(path.substring(1)) ||
    path.startsWith("/auras");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- DYNAMIC CONTRAST DETECTION ---
  // Calculates whether the section directly beneath the navbar is dark or light
  const isDarkBackground = (() => {
    // 1. Pages that are completely dark theme
    const isDarkPage =
      path.startsWith("/partners") ||
      path.startsWith("/blog") ||
      path.startsWith("/track") ||
      path.startsWith("/boutique") ||
      path.startsWith("/epicerie") ||
      path.startsWith("/restaurant") ||
      path.startsWith("/aurasLab");

    if (isDarkPage) return true;

    // 2. /careers has a dark hero banner for the first ~420px of scroll
    if (isCareersMode) {
      return scrollY < 420;
    }

    // 3. /esuuq has dark ambient canvas background
    if (path.startsWith("/esuuq") && scrollY < 500) {
      return true;
    }

    // Default light pages: /, /abridh, /support, /privacy, /terms_and_conditions
    return false;
  })();

  const currentLogo = isArabic ? logoAr : logoEn;
  const abridLogo = isArabic ? abridhLogoAr : abridhLogoEn;
  const navTextColor = isDarkBackground ? "#FFFFFF" : "#0F172A";

  if (isShopMode) return null;

  return (
    <>
      <Section $isScrolled={isScrolled} $isDark={isDarkBackground}>
        <Navigation $isArabic={isArabic}>
          {/* BRAND / LOGO */}
          <BrandGroup>
            {isAbridMode ? (
              <AbridBrandLink to="/abridh" $isDark={isDarkBackground}>
                <img src={abridLogo} alt="Abrid Logo" />
                <span>{isArabic ? "أبـريـذ" : "Abrid"}</span>
              </AbridBrandLink>
            ) : (
              <Link to="/">
                <Logo image={currentLogo} />
              </Link>
            )}

            {/* DIRECT NAV BUTTONS: OUTSIDE THE HAMBURGER MENU */}
            <DirectNavLinks>
              {/* ABRIDH MOBILITY LINK */}
              <TopNavLink
                to="/abridh"
                $isActive={isAbridMode}
                $isAbridLink={true}
                $isDark={isDarkBackground}
              >
                <FaRoute />
                <span className="label-text">
                  {isArabic ? "أبريذ" : "Abrid"}
                </span>
              </TopNavLink>

              {/* CAREERS / RECRUITMENT LINK */}
              <TopNavLink
                to="/careers"
                $isActive={isCareersMode}
                $isAbridLink={false}
                $isDark={isDarkBackground}
              >
                <FaBriefcase />
                <span className="label-text">
                  {t("navCareers", isArabic ? "انضم إلينا" : "Recrutement")}
                </span>
              </TopNavLink>
            </DirectNavLinks>
          </BrandGroup>

          {/* ACTIONS GROUP */}
          <ActionsGroup>
            {/* Captain CTA when exploring mobility */}
            {isAbridMode && !path.includes("/drive") && (
              <CaptainPillBtn onClick={() => navigate("/abridh/drive")}>
                {t(
                  "abrid_btn_captain",
                  isArabic ? "كن كابتن" : "Devenir Capitaine",
                )}
              </CaptainPillBtn>
            )}

            {/* Multilingual Switcher with adaptive contrast */}
            <LanguagesDropDown textColor={navTextColor} />

            {/* Ecosystem Hamburger Drawer Button */}
            <EcosystemMenuBtn
              $isDark={isDarkBackground}
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Menu Ecosystem"
            >
              <FaBars />
            </EcosystemMenuBtn>
          </ActionsGroup>
        </Navigation>
      </Section>

      {/* BLURRY TRANSLUCENT SLIDE-OVER ECOSYSTEM DRAWER */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <MenuBackdrop
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
            />
            <DrawerPanel
              $isArabic={isArabic}
              $isDark={isDarkBackground}
              initial={{ x: isArabic ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: isArabic ? "-100%" : "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
            >
              <DrawerHeader $isDark={isDarkBackground}>
                <h3>
                  {t(
                    "ecosystem_title",
                    isArabic ? "منظومة حانووت" : "Écosystème Hanuut",
                  )}
                </h3>
                <DrawerClose
                  $isDark={isDarkBackground}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <FaTimes />
                </DrawerClose>
              </DrawerHeader>

              <DrawerList>
                <DrawerItem
                  to="/abridh"
                  $isArabic={isArabic}
                  $isDark={isDarkBackground}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <span className="icon-wrap">
                    <FaRoute />
                  </span>
                  <span>{t("nav_abridh_brand", "Abrid (Mobilité)")}</span>
                </DrawerItem>

                <DrawerItem
                  to="/careers"
                  $isArabic={isArabic}
                  $isDark={isDarkBackground}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <span className="icon-wrap">
                    <FaBriefcase />
                  </span>
                  <span>{t("navCareers", "Recrutement / Carrières")}</span>
                </DrawerItem>

                <DrawerItem
                  to="/esuuq"
                  $isArabic={isArabic}
                  $isDark={isDarkBackground}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <span className="icon-wrap">
                    <FaShoppingBag />
                  </span>
                  <span>{t("nav_esuuq", "eSUUQ (Marketplace)")}</span>
                </DrawerItem>

                <DrawerItem
                  to="/partners"
                  $isArabic={isArabic}
                  $isDark={isDarkBackground}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <span className="icon-wrap">
                    <FaStore />
                  </span>
                  <span>{t("navPartners", "My Hanuut (Commerçants)")}</span>
                </DrawerItem>

                <DrawerItem
                  to="/track"
                  $isArabic={isArabic}
                  $isDark={isDarkBackground}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <span className="icon-wrap">
                    <FaTruck />
                  </span>
                  <span>{t("navTrack", "Suivi de Commande")}</span>
                </DrawerItem>

                <DrawerItem
                  to="/support"
                  $isArabic={isArabic}
                  $isDark={isDarkBackground}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <span className="icon-wrap">
                    <FaQuestionCircle />
                  </span>
                  <span>{t("support_title", "Aide & Support")}</span>
                </DrawerItem>
              </DrawerList>
            </DrawerPanel>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
