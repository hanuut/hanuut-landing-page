// components/Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaRoute,
  FaStore,
  FaShoppingBag,
  FaBriefcase,
  FaQuestionCircle,
  FaTruck,
} from "react-icons/fa";

import LanguagesDropDown from "./LanguagesDropDown";
import Logo from "./Logo";
import logoAr from "../assets/logo_ar.webp";
import logoEn from "../assets/logo_en.webp";
import abridhLogoAr from "../assets/abridh_logo.webp";
import abridhLogoEn from "../assets/abridh_logo.webp";

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
  transition: all 0.3s ease;
  background-color: ${({ $isScrolled, $isAbrid }) =>
    $isScrolled
      ? $isAbrid
        ? "rgba(255, 255, 255, 0.92)"
        : "rgba(28, 28, 30, 0.85)"
      : "transparent"};
  backdrop-filter: ${({ $isScrolled }) => ($isScrolled ? "blur(16px)" : "none")};
  -webkit-backdrop-filter: ${({ $isScrolled }) => ($isScrolled ? "blur(16px)" : "none")};
  border-bottom: 1px solid
    ${({ $isScrolled, $isAbrid }) =>
      $isScrolled
        ? $isAbrid
          ? "rgba(15, 23, 42, 0.08)"
          : "rgba(255, 255, 255, 0.1)"
        : "transparent"};
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

const NavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;

const AbridBrandLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #0f172a;
  font-family: var(--font-title, "Tajawal"), sans-serif;
  font-size: 1.45rem;
  font-weight: 900;
  letter-spacing: -0.5px;

  img {
    height: 32px;
    width: auto;
  }
`;

const CaptainPillBtn = styled.button`
  background: #00875f;
  color: #ffffff;
  padding: 0.65rem 1.4rem;
  border-radius: 9999px;
  border: none;
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(0, 135, 95, 0.25);

  &:hover {
    background: #006847;
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 135, 95, 0.35);
  }
`;

const EcosystemMenuBtn = styled.button`
  background: ${({ $isAbrid }) =>
    $isAbrid ? "#f1f5f9" : "rgba(255, 255, 255, 0.1)"};
  color: ${({ $isAbrid }) => ($isAbrid ? "#0f172a" : "#ffffff")};
  border: 1px solid
    ${({ $isAbrid }) =>
      $isAbrid ? "rgba(15, 23, 42, 0.1)" : "rgba(255, 255, 255, 0.15)"};
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.1rem;

  &:hover {
    background: ${({ $isAbrid }) =>
      $isAbrid ? "#e2e8f0" : "rgba(255, 255, 255, 0.2)"};
  }
`;

const MenuBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(8px);
  z-index: 1100;
`;

const DrawerPanel = styled(motion.div)`
  position: fixed;
  top: 0;
  ${(props) => (props.$isArabic ? "left: 0;" : "right: 0;")}
  width: 85%;
  max-width: 360px;
  height: 100vh;
  background: #ffffff;
  color: #0f172a;
  z-index: 1200;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  padding: 2rem 1.75rem;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 1.25rem;
  margin-bottom: 1.5rem;

  h3 {
    font-size: 1.2rem;
    font-weight: 800;
    margin: 0;
    color: #0f172a;
  }
`;

const DrawerClose = styled.button`
  background: #f1f5f9;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  &:hover {
    color: #0f172a;
  }
`;

const DrawerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
  overflow-y: auto;
`;

const DrawerItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  text-decoration: none;
  color: #334155;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.2s;

  &:hover {
    background: #f8fafc;
    color: #00875f;
    transform: ${(props) =>
      props.$isArabic ? "translateX(-4px)" : "translateX(4px)"};
  }

  .icon-wrap {
    color: #00875f;
    font-size: 1.1rem;
  }
`;

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const path = location.pathname;
  const isAbridMode = path.startsWith("/abrid");
  const isShopMode =
    /^(@[^/]+|shop\/[^/]+)/.test(path.substring(1)) ||
    path.startsWith("/auras");
  const isArabic = i18n.language === "ar";
  const currentLogo = isArabic ? logoAr : logoEn;
  const abridLogo = isArabic ? abridhLogoAr : abridhLogoEn;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isShopMode) return null;

  return (
    <>
      <Section $isScrolled={isScrolled} $isAbrid={isAbridMode}>
        <Navigation $isArabic={isArabic}>
          {/* LEFT: BRANDING */}
          <NavGroup>
            {isAbridMode ? (
              <AbridBrandLink to="/abridh">
                <img src={abridLogo} alt="Abrid Logo" />
                <span>{isArabic ? "أبـريـذ" : "Abrid"}</span>
              </AbridBrandLink>
            ) : (
              <Link to="/">
                <Logo image={currentLogo} />
              </Link>
            )}
          </NavGroup>

          {/* RIGHT: FOCUSED ACTIONS & EXPANDABLE MENU */}
          <NavGroup>
            {isAbridMode ? (
              <>
                {/* 🔴 ONLY SHOW CTA WHEN NOT ALREADY ON THE /drive REGISTRATION FORM */}
                {!path.includes("/drive") && (
                  <CaptainPillBtn onClick={() => navigate("/abridh/drive")}>
                    {t("abrid_btn_captain", "Devenir Capitaine")}
                  </CaptainPillBtn>
                )}
                <LanguagesDropDown textColor="#0F172A" />
                <EcosystemMenuBtn
                  $isAbrid={true}
                  onClick={() => setIsDrawerOpen(true)}
                  aria-label="Menu Ecosystem"
                >
                  <FaBars />
                </EcosystemMenuBtn>
              </>
            ) : (
              <>
                <LanguagesDropDown
                  textColor={isScrolled ? "#FFFFFF" : "#111217"}
                />
                <EcosystemMenuBtn
                  $isAbrid={false}
                  onClick={() => setIsDrawerOpen(true)}
                  aria-label="Menu Ecosystem"
                >
                  <FaBars />
                </EcosystemMenuBtn>
              </>
            )}
          </NavGroup>
        </Navigation>
      </Section>

      {/* SLIDE-OVER ECOSYSTEM DRAWER */}
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
              initial={{ x: isArabic ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: isArabic ? "-100%" : "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
            >
              <DrawerHeader>
                <h3>{t("ecosystem_title", "Écosystème Hanuut")}</h3>
                <DrawerClose onClick={() => setIsDrawerOpen(false)}>
                  <FaTimes />
                </DrawerClose>
              </DrawerHeader>

              <DrawerList>
                <DrawerItem
                  to="/abridh"
                  $isArabic={isArabic}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <span className="icon-wrap">
                    <FaRoute />
                  </span>
                  <span>{t("nav_abridh_brand", "Abrid (Mobilité)")}</span>
                </DrawerItem>

                <DrawerItem
                  to="/esuuq"
                  $isArabic={isArabic}
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
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <span className="icon-wrap">
                    <FaStore />
                  </span>
                  <span>{t("navPartners", "My Hanuut (Commerçants)")}</span>
                </DrawerItem>

                <DrawerItem
                  to="/careers"
                  $isArabic={isArabic}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <span className="icon-wrap">
                    <FaBriefcase />
                  </span>
                  <span>{t("navCareers", "Recrutement / Careers")}</span>
                </DrawerItem>

                <DrawerItem
                  to="/track"
                  $isArabic={isArabic}
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